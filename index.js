'use strict'

import {
  NativeEventEmitter,
  AppRegistry
} from "react-native";

import NativeBackgroundFetch from './src/NativeBackgroundFetch';

const EventEmitter = new NativeEventEmitter(NativeBackgroundFetch);

const EVENT_FETCH = "fetch";

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

    return NativeBackgroundFetch.configure(config);
  }

  static scheduleTask(config) {
    return NativeBackgroundFetch.scheduleTask(config);
  }

  static registerHeadlessTask(task) {
    AppRegistry.registerHeadlessTask("BackgroundFetch", () => task);
  }

  static start() {
    return NativeBackgroundFetch.start();
  }

  static stop(taskId) {
    return NativeBackgroundFetch.stop(taskId || null);
  }

  static finish(taskId) {
    NativeBackgroundFetch.finish(taskId);
  }

  static status(callback) {
    if (typeof(callback) === 'function') {
      NativeBackgroundFetch.status().then(callback);
      return;
    }
    return NativeBackgroundFetch.status();
  }
}
