import React, { FC } from 'react';

import {
  Text,
  View,
  Switch,
} from 'react-native';

import styles from '../utils/styles';

type IProps = {
  enabled: boolean;
  onToggleEnabled: (value: boolean) => Promise<void>
};

const Header: FC<IProps> = ({ enabled, onToggleEnabled }: IProps) => {

  return (
    <View style={[styles.padding10, styles.row, styles.header, styles.center]}>
      <Text style={[styles.title, styles.textCenter, styles.wide]}>BackgroundFetch Example</Text>
      <Switch style={[styles.absolute, styles.rightTop]} value={enabled} onValueChange={onToggleEnabled} />
    </View>
  );
};

export default Header;
