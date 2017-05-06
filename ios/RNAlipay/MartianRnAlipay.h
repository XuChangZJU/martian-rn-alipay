#if __has_include(<React/RCTUtils.h>)
#import <React/RCTLog.h>
#import <React/RCTBridgeModule.h>
#import <React/RCTConvert.h>
#import <React/RCTBridge.h>
#import <React/RCTEventDispatcher.h>
#import <React/RCTRootView.h>
#import <React/RCTUtils.h>
#else // back compatibility for RN version < 0.40
#import "RCTLog.h"
#import "RCTBridgeModule.h"
#import "RCTConvert.h"
#import "RCTEventDispatcher.h"
#import "RCTRootView.h"
#import "RCTBridge.h"
#import "RCTUtils.h"
#endif

#import <UIKit/UIKit.h>

@interface MartianRnAlipay : NSObject <RCTBridgeModule>

+ (void)aliPayParse:(NSURL *)url;
+ (void)alipayResult:(NSDictionary *)result;
+ (void)authV2Parse:(NSURL *)url;

@end
