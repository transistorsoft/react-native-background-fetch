//
//  RNBackgroundFetch.mm
//  RNBackgroundFetch
//
//  Created by Christopher Scott on 2016-08-01.
//  Copyright © 2016 Christopher Scott. All rights reserved.
//

#import "RNBackgroundFetch.h"
#import <TSBackgroundFetch/TSBackgroundFetch.h>
#import <UIKit/UIKit.h>

#import <React/RCTEventDispatcher.h>

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

RCT_REMAP_METHOD(configure,
                 configure:(NSDictionary*)config
                 resolve:(RCTPromiseResolveBlock)resolve
                 reject:(RCTPromiseRejectBlock)reject)
{
    TSBackgroundFetch *fetchManager = [TSBackgroundFetch sharedInstance];

    [fetchManager addListener:PLUGIN_ID callback:[self createFetchCallback] timeout:[self createFetchTimeoutCallback]];

    NSTimeInterval delay = [[config objectForKey:@"minimumFetchInterval"] doubleValue] * 60;

    [fetchManager configure:delay callback:^(UIBackgroundRefreshStatus status) {
        self->configured = YES;
        if (status != UIBackgroundRefreshStatusAvailable) {
            NSLog(@"- %@ failed to start, status: %ld", RN_BACKGROUND_FETCH_TAG, (long)status);
            reject(@"configure", [NSString stringWithFormat:@"%ld", (long)status], nil);
        } else {
            resolve(@(status));
        }
    }];
}

RCT_EXPORT_METHOD(start:(RCTPromiseResolveBlock)resolve
                 reject:(RCTPromiseRejectBlock)reject)
{
    TSBackgroundFetch *fetchManager = [TSBackgroundFetch sharedInstance];

    [fetchManager status:^(UIBackgroundRefreshStatus status) {
        if (status == UIBackgroundRefreshStatusAvailable) {
            [fetchManager addListener:PLUGIN_ID callback:[self createFetchCallback] timeout:[self createFetchTimeoutCallback]];
            NSError *error = [fetchManager start:nil];
            if (!error) {
                resolve(@(status));
            } else {
                reject(@"start", error.localizedDescription, error);
            }
        } else {
            NSLog(@"- %@ failed to start, status: %lu", PLUGIN_ID, (long)status);
            reject(@"start", [NSString stringWithFormat:@"%ld", (long)status], nil);
        }
    }];
}

RCT_REMAP_METHOD(stop,
                 stop:(NSString*)taskId
                 resolve:(RCTPromiseResolveBlock)resolve
                 reject:(RCTPromiseRejectBlock)reject)
{
    TSBackgroundFetch *fetchManager = [TSBackgroundFetch sharedInstance];
    if (!taskId) {
        [fetchManager removeListener:PLUGIN_ID];
    }
    [fetchManager stop:taskId];
    resolve(@(YES));
}

RCT_REMAP_METHOD(scheduleTask,
                 scheduleTask:(NSDictionary*)config
                 resolve:(RCTPromiseResolveBlock)resolve
                 reject:(RCTPromiseRejectBlock)reject)
{
    NSString *taskId = [config objectForKey:@"taskId"];
    long delayMS = [[config objectForKey:@"delay"] longValue];
    NSTimeInterval delay = delayMS / 1000;
    BOOL periodic = [[config objectForKey:@"periodic"] boolValue];
    BOOL requiresCharging = ([config objectForKey:@"requiresCharging"]) ? [[config objectForKey:@"requiresCharging"] boolValue] : NO;
    BOOL requiresNetwork = ([config objectForKey:@"requiresNetworkConnectivity"]) ? [[config objectForKey:@"requiresNetworkConnectivity"] boolValue] : NO;

    NSError *error = [[TSBackgroundFetch sharedInstance] scheduleProcessingTaskWithIdentifier:taskId
                                                                                         type:0
                                                                                        delay:delay
                                                                                     periodic:periodic
                                                                        requiresExternalPower: requiresCharging
                                                                  requiresNetworkConnectivity:requiresNetwork
                                                                                     callback:[self createTaskCallback]];
    if (!error) {
        resolve(@(YES));
    } else {
        reject(@"scheduleTask", error.localizedDescription, error);
    }
}

RCT_EXPORT_METHOD(addListener:(NSString*)eventName)
{
    [super addListener:eventName];
}

RCT_EXPORT_METHOD(removeListeners:(double)count)
{
    [super removeListeners:count];
}

RCT_EXPORT_METHOD(finish:(NSString*)taskId)
{
    TSBackgroundFetch *fetchManager = [TSBackgroundFetch sharedInstance];
    [fetchManager finish:taskId];
}

RCT_EXPORT_METHOD(status:(RCTPromiseResolveBlock)resolve
                 reject:(RCTPromiseRejectBlock)reject)
{
    [[TSBackgroundFetch sharedInstance] status:^(UIBackgroundRefreshStatus status) {
        resolve(@(status));
    }];
}

-(void (^)(NSString* taskId)) createFetchCallback {
    return ^void(NSString* taskId){
        RCTLogInfo(@"- %@ Received fetch event %@", RN_BACKGROUND_FETCH_TAG, taskId);
        [self sendEventWithName:EVENT_FETCH body:@{
            @"taskId": taskId,
            @"timeout": @(NO)
        }];
    };
}

-(void (^)(NSString* taskId)) createFetchTimeoutCallback {
    return ^void(NSString* taskId){
        [self sendEventWithName:EVENT_FETCH body:@{
            @"taskId": taskId,
            @"timeout": @(YES)
        }];
    };
}

-(void (^)(NSString* taskId, BOOL timeout)) createTaskCallback {
    return ^void(NSString* taskId, BOOL timeout){
        RCTLogInfo(@"- %@ Received event event %@", RN_BACKGROUND_FETCH_TAG, taskId);
        [self sendEventWithName:EVENT_FETCH body:@{
            @"taskId": taskId,
            @"timeout": @(timeout)
        }];
    };
}

-(NSString*) eventName:(NSString*)name
{
    return [NSString stringWithFormat:@"%@:%@", RN_BACKGROUND_FETCH_TAG, name];
}

- (void)dealloc
{

}

#ifdef RCT_NEW_ARCH_ENABLED
- (std::shared_ptr<facebook::react::TurboModule>)getTurboModule:
    (const facebook::react::ObjCTurboModule::InitParams &)params {
  return std::make_shared<facebook::react::NativeBackgroundFetchSpecJSI>(params);
}
#endif

@end
