import AsyncStorage from '@react-native-community/async-storage';

const EVENTS_KEY = '@events';

export const persistEvents = async <T>(data: T) => {
  try {
    return AsyncStorage.setItem(EVENTS_KEY, JSON.stringify(data));
  } catch (e) {
    console.warn('AsyncStorage:setItem', e)
  }
}

export const loadEvents = async <T>(): Promise<T | null> => {
  try {
    const value = await AsyncStorage.getItem(EVENTS_KEY)
    if(value !== null) {
      return JSON.parse(value);
    }
  } catch(e) {
    console.warn('AsyncStorage:getItem', e)
  }
  return Promise.resolve(null);
}
