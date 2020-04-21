'use strict'

import {
  NativeModules,
  NativeEventEmitter,
  AppRegistry
} from 'react-native';

const RNBackgroundFetch = NativeModules.RNBackgroundFetch;
const EventEmitter = new NativeEventEmitter(RNBackgroundFetch);

const EVENT_FETCH = 'fetch';
const TAG         = 'RNBackgroundFetch';
const EVENTS      = ['fetch'];

export const STATUS_RESTRICTED = 0;
export const STATUS_DENIED     = 1;
export const STATUS_AVAILABLE  = 2;

export const NETWORK_TYPE_NONE         = 0;
export const NETWORK_TYPE_ANY          = 1;
export const NETWORK_TYPE_UNMETERED    = 2;
export const NETWORK_TYPE_NOT_ROAMING  = 3;
export const NETWORK_TYPE_CELLULAR     = 4;

export const addListener = (event, callback) => {
  if (EVENTS.indexOf(event) < 0) {
    throw new Error(`RNBackgroundFetch: Unknown event '${event}'`);
  }
  return EventEmitter.addListener(event, callback);
};

export const configure = (config, callback, failure) => {
  if (typeof(callback) !== 'function') {
    throw new Error(`RNBackgroundFetch requires a fetch callback at 2nd argument`);
  }
  EventEmitter.removeAllListeners('fetch');
  config = config || {};
  failure = failure || () => {};
  RNBackgroundFetch.configure(config, failure);
  return addListener(EVENT_FETCH, callback);
};

export const scheduleTask(config) => {
  return new Promise((resolve, reject) => {
    const success = success => resolve(success);
    const failure = error => reject(error);
    RNBackgroundFetch.scheduleTask(config, success, failure);
  });
};

/**
* Register HeadlessTask
*/
export const registerHeadlessTask = (task) => {
  AppRegistry.registerHeadlessTask('BackgroundFetch', () => task);
};

export const onFetch = (callback) => {
  addListener('fetch', callback);
}

export const on = (event, callback) => {
  return addListener(event, callback);
}

export const start = () => {
  return new Promise((resolve, reject) => {
    let success = (status) => {
      resolve(status);
    }
    let failure = (error) => {
      reject(error);
    }
    RNBackgroundFetch.start(success, failure);
  })
};

export const stop = (taskId) => {
  return new Promise((resolve, reject) => {
    let success = (success) => {
      resolve(success);
    }
    let failure = (error) => {
      reject(error);
    }
    RNBackgroundFetch.stop(taskId, success, failure);
  });
};

export const finish = (taskId) => {
  RNBackgroundFetch.finish(taskId);
};

export const status = (callback) => {
  if (typeof callback === 'function') {
    return RNBackgroundFetch.status(callback);
  }
  return new Promise((resolve, reject) => {
    RNBackgroundFetch.status(resolve);
  })
};

