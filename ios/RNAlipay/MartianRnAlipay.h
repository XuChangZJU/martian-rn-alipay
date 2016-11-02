#import "RCTLog.h"
#import "RCTConvert.h"
#import "RCTBridge.h"
#import "RCTUtils.h"
#import "RCTEventDispatcher.h"
#import "RCTBridgeModule.h"
#import <UIKit/UIKit.h>

@interface MartianRnAlipay : NSObject <RCTBridgeModule>

+ (void)aliPayParse:(NSURL *)url;
+ (void)alipayResult:(NSDictionary *)result;

@end
