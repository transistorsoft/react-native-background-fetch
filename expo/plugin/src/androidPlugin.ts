import {
  AndroidConfig,
  ConfigPlugin,
  WarningAggregator,
  withProjectBuildGradle,
  withAppBuildGradle,
  withDangerousMod
} from '@expo/config-plugins';

import {
  mergeContents,
  removeContents,
} from "@expo/config-plugins/build/utils/generateCode";

type Props = {}

const MODULE_NAME = 'react-native-background-fetch';

const androidPlugin: ConfigPlugin<Props> = (config, props={}) => {
  config = withProjectBuildGradle(config, ({ modResults, ...subConfig }) => {
    if (modResults.language !== 'groovy') {
      WarningAggregator.addWarningAndroid(
        'withBackgroundGeolocation',
        `Cannot automatically configure project build.gradle if it's not groovy`,
      );
      return { modResults, ...subConfig };
    }

    modResults.contents = applyMavenUrl(modResults.contents);

    return { modResults, ...subConfig };
  });

  config = withAppBuildGradle(config, ({ modResults, ...subConfig }) => {
    if (modResults.language !== 'groovy') {
      WarningAggregator.addWarningAndroid(
        'withBackgroundGeolocation',
        `Cannot automatically configure project build.gradle if it's not groovy`,
      );
      return { modResults, ...subConfig };
    }

    modResults.contents = applyAppGradle(modResults.contents);

    return { modResults, ...subConfig };
  });

  return config;
};

const applyMavenUrl = (buildGradle: string):string => {
  return mergeContents({
    tag: `${MODULE_NAME}-maven`,
    src: buildGradle,
    newSrc: `\tmaven { url "\${project(":${MODULE_NAME}").projectDir}/libs" }`,
    anchor: /maven\s\{/,
    offset: 0,
    comment: "//",
  }).contents;
}

const applyAppGradle = (buildGradle:string) => {
  // Apply background-geolocation.gradle
  const newSrc = [];

  newSrc.push(`Project background_fetch = project(':${MODULE_NAME}')`)

  buildGradle = mergeContents({
    tag: `${MODULE_NAME}-project`,
    src: buildGradle,
    newSrc: newSrc.join("\n"),
    anchor: /android\s\{/,
    offset: 1,
    comment: "//",
  }).contents;

  buildGradle = mergeContents({
    tag: `${MODULE_NAME}-proguard`,
    src: buildGradle,
    newSrc: `\t    proguardFiles "\${background_fetch.projectDir}/proguard-rules.pro"`,
    anchor: /\"proguard-rules.pro\"/,
    offset: 1,
    comment: "//",
  }).contents;

  return buildGradle;

}

export default androidPlugin;

