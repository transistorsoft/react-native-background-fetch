# Example Apps

Two example apps demonstrating `react-native-background-fetch`:

- **`react-native/`** — Bare React Native (RN 0.85+)
- **`expo/`** — Expo SDK 54+

Both apps share the same UI — a simple list that logs background-fetch events with timestamps.

## Running

### React Native

```bash
cd example/react-native
npm install

# iOS
cd ios && pod install && cd ..
npx react-native run-ios

# Android
npx react-native run-android
```

### Expo

```bash
cd example/expo
npm install
npx expo prebuild
npx expo run:ios
npx expo run:android
```

## Simulating Events

See the [Debugging Guide](https://fetch.transistorsoft.com/react-native/debugging) for how to simulate background-fetch events on iOS and Android.

## Switching Between Apps

> **Warning:** When switching between the React Native and Expo example apps on Android, clean the build cache first to avoid stale codegen errors:
>
> ```bash
> cd android && ./gradlew clean && cd ..
> ```
