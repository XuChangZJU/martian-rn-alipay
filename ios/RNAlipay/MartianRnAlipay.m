#import "MartianRnAlipay.h"
#import <AlipaySDK/AlipaySDK.h>
static RCTPromiseResolveBlock _resolve;
static RCTPromiseRejectBlock _reject;


@implementation MartianRnAlipay

RCT_EXPORT_MODULE();

RCT_REMAP_METHOD(pay, options:(NSDictionary *)options
                 resolver:(RCTPromiseResolveBlock)resolve
                 rejecter:(RCTPromiseRejectBlock)reject)
{

    NSArray *urls = [[NSBundle mainBundle] infoDictionary][@"CFBundleURLTypes"];
    NSMutableString *appScheme = [NSMutableString string];
    BOOL multiUrls = [urls count] > 1;
    for (NSDictionary *url in urls) {
        NSArray *schemes = url[@"CFBundleURLSchemes"];
        NSString *identifier = url[@"CFBundleURLName"];  //alipay
        //        if ([identifier containsString:@"alipay"]) {
        //            [appScheme appendString:schemes[0]];
        //            break;
        //        }

        if (!multiUrls ||
            (multiUrls && [@"alipay" isEqualToString:identifier])) {
            [appScheme appendString:schemes[0]];
            break;
        }
    }

    NSLog(@"appScheme is%@",appScheme);
        if ([appScheme isEqualToString:@""]) {
            NSString *error = @"scheme cannot be empty";
            reject(@"10000", error, [NSError errorWithDomain:error code:10000 userInfo:NULL]);
            return;
        }


    _resolve = resolve;
    _reject = reject;
    NSString *orderString = [options objectForKey:@"orderInfo"];

    [[AlipaySDK defaultService] payOrder:(NSString *)orderString fromScheme:appScheme callback:^(NSDictionary *resultDic){
        NSLog(@"reslut = %@",resultDic);
        [MartianRnAlipay alipayResult:resultDic];
        NSLog(@"orderString = %@", @"支付成功啦啦啦啦！");

    }];
}
RCT_REMAP_METHOD(auth, option:(NSDictionary *)option
                 resolver:(RCTPromiseResolveBlock)resolve
                 rejecter:(RCTPromiseRejectBlock)reject)
{
    NSArray *urls = [[NSBundle mainBundle] infoDictionary][@"CFBundleURLTypes"];
    NSMutableString *appScheme = [NSMutableString string];
    BOOL multiUrls = [urls count] > 1;
    for (NSDictionary *url in urls) {
        NSArray *schemes = url[@"CFBundleURLSchemes"];
        NSString *identifier = url[@"CFBundleURLName"];  //alipay
        //        if ([identifier containsString:@"alipay"]) {
        //            [appScheme appendString:schemes[0]];
        //            break;
        //        }

        if (!multiUrls ||
            (multiUrls && [@"alipay" isEqualToString:identifier])) {
            [appScheme appendString:schemes[0]];
            break;
        }
    }

    NSLog(@"appScheme is%@",appScheme);
        if ([appScheme isEqualToString:@""]) {
            NSString *error = @"scheme cannot be empty";
            reject(@"10000", error, [NSError errorWithDomain:error code:10000 userInfo:NULL]);
            return;
        }


    _resolve = resolve;
    _reject = reject;
    NSString *authInfo = [option objectForKey:@"authInfo"];
    [[AlipaySDK defaultService] auth_V2WithInfo:authInfo
                                     fromScheme:appScheme
                                       callback:^(NSDictionary *resultDic) {
                                           NSLog(@"result = %@",resultDic);
                                           [MartianRnAlipay alipayResult:resultDic];
                                           // 解析 auth code
                                           NSString *result = resultDic[@"result"];
                                           NSString *authCode = nil;
                                           if (result.length>0) {
                                               NSArray *resultArr = [result componentsSeparatedByString:@"&"];
                                               for (NSString *subResult in resultArr) {
                                                   if (subResult.length > 10 && [subResult hasPrefix:@"auth_code="]) {
                                                       authCode = [subResult substringFromIndex:10];
                                                       break;
                                                   }
                                               }
                                           }
                                           NSLog(@"授权结果 authCode = %@", authCode?:@"");
                                           [MartianRnAlipay authCodeResult:authCode];

                                       }];
}
+ (void)alipayResult:(NSDictionary *)result
{
    _resolve(result);
}
+ (void)authCodeResult:(NSString *)result
{
    _resolve(result);
}

#pragma mark - 支付宝支付处理方法
+ (void)aliPayParse:(NSURL *)url
{
    //如果极简开发包不可用,会跳转支付宝钱包进行支付,需要将支付宝钱包的支付结果回传给开 发包
    if ([url.host isEqualToString:@"safepay"]) {
        [[AlipaySDK defaultService] processOrderWithPaymentResult:url standbyCallback:^(NSDictionary *resultDic) {
            //【由于在跳转支付宝客户端支付的过程中,商户 app 在后台很可能被系统 kill 了, 所以 pay 接口的 callback 就会失效,请商户对 standbyCallback 返回的回调结果进行处理,就 是在这个方法里面处理跟 callback 一样的逻辑】
            [self alipayResult:resultDic];
        }];
    }

    if ([url.host isEqualToString:@"platformapi"]){ //支付宝钱包快登授权返回 authCode
        [[AlipaySDK defaultService] processAuthResult:url standbyCallback:^(NSDictionary *resultDic) {
            //【由于在跳转支付宝客户端支付的过程中,商户 app 在后台很可能被系统 kill 了, 所以 pay 接口的 callback 就会失效,请商户对 standbyCallback 返回的回调结果进行处理,就 是在这个方法里面处理跟 callback 一样的逻辑】
            [self alipayResult:resultDic];
        }];
    }
}
#pragma mark - 支付宝授权处理方法
+ (void)authV2Parse:(NSURL *)url
{

    if ([url.host isEqualToString:@"safepay"]) {
        // 授权跳转支付宝钱包进行授权，处理支付结果
        [[AlipaySDK defaultService] processAuth_V2Result:url standbyCallback:^(NSDictionary *resultDic) {
            NSLog(@"result = %@",resultDic);
            [self alipayResult:resultDic];
            // 解析 auth code
            NSString *result = resultDic[@"result"];
            NSString *authCode = nil;
            if (result.length>0) {
                NSArray *resultArr = [result componentsSeparatedByString:@"&"];
                for (NSString *subResult in resultArr) {
                    if (subResult.length > 10 && [subResult hasPrefix:@"auth_code="]) {
                        authCode = [subResult substringFromIndex:10];
                        break;
                    }
                }
            }
            NSLog(@"授权结果 authCode = %@", authCode?:@"");
            [self authCodeResult:authCode];
        }];
    }
}

@end
