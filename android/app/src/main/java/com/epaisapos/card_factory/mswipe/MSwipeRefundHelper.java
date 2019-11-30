package com.epaisapos.card_factory.mswipe;

import android.content.Context;
import android.content.SharedPreferences;
import android.util.Log;

import com.facebook.react.bridge.ReadableMap;
import com.mswipetech.wisepad.sdk.MSWisepadController;
import com.mswipetech.wisepad.sdk.data.MSDataStore;
import com.mswipetech.wisepad.sdk.data.VoidTransactionResponseData;
import com.mswipetech.wisepad.sdk.listeners.MSWisepadControllerResponseListener;

import java.util.Calendar;

public class MSwipeRefundHelper {

    private Context context;
    private IRefundListener listener;
    private ReadableMap request;

    public MSwipeRefundHelper(Context context, ReadableMap request, IRefundListener listener) {
        this.listener = listener;
        this.context = context;
        this.request = request;
    }


    //Login Process start
    public void refund() {

        LoginHelper loginHelper = new LoginHelper(context, request, new LoginHelper.ILoginListener() {
            @Override
            public void onError(String errCode, String errorMessage) {
                listener.onError(errCode, errorMessage);
            }

            @Override
            public void onSuccess() {
                refundTransaction(request.getString("amount"), request.getString("last4Digits")
                        , request.getString("stanID"), request.getString("invoiceNumber"));
            }
        });
        loginHelper.loginIntoMSwipe();
    }


    private void refundTransaction(String amount, String last4Digit, String standId, String voucherNo) {

        final Calendar c = Calendar.getInstance();
        int year = c.get(Calendar.YEAR);
        int month = c.get(Calendar.MONTH);
        int day = c.get(Calendar.DAY_OF_MONTH);
        String mSelectedDate = year + "-" + (month + 1) + "-" + day;
        SharedPreferences pref = context.getSharedPreferences("regenKey", Context.MODE_PRIVATE);

        try {
            final MSWisepadController wisepadController = getController();
            wisepadController.processVoidTransaction(
                    pref.getString("referenceid", ""),
                    pref.getString("sessiontoken", ""),
                    mSelectedDate,
                    amount,
                    last4Digit,
                    standId,
                    voucherNo,
                    "",
                    new MSWisepadControllerResponseListenerObserver());
//

        } catch (Exception ex) {


        }

       /* } else {
            getCredentials();
        }*/
    }

    private MSWisepadController getController() {
        return MSWisepadController.
                getSharedMSWisepadController(context,
                        MSWisepadController.GATEWAY_ENVIRONMENT.LABS,
                        MSWisepadController.NETWORK_SOURCE.WIFI, null);
    }

    /**
     * MswipeWisepadControllerResponseListenerObserver
     * The mswipe overridden class  observer which listens to the response to the mswipe sdk function requests
     */
    class MSWisepadControllerResponseListenerObserver implements MSWisepadControllerResponseListener {
        /**
         * onReponseData
         * The response data notified back to the call back function
         *
         * @param aMSDataStore the generic mswipe data store, this instance refers to LastTransactionResponseData, so this
         *                     need be type cast back to LastTransactionResponseData to access the  response data
         * @return
         */
        public void onReponseData(MSDataStore aMSDataStore) {

            VoidTransactionResponseData voidTransactionResponseData = (VoidTransactionResponseData) aMSDataStore;


            Log.e("void", String.valueOf(voidTransactionResponseData.getResponseStatus()) + " and " + voidTransactionResponseData.getResponseFailureReason());
            if (voidTransactionResponseData.getResponseStatus()) {

                listener.onSuccess();
            } else if (voidTransactionResponseData.getResponseFailureReason().equalsIgnoreCase("transaction is already void")) {
                listener.onSuccess();
            } else {
                listener.onError(voidTransactionResponseData.getErrorCode(), voidTransactionResponseData.getResponseFailureReason());
            }
        }
    }


    public interface IRefundListener {

        void onError(String errorCode, String errorMessage);

        void onSuccess();
    }


}