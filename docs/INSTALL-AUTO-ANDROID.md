# Android Auto-linking Setup

### `react-native >= 0.60`

### With `yarn`

```bash
$ yarn add react-native-background-fetch
```

### With `npm`
```bash
$ npm install --save react-native-background-fetch
```

## Configure __`proguard-rules.pro`__

If you're using __`minifyEnabled true`__ with your Android release build, the plugin's __`HeadlessTask`__ class will be mistakenly *removed* and you will have [this crash](https://github.com/transistorsoft/react-native-background-fetch/issues/261).

1.  Edit `android/app/proguard-rules.pro`.
2.  Add the following rule:

```bash
# [react-native-background-fetch]
-keep class com.transistorsoft.rnbackgroundfetch.HeadlessTask { *; }
```

