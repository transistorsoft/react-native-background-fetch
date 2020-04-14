# iOS Auto-linking Setup
### `react-native >= 0.60`

### With `yarn`

```bash
$ yarn add react-native-background-fetch
```

### With `npm`
```bash
$ npm install --save react-native-background-fetch
```

## `pod install`

```bash
$ cd ios
$ pod install
```

## Configure Background Capabilities

- Select the root of your project.  Select **Capabilities** tab.  Enable **Background Modes** and enable the following mode:

- [x] Background fetch
- [x] Background processing (:new: __iOS 13+__; Only if you intend to use `BackgroundFetch.scheduleTask`)

![](https://dl.dropboxusercontent.com/s/9vik5kxoklk63ob/ios-setup-background-modes.png?dl=1)


## Configure `Info.plist` (:new: __iOS 13+__)
1.  Open your `Info.plist` and add the key *"Permitted background task scheduler identifiers"*

![](https://dl.dropboxusercontent.com/s/t5xfgah2gghqtws/ios-setup-permitted-identifiers.png?dl=1)

2.  Add the **required identifier `com.transistorsoft.fetch`**.

![](https://dl.dropboxusercontent.com/s/kwdio2rr256d852/ios-setup-permitted-identifiers-add.png?dl=1)

3.  If you intend to execute your own custom tasks via **`BackgroundFetch.scheduleTask`**, you must add those custom identifiers as well.  For example, if you intend to execute a custom **`taskId: 'com.transistorsoft.customtask'`**, you must add the identifier **`com.transistorsoft.customtask`** to your *"Permitted background task scheduler identifiers"*, as well.

:warning: A task identifier can be any string you wish, but it's a good idea to prefix them now with `com.transistorsoft.` &mdash;  In the future, the `com.transistorsoft` prefix **may become required**.

```javascript
BackgroundFetch.scheduleTask({
  taskId: 'com.transistorsoft.customtask',
  delay: 60 * 60 * 1000  //  In one hour (milliseconds)
});
```

## `AppDelegate.m` (:new: __iOS 13+__)

The [**`BGTaskScheduler`**](https://developer.apple.com/documentation/backgroundtasks/bgtaskscheduler?language=objc) API introduced in iOS 13 requires special setup:

```diff
#import "AppDelegate.h"

#import <React/RCTBridge.h>
#import <React/RCTBundleURLProvider.h>
#import <React/RCTRootView.h>

// IMPORTANT:  Paste import ABOVE the DEBUG macro 
+#import <TSBackgroundFetch/TSBackgroundFetch.h>

#if DEBUG
.
. ///////////////////////////////////////////////////////////////////////////////////
. // IMPORTANT:  DO NOT paste import within DEBUG macro or archiving will fail!!!
. ///////////////////////////////////////////////////////////////////////////////////
.
#endif

@implementation AppDelegate

(BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions {
  .
  .
  .
+ // [REQUIRED] Register BackgroundFetch
+ [[TSBackgroundFetch sharedInstance] didFinishLaunching];

  return YES;
}
```


## BackgroundFetch AppDelegate extension

:warning: Deprecated iOS Background Fetch API for devices running __`< iOS 13`__.

BackgroundFetch implements an `AppDelegate` method `didPerformFetchWithCompletionHandler`.  You must manually add this file to the same folder where your `AppDelegate.m` lives:

- In the XCode's **`Project navigator`**, right click on project's name ➜ **`Add Files to <...>`**.
- **`node_modules/react-native-background-fetch/ios/RNBackgroundFetch/RNBackgroundFetch+AppDelegate.m`**.

![](https://dl.dropbox.com/s/rwn8kyo8fgdn57u/autolinking-step1.png?dl=1)

**`node_modules/react-native-background-fetch/ios/RNBackgroundFetch/RNBackgroundFetch+AppDelegate.m`**
![](https://dl.dropbox.com/s/r4f564giaz257fw/autolinking-step2.png?dl=1)


