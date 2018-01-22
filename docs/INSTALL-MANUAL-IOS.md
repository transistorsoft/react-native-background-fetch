# iOS Manual Installation

- `npm install react-native-background-fetch --save`

- In the XCode's **`Project navigator`**, right click on project's name ➜ **`Add Files to <...>`** 
![](https://dl.dropboxusercontent.com/s/nmih1sc9hgygpvu/react-native-background-geolocation-install-1.png?dl=1)

- Add **`node_modules/react-native-background-fetch/ios/RNBackgroundFetch.xcodeproj`** 
![](https://dl.dropboxusercontent.com/s/2fb8u9m59vzb3tk/step3.png?dl=1)

## Build Phases ➜ Link Binary With Libraries

- Select your project in the **`Project navigator`**. Click **`Build Phases`** then **`Link Binary With Libraries`**. Add the following static library: 
- **`libRNBackgroundFetch.a`**.
![](https://dl.dropboxusercontent.com/s/2977uvmdpavv4fn/step4.png?dl=1)

- BackgroundGeolocation includes custom iOS framework.  This needs to be added manually, unfortunately.
    - Click **`[Add Other...]`**.  
    - Navigate: **`node_modules/react-native-background-fetch/ios/RNBackgroundFetch`**.  
    - Add **`TSBackgroundFetch.framework`**. 
![](https://dl.dropboxusercontent.com/s/bjzlgfa34rnev1v/step5.png?dl=1)

## Build Settings ➜ Framework Search Paths

- In order to the find the **`TSBackgroundFetch.framework`** you just added, you have to tell Xcode where it can find it:  
    - Go to **Build Settings** and search for **"framework search path"**.
    - Add the following paths (select **recursive [v]**): 

```
$(PROJECT_DIR)/../node_modules/react-native-background-fetch/ios
```

![](https://dl.dropboxusercontent.com/s/4smmcpk021gl10u/step8.png?dl=1)

## Configure Background Capabilities

- Select the root of your project.  Select **Capabilities** tab.  Enable **Background Modes** and enable the following mode:

- [x] Background fetch

![](https://dl.dropboxusercontent.com/s/9f86qcx6l4v1muj/step6.png?dl=1)

## BackgroundFetch AppDelegate extension

BackgroundFetch implements an `AppDelegate` method `didPerformFetchWithCompletionHandler`.  You must manually add this file to the same folder where your `AppDelegate.m` lives:

- Expand the **`RNBackgroundFetch`** project and drag/drop the file **`RNBackgroundFetch+AppDelegate.m`** and place the file to exist **in the same folder** as your app's **`AppDelegate.m`**.
![](https://dl.dropboxusercontent.com/s/2n614ns4w8hbf30/step7.png?dl=1)

You can now [import and build](../README.md#example)
