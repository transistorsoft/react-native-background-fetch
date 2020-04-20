/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */

import React, { useEffect, useState, FC } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
} from 'react-native';
import BackgroundFetch, { BackgroundFetchStatus } from 'react-native-background-fetch';

import { Event } from './types';
import {
  backgroundColor,
  eventsKey,
  getData,
  storeData,
  styles,
  timeStr,
} from './utils';
import {
  EventItem,
  Footer,
  Header,
  Notice,
} from './components';

declare var global: { HermesInternal: null | {} };

type IProps = {
  navigation: any;
};

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

const App: FC<IProps> = (props: IProps) => {
  const [enabled, setEnabled] = useState(false);
  const [events, setEvents] = useState([] as Event[]);

  const clear = () => {
    events.splice(0, events.length);
    setEvents([]);
    storeData(eventsKey, events);
  }
  const onToggleEnabled = async (value:boolean) => {
    try {
      if (value) {
        await BackgroundFetch.start();
      } else {
        await BackgroundFetch.stop();
      }
      setEnabled(value);
    } catch (e) {
      console.warn(`[js] BackgroundFetch ${value ? 'start' : 'stop'} falied`, e);
    }
  }
  const fetchEvent = async (taskId: string) => {
    console.log('[js] Received background-fetch event: ', taskId);

    events.push({
      taskId,
      timestamp: timeStr(new Date()),
      isHeadless: false
    })
    setEvents([...events]);
    storeData(eventsKey, events);

    try {
      if (taskId === 'react-native-background-fetch') {
        await scheduleTask('com.transistorsoft.customtask');
      }
    } catch (e) {
      console.warn('[js] BackgroundFetch scheduleTask falied', e);
    }
    try {
      // Required: Signal completion of your task to native code
      // If you fail to do this, the OS can terminate your app
      // or assign battery-blame for consuming too much background-time
      BackgroundFetch.finish(taskId);
    } catch (e) {
      console.warn('[js] BackgroundFetch finish falied', e);
    }
  };
  const init = async () => {
    try {
      BackgroundFetch.configure(
        {
          minimumFetchInterval: 15,     // <-- minutes (15 is minimum allowed)
          // Android options
          forceAlarmManager: false,     // <-- Set true to bypass JobScheduler.
          stopOnTerminate: false,
          startOnBoot: true,
          requiredNetworkType: BackgroundFetch.NETWORK_TYPE_NONE, // Default
          requiresCharging: false,      // Default
          requiresDeviceIdle: false,    // Default
          requiresBatteryNotLow: false, // Default
          requiresStorageNotLow: false  // Default
        },
        fetchEvent,
        (status: BackgroundFetchStatus) => {
          console.log('[js] RNBackgroundFetch status', status);
        });
        const list = await getData<Event[]>(eventsKey);
        list && setEvents(list);
        list && events.splice(0, events.length, ...list);
    } catch (e) {
      console.warn('[js] BackgroundFetch could not configure', e);
    }

    // Optional: Query the authorization status.
    BackgroundFetch.status((status) => {
      switch(status) {
        case BackgroundFetch.STATUS_RESTRICTED:
          console.info('[js] BackgroundFetch restricted');
          break;
        case BackgroundFetch.STATUS_DENIED:
          console.info('[js] BackgroundFetch denied');
          break;
        case BackgroundFetch.STATUS_AVAILABLE:
          console.info('[js] BackgroundFetch is enabled');
          setEnabled(true);
          break;
      }
    });
  };

  useEffect(() => {
    init();
  }, []);

  return (
    <>
      <StatusBar backgroundColor={backgroundColor} barStyle='dark-content' />
      <SafeAreaView style={[styles.body, styles.container, styles.flex1]}>
          <Header {...{ enabled, onToggleEnabled }} />
          <ScrollView
            contentInsetAdjustmentBehavior='automatic'
            style={[styles.paddingLR10, styles.container, styles.wide]}
          >
            {!events.length && (<Notice />)}
            {events.map((event, i) => (<EventItem key={`${i}:${event.timestamp}`} {...event} />))}
          </ScrollView>
          <Footer clear={clear} enabled={enabled} />
      </SafeAreaView>
    </>
  );
};

export default App;
