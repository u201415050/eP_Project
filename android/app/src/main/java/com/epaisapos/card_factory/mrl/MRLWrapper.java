package com.epaisapos.card_factory.mrl;

import android.app.Activity;
import android.content.Context;

import com.example.mrlpay.MrlpayRP750x;

import java.io.IOException;
import java.lang.reflect.Field;
import java.util.HashMap;
import java.util.Hashtable;
import java.util.Map;


public class MRLWrapper {
    public static HashMap<String, String> getResponseMap() {
        return responseMap;
    }

    private static MrlpayRP750x mrl;
    private static HashMap<String, String> responseMap;
    public static Hashtable<String, String> source = new Hashtable<>();


    public static int InitializeStatus(Context context) {
        init();
        return mrl.InitializeStatus(responseMap, context);
    }

    public static void Initialize(HashMap<String, String> Request, Context con) {
        init();
        mrl.Initialize(Request, con, getActivity());
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


    public static int login(HashMap<String, String> Request, Context context) {
        init();
        return mrl.Logon(Request, responseMap, "", context);
    }

    @SuppressWarnings("unchecked")
    private static void init() {
        if (mrl == null) {
            source = new Hashtable<>();
            mrl = new MrlpayRP750x();
        }
        if (responseMap == null)
            responseMap = new HashMap(source);
        else
            responseMap.clear();
    }

    public static int logout(HashMap<String, String> Response, Context context) {
        init();
        return mrl.Logout(Response, context);
    }

    public static void disconnectReader(Context context) {
        if (mrl == null)
            mrl = new MrlpayRP750x();
        mrl.DisconnectReader(context);
    }


    public static int hostConnection(Context con1, HashMap<String, String> Request) {

        init();
        return mrl.HostConnection(con1, Request, responseMap, 1);
    }

    public static void resetCardReader(Context con1) {

        init();
        mrl.LoadEmvTransactionParameters(con1);
    }

    public static int regenKeysStatus(Context context) {
        return mrl.RegenKeysStatus(responseMap, context);
    }

    public static int completeMRLTransaction(Context context) {
        return mrl.CompleteMRLTransaction(context);
    }

    public static void preSwipeInsert(HashMap<String, String> Request, Context con) {
        init();
        mrl.PreSwipeInsert(Request, con);
    }

    public static int saleTransactionStatus(Context context) {
        return mrl.SaleTransactionStatus(responseMap, context);
    }

    public static int emvCompleteTransactionStatus(Context con1) {
        init();
        return mrl.EMVCompleteTransactionStatus(responseMap, con1);
    }

    public static void rpReaderStopTransaction(Context con1) {
        try {
            mrl.rpReaderStopTransaction(con1);
        } catch (Exception e) {
            e.printStackTrace();
        }

    }


    public static int reverseTransaction(Context con1, HashMap<String, String> Request) {
        init();
        return mrl.ReverseTransaction(con1, Request, responseMap, 1);
    }

}
