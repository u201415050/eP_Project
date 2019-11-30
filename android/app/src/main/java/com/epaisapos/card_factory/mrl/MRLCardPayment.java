package com.epaisapos.card_factory.mrl;

import com.epaisapos.card_factory.ICardPayment;
import com.epaisapos.util.CardTransactionState;
import com.epaisapos.util.Util;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;

import android.util.Log;

import rx.Observable;
import rx.android.schedulers.AndroidSchedulers;
import rx.functions.Action1;
import rx.functions.Func1;
import rx.schedulers.Schedulers;

public class MRLCardPayment implements ICardPayment {
    private ReadableMap requestData;
    private ReactContext reactContext;
    private MRLHelper mrlHelper;

    public MRLCardPayment(ReadableMap requestData, ReactContext reactContext) {
        this.reactContext = reactContext;
        this.requestData = requestData;
        this.mrlHelper = new MRLHelper();
    }

    @Override
    public void startTransaction(final Callback callback) {
        if (!isRequestValid(requestData)) {
            Log.e("isRequestValid", "Invalidate request from client app");
            callback.invoke(Util.buildFailureResponse("CP_001", "Invalidate request from client app"));
        } else if (!isAmountValid(requestData)) {
            Log.e("isAmountValid", "Minimum amount for card transaction is 10");
            callback.invoke(Util.buildFailureResponse("CP_002", "Minimum amount for card transaction is 10"));
        } else if (!Util.isBluetoothEnabled(reactContext.getApplicationContext())) {
            Log.e("isBluetoothEnabled", "Bluetooth is off.");
            callback.invoke(Util.buildFailureResponse("CP_003", "Bluetooth is off."));
        } else if (!Util.isNetworkAvailable(reactContext.getApplicationContext())) {
            Log.e("isNetworkAvailable", "No internet connection.");
            callback.invoke(Util.buildFailureResponse("CP_004", "No internet connection."));
        } else {
            mrlHelper.setRequest(requestData);
            mrlHelper.connectToDevice(reactContext.getApplicationContext(), new MRLHelper.ICardPaymentCallback() {
                @Override
                public void OnSuccess() {
                    WritableMap response = buildSuccessResponse();
                    mrlHelper.completeTransaction(reactContext.getApplicationContext());
                    mrlHelper.disconnectToDevice(reactContext.getApplicationContext());
                    Log.e("OnSuccess","");
                    callback.invoke(response);
                }

                @Override
                public void OnError(String errorCode) {
                    mrlHelper.disconnectToDevice(reactContext.getApplicationContext());
                    Log.e("OnError", Util.getErrorMessage(reactContext.getApplicationContext(), errorCode));
                    callback.invoke(Util.buildFailureResponse(errorCode,
                            Util.getErrorMessage(reactContext.getApplicationContext(), errorCode)));
                }

                @Override
                public void processing(CardTransactionState state) {
                    WritableMap payload = Arguments.createMap();
                    // Put data to map
                    payload.putString("state", state.toString());
                    // Get EventEmitter from context and send event thanks to it
                    reactContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                            .emit("cardTransactionStatus", payload);
                }

                @Override
                public void selectAccount() {

                }
            });

        }

    }

    private WritableMap buildSuccessResponse() {
        WritableMap response = Arguments.createMap();
        response.putBoolean("success", true);
        response.putString("RRN", MRLWrapper.getResponseMap().get("RRN"));
        response.putString("AID", MRLWrapper.getResponseMap().get("AID"));
        response.putString("batchNumber", MRLWrapper.getResponseMap().get("Batch_No"));
        response.putString("cardLabel", MRLWrapper.getResponseMap().get("Card_Label"));
        response.putString("cardType", MRLWrapper.getResponseMap().get("Card_Type"));
        response.putString("tdate", MRLWrapper.getResponseMap().get("Tran_Date"));
        response.putString("emvTag", MRLWrapper.getResponseMap().get("Tag_Values"));
        response.putString("maskedPAN", MRLWrapper.getResponseMap().get("Masked_Pan"));
        response.putString("invoiceNumber", MRLWrapper.getResponseMap().get("Invoice_No"));
        response.putString("TC", MRLWrapper.getResponseMap().get("TC"));
        response.putString("ttime", MRLWrapper.getResponseMap().get("Tran_Time"));
        response.putString("TSI", MRLWrapper.getResponseMap().get("TSI"));
        response.putString("TVR", MRLWrapper.getResponseMap().get("TVR"));

        String cardHolderName = MRLWrapper.getResponseMap().get("CardHolder_Name");
        if (cardHolderName != null && cardHolderName.endsWith("\\")) {
            cardHolderName = cardHolderName.substring(0, cardHolderName.lastIndexOf("\\"));

        }
        if (cardHolderName != null && cardHolderName.endsWith("/")) {
            cardHolderName = cardHolderName.substring(0, cardHolderName.lastIndexOf("/"));

        }
        response.putString("cardHolderName", cardHolderName);
        return response;
    }

    @Override
    public void refundTransaction(final Callback callback) {

        Observable.just(requestData).map(new Func1<ReadableMap, String>() {
            @Override
            public String call(ReadableMap readableMap) {
                mrlHelper.setRequest(requestData);
                return mrlHelper.refundTransaction(reactContext.getApplicationContext());
            }
        }).observeOn(Schedulers.io()).subscribeOn(AndroidSchedulers.mainThread()).subscribe(new Action1<String>() {
            @Override
            public void call(String responseCode) {
                // "000" means all transaction where voided successfully
                if (responseCode.equals("000")) {
                    WritableMap response = Arguments.createMap();
                    response.putBoolean("success", true);
                    Log.e("onRefund","");
                    callback.invoke(response);
                } else {
                    Log.e("onRefundFail", Util.getErrorMessage(reactContext.getApplicationContext(), responseCode));
                    callback.invoke(Util.buildFailureResponse(responseCode,
                            Util.getErrorMessage(reactContext.getApplicationContext(), responseCode)));
                }
            }
        });
    }

    @Override
    public void reversal(final Callback callback) {

        Observable.just(requestData).map(new Func1<ReadableMap, String>() {
            @Override
            public String call(ReadableMap readableMap) {
                mrlHelper.setRequest(requestData);
                return mrlHelper.reversal(reactContext.getApplicationContext());
            }
        }).observeOn(Schedulers.io()).subscribeOn(AndroidSchedulers.mainThread()).subscribe(new Action1<String>() {
            @Override
            public void call(String responseCode) {
                // "000" means all transaction where voided successfully
                if (responseCode.equals("000")) {
                    WritableMap response = Arguments.createMap();
                    response.putBoolean("success", true);
                    Log.e("reversal","");
                    callback.invoke(response);
                } else {
                    Log.e("reversalFail", Util.getErrorMessage(reactContext.getApplicationContext(), responseCode));
                    callback.invoke(Util.buildFailureResponse(responseCode,
                            Util.getErrorMessage(reactContext.getApplicationContext(), responseCode)));
                }
            }
        });
    }

    private boolean isAmountValid(ReadableMap requestData) {
        return Double.parseDouble(requestData.getString("amount")) >= 10;
    }

    private boolean isRequestValid(ReadableMap requestData) {
        return requestData.hasKey("amount") && requestData.hasKey("cardReaderType")
                && requestData.hasKey("serialNumber") && requestData.hasKey("userName")
                && requestData.hasKey("password") && requestData.hasKey("tid") && requestData.hasKey("mid");

    }
}
