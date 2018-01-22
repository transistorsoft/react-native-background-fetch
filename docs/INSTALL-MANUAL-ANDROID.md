# Android Manual Installation

```bash
$ npm install --save react-native-background-fetch
```

## Gradle Configuration

:open_file_folder: **`android/settings.gradle`**

```diff
+include ':react-native-background-fetch'
+project(':react-native-background-fetch').projectDir = new File(rootProject.projectDir, '../node_modules/react-native-background-fetch/android')
```

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
+   compile project(':react-native-background-fetch')
+   compile(name: 'tsbackgroundfetch', ext: 'aar')
}
```


## MainApplication.java

:open_file_folder: **`android/app/main/java/com/.../MainApplication.java`**

```diff
+import com.transistorsoft.rnbackgroundfetch.RNBackgroundFetchPackage;
public class MainApplication extends ReactApplication {
  @Override
  protected List<ReactPackage> getPackages() {
    return Arrays.<ReactPackage>asList(
+     new RNBackgroundFetchPackage(),
      new MainReactPackage()
    );
  }
}
```