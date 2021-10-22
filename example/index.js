/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';

import BackgroundFetch from "react-native-background-fetch";

import Event from "./src/Event";

AppRegistry.registerComponent(appName, () => App);

/// BackgroundFetch Android Headless Event Receiver.
/// Called when the Android app is terminated.
///
const backgroundFetchHeadlessTask = async (event) => {
  if (event.timeout) {
    console.log('[BackgroundFetch] 💀 HeadlessTask TIMEOUT: ', event.taskId);
    BackgroundFetch.finish(event.taskId);
    return;
  }

  console.log('[BackgroundFetch] 💀 HeadlessTask start: ', event.taskId);

  // Persist a new Event into AsyncStorage.  It will appear in the view when app is next booted.
  await Event.create(event.taskId, true);  // <-- true means "Headless"

  // Required:  Signal to native code that your task is complete.
  // If you don't do this, your app could be terminated and/or assigned
  // battery-blame for consuming too much time in background.
  BackgroundFetch.finish(event.taskId);
}

/// Now register the handler.
BackgroundFetch.registerHeadlessTask(backgroundFetchHeadlessTask);

