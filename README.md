react-native-background-fetch &middot; [![npm](https://img.shields.io/npm/dm/react-native-background-fetch.svg)]() [![npm](https://img.shields.io/npm/v/react-native-background-fetch.svg)]()
==============================================================================

[![](https://dl.dropboxusercontent.com/s/nm4s5ltlug63vv8/logo-150-print.png?dl=1)](https://www.transistorsoft.com)

By [**Transistor Software**](http://transistorsoft.com), creators of [**React Native Background Geolocation**](http://www.transistorsoft.com/shop/products/react-native-background-geolocation)

------------------------------------------------------------------------------

Background Fetch is a *very* simple plugin which will awaken an app in the background about **every 15 minutes**, providing a short period of background running-time.  This plugin will execute your provided `callbackFn` whenever a background-fetch event occurs.

There is **no way** to increase the rate which a fetch-event occurs and this plugin sets the rate to the most frequent possible &mdash; you will **never** receive an event faster than **15 minutes**.  The operating-system will automatically throttle the rate the background-fetch events occur based upon usage patterns.  Eg: if user hasn't turned on their phone for a long period of time, fetch events will occur less frequently.

:new: Background Fetch now provides a [__`scheduleTask`__](#executing-custom-tasks) method for scheduling arbitrary "one-shot" or periodic tasks.

### iOS
- There is **no way** to increase the rate which a fetch-event occurs and this plugin sets the rate to the most frequent possible &mdash; you will **never** receive an event faster than **15 minutes**.  The operating-system will automatically throttle the rate the background-fetch events occur based upon usage patterns.  Eg: if user hasn't turned on their phone for a long period of time, fetch events will occur less frequently.
- [__`scheduleTask`__](#executing-custom-tasks) seems only to fire when the device is plugged into power.

### Android
- The Android plugin provides a [HeadlessJS](https://facebook.github.io/react-native/docs/headless-js-android.html) implementation allowing you to continue handling events even after app-termination (see **[`@config enableHeadless`](#config-boolean-enableheadless-false)**)



## Installing the plugin

-------------------------------------------------------------

:warning: If you have a previous version of **`react-native-background-fetch < 2.7.0`** installed into **`react-native >= 0.60`**, you should first `unlink` your previous version as `react-native link` is no longer required.

```bash
$ react-native unlink react-native-background-fetch
```

-------------------------------------------------------------

### With `yarn`

```bash
$ yarn add react-native-background-fetch
```

### With `npm`
```bash
$ npm install --save react-native-background-fetch
```


## iOS Setup

### `react-native >= 0.60`
- [Auto-linking Setup](docs/INSTALL-AUTO-IOS.md)

### `react-native < 0.60`
- [`react-native link` Setup](docs/INSTALL-LINK-IOS.md)
- [Cocoapods Setup](docs/INSTALL-COCOAPODS-IOS.md)
- [Manual Setup](docs/INSTALL-MANUAL-IOS.md)

## Android Setup

### `react-native >= 0.60`
- [Auto-linking Setup](docs/INSTALL-AUTO-ANDROID.md)

### `react-native < 0.60`
- [`react-native link` Setup](docs/INSTALL-LINK-ANDROID.md)
- [Manual Setup](docs/INSTALL-MANUAL-ANDROID.md)

## Example ##

:information_source: This repo contains its own *Example App*.  See [`/example`](./example/README.md)

```javascript

import BackgroundFetch from "react-native-background-fetch";

export default class App extends Component {
  componentDidMount() {
    // Configure it.
    BackgroundFetch.configure({
      minimumFetchInterval: 15,     // <-- minutes (15 is minimum allowed)
      // Android options
      forceAlarmManager: false,     // <-- Set true to bypass JobScheduler.
      stopOnTerminate: false,
      startOnBoot: true,
      requiredNetworkType: BackgroundFetch.NETWORK_TYPE_NONE, // Default
      requiresCharging: false,      // Default
      requiresDeviceIdle: false,    // Default
      requiresBatteryNotLow: false, // Default
      requiresStorageNotLow: false  // Default
    }, async (taskId) => {
      console.log("[js] Received background-fetch event: ", taskId);
      // Required: Signal completion of your task to native code
      // If you fail to do this, the OS can terminate your app
      // or assign battery-blame for consuming too much background-time
      BackgroundFetch.finish(taskId);
    }, (error) => {
      console.log("[js] RNBackgroundFetch failed to start");
    });

    // Optional: Query the authorization status.
    BackgroundFetch.status((status) => {
      switch(status) {
        case BackgroundFetch.STATUS_RESTRICTED:
          console.log("BackgroundFetch restricted");
          break;
        case BackgroundFetch.STATUS_DENIED:
          console.log("BackgroundFetch denied");
          break;
        case BackgroundFetch.STATUS_AVAILABLE:
          console.log("BackgroundFetch is enabled");
          break;
      }
    });
  }
};
```

### Executing Custom Tasks

In addition to the default background-fetch task defined by `BackgroundFetch.configure`, you may also execute your own arbitrary "oneshot" or periodic tasks (iOS requires additional [Setup Instructions](#iOS-Setup)).  However, all events will be fired into the Callback provided to **`BackgroundFetch#configure`**:

__:warning: iOS__:  Custom iOS tasks seem only to run while device is plugged into power.  Hopefully Apple changes this in the future.

```javascript
// Step 1:  Configure BackgroundFetch as usual.
BackgroundFetch.configure({
  minimumFetchInterval: 15
}, async (taskId) => {
  // This is the fetch-event callback.
  console.log("[BackgroundFetch] taskId: ", taskId);

  // Use a switch statement to route task-handling.
  switch (taskId) {
    case 'com.foo.customtask':
      print("Received custom task");
      break;
    default:
      print("Default fetch task");
  }
  // Finish, providing received taskId.
  BackgroundFetch.finish(taskId);
});

// Step 2:  Schedule a custom "oneshot" task "com.foo.customtask" to execute 5000ms from now.
BackgroundFetch.scheduleTask({
  taskId: "com.foo.customtask",
  forceAlarmManager: true,
  delay: 5000  // <-- milliseconds
});
```

## Config

### Common Options

#### `@param {Integer} minimumFetchInterval [15]`

The minimum interval in **minutes** to execute background fetch events.  Defaults to **`15`** minutes.  **Note**:  Background-fetch events will **never** occur at a frequency higher than **every 15 minutes**.  Apple uses a secret algorithm to adjust the frequency of fetch events, presumably based upon usage patterns of the app.  Fetch events *can* occur less often than your configured `minimumFetchInterval`.

#### `@param {Integer} delay (milliseconds)`

:information_source: Valid only for `BackgroundGeolocation.scheduleTask`.  The minimum number of milliseconds in future that task should execute.

#### `@param {Boolean} periodic [false]`

:information_source: Valid only for `BackgroundGeolocation.scheduleTask`.  Defaults to `false`.  Set true to execute the task repeatedly.  When `false`, the task will execute **just once**.

### Android Options

#### `@config {Boolean} stopOnTerminate [true]`

Set `false` to continue background-fetch events after user terminates the app.  Default to `true`.

#### `@config {Boolean} startOnBoot [false]`

Set `true` to initiate background-fetch events when the device is rebooted.  Defaults to `false`.

:exclamation: **NOTE:** `startOnBoot` requires `stopOnTerminate: false`.

#### `@config {Boolean} forceAlarmManager [false]`

By default, the plugin will use Android's `JobScheduler` when possible.  The `JobScheduler` API prioritizes for battery-life, throttling task-execution based upon device usage and battery level.

Configuring `forceAlarmManager: true` will bypass `JobScheduler` to use Android's older `AlarmManager` API, resulting in more accurate task-execution at the cost of **higher battery usage**.

```javascript
BackgroundFetch.configure({
  minimumFetchInterval: 15,
  forceAlarmManager: true
}, async (taskId) => {
  console.log("[BackgroundFetch] taskId: ", taskId);
  BackgroundFetch.finish(taskId);
});
.
.
.
// And with with #scheduleTask
BackgroundFetch.scheduleTask({
  taskId: 'com.foo.customtask',
  delay: 5000,       // milliseconds
  forceAlarmManager: true,
  periodic: false
});
```

#### `@config {Boolean} enableHeadless [false]`

Set `true` to enable React Native's [Headless JS](https://facebook.github.io/react-native/docs/headless-js-android.html) mechanism, for handling fetch events after app termination.

* :open_file_folder: **`index.js`**
```javascript
import BackgroundFetch from "react-native-background-fetch";

let MyHeadlessTask = async (event) => {
  // Get task id from event {}:
  let taskId = event.taskId;
  console.log('[BackgroundFetch HeadlessTask] start: ', taskId);

  // Perform an example HTTP request.
  // Important:  await asychronous tasks when using HeadlessJS.
  let response = await fetch('https://facebook.github.io/react-native/movies.json');
  let responseJson = await response.json();
  console.log('[BackgroundFetch HeadlessTask] response: ', responseJson);

  // Required:  Signal to native code that your task is complete.
  // If you don't do this, your app could be terminated and/or assigned
  // battery-blame for consuming too much time in background.
  BackgroundFetch.finish(taskId);
}

// Register your BackgroundFetch HeadlessTask
BackgroundFetch.registerHeadlessTask(MyHeadlessTask);
```


#### `@config {integer} requiredNetworkType [BackgroundFetch.NETWORK_TYPE_NONE]`

Set basic description of the kind of network your job requires.

If your job doesn't need a network connection, you don't need use this options as the default value is `BackgroundFetch.NETWORK_TYPE_NONE`.

| NetworkType                           | Description                                                         |
|---------------------------------------|---------------------------------------------------------------------|
| `BackgroundFetch.NETWORK_TYPE_NONE`     | This job doesn't care about network constraints, either any or none.|
| `BackgroundFetch.NETWORK_TYPE_ANY`      | This job requires network connectivity.                             |
| `BackgroundFetch.NETWORK_TYPE_CELLULAR` | This job requires network connectivity that is a cellular network.  |
| `BackgroundFetch.NETWORK_TYPE_UNMETERED` | This job requires network connectivity that is unmetered.          |
| `BackgroundFetch.NETWORK_TYPE_NOT_ROAMING` | This job requires network connectivity that is not roaming.      |

#### `@config {Boolean} requiresBatteryNotLow [false]`

Specify that to run this job, the device's battery level must not be low.

This defaults to false. If true, the job will only run when the battery level is not low, which is generally the point where the user is given a "low battery" warning.

#### `@config {Boolean} requiresStorageNotLow [false]`

Specify that to run this job, the device's available storage must not be low.

This defaults to false. If true, the job will only run when the device is not in a low storage state, which is generally the point where the user is given a "low storage" warning.

#### `@config {Boolean} requiresCharging [false]`

Specify that to run this job, the device must be charging (or be a non-battery-powered device connected to permanent power, such as Android TV devices). This defaults to false.

#### `@config {Boolean} requiresDeviceIdle [false]`

When set true, ensure that this job will not run if the device is in active use.

The default state is false: that is, the for the job to be runnable even when someone is interacting with the device.

This state is a loose definition provided by the system. In general, it means that the device is not currently being used interactively, and has not been in use for some time. As such, it is a good time to perform resource heavy jobs. Bear in mind that battery usage will still be attributed to your application, and surfaced to the user in battery stats.

-----------------------------------------------------------------------------------------------------

## Methods

| Method Name | Arguments | Returns | Notes
|---|---|---|---|
| `configure` | `{FetchConfig}`, `callbackFn`, `failureFn` | `Void` | Configures the plugin's `callbackFn`.  This callback will fire each time an iOS background-fetch event occurs (typically every 15 min) in addition to events from `#scheduleTask`.  The `failureFn` will be called if the device doesn't support background-fetch. |
| `scheduleTask` | `{TaskConfig}` | `Promise<boolean>` | Executes a custom task.  The task will be executed in the same `Callback` function provided to `#configure`. |
| `status` | `callbackFn` | `Void` (TODO: Should return `Promise`) | Your callback will be executed with the current `status (Integer)` `0: Restricted`, `1: Denied`, `2: Available`.  These constants are defined as `BackgroundFetch.STATUS_RESTRICTED`, `BackgroundFetch.STATUS_DENIED`, `BackgroundFetch.STATUS_AVAILABLE` (**NOTE:** Android will always return `STATUS_AVAILABLE`)|
| `finish` | `String taskId` | `Void` | You **MUST** call this method in your `callbackFn` provided to `#configure` in order to signal to the OS that your task is complete.  iOS provides **only** 30s of background-time for a fetch-event -- if you exceed this 30s, iOS will kill your app. |
| `start` | `none` | `Promise<BackgroundFetchStatus>` | Start the background-fetch API.  Your `callbackFn` provided to `#configure` will be executed each time a background-fetch event occurs.  **NOTE** the `#configure` method *automatically* calls `#start`.  You do **not** have to call this method after you `#configure` the plugin |
| `stop` | `[taskId:String]` | `Promise<boolean>` | Stop the background-fetch API and all `#scheduleTask` from firing events.  Your `callbackFn` provided to `#configure` will no longer be executed. If you provide an optional `taskId`, only that `#scheduleTask` will be stopped.|



## Debugging

### iOS

#### :new: `BGTaskScheduler` API for iOS 13+

- :warning: At the time of writing, the new task simulator does not yet work in Simulator; Only real devices.
- See Apple docs [Starting and Terminating Tasks During Development](https://developer.apple.com/documentation/backgroundtasks/starting_and_terminating_tasks_during_development?language=objc)
- After running your app in XCode, Click the `[||]` button to initiate a *Breakpoint*.
- In the console `(lldb)`, paste the following command (**Note:**  use cursor up/down keys to cycle through previously run commands):
```obj-c
e -l objc -- (void)[[BGTaskScheduler sharedScheduler] _simulateLaunchForTaskWithIdentifier:@"com.transistorsoft.fetch"]
```
- Click the `[ > ]` button to continue.  The task will execute and the Callback function provided to **`BackgroundFetch.configure`** will receive the event.


![](https://dl.dropboxusercontent.com/s/zr7w3g8ivf71u32/ios-simulate-bgtask-pause.png?dl=1)

![](https://dl.dropboxusercontent.com/s/87c9uctr1ka3s1e/ios-simulate-bgtask-paste.png?dl=1)

![](https://dl.dropboxusercontent.com/s/bsv0avap5c2h7ed/ios-simulate-bgtask-play.png?dl=1)

#### Old `BackgroundFetch` API
- Simulate background fetch events in XCode using **`Debug->Simulate Background Fetch`**
- iOS can take some hours or even days to start a consistently scheduling background-fetch events since iOS schedules fetch events based upon the user's patterns of activity.  If *Simulate Background Fetch* works, your can be **sure** that everything is working fine.  You just need to wait.

### Android

- Observe plugin logs in `$ adb logcat`:
```bash
$ adb logcat *:S ReactNative:V ReactNativeJS:V TSBackgroundFetch:V
```
- Simulate a background-fetch event on a device (insert *&lt;your.application.id&gt;*) (only works for sdk `21+`:
```bash
$ adb shell cmd jobscheduler run -f <your.application.id> 999
```
- For devices with sdk `<21`, simulate a "Headless JS" event with (insert *&lt;your.application.id&gt;*)
```bash
$ adb shell am broadcast -a <your.application.id>.event.BACKGROUND_FETCH

```

## Implementation

### iOS

Implements [performFetchWithCompletionHandler](https://developer.apple.com/library/ios/documentation/UIKit/Reference/UIApplicationDelegate_Protocol/Reference/Reference.html#//apple_ref/occ/intfm/UIApplicationDelegate/application:performFetchWithCompletionHandler:), firing a custom event subscribed-to in cordova plugin.

### Android

Android implements background fetch using two different mechanisms, depending on the Android SDK version.  Where the SDK version is `>= LOLLIPOP`, the new [`JobScheduler`](https://developer.android.com/reference/android/app/job/JobScheduler.html) API is used.  Otherwise, the old [`AlarmManager`](https://developer.android.com/reference/android/app/AlarmManager.html) will be used.

Unlike iOS, the Android implementation *can* continue to operate after application terminate (`stopOnTerminate: false`) or device reboot (`startOnBoot: true`).

## Licence

The MIT License

Copyright (c) 2013 Chris Scott, Transistor Software <chris@transistorsoft.com>
http://transistorsoft.com

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
