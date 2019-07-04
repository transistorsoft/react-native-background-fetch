# CHANGELOG

## [2.6.1] &mdash; 2019-07-04
- [Added] New `react-native.config.js` wanted by `react-native > 0.60.0`.  https://github.com/react-native-community/cli/blob/master/docs/dependencies.md

## [2.6.0] &mdash; 2019-05-30
- [Added] Added extra Android `JobInfo` constraints `requiredNetworkType`, `requiresCharing`, `requiresBatteryNotLow`, `requiresStorageNotLow`, `requiresDeviceIdle`.
- [Fixed] Merge PR [transistor-background-fetch](https://github.com/transistorsoft/transistor-background-fetch/pull/4)
- [Fixed] Merge PR [transistor-background-fetch](https://github.com/transistorsoft/transistor-background-fetch/pull/2)

## [2.5.6] &mdash; 2019-05-09
- [Fixed] Monkey patch xcode npm module to ignore case in `findPBXGroupKeyAndType`.  Some projects physical folder name might be "foo" but the XCode group-name might be "Foo".

## [2.5.5] &mdash; 2019-05-09
- [Fixed] react-native link script failed for Expo apps.  Failed to find projectGroup by name.  Finds it by path or name now.

## [2.5.4] &mdash; 2019-04-18
- [Fixed] Windows issue in new react-native link script for Android

## [2.5.3] &mdash; 2019-04-15
- [Added] Added android implementation for `react-native link` script to automatically add the required `maven url`.  No more extras steps required &mdash; simply:  `react-native link react-native-background-fetch`.

## [2.5.2] &mdash; 2019-04-10
- [Fixed] Fixed `react-native link` scripts to detect when installing into an app already configured for Cocoapods.

## [2.5.1] &mdash; 2019-02-27
- [Changed] Remove unnecessary gradle directive `buildToolsVersion`.

## [2.5.0] &mdash; 2019-02-07
- [Changed] Use updated gradle method `implementation` instead of deprecated `compile`.

## [2.4.6] &mdash; 2019-01-11
- [Added] Android:  Double check that app isn't in foreground before executing headless task (thanks to @macgregorT).

## [2.4.5] &mdash; 2018-11-28
- [Fixed] Wrap Android HeadlessTask executor in try/catch to swallow errors if run while app is in foreground.

## [2.4.4] &mdash; 2018-10-29
- [Fixed] react-native link scripts for Windows (PR #114)
- [Added] Typescript definitions.

## [2.4.3] &mdash; 2018-05-23
- [Fixed] Fix link error when iOS and npm project name are diferent
- [Fixed] Clear event-listeners when `#configure` is called.  When used with `react-native-background-geolocation` in "Headless Mode", this plugin could accumulate event-listeners with each reboot after terminate.
- [Added] Add convenience method `BackgroundGeolocation#registerHeadlessTask`, to be used instead of `AppRegistry#registerHeadlessTask`.

## [2.4.2] &mdash; 2018-05-07
- [Added] Implement ability to provide `UIBackgroundFetchResult` to `#finish` rather than hard-coded `UIBackgroundFetchResultNewData`

## [2.4.1] &mdash; 2018-03-18
- [Fixed] react-native link was broken for iOS due to unused aggregate target.  Remove unused targets.

## [2.4.0] &mdash; 2018-02-27
- [Changed] The Android library `tsbackgroundfetch.aar` has be composed as a *Maven* repository.  The installation procedure has changed slightly now and `flatDirs` has been replaced with a `maven url`.  See the corresponding installation docs for more information.
- [Changed] Android will check for *application-wide configuration properties* `buildSdkVersion`, `buildToolsVersion`, `targetSdkVersion`.  See the Wiki "Solving Android Gradle Conflicts" for more information.

## [2.3.0] &mdash; 2018-01-22
- [Added] Android implementation using `JobScheduler` / `AlarmManager`

