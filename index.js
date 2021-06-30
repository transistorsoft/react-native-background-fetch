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

  static configure(config, onEvent, onTimeout) {
    if (typeof(onEvent) !== 'function') {
      throw "BackgroundFetch requires an event callback at 2nd argument";
    }
    if (typeof(onTimeout) !== 'function') {
      console.warn("[BackgroundFetch] configure:  You did not provide a 3rd argument onTimeout callback.  This callback is a signal from the OS that your allowed background time is about to expire.  Use this callback to finish what you're doing and immediately call BackgroundFetch.finish(taskId)");
      onTimeout = (taskId) => {
        console.warn('[BackgroundFetch] default onTimeout callback fired.  You should provide your own onTimeout callback to .configure(options, onEvent, onTimeout)');
        BackgroundFetch.finish(taskId);
      }
    }
    EventEmitter.removeAllListeners(EVENT_FETCH);

    EventEmitter.addListener(EVENT_FETCH, (event) => {
      if (!event.timeout) {
        onEvent(event.taskId);
      } else {
        onTimeout(event.taskId);
      }
    });

    config = config || {};

    return new Promise((resolve, reject) => {
      let success = (status) => { resolve(status) };
      let failure = (status) => { reject(status) };
      RNBackgroundFetch.configure(config, success, failure);
    });
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

