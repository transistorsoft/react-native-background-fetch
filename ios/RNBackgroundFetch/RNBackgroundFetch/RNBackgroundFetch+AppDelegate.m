//
//  RNBackgroundGeolocation+AppDelegate.m
//  RNBackgroundGeolocationSample
//
//  Created by Christopher Scott on 2016-08-01.
//  Copyright © 2016 Facebook. All rights reserved.
//

#import <Foundation/Foundation.h>
#import "AppDelegate.h"
#import <TSBackgroundFetch/TSBackgroundFetch.h>

@implementation AppDelegate(AppDelegate)

-(void)application:(UIApplication *)application performFetchWithCompletionHandler:(void (^)(UIBackgroundFetchResult))completionHandler
{
    NSLog(@"RNBackgroundFetch AppDelegate received fetch event");
    TSBackgroundFetch *fetchManager = [TSBackgroundFetch sharedInstance];
    [fetchManager performFetchWithCompletionHandler:completionHandler];
}

@end
