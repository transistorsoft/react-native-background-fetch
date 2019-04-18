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

// remove AppDelegate extension
const groupName = xcodeProjectDirectory.replace('.xcodeproj', '');
const projectGroup = project.findPBXGroupKey({ name: groupName });
project.removeSourceFile(
    pathToAppdelegateExtension,
    { target: project.getFirstTarget().uuid },
    projectGroup
);

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

helpers.writePlist(projectConfig.sourceDir, project, plist);
fs.writeFileSync(projectConfig.pbxprojPath, project.writeSync());

////
// Android
// - Remove maven url
//     maven {
//         url "$rootDir/../node_modules/react-native-background-geolocation/android/libs"
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

