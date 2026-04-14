import React from 'react';
import {
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
  Switch,
  Button,
  Alert,
} from 'react-native';
import {SafeAreaProvider, SafeAreaView} from 'react-native-safe-area-context';

import BackgroundFetch from 'react-native-background-fetch';

import Event from './src/Event';

const Colors = {
  gold: '#fedd1e',
  black: '#000',
  white: '#fff',
  lightGrey: '#ccc',
  blue: '#337AB7',
};

const App = () => {
  const [enabled, setEnabled] = React.useState(false);
  const [status, setStatus] = React.useState(-1);
  const [events, setEvents] = React.useState<Event[]>([]);

  React.useEffect(() => {
    initBackgroundFetch();
    loadEvents();
  }, []);

  const initBackgroundFetch = async () => {
    const status = await BackgroundFetch.configure(
      {
        minimumFetchInterval: 15,
        stopOnTerminate: false,
        enableHeadless: true,
        startOnBoot: true,
        forceAlarmManager: false,
        requiredNetworkType: BackgroundFetch.NETWORK_TYPE_NONE,
        requiresCharging: false,
        requiresDeviceIdle: false,
        requiresBatteryNotLow: false,
        requiresStorageNotLow: false,
      },
      async (taskId: string) => {
        console.log('[BackgroundFetch] taskId', taskId);
        const event = await Event.create(taskId, false);
        setEvents(prev => [...prev, event]);
        BackgroundFetch.finish(taskId);
      },
      (taskId: string) => {
        console.log('[Fetch] TIMEOUT taskId:', taskId);
        BackgroundFetch.finish(taskId);
      },
    );
    setStatus(status);
    setEnabled(true);
  };

  const loadEvents = () => {
    Event.all()
      .then(data => {
        setEvents(data);
      })
      .catch(error => {
        Alert.alert(
          'Error',
          'Failed to load data from AsyncStorage: ' + error,
        );
      });
  };

  const onClickToggleEnabled = (value: boolean) => {
    setEnabled(value);
    if (value) {
      BackgroundFetch.start();
    } else {
      BackgroundFetch.stop();
    }
  };

  const onClickStatus = () => {
    BackgroundFetch.status().then((s: number) => {
      let statusConst = '';
      switch (s) {
        case BackgroundFetch.STATUS_AVAILABLE:
          statusConst = 'STATUS_AVAILABLE';
          break;
        case BackgroundFetch.STATUS_DENIED:
          statusConst = 'STATUS_DENIED';
          break;
        case BackgroundFetch.STATUS_RESTRICTED:
          statusConst = 'STATUS_RESTRICTED';
          break;
      }
      Alert.alert('BackgroundFetch.status()', `${statusConst} (${s})`);
    });
  };

  const onClickScheduleTask = () => {
    BackgroundFetch.scheduleTask({
      taskId: 'com.transistorsoft.customtask',
      delay: 5000,
      forceAlarmManager: true,
    })
      .then(() => {
        Alert.alert('scheduleTask', 'Scheduled task with delay: 5000ms');
      })
      .catch(error => {
        Alert.alert('scheduleTask ERROR', error);
      });
  };

  const onClickClear = () => {
    Event.destroyAll();
    setEvents([]);
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="light-content" backgroundColor={Colors.gold} />
        <View style={styles.container}>
          <View style={styles.toolbar}>
            <Text style={styles.title}>BGFetch Demo</Text>
            <Switch value={enabled} onValueChange={onClickToggleEnabled} />
          </View>
          <ScrollView
            contentInsetAdjustmentBehavior="automatic"
            style={styles.eventList}>
            {events.length === 0 ? (
              <Text style={styles.emptyText}>
                Waiting for BackgroundFetch events...
              </Text>
            ) : (
              events
                .slice()
                .reverse()
                .map(event => (
                  <View key={event.key} style={styles.event}>
                    <View style={styles.eventRow}>
                      <Text style={styles.taskId}>
                        {event.taskId}{' '}
                        {event.isHeadless ? '[Headless]' : ''}
                      </Text>
                    </View>
                    <Text style={styles.timestamp}>{event.timestamp}</Text>
                  </View>
                ))
            )}
          </ScrollView>
          <View style={styles.toolbar}>
            <Button title={'status: ' + status} onPress={onClickStatus} />
            <Text> </Text>
            <Button title="scheduleTask" onPress={onClickScheduleTask} />
            <View style={styles.spacer} />
            <Button title="clear" onPress={onClickClear} />
          </View>
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.gold,
  },
  container: {
    flexDirection: 'column',
    flex: 1,
  },
  title: {
    fontSize: 24,
    flex: 1,
    fontWeight: 'bold',
    color: Colors.black,
  },
  eventList: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  emptyText: {
    padding: 10,
    fontSize: 16,
  },
  event: {
    padding: 10,
    borderBottomWidth: 1,
    borderColor: Colors.lightGrey,
  },
  eventRow: {
    flexDirection: 'row',
  },
  taskId: {
    color: Colors.blue,
    fontSize: 16,
    fontWeight: 'bold',
  },
  timestamp: {
    color: Colors.black,
  },
  toolbar: {
    height: 57,
    flexDirection: 'row',
    paddingLeft: 10,
    paddingRight: 10,
    alignItems: 'center',
    backgroundColor: Colors.gold,
  },
  spacer: {
    flex: 1,
  },
});

export default App;
