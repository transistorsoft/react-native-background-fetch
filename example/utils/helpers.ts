import BackgroundFetch, { BackgroundFetchStatus } from 'react-native-background-fetch';

/// Render Date to string
export const getTimestamp = (date: Date = new Date()) => {
  return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
}

/// Render BackgroundFetchStatus to text.
export const statusToString = (status: BackgroundFetchStatus): string => {
  switch(status) {
    case BackgroundFetch.STATUS_RESTRICTED:
      console.info('[BackgroundFetch] status: restricted');
      return 'restricted';
    case BackgroundFetch.STATUS_DENIED:
      console.info('[BackgroundFetch] status: denied');
      return 'denied';
    case BackgroundFetch.STATUS_AVAILABLE:
      console.info('[BackgroundFetch] status: enabled');
      return 'available';
  }
  return 'unknown';
};
