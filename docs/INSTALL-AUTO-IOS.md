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

![](https://dl.dropboxusercontent.com/s/9f86qcx6l4v1muj/step6.png?dl=1)

## BackgroundFetch AppDelegate extension

BackgroundFetch implements an `AppDelegate` method `didPerformFetchWithCompletionHandler`.  You must manually add this file to the same folder where your `AppDelegate.m` lives:

- In the XCode's **`Project navigator`**, right click on project's name ➜ **`Add Files to <...>`**.
- **`node_modules/react-native-background-fetch/ios/RNBackgroundFetch/RNBackgroundFetch+AppDelegate.m`**.

![](https://dl.dropbox.com/s/rwn8kyo8fgdn57u/autolinking-step1.png?dl=1)

**`node_modules/react-native-background-fetch/ios/RNBackgroundFetch/RNBackgroundFetch+AppDelegate.m`**
![](https://dl.dropbox.com/s/r4f564giaz257fw/autolinking-step2.png?dl=1)


