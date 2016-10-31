/**
 * Alipay react-native 实现
 * @author: 徐昶
 * @date: 20161029
 */
package com.martianLife.rnAlipay;

import android.annotation.SuppressLint;
import android.os.Handler;
import android.os.Looper;
import android.os.Message;
import com.alipay.sdk.app.PayTask;
import com.facebook.react.bridge.*;

public class RNAlipayModule extends ReactContextBaseJavaModule {
	private final ReactApplicationContext mReactContext;
	private static final int SDK_PAY_FLAG = 1;
	private Handler mHandler;
	private class MsgExtras {
		public String result;
		public Promise promise;
	}

	public RNAlipayModule(ReactApplicationContext reactContext) {
		super(reactContext);
		mReactContext = reactContext;
		if (Looper.myLooper() == null)
		{
			Looper.prepare();
		}

		mHandler = new Handler() {
			@SuppressWarnings("unused")
			public void handleMessage(Message msg) {
				switch (msg.what) {
					case SDK_PAY_FLAG: {
						PayResult payResult = new PayResult(((MsgExtras) msg.obj).result);
						Promise promise = ((MsgExtras) msg.obj).promise;
						/**
						 * 同步返回的结果必须放置到服务端进行验证（验证的规则请看https://doc.open.alipay.com/doc2/
						 * detail.htm?spm=0.0.0.0.xdvAU6&treeId=59&articleId=103665&
						 * docType=1) 建议商户依赖异步通知
						 */
						String result = payResult.getResult();// 同步返回需要验证的信息

						String resultStatus = payResult.getResultStatus();

						String memo = payResult.getMemo();

						WritableMap map = Arguments.createMap();
						map.putString("result", result);
						map.putString("resultStatus", resultStatus);
						map.putString("memo", memo);

						promise.resolve(map);
					}
					default:
						break;
				}
			};
		};

	}


	@Override
  	public String getName() {
    	return "MartianRnAlipay";
  	}

  	@ReactMethod
  	public void pay(ReadableMap options, final Promise promise) {

		final String orderInfo = options.getString("orderInfo");


		Runnable payRunnable = new Runnable() {

			@Override
			public void run() {
				// 构造PayTask 对象
				PayTask alipay = new PayTask(getCurrentActivity());
				// 调用支付接口，获取支付结果
				String result = alipay.pay(orderInfo, true);

				Message msg = new Message();
				msg.what = SDK_PAY_FLAG;
				MsgExtras msgExtras = new MsgExtras();
				msgExtras.result = result;
				msgExtras.promise = promise;
				msg.obj = msgExtras;

				mHandler.sendMessage(msg);
			}
		};

		// 必须异步调用
		Thread payThread = new Thread(payRunnable);
		payThread.start();
    }

	@ReactMethod
	public String getSDKVersion() {
		PayTask payTask = new PayTask(getCurrentActivity());
		return payTask.getVersion();
	}
}