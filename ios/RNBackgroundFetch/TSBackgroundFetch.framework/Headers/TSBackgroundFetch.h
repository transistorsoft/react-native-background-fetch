//
//  RNBackgroundFetchManager.h
//  RNBackgroundFetch
//
//  Created by Christopher Scott on 2016-08-02.
//  Copyright © 2016 Christopher Scott. All rights reserved.
//

#import <Foundation/Foundation.h>
#import <UIKit/UIKit.h>

@interface TSBackgroundFetch : NSObject

@property (nonatomic) BOOL stopOnTerminate;
@property (readonly) BOOL configured;
@property (readonly) BOOL active;

+ (TSBackgroundFetch *)sharedInstance;
-(void) performFetchWithCompletionHandler:(void (^)(UIBackgroundFetchResult))handler applicationState:(UIApplicationState)state;
-(void) configure:(NSDictionary*)config callback:(void(^)(UIBackgroundRefreshStatus status))callback;
-(void) configure:(NSDictionary*)config;
-(void) addListener:(NSString*)componentName callback:(void (^)(void))callback;
-(void) removeListener:(NSString*)componentName;
-(BOOL) hasListener:(NSString*)componentName;
-(void) start:(void(^)(UIBackgroundRefreshStatus status))callback;
-(void) start;
-(void) stop;
-(void) finish:(NSString*)tag result:(UIBackgroundFetchResult) result;
-(void) status:(void(^)(UIBackgroundRefreshStatus status))callback;

@end

