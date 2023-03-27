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

## Gradle Configuration

The SDK requires a custom __`maven url`__ in the root __`android/build.gradle`__.
Please note that some more recent versions of React Native the Android template may not include __`allprojects`__ section. You should add this manually as a separate section along with the nested __`repositories`__ section in the same __`android/build.gradle`__ file.

### :open_file_folder: **`android/build.gradle`**

```diff
allprojects {
    repositories {
        mavenLocal()
        maven {
            // All of React Native (JS, Obj-C sources, Android binaries) is installed from npm
            url("$rootDir/../node_modules/react-native/android")
        }
        maven {
            // Android JSC is installed from npm
            url("$rootDir/../node_modules/jsc-android/dist")
        }
+       maven {
+           // react-native-background-fetch
+           url("${project(':react-native-background-fetch').projectDir}/libs")
+       }

    }
}
```

## Configure __`proguard-rules.pro`__

If you're using __`minifyEnabled true`__ with your Android release build, the plugin's __`HeadlessTask`__ class will be mistakenly *removed* and you will have [this crash](https://github.com/transistorsoft/react-native-background-fetch/issues/261).

1.  Edit `android/app/proguard-rules.pro`.
2.  Add the following rule:

```bash
# [react-native-background-fetch]
-keep class com.transistorsoft.rnbackgroundfetch.HeadlessTask { *; }
```

