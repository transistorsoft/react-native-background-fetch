# Android Manual Installation

## With `yarn`

```bash
$ yarn add react-native-background-fetch
```

## With `npm`

```bash
$ npm install --save react-native-background-fetch
```

## Gradle Configuration

### :open_file_folder: **`android/settings.gradle`**

```diff
+include ':react-native-background-fetch'
+project(':react-native-background-fetch').projectDir = new File(rootProject.projectDir, '../node_modules/react-native-background-fetch/android')
```

-------------------------------------------------------------------------------


### :open_file_folder: **`android/app/build.gradle`**

```diff
dependencies {
+   implementation project(':react-native-background-fetch')
}
```


## MainApplication.java

### :open_file_folder: **`android/app/main/java/com/.../MainApplication.java`**

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
