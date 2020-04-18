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
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  Switch,
  Button
} from 'react-native';

import { Event } from './types';
import { storeData, getData, eventsKey } from './storage';
import { timeStr } from './helpers';
import EventItem from './EventItem';

import BackgroundFetch, { BackgroundFetchStatus } from 'react-native-background-fetch';

declare var global: { HermesInternal: null | {} };
const toggleFetch = (value:boolean) => {
  if (value) {
    return BackgroundFetch.start();
  } else {
    return BackgroundFetch.stop();
  }
}
const scheduleTask = async (name: string) => {
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
const backgroundColor = '#fedd1e';
type IProps = {
  navigation: any;
};

const App: FC<IProps> = (props: IProps) => {
  const [enabled, setEnabled] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [events, setEvents] = useState([] as Event[]);

  const clear = () => {
    events.splice(0, events.length);
    setEvents([]);
    storeData(eventsKey, events);
  }
  const onToggleEnabled = async (value:boolean) => {
    setDisabled(true);
    try {
      await toggleFetch(value);
      setEnabled(value);
    } catch (e) {
      console.warn(`[js] BackgroundFetch ${value ? 'start' : 'stop'} falied`, e);
    }
    setDisabled(false);
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
          <View style={[styles.padding10, styles.row, styles.header, styles.center]}>
            <Text style={[styles.title, styles.textCenter, styles.wide]}>BackgroundFetch Example</Text>
            <Switch style={[styles.absolute, styles.rightTop]} value={enabled} disabled={disabled} onValueChange={onToggleEnabled} />
          </View>
          <ScrollView
            contentInsetAdjustmentBehavior='automatic'
            style={[styles.paddingLR10, styles.container, styles.wide]}
          >
            {!events.length && (<View style={[styles.padding10, styles.center]}>
              <Text style={[styles.textCenter, styles.text]}>* Listening for events.</Text>
              <Text style={[styles.textCenter, styles.text]}>Plese see README "Debugging" to learn how to simulate events</Text>
            </View>)}
            {events.map((event, i) => (<EventItem key={`${i}:${event.timestamp}`} styles={styles} {...event} />))}
          </ScrollView>
          <View style={[styles.padding10, styles.row, styles.footer]}>
            <View style={[styles.wide, styles.row, styles.center]}>
              <Text style={[styles.text, styles.bold]}>Status: </Text>
              <Text style={[styles.text]}>{enabled ? 'enabled' : 'disabled'}</Text>
            </View>

            <Button onPress={clear} title='Clear' />
          </View>
      </SafeAreaView>
    </>
  );
};

BackgroundFetch.onFetch(() => {
  console.info('[js] BackgroundFetch fetch');
});

const styles = StyleSheet.create({
  padding10: {
    padding: 10,
  },
  absolute: {
    position: 'absolute',
  },
  rightTop: {
    top: 10,
    right: 10,
  },
  bold: {
    fontWeight: '700',
  },
  blue: {
    color: '#2188E5',
  },
  borderBottom: {
    borderStyle: 'solid',
    borderColor: '#9B9C9C',
    borderBottomWidth: 1,
  },
  center: {
    alignSelf: 'center',
  },
  textCenter: {
    textAlign: 'center',
  },
  paddingTB10: {
    paddingTop: 10,
    paddingBottom: 10,
  },
  paddingLR10: {
    paddingLeft: 10,
    paddingRight: 10,
  },
  wide: { flex: 20 },
  flex1: { flex: 1 },
  header: {
    backgroundColor,
  },
  text: {
    color: '#000',
  },
  footer: { justifyContent: 'flex-end' },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: '#000',
  },
  body: {
    backgroundColor: '#fff',
    justifyContent: 'center',
  },
  container: {
    flexDirection: 'column',
  },
  border: {
    borderStyle: 'solid',
    borderColor: 'red',
    borderWidth: 1,
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'stretch',
  },
});

export default App;
