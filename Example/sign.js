/**
 * Created by Administrator on 2016/10/29.
 */

const global = {
    appId: "APPID",
    notifyUrl: "http://www.martian-life.com:3001/api/1.0/gateway/alipayNotify",
    body: "测试付款",
    subject: "测试",
    outTradeNo: 12345,
}

/**
 * 生成订单字符串
 * 本逻辑在生产环境中应该被部署在服务器端
 * @param totalAmount
 * @returns {Promise}
 */
function signOrderString(totalAmount) {
    return new Promise(
        (resolve, reject) => {
            resolve("未实现");
        }
    )
}

module.exports = {
    signOrderString,
};
