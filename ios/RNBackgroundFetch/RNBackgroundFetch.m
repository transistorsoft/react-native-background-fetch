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

#if __has_include("RCTEventDispatcher.h")
#import "RCTEventDispatcher.h"
#else
#import <React/RCTEventDispatcher.h>
#endif

static NSString *const RN_BACKGROUND_FETCH_TAG = @"RNBackgroundFetch";
static NSString *const EVENT_FETCH = @"fetch";

@implementation RNBackgroundFetch {
    BOOL configured;
}

RCT_EXPORT_MODULE();

-(instancetype)init
{
    self = [super init];
    
    configured = NO;
    
    return self;
}

- (NSArray<NSString *> *)supportedEvents {
    return @[EVENT_FETCH];
}

RCT_EXPORT_METHOD(configure:(NSDictionary*)config failure:(RCTResponseSenderBlock)failure)
{
            
    TSBackgroundFetch *fetchManager = [TSBackgroundFetch sharedInstance];
    [fetchManager configure:config];
    
    if ([fetchManager start]) {
        configured = YES;
        void (^handler)();
        handler = ^void(void){
            RCTLogInfo(@"- %@ Rx Fetch Event", RN_BACKGROUND_FETCH_TAG);
            [self sendEventWithName:EVENT_FETCH body:nil];
        };
        [fetchManager addListener:RN_BACKGROUND_FETCH_TAG callback:handler];
    } else {
        RCTLogInfo(@"- %@ failed to start", RN_BACKGROUND_FETCH_TAG);
        failure(@[@"Failed to start background fetch API"]);
    }
}

RCT_EXPORT_METHOD(start:(RCTResponseSenderBlock)success failure:(RCTResponseSenderBlock)failure)
{
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
    TSBackgroundFetch *fetchManager = [TSBackgroundFetch sharedInstance];
    [fetchManager stop];
}

RCT_EXPORT_METHOD(finish)
{
    TSBackgroundFetch *fetchManager = [TSBackgroundFetch sharedInstance];
    [fetchManager finish:RN_BACKGROUND_FETCH_TAG result:UIBackgroundFetchResultNewData];
}

RCT_EXPORT_METHOD(status:(RCTResponseSenderBlock)callback)
{
    TSBackgroundFetch *fetchManager = [TSBackgroundFetch sharedInstance];
    callback(@[@([fetchManager status])]);
}


-(NSString*) eventName:(NSString*)name
{
    return [NSString stringWithFormat:@"%@:%@", RN_BACKGROUND_FETCH_TAG, name];
}

- (void)dealloc
{
    
}

@end
