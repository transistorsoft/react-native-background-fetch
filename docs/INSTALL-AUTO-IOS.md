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


## Configure `Info.plist`
1.  Open your `Info.plist` and add the key *"Permitted background task scheduler identifiers"*

![](https://dl.dropboxusercontent.com/s/t5xfgah2gghqtws/ios-setup-permitted-identifiers.png?dl=1)

2.  Add the **required identifier `com.transistorsoft.fetch`**.

![](https://dl.dropboxusercontent.com/s/kwdio2rr256d852/ios-setup-permitted-identifiers-add.png?dl=1)

3.  If you intend to execute your own custom tasks via **`BackgroundFetch.scheduleTask`**, you must add those custom identifiers as well.  For example, if you intend to execute a custom **`taskId: 'com.transistorsoft.customtask'`**, you must add the identifier **`com.transistorsoft.customtask`** to your *"Permitted background task scheduler identifiers"*, as well.

:warning: A task identifier must be prefixed with `com.transistorsoft.`.

```javascript
BackgroundFetch.scheduleTask({
  taskId: 'com.transistorsoft.customtask',
  delay: 60 * 60 * 1000  //  In one hour (milliseconds)
});
```

## `AppDelegate`

:open_file_folder: __`AppDelegate.swift`__:

```diff
import Foundation
import UIKit
+import TSBackgroundFetch

@UIApplicationMain
class AppDelegate: RCTAppDelegate {

  func application(application: UIApplication, didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?) -> Bool {
    .
    .
    .
+   // [REQUIRED] Register BackgroundFetch
+   TSBackgroundFetch.sharedInstance().didFinishLaunching();
+    return self.application(application, didFinishLaunchingWithOptions: launchOptions);
+  }

+  // [optional] to simulate fetch events in simulator with XCode->Debug->Simulate Background Fetch
+  func application(
+      _ application: UIApplication,
+      performFetchWithCompletionHandler completionHandler: @escaping (UIBackgroundFetchResult) -> Void
+    ) {
+      TSBackgroundFetch.sharedInstance().perform(completionHandler: completionHandler, applicationState: application.applicationState)
+  }
+}
```

#### Or for older apps not yet using `Swift`:

:open_file_folder: __`AppDelegate.m`__

```diff
#import "AppDelegate.h"

#import <React/RCTBridge.h>
#import <React/RCTBundleURLProvider.h>
#import <React/RCTRootView.h>

// IMPORTANT:  Paste import ABOVE any DEBUG macros
+#import <TSBackgroundFetch/TSBackgroundFetch.h>

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
