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
import com.alipay.sdk.app.AuthTask;
import com.alipay.sdk.app.PayTask;
import com.facebook.react.bridge.*;

import java.util.Map;

public class RNAlipayModule extends ReactContextBaseJavaModule {
	private final ReactApplicationContext mReactContext;
	private static final int SDK_PAY_FLAG = 1;
	private static final int SDK_AUTH_FLAG = 2;

	@SuppressLint("HandlerLeak")
	private static Handler mHandler = new Handler(Looper.getMainLooper()) {
		@SuppressWarnings("unused")
		public void handleMessage(Message msg) {
			switch (msg.what) {
				case SDK_PAY_FLAG: {
					@SuppressWarnings("unchecked")
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
					break;
				}
				case SDK_AUTH_FLAG: {
					@SuppressWarnings("unchecked")
					AuthResult authResult = new AuthResult(((MsgExtras) msg.obj).result, true);
					Promise promise = ((MsgExtras) msg.obj).promise;
					String resultStatus = authResult.getResultStatus();

					WritableMap map = Arguments.createMap();
					map.putString("aliPayOpenId", authResult.getAlipayOpenId());
					map.putString("authCode", authResult.getAuthCode());
					map.putString("result", authResult.getResult());
					map.putString("resultStatus", authResult.getResultStatus());
					map.putString("memo", authResult.getMemo());

					promise.resolve(map);
					break;
				}
				default:
					break;
			}
		};
	};;
	private class MsgExtras {
		public Map<String, String> result;
		public Promise promise;
	}

	public RNAlipayModule(ReactApplicationContext reactContext) {
		super(reactContext);
		mReactContext = reactContext;
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
				Map<String, String> result = alipay.payV2(orderInfo, true);

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

	@ReactMethod
	public void auth(ReadableMap options, final Promise promise) {

		final String authInfo = options.getString("authInfo");

		Runnable payRunnable = new Runnable() {

			@Override
			public void run() {
				// 构造AuthTask 对象
				AuthTask authTask = new AuthTask(getCurrentActivity());
				// 调用授权接口，获取授权结果
				Map<String, String> result = authTask.authV2(authInfo, true);

				Message msg = new Message();
				msg.what = SDK_AUTH_FLAG;
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
}