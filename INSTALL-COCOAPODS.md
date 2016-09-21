# Installation process with CocoaPods

If you use already [CocoaPods](https://cocoapods.org/) in your react-native
project, you can also add the react-native-mapbox-gl project to your Podfile.

**NOTE** The path to `node_modules` depends on your Podfile location, whether in `{root}` of the react-native project (`node_modules`) or `{root}/ios` (`../node_modules`).  The following instructions assume `{root}/ios`

1. Run `npm install --save react-native-background-fetch`
2. In your `Podfile`, make sure that `platform :ios, '8.0'` is set to `8.0`
3. Ensure you have the Pod `pod React', :path => '../node_modules/react-native'`
3. Add `pod 'RNBackgroundFetch', :path => '../node_modules/react-native-background-fetch/ios'`
```Ruby
pod 'React', :path => '../node_modules/react-native'
pod 'RNBackgroundFetch', :path => '../node_modules/
```

4. Open your Xcode project and ensure that the "Build Settings" parameter
   "Other linker flags" (`OTHER_LDFLAGS`) contains the CocoaPods generated
   linker options!
   * If you have used `react-native init` to setup your project you can just
     remove this parameter. Just select the line and press the Delete key.
   * Alternative, if you setup your Xcode project yourself, ensure that the
     parent configuration was included with a `$(inherited)` variable.
5. Install the new CocoaPods dependency with `pod install`.  
   This command must not have output any warning. ;)
6. Open `YourProject.xcworkspace`.  Select the root of your project.  Select **Capabilities** tab.  Enable **Background Modes** and enable the mode **`Background fetch`**.![](https://dl.dropboxusercontent.com/u/2319755/react-native-background-fetch/INSTALL/step6.png?dl=1)

## Troubleshooting with CocoaPods

Because react-native is only available as npm module (and not as "regular"
CocoaPods dependency, see [v0.13 release notes](https://github.com/facebook/react-native/releases/tag/v0.13.0)
for more informations).

So it is required that you import react-native also from a local path.
Ensure that you include `React` before you include `react-native-background-fetch` in
your `Podfile`. Here is a complete working example if you want add your Podfile
in the project root while your generated Xcode project is still in the `ios`
folder:

```ruby
source 'https://github.com/CocoaPods/Specs.git'

pod 'React', :path => '../node_modules/react-native'
pod 'RNBackgroundFetch', :path => '../node_modules/react-native-background-fetch/ios'
```

