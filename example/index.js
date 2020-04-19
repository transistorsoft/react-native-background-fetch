/**
 * @format
 */

import { AppRegistry } from 'react-native';
import BackgroundFetch, { HeadlessEvent } from 'react-native-background-fetch';

import App from './App';
import { name as appName } from './app.json';
import { storeData, getData, eventsKey } from './utils/storage';
import { Event } from './types';

AppRegistry.registerComponent(appName, () => App);

const headlessTask = async ({ taskId }: HeadlessEvent) => {
  // Get task id from event {}:
  console.log('[js] BackgroundFetch HeadlessTask start: ', taskId);

  const list: Event[] = await getData(eventsKey) || [];

  list.push({
    taskId,
    timestamp: new Date(),
    isHeadless: true,
  });

  await storeData(eventsKey, list);

  // Required:  Signal to native code that your task is complete.
  // If you don't do this, your app could be terminated and/or assigned
  // battery-blame for consuming too much time in background.
  BackgroundFetch.finish(taskId);
}

// Register your BackgroundFetch HeadlessTask
BackgroundFetch.registerHeadlessTask(headlessTask);

BackgroundFetch.onFetch(() => {
  console.info('[js] BackgroundFetch fetch');
});
