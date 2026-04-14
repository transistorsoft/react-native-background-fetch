#!/bin/sh

adb shell cmd jobscheduler run -f com.transistorsoft.fetch.expo.demo 999

# (lldb)
# e -l objc -- (void)[[BGTaskScheduler sharedScheduler] _simulateLaunchForTaskWithIdentifier:@"com.transistorsoft.fetch"]
