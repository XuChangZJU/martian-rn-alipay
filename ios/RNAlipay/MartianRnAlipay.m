#import "MartianRnAlipay.h"
#import "Order.h"
#import "DataSigner.h"
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
        if (!multiUrls ||
            (multiUrls && [@"examplePay" isEqualToString:url[@"CFBundleURLName"]])) {
            [appScheme appendString:schemes[0]];
            break;
        }
    }
    
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

+ (void)alipayResult:(NSDictionary *)result
{
    NSString * resultStatus = [result objectForKey:@"resultStatus"];
    if([resultStatus isEqualToString:@"6001"])
    { //用户取消
        NSLog(@"已取消支付");
        _resolve(@[result]);
    }
    else if ([resultStatus isEqualToString:@"9000"])
    { //验证签名成功，交易结果无篡改
        NSLog(@"支付成功");
        _resolve(@[result]);
    }
    else
    {
        NSLog(@"支付宝支付失败");
        _reject(resultStatus, result[@"memo"], [NSError errorWithDomain:result[@"memo"] code:[resultStatus integerValue] userInfo:NULL]);
    }
    
    
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

@end