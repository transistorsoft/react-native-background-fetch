const path = require('path');
const fs = require('fs');
// unfortunately we can't use the 'plist' module at the moment for parsing
// because it has a few issues with empty strings and keys.
// There are several issues and PRs on that repository open though and hopefully
// we can revert back to only using one module once they're merged.
const plistParser = require('fast-plist');
const plistWriter = require('plist');

// The getBuildProperty method of the 'xcode' project is a bit naive in that it
// doesn't take a specific target but iterates over all of them and doesn't have
// an exit condition if a property has been found.
// Which in the case of react-native projects usually is the tvOS target because
// it comes last.
function getBuildProperty(project, property) {
    const firstTarget = project.getFirstTarget().firstTarget;
    const configurationList = project.pbxXCConfigurationList()[
        firstTarget.buildConfigurationList
    ];
    const defaultBuildConfiguration = configurationList.buildConfigurations.reduce(
        (acc, config) => {
            const buildSection = project.pbxXCBuildConfigurationSection()[
                config.value
            ];
            return buildSection.name ===
                configurationList.defaultConfigurationName
                ? buildSection
                : acc;
        }
    );

    return defaultBuildConfiguration.buildSettings[property];
}

function getPlistPath(sourceDir, project) {
    const plistFile = getBuildProperty(project, 'INFOPLIST_FILE');
    if (!plistFile) {
        return null;
    }
    return path.join(
        sourceDir,
        plistFile.replace(/"/g, '').replace('$(SRCROOT)', '')
    );
}

function readPlist(sourceDir, project) {
    const plistPath = getPlistPath(sourceDir, project);
    if (!plistPath || !fs.existsSync(plistPath)) {
        return null;
    }
    return plistParser.parse(fs.readFileSync(plistPath, 'utf-8'));
}

function writePlist(sourceDir, project, plist) {
    fs.writeFileSync(
        getPlistPath(sourceDir, project),
        plistWriter.build(plist)
    );
}

module.exports = {
    getBuildProperty: getBuildProperty,
    getPlistPath: getPlistPath,
    readPlist: readPlist,
    writePlist: writePlist
};