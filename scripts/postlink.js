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
file.uuid = project.generateUuid();
file.fileRef = project.generateUuid();
file.path = pathToFramework;
file.target = project.getFirstTarget().uuid;

if (!project.hasFile(file.path)) {
    project.addToPbxBuildFileSection(file);
    project.addToPbxFileReferenceSection(file);
    // addToFrameworksPbxGroup crashes when it can't find a group named "Frameworks"
    if (!project.pbxGroupByName('Frameworks')) {
        project.addPbxGroup([], 'Frameworks');
    }
    project.addToFrameworksPbxGroup(file);
    project.addToPbxFrameworksBuildPhase(file);
}

helpers.addToFrameworkSearchPaths(
    project,
    '$(PROJECT_DIR)/' + path.relative(
        projectConfig.sourceDir,
        path.join(moduleDirectory, 'ios')
    ),
    true
);

// extends the projects AppDelegate.m with our completion handler
const projectGroup = project.findPBXGroupKey({ name: packageManifest.name });
project.addSourceFile(pathToAppdelegateExtension, {}, projectGroup);

// enable BackgroundModes and add "fetch" as a mode to plist file
const targetAttributes = helpers.getTargetAttributes(project);
project.addTargetAttribute('SystemCapabilities', Object.assign(
    {},
    targetAttributes,
    {
        'com.apple.BackgroundModes': Object.assign(
            {},
            (targetAttributes['com.apple.BackgroundModes'] || {}),
            { enabled: true }
        )
    }
));
const plist = helpers.readPlist(projectConfig.sourceDir, project);
const UIBackgroundModes = plist.UIBackgroundModes || [];
if (UIBackgroundModes.indexOf('fetch') === -1) {
    plist.UIBackgroundModes = UIBackgroundModes.concat('fetch');
}

helpers.writePlist(projectConfig.sourceDir, project, plist);
fs.writeFileSync(projectConfig.pbxprojPath, project.writeSync());
