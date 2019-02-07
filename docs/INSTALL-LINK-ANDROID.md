# Android `react-native link` Installation

## With `yarn`

```bash
$ yarn add react-native-background-fetch

$ react-native link react-native-background-fetch
```

## With `npm`
```bash
$ npm install --save react-native-background-fetch

$ react-native link react-native-background-fetch
```

## Gradle Configuration

### :open_file_folder: **`android/build.gradle`**

```diff
allprojects {
    repositories {
        mavenLocal()
        google()
        jcenter()
        maven {
            // All of React Native (JS, Obj-C sources, Android binaries) is installed from npm
            url "$rootDir/../node_modules/react-native/android"
        }
+       maven {
+           url "$rootDir/../node_modules/react-native-background-fetch/android/libs"
+       }
    }
}
```

