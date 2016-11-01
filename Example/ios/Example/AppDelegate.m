/**
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */

#import "AppDelegate.h"
#import <AlipaySDK/AlipaySDK.h>
#import "RCTBundleURLProvider.h"
#import "RCTRootView.h"

@implementation AppDelegate

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
  NSURL *jsCodeLocation;

  jsCodeLocation = [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index.ios" fallbackResource:nil];

  RCTRootView *rootView = [[RCTRootView alloc] initWithBundleURL:jsCodeLocation
                                                      moduleName:@"Example"
                                               initialProperties:nil
                                                   launchOptions:launchOptions];
  rootView.backgroundColor = [[UIColor alloc] initWithRed:1.0f green:1.0f blue:1.0f alpha:1];

  self.window = [[UIWindow alloc] initWithFrame:[UIScreen mainScreen].bounds];
  UIViewController *rootViewController = [UIViewController new];
  rootViewController.view = rootView;
  self.window.rootViewController = rootViewController;
  [self.window makeKeyAndVisible];
  return YES;
}
- (BOOL)application:(UIApplication *)app openURL:(NSURL *)url options:(NSDictionary<NSString*, id> *)options
{
  if ([url.host isEqualToString:@"safepay"]) {
    //跳转支付宝钱包进行支付，处理支付结果
    [[AlipaySDK defaultService] processOrderWithPaymentResult:url standbyCallback:^(NSDictionary *resultDic) {
      NSLog(@"resultAppdelegeta = %@",resultDic);
    }];
  }
  else if ([url.host isEqualToString:@"platformapi"]){
    //授权返回码
    [[AlipaySDK defaultService] processAuthResult:url standbyCallback:^(NSDictionary *resultDic) {
      [self AlipayWithResutl:resultDic];
    }];
  }
  return YES;
}
-(void)AlipayWithResutl:(NSDictionary *)resultDic{
  NSString  *str = [resultDic objectForKey:@"resultStatus"];
  if (str.intValue == 9000)
  {
    // 支付成功
    //通过通知中心发送通知
    [[NSNotificationCenter defaultCenter] postNotificationName:@"PayResult" object:@"ali_success" userInfo:@{@"intValue":@"9000"}];
  }
  else
  {
    //通过通知中心发送通知
    [[NSNotificationCenter defaultCenter] postNotificationName:@"PayResult" object:@"fail" userInfo:nil];
  }
  
}
@end
