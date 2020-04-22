import React, { FC } from 'react';

import {
  Text,
  View,
} from 'react-native';

import styles from '../utils/styles';
import { Event } from '../types';

type IProps = {
  isHeadless: Event['isHeadless'];
  taskId: Event['taskId'];
  timestamp: Event['timestamp'];
};

const EventItem: FC<IProps> = ({ taskId, timestamp, isHeadless }: IProps) => {

  return (
    <View style={[styles.container, styles.borderBottom, styles.paddingTB10]}>
      <Text style={[styles.text, styles.blue]}>
        [{taskId}]
      </Text>
      <Text style={[styles.text]}>
        {timestamp} {isHeadless ? '[Headless]': ''}
      </Text>
    </View>
  );
}



export default EventItem;
