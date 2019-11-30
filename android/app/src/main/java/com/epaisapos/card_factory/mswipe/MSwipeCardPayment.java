package com.epaisapos.card_factory.mswipe;

import android.app.Activity;
import android.util.Log;

import com.epaisapos.card_factory.ICardPayment;
import com.epaisapos.util.CardTransactionState;
import com.epaisapos.util.Util;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.mswipetech.wisepad.sdk.data.CardSaleResponseData;

import java.lang.reflect.Field;
import java.util.Map;


public class MSwipeCardPayment implements ICardPayment {
    private ReadableMap requestData;
    private ReactContext reactContext;
    private MSWipeTransactionHelper helper;
    private static boolean isCallbackCalled = false;

    public MSwipeCardPayment(ReadableMap requestData, ReactContext reactContext) {
        this.reactContext = reactContext;
        this.requestData = requestData;
        this.helper = new MSWipeTransactionHelper(getActivity(), requestData);
    }

    private static Activity getActivity() {
        try {
            Class activityThreadClass = Class.forName("android.app.ActivityThread");
            Object activityThread = activityThreadClass.getMethod("currentActivityThread").invoke(null);
            Field activitiesField = activityThreadClass.getDeclaredField("mActivities");
            activitiesField.setAccessible(true);

            Map<Object, Object> activities = (Map<Object, Object>) activitiesField.get(activityThread);
            if (activities == null)
                return null;

            for (Object activityRecord : activities.values()) {
                Class activityRecordClass = activityRecord.getClass();
                Field pausedField = activityRecordClass.getDeclaredField("paused");
                pausedField.setAccessible(true);
                if (!pausedField.getBoolean(activityRecord)) {
                    Field activityField = activityRecordClass.getDeclaredField("activity");
                    activityField.setAccessible(true);
                    Activity activity = (Activity) activityField.get(activityRecord);
                    return activity;
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        }

        return null;
    }


    @Override
    public void startTransaction(final Callback callback) {
        isCallbackCalled = false;
        if (!isAmountValid(requestData)) {
            callback.invoke(Util.buildFailureResponse("CP_002", "Minimum amount for card transaction is 1"));
        } 
        // else if (!Util.isBluetoothEnabled(reactContext.getApplicationContext())) {
        //     callback.invoke(Util.buildFailureResponse("CP_003", "Bluetooth is off."));
        // } 
        else if (!Util.isNetworkAvailable(reactContext.getApplicationContext())) {
            callback.invoke(Util.buildFailureResponse("CP_004", "No internet connection."));
        } else {
            helper.makePayment(new MSWipeTransactionHelper.IPaymentListener() {
                @Override
                public void onError(String errorCode, String errorMessage) {
                    if (!isCallbackCalled) {
                        callback.invoke(Util.buildFailureResponse(errorCode, errorMessage));
                        isCallbackCalled = true;
                    }
                }

                @Override
                public void state(CardTransactionState state) {
                    Log.v("TAG", "State " + state.toString());
                    WritableMap payload = Arguments.createMap();
                    // Put data to map
                    payload.putString("state", state.toString());
                    // Get EventEmitter from context and send event to it
                    reactContext
                            .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                            .emit("cardTransactionStatus", payload);
                }

                @Override
                public void onSuccess(CardSaleResponseData transaction) {
                    WritableMap response = buildSuccessResponse(transaction);
                    Log.v("TAG", "Success response " + response.toString());
                    Log.v("TAG", "Success response called " + isCallbackCalled);
                    if (!isCallbackCalled) {
                        callback.invoke(response);
                        isCallbackCalled = true;
                    }

                }
            });

        }
    }

    @Override
    public void refundTransaction(final Callback callback) {
        MSwipeRefundHelper helper = new MSwipeRefundHelper(reactContext.getApplicationContext(), requestData, new MSwipeRefundHelper.IRefundListener() {
            @Override
            public void onError(String errorCode, String errorMessage) {
                callback.invoke(Util.buildFailureResponse(errorCode, errorMessage));
            }

            @Override
            public void onSuccess() {
                WritableMap response = Arguments.createMap();
                response.putBoolean("success", true);
                callback.invoke(response);
            }
        });
        helper.refund();
    }

    @Override
    public void reversal(Callback callback) {

    }

    private boolean isAmountValid(ReadableMap requestData) {
        return Double.parseDouble(requestData.getString("amount")) >= 10;
    }

    private WritableMap buildSuccessResponse(CardSaleResponseData transaction) {
        WritableMap response = Arguments.createMap();
        response.putBoolean("success", true);
        response.putString("authCode", transaction.getAuthCode());
        response.putString("apprCode", transaction.getAuthCode());
        response.putString("RRN", transaction.getRRNO());
        response.putString("AID", transaction.getAppIdentifier());
        response.putString("batchNumber", transaction.getBatchNo());
        response.putString("cardLabel", transaction.getSwitchCardType());
        response.putString("cardType", transaction.getCardType());
        response.putString("tdate", transaction.getDate());
        response.putString("maskedPAN", transaction.getCreditCardNo());
        response.putString("invoiceNumber", transaction.getVoucherNo());
        response.putString("TC", transaction.getCertif());
        response.putString("TSI", transaction.getTSI());
        response.putString("TVR", transaction.getTVR());
        response.putString("cardHolderName", transaction.getCardHolderName());
        response.putString("stanID", transaction.getStandId());
        response.putString("cardTicketNo", transaction.getmCardTicketNo());
        response.putString("last4Digits", transaction.getLast4Digits());
        response.putString("first4Digits", transaction.getFirst4Digits());
        response.putString("cardBalanceAmt", transaction.getmCardBalanceAmount());
        response.putString("isAutoVoid", String.valueOf(transaction.getIsAutoVoid()));
        response.putString("FO39Tag", transaction.getFO39Tag());
        response.putString("cardSaleApprovedMessage", transaction.getCardSaleApprovedMessage());
        response.putString("emvCardExpdate", transaction.getEmvCardExpdate());
        response.putString("receiptEnabledForAutoVoid", transaction.getReceiptEnabledForAutoVoid());
        response.putString("strReceiptData", transaction.getStrReceiptData());
        response.putString("switchCardType", transaction.getSwitchCardType());
        response.putString("cardSchemeResults", transaction.getCardSchemeResults().toString());
        response.putString("expiryDate", transaction.getExpiryDate());
        response.putString("serviceCode", transaction.getServiceCode());
        response.putString("applicationName", transaction.getApplicationName());
        response.putString("isPin", String.valueOf(transaction.isPin()));
        response.putString("signatureRequired", String.valueOf(transaction.isSignatureRequired()));
        response.putString("tlvData", transaction.getTlvData());
        response.putString("EPBKsn", transaction.getEPBKsn());
        response.putString("EPB", transaction.getEPB());
        response.putString("paddingInfo", transaction.getPaddingInfo());
        response.putString("isAllowFallBack", String.valueOf(transaction.isAllowFallBack()));
        response.putString("exceptoinStackTrace", transaction.getExceptoinStackTrace());
        response.putString("responseStatus", String.valueOf(transaction.getResponseStatus()));

        return response;
    }
}
