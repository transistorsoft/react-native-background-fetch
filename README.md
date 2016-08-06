react-native-background-fetch
==============================

## iOS [Background Fetch](https://developer.apple.com/library/ios/documentation/UIKit/Reference/UIApplication_Class/#//apple_ref/occ/instm/UIApplication/setMinimumBackgroundFetchInterval:) Implementation for React Native

iOS Background Fetch is basically an API which wakes up your app about every 15 minutes (during the user's prime-time hours) and provides your app **exactly 30s** of background running-time.  This plugin will execute your provided `callbackFn` whenever a background-fetch event occurs.  There is **no way** to increase the rate which a fetch-event occurs and this plugin sets the rate to the most frequent possible value of `UIApplicationBackgroundFetchIntervalMinimum` -- iOS determines the rate automatically based upon device usage and time-of-day (ie: fetch-rate is about ~15min during prime-time hours; less frequently when the user is presumed to be sleeping, at 3am for example).

[Tutorial](http://www.doubleencore.com/2013/09/ios-7-background-fetch/)

## Installing the plugin ##

### [iOS Manual Installation](INSTALL.md)

## Config 

####`@param {Boolean} stopOnTerminate`

Set `true` to cease background-fetch from operating after user "closes" the app.  Defaults to `true`.

## Methods

| Method Name | Arguments | Notes
|---|---|---|
| `configure` | `callbackFn`, `failureFn`, `{config}` | Configures the plugin's fetch `callbackFn`.  This callback will fire each time an iOS background-fetch event occurs (typically every 15 min).  The `failureFn` will be called if the device doesn't support background-fetch. |
| `finish` | *none* | You **MUST** call this method in your fetch `callbackFn` provided to `#configure` in order to signal to iOS that your fetch action is complete.  iOS provides **only** 30s of background-time for a fetch-event -- if you exceed this 30s, iOS will kill your app. |
| `start` | `successFn`, `failureFn` | Start the background-fetch API.  Your `callbackFn` provided to `#configure` will be executed each time a background-fetch event occurs.  **NOTE** the `#configure` method *automatically* calls `#start`.  You do **not** have to call this method after you `#configure` the plugin |
| `stop` | `successFn`, `failureFn` | Stop the background-fetch API from firing fetch events.  Your `callbackFn` provided to `#configure` will no longer be executed. |

## Example ##

```Javascript

import BackgroundFetch from "react-native-background-fetch";

var Home = React.createClass({
  componentDidMount: function() {

    BackgroundFetch.configure({
      stopOnTerminate: false
    }, function() {
      console.log("[js] Received background-fetch event");
      BackgroundFetch.finish();
    }, function(error) {
      console.log("[js] RNBackgroundFetch failed to start");
    });
    
  }
});
```

## iOS

Implements [performFetchWithCompletionHandler](https://developer.apple.com/library/ios/documentation/UIKit/Reference/UIApplicationDelegate_Protocol/Reference/Reference.html#//apple_ref/occ/intfm/UIApplicationDelegate/application:performFetchWithCompletionHandler:), firing a custom event subscribed-to in cordova plugin.

## Licence ##

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

