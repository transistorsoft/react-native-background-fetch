#!/usr/bin/env node

const path = require('path');
const fs = require('fs');
const xcode = require('xcode');
const PbxFile = require('xcode/lib/pbxFile');
const helpers = require('./xcode-helpers');

const projectDirectory = process.cwd();
const moduleDirectory = path.resolve(__dirname, '..');
const packageManifest = require(projectDirectory + '/package.json');

const projectConfig = {
    sourceDir: path.join(projectDirectory, 'ios'),
    pbxprojPath: path.join(
        projectDirectory,
        'ios',
        packageManifest.name + '.xcodeproj',
        'project.pbxproj'
    )
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
project.removeFromFrameworksPbxGroup(file);
project.removeFromPbxFrameworksBuildPhase(file);

helpers.removeFromFrameworkSearchPaths(
    project,
    '$(PROJECT_DIR)/' + path.relative(
        projectConfig.sourceDir,
        path.join(moduleDirectory, 'ios')
    )
);

// remove AppDelegate extension
const projectGroup = project.findPBXGroupKey({ name: packageManifest.name });
project.removeSourceFile(pathToAppdelegateExtension, {}, projectGroup);

// disable BackgroundModes and remove "fetch" mode from plist file
const targetAttributes = helpers.getTargetAttributes(project).SystemCapabilities;
delete targetAttributes['com.apple.BackgroundModes'].enabled;
if (Object.keys(targetAttributes['com.apple.BackgroundModes']).length === 0) {
    delete targetAttributes['com.apple.BackgroundModes'];
}
project.addTargetAttribute('SystemCapabilities', targetAttributes);
if (Object.keys(targetAttributes).length === 0) {
    project.removeTargetAttribute('SystemCapabilities');
}

const plist = helpers.readPlist(projectConfig.sourceDir, project);
plist.UIBackgroundModes = plist.UIBackgroundModes.filter(mode => mode !== 'fetch');
if (plist.UIBackgroundModes.length === 0) {
    delete plist.UIBackgroundModes;
}

helpers.writePlist(projectConfig.sourceDir, project, plist);
fs.writeFileSync(projectConfig.pbxprojPath, project.writeSync());
