/**
 * Created by Administrator on 2016/10/29.
 */
const keys = require('lodash/keys');
const assign = require('lodash/assign');
const crypto = require('crypto');

const bizContent = {
    "body": "对一笔交易的具体描述信息。如果是多种商品，请将商品描述字符串累加传给body。",
    "subject": "大乐透 这个辣条不错",
    "out_trade_no": "70501111111S001111119",
    "timeout_express": "90m",
    "total_amount": "10.0",
    "seller_id": "2088102147948060",
    "product_code": "QUICK_MSECURITY_PAY",
};


const constOrder = {
    charset: "UTF-8",
    version: "1.0",
    format: "json",
    timestamp: "2016-07-01 08:08:08",
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
    let orderString = "";
    const bizContent2 = assign({}, bizContent, {
        total_amount: totalAmount,
    })
    const constOrder2 = assign({}, constOrder, {
        biz_content: JSON.stringify(bizContent2),
        app_id: privateKey.app_id,
    });
    const constOrderArray = keys(constOrder2).sort();
    constOrderArray.forEach((ele, index) => {
        if(index > 0) {
            orderString += "&";
        }
        orderString += ele;
        orderString += "=";
        orderString += constOrder2[ele];
    });

    const signMethod = crypto.createSign('RSA-SHA1');
    signMethod.write(orderString);
    signMethod.end();
    const sign = signMethod.sign(privateKey.privateKey, "base64");
    orderString += `&sign=${sign}`;
    return(orderString);
}

module.exports = {
    signOrderString,
};
