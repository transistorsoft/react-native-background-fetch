// swift-tools-version: 6.0
import PackageDescription

// React Native's experimental Swift Package Manager app mode (`npx react-native spm`; verified on 0.88.1).
// CocoaPods apps ignore this file and use RNBackgroundFetch.podspec.
//
// The two React Native paths below are not relative to this file. RN's autolinker symlinks
// <app>/ios/build/generated/autolinking/libs/RNBackgroundFetch -> this ios/ directory, and
// SwiftPM resolves them from that symlink. The package and product name must equal
// package.json "swiftpmConfig.name". (WO-001)
let package = Package(
    name: "RNBackgroundFetch",
    platforms: [.iOS(.v15)],
    products: [
        .library(name: "RNBackgroundFetch", targets: ["RNBackgroundFetch"]),
    ],
    dependencies: [
        .package(name: "ReactNative", path: "../../../../xcframeworks"),
        .package(name: "React-GeneratedCode", path: "../../../ios"),
        // Lower bound 4.1.0, not 4.2.0: TSLocationManager 4.8.x allows only TSBackgroundFetch 4.1.x. (WO-001)
        .package(url: "https://github.com/transistorsoft/transistor-background-fetch.git", from: "4.1.0"),
    ],
    targets: [
        .target(
            name: "RNBackgroundFetch",
            dependencies: [
                .product(name: "ReactHeaders", package: "ReactNative"),
                .product(name: "ReactNativeHeaders", package: "ReactNative"),
                .product(name: "ReactNativeDependenciesHeaders", package: "ReactNative"),
                .product(name: "ReactAppHeaders", package: "React-GeneratedCode"),
                .product(name: "TSBackgroundFetch", package: "transistor-background-fetch"),
            ],
            path: "RNBackgroundFetch",
            exclude: ["RNBackgroundFetch+AppDelegate.m"],
            sources: ["RNBackgroundFetch.mm"],
            publicHeadersPath: ".",
            // RN's SwiftPM pipeline does not define this (only CocoaPods does); without it the
            // module silently falls back to the legacy interop layer instead of a TurboModule. (WO-001)
            cSettings: [.define("RCT_NEW_ARCH_ENABLED", to: "1")],
            cxxSettings: [
                .define("RCT_NEW_ARCH_ENABLED", to: "1"),
                .define("DEBUG", .when(configuration: .debug)),
                .define("NDEBUG", .when(configuration: .release)),
            ],
            linkerSettings: [
                .linkedFramework("UIKit"),
                .linkedFramework("Foundation"),
                .linkedFramework("BackgroundTasks"),
            ]
        ),
    ],
    cxxLanguageStandard: .cxx20
)
