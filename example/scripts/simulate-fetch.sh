#!/bin/sh

adb shell cmd jobscheduler run -f com.example 999
adb shell am broadcast -a com.example.event.BACKGROUND_FETCH

# (lldb)
# e -l objc -- (void)[[BGTaskScheduler sharedScheduler] _simulateLaunchForTaskWithIdentifier:@"com.transistorsoft.fetch"]