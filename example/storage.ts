import AsyncStorage from '@react-native-community/async-storage';

export const eventsKey = '@events';

export const storeData = async <T>(key: string, data: T) => {
  try {
    return AsyncStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.warn('AsyncStorage:setItem', e)
  }
}

export const getData = async <T>(key: string): Promise<T | null> => {
  try {
    const value = await AsyncStorage.getItem(key)
    if(value !== null) {
      return JSON.parse(value);
    }
  } catch(e) {
    console.warn('AsyncStorage:getItem', e)
  }
  return Promise.resolve(null);
}
