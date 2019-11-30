package com.epaisapos.card_factory.mswipe;

import android.content.Context;
import android.util.Log;

import com.epaisapos.util.CardReaderEncryption;
import com.facebook.react.bridge.ReadableMap;
import com.mswipetech.wisepad.sdk.MSWisepadController;
import com.mswipetech.wisepad.sdk.data.ChangePasswordResponseData;
import com.mswipetech.wisepad.sdk.data.LoginResponseData;
import com.mswipetech.wisepad.sdk.data.MSDataStore;
import com.mswipetech.wisepad.sdk.listeners.MSWisepadControllerResponseListener;


public class ChangePasswordHelper {
    private LoginResponseData loginResponseData;
    private Context context;

    private IChangePasswordListener listener;
    private ReadableMap request;
    private String newPassword;

    public ChangePasswordHelper(Context context, ReadableMap request, LoginResponseData loginResponseData, IChangePasswordListener listener) {

        this.context = context;
        this.request = request;
        String oldPassword = CardReaderEncryption.decryptKey(this.request.getString("password")).trim();
        if (oldPassword.length() >= 10)
            this.newPassword = oldPassword;
        else
            this.newPassword = oldPassword + "12";
        this.loginResponseData = loginResponseData;

        this.listener = listener;
    }

    private MSWisepadController getController() {
        return MSWisepadController.
                getSharedMSWisepadController(context,
                        MSWisepadController.GATEWAY_ENVIRONMENT.LABS,
                        MSWisepadController.NETWORK_SOURCE.WIFI,
                        null);

    }


    public void changePassword() {
        try {
            Log.v("MSTAG","Change password");
            getController().changePassword(
                    loginResponseData.getReferenceId(),
                    loginResponseData.getSessionTokeniser(),
                    CardReaderEncryption.decryptKey(this.request.getString("password")).trim(),
                    newPassword,
                    new ResponseListener());


        } catch (Exception e) {
            e.printStackTrace();
        }
    }


    class ResponseListener implements MSWisepadControllerResponseListener {
        public void onReponseData(MSDataStore aMSDataStore) {
            ChangePasswordResponseData changePasswordResponseData = (ChangePasswordResponseData) aMSDataStore;
            boolean responseStatus = changePasswordResponseData.getResponseStatus();
            if (!responseStatus) {
                Log.v("MSTAG","Change password Failed");
                listener.onError("Invalid response from Mswipe server in change password api", changePasswordResponseData.getResponseFailureReason());
            } else {
                Log.v("MSTAG","Change password Success");
                updateDevice();
            }
        }
    }

    private void updateDevice() {
        Log.v("MSTAG","Update Device");
        UpdateDeviceHelper updateDeviceHelper = new UpdateDeviceHelper();
        updateDeviceHelper.update(request, new UpdateDeviceHelper.IUpdateDeviceListener() {
            @Override
            public void onError(String errCode, String errorMessage) {
                Log.v("MSTAG","Update Device Failed "+errorMessage);
                listener.onError(errCode, errorMessage);
            }

            @Override
            public void onSuccess() {
                Log.v("MSTAG","Update Device Success");
                listener.onSuccess(newPassword);
            }
        });
    }


    public interface IChangePasswordListener {
        void onError(String errCode, String errorMessage);

        void onSuccess(String newPassword);

    }
}
