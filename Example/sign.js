/**
 * Created by Administrator on 2016/10/29.
 */
import keys from 'lodash/keys';

const constOrder = {
    appId: "APPID",
    blz_content: JSON.stringify(blzContent),
    charset: "UTF-8",
    version: 1.0,
    timestamp: "2016-07-01 08:08:08",
    method: "alipay.trade.app.pay",
    notifyUrl: "http://www.martian-life.com:3001/api/1.0/gateway/alipayNotify",
    sign_type: "RSA",
    sign:"ERITJKEIJKJHKKKKKKKHJEREEEEEEEEEEE", 
}

const blzContent = {
    "body":"对一笔交易的具体描述信息。如果是多种商品，请将商品描述字符串累加传给body。",
    "subject":"大乐透 这个辣条不错 out_trade_no=123 total_fee=123.5",
    "out_trade_no":"70501111111S001111119",
    "timeout_express":"90m",
    "total_amount":10.0,
    "seller_id":"2088102147948060",
    "auth_token":"appopenBb64d181d0146481ab6a762c00714cC27",
    "product_code":"QUICK_MSECURITY_PAY"
}


/**
 * 生成订单字符串
 * 本逻辑在生产环境中应该被部署在服务器端
 * @param totalAmount
 * @returns {Promise}
 */
function signOrderString(totalAmount, constOrder, is_encode) {
    const OrderString = "";
    const items = [];
    const constOrderArray = keys(constOrder).sort();
    return new Promise(
        (resolve, reject) => {
            constOrderArray.forEach((ele, index) => {
                // 需要url_encode,即escape
                if(is_encode) {
                    items.push( ele.toString() + "=" + escape(constOrderArray[ele].toString()) );
                } else {
                    items.push( ele.toString() + "=" + constOrderArray[ele].toString());
                }
    })
    }
    )
    OrderString = items.join("&")
}

module.exports = {
    signOrderString,
};
