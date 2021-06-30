/**
 * @format
 */

import { AppRegistry } from 'react-native';
import BackgroundFetch from 'react-native-background-fetch';

import App from './App';
import { name as appName } from './app.json';
import {
  loadEvents,
  persistEvents,
  getTimestamp,
} from './utils';

/// Android-only:  BackgroundFetch event-handler when app is terminated.
/// NOTE:  This handler must be placed and registered here in index.js -- DO NOT place this in your App components.
///
const headlessTask = async (event) => {
  if (event.timeout) {
    console.log('[BackgroundFetch] 💀 HeadlessTask TIMEOUT: ', event.taskId);
    BackgroundFetch.finish(event.taskId);
    return;
  }
  console.log('[BackgroundFetch] 💀 HeadlessTask start: ', event.taskId);
  // Persist the event in AsyncStorage to render in list when app is relaunched.
  const events = await loadEvents() || [];

  events.unshift({
    isHeadless: true,
    taskId: event.taskId,
    timestamp: getTimestamp(),
  });

  await persistEvents(events);

  // Required:  Signal to native code that your task is complete.
  // If you don't do this, your app could be terminated and/or assigned
  // battery-blame for consuming too much time in background.
  BackgroundFetch.finish(event.taskId);
};

// Register your BackgroundFetch HeadlessTask
BackgroundFetch.registerHeadlessTask(headlessTask);

AppRegistry.registerComponent(appName, () => App);

