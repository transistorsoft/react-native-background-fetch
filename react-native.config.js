module.exports = {
  // config for a library is scoped under "dependency" key
  dependency: {
    platforms: {
      ios: {},
      android: {}, // projects are grouped into "platforms"
    },
    assets: [],
    // hooks are considered anti-pattern, please avoid them
    hooks: {
      "postlink": "node node_modules/react-native-background-fetch/scripts/postlink.js",
      "postunlink": "node node_modules/react-native-background-fetch/scripts/postunlink.js"
    },
  },
};
