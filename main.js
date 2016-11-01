'use strict';

import {
    NativeModules,
    DeviceEventEmitter
} from "react-native";
const Alipay = NativeModules.MartianRnAlipay;

let MtRnAlipay;

if( Platform.os === 'ios' ) {
    MtRnAlipay = new class {
        pay(options) {
            return new Promise(
                (resolve, reject) => {
                    Alipay.pay(options)
                        .then(
                            resolve
                        )
                        .catch(
                            reject
                        );
                    DeviceEventEmitter.on("alipaySuccess", (result) => {
                        DeviceEventEmitter.removeAllListeners("alipaySuccess");
                        resolve(result);
                    });
                }
            );
        }
    };
}
else  {
    MtRnAlipay = Alipay;
}

module.exports = MtRnAlipay;
