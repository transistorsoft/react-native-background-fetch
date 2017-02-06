//
//  RNBackgroundFetch.h
//  RNBackgroundFetch
//
//  Created by Christopher Scott on 2016-08-01.
//  Copyright © 2016 Christopher Scott. All rights reserved.
//


#import <Foundation/Foundation.h>
#import <UIKit/UIKit.h>

#if __has_include("RCTEventEmitter.h")
#import "RCTEventEmitter.h"
#import "RCTLog.h"
#else
#import <React/RCTEventEmitter.h>
#import <React/RCTLog.h>
#endif

@interface RNBackgroundFetch : RCTEventEmitter <UIApplicationDelegate>

@end
