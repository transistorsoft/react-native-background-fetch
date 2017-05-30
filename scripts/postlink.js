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

/**
 * There is a method in node-xcode that offers similar functionality than what
 * is implemented below `addFramework` (https://github.com/alunny/node-xcode/blob/ffb938b/lib/pbxProject.js#L300)
 * but unfortunately it won't work for our use-case because there are two other
 * methods in node-xcode that are being used by `addFramework` that don't work
 * as expected:
 * 1 `addToFrameworksPbxGroup` fails if no group with the name "Frameworks" exists
 *  https://github.com/alunny/node-xcode/blob/ffb938b/lib/pbxProject.js#L641
 *  - https://github.com/alunny/node-xcode/issues/43
 *  - this issue could be worked around by just checking if the group exists and
 *    creating it if it doesn't exist before executing `addFramework`
 * 2 `addToFrameworkSearchPaths` doesn't work with react-native:
 *  https://github.com/alunny/node-xcode/blob/ffb938b/lib/pbxProject.js#L1125
 *  - https://github.com/alunny/node-xcode/issues/91
 *  - https://github.com/alunny/node-xcode/pull/99
 *  - the issue there is that https://github.com/alunny/node-xcode/blob/ffb938b/lib/pbxProject.js#L1133
 *    in react-native projects the "PRODUCT_NAME" is "$(TARGET_NAME)", so it won't
 *    be visited by this method.
 *    And even if the name would be correct it still wouldn't work correctly for
 *    react-native projects, because not all targets should get the library added
 *    for example: react-native creates *tests and *tvOs and *tvOstests targets.
 */
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
    '$(PROJECT_DIR)/' +
    path.relative(
        projectConfig.sourceDir,
        path.join(moduleDirectory, 'ios')
    ),
    true
);

// extends the projects AppDelegate.m with our completion handler
const projectGroup = project.findPBXGroupKey({ name: packageManifest.name });
project.addSourceFile(
    pathToAppdelegateExtension,
    { target: project.getFirstTarget().uuid },
    projectGroup
);

// enable BackgroundModes in xcode project without overriding any previously
// defined values in the project file.
// That's why we deep clone all previously defined target attributes and extend
// them with our target attributes.
const targetAttributes = helpers.getTargetAttributes(project);
const systemCapabilities = Object.assign({}, (targetAttributes.SystemCapabilities || {}), {
    'com.apple.BackgroundModes': Object.assign(
        {},
        targetAttributes['com.apple.BackgroundModes'] || {},
        { enabled: true }
    ),
});
if (targetAttributes.SystemCapabilities) {
    targetAttributes.SystemCapabilities = systemCapabilities;
} else {
    project.addTargetAttribute('SystemCapabilities', systemCapabilities);
}

// add "fetch" background mode to Info.plist file
const plist = helpers.readPlist(projectConfig.sourceDir, project);
const UIBackgroundModes = plist.UIBackgroundModes || [];
if (UIBackgroundModes.indexOf('fetch') === -1) {
    plist.UIBackgroundModes = UIBackgroundModes.concat('fetch');
}

helpers.writePlist(projectConfig.sourceDir, project, plist);
fs.writeFileSync(projectConfig.pbxprojPath, project.writeSync());
