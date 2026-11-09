# Releasing

`react-native-background-fetch` is published by GitHub Actions
(`.github/workflows/release.yml`) when a version tag is pushed. npm trusts that workflow
through **Trusted Publishing** (OIDC), so no npm token exists anywhere, and every release
carries **provenance**: a signed record of the repository, commit and workflow that built it.
The Capacitor and Cordova background-fetch plugins release the same way, as do the
background-geolocation plugins.

## A release

```bash
npm run release -- prepare 4.4.3   # branch chore/release-4.4.3: version, dated CHANGELOG, preflight
# merge chore/release-4.4.3 into master
npm run release -- tag 4.4.3       # on master: tag the merge (lightweight, like every earlier tag)
git push origin master 4.4.3       # the tag starts the workflow
```

`prepare` releases the CHANGELOG's `## Unreleased` section, which must hold at least one
`* ` entry, as `## 4.4.3 &mdash; <today>`. It runs from an up-to-date master and refuses a
version that is not greater than package.json's, or is already on npm.

A release branch prepared by hand before these scripts: merge it into master (its CHANGELOG
heading back to `## Unreleased`) and delete it; `prepare` keeps the version it set, dates the
CHANGELOG and refuses a version already on npm.

The workflow checks (the tag equals `package.json`'s version; `scripts/preflight.sh --release`:
the Expo plugin build, the packed tarball's contents and what changed since the version on npm,
a strict consumer compile, a CHANGELOG heading for the version), then publishes. What ships is
decided by `.npmignore`: 4.4.2 shipped 149 files of a local `android/build/`, which it now
excludes and preflight refuses. The Expo plugin's build (`expo/plugin/build/`, which
`app.plugin.js` requires) is not tracked: `prepublishOnly` builds it, and preflight refuses a
tarball without it. A prerelease such as `4.5.0-beta.1` is published under the `beta`
dist-tag, so `latest` only moves to a release.

Releases come from master, and every one becomes `latest`. A patch to an older line (the
`legacy` dist-tag, 4.2.x) is not something these scripts or the workflow handle: pushing
such a tag would move `latest` backwards.

`npm run preflight` (without `-- --release`) is safe to run at any time; it publishes nothing.
Never add a `version`, `preversion` or `postversion` script: `release -- prepare` runs
`npm version`, which would run them.

Publishing is only the npm half. The native SDK the podspec, `ios/Package.swift` and
`android/build.gradle` require (`TSBackgroundFetch` / `com.transistorsoft:tsbackgroundfetch`)
must already be released, or an install fails to resolve it.

## A release that failed

Fix the cause, then re-run from the Actions tab: **release → Run workflow → Use workflow
from → Tags → the version**. The workflow refuses to run on a branch, and skips the publish
if that version is already on npm. A version can be published once, ever: if a bad tag was
pushed, delete it and release the next patch version rather than re-using the number.

## Checking a release

- The package page on npmjs.com shows a provenance badge linking to the workflow run. npm
  shows the new version as "validating" for a few minutes before it serves it.
- `npm audit signatures`, in a project that depends on the package, verifies it.

## One-time setup

On npmjs.com, the package's **Settings → Trusted Publisher → GitHub Actions**:
organization `transistorsoft`, repository `react-native-background-fetch`, workflow
`release.yml`, environment blank (GitHub Environments are not available on this org's
plan, and the registration and the workflow must agree). **Publishing access**: "Require
two-factor authentication and disallow bypass 2fa tokens". GitHub needs nothing: no secrets,
no environment.

Provenance also requires `package.json`'s `repository.url` to name this repository over
https (`git+https://github.com/transistorsoft/react-native-background-fetch.git`); npm
rejects a publish whose provenance and `repository` disagree.
