package com.epaisapos;


import com.epaisapos.card_factory.CardFactory;
import com.epaisapos.card_factory.ICardPayment;
import com.epaisapos.util.Util;
import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableMap;


public class CardPaymentModule extends ReactContextBaseJavaModule {
    public CardPaymentModule(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @Override
    public String getName() {
        return "CardPayment";
    }


    @ReactMethod
    public void startTransaction(ReadableMap requestData, Callback callback) {

        ICardPayment cardPayment = CardFactory.getTransaction(requestData, getReactApplicationContext());
        if (cardPayment == null) {
            callback.invoke(Util.buildFailureResponse("CP_002", "No processor found"));
        } else {
            cardPayment.startTransaction(callback);
        }
    }

    @ReactMethod
    public void refundTransaction(ReadableMap requestData, Callback callback) {

        ICardPayment cardPayment = CardFactory.getTransaction(requestData, getReactApplicationContext());
        if (cardPayment == null) {
            callback.invoke(Util.buildFailureResponse("CP_002", "No processor found"));
        } else {
            cardPayment.refundTransaction(callback);
        }
    }

    @ReactMethod
    public void revesal(ReadableMap requestData, Callback callback) {

        ICardPayment cardPayment = CardFactory.getTransaction(requestData, getReactApplicationContext());
        if (cardPayment == null) {
            callback.invoke(Util.buildFailureResponse("CP_002", "No processor found"));
        } else {
            cardPayment.reversal(callback);
        }
    }


}
