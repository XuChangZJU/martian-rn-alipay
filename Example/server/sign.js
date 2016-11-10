/**
 * Created by Administrator on 2016/10/29.
 */
// const keys = require('lodash/keys');
// const assign = require('lodash/assign');
const crypto = require('crypto');

const bizContent = {
    "timeout_express": "30m",
    "product_code": "QUICK_MSECURITY_PAY",
    "total_amount": "0.01",
    "subject": "12",
    "body": "我是测试数据",
    "out_trade_no": "707665424",
    // "total_amount": "10.0",
    // "seller_id": "2088102147948060",
};


const constOrder = {
    app_id: "aaa",
    timestamp: "bbb",
    biz_content: "ccc",
    method: "alipay.trade.app.pay",
    charset: "utf-8",
    version: "1.0",
    format: "JSON",
    notify_url: "http://www.martian-life.com:3001/api/1.0/gateway/alipay/receiveNotify",
    sign_type: "RSA",
};

const privateKey = require("./privateKey");

function generateOutTradeNo ()  {
    return Date.now().toString();
}

/**
 * 生成订单字符串
 * 本逻辑在生产环境中应该被部署在服务器端
 * @param totalAmount
 * @returns {String}
 */
function signOrderString(totalAmount) {
    let stringToSign = "";
    const bizContent2 = Object.assign({}, bizContent, {
        total_amount: totalAmount,
        out_trade_no: generateOutTradeNo(),
    })
    const now = new Date();
    const timestamp = '2016-07-29 16:55:53';
    const constOrder2 = Object.assign({}, constOrder, {
        biz_content: JSON.stringify(bizContent2),
        app_id: privateKey.app_id,
        timestamp,
    });
    const constOrderArray = Object.keys(constOrder2).sort();
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
    return orderString/*.replace('%20', '+')*/;
}

module.exports = {
    signOrderString,
};
