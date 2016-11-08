# rn-alipay
react-native 支付宝手机支付模块（杭州码天科技有限公司）

* 实现参考https://github.com/huangzuizui/rn-alipay



在XCode中右击项目的 Libraries 文件夹 ➜ Add Files to
进入 node_modules ➜ rn-alipay ➜ ios ➜ 选择 RNAlipay.xcodeproj
展开RNAlipay.xcodeproj➜ Products➜ 添加 libRNAlipay.a 到Build Phases -> Link Binary With Libraries
在Build Phases选项卡的Link Binary With Libraries中，点击“+”号增加以下依赖：http://www.cocoachina.com/bbs/read.php?tid=335571 
将RNAlipay.xcodeproj下AlipaySDK.framework、libssl.a、libcrypto.a文件拖入复制到项目文件夹下：iOS
编译运行
