import React, { FC } from 'react';

import {
  Text,
  View,
} from 'react-native';

import styles from '../utils/styles';

const Notice: FC = () => {

  return (
    <View style={[styles.padding10, styles.center]}>
      <Text style={[styles.textCenter, styles.text]}>Listening for events</Text>
      <Text style={[styles.textCenter, styles.text]}>Plese see README "Debugging" to learn how to simulate events</Text>
    </View>
  );
};

export default Notice;
