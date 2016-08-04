const { React, DeviceEventEmitter} = require('react-native');
const { RNBackgroundFetch } = require('react-native').NativeModules;
const TAG = "RNBackgroundFetch";
var API = {
  configured: false,
  configure: function(config, callback, failure) {
    if (this.configured) {
      console.warn(TAG, "has already been configured");
      return;
    }
    if (typeof(callback) !== 'function') {
      throw "RNBackgroundFetch requires a fetch callback at 2nd argument";
    }
    config = config || {};
    failure = failure || function() {};
    DeviceEventEmitter.addListener(TAG + ":" + "fetch", callback);
    RNBackgroundFetch.configure(config, failure);
  },
  start: function(success, failure) {
    success = success || function() {};
    failure = failure || function() {};
    RNBackgroundFetch.start(success, failure);
  },
  stop: function() {
    RNBackgroundFetch.stop();
  },
  finish: function() {
    RNBackgroundFetch.finish();
  }
};

module.exports = API;