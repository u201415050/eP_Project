package com.epaisapos.card_factory.mrl;


import android.content.Context;
import android.content.SharedPreferences;
import android.preference.PreferenceManager;
import android.util.Log;

import com.epaisapos.util.CardReaderEncryption;
import com.epaisapos.util.CardTransactionState;
import com.facebook.react.bridge.ReadableMap;

import java.util.Calendar;
import java.util.HashMap;
import java.util.concurrent.TimeUnit;

import rx.Observable;
import rx.Observer;
import rx.Subscription;
import rx.android.schedulers.AndroidSchedulers;
import rx.functions.Action1;
import rx.functions.Func1;
import rx.schedulers.Schedulers;
import rx.subscriptions.CompositeSubscription;

public class MRLHelper {


    private CompositeSubscription compositeSubscription;
    private Subscription subscription;
    private static int isDeviceConnected = 0;
    private static boolean isLoggedIn = false;
    public static final int CONNECTING_TO_DEVICE = 101;
    public static final int LOGIN_TO_MRL = 102;
    public static final int DEVICE_CONNECTED = 104;
    public static final int REGENERATING_KEY = 103;
    public static final int BAD_SWIPE = 105;

    public static final int SWIPE_THE_CARD = 1001;
    public static final int ENTER_PIN = 1002;
    public static final int DISMISS_SWIPE = 1003;
    public static final int DISMISS_PIN = 1004;
    public static final int SELECT_ACCOUNT = 1005;
    public static final int DISMISS_ACCOUNT = 1006;
    public static final int PAYMENT_IS_UNDER_PROCESSING = 1007;
    private ReadableMap request;

    private String amount;
    int countDown = 0;


    public static int isDeviceConnected() {
        return isDeviceConnected;
    }

    public void setRequest(ReadableMap request) {
        this.request = request;
    }

    // this method connect to Device
    public void connectToDevice(final Context context, final ICardPaymentCallback cardPaymentCallback) {

        HashMap<String, String> requestData = new HashMap(MRLWrapper.source);
        requestData.put("Reader_Type", this.request.getString("cardReaderType"));
        requestData.put("Serial_No", this.request.getString("serialNumber"));
        requestData.put("Package_Name", "com.epaisapos");
        requestData.put("Time_Out", "20");
        Log.v("MRL", "Connect to device " + requestData.toString());
        MRLWrapper.Initialize(requestData, context);
        compositeSubscription = new CompositeSubscription();
        countDown = 0;
        compositeSubscription.add(Observable.interval(1, TimeUnit.SECONDS).map(new Func1<Long, Integer>() {
            @Override
            public Integer call(Long aLong) {
                return MRLWrapper.InitializeStatus(context);
            }
        }).take(20).subscribeOn(Schedulers.io()).observeOn(AndroidSchedulers.mainThread())
                .subscribe(new Action1<Integer>() {
                    @Override
                    public void call(Integer response) {
                        countDown++;
                        if (response == -1) {
                            if (countDown > 18) {
                                if (!compositeSubscription.isUnsubscribed())
                                    compositeSubscription.unsubscribe();
                                cardPaymentCallback.OnError("110");
                                return;
                            }

                            cardPaymentCallback.processing(CardTransactionState.PROCESSING);
                            Log.v("TAG", "Connect to device PROCESSING");
                            isDeviceConnected = -1;
                        } else if (response == 1) {
                            countDown = 0;
                            isDeviceConnected = 1;
                            loginIntoMRL(context, cardPaymentCallback);
                            //  Log.v("TAG", "SUCCESS RESPONSE CODE" + MRLWrapper.getResponseMap().get("Response_Code"));
                            if (!compositeSubscription.isUnsubscribed())
                                compositeSubscription.unsubscribe();
                        } else {
                            countDown = 0;
                            cardPaymentCallback.OnError(MRLWrapper.getResponseMap().get("Response_Code"));
                            Log.v("TAG", "ERROR RESPONSE CODE" + MRLWrapper.getResponseMap().get("Response_Code"));
                            if (MRLWrapper.getResponseMap().get("Response_Code") != null && MRLWrapper.getResponseMap().get("Response_Code").equals("104")) {
                                PreferenceManager.getDefaultSharedPreferences(context).edit().clear().apply();
                            }
                            if (!compositeSubscription.isUnsubscribed())
                                compositeSubscription.unsubscribe();
                        }

                    }
                }));
    }


    public static boolean isLoggedIn() {
        return isLoggedIn;
    }

    public void disconnectToDevice(Context context) {
        isDeviceConnected = 0;
        isLoggedIn = false;
        MRLWrapper.disconnectReader(context);
    }


    public void resetCardReader(Context context) {
        MRLWrapper.resetCardReader(context);
    }

    public void completeTransaction(Context context) {
        MRLWrapper.completeMRLTransaction(context);
    }

    //RegenKey Process start
    public void regenKey(final Context context, final ICardPaymentCallback cardPaymentCallback) {

        if (isRegenKeyRequired(context)) {
            subscription = Observable.just(true).map(new Func1<Boolean, Integer>() {
                @Override
                public Integer call(Boolean aBoolean) {


                    HashMap<String, String> requestData = new HashMap(MRLWrapper.source);
                    requestData.put("User_Name", CardReaderEncryption.decryptKey(MRLHelper.this.request.getString("userName")).trim());
                    requestData.put("TID", CardReaderEncryption.decryptKey(MRLHelper.this.request.getString("tid")).trim());
                    requestData.put("MID", CardReaderEncryption.decryptKey(MRLHelper.this.request.getString("mid")).trim());
                    requestData.put("Tran_Type", "REGEN_KEYS");
                    requestData.put("Reader_Type", MRLHelper.this.request.getString("cardReaderType"));
                    requestData.put("Serial_No", MRLHelper.this.request.getString("serialNumber"));
                    requestData.put("Package_Name", "com.epaisapos");
                    requestData.put("Param_Req", "Yes");
                    Log.v("MRL", "regenKey request " + requestData.toString());
                    return MRLWrapper.hostConnection(context, requestData);
                }
            }).subscribeOn(Schedulers.io()).observeOn(AndroidSchedulers.mainThread()).subscribe(new Observer<Integer>() {
                @Override
                public void onCompleted() {

                }

                @Override
                public void onError(Throwable e) {
                    e.printStackTrace();
                }

                @Override
                public void onNext(Integer response) {

                    if (response > 0 && MRLWrapper.getResponseMap().get("Response_Code").equals("000")) {
                        getRegenKeyStatus(context, cardPaymentCallback);
                    } else {

                        if (MRLWrapper.getResponseMap().get("Response_Code").equals("322")) {
                            completeTheRegenKeyProcess(context, cardPaymentCallback);
                        } else {

                            cardPaymentCallback.OnError(MRLWrapper.getResponseMap().get("Response_Code"));
                        }
                    }
                    onCompleted();

                }
            });
        } else {
            completeTheRegenKeyProcess(context, cardPaymentCallback);

        }


    }

    private void getRegenKeyStatus(final Context context, final ICardPaymentCallback cardPaymentCallback) {

        compositeSubscription = new CompositeSubscription();
        compositeSubscription.add(Observable.interval(1, TimeUnit.SECONDS).map(new Func1<Long, Integer>() {
            @Override
            public Integer call(Long aLong) {
                return MRLWrapper.regenKeysStatus(context);
            }
        }).take(100).subscribeOn(Schedulers.io()).observeOn(AndroidSchedulers.mainThread()).subscribe(new Action1<Integer>() {
            @Override
            public void call(Integer response) {
                if (response == -1)
                    cardPaymentCallback.processing(CardTransactionState.PROCESSING);
                else if (response > 0) {
                    if (MRLWrapper.getResponseMap().get("Response_Code").equals("500B")) {
                        if (!compositeSubscription.isUnsubscribed())
                            compositeSubscription.unsubscribe();


                        saveRegenKey(context);
                        completeTheRegenKeyProcess(context, cardPaymentCallback);

                    } else {
                        Log.v("TAG", "PROCESSING REGEN KEY...");
                    }

                } else {
                    if (!compositeSubscription.isUnsubscribed())
                        compositeSubscription.unsubscribe();

                    if (MRLWrapper.getResponseMap().get("Response_Code").equals("322")) {
                        completeTheRegenKeyProcess(context, cardPaymentCallback);
                    } else {

                        cardPaymentCallback.OnError(MRLWrapper.getResponseMap().get("Response_Code"));
                        Log.v("TAG", "Failed REGEN KEY");
                    }
                }

            }
        }));
    }

    private void saveRegenKey(Context context) {

        SharedPreferences pref = context.getSharedPreferences("regenKey", Context.MODE_PRIVATE);
        SharedPreferences.Editor e = pref.edit();
        e.putLong("time", Calendar.getInstance().getTimeInMillis());
        e.apply();
    }

    private long getRegenKayTimestamp(Context context) {
        SharedPreferences pref = context.getSharedPreferences("regenKey", Context.MODE_PRIVATE);
        return pref.getLong("time", -1);
    }

    private boolean isRegenKeyRequired(Context context) {
        if (getRegenKayTimestamp(context) == -1)
            return true;
        Calendar currentTime = Calendar.getInstance();
        currentTime.set(Calendar.HOUR_OF_DAY, 0);
        currentTime.set(Calendar.MINUTE, 0);
        currentTime.set(Calendar.SECOND, 0);
        currentTime.set(Calendar.MILLISECOND, 0);

        Calendar lastRegenKeyGeneratedTime = Calendar.getInstance();
        lastRegenKeyGeneratedTime.setTimeInMillis(getRegenKayTimestamp(context));
        lastRegenKeyGeneratedTime.set(Calendar.HOUR_OF_DAY, 0);
        lastRegenKeyGeneratedTime.set(Calendar.MINUTE, 0);
        lastRegenKeyGeneratedTime.set(Calendar.SECOND, 0);
        lastRegenKeyGeneratedTime.set(Calendar.MILLISECOND, 0);
        return currentTime.compareTo(lastRegenKeyGeneratedTime) != 0;
        //return true;
    }

    private void completeTheRegenKeyProcess(final Context context, final ICardPaymentCallback cardPaymentCallback) {
        Log.v("MRL", "completeTheRegenKeyProcess request ");
        subscription = Observable.just(true).map(new Func1<Boolean, Integer>() {
            @Override
            public Integer call(Boolean aBoolean) {
                return MRLWrapper.completeMRLTransaction(context);
            }
        }).subscribeOn(Schedulers.io()).observeOn(AndroidSchedulers.mainThread()).subscribe(new Action1<Integer>() {
            @Override
            public void call(Integer response) {

                if (response == 1) {
                    Log.v("", "Regen Key success");
                    doCardTransaction(context, cardPaymentCallback);
                } else {
                    cardPaymentCallback.OnError(MRLWrapper.getResponseMap().get("Response_Code"));

                    Log.v("", "No Internet Connection");
                }

            }
        });
    }

    //RegenKey process end

    //Login Process start
    public void loginIntoMRL(final Context context, final ICardPaymentCallback cardPaymentCallback) {
        Log.v("TAG", "loginIntoMRL");
        subscription = Observable.just(true).map(new Func1<Boolean, Integer>() {
            @Override
            public Integer call(Boolean aBoolean) {
                HashMap<String, String> requestData = new HashMap(MRLWrapper.source);

                requestData.put("User_Name", CardReaderEncryption.decryptKey(MRLHelper.this.request.getString("userName")).trim());
                requestData.put("Tid", CardReaderEncryption.decryptKey(MRLHelper.this.request.getString("tid")).trim());
                requestData.put("Mid", CardReaderEncryption.decryptKey(MRLHelper.this.request.getString("mid")).trim());
                requestData.put("Password", CardReaderEncryption.decryptKey(MRLHelper.this.request.getString("password")).trim());
                Log.v("MRL", "Login " + requestData.toString());
                return MRLWrapper.login(requestData, context);
            }
        }).subscribeOn(Schedulers.io()).observeOn(AndroidSchedulers.mainThread()).subscribe(new Action1<Integer>() {
            @Override
            public void call(Integer response) {
                if (!subscription.isUnsubscribed())
                    subscription.unsubscribe();
                if (response == 1) {
                    isLoggedIn = true;
                    Log.v("MRL", "Login Success");
                    regenKey(context, cardPaymentCallback);
                } else {
                    isLoggedIn = false;
                    cardPaymentCallback.OnError(MRLWrapper.getResponseMap().get("Response_Code"));
                }
                Log.v("TAG", "MRL LOGIN RESPONSE" + MRLWrapper.getResponseMap().get("Response_Code"));

            }
        });

    }

    //login Process End


    public String refundTransaction(Context context) {
        HashMap<String, String> requestData = new HashMap<>();
        requestData.put("User_Name", CardReaderEncryption.decryptKey(MRLHelper.this.request.getString("userName")).trim());
        requestData.put("TID", CardReaderEncryption.decryptKey(MRLHelper.this.request.getString("tid")).trim());
        requestData.put("MID", CardReaderEncryption.decryptKey(MRLHelper.this.request.getString("mid")).trim());
        ;
        requestData.put("Invoice_No", MRLHelper.this.request.getString("invoiceNumber"));
        requestData.put("Tran_Type", "VOID");
        requestData.put("Param_Req", "Yes");
        requestData.put("Serial_No", MRLHelper.this.request.getString("serialNumber"));
        requestData.put("Package_Name", "com.epaisapos");
        int integer = MRLWrapper.hostConnection(context, requestData);
        if (integer != -1) {
            int response = MRLWrapper.completeMRLTransaction(context);
            Log.v("TAG", "MRL  Voiding repsonse 2 : " + response);
            Log.v("TAG", "MRL Voiding test" + MRLWrapper.getResponseMap().get("Response_Code"));

            if (integer > 0)
                return "000";
            else {
                Log.v("TAG", "MRL Void host error " + MRLWrapper.getResponseMap().get("Response_Code"));
                return MRLWrapper.getResponseMap().get("Response_Code");
            }

        } else {
            Log.v("TAG", "MRL Void host error " + MRLWrapper.getResponseMap().get("Response_Code"));
            return MRLWrapper.getResponseMap().get("Response_Code");

        }


    }


    public void doCardTransaction(final Context context, final ICardPaymentCallback cardPaymentCallback) {
        Log.v("TAG", "doCardTransaction");
        this.amount = request.getString("amount");
        subscription = Observable.just(true).map(new Func1<Boolean, Long>() {
            @Override
            public Long call(Boolean aBoolean) {

                HashMap<String, String> requestData = new HashMap(MRLWrapper.source);

                requestData.put("User_Name", CardReaderEncryption.decryptKey(MRLHelper.this.request.getString("userName")).trim());
                requestData.put("TID", CardReaderEncryption.decryptKey(MRLHelper.this.request.getString("tid")).trim());
                requestData.put("MID", CardReaderEncryption.decryptKey(MRLHelper.this.request.getString("mid")).trim());
                requestData.put("Package_Name", "com.epaisapos");
                requestData.put("Time_Out", "60");
                requestData.put("Sale_Amt", amount);
                MRLWrapper.preSwipeInsert(requestData, context);
                Log.v("MRL", "doCardTransaction request " + requestData.toString());
                return System.currentTimeMillis() + 30000;
            }
        }).subscribeOn(Schedulers.io()).observeOn(AndroidSchedulers.mainThread()).
                subscribe(new Observer<Long>() {
                    @Override
                    public void onCompleted() {

                    }

                    @Override
                    public void onError(Throwable e) {
                        e.printStackTrace();
                    }

                    @Override
                    public void onNext(Long timeOutTime) {
                        cardPaymentCallback.processing(CardTransactionState.SWIPE_CARD);
                        Log.v("TAG", "doCardTransaction onNext");
                        getCurrentTransactionStatus(context, cardPaymentCallback, timeOutTime);
                        Log.v("TAG", "SWIPE/INSERT THE CARD");
                        if (!subscription.isUnsubscribed())
                            subscription.unsubscribe();

                    }

                });

    }

    private void getCurrentTransactionStatus(final Context context, final ICardPaymentCallback cardPaymentCallback, final long timeOutTime) {
        Log.v("TAG", "getCurrentTransactionStatus ");

        compositeSubscription = new CompositeSubscription();
        compositeSubscription.add(Observable.interval(1, TimeUnit.SECONDS).map(new Func1<Long, Integer>() {
            @Override
            public Integer call(Long aLong) {
                return MRLWrapper.saleTransactionStatus(context);
            }
        }).take(100).subscribeOn(Schedulers.io()).observeOn(AndroidSchedulers.mainThread()).subscribe(new Action1<Integer>() {
            @Override
            public void call(Integer response) {
                Log.v("TAG", "getCurrentTransactionStatus call");
                if (response == -1 && System.currentTimeMillis() > timeOutTime) {
                    MRLWrapper.rpReaderStopTransaction(context);
                    cardPaymentCallback.OnError("8888");
                    if (!compositeSubscription.isUnsubscribed())
                        compositeSubscription.unsubscribe();
                    Log.v("TAG", "TimeOut Occur");
                } else if (response == -1) {
                    Log.v("TAG", "PROCESSING...");
                } else {
                    cardPaymentCallback.processing(CardTransactionState.PROCESSING);
                    if (MRLWrapper.getResponseMap().get("Response_Code").equals("300")) {
                        completeTransactionForCardType(context, cardPaymentCallback, MRLWrapper.getResponseMap().get("Card_Type"));

                    } else if (MRLWrapper.getResponseMap().get("Response_Code").equals("322")) {
                        if (!compositeSubscription.isUnsubscribed())
                            compositeSubscription.unsubscribe();
                        completeTransactionProcess(context, cardPaymentCallback);
                    } else {
                        if (!compositeSubscription.isUnsubscribed())
                            compositeSubscription.unsubscribe();
                        Log.v("TAG", "ERROR Occured with responseCode : " + MRLWrapper.getResponseMap().get("Response_Code"));
                        handleTransactionError(context, cardPaymentCallback);
                    }


                }

            }
        }));

    }

    private void completeTransactionProcess(final Context context, final ICardPaymentCallback cardPaymentCallback) {
        subscription = Observable.just(true).map(new Func1<Boolean, Integer>() {
            @Override
            public Integer call(Boolean aBoolean) {
                return MRLWrapper.completeMRLTransaction(context);
            }
        }).subscribeOn(Schedulers.io()).observeOn(AndroidSchedulers.mainThread()).subscribe(new Action1<Integer>() {
            @Override
            public void call(Integer response) {
                if (!subscription.isUnsubscribed())
                    subscription.unsubscribe();
                if (response == 1) {
                    doCardTransaction(context, cardPaymentCallback);
                } else {
                    handleTransactionError(context, cardPaymentCallback);
                }

            }
        });
    }

    private void hostConnectionWithParameter(final Context context, final ICardPaymentCallback cardPaymentCallback, final String parameterRequired, final String accountType) {
        Log.v("TAG", "hostConnectionWithParameter ");
        subscription = Observable.just(true).map(new Func1<Boolean, Integer>() {
            @Override
            public Integer call(Boolean aBoolean) {
                HashMap<String, String> requestData = new HashMap(MRLWrapper.source);
                requestData.put("User_Name", CardReaderEncryption.decryptKey(MRLHelper.this.request.getString("userName")).trim());
                requestData.put("TID", CardReaderEncryption.decryptKey(MRLHelper.this.request.getString("tid")).trim());
                requestData.put("Param_Req", parameterRequired);

                if (parameterRequired.equals("Yes")) {
                    requestData.put("Account_Type", accountType);
                }

                return MRLWrapper.hostConnection(context, requestData);
            }
        }).subscribeOn(Schedulers.io()).
                observeOn(AndroidSchedulers.mainThread())
                .subscribe(new Action1<Integer>() {
                    @Override
                    public void call(Integer response) {
                        Log.v("TAG", "CARD TRANSACTION RESPONSE " + MRLWrapper.getResponseMap().get("Response_Code"));
                        if (response > 0) {
                            Log.v("TAG", "CARD TRANSACTION REF NUMBER " + MRLWrapper.getResponseMap().get("Invoice_No"));
                            Log.v("TAG", "CARD TRANSACTION CARD NAME " + MRLWrapper.getResponseMap().get("CardHolder_Name"));
                            Log.v("TAG", "CARD TRANSACTION CARD LABEL " + MRLWrapper.getResponseMap().get("Card_Label"));
                            Log.v("TAG", "CARD TRANSACTION CARD LABEL " + MRLWrapper.getResponseMap().get("Masked_Pan"));
                            cardPaymentCallback.OnSuccess();
                            Log.v("TAG", "CARD TRANSACTION RESPONSE APPROVED");
                        } else {
                            handleTransactionError(context, cardPaymentCallback);
                            Log.v("TAG", "ERROR");
                        }

                        if (!subscription.isUnsubscribed())
                            subscription.unsubscribe();
                    }
                });

    }

    private void hostConnectionForEMVCard(final Context context, final ICardPaymentCallback cardPaymentCallback, final String parameterRequired) {
        subscription = Observable.just(true).map(new Func1<Boolean, Integer>() {
            @Override
            public Integer call(Boolean aBoolean) {
                HashMap<String, String> requestData = new HashMap(MRLWrapper.source);
                requestData.put("User_Name", CardReaderEncryption.decryptKey(MRLHelper.this.request.getString("userName")).trim());
                requestData.put("TID", CardReaderEncryption.decryptKey(MRLHelper.this.request.getString("tid")).trim());
                requestData.put("Param_Req", parameterRequired);


                return MRLWrapper.hostConnection(context, requestData);
            }
        }).subscribeOn(Schedulers.io()).observeOn(AndroidSchedulers.mainThread()).subscribe(new Action1<Integer>() {
            @Override
            public void call(Integer response) {
                Log.v("TAG", "CARD TRANSACTION RESPONSE " + MRLWrapper.getResponseMap().get("Response_Code"));
                if (response > 0) {
                    if (response == 2) {
                        cardPaymentCallback.processing(CardTransactionState.PROCESSING);
                        getEMVCardTransactionStatus(context, cardPaymentCallback);
                    } else {
                        cardPaymentCallback.OnSuccess();
                        Log.v("TAG", "CARD TRANSACTION RESPONSE SUCCESS");
                    }
                } else {
                    handleTransactionError(context, cardPaymentCallback);
                    Log.v("TAG", "ERROR");
                }

                if (!subscription.isUnsubscribed())
                    subscription.unsubscribe();
            }
        });

    }


    public void onAccountSelected(Context context, final ICardPaymentCallback cardPaymentCallback, String accountType) {
        hostConnectionWithParameter(context, cardPaymentCallback, "Yes", accountType);
    }

    private void getEMVCardTransactionStatus(final Context context, final ICardPaymentCallback cardPaymentCallback) {

        compositeSubscription = new CompositeSubscription();
        compositeSubscription.add(Observable.interval(1, TimeUnit.SECONDS).map(new Func1<Long, Integer>() {
            @Override
            public Integer call(Long aLong) {
                return MRLWrapper.emvCompleteTransactionStatus(context);
            }
        }).take(100).subscribeOn(Schedulers.io()).observeOn(AndroidSchedulers.mainThread()).subscribe(new Action1<Integer>() {
            @Override
            public void call(Integer response) {
                if (response == -1) {

                    Log.v("TAG", "PROCESSING...");
                } else {
                    if (!compositeSubscription.isUnsubscribed())
                        compositeSubscription.unsubscribe();
                    if (response > 0) {
                        cardPaymentCallback.OnSuccess();
                        Log.v("TAG", "CARD TRANSACTION RESPONSE SUCCESS");
                    } else {
                        handleTransactionError(context, cardPaymentCallback);
                        Log.v("TAG", "ERROR");
                    }


                }

            }
        }));

    }

    private void completeTransactionForCardType(Context context, ICardPaymentCallback cardPaymentCallback, String cardType) {
        Log.v("TAG", "completeTransactionForCardType " + cardType);
        switch (cardType) {
            case "10001":
                if (!compositeSubscription.isUnsubscribed())
                    compositeSubscription.unsubscribe();
                cardPaymentCallback.processing(CardTransactionState.PROCESSING);
                hostConnectionWithParameter(context, cardPaymentCallback, "Yes", "00");
                break;
            case "10002":
                cardPaymentCallback.processing(CardTransactionState.ENTER_PIN);
                Log.v("TAG", "ENTER PIN");
                break;
            case "10003":
                if (!compositeSubscription.isUnsubscribed())
                    compositeSubscription.unsubscribe();
                // Account Selection flow
                cardPaymentCallback.selectAccount();


                break;
            case "10004":
                if (!compositeSubscription.isUnsubscribed())
                    compositeSubscription.unsubscribe();
                hostConnectionWithParameter(context, cardPaymentCallback, "No", "");
                break;
            case "10005":

                break;
            case "10006":

                break;
            case "10007":
                if (!compositeSubscription.isUnsubscribed())
                    compositeSubscription.unsubscribe();
                hostConnectionForEMVCard(context, cardPaymentCallback, "No");
                break;
            case "10008":

                break;
            default:
                break;
        }
    }

    public String reversal(final Context context) {
        Log.v("TEMP_TAG", "reverseTheTransaction");
        HashMap<String, String> requestData = new HashMap(MRLWrapper.source);

        requestData.put("User_Name", CardReaderEncryption.decryptKey(request.getString("userName")).trim());
        requestData.put("TID", CardReaderEncryption.decryptKey(request.getString("tid")).trim());
        requestData.put("Package_Name", "com.epaisapos");

        MRLWrapper.reverseTransaction(context, requestData);
        if (MRLWrapper.getResponseMap().get("Response_Code").equals("000") ||
                MRLWrapper.getResponseMap().get("Response_Code").equals("323")) {
            return "000";

        } else {
            return MRLWrapper.getResponseMap().get("Response_Code");
        }

    }

    private void reverseTheTransaction(final Context context, final ICardPaymentCallback cardPaymentCallback) {
        subscription = Observable.just(true).map(new Func1<Boolean, Integer>() {
            @Override
            public Integer call(Boolean aBoolean) {
                HashMap<String, String> requestData = new HashMap(MRLWrapper.source);

                requestData.put("User_Name", CardReaderEncryption.decryptKey(MRLHelper.this.request.getString("userName")).trim());
                requestData.put("TID", CardReaderEncryption.decryptKey(MRLHelper.this.request.getString("tid")).trim());
                requestData.put("Package_Name", "com.epaisapos");

                return MRLWrapper.reverseTransaction(context, requestData);
            }
        }).subscribeOn(Schedulers.io()).observeOn(AndroidSchedulers.mainThread()).subscribe(new Observer<Integer>() {
            @Override
            public void onCompleted() {

            }

            @Override
            public void onError(Throwable e) {
                e.printStackTrace();
            }

            @Override
            public void onNext(Integer integer) {
                Log.v("TAG", "MRL LOGIN RESPONSE" + MRLWrapper.getResponseMap().get("Response_Code"));

                if (!MRLWrapper.getResponseMap().get("Response_Code").equals("000") ||
                        !MRLWrapper.getResponseMap().get("Response_Code").equals("323")) {
                    handleTransactionError(context, cardPaymentCallback);
                } else {
                    cardPaymentCallback.OnSuccess();
                }
                onCompleted();
                if (!subscription.isUnsubscribed())
                    subscription.unsubscribe();
            }
        });

    }


    private void handleTransactionError(Context context, ICardPaymentCallback cardPaymentCallback) {

        String responseCode = MRLWrapper.getResponseMap().get("Response_Code");
        if (responseCode == null)
            responseCode = "";
        if (responseCode.contains(":"))
            responseCode = responseCode.substring(0, responseCode.lastIndexOf(":")).trim();

        if (responseCode.equals("103") || responseCode.equals("301") || responseCode.equals("306") || responseCode.equals("1006") || responseCode.equals("308") || responseCode.equals("311")
                || responseCode.equals("501") || responseCode.equals("5001") || responseCode.equals("5004") || responseCode.equals("5031") || responseCode.equals("5035") || responseCode.equals("5015") || responseCode.equals("5018") || responseCode.equals("5019") || responseCode.equals("5022") || responseCode.equals("5021") || responseCode.equals("5006") || responseCode.equals("5005")
                || responseCode.equals("303") || responseCode.equals("207_01") || responseCode.equals("207_02") || responseCode.equals("207_03") || responseCode.equals("207_04")
                || responseCode.equals("207_05") || responseCode.equals("207_06") || responseCode.equals("5027_01") || responseCode.equals("5027_02") || responseCode.equals("5027_03") || responseCode.equals("5027_04")
                || responseCode.equals("5027_05") || responseCode.equals("5027_06") || responseCode.equals("5027_07")
                || responseCode.equals("5027_08") || responseCode.equals("5027_09") || responseCode.equals("5027_10") || responseCode.equals("5027_11")
                || responseCode.equals("5027_12") || responseCode.equals("5027_13") || responseCode.equals("5027_14")
                || responseCode.equals("5027_15") || responseCode.equals("5027_16") || responseCode.equals("5027_17") || responseCode.equals("5027_18")
                || responseCode.equals("5027_19") || responseCode.equals("8888") || responseCode.equals("5027_20") || responseCode.equals("5027_21") || responseCode.equals("310")) {
            cardPaymentCallback.OnError(responseCode);
        } else if (isCallReversal(responseCode)) {
            reverseTheTransaction(context, cardPaymentCallback);
        } else {
            cardPaymentCallback.OnError(responseCode);
        }

    }

    private boolean isCallReversal(String responsecode) {

        return responsecode != null && (responsecode.equals("310") || responsecode.equals("001") || responsecode.equals("324")
                || responsecode.equals("313") || responsecode.equals("321") || responsecode.equals("322") || responsecode.equals("5037"));

    }

    public interface ICardPaymentCallback {
        void OnSuccess();

        void OnError(String errorCode);

        void processing(CardTransactionState state);

        void selectAccount();
    }


}

