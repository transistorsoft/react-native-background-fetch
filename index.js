'use strict'

import {
  NativeModules,
  NativeEventEmitter,
  AppRegistry
} from "react-native";

const RNBackgroundFetch = NativeModules.RNBackgroundFetch;
const EventEmitter = new NativeEventEmitter(RNBackgroundFetch);

const EVENT_FETCH = "fetch";
const TAG         = "RNBackgroundFetch";
const EVENTS      = ["fetch"];

const STATUS_RESTRICTED = 0;
const STATUS_DENIED     = 1;
const STATUS_AVAILABLE  = 2;

const NETWORK_TYPE_NONE         = 0;
const NETWORK_TYPE_ANY          = 1;
const NETWORK_TYPE_UNMETERED    = 2;
const NETWORK_TYPE_NOT_ROAMING  = 3;
const NETWORK_TYPE_CELLULAR     = 4;

export default class BackgroundFetch {
  static get STATUS_RESTRICTED() { return STATUS_RESTRICTED; }
  static get STATUS_DENIED() { return STATUS_DENIED; }
  static get STATUS_AVAILABLE() { return STATUS_AVAILABLE; }

  static get NETWORK_TYPE_NONE() { return NETWORK_TYPE_NONE; }
  static get NETWORK_TYPE_ANY() { return NETWORK_TYPE_ANY; }
  static get NETWORK_TYPE_UNMETERED() { return NETWORK_TYPE_UNMETERED; }
  static get NETWORK_TYPE_NOT_ROAMING() { return NETWORK_TYPE_NOT_ROAMING; }
  static get NETWORK_TYPE_CELLULAR() { return NETWORK_TYPE_CELLULAR; }

  static configure(config, callback, failure) {
    if (typeof(callback) !== 'function') {
      throw "RNBackgroundFetch requires a fetch callback at 2nd argument";
    }
    EventEmitter.removeAllListeners('fetch');
    config = config || {};
    failure = failure || function() {};
    RNBackgroundFetch.configure(config, failure);
    return this.addListener(EVENT_FETCH, callback);
  }

  static scheduleTask(config) {
    return new Promise((resolve, reject) => {
      let success = (success) => { resolve(success) }
      let failure = (error) => { reject(error) }
      RNBackgroundFetch.scheduleTask(config, success, failure);
    });
  }

  /**
  * Register HeadlessTask
  */
  static registerHeadlessTask(task) {
    AppRegistry.registerHeadlessTask("BackgroundFetch", () => task);
  }

  static onFetch(callback) {
    this.addListener('fetch', callback);
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

  static start() {
    return new Promise((resolve, reject) => {
      let success = (status) => {
        resolve(status);
      }
      let failure = (error) => {
        reject(error);
      }
      RNBackgroundFetch.start(success, failure);
    })
  }

  static stop(taskId) {
    return new Promise((resolve, reject) => {
      let success = (success) => {
        resolve(success);
      }
      let failure = (error) => {
        reject(error);
      }
      RNBackgroundFetch.stop(taskId, success, failure);
    });
  }

  static finish(taskId) {
    RNBackgroundFetch.finish(taskId);
  }

  static status(callback) {
    if (typeof(callback) === 'function') {
      return RNBackgroundFetch.status(callback);
    }
    return new Promise((resolve, reject) => {
      RNBackgroundFetch.status(resolve);
    })
  }
}

