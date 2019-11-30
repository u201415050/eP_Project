package com.epaisapos.card_factory.mosambee;

import java.util.concurrent.TimeUnit;

import okhttp3.OkHttpClient;
import okhttp3.ResponseBody;
import okhttp3.logging.HttpLoggingInterceptor;
import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Retrofit;
import retrofit2.http.Field;
import retrofit2.http.FormUrlEncoded;
import retrofit2.http.POST;

public class MosambeeService {


    private MosambeeEndpoint endpoint;

    public MosambeeService() {
        Retrofit.Builder builder =
                new Retrofit.Builder()
                        .baseUrl("https://mosambee.in/mpos/ws/");


        HttpLoggingInterceptor interceptor = new HttpLoggingInterceptor();
        OkHttpClient.Builder httpClient = new OkHttpClient.Builder();

        interceptor.setLevel(HttpLoggingInterceptor.Level.NONE);
        httpClient.addInterceptor(interceptor);
        httpClient.writeTimeout(120, TimeUnit.SECONDS);
        httpClient.readTimeout(120, TimeUnit.SECONDS);
        httpClient.connectTimeout(120, TimeUnit.SECONDS);
        Retrofit retrofit = builder.client(httpClient.build()).build();
        endpoint = retrofit.create(MosambeeEndpoint.class);
    }


    public void getStatus(
            String userName,
            String billNumber,
            String transactionId,
            String merchantId,
            String checksum,
            Callback<ResponseBody> delegate) {
        Call<ResponseBody> call = endpoint.getStatus(userName, billNumber, transactionId, merchantId, checksum);
        call.enqueue(delegate);
    }

    public interface MosambeeEndpoint {

        @FormUrlEncoded
        @POST("checkStatus")
        Call<ResponseBody> getStatus(
                @Field("userName") String userName,
                @Field("billNumber") String billNumber,
                @Field("transactionId") String transactionId,
                @Field("merchantId") String merchantId,
                @Field("checksum") String checksum
        );
    }
}