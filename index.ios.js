const {NativeEventEmitter} = require('react-native');
const { RNBackgroundFetch } = require('react-native').NativeModules;
const EventEmitter = new NativeEventEmitter(RNBackgroundFetch);
const EVENT_FETCH = "fetch";
const TAG = "RNBackgroundFetch";
var API = {
  STATUS_RESTRICTED: 0,
  STATUS_DENIED: 1,
  STATUS_AVAILABLE: 2,

  events: [
    EVENT_FETCH
  ],

  configure: function(config, callback, failure) {
    if (typeof(callback) !== 'function') {
      throw "RNBackgroundFetch requires a fetch callback at 2nd argument";
    }
    config = config || {};
    failure = failure || function() {};
    RNBackgroundFetch.configure(config, failure);
    return this.addListener(EVENT_FETCH, callback);
  },
  on: function(event, callback) {
    return this.addListener(event, callback);
  },
  addListener: function(event, callback) {
    if (this.events.indexOf(event) < 0) {
      throw "RNBackgroundFetch: Unknown event '" + event + '"';
    }
    return EventEmitter.addListener(event, callback);
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
  },
  status: function(callback) {
    RNBackgroundFetch.status(callback);
  }
};

module.exports = API;