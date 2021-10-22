#!/bin/sh

adb shell cmd jobscheduler run -f com.fetchdemo 999
adb shell am broadcast -a com.fetchdemo.event.BACKGROUND_FETCH

# (lldb)
# e -l objc -- (void)[[BGTaskScheduler sharedScheduler] _simulateLaunchForTaskWithIdentifier:@"com.transistorsoft.fetch"]
