# Expo Setup

```bash
npx expo install react-native-background-fetch
```

### :open_file_folder: **`app.json`**

- Add the following to __`plugins`__:

```diff
{
  "expo": {
    "name": "your-app-name",
    "plugins": [
+     "react-native-background-fetch"
    ]
  }
}
```

- Add the following __`UIBackgroundModes`__ and __`BGTaskSchedulerPermittedIdentifiers`__ to the __`ios.infoPlist`__ section:


```diff
{
  "expo": {
    "name": "your-app-name",
    "plugins": [
      "react-native-background-fetch"
    ],
    "ios": {
+     "infoPlist": {
+       "UIBackgroundModes": [
+         "fetch",
+         "processing"
+       ],
+       "BGTaskSchedulerPermittedIdentifiers": [
+         "com.transistorsoft.fetch"
+       ]
+     }
    }
  }
}
```

- If you intend to execute your own custom tasks via **`BackgroundFetch.scheduleTask`**, you must add those custom identifiers as well to the __`BGTaskSchedulerPermittedIdentifiers`__.  For example, if you intend to execute a custom **`taskId: 'com.transistorsoft.customtask'`**, you must add the identifier **`com.transistorsoft.customtask`** to `BGTaskSchedulerPermittedIdentifiers`:

```diff
  "BGTaskSchedulerPermittedIdentifiers": [
    "com.transistorsoft.fetch",
+   "com.transistorsoft.customtask"
  ]
```

:warning: A task identifier can be any string you wish, but it's a good idea to prefix them now with `com.transistorsoft.` &mdash;  In the future, the `com.transistorsoft` prefix **may become required**.

```javascript
BackgroundFetch.scheduleTask({
  taskId: 'com.transistorsoft.customtask',
  delay: 60 * 60 * 1000  //  In one hour (milliseconds)
});
```

### Re-build

You must rebuild your Android app for the added plugins to be evaluated.

- If you developing locally:

```bash
npx expo prebuild
```

- If you're using *Expo EAS*:
```bash
eas build --profile development --platform android
```


