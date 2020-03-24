# CHANGELOG

## [3.0.4] &mdash; 2020-03-24
* [Fixed] [iOS] Fixed bug calling `start` after executing `stop`.

## [3.0.3] &mdash; 2020-02-21
* [Fixed] [Android] `stopOnTerminate: false` not cancelling scheduled job / Alarm when fired task fired after terminate.

## [3.0.2] &mdash; 2020-02-20
* [Android] Fix Android NPE on `hasTaskId` when launched first time after upgrading to v3

## [3.0.1] &mdash; 2020-02-20

* [iOS] It's no longer necessary to __`registerAppRefreshTask`__ and __`registerBGProcessingTask`__  in `AppDelegate.m` The SDK now reads the App `.plist` and automatically registers those tasks found in  *"Permitted background task scheduler identifiers"*, offering one simple setup method `didFinishLaunching`:  Make the following change to your `AppDelegate.m`:

```diff
#import <TSBackgroundFetch/TSBackgroundFetch.h>

@implementation AppDelegate

(BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions {
   .
   .
   .
   // [react-native-background-fetch Setup] -- One easy step now:
+  [[TSBackgroundFetch sharedInstance] didFinishLaunching];

-  TSBackgroundFetch *fetch = [TSBackgroundFetch sharedInstance];
-  // [REQUIRED] Register for usual periodic background refresh events here:
-  [fetch registerAppRefreshTask];

-  // [OPTIONAL] IF you've registered custom "Background Processing Task(s)" in your Info.plist above,
-  // for use with #scheduleTask method, register each of those taskId(s) here as well.
-  [fetch registerBGProcessingTask:@"com.foo.customtask"];

   return YES;
}
```


## [3.0.0] &mdash; 2020-02-17
* [Fixed] Android - Incorrect event signature for method stop (not receiving success, failure callbacks)
* [Fixed] iOS - Missing native implementation for method scheduleTask.
* [Changed] Bumped 2.8.0 to 3.0.0 to better flag this version for breaking changes.

* [Added] [Android] New option `forceAlarmManager` for bypassing `JobScheduler` mechanism in favour of `AlarmManager` for more precise scheduling task execution.
* [Changed] Migrate iOS deprecated "background-fetch" API to new [BGTaskScheduler](https://developer.apple.com/documentation/backgroundtasks/bgtaskscheduler?language=objc).  See new required steps in iOS Setup.
* [Added] Added new `BackgroundFetch.scheduleTask` method for scheduling custom "onehot" and periodic tasks in addition to the default fetch-task.

```javascript
BackgroundFetch.configure({
  minimumFetchInterval: 15,
  stopOnTerminate: false
}, (taskId) => {  // <-- [NEW] taskId provided to Callback
  console.log("[BackgroundFetch] taskId: ", taskId);
  switch(taskId) {
    case 'foo':
      // Handle scheduleTask 'foo'
      break;
    default:
      // Handle default fetch event.
      break;
  }
  BackgroundFetch.finish(taskId);  // <-- [NEW] Provided taskId to #finish method.
});

// This event will end up in Callback provided to #configure above.
BackgroundFetch.scheduleTask({
  taskId: 'foo',  //<-- required
  delay: 60000,
  periodic: false
});
```

## Breaking Changes
* With the introduction of ability to execute custom tasks via `#scheduleTask`, all tasks are executed in the Callback provided to `#configure`.  As a result, this Callback is now provided an argument `String taskId`.  This `taskId` must now be provided to the `#finish` method, so that the SDK knows *which* task is being `#finish`ed.

```javascript
BackgroundFetch.configure({
  minimumFetchInterval: 15,
  stopOnTerminate: false
), (taskId) => {  // <-- [NEW] taskId provided to Callback
  console.log("[BackgroundFetch] taskId: ", taskId);
  BackgroundFetch.finish(taskId);  // <-- [NEW] Provided taskId to #finish method.
});
```

And with the Headless Task, as well:
```javascript
let backgroundFetchHeadlessTask = async (event) => {  // <-- 1.  Headless task receives {}
  // Get taskId from event {}:
  let taskId = event.taskId;
  console.log("[BackgroundFetch] Headless event received: ", taskId);

  BackgroundFetch.finish(taskId);  // <-- 2.  #finish with taskId here as well.
}

BackgroundFetch.registerHeadlessTask(backgroundFetchHeadlessTask);

```

## [2.7.1] &mdash; 2019-10-06
- [Fixed] Resolve StrictMode violations; typically from accessing SharedPreferences on main-thread.

## [2.7.0] &mdash; 2019-08-16
- [Added] Auto-linking support for `react-native >= 0.60`.  See the *Auto-linking* setup in the README for more information.

:warning: If you have a previous version of **`react-native-background-fetch < 2.7.0`** installed into **`react-native >= 0.60`**, you should first `unlink` your previous version as `react-native link` is no longer required.

```bash
$ react-native unlink react-native-background-fetch
```

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

