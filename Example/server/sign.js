/**
 * Created by Administrator on 2016/10/29.
 */
// const keys = require('lodash/keys');
// const assign = require('lodash/assign');
const crypto = require('crypto');
const privateKey = require("./privateKey");

const bizContent = {
    "timeout_express": "30m",
    "product_code": "QUICK_MSECURITY_PAY",
    "subject": "我是商品名称",
    "body": "我是测试数据",
    // "out_trade_no": "707665424",
    // "total_amount": "10.0",
    // "seller_id": "2088102147948060",
};


//支付宝所需要的常量参数
const payConfig = {
    app_id: privateKey.app_id, //请替换为自己的appId
    method: "alipay.trade.app.pay",
    charset: "utf-8",
    version: "1.0",
    format: "JSON",
    notify_url: "http://www.martian-life.com:3001/api/1.0/gateway/alipay/receiveNotify", //请替换为自己的回调接口
    sign_type: "RSA",
};

function forDec(number) {
    return number >9 ? number : `0${number}`
}

function generateOutTradeNo ()  {
    return Date.now().toString();
}

function genBizContent(totalAmount, payId) {
    return Object.assign({}, bizContent, {
        total_amount: totalAmount,
        out_trade_no: payId,
    });
}
/**
 * 生成订单字符串
 * 本逻辑在生产环境中应该被部署在服务器端
 * @param totalAmount
 * @returns {String}
 */
function signOrderString(totalAmount) {
    let stringToSign = "";


    // 填写你定义的订单总额和订单号, 这里订单号为任意字符串,生产环境请根据自己业务逻辑替换
    const bizContent = genBizContent(totalAmount, generateOutTradeNo());


    const now = new Date();
    const timestamp=`${now.getFullYear()}-${forDec(now.getMonth()+1)}-${forDec(now.getDate())} ${forDec(now.getHours())}:${forDec(now.getMinutes())}:${forDec(now.getSeconds())}` ;
    // console.log(result);
    // const now = new Date();

    const constOrder2 = Object.assign({}, payConfig, {
        biz_content: JSON.stringify(bizContent),
        // app_id: privateKey.app_id,
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
