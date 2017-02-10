#!/usr/bin/env node

const path = require('path');
const fs = require('fs');
const xcode = require('xcode');
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
// hacky, but the implementation of the productName getter reads only the first
// project name, which for RN projects usually is "$(TARGET_NAME)".
// There are a few issues and PRs at the xcode project open, but it seems a bit
// stale.
project.productName = packageManifest.name;

const firstTarget = project.getFirstTarget();

project.removeFramework(pathToFramework, {
    customFramework: true,
    target: firstTarget.uuid
});

// extends the projects AppDelegate.m with our completion handler
const projectGroup = project.findPBXGroupKey({ name: packageManifest.name });
project.removeSourceFile(pathToAppdelegateExtension, {}, projectGroup);

// enable BackgroundModes and add "fetch" as mode
project.removeTargetAttribute('SystemCapabilities');
const plist = helpers.readPlist(projectConfig.sourceDir, project);
delete plist.UIBackgroundModes;
helpers.writePlist(projectConfig.sourceDir, project, plist);
fs.writeFileSync(projectConfig.pbxprojPath, project.writeSync());
