/**
 * Created by Administrator on 2016/10/29.
 */
const keys = require('lodash/keys');
const assign = require('lodash/assign');
const crypto = require('crypto');

const bizContent = {
    "body": "martian-rn-alipay的测试用例产生的支付",
    "subject": "martian-rn-alipay 测试用例",
    "out_trade_no": "70501111111S001111119",
    "timeout_express": "90m",
    // "total_amount": "10.0",
    // "seller_id": "2088102147948060",
    "product_code": "QUICK_MSECURITY_PAY",
};


const constOrder = {
    charset: "UTF-8",
    version: "1.0",
    format: "json",
    method: "alipay.trade.app.pay",
    notify_url: "http://www.martian-life.com:3001/api/1.0/gateway/alipay/receiveNotify",
    sign_type: "RSA",
};

const privateKey = require("./privateKey");


/**
 * 生成订单字符串
 * 本逻辑在生产环境中应该被部署在服务器端
 * @param totalAmount
 * @returns {Promise}
 */
function signOrderString(totalAmount) {
    let stringToSign = "";
    const bizContent2 = assign({}, bizContent, {
        total_amount: totalAmount,
    })
    const now = new Date();
    const timestamp = `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()} ${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`;
    const constOrder2 = assign({}, constOrder, {
        biz_content: JSON.stringify(bizContent2),
        app_id: privateKey.app_id,
        timestamp,
    });
    const constOrderArray = keys(constOrder2).sort();
    constOrderArray.forEach((ele, idx) => {
        if(idx > 0) {
            stringToSign += "&";
        }
        stringToSign += ele;
        stringToSign += "=";
        stringToSign += constOrder2[ele];
    });

    console.log(`stringToSign: ${stringToSign}`);
    const signMethod = crypto.createSign('RSA-SHA1');
    signMethod.write(stringToSign);
    signMethod.end();
    const sign = signMethod.sign(privateKey.privateKey, "base64");

    let orderString = "";
    constOrderArray.forEach(
        (ele, idx) => {
            if(idx > 0) {
                orderString += "&";
            }
            orderString += ele;
            orderString += "=";
            orderString += encodeURIComponent(constOrder2[ele]);
        }
    );
    orderString += `&sign=${encodeURIComponent(sign)}`;
    return orderString;
}

module.exports = {
    signOrderString,
};
