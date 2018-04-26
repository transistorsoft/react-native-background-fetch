import { NativeModules, NativeEventEmitter } from "react-native";

const RNBackgroundFetch = NativeModules.RNBackgroundFetch;
const EventEmitter = new NativeEventEmitter(RNBackgroundFetch);

const EVENT_FETCH = "fetch";
const TAG         = "RNBackgroundFetch";
const EVENTS      = ["fetch"];

const STATUS_RESTRICTED = 0;
const STATUS_DENIED     = 1;
const STATUS_AVAILABLE  = 2;

const FETCH_RESULT_NEW_DATA = 0;
const FETCH_RESULT_NO_DATA  = 1;
const FETCH_RESULT_FAILED   = 2;

class API {
  static configure(config, callback, failure) {
    if (typeof(callback) !== 'function') {
      throw "RNBackgroundFetch requires a fetch callback at 2nd argument";
    }
    config = config || {};
    failure = failure || function() {};
    RNBackgroundFetch.configure(config, failure);
    return this.addListener(EVENT_FETCH, callback);
  }

  static on(event, callback) {
    return this.addListener(event, callback);
  }

  static addListener(event, callback) {
    if (EVENTS.indexOf(event) < 0) {
      throw "RNBackgroundFetch: Unknown event '" + event + '"';
    }
    return EventEmitter.addListener(event, callback);
  }

  static start(success, failure) {
    success = success || function() {};
    failure = failure || function() {};
    RNBackgroundFetch.start(success, failure);
  }

  static stop() {
    RNBackgroundFetch.stop();
  }

  static finish(result) {
    const fetchResult = result ? result : FETCH_RESULT_NEW_DATA;
    RNBackgroundFetch.finish(fetchResult);
  }

  static status(callback) {
    if (typeof(callback) !== 'function') {
      throw "RNBackgroundFetch#status requires a callback as 1st argument";
    }
    RNBackgroundFetch.status(callback);
  }
}

API.STATUS_RESTRICTED = STATUS_RESTRICTED;
API.STATUS_DENIED     = STATUS_DENIED;
API.STATUS_AVAILABLE  = STATUS_AVAILABLE;

API.FETCH_RESULT_NEW_DATA = FETCH_RESULT_NEW_DATA;
API.FETCH_RESULT_NO_DATA  = FETCH_RESULT_NO_DATA;
API.FETCH_RESULT_FAILED   = FETCH_RESULT_FAILED;

module.exports = API;
