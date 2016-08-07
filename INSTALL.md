# iOS Installation

1. In the XCode's `Project navigator`, right click on project's name ➜ `Add Files to <...>` 
![](https://www.dropbox.com/s/nmih1sc9hgygpvu/react-native-background-geolocation-install-1.png?dl=1)

1. Add **`node_modules/react-native-background-fetch/RNBackgroundFetch.xcodeproj`** ![](https://dl.dropboxusercontent.com/u/2319755/react-native-background-fetch/INSTALL/step3.png?dl=1)

1. Expand the project and drag/drop the file **`RNBackgroundFetch+AppDelegate.m`** and place the file to exist **in the same folder** as your app's **`AppDelegate.m`**.
![](https://dl.dropboxusercontent.com/u/2319755/react-native-background-fetch/INSTALL/step7.png?dl=1)

1. Select your project in the **`Project navigator`**. Click **`Build Phases`** then **`Link Binary With Libraries`**. Add **`libRNBackgroundFetch.a`** ![](https://dl.dropboxusercontent.com/u/2319755/react-native-background-fetch/INSTALL/step4.png?dl=1)

1. Add another item to **`Link Binary With Libraries`**, but click **`[Add Other...]`**.  Navigate to **`node_modules/react-native-background-fetch/ios/RNBackgroundFetch`**.  Add **`TSBackgroundFetch.framework`**. ![](https://dl.dropboxusercontent.com/u/2319755/react-native-background-fetch/INSTALL/step5.png?dl=1)

1. Select the root of your project.  Select **Capabilities** tab.  Enable **Background Modes** and enable the mode **`Background fetch`**.![](https://dl.dropboxusercontent.com/u/2319755/react-native-background-fetch/INSTALL/step6.png?dl=1)

1. **Framework Search Paths**.  I would hope this step wouldn't be necessary, but I don't see another way around it.  In order for your app to find **`TSBackgroundFetch.framework`**, it seems you have to tell Xcode where to find the framework.  Go to **Build Settings** and search for **"framework search path"**.  Add the following item to it (select **recursive**):  

**`$(PROJECT_DIR)/../node_modules/react-native-background-fetch/ios`** **[recursive]**

![](https://dl.dropboxusercontent.com/u/2319755/react-native-background-fetch/INSTALL/step8.png?dl=1)

You can now [import and build](README.md#example)