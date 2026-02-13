import {
  ConfigPlugin,
  IOSConfig,
  WarningAggregator,
  withAppDelegate,
} from "@expo/config-plugins";

import { AppDelegateProjectFile } from '@expo/config-plugins/build/ios/Paths';

import { mergeContents } from "@expo/config-plugins/build/utils/generateCode";

type Props = {}

export const iOSPlugin: ConfigPlugin<Props> = (config, props={}) => {

  return withAppDelegate(config, (config) => {

    const fileInfo = IOSConfig.Paths.getAppDelegate(config.modRequest.projectRoot);

    console.log(`[react-native-background-fetch] configuring AppDelegate (${fileInfo.language})`);

    switch (fileInfo.language) {
      case 'objc':
      case 'objcpp':
        config.modResults.contents = modifyObjcAppDelegate(config.modResults.contents);
        break;
      case 'swift':
        config.modResults.contents = modifySwiftAppDelegate(config.modResults.contents);
        break;
      default:
        throw new Error(`[react-native-background-fetch] Cannot configure AppDelegate for language "${fileInfo.language}"`);
    }

    return config;
  });

};

const modifyObjcAppDelegate = (src:string) => {
  // 1.  import TSBackgroundFetch
  src = mergeContents({
    tag: "react-native-background-fetch-import",
    src,
    newSrc: "#import <TSBackgroundFetch/TSBackgroundFetch.h>",
    anchor: "@implementation AppDelegate",
    offset: -1,
    comment: "//",
  }).contents;

  // 2.  TSBackgroundFetch.sharedInstance().didFinishLaunching();
  src = mergeContents({
    tag: "react-native-background-fetch-didFinishLaunching",
    src,
    newSrc: "  [[TSBackgroundFetch sharedInstance] didFinishLaunching];",
    anchor: "didFinishLaunchingWithOptions:launchOptions];",
    offset: -1,
    comment: "//",
  }).contents;

  return src;
}

const modifySwiftAppDelegate = (src:string) => {
  // 1.  import TSBackgroundFetch
  src = mergeContents({
    tag: "react-native-background-fetch-import",
    src,
    newSrc: "import TSBackgroundFetch",
    anchor: /@(UIApplication)?main/,
    offset: -1,
    comment: "//",
  }).contents;

  // 2.  TSBackgroundFetch.sharedInstance().didFinishLaunching();
  src = mergeContents({
    tag: "react-native-background-fetch-didFinishLaunching",
    src,
    newSrc: "    TSBackgroundFetch.sharedInstance().didFinishLaunching();",
    anchor: /return super.*didFinishLaunchingWithOptions.*/,
    offset: -1,
    comment: "//",
  }).contents;

  return src;
}

export default iOSPlugin;
