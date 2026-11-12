#!/usr/bin/env bash
# Everything worth checking before a release — run by scripts/release.sh and by the
# release workflow, and safe to run any time.
#
#   scripts/preflight.sh             build, pack, and compile a consumer against the tarball
#   scripts/preflight.sh --release   also: CHANGELOG has a heading for this version
#
# The tarball is shaped by .npmignore alone, and a local build leaks into it: 4.4.2 shipped
# 149 files of android/build/ and .yarnignore. The Expo plugin is built into a gitignored
# expo/plugin/build/ that app.plugin.js requires, so a clean checkout that skips the build
# ships an app.plugin.js that cannot load. Builds nothing it keeps beyond that, publishes
# nothing; it reads the registry only to compare file lists.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
WORK="$(mktemp -d)"
trap 'rm -rf "$WORK"' EXIT
RELEASE=0
[ "${1:-}" = "--release" ] && RELEASE=1

GREEN=$'\033[0;32m'; RED=$'\033[0;31m'; DIM=$'\033[2m'; RESET=$'\033[0m'
ok()   { echo "  ${GREEN}✓${RESET} $1"; }
fail() { echo "  ${RED}✗${RESET} $1" >&2; exit 1; }
step() { echo; echo "${DIM}── $1${RESET}"; }

cd "$ROOT"
NAME="$(node -p "require('./package.json').name")"
VERSION="$(node -p "require('./package.json').version")"

step "1. version"
echo "$VERSION" | grep -Eq '^[0-9]+\.[0-9]+\.[0-9]+(-[0-9A-Za-z.-]+)?$' || fail "package.json version '$VERSION' is not semver"
if [ "$RELEASE" = 1 ]; then
  # The first `## ` heading must be this version: an `## Unreleased` above it means the
  # notes were never given a version.
  first="$(grep -m1 '^## ' CHANGELOG.md || true)"
  case "$first" in
    "## $VERSION "*|"## [$VERSION] "*) ok "$NAME@$VERSION — CHANGELOG: $first" ;;
    *) fail "CHANGELOG's first heading is '$first', not '## $VERSION …' — run npm run release -- prepare" ;;
  esac
else
  ok "$NAME@$VERSION"
fi

step "2. build"
npm run -s build >"$WORK/build.log" 2>&1 || { cat "$WORK/build.log" >&2; fail "npm run build (the Expo plugin)"; }
ok "expo/plugin/build rebuilt"

step "3. the tarball"
# Its own directory: the version on npm, packed below, has the same file name whenever
# package.json still says the released version, and would overwrite this one, so step 4
# would install and test what is already on npm instead of this build.
mkdir -p "$WORK/pack" "$WORK/npm"
npm pack --silent --pack-destination "$WORK/pack" >/dev/null || fail "npm pack"
TARBALL="$(ls "$WORK"/pack/*.tgz)"
tar -tzf "$TARBALL" | sort > "$WORK/contents"
# What a React Native app needs: the module and its typings, the codegen spec, the Expo
# config plugin and the build app.plugin.js loads, and the native halves (CocoaPods, SwiftPM
# app mode, Gradle).
for want in package/package.json package/index.js package/index.d.ts package/src/NativeBackgroundFetch.ts \
            package/app.plugin.js package/expo/plugin/build/index.js package/RNBackgroundFetch.podspec \
            package/ios/Package.swift package/android/build.gradle; do
  grep -qx "$want" "$WORK/contents" || fail "the tarball has no $want"
done
grep -q '^package/android/src/' "$WORK/contents" || fail "the tarball has no android/src/"
grep -q '^package/ios/RNBackgroundFetch/' "$WORK/contents" || fail "the tarball has no ios/RNBackgroundFetch/"
bad="$(grep -E '^package/(\.github|scripts|example|docs|node_modules|expo/plugin/src|android/build)/|/\.(gradle|settings)/|^package/(RELEASING\.md|\.yarnignore)$' "$WORK/contents" || true)"
[ -z "$bad" ] || fail "the tarball carries what it should not (.npmignore): $(echo "$bad" | head -3 | tr '\n' ' ')"
ok "$(basename "$TARBALL") — $(wc -l < "$WORK/contents" | tr -d ' ') files"
# Against the version on npm now: files that vanish or appear are worth a look before
# they ship. Printed, not enforced — a deliberate change is fine.
PREV="$(npm view "$NAME" dist-tags.latest 2>/dev/null || true)"
if [ -n "$PREV" ] && (cd "$WORK/npm" && npm pack --silent "$NAME@$PREV" >/dev/null 2>&1); then
  tar -tzf "$WORK"/npm/*.tgz | sort > "$WORK/previous"
  gone="$(comm -23 "$WORK/previous" "$WORK/contents" | sed 's#^package/##')"
  new="$(comm -13 "$WORK/previous" "$WORK/contents" | sed 's#^package/##')"
  ok "against $PREV on npm: $(echo -n "$gone" | grep -c . || true) gone, $(echo -n "$new" | grep -c . || true) new"
  [ -z "$gone" ] || echo "$gone" | head -10 | sed 's/^/      - /'
  [ -z "$new" ] || echo "$new" | head -10 | sed 's/^/      + /'
else
  echo "  ${DIM}(no published version to compare with)${RESET}"
fi

step "4. a consumer compiles against it"
# The typings re-export @transistorsoft/background-fetch-types (a dependency), so no
# react-native is needed to compile; index.js requires react-native at runtime, which only an
# app can supply. The repo's own TypeScript (4.x) predates bundler resolution: the consumer
# brings its own.
mkdir -p "$WORK/consumer" && cd "$WORK/consumer"
echo '{"name": "consumer", "private": true}' > package.json
npm install --silent --no-audit --no-fund "$TARBALL" "typescript@^5" >/dev/null || fail "npm install of the tarball"
cat > index.ts <<'TS'
import BackgroundFetch from "react-native-background-fetch";
import type { BackgroundFetchConfig, BackgroundFetchStatus, HeadlessEvent, TaskConfig } from "react-native-background-fetch";

const config: BackgroundFetchConfig = {
  minimumFetchInterval: 15,
  stopOnTerminate: false,
  enableHeadless: true,
  requiredNetworkType: BackgroundFetch.NETWORK_TYPE_ANY,
};
export async function start(): Promise<boolean> {
  const status: BackgroundFetchStatus = await BackgroundFetch.configure(
    config,
    async (taskId: string) => BackgroundFetch.finish(taskId),
    (taskId: string) => BackgroundFetch.finish(taskId),
  );
  const task: TaskConfig = { taskId: "com.transistorsoft.task", delay: 5000, periodic: false };
  await BackgroundFetch.scheduleTask(task);
  return status === BackgroundFetch.STATUS_AVAILABLE;
}
BackgroundFetch.registerHeadlessTask(async (event: HeadlessEvent) => {
  BackgroundFetch.finish(event.taskId);
});
TS
for mode in "node16 node16" "esnext bundler"; do
  set -- $mode
  ./node_modules/.bin/tsc --strict --noEmit --skipLibCheck false --target es2020 --lib es2020,dom \
    --module "$1" --moduleResolution "$2" index.ts \
    || fail "a strict consumer does not compile under moduleResolution $2"
done
ok "strict TypeScript compiles under node16 and bundler resolution"

echo
echo "${GREEN}preflight passed${RESET} — $NAME@$VERSION"
