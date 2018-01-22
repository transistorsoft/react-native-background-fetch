# Android `react-native link` Installation

```bash
$ npm install --save react-native-background-fetch

$ react-native link react-native-background-fetch
```

## Gradle Configuration

* :open_file_folder: **`android/build.gradle`**

```diff
allprojects {
    repositories {
        mavenLocal()
        jcenter()
        maven {
            // All of React Native (JS, Obj-C sources, Android binaries) is installed from npm
            url "$rootDir/../node_modules/react-native/android"
        }
        // Google now hosts their latest API dependencies on their own maven  server.  
        // React Native will eventually add this to their app template.
+        maven {
+            url 'https://maven.google.com'
+        }
    }
}
```

:open_file_folder: **`android/app/build.gradle`**

```diff
+repositories {
+   flatDir {
+       dirs "../../node_modules/react-native-background-fetch/android/libs"
+   }
+}

dependencies {
+   compile(name: 'tsbackgroundfetch', ext: 'aar')
}
```
