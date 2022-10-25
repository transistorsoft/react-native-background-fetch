import {
  ConfigPlugin,
  withAppDelegate
} from "@expo/config-plugins";
import { mergeContents } from "@expo/config-plugins/build/utils/generateCode";


type Props = {}

export const iOSPlugin: ConfigPlugin<Props> = (config, props={}) => {
  config = applyAppDelegate(config, props);
  return config;
};

const applyAppDelegate:ConfigPlugin<Props> = (config, props) => {
	return withAppDelegate(config, (config) => {
		config.modResults.contents = applyDidFinishLaunchingWithOptions(config.modResults.contents);
		config.modResults.contents = applyAppDelegateImport(config.modResults.contents);
		return config;
	});
}

const applyDidFinishLaunchingWithOptions = (src: string) => {
  let newSrc = [];
  newSrc.push(
    "  [[TSBackgroundFetch sharedInstance] didFinishLaunching];"
  );

  newSrc = newSrc.filter(Boolean);

  return mergeContents({
    tag: "react-native-background-fetch-didFinishLaunchingWithOptions",
    src,
    newSrc: newSrc.join("\n"),
    anchor: "didFinishLaunchingWithOptions:launchOptions];",
    offset: -1,
    comment: "//",
  }).contents;
}

const applyAppDelegateImport = (src: string) => {
  const newSrc = [];
  newSrc.push(
    "#import <TSBackgroundFetch/TSBackgroundFetch.h>",
  );

  return mergeContents({
    tag: "react-native-background-fetch-import",
    src,
    newSrc: newSrc.join("\n"),
    anchor: /#import "AppDelegate\.h"/,
    offset: 1,
    comment: "//",
  }).contents;
}

export default iOSPlugin;
