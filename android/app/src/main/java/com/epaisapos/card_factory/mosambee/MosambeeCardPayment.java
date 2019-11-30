package com.epaisapos.card_factory.mosambee;

import android.util.Log;

import com.epaisapos.card_factory.ICardPayment;
import com.epaisapos.util.CardReaderEncryption;
import com.epaisapos.util.CardTransactionState;
import com.epaisapos.util.Util;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.mosambee.lib.MosCallback;
import com.mosambee.lib.ResultData;
import com.mosambee.lib.TransactionResult;

import org.json.JSONException;
import org.json.JSONObject;

import java.security.MessageDigest;
import java.text.SimpleDateFormat;
import java.util.Date;


import okhttp3.ResponseBody;
import retrofit2.Call;
import retrofit2.Response;

public class MosambeeCardPayment implements ICardPayment {
    private ReadableMap requestData;
    private ReactContext context;
    private static boolean isCallbackCalled = false;

    public MosambeeCardPayment(ReadableMap requestData, ReactContext context) {
        this.requestData = requestData;
        this.context = context;
    }

    @Override
    public void startTransaction(final Callback callback) {
        isCallbackCalled = false;
        if (!isRequestValid(requestData)) {
            callback.invoke(Util.buildFailureResponse("CP_001", "Invalidate request from client app"));
        } else if (!isAmountValid(requestData)) {
            callback.invoke(Util.buildFailureResponse("CP_002", "Minimum amount for card transaction is 1"));
        } else if (!Util.isBluetoothEnabled(context.getApplicationContext())) {
            callback.invoke(Util.buildFailureResponse("CP_003", "Bluetooth is off."));
        } else if (!Util.isNetworkAvailable(context.getApplicationContext())) {
            callback.invoke(Util.buildFailureResponse("CP_004", "No internet connection."));
        } else {
            MosCallback mosCallback = new MosCallback(context.getApplicationContext());
            mosCallback.initialise(CardReaderEncryption.decryptKey(requestData.getString("userName")).trim(),
                    CardReaderEncryption.decryptKey(requestData.getString("password")).trim(),
                    new TransactionResult() {
                        @Override
                        public void onResult(ResultData resultData) {
                            if (!resultData.getTransactionData().equals("null") && resultData.getResult()) {
                                JSONObject jsonObject = new JSONObject();
                                try {
                                    jsonObject = new JSONObject(resultData.getTransactionData());
                                } catch (JSONException e) {
                                    e.printStackTrace();
                                }
                                WritableMap response = Arguments.createMap();
                                response.putBoolean("success", true);
                                response.putString("RRN", jsonObject.optString("retrievalReferenceNumber"));
                                response.putString("invoiceNumber", resultData.getTransactionId());
                                response.putString("AID", jsonObject.optString("applicationId"));
                                response.putString("apprCode", jsonObject.optString("approvalCode"));
                                response.putString("cardType", jsonObject.optString("cardType"));
                                response.putString("tdate", jsonObject.optString("date"));
                                response.putString("maskedPAN", jsonObject.optString("cardNumber"));
                                response.putString("ttime", jsonObject.optString("time"));
                                response.putString("TSI", jsonObject.optString("tsi"));
                                response.putString("TVR", jsonObject.optString("tvr"));
                                response.putString("cardHolderName", jsonObject.optString("cardHolderName"));
                                Log.v("MOSAMBEE", "TRANSACTION: " + jsonObject.toString());
                                if (!isCallbackCalled){
                                    callback.invoke(response);
                                    isCallbackCalled=true;
                                }

                            } else {
                                String responseMessage;
                                if (resultData.getReason() != null) {
                                    responseMessage = resultData.getReason().replaceAll("mosambee", "ePaisa");
                                } else
                                    responseMessage = resultData.getReason();
                                if (!isCallbackCalled){
                                    callback.invoke(Util.buildFailureResponse(resultData.getReasonCode(), responseMessage));
                                    isCallbackCalled=true;
                                }

                            }
                        }

                        @Override
                        public void onCommand(String s) {
                            Log.v("MOSAMBEE", "State: " + s);
                            CardTransactionState state = CardTransactionState.PROCESSING;
                            if (s.equalsIgnoreCase("Enter PIN..")) {
                                state = CardTransactionState.ENTER_PIN;

                            }
                            WritableMap payload = Arguments.createMap();
                            // Put data to map
                            payload.putString("state", state.toString());
                            // Get EventEmitter from context and send event thanks to it
                            context
                                    .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                                    .emit("cardTransactionStatus", payload);
                        }
                    });

            SimpleDateFormat dt1 = new SimpleDateFormat("dd-MM-yyyy");
            mosCallback.initialiseFields("sale", "",
                    CardReaderEncryption.decryptKey(requestData.getString("appKey")), false, "",
                    requestData.getString("accountNumber")
                    , "", dt1.format(new Date()), "0");
            mosCallback.setSleepTime(0);

            mosCallback.processTransaction(requestData.getString("transactionId"), Double.parseDouble(requestData.getString("amount"))
                    , 0.0, "");
        }
    }

    @Override
    public void refundTransaction(final Callback callback) {
        refund(CardReaderEncryption.decryptKey(requestData.getString("userName")).trim(),
                CardReaderEncryption.decryptKey(requestData.getString("password")).trim()
                , requestData.getString("invoiceNumber"), callback);
    }

    @Override
    public void reversal(final Callback callback) {

        final String userName = CardReaderEncryption.decryptKey(requestData.getString("userName")).trim();
        final String password = CardReaderEncryption.decryptKey(requestData.getString("password")).trim();
        final String transactionId = requestData.getString("transactionId");
        String mosambeeMerchantId = CardReaderEncryption.decryptKey(requestData.getString("mosambeeMerchantId")).trim();
        String saltKey = CardReaderEncryption.decryptKey(requestData.getString("saltKey")).trim();
        String checkSum = generateCheckSum(userName, transactionId, mosambeeMerchantId, saltKey);
        MosambeeService service = new MosambeeService();
        service.getStatus(userName, transactionId, "", mosambeeMerchantId, checkSum,
                new retrofit2.Callback<ResponseBody>() {
                    @Override
                    public void onResponse(Call<ResponseBody> call, Response<ResponseBody> response) {
                        try {
                            JSONObject jsonObject = new JSONObject(response.body().string());
                            if (jsonObject.has("transactionStatus") && jsonObject.getString("transactionStatus").equals("Approved")) {
                                getTransactionMetaData(userName, password, transactionId, callback);
                            } else {
                                WritableMap response1 = Arguments.createMap();
                                response1.putBoolean("success", true);
                                callback.invoke(response1);
                            }
                        } catch (Exception e) {
                            e.printStackTrace();
                            callback.invoke(Util.buildFailureResponse("Error", "Parse issue"));
                        }
                    }

                    @Override
                    public void onFailure(Call<ResponseBody> call, Throwable t) {
                        callback.invoke(Util.buildFailureResponse("Error", "Network Issue"));
                    }
                });

    }

    private boolean isAmountValid(ReadableMap requestData) {
        return Double.parseDouble(requestData.getString("amount")) >= 1;
    }

    private boolean isRequestValid(ReadableMap requestData) {
        return requestData.hasKey("amount")
                && requestData.hasKey("appKey")
                && requestData.hasKey("accountNumber")
                && requestData.hasKey("userName")
                && requestData.hasKey("password")
                && requestData.hasKey("transactionId");

    }

    private String generateCheckSum(String userName, String transactionId, String mosambeeMerchantId, String saltKey) {
        try {
            String checkSumForString = userName + transactionId + mosambeeMerchantId + saltKey;
            StringBuilder sb = new StringBuilder();
            MessageDigest md = MessageDigest.getInstance("SHA-512");
            md.update(checkSumForString.getBytes());
            byte[] byteData = md.digest();
            for (byte b : byteData) {
                sb.append(Integer.toString((b & 0xff) + 0x100, 16).substring(1));
            }
            return sb.toString();
        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }

    private void refund(String userName, String password, String invoiceNumber, final Callback callback) {
        MosCallback mosCallback = new MosCallback(context.getApplicationContext());
        mosCallback.initialise(userName, password
                , new TransactionResult() {
                    @Override
                    public void onResult(ResultData resultData) {
                        Log.v("TAG", "RESULT DATA " + resultData.getTransactionData());
                        if (resultData.getResult() && resultData.getReasonCode().equals("NA")) {
                            WritableMap response = Arguments.createMap();
                            response.putBoolean("success", true);
                            callback.invoke(response);
                        } else {
                            callback.invoke(Util.buildFailureResponse(resultData.getReasonCode(), resultData.getReason()));
                        }
                    }

                    @Override
                    public void onCommand(String s) {
                        Log.v("TAG", "onCommand " + s);
                    }
                });

        mosCallback.doVoid(invoiceNumber);
    }

    private void getTransactionMetaData(final String userName, final String password, String transactionId, final Callback callback) {
        MosCallback mosCallback = new MosCallback(context.getApplicationContext());
        mosCallback.initialise(userName, password
                , new TransactionResult() {
                    @Override
                    public void onResult(ResultData resultData) {
                        Log.v("TAG", "RESULT DATA " + resultData.getTransactionData());
                        if (resultData.getResult() && resultData.getReasonCode().equals("NA")) {
                            refund(userName, password, resultData.getTransactionId(), callback);
                        } else {
                            callback.invoke(Util.buildFailureResponse(resultData.getReasonCode(), resultData.getReason()));
                        }
                    }

                    @Override
                    public void onCommand(String s) {
                        Log.v("TAG", "onCommand " + s);
                    }
                });
        mosCallback.getMetaData(transactionId);

    }
}
