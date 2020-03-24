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
static NSString *const PLUGIN_ID = @"react-native-background-fetch";

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

+ (BOOL)requiresMainQueueSetup
{
    return NO;
}

- (NSArray<NSString *> *)supportedEvents {
    return @[EVENT_FETCH];
}

RCT_EXPORT_METHOD(configure:(NSDictionary*)config failure:(RCTResponseSenderBlock)failure)
{
    TSBackgroundFetch *fetchManager = [TSBackgroundFetch sharedInstance];

    [fetchManager addListener:PLUGIN_ID callback:[self createCallback]];

    NSTimeInterval delay = [[config objectForKey:@"minimumFetchInterval"] doubleValue] * 60;
    [fetchManager configure:delay callback:^(UIBackgroundRefreshStatus status) {
        self->configured = YES;
        if (status != UIBackgroundRefreshStatusAvailable) {
            NSLog(@"- %@ failed to start, status: %ld", RN_BACKGROUND_FETCH_TAG, (long)status);
            failure(@[@(status)]);
        }
    }];
}

RCT_EXPORT_METHOD(start:(RCTResponseSenderBlock)success failure:(RCTResponseSenderBlock)failure)
{
    TSBackgroundFetch *fetchManager = [TSBackgroundFetch sharedInstance];

    [fetchManager status:^(UIBackgroundRefreshStatus status) {
        if (status == UIBackgroundRefreshStatusAvailable) {
            [fetchManager addListener:PLUGIN_ID callback:[self createCallback]];
            NSError *error = [fetchManager start:nil];
            if (!error) {
                success(@[@(status)]);
            } else {
                failure(@[error.localizedDescription]);
            }
        } else {
            NSLog(@"- %@ failed to start, status: %lu", PLUGIN_ID, (long)status);
            NSString *msg = [NSString stringWithFormat:@"%ld", (long) status];
            failure(@[msg]);
        }
    }];
}

RCT_EXPORT_METHOD(stop:(NSString*)taskId success:(RCTResponseSenderBlock)success failure:(RCTResponseSenderBlock)failure)
{
    TSBackgroundFetch *fetchManager = [TSBackgroundFetch sharedInstance];
    if (!taskId) {
        [fetchManager removeListener:PLUGIN_ID];
    }
    [fetchManager stop:taskId];
    success(@[@(YES)]);
}

RCT_EXPORT_METHOD(scheduleTask:(NSDictionary*)config success:(RCTResponseSenderBlock)success failure:(RCTResponseSenderBlock)failure) {
    NSString *taskId = [config objectForKey:@"taskId"];
    long delayMS = [[config objectForKey:@"delay"] longValue];
    NSTimeInterval delay = delayMS / 1000;
    BOOL periodic = [[config objectForKey:@"periodic"] boolValue];

    NSError *error = [[TSBackgroundFetch sharedInstance] scheduleProcessingTaskWithIdentifier:taskId
                                                                                        delay:delay
                                                                                     periodic:periodic
                                                                                     callback:[self createCallback]];
    if (!error) {
        success(@[@(YES)]);
    } else {
        failure(@[error.localizedDescription]);
    }
}

RCT_EXPORT_METHOD(finish:(NSString*)taskId)
{
    TSBackgroundFetch *fetchManager = [TSBackgroundFetch sharedInstance];
    [fetchManager finish:taskId];
}

RCT_EXPORT_METHOD(status:(RCTResponseSenderBlock)callback)
{
    [[TSBackgroundFetch sharedInstance] status:^(UIBackgroundRefreshStatus status) {
        callback(@[@(status)]);
    }];
}

-(void (^)(NSString* taskId)) createCallback {
    return ^void(NSString* taskId){
        RCTLogInfo(@"- %@ Rx Fetch Event", RN_BACKGROUND_FETCH_TAG);
        [self sendEventWithName:EVENT_FETCH body:taskId];
    };
}

-(NSString*) eventName:(NSString*)name
{
    return [NSString stringWithFormat:@"%@:%@", RN_BACKGROUND_FETCH_TAG, name];
}

- (void)dealloc
{

}

@end
