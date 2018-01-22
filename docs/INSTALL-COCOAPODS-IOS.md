# iOS Installation with CocoaPods

```shell
$ npm install --save react-native-background-fetch
```

If you use already [CocoaPods](https://cocoapods.org/) in your react-native
project, you can also add the react-native-mapbox-gl project to your Podfile.

**NOTE** The path to `node_modules` depends on your Podfile location, whether in `{root}` of the react-native project (`node_modules`) or `{root}/ios` (`../node_modules`).  The following instructions assume `{root}/ios`

- In your `Podfile`, make sure that `platform :ios, '8.0'` is set to `8.0`
- Add the following Pod (**Including `React` if it's not already there**)

```Ruby
platform :ios, '8.0'

pod 'React', :path => '../node_modules/react-native'
pod 'RNBackgroundFetch', :path => '../node_modules/react-native-background-fetch'
```

- Install the new CocoaPods dependency with:

```Bash
$ pod install
```

## XCode Configuration

- Open your `App.xcworkspace`

### Configure Background Capabilities

- Select the root of your project.  Select **Capabilities** tab.  Enable **Background Modes** and enable the following modes:

- [x] Background fetch

![](https://dl.dropboxusercontent.com/u/2319755/react-native-background-fetch/INSTALL/step6.png?dl=1)

### BackgroundFetch AppDelegate extension

BackgroundFetch implements an `AppDelegate` method `didPerformFetchWithCompletionHandler`.  You must manually add this file to the same folder where your `AppDelegate.m` lives:

- Right click your app's root folder.  Select **`Add files to...`**.  Select **Other**.
![](https://www.dropbox.com/s/gpsmz1ul1wyrhrs/Screenshot%202016-09-21%2016.17.35.png?dl=1)

- Browse to **`{YourApp}/node_modules/react-native-background-fetch/ios/RNBackgroundFetch`**.  
- Add the file **`RNBackgroundFetch+AppDelegate.m`**:
![](https://www.dropbox.com/s/uvi6nlx6xrl13fa/Screenshot%202016-09-21%2016.20.42.png?dl=1)

## Troubleshooting with CocoaPods

Because react-native is only available as npm module (and not as "regular"
CocoaPods dependency, see [v0.13 release notes](https://github.com/facebook/react-native/releases/tag/v0.13.0)
for more informations).

So it is required that you import react-native also from a local path.
Ensure that you include `React` before you include `react-native-background-fetch` in
your `Podfile`. Here is a complete working example if you want add your Podfile
in the project root while your generated Xcode project is still in the `ios`
folder:

```Ruby
platform :ios, '8.0'

pod 'React', :path => '../node_modules/react-native'
pod 'RNBackgroundFetch', :path => '../node_modules/react-native-background-fetch'
```#

