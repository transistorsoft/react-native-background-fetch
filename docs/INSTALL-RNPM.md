# iOS Installation with rnpm

```shell
npm install react-native-background-fetch --save
```

#### With React Native 0.27+

```shell
react-native link react-native-background-fetch
```

#### With older versions of React Native

You need [`rnpm`](https://github.com/rnpm/rnpm) (`npm install -g rnpm`)

```shell
rnpm link react-native-background-fetch
```

## XCode Configuration

### Build Phases ➜ Link Binary With Libraries

- Select your project in the **`Project navigator`**. Click **`Build Phases`** then **`Link Binary With Libraries`**

- BackgroundGeolocation includes a custom iOS frameworks.  This needs to added manually, unfortunately.
    - Click **`[Add Other...]`**.  
    - Navigate: **`node_modules/react-native-background-fetch/ios/RNBackgroundFetch`**.  
    - Add **`TSBackgroundFetch.framework`**. 

![](https://www.dropbox.com/s/qwk5ssc78fmqlxf/Screenshot%202016-09-22%2011.17.30.png?dl=1)

### Build Settings ➜ Framework Search Paths

- In order to the find the **`TSBackgroundFetch.framework`** you just added, you have to tell Xcode where it can find it:  
    - Go to **Build Settings** and search for **"framework search path"**.
    - Add the following path (select **recursive [v]**): 

```
    $(PROJECT_DIR)/../node_modules/react-native-background-fetch/ios
```

![](https://www.dropbox.com/s/6hwo0mk10q2dk71/Screenshot%202016-09-22%2008.49.04.png?dl=1)

### Configure Background Capabilities

- Select the root of your project.  Select **Capabilities** tab.  Enable **Background Modes** and enable the following mode:

- [x] Background fetch

![](https://dl.dropboxusercontent.com/u/2319755/react-native-background-fetch/INSTALL/step6.png?dl=1)

### BackgroundFetch AppDelegate extension

BackgroundFetch implements an `AppDelegate` method `didPerformFetchWithCompletionHandler`.  You must manually add this file to the same folder where your `AppDelegate.m` lives:

- Expand the **`RNBackgroundFetch`** project and drag/drop the file **`RNBackgroundFetch+AppDelegate.m`** and place the file to exist **in the same folder** as your app's **`AppDelegate.m`**.
![](https://dl.dropboxusercontent.com/u/2319755/react-native-background-fetch/INSTALL/step7.png?dl=1)


