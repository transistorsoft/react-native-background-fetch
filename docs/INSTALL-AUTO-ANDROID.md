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

## Precise event-scheduling with `forceAlarmManager: true`:

**Only** If you wish to use precise scheduling of events with __`forceAlarmManager: true`__, *Android 14 (SDK 34)*, has restricted usage of ["`AlarmManager` exact alarms"](https://developer.android.com/about/versions/14/changes/schedule-exact-alarms).  To continue using precise timing of events with *Android 14*, you can manually add this permission to your __`AndroidManifest`__.  Otherwise, the plugin will gracefully fall-back to "*in-exact* `AlarmManager` scheduling":

:open_file_folder: In your `AndroidManifest`, add the following permission (**exactly as-shown**):

```xml
  <manifest>
      <uses-permission android:minSdkVersion="34" android:name="android.permission.USE_EXACT_ALARM" />
      .
      .
      .
  </manifest>
```
:warning: It has been announced that *Google Play Store* [has plans to impose greater scrutiny](https://support.google.com/googleplay/android-developer/answer/13161072?sjid=3640341614632608469-NA) over usage of this permission (which is why the plugin does not automatically add it).

