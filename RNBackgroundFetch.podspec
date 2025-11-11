require 'json'

package = JSON.parse(File.read(File.join(__dir__, 'package.json')))

Pod::Spec.new do |s|
  s.cocoapods_version   = '>= 1.10.0'
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
  s.ios.deployment_target = '12.0'
  
  s.dependency 'React-Core'
  s.dependency 'TSBackgroundFetch', '~> 4.0.0'

  s.preserve_paths      = 'docs', 'CHANGELOG.md', 'LICENSE', 'package.json', 'RNBackgroundFetch.ios.js'
  s.source_files        = 'ios/RNBackgroundFetch/**/*.{h,m}'

  s.resource_bundles = {'TSBackgroundFetchPrivacy' => ['ios/Resources/PrivacyInfo.xcprivacy']}
end
