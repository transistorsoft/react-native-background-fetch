import React, { useState, FC, useEffect } from 'react';

import {
  Text,
  View,
  Button,
} from 'react-native';
import {
  BackgroundFetchStatus,
  status as BGStatus,
} from 'react-native-background-fetch';

import { styles, status as getStatus } from '../utils';

type IProps = {
  clear: () => void,
  defaultStatus: string,
};

const Footer: FC<IProps> = ({ clear, defaultStatus = 'unknown' }: IProps) => {
  const [currentStatus, setStatus] = useState(defaultStatus);
  const checkAccess = async () => {
    const status: BackgroundFetchStatus = await BGStatus();
    status && setStatus(getStatus(status));
  };

  useEffect(() => {
    checkAccess();
  }, [])

  return (
    <View style={[styles.padding10, styles.row, styles.footer]}>
      <Button onPress={checkAccess} title='Status' />

      <View style={[styles.wide, styles.row, styles.center, styles.textCenter]}>
        <Text style={[styles.text, styles.bold]}>Status: </Text>
        <Text style={[styles.text]}>{currentStatus}</Text>
      </View>

      <Button onPress={clear} title='Clear' />
    </View>
  );
};

export default Footer;
