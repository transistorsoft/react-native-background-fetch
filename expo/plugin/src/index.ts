import { ConfigPlugin, withPlugins } from '@expo/config-plugins';

import androidPlugin from './androidPlugin';
import iOSPlugin from "./iOSPlugin";

const withBackgroundFetch: ConfigPlugin<{} | void> = (config, _props) => {
  const props = _props || {};

  return withPlugins(config, [
    [androidPlugin, {}],
    [iOSPlugin, {}]
  ]);
};

export default withBackgroundFetch;
