react-native-background-fetch Example App
============================================================

# Installation

1. Clone this repo

```
$ git clone <url>
$ cd example
$ yarn install
$ react-native run-android
$ react-native run-ios
```

:warning: __iOS__: Test on a real device.  The new iOS 13 `BGTaskScheduler` API does not work on Simulators.

# Simulating Events

## iOS

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

## Android

- Observe plugin logs in `$ adb logcat`:
```bash
$ adb logcat *:S ReactNative:V ReactNativeJS:V TSBackgroundFetch:V
```

- Simulate a background-fetch event on a device (insert *&lt;your.application.id&gt;*) (only works for sdk `21+`:
```bash
$ ./scripts/simulate-fetch
```

