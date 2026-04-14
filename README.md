<p align="center">
  <img src="https://raw.githubusercontent.com/transistorsoft/assets/master/images/logos/transistor/transistor-logo-panel-react-native.svg" alt="Background Fetch for React Native" width="635">
</p>

react-native-background-fetch &middot; [![npm](https://img.shields.io/npm/dm/react-native-background-fetch.svg)]() [![npm](https://img.shields.io/npm/v/react-native-background-fetch.svg)]()
==============================================================================

By [**Transistor Software**](http://transistorsoft.com), creators of [**React Native Background Geolocation**](http://www.transistorsoft.com/shop/products/react-native-background-geolocation)

------------------------------------------------------------------------------

Background Fetch is a *very* simple plugin which attempts to awaken an app in the background about **every 15 minutes**, providing a short period of background running-time.  This plugin will execute your provided `callbackFn` whenever a background-fetch event occurs.

There is **no way** to increase the rate which a fetch-event occurs and this plugin sets the rate to the most frequent possible &mdash; you will **never** receive an event faster than **15 minutes**.  The operating-system will automatically throttle the rate the background-fetch events occur based upon usage patterns.  Eg: if user hasn't turned on their phone for a long period of time, fetch events will occur less frequently or if an iOS user disables background refresh they may not happen at all.

:new: Background Fetch now provides a [`scheduleTask`](https://fetch.transistorsoft.com/react-native/BackgroundFetch#scheduletask) method for scheduling arbitrary "one-shot" or periodic tasks.

### iOS
- There is **no way** to increase the rate which a fetch-event occurs and this plugin sets the rate to the most frequent possible &mdash; you will **never** receive an event faster than **15 minutes**.  The operating-system will automatically throttle the rate the background-fetch events occur based upon usage patterns.  Eg: if user hasn't turned on their phone for a long period of time, fetch events will occur less frequently.
- [`scheduleTask`](https://fetch.transistorsoft.com/react-native/BackgroundFetch#scheduletask) seems only to fire when the device is plugged into power.
- :warning: When your app is **terminated**, iOS *no longer fires events* &mdash; There is *no such thing* as **`stopOnTerminate: false`** for iOS.
- iOS can take *days* before Apple's machine-learning algorithm settles in and begins regularly firing events.  Do not sit staring at your logs waiting for an event to fire.  If your [*simulated events*](https://fetch.transistorsoft.com/react-native/debugging) work, that's all you need to know that everything is correctly configured.
- If the user doesn't open your *iOS* app for long periods of time, *iOS* will **stop firing events**.

### Android
- The Android plugin provides a [HeadlessJS](https://reactnative.dev/docs/headless-js-android) implementation allowing you to continue handling events even after app-termination (see [`enableHeadless`](https://fetch.transistorsoft.com/react-native/BackgroundFetchConfig#enableheadless)).

-------------------------------------------------------------

# Contents

| Resource | Link |
|----------|------|
| :wrench: Setup Guide | [Setup](https://fetch.transistorsoft.com/react-native/setup) |
| :books: API Documentation | [API Reference](https://fetch.transistorsoft.com/react-native/BackgroundFetch) |
| :rocket: Examples | [Examples](https://fetch.transistorsoft.com/react-native/examples) |
| :beetle: Debugging | [Debugging](https://fetch.transistorsoft.com/react-native/debugging) |
| :open_file_folder: Example App | [`/example`](./example) |

## Installing the plugin

### With *Expo*

```bash
$ npx expo install react-native-background-fetch
```

### With `yarn`

```bash
$ yarn add react-native-background-fetch
```

### With `npm`
```bash
$ npm install --save react-native-background-fetch
```

## Licence

The MIT License

Copyright (c) 2013 Chris Scott, Transistor Software <chris@transistorsoft.com>
http://transistorsoft.com

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
