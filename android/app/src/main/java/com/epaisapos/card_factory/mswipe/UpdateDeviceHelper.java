package com.epaisapos.card_factory.mswipe;

import com.epaisapos.util.CardReaderEncryption;
import com.facebook.react.bridge.ReadableMap;

import org.json.JSONObject;

import okhttp3.OkHttpClient;
import okhttp3.ResponseBody;
import okhttp3.logging.HttpLoggingInterceptor;
import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;
import retrofit2.Retrofit;
import retrofit2.http.Field;
import retrofit2.http.FormUrlEncoded;
import retrofit2.http.PUT;

public class UpdateDeviceHelper {


    private String buildRequest(ReadableMap request) {
        try {
            String oldPassword = CardReaderEncryption.decryptKey(request.getString("password")).trim();
            String newPassword;
            if (oldPassword.length() >= 10)
                newPassword = oldPassword;
            else
                newPassword = oldPassword + "12";

            JSONObject json = new JSONObject();
            json.put("merchantId", request.getInt("merchantId"));
            json.put("userId", request.getInt("userId"));
            json.put("deviceActive", request.getInt("deviceActive"));
            json.put("deviceId", request.getInt("deviceId"));
            json.put("deviceProcessorId", request.getInt("processorId"));
            json.put("manufacturerId", request.getInt("manufacturerId"));
            json.put("deviceTypeId", request.getInt("deviceTypeId"));
            json.put("deviceTypeName", request.getString("deviceTypeName"));
            json.put("deviceSerialNumber", request.getString("serialNumber"));
            json.put("deviceManufacturerName", request.getString("deviceManufacturerName"));

            json.put("deviceProcessorKeyValue", new JSONObject("{" + "username:" + ""
                    + CardReaderEncryption.decryptKey(CardReaderEncryption.decryptKey(request.getString("userName")).trim()+ "," +
                    "password: " + "" + newPassword.trim() + "}")));



            return request.getString("authKey")+"####"+json.toString();
        } catch (Exception e) {
            return "";
        }
    }

    public void update(ReadableMap request, final IUpdateDeviceListener listener) {
        ;

        String requestData = CardReaderEncryption.encryptText(buildRequest(request));
        getClient(request.getString("url")).create(UserEndpoint.class)
                .updateDevices(requestData)
                .enqueue(new Callback<ResponseBody>() {
                    @Override
                    public void onResponse(Call<ResponseBody> call, Response<ResponseBody> response) {
                        try {
                            JSONObject jsonObject = new JSONObject(response.body().string());
                            if (jsonObject.getInt("success") == 1) {
                                listener.onSuccess();
                            } else {
                                listener.onError("Error", jsonObject.getString("message"));
                            }
                        } catch (Exception e) {
                            e.printStackTrace();
                            listener.onError("Error", "Error occurred while processing the payment.");

                        }
                    }

                    @Override
                    public void onFailure(Call<ResponseBody> call, Throwable t) {
                        listener.onError("Network Issue", "Network Issue. Failed to update Device");
                    }
                });
    }

    public interface IUpdateDeviceListener {
        void onError(String errCode, String errorMessage);

        void onSuccess();

    }

    private static Retrofit getClient(String url) {

        HttpLoggingInterceptor interceptor = new HttpLoggingInterceptor();
        interceptor.setLevel(HttpLoggingInterceptor.Level.BODY);
        OkHttpClient client = new OkHttpClient.Builder().addInterceptor(interceptor).build();


        return new Retrofit.Builder()
                .baseUrl(url)
                .client(client)
                .build();


    }

    public interface UserEndpoint {

        @FormUrlEncoded
        @PUT("user/devices/update-device-info")
        Call<ResponseBody> updateDevices(@Field("requestParams") String encryptedRequestParameters);
    }
}
