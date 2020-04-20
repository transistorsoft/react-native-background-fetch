/**
 * @format
 */

import { AppRegistry } from 'react-native';
import BackgroundFetch from 'react-native-background-fetch';

import App from './App';
import { name as appName } from './app.json';
import {
  eventsKey,
  getData,
  storeData,
  timeStr,
} from './utils';

AppRegistry.registerComponent(appName, () => App);

const headlessTask = async ({ taskId }) => {
  // Get task id from event {}:
  console.log('[js] BackgroundFetch HeadlessTask start: ', taskId);

  const list = await getData(eventsKey) || [];

  list.unshift({
    isHeadless: true,
    taskId,
    timestamp: timeStr(),
  });

  await storeData(eventsKey, list);

  // Required:  Signal to native code that your task is complete.
  // If you don't do this, your app could be terminated and/or assigned
  // battery-blame for consuming too much time in background.
  BackgroundFetch.finish(taskId);
};

// Register your BackgroundFetch HeadlessTask
BackgroundFetch.registerHeadlessTask(headlessTask);

BackgroundFetch.onFetch(() => {
  console.info('[js] BackgroundFetch fetch');
});
