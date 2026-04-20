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

The SDK requires a custom **`maven url`** in the root **`android/build.gradle`**.
Please note that some more recent versions of React Native the Android template may not include **`allprojects`** section. You should add this manually as a separate section along with the nested **`repositories`** section in the same **`android/build.gradle`** file. Please note that the `allProjects` needs to be added in the `buildscript` section and not as a separate section, in order to work with the Android template.

### :open_file_folder: **`android/build.gradle`**

```diff
buildscript {
    // other build scripts, ext, repositories, etc.

    + allprojects {
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
}
```

## Precise event-scheduling with `forceAlarmManager: true`:

**Only** If you wish to use precise scheduling of events with **`forceAlarmManager: true`**, _Android 14 (SDK 34)_, has restricted usage of ["`AlarmManager` exact alarms"](https://developer.android.com/about/versions/14/changes/schedule-exact-alarms). To continue using precise timing of events with _Android 14_, you can manually add this permission to your **`AndroidManifest`**. Otherwise, the plugin will gracefully fall-back to "_in-exact_ `AlarmManager` scheduling":

:open_file_folder: In your `AndroidManifest`, add the following permission (**exactly as-shown**):

```xml
  <manifest>
      <uses-permission android:minSdkVersion="34" android:name="android.permission.USE_EXACT_ALARM" />
      .
      .
      .
  </manifest>
```

:warning: It has been announced that _Google Play Store_ [has plans to impose greater scrutiny](https://support.google.com/googleplay/android-developer/answer/13161072?sjid=3640341614632608469-NA) over usage of this permission (which is why the plugin does not automatically add it).
