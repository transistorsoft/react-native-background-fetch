//
//  RNBackgroundFetch.h
//  RNBackgroundFetch
//
//  Created by Christopher Scott on 2016-08-01.
//  Copyright © 2016 Christopher Scott. All rights reserved.
//


#import <Foundation/Foundation.h>
#import <UIKit/UIKit.h>

#import <React/RCTLog.h>
#import <React/RCTEventEmitter.h>

#ifdef RCT_NEW_ARCH_ENABLED
#import <RNBackgroundFetchSpec/RNBackgroundFetchSpec.h>
@interface RNBackgroundFetch : RCTEventEmitter <NativeBackgroundFetchSpec, UIApplicationDelegate>
#else
@interface RNBackgroundFetch : RCTEventEmitter <UIApplicationDelegate>
#endif

@end
