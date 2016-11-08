# rn-alipay
react-native 支付宝手机支付模块（杭州码天科技有限公司）

* 实现参考https://github.com/huangzuizui/rn-alipay



在XCode中右击项目的 Libraries 文件夹 ➜ Add Files to
进入 node_modules ➜ rn-alipay ➜ ios ➜ 选择 RNAlipay.xcodeproj
展开RNAlipay.xcodeproj➜ Products➜ 添加 libRNAlipay.a 到Build Phases -> Link Binary With Libraries
在Build Phases选项卡的Link Binary With Libraries中，点击“+”号增加以下依赖：http://www.cocoachina.com/bbs/read.php?tid=335571 
将RNAlipay.xcodeproj下AlipaySDK.framework、libssl.a、libcrypto.a文件拖入复制到项目文件夹下：iOS

在appdelegate.m 中增加  以下代码
#import "MartianRnAlipay.h"


- (BOOL)application:(UIApplication *)app openURL:(NSURL *)url options:(NSDictionary<NSString*, id> *)options
{
//如果极简开发包不可用,会跳转支付宝钱包进行支付,需要将支付宝钱包的支付结果回传给开 发包
[MartianRnAlipay aliPayParse:url];
return YES;
}

编译运行
