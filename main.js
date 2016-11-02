'use strict';

import {
    NativeModules,
    NativeAppEventEmitter,
    Platform
} from "react-native";
const Alipay = NativeModules.MartianRnAlipay;

// let MtRnAlipay;
//
// if( Platform.OS === 'ios' ) {
//     console.log("main");
//     MtRnAlipay = new class {
//         pay(options) {
//             console.log(options + 'iosmain');
//             return new Promise(
//                     (resolve, reject) => {
//                     Alipay.pay(
//                     options
//                 )
//                     .then(
//                         ()=>{
//                     NativeAppEventEmitter.addListener(
//                     'alipaySuccess',
//                     (reminder) => {
//                     console.log(reminder);
//             resolve(1);
//         }
//
//         );
//
//         }
//         )
//         .catch(
//                 reject
//             );
//
//             // DeviceEventEmitter.on("alipaySuccess", (result) => {
//             //     alert(2);
//             //     DeviceEventEmitter.removeAllListeners("alipaySuccess");
//             //     resolve(result);
//             // });
//         }
//         );
//         }
//     };
// }
// else  {
//     console.log('biabian')
//     MtRnAlipay = Alipay;
// }

module.exports = Alipay;
