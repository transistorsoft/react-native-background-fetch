import React, { FC } from 'react';

import {
  Text,
  View,
  Button,
} from 'react-native';

import styles from '../utils/styles';

type IProps = {
  enabled: boolean;
  clear: () => void
};

const Footer: FC<IProps> = ({ enabled, clear }: IProps) => {

  return (
    <View style={[styles.padding10, styles.row, styles.footer]}>
      <View style={[styles.wide, styles.row, styles.center]}>
        <Text style={[styles.text, styles.bold]}>Status: </Text>
        <Text style={[styles.text]}>{enabled ? 'enabled' : 'disabled'}</Text>
      </View>

      <Button onPress={clear} title='Clear' />
    </View>
  );
}

export default Footer;
