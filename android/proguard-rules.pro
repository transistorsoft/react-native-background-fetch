# [react-native-background-fetch]
-keep class com.transistorsoft.rnbackgroundfetch.HeadlessTask { *; }

# for react-native Headless on new architecture
-keep class com.facebook.react.defaults.DefaultNewArchitectureEntryPoint {
  public <methods>;
}
-keep class com.facebook.react.ReactApplication {
  public <methods>;
}
-keep class com.facebook.react.ReactHost {
  public <methods>;
}
-keep class * extends com.facebook.react.ReactHost {
  public <methods>;
}
-keep class com.facebook.react.fabric.** { *; }

