//
//  RNBackgroundFetch.m
//  RNBackgroundFetch
//
//  Created by Christopher Scott on 2016-08-01.
//  Copyright © 2016 Christopher Scott. All rights reserved.
//

#import "RNBackgroundFetch.h"
#import <TSBackgroundFetch/TSBackgroundFetch.h>
#import <UIKit/UIKit.h>

#import "RCTBridge.h"
#import "RCTEventDispatcher.h"

static NSString *const RN_BACKGROUND_FETCH_TAG = @"RNBackgroundFetch";

@implementation RNBackgroundFetch {
    NSNotification *mNotification;
    void (^completionHandler)(UIBackgroundFetchResult);
    BOOL configured;
}

@synthesize bridge = _bridge;

RCT_EXPORT_MODULE();

-(instancetype)init
{
    self = [super init];
    
    configured = NO;
    
    return self;
}
RCT_EXPORT_METHOD(configure:(NSDictionary*)config failure:(RCTResponseSenderBlock)failure)
{
    RCTLogInfo(@"configure");
    if (configured) {
        RCTLogInfo(@"- Already configured");
    }
    TSBackgroundFetch *fetchManager = [TSBackgroundFetch sharedInstance];
    [fetchManager configure:config];
    
    if ([fetchManager start]) {
        configured = YES;
        void (^handler)();
        handler = ^void(void){
            RCTLogInfo(@"- RNBackgroundFetch Rx Fetch Event");
            [_bridge.eventDispatcher sendDeviceEventWithName:[self eventName:@"fetch"] body:nil];
        };
        [fetchManager addListener:handler];
    } else {
        RCTLogInfo(@"- RNBackgroundFetch failed to start");
        failure(@[@"Failed to start background fetch API"]);
    }
}

RCT_EXPORT_METHOD(start:(RCTResponseSenderBlock)success failure:(RCTResponseSenderBlock)failure)
{
    RCTLogInfo(@"- RNBackgroundFetch start");
    TSBackgroundFetch *fetchManager = [TSBackgroundFetch sharedInstance];
    if ([fetchManager start]) {
        success(@[]);
    } else {
        RCTLogInfo(@"- RNBackgroundFetch failed to start");
        failure(@[@"Failed to start background fetch API"]);
    }
}

RCT_EXPORT_METHOD(stop)
{
    RCTLogInfo(@"- RNBackgroundFetch stop");
    TSBackgroundFetch *fetchManager = [TSBackgroundFetch sharedInstance];
    [fetchManager stop];
}

RCT_EXPORT_METHOD(finish)
{
    RCTLogInfo(@"- RNBackgroundFetch finish");
    TSBackgroundFetch *fetchManager = [TSBackgroundFetch sharedInstance];
    [fetchManager finish:UIBackgroundFetchResultNewData];
}

-(NSString*) eventName:(NSString*)name
{
    return [NSString stringWithFormat:@"%@:%@", RN_BACKGROUND_FETCH_TAG, name];
}

- (void)dealloc
{
    [[NSNotificationCenter defaultCenter] removeObserver:self];
}

@end
