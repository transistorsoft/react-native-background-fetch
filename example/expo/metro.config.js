const path = require('path');
const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Absolute path to the local library
const libraryRoot = path.resolve(__dirname, '../../');

// Watch the library source for live changes
config.watchFolders = [libraryRoot];

// Resolve modules from the app's node_modules first, falling back for everything else
config.resolver.extraNodeModules = new Proxy(
  {
    'react': path.resolve(__dirname, 'node_modules/react'),
    'react-native': path.resolve(__dirname, 'node_modules/react-native'),
  },
  {
    get: (target, name) =>
      name in target
        ? target[name]
        : path.join(__dirname, `node_modules/${name}`),
  },
);

// Prevent Metro from crawling the library's nested RN
config.resolver.blockList = [
  new RegExp(
    libraryRoot.replace(/[/\\]/g, '[\\/\\\\]') +
      '[\\/\\\\]node_modules[\\/\\\\]react-native[\\/\\\\].+'
  ),
];

module.exports = config;
