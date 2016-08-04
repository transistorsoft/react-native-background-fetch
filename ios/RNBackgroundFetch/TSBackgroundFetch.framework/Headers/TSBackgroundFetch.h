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
-(void) performFetchWithCompletionHandler:(void (^)(UIBackgroundFetchResult))handler;
-(void) configure:(NSDictionary*)config;
-(void) addListener:(void (^)(void))callback;
-(BOOL) start;
-(void) stop;
-(void) finish:(UIBackgroundFetchResult) result;

@end

