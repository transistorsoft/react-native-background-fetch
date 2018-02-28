# Android `react-native link` Installation

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
        jcenter()        
        maven {
            // All of React Native (JS, Obj-C sources, Android binaries) is installed from npm
            url "$rootDir/../node_modules/react-native/android"
        }
        // For latest Google Apis
+       maven {
+           url 'https://maven.google.com'
+       }

+       maven {
+           url "$rootDir/../node_modules/react-native-background-fetch/android/libs"
+       }
    }
}

/**
-* !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
-* !!! THE FOLLOWING IS OPTIONAL BUT HIGHLY RECOMMENDED FOR YOUR SANITY !!!
-* !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
*
* Do you hate Gradle conflicts where other plugin require some particular
* version of play-services or define a compileSdkVersion, buildToolsVersion
* which conflicts with that of your app?  Me too!
*
* If you define these key gradle configuration variables globally, the 
* background-geolocation plugin (and any other "wise" plugins you've installed) 
* can align themselves to YOUR desired versions!  You should define these variables 
* as desired according to current values in your app/build.gradle
*
* You'll find that more and more plugins are beginning to wise up to checking 
* for the presense of global gradle variables like this.
*
* BackgroundGeolocation is aware of the following variables:
*/
+ext {
+    compileSdkVersion   = 26
+    targetSdkVersion    = 26
+    buildToolsVersion   = "26.0.2"
+    supportLibVersion   = "26.1.0"
+    playServicesVersion = "11.8.0" 
+}

```

#### :information_source: Project-wide Configuration Properties

The technique of **defining project-wide properties** can be found in the **Android Developer Document** [Gradle Tip &amp; Tricks](https://developer.android.com/studio/build/gradle-tips.html) (see *Configure project-wide properties*) and another good explanation [here](https://segunfamisa.com/posts/android-gradle-extra-properties).  The *BackgroundFetch* plugin [is aware of the presense of these configuration properties](../android/build.gradle#L3-L18).

### :open_file_folder: **`android/app/build.gradle`**

```diff
-/**
-* OPTIONAL:  If you've implemeted the "OPTIONAL BUT HIGHLY RECOMMENDED" note
-* above, you can define your compileSdkVersion, buildToolsVersion, targetSdkVersion 
-* using your own global variables as well:
-* Android Studio is smart enough to be aware of the evaulated values here,
-* to offer upgrade notices when applicable.
-*
-*/
android {
+    compileSdkVersion rootProject.compileSdkVersion
+    buildToolsVersion rootProject.buildToolsVersion

    defaultConfig {
+        targetSdkVersion rootProject.targetSdkVersion
         .
         .
         .
    }
}
