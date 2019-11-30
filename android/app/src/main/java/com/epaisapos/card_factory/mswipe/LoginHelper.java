package com.epaisapos.card_factory.mswipe;

import android.content.Context;
import android.content.SharedPreferences;
import android.util.Log;

import com.epaisapos.util.CardReaderEncryption;
import com.facebook.react.bridge.ReadableMap;
import com.mswipetech.sdk.network.MSGatewayConnectionListener;
import com.mswipetech.wisepad.sdk.MSWisepadController;
import com.mswipetech.wisepad.sdk.data.LoginResponseData;
import com.mswipetech.wisepad.sdk.data.MSDataStore;
import com.mswipetech.wisepad.sdk.listeners.MSWisepadControllerResponseListener;


public class LoginHelper {

    private String password;
    private ILoginListener listener;
    private ReadableMap request;
    private Context context;
    //The mswipe controller instance used for calling up the api's
    private MSWisepadController mMSWisepadController = null;

    public LoginHelper(Context context, ReadableMap requestData, ILoginListener listener) {
        this.context = context;

        this.listener = listener;
        mMSWisepadController = getController();
        this.request = requestData;

        password = CardReaderEncryption.decryptKey(this.request.getString("password")).trim();

    }

    private MSWisepadController getController() {
        return MSWisepadController.
                getSharedMSWisepadController(context,
                        MSWisepadController.GATEWAY_ENVIRONMENT.LABS,
                        MSWisepadController.NETWORK_SOURCE.WIFI,
                        new MSGatewayConnectionListener() {
                            @Override
                            public void Connecting(String s) {

                            }

                            @Override
                            public void Connected(String s) {

                            }

                            @Override
                            public void disConnect(String s) {

                            }
                        });
    }

    //Login Process start
    public void loginIntoMSwipe() {
        Log.v("MSTAG","Login");
        new Thread(new Runnable() {
            @Override
            public void run() {

                mMSWisepadController.authenticateMerchant(CardReaderEncryption.decryptKey(LoginHelper.this.request.getString("username")).trim(),
                        password,
                        new MSWisepadControllerResponseListener() {
                            @Override
                            public void onReponseData(MSDataStore msDataStore) {

                                LoginResponseData loginResponseData = (LoginResponseData) msDataStore;
                                boolean responseStatus = loginResponseData.getResponseStatus();
                                Log.e("login", String.valueOf(responseStatus));
                                if (!responseStatus) {
                                    if (loginResponseData.getErrorNo() == 100 && (loginResponseData.getResponseFailureReason().equalsIgnoreCase("invalid username or password")
                                            || loginResponseData.getResponseFailureReason().equalsIgnoreCase("incorrect login username or password"))) {
                                        Log.v("MSTAG","Login update device");
                                        updateDevices();
                                    } else {
                                        Log.v("MSTAG","Login failed "+loginResponseData.getResponseFailureReason());
                                        listener.onError("Mswipe onLoginError", loginResponseData.getResponseFailureReason());
                                    } } else {
                                    Log.v("MSTAG","Login success");
                                    saveResponse(loginResponseData);
                                }
                            }
                        });
            }
        }).start();
    }

    private void updateDevices() {
        UpdateDeviceHelper updateDeviceHelper = new UpdateDeviceHelper();
        updateDeviceHelper.update(request, new UpdateDeviceHelper.IUpdateDeviceListener() {
            @Override
            public void onError(String errCode, String errorMessage) {
                listener.onError(errCode, errorMessage);
            }

            @Override
            public void onSuccess() {
                if (password.length() >= 10)
                    password = password;
                else
                    password = password + "12";
                loginIntoMSwipe();
            }
        });

    }

    private void saveResponse(LoginResponseData loginResponseData) {
        if (!loginResponseData.isFirstTimePasswordChanged()) {
            Log.v("MSTAG","Login change pwd");
            callChangePassword(loginResponseData);
        } else {
            SharedPreferences pref = context.getSharedPreferences("regenKey", Context.MODE_PRIVATE);
            SharedPreferences.Editor editor = pref.edit();
            String referenceId = loginResponseData.getReferenceId();
            String sessionToken = loginResponseData.getSessionTokeniser();
            String Currency_Code = loginResponseData.getCurrency();
            boolean tipRequired = loginResponseData.isTipsRequired();
            float convienencePercentage = loginResponseData.getConveniencePercentage();
            float serviceTax = loginResponseData.getServiceTax();
            boolean pinbypass = loginResponseData.isPinBypass();
            boolean receiptEnabled = loginResponseData.isReceiptRequired();
            editor.putString("currenyCode", Currency_Code + ".");
            editor.putString("referenceid", referenceId);
            editor.putString("sessiontoken", sessionToken);
            editor.putBoolean("tipenabled", tipRequired);
            editor.putFloat("conveniencePercentage", convienencePercentage);
            editor.putFloat("servicePercentageOnConvenience", serviceTax);
            editor.putBoolean("pinbypass", pinbypass);
            editor.putBoolean("receiptEnabled", receiptEnabled);
            editor.putString("deviceSerialNumber", this.request.getString("serialNumber"));
            editor.apply();
            listener.onSuccess();
        }


    }


    private void callChangePassword(LoginResponseData loginResponseData) {

        ChangePasswordHelper changePasswordHelper = new ChangePasswordHelper(context,
                request, loginResponseData,
                new ChangePasswordHelper.IChangePasswordListener() {
                    @Override
                    public void onError(String errCode, String errorMessage) {
                        deleteCache();
                        listener.onError(errCode, errorMessage);
                    }

                    @Override
                    public void onSuccess(String newPassword) {
                        deleteCache();
                        password = newPassword;
                        loginIntoMSwipe();

                    }
                });
        changePasswordHelper.changePassword();
    }

    private void deleteCache() {
        SharedPreferences pref = context.getSharedPreferences("regenKey", Context.MODE_PRIVATE);
        SharedPreferences.Editor editor = pref.edit();
        editor.putString("referenceid", "");
        editor.apply();
    }


    public interface ILoginListener {
        void onError(String errCode, String errorMessage);

        void onSuccess();

    }
}
