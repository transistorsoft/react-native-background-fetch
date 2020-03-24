/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */

import React, {Component} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  Switch
} from 'react-native';

import {
  Header,
  LearnMoreLinks,
  Colors,
  DebugInstructions,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';

import BackgroundFetch from "react-native-background-fetch";

declare var global: {HermesInternal: null | {}};

type IProps = {
  navigation: any;
};
type IState = {
  enabled?: boolean;
};

class App extends Component<IProps, IState> {

  constructor(props:IProps) {
    super(props);

    this.state = {
      enabled: true,
    };
  }

  componentDidMount() {
    BackgroundFetch.configure({
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
    }, async (taskId) => {
      console.log("[js] Received background-fetch event: ", taskId);

      if (taskId === 'react-native-background-fetch') {
        BackgroundFetch.scheduleTask({
          taskId: 'com.transistorsoft.customtask',
          delay: 5000,
          stopOnTerminate: false,
          enableHeadless: true
        });
      }
      // Required: Signal completion of your task to native code
      // If you fail to do this, the OS can terminate your app
      // or assign battery-blame for consuming too much background-time
      BackgroundFetch.finish(taskId);
    }, (error) => {
      console.log("[js] RNBackgroundFetch failed to start");
    });
  }

  onToggleEnabled(value:boolean) {
    this.setState({
      enabled: value
    });
    if (value) {
      BackgroundFetch.start();
    } else {
      BackgroundFetch.stop();
    }
  }

  render() {
    return (
      <>
        <StatusBar barStyle="dark-content" />
        <SafeAreaView>
          <View style={{padding:10}}>
            <Switch value={this.state.enabled} onValueChange={this.onToggleEnabled.bind(this)} />
          </View>
        </SafeAreaView>
      </>
    );
  }
};

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: Colors.lighter,
  },
  engine: {
    position: 'absolute',
    right: 0,
  },
  body: {
    backgroundColor: Colors.white,
  },
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: Colors.black,
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
    color: Colors.dark,
  },
  highlight: {
    fontWeight: '700',
  },
  footer: {
    color: Colors.dark,
    fontSize: 12,
    fontWeight: '600',
    padding: 4,
    paddingRight: 12,
    textAlign: 'right',
  },
});

export default App;
