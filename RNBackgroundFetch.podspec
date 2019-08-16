require 'json'

package = JSON.parse(File.read(File.join(__dir__, 'package.json')))

Pod::Spec.new do |s|
  s.name                = 'RNBackgroundFetch'
  s.version             = package['version']
  s.summary             = package['description']
  s.description         = <<-DESC
    iOS BackgroundFetch API Implementation
  DESC
  s.homepage            = package['homepage']
  s.license             = package['license']
  s.author              = package['author']
  s.source              = { :git => 'https://github.com/transistorsoft/react-native-background-fetch.git', :tag => s.version }

  s.requires_arc        = true
  s.platform            = :ios, '8.0'

  s.dependency 'React'
  s.preserve_paths      = 'docs', 'CHANGELOG.md', 'LICENSE', 'package.json', 'RNBackgroundFetch.ios.js'
  s.source_files        = 'ios/RNBackgroundFetch/RNBackgroundFetch.h', 'ios/RNBackgroundFetch/RNBackgroundFetch.m'
  s.vendored_frameworks = 'ios/RNBackgroundFetch/TSBackgroundFetch.framework'
end
