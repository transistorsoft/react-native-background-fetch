import BackgroundFetch, { BackgroundFetchStatus } from 'react-native-background-fetch';

export const timeStr = (date: Date = new Date()) => {
  return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
}

export const status = (status: BackgroundFetchStatus): string => {
  switch(status) {
    case BackgroundFetch.STATUS_RESTRICTED:
      console.info('[js] BackgroundFetch restricted');
      return 'restricted';
    case BackgroundFetch.STATUS_DENIED:
      console.info('[js] BackgroundFetch denied');
      return 'denied';
    case BackgroundFetch.STATUS_AVAILABLE:
      console.info('[js] BackgroundFetch is enabled');
      return 'available';
  }
  return 'unknown';
};
