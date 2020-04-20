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
  status as getStatus,
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
  const [defaultStatus, setDefaultStatus] = useState('unknown');
  const [events, setEvents] = useState([] as Event[]);

  const clear = () => {
    setEvents([]);
    storeData(eventsKey, []);
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

    events.unshift({
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
          enableHeadless: true,
          startOnBoot: true,
          requiredNetworkType: BackgroundFetch.NETWORK_TYPE_NONE, // Default
          requiresCharging: false,      // Default
          requiresDeviceIdle: false,    // Default
          requiresBatteryNotLow: false, // Default
          requiresStorageNotLow: false,  // Default
        },
        fetchEvent,
        (status: BackgroundFetchStatus) => {
          setDefaultStatus(getStatus(status));
          console.log('[js] RNBackgroundFetch status', getStatus(status), status);
        });
        onToggleEnabled(true);
        const list = await getData<Event[]>(eventsKey);
        list && setEvents(list);
    } catch (e) {
      console.warn('[js] BackgroundFetch could not configure', e);
    }
  };

  useEffect(() => {
    init();
  }, []);

  return (
    <>
      <StatusBar backgroundColor={backgroundColor} barStyle='dark-content' />
      <SafeAreaView style={[styles.body, styles.container, styles.flex1]}>
          <Header enabled={enabled} onToggleEnabled={onToggleEnabled} />
          <ScrollView
            contentInsetAdjustmentBehavior='automatic'
            style={[styles.paddingLR10, styles.container, styles.wide]}
          >
            {!events.length && (<Notice />)}
            {events.map((event, i) => (<EventItem key={`${i}:${event.timestamp}`} {...event} />))}
          </ScrollView>
          <Footer clear={clear} defaultStatus={defaultStatus} />
      </SafeAreaView>
    </>
  );
};

export default App;
