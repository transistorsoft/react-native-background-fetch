import { ConfigPlugin, withPlugins } from '@expo/config-plugins';

// import androidPlugin from './androidPlugin';
// import iOSPlugin from './iOSPlugin';

/**
 * Expo config plugin for react-native-background-fetch.
 *
 * Currently a no-op: TSBackgroundFetch now calls didFinishLaunching
 * autonomously on iOS, and Android dependencies resolve via Maven Central.
 *
 * This stub keeps the plugin infrastructure in place so future platform
 * configuration (permissions, Info.plist keys, etc.) can be added without
 * breaking existing app.json entries:
 *
 *   "plugins": ["react-native-background-fetch"]
 */
const withBackgroundFetch: ConfigPlugin<{} | void> = (config, _props) => {
  return config;
};

export default withBackgroundFetch;
