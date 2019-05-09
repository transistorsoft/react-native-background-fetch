#!/usr/bin/env node

const path = require('path');
const fs = require('fs');
const xcode = require('xcode');
const PbxFile = require('xcode/lib/pbxFile');
const helpers = require('./xcode-helpers');

const projectDirectory = process.cwd();
const moduleDirectory = path.resolve(__dirname, '..');
const sourceDirectory = path.join(projectDirectory, 'ios');
const xcodeProjectDirectory = helpers.findProject(sourceDirectory);

const projectConfig = {
  sourceDir: sourceDirectory,
  pbxprojPath: path.join(
    projectDirectory,
    'ios',
    xcodeProjectDirectory,
    'project.pbxproj'
  ),
};

const pathToFramework = path.relative(
  projectConfig.sourceDir,
  path.join(
    moduleDirectory,
    'ios',
    'RNBackgroundFetch',
    'TSBackgroundFetch.framework'
  )
);
const pathToAppdelegateExtension = path.relative(
  projectConfig.sourceDir,
  path.join(
    moduleDirectory,
    'ios',
    'RNBackgroundFetch',
    'RNBackgroundFetch+AppDelegate.m'
  )
);


const project = xcode.project(projectConfig.pbxprojPath).parseSync();
// Monkey-patch XCode to search PBXGroups with ignore-case.
project.findPBXGroupKeyAndType = helpers.findPBXGroupKeyAndType;

const file = new PbxFile(pathToFramework);
file.target = project.getFirstTarget().uuid;

project.removeFromPbxBuildFileSection(file);
project.removeFromPbxFileReferenceSection(file);
if (project.pbxGroupByName('Frameworks')) {
  project.removeFromFrameworksPbxGroup(file);
}
project.removeFromPbxFrameworksBuildPhase(file);

const podFile = path.join(sourceDirectory, 'Podfile');
const hasPodfile = fs.existsSync(podFile);

if (!hasPodfile) {
  helpers.removeFromFrameworkSearchPaths(
    project,
    '$(PROJECT_DIR)/' +
    path.relative(
      projectConfig.sourceDir,
      path.join(moduleDirectory, 'ios')
    )
  );
}

// disable BackgroundModes and remove "fetch" mode from plist file
const systemCapabilities = helpers.getTargetAttributes(project).SystemCapabilities;
if (systemCapabilities && systemCapabilities['com.apple.BackgroundModes']) {
  delete systemCapabilities['com.apple.BackgroundModes'].enabled;
  if (Object.keys(systemCapabilities['com.apple.BackgroundModes']).length === 0) {
    delete systemCapabilities['com.apple.BackgroundModes'];
  }

  if (Object.keys(systemCapabilities).length === 0) {
    project.removeTargetAttribute('SystemCapabilities');
  }
}

const plist = helpers.readPlist(projectConfig.sourceDir, project);
if (Array.isArray(plist.UIBackgroundModes)) {
  plist.UIBackgroundModes = plist.UIBackgroundModes.filter(
    mode => mode !== 'fetch'
  );
  if (plist.UIBackgroundModes.length === 0) {
    delete plist.UIBackgroundModes;
  }
}

// remove RNBackgroundFetch+AppDelegate extension
const groupName = xcodeProjectDirectory.replace('.xcodeproj', '');
var projectGroup = project.findPBXGroupKey({ name: groupName }) || project.findPBXGroupKey({path: groupName});

if (projectGroup) {
  project.removeSourceFile(
    pathToAppdelegateExtension,
    { target: project.getFirstTarget().uuid },
    projectGroup
  );
} else {
  var red = "\x1b[31m";
  var yellow = "\x1b[33m"
  var colorReset = '\x1b[0m';
  console.log(yellow, project.hash.project.objects.PBXGroup);
  console.error(red, '[react-native-background-fetch] UNLINK ERROR: Failed to find projectGroup PBXGroup: ', groupName);
  console.error(red, '[react-native-background-fetch] Failed to remove RNBackgroundFetch+AppDelegate.m.  See Manual Setup instructions to remove this file from your project.');
  console.error(red, '[react-native-bacgkround-fetch] Please post an issue at Github, including all the output above');
  console.error(colorReset);
}

helpers.writePlist(projectConfig.sourceDir, project, plist);
fs.writeFileSync(projectConfig.pbxprojPath, project.writeSync());

////
// Android
// - Remove maven url
//     maven {
//         url "$rootDir/../node_modules/react-native-background-fetch/android/libs"
//     }
//
const androidSrcDir = path.join(projectDirectory, 'android');
const gradleFile = path.join(androidSrcDir, 'build.gradle');
const moduleName = (process.platform === 'win32') ? moduleDirectory.split('\\').pop() : moduleDirectory.split('/').pop();

fs.readFile(gradleFile, 'utf8', function (err,data) {
  if (err) {
    return console.log(err);
  }
  var re = new RegExp("[\\t?\\s?]+maven\\s?\\{[\\n?\\s?\\t?]+url.*" + moduleName + "\\/.*[\\n?\\t?\\s?]+\\}", "gm");

  if (data.match(re)) {
    fs.writeFile(gradleFile, data.replace(re, ''), 'utf8', function (err) {
      if (err) return console.log(err);
    });
  }
});

