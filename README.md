| <img src="https://dl.dropbox.com/s/gxl3sr8znhkrtah/expo-logo.png?dl=1" alt="alt text" width="32" /> | Now with *Expo* support |
| --- | --- |

react-native-background-fetch &middot; [![npm](https://img.shields.io/npm/dm/react-native-background-fetch.svg)]() [![npm](https://img.shields.io/npm/v/react-native-background-fetch.svg)]()
==============================================================================

[![](https://dl.dropboxusercontent.com/s/nm4s5ltlug63vv8/logo-150-print.png?dl=1)](https://www.transistorsoft.com)

By [**Transistor Software**](http://transistorsoft.com), creators of [**React Native Background Geolocation**](http://www.transistorsoft.com/shop/products/react-native-background-geolocation)

------------------------------------------------------------------------------

Background Fetch is a *very* simple plugin which attempts to awaken an app in the background about **every 15 minutes**, providing a short period of background running-time.  This plugin will execute your provided `callbackFn` whenever a background-fetch event occurs.

There is **no way** to increase the rate which a fetch-event occurs and this plugin sets the rate to the most frequent possible &mdash; you will **never** receive an event faster than **15 minutes**.  The operating-system will automatically throttle the rate the background-fetch events occur based upon usage patterns.  Eg: if user hasn't turned on their phone for a long period of time, fetch events will occur less frequently or if an iOS user disables background refresh they may not happen at all.

:new: Background Fetch now provides a [__`scheduleTask`__](#executing-custom-tasks) method for scheduling arbitrary "one-shot" or periodic tasks.

### iOS
- There is **no way** to increase the rate which a fetch-event occurs and this plugin sets the rate to the most frequent possible &mdash; you will **never** receive an event faster than **15 minutes**.  The operating-system will automatically throttle the rate the background-fetch events occur based upon usage patterns.  Eg: if user hasn't turned on their phone for a long period of time, fetch events will occur less frequently.
- [__`scheduleTask`__](#executing-custom-tasks) seems only to fire when the device is plugged into power.
- ⚠️ When your app is **terminated**, iOS *no longer fires events* &mdash; There is *no such thing* as **`stopOnTerminate: false`** for iOS.
- iOS can take *days* before Apple's machine-learning algorithm settles in and begins regularly firing events.  Do not sit staring at your logs waiting for an event to fire.  If your [*simulated events*](#debugging) work, that's all you need to know that everything is correctly configured.
- If the user doesn't open your *iOS* app for long periods of time, *iOS* will **stop firing events**.

### Android
- The Android plugin provides a [HeadlessJS](https://reactnative.dev/docs/headless-js-android) implementation allowing you to continue handling events even after app-termination (see **[`@config enableHeadless`](#config-boolean-enableheadless-false)**)

-------------------------------------------------------------

# Contents
- ### :books: [API Documentation](#api-documentation)
  - [Config](#config)
  - [Methods](#methods)
- ### [Installing the Plugin](#installing-the-plugin)
- ### [Setup Guides](#setup-guides)
  - [iOS Setup](#ios-setup)
  - [Android Setup](#android-setup)
- ### [Example](#example)
- ### [Debugging](#debugging)

-------------------------------------------------------------

## Installing the plugin

### With *Expo*

```bash
$ npx expo install react-native-background-fetch
```

### With `yarn`

```bash
$ yarn add react-native-background-fetch
```

### With `npm`
```bash
$ npm install --save react-native-background-fetch
```

## Setup Guides

### *Expo* Setup

- [Expo Setup](docs/INSTALL-EXPO.md)

### iOS Setup

- [Auto-linking Setup](docs/INSTALL-AUTO-IOS.md)

### Android Setup

- [Auto-linking Setup](docs/INSTALL-AUTO-ANDROID.md)

## Example ##

:information_source: This repo contains its own *Example App*.  See [`/example`](./example/README.md)

```javascript
import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  FlatList,
  StatusBar,
} from 'react-native';

import {
  Header,
  Colors
} from 'react-native/Libraries/NewAppScreen';

import BackgroundFetch from "react-native-background-fetch";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      events: []
    };
  }

  componentDidMount() {
    // Initialize BackgroundFetch ONLY ONCE when component mounts.
    this.initBackgroundFetch();
  }

  async initBackgroundFetch() {
    // BackgroundFetch event handler.
    const onEvent = async (taskId) => {
      console.log('[BackgroundFetch] task: ', taskId);
      // Do your background work...
      await this.addEvent(taskId);
      // IMPORTANT:  You must signal to the OS that your task is complete.
      BackgroundFetch.finish(taskId);
    }

    // Timeout callback is executed when your Task has exceeded its allowed running-time.
    // You must stop what you're doing immediately BackgroundFetch.finish(taskId)
    const onTimeout = async (taskId) => {
      console.warn('[BackgroundFetch] TIMEOUT task: ', taskId);
      BackgroundFetch.finish(taskId);
    }

    // Initialize BackgroundFetch only once when component mounts.
    let status = await BackgroundFetch.configure({minimumFetchInterval: 15}, onEvent, onTimeout);

    console.log('[BackgroundFetch] configure status: ', status);
  }

  // Add a BackgroundFetch event to <FlatList>
  addEvent(taskId) {
    // Simulate a possibly long-running asynchronous task with a Promise.
    return new Promise((resolve, reject) => {
      this.setState(state => ({
        events: [...state.events, {
          taskId: taskId,
          timestamp: (new Date()).toString()
        }]
      }));
      resolve();
    });
  }

  render() {
    return (
      <>
        <StatusBar barStyle="dark-content" />
        <SafeAreaView>
          <ScrollView
            contentInsetAdjustmentBehavior="automatic"
            style={styles.scrollView}>
            <Header />

            <View style={styles.body}>
              <View style={styles.sectionContainer}>
                <Text style={styles.sectionTitle}>BackgroundFetch Demo</Text>
              </View>
            </View>
          </ScrollView>
          <View style={styles.sectionContainer}>
            <FlatList
              data={this.state.events}
              renderItem={({item}) => (<Text>[{item.taskId}]: {item.timestamp}</Text>)}
              keyExtractor={item => item.timestamp}
            />
          </View>
        </SafeAreaView>
      </>
    );
  }
}

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: Colors.lighter,
  },
  body: {
    backgroundColor: Colors.white,
  },
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: Colors.black,
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
    color: Colors.dark,
  },
});

export default App;
```

### Executing Custom Tasks

In addition to the default background-fetch task defined by `BackgroundFetch.configure`, you may also execute your own arbitrary "oneshot" or periodic tasks (iOS requires additional [Setup Instructions](#iOS-Setup)).  However, all events will be fired into the Callback provided to **`BackgroundFetch#configure`**:

### ⚠️ iOS:
- `scheduleTask` on *iOS* seems only to run when the device is plugged into power.
- `scheduleTask` on *iOS* are designed for *low-priority* tasks, such as purging cache files &mdash; they tend to be **unreliable for mission-critical tasks**.  `scheduleTask` will *never* run as frequently as you want.
- The default `fetch` event is much more reliable and fires far more often.
- `scheduleTask` on *iOS* stop when the *user* terminates the app.  There is no such thing as `stopOnTerminate: false` for *iOS*.

```javascript
// Step 1:  Configure BackgroundFetch as usual.
let status = await BackgroundFetch.configure({
  minimumFetchInterval: 15
}, async (taskId) => {  // <-- Event callback
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
}, async (taskId) => {  // <-- Task timeout callback
  // This task has exceeded its allowed running-time.
  // You must stop what you're doing and immediately .finish(taskId)
  BackgroundFetch.finish(taskId);
});

// Step 2:  Schedule a custom "oneshot" task "com.foo.customtask" to execute 5000ms from now.
BackgroundFetch.scheduleTask({
  taskId: "com.foo.customtask",
  forceAlarmManager: true,
  delay: 5000  // <-- milliseconds
});
```

# API Documentation

## Config

### Common Options

#### `@param {Integer} minimumFetchInterval [15]`

The minimum interval in **minutes** to execute background fetch events.  Defaults to **`15`** minutes.  **Note**:  Background-fetch events will **never** occur at a frequency higher than **every 15 minutes**.  Apple uses a secret algorithm to adjust the frequency of fetch events, presumably based upon usage patterns of the app.  Fetch events *can* occur less often than your configured `minimumFetchInterval`.

#### `@param {Integer} delay (milliseconds)`

:information_source: Valid only for `BackgroundFetch.scheduleTask`.  The minimum number of milliseconds in future that task should execute.

#### `@param {Boolean} periodic [false]`

:information_source: Valid only for `BackgroundFetch.scheduleTask`.  Defaults to `false`.  Set true to execute the task repeatedly.  When `false`, the task will execute **just once**.

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
let status = await BackgroundFetch.configure({
  minimumFetchInterval: 15,
  forceAlarmManager: true
}, async (taskId) => {  // <-- Event callback
  console.log("[BackgroundFetch] taskId: ", taskId);
  BackgroundFetch.finish(taskId);
}, async (taskId) => {  // <-- Task timeout callback
  // This task has exceeded its allowed running-time.
  // You must stop what you're doing and immediately .finish(taskId)
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

Set `true` to enable React Native's [Headless JS](https://reactnative.dev/docs/headless-js-android) mechanism, for handling fetch events after app termination.

* :open_file_folder: **`index.js`** (**MUST BE IN `index.js`**):
```javascript
import BackgroundFetch from "react-native-background-fetch";

let MyHeadlessTask = async (event) => {
  // Get task id from event {}:
  let taskId = event.taskId;
  let isTimeout = event.timeout;  // <-- true when your background-time has expired.
  if (isTimeout) {
    // This task has exceeded its allowed running-time.
    // You must stop what you're doing immediately finish(taskId)
    console.log('[BackgroundFetch] Headless TIMEOUT:', taskId);
    BackgroundFetch.finish(taskId);
    return;
  }
  console.log('[BackgroundFetch HeadlessTask] start: ', taskId);

  // Perform an example HTTP request.
  // Important:  await asychronous tasks when using HeadlessJS.
  let response = await fetch('https://reactnative.dev/movies.json');
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

If your job doesn't need a network connection, you don't need to use this option as the default value is `BackgroundFetch.NETWORK_TYPE_NONE`.

| NetworkType                           | Description                                                         |
|---------------------------------------|---------------------------------------------------------------------|
| `BackgroundFetch.NETWORK_TYPE_NONE`     | This job doesn't care about network constraints, either any or none.|
| `BackgroundFetch.NETWORK_TYPE_ANY`      | This job requires network connectivity.                             |
| `BackgroundFetch.NETWORK_TYPE_CELLULAR` | This job requires network connectivity that is a cellular network.  |
| `BackgroundFetch.NETWORK_TYPE_UNMETERED` | This job requires network connectivity that is unmetered. Most WiFi networks are unmetered, as in "you can upload as much as you like". |
| `BackgroundFetch.NETWORK_TYPE_NOT_ROAMING` | This job requires network connectivity that is not roaming (being outside the country of origin) |

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

This state is a loose definition provided by the system. In general, it means that the device is not currently being used interactively, and has not been in use for some time. As such, it is a good time to perform resource heavy jobs. Bear in mind that battery usage will still be attributed to your application, and shown to the user in battery stats.

-----------------------------------------------------------------------------------------------------

## Methods

| Method Name | Arguments | Returns | Notes
|---|---|---|---|
| `configure` | `{FetchConfig}`, `callbackFn`, `timeoutFn` | `Promise<BackgroundFetchStatus>` | Configures the plugin's `callbackFn` and `timeoutFn`.  This callback will fire each time a background-fetch event occurs in addition to events from `#scheduleTask`.  The `timeoutFn` will be called when the OS reports your task is nearing the end of its allowed background-time. |
| `scheduleTask` | `{TaskConfig}` | `Promise<boolean>` | Executes a custom task.  The task will be executed in the same `Callback` function provided to `#configure`. |
| `status` | `callbackFn` | `Promise<BackgroundFetchStatus>` | Your callback will be executed with the current `status (Integer)` `0: Restricted`, `1: Denied`, `2: Available`.  These constants are defined as `BackgroundFetch.STATUS_RESTRICTED`, `BackgroundFetch.STATUS_DENIED`, `BackgroundFetch.STATUS_AVAILABLE` (**NOTE:** Android will always return `STATUS_AVAILABLE`)|
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

#### Simulating task-timeout events

- Only the new `BGTaskScheduler` api supports *simulated* task-timeout events.  To simulate a task-timeout, your `fetchCallback` must not call `BackgroundFetch.finish(taskId)`:

```javascript
let status = await BackgroundFetch.configure({
  minimumFetchInterval: 15
}, async (taskId) => {  // <-- Event callback.
  // This is the task callback.
  console.log("[BackgroundFetch] taskId", taskId);
  //BackgroundFetch.finish(taskId); // <-- Disable .finish(taskId) when simulating an iOS task timeout
}, async (taskId) => {  // <-- Event timeout callback
  // This task has exceeded its allowed running-time.
  // You must stop what you're doing and immediately .finish(taskId)
  print("[BackgroundFetch] TIMEOUT taskId:", taskId);
  BackgroundFetch.finish(taskId);
});
```

- Now simulate an iOS task timeout as follows, in the same manner as simulating an event above:
```obj-c
e -l objc -- (void)[[BGTaskScheduler sharedScheduler] _simulateExpirationForTaskWithIdentifier:@"com.transistorsoft.fetch"]
```

#### Old `BackgroundFetch` API
- Simulate background fetch events in XCode using **`Debug->Simulate Background Fetch`**
- iOS can take some hours or even days to start a consistently scheduling background-fetch events since iOS schedules fetch events based upon the user's patterns of activity.  If *Simulate Background Fetch* works, you can be **sure** that everything is working fine.  You just need to wait.

### Android

- Observe plugin logs in `$ adb logcat`:
```bash
$ adb logcat *:S ReactNative:V ReactNativeJS:V TSBackgroundFetch:V
```
- Simulate a background-fetch event on a device (insert *&lt;your.application.id&gt;*) (only works for sdk `21+`:
```bash
$ adb shell cmd jobscheduler run -f <your.application.id> 999
```

- Simulating `scheduleTask` events:
1. Observe `adb logcat` for the `registerTask` log-entry and copy the `jobId`.

```
// from adb logcat *:S TSBackgroundFetch
TSBackgroundFetch: - registerTask: com.your.package.name (jobId: -359368280) <--
```

```
2. Now paste that `jobId` from logcat into the `adb shell` command to simulate a `JobScheduler` event:
```bash
$ adb shell cmd jobscheduler run -f com.your.package.name -359368280
```

- For devices with sdk `<21`, simulate a "Headless JS" event with (insert *&lt;your.application.id&gt;*)
```bash
$ adb shell am broadcast -a <your.application.id>.event.BACKGROUND_FETCH

```

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
