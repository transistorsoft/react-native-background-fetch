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

#import <React/RCTBridge.h>
#import <React/RCTEventDispatcher.h>

static NSString *const RN_BACKGROUND_FETCH_TAG = @"RNBackgroundFetch";

@implementation RNBackgroundFetch {
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
    if (configured) {
        RCTLogInfo(@"- %@ already configured", RN_BACKGROUND_FETCH_TAG);
    }
    RCTLogInfo(@"- %@ configure", RN_BACKGROUND_FETCH_TAG);

    TSBackgroundFetch *fetchManager = [TSBackgroundFetch sharedInstance];
    [fetchManager configure:config];

    if ([fetchManager start]) {
        configured = YES;
        void (^handler)();
        handler = ^void(void){
            RCTLogInfo(@"- %@ Rx Fetch Event", RN_BACKGROUND_FETCH_TAG);
            [_bridge.eventDispatcher sendDeviceEventWithName:[self eventName:@"fetch"] body:nil];
        };
        [fetchManager addListener:RN_BACKGROUND_FETCH_TAG callback:handler];
    } else {
        RCTLogInfo(@"- %@ failed to start", RN_BACKGROUND_FETCH_TAG);
        failure(@[@"Failed to start background fetch API"]);
    }
}

RCT_EXPORT_METHOD(start:(RCTResponseSenderBlock)success failure:(RCTResponseSenderBlock)failure)
{
    RCTLogInfo(@"- %@ start", RN_BACKGROUND_FETCH_TAG);
    TSBackgroundFetch *fetchManager = [TSBackgroundFetch sharedInstance];
    if ([fetchManager start]) {
        success(@[]);
    } else {
        RCTLogInfo(@"- %@ failed to start", RN_BACKGROUND_FETCH_TAG);
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
    [fetchManager finish:RN_BACKGROUND_FETCH_TAG result:UIBackgroundFetchResultNewData];
}

-(NSString*) eventName:(NSString*)name
{
    return [NSString stringWithFormat:@"%@:%@", RN_BACKGROUND_FETCH_TAG, name];
}

- (void)dealloc
{

}

@end
