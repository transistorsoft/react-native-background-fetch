import BackgroundFetch from 'react-native-background-fetch';

export const timeStr = (date: Date = new Date()) => {
  return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
}

export const toggleFetch = (value:boolean) => {
  if (value) {
    return BackgroundFetch.start();
  } else {
    return BackgroundFetch.stop();
  }
}
export const scheduleTask = async (name: string) => {
  try {
    await BackgroundFetch.scheduleTask({
      taskId: name,
      delay: 5000,       // milliseconds
      forceAlarmManager: true,
      periodic: false
    });
  } catch (e) {
    console.warn('[js] scheduleTask fail', e);
  }
}