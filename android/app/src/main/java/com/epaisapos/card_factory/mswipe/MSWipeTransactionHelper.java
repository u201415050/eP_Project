package com.epaisapos.card_factory.mswipe;

import android.app.Dialog;
import android.bluetooth.BluetoothDevice;
import android.content.ComponentName;
import android.content.Context;
import android.content.Intent;
import android.content.ServiceConnection;
import android.content.SharedPreferences;
import android.os.Handler;
import android.os.IBinder;
import android.util.Log;
import android.view.View;
import android.widget.Button;
import android.widget.ImageButton;
import android.widget.ImageView;
import android.widget.Toast;

import com.epaisapos.R;
import com.epaisapos.util.CardTransactionState;
import com.facebook.react.bridge.ReadableMap;
import com.mswipetech.sdk.network.MSGatewayConnectionListener;
import com.mswipetech.wisepad.sdk.MSWisepadController;
import com.mswipetech.wisepad.sdk.data.CardData;
import com.mswipetech.wisepad.sdk.data.CardSaleResponseData;
import com.mswipetech.wisepad.sdk.data.MSDataStore;
import com.mswipetech.wisepad.sdk.device.MSWisepadDeviceController;
import com.mswipetech.wisepad.sdk.device.MSWisepadDeviceControllerResponseListener;
import com.mswipetech.wisepad.sdk.device.WisePadConnection;
import com.mswipetech.wisepad.sdk.device.WisePadTransactionState;
import com.mswipetech.wisepad.sdk.listeners.MSWisepadControllerResponseListener;
import com.socsi.smartposapi.emv2.EmvL2;

import java.util.ArrayList;
import java.util.Hashtable;


public class MSWipeTransactionHelper {
    private IPaymentListener paymentListener;
    private Context context;
    private String TAG = "MSWipeTransactionHelper";
    private MSGatewayConncetionObserver mMSGatewayConncetionObserver;
    private ReadableMap request;
    private String mAmexSecurityCode = "";
    private boolean isPinBypassed;
    private int pinCount;
    private boolean failAlreadyCalled;
    private ImageView[] pinIndication = new ImageView[4];

    private String mStrKeyCode = "";
    private Dialog dialog;


    /**
     * the instance to communicate with the device service, this get initializes when the service successfully binds to
     * the activity.
     */

    public MSWisepadDeviceController mMSWisepadDeviceController = null;

    /*the callback listener with observes all the communications from the wise pad controller*/

    public MSWisepadDeviceObserver mMSWisepadDeviceObserver = null;
    public boolean mIsMSWisepasConnectionServiceBound;


    /**
     * the details of the card used for the transaction returned my the mswipe wisepad device controller
     * through the listener object
     */

    public CardData mCardData = new CardData();

    /**
     * progress for all the transaction which involve chip card, since for the EMV card's the wise pad need to
     * communicate back the information from the user to the card, this will display the progress for this activities.
     */


    /**
     * The amex card security code located at the back for the card has to be punched in when the mswipe wisepad
     * detects the card been used is Amex card through the callback function onReturnWisePadOfflineCardTransactionResultsCARDSCHEMERRESULTS.MCR_AMEXCARD
     */

    public String mCardSaleDlgTitle = "";


    public boolean mCallCheckCardAfterConnection = true;

    /*this will initialize the firm ware upate sdk*/
    public boolean mAllowFirmwareUpdatge = false;
    /*using this will be able to know whether  merchant is pressed amount next button for swipe or not
     based on this we are setting the amount*/
    protected boolean isConnetCalled = false;

    /*storing the laste topbar_img_host_active wisepad id so that for next time it will connect automatically to this devise*/
    protected String mBlueToothMcId = "";

    /* when the flag from the login response for pin bypass is set to true then the trx should
     * be allowed to online if not then a bypassed should be displayed to the user
     * this should be re-initialzed in insert or checkcard or start emv since for the chcekc crad and
     * mag card straint online mag card would be called and not delegate to set this back wouldn't
     * be called
     *  */
    public boolean mIsPinBypassed = false;
    private CardSaleResponseData mCardSaleResponseData;


    public MSWipeTransactionHelper(Context context, ReadableMap request) {
        this.context = context;
        mMSGatewayConncetionObserver = new MSGatewayConncetionObserver();
        this.request = request;


    }


    public void makePayment(IPaymentListener listener) {
        failAlreadyCalled = false;
        this.paymentListener = listener;

        if (!isMerchantAuthenticated())
            loginIntoMSwipe();
        else {
            startMswipeService();
        }
    }

    private void loginIntoMSwipe() {
        LoginHelper loginHelper = new LoginHelper(context, request, new LoginHelper.ILoginListener() {
            @Override
            public void onError(String errCode, String errorMessage) {
                paymentListener.onError(errCode, errorMessage);
            }

            @Override
            public void onSuccess() {
                startMswipeService();
            }
        });
        loginHelper.loginIntoMSwipe();
    }


    public boolean isMerchantAuthenticated() {
        SharedPreferences pref = context.getSharedPreferences("regenKey", Context.MODE_PRIVATE);
        if (pref.getString("referenceid", "").length() != 0) {
            if (pref.getString("deviceSerialNumber", "").equalsIgnoreCase(request.getString("serialNumber")))
                return true;
        }
        return false;

    }

    private void startService() {
        Handler handler = new Handler();
        handler.postDelayed(new Runnable() {
            @Override
            public void run() {

                /**
                 * binding the service will start the service, and notifies back to the bound objects and this will
                 * unable the interactions with the service
                 *
                 */

                try {
                    doBindMswipeWisepadDeviceService();
                } catch (Exception ex) {
                    ex.printStackTrace();
                    paymentListener.onError("Error", ex.getMessage());
                }

            }
        }, 1000);

    }

    /**
     * @description Initiates the wisepad device service which run in the back ground and controls the connections
     * and disconnection and the application interactions independently of the application.
     */

    void doBindMswipeWisepadDeviceService() {
        Log.e(TAG, "doBindMswipeWisepadDeviceService");
        context.bindService(new Intent(context, MSWisepadDeviceController.class), mMSWisepadDeviceControllerService, Context.BIND_AUTO_CREATE);
    }

    /**
     * @description The wisepad service callback listener, when the service is stopped or started
     * the service connection object will be notified
     */

    private ServiceConnection mMSWisepadDeviceControllerService = new ServiceConnection() {
        public void onServiceConnected(ComponentName className, IBinder service) {
            try {
                Log.e(TAG, "onServiceConnected");
                MSWisepadDeviceController.LocalBinder localBinder = (MSWisepadDeviceController.LocalBinder) service;
                mMSWisepadDeviceController = localBinder.getService();
                mIsMSWisepasConnectionServiceBound = true;

                /**
                 * start the connection to the wise pad asynchronously, and call backs the listeners object
                 * with the status of the connection
                 */

                /**
                 * if any delay while initializing the service and user already requested for connect for wisepad,
                 * we are enabling the auto connect while initilizing the mswipe device controller.
                 */
               /* if(isConnetCalled)
                {
                    mAutoConnect = getIntent().getBooleanExtra("autoconnect", true);
                    mCallCheckCardAfterConnection = getIntent().getBooleanExtra("checkcardAfterConnection", true);
                }*/


                if (mMSWisepadDeviceController != null) {
                    mMSWisepadDeviceController.initMswipeWisepadDeviceController(mMSWisepadDeviceObserver,
                            true, false, mCallCheckCardAfterConnection,
                            mAllowFirmwareUpdatge, MSWisepadDeviceController.WisepadCheckCardMode.SWIPE_OR_INSERT);
                }
            } catch (Exception e) {
                e.printStackTrace();
                paymentListener.onError("Error", e.getMessage());
//                if (ApplicationData.IS_DEBUGGING_ON)
//                    Logs.v(ApplicationData.packName, "exception." + e.toString(), true, true);
            }
        }

        public void onServiceDisconnected(ComponentName className) {
//            if (ApplicationData.IS_DEBUGGING_ON)
//                Logs.v(ApplicationData.packName, "Wisepad servcie un-binded and wisepad is disconnected...", true, true);
            /**
             * This is called when the connection with the service has been
             * unexpectedly disconnected - process crashed.
             *
             */
            Log.e(TAG, "onServiceDisconnected");
            mIsMSWisepasConnectionServiceBound = false;
            mMSWisepadDeviceController = null;

        }
    };


    private void startMswipeService() {
        Log.e(TAG, "startMswipeService");
        mMSWisepadDeviceObserver = new MSWisepadDeviceObserver();
        startService();
    }


    class MSGatewayConncetionObserver implements MSGatewayConnectionListener {

        @Override
        public void Connected(String msg) {

            Log.e(TAG, "Connected");
        }

        @Override
        public void Connecting(String msg) {


            Log.e(TAG, "msg");
        }

        @Override
        public void disConnect(String msg) {


            Log.e(TAG, "disConnect");
        }
    }

    public void state(String message) {
        Log.v("TAG", "Helper state: " + message);
        if (getWisePadTranscationState() == WisePadTransactionState.WisePadTransactionState_WaitingForCard) {
            isPinBypassed = false;
//            mBtnSwipe.setEnabled(false);
//            mBtnSwipe.setBackgroundResource(R.drawable.button_next_inactive);

        } else if (getWisePadTranscationState() == WisePadTransactionState.WisePadTransactionState_Pin_Entry_Request) {
            isPinBypassed = false;
            {
                paymentListener.state(CardTransactionState.ENTER_PIN);
                requestPinPad();
            }

        } else if (getWisePadTranscationState() == WisePadTransactionState.WisePadTransactionState_Pin_Entry_Results) {

            isPinBypassed = false;
            pinCount = 0;

        } else if (getWisePadTranscationState() == WisePadTransactionState.WisePadTransactionState_ICC_SetAmount) {


        } else if (getWisePadTranscationState() == WisePadTransactionState.WisePadTransactionState_CheckCard) {

            isPinBypassed = false;


        } else if (getWisePadTranscationState() == WisePadTransactionState.WisePadTransactionState_Pin_Entry_Asterisk) {

            int astricIndex = 0;
            try {
                astricIndex = Integer.parseInt(message);
            } catch (Exception e) {

            }

            if (astricIndex == 0) {

                pinCount = 0;
            } else {

                pinCount = pinCount + 1;
            }

            if (pinCount == 0) {
                paymentListener.state(CardTransactionState.ENTER_PIN);
            }
        }
    }

    public void requestPinPad() {

        if (mMSWisepadDeviceController != null) {

            mMSWisepadDeviceController.showPinPad();
        }
    }


    private void callPaymentFailed(String errorCode, String message) {
        pinCount = 0;
//        mBtnSwipe.setEnabled(true);
//        mBtnSwipe.setBackgroundResource(R.drawable.button_next_active);

        if (getWisePadTranscationState() == WisePadTransactionState.WisePadTransactionState_Pin_Entry_Results) {
            //todo dkb error or state
            isPinBypassed = false;
        } else if (getWisePadTranscationState() == WisePadTransactionState.WisePadTransactionState_Ready) {
//            //  //todo dkb error or state
//            Log.e("setWisePadStateErrorInfo","inside WisePadTransactionState_Ready"+" mess " + message);
//            if (message.equalsIgnoreCase(context.getString(R.string.device_busy))) {
//                //todo dkb error or state
//                paymentListener.onError("device_busy", context.getString(R.string.creditsaleswiperfragment_status) + ": " + message);
//            } else
//                setWisepadStatusMsg(message);
        } else {
//            Log.e("setWisePadStateErrorInfo", "outside" + " mess " + message);
//            paymentListener.onError(errorCode, message);

        }
        if (!failAlreadyCalled) {
            failAlreadyCalled = true;
            try {
                doUnbindMswipeWisepadDeviceService();
            } catch (Exception ex) {
                ex.printStackTrace();
            }
            paymentListener.onError(errorCode, message);
        }
    }

    /**
     * @description Stops the wisepad service this need to be called when the wisepad is no more required, and
     * this function should be called in onStop, this instance will be called when the app moves to
     * back ground
     */

    public void doUnbindMswipeWisepadDeviceService() {
        if (mIsMSWisepasConnectionServiceBound) {
            context.unbindService(mMSWisepadDeviceControllerService);
            mIsMSWisepasConnectionServiceBound = false;
        }
    }

    /**
     * MSWisepadDeviceObserver
     * The mswipe device controller class  observer which listens to the responses of the wisepad delegated function
     * based on the device notification, appropriate steps  need to be considered or request should be sent back to the
     * wisepad this will ensure a smooth communications back and forth between the wisepad device and the application
     */

    class MSWisepadDeviceObserver implements MSWisepadDeviceControllerResponseListener {
        /*the bluetooth connection channel states callback function between the device and application,
         */
        public void onReturnWisepadConnection(WisePadConnection wisePadConntection, BluetoothDevice bluetoothDevice) {
            Log.e("check", "onReturnWisepadConnection" + wisePadConntection);
            if (wisePadConntection == WisePadConnection.WisePadConnection_CONNECTED) {
                setAmount();
                paymentListener.state(CardTransactionState.PROCESSING);
//                mBtnSwipe.setEnabled(false);
//                mBtnSwipe.setBackgroundResource(R.drawable.button_next_inactive);
            } else if (wisePadConntection == WisePadConnection.WisePadConnection_CONNECTING) {
                paymentListener.state(CardTransactionState.PROCESSING);

            } else if (wisePadConntection == WisePadConnection.WisePadConnection_DEVICE_DETECTED) {
                paymentListener.state(CardTransactionState.PROCESSING);
            } else if (wisePadConntection == WisePadConnection.WisePadConnection_DEVICE_NOTFOUND) {
                callPaymentFailed("Bluetooth : DEVICE_NOTFOUND", "No Device Found.");
            } else if (wisePadConntection == WisePadConnection.WisePadConnection_NOT_CONNECTED) {
//                mBtnSwipe.setEnabled(false);
//                mBtnSwipe.setBackgroundResource(R.drawable.button_next_inactive);
                callPaymentFailed("Bluetooth : NOT_CONNECTED", "Device not connected.");

            } else if (wisePadConntection == WisePadConnection.WisePadConnection_DIS_CONNECTED) {
                callPaymentFailed("Bluetooth Error :DIS_CONNECTED", "device disconnected.");

            } else if (wisePadConntection == WisePadConnection.WisePadConnection_FAIL_TO_START_BT) {
                callPaymentFailed("Bluetooth Error : FAIL_TO_START_BT", "Failed to connect to the WisePad, please make sure the WisePad is switched on");
            } else if (wisePadConntection == WisePadConnection.WisePadConnection_BLUETOOTH_DISABLED) {
                callPaymentFailed("Bluetooth Error : BLUETOOTH_DISABLED", "Check device bluetooth status");
            } else if (wisePadConntection == WisePadConnection.WisePadConnection_BLUETOOTH_SWITCHEDOFF) {
                callPaymentFailed("Bluetooth error : BLUETOOTH_SWITCHEDOFF ", "Check device bluetooth status");
            } else if (wisePadConntection == WisePadConnection.WisePadConnection_MULTIPLE_PAIRED_DEVCIES_FOUND) {
                // TODO DKB state or error
//                TaskShowMultiplePairedDevices pairedtask = new TaskShowMultiplePairedDevices();
//                pairedtask.execute();
            } else if (wisePadConntection == WisePadConnection.WisePadConnection_NO_PAIRED_DEVICES_FOUND) {
                callPaymentFailed("Bluetooth Error :NO_PAIRED_DEVICES_FOUND", "Check device bluetooth status");

            }
        }

        /*
        when the a request is sent to the the wise pad to check for the card used and hence when it detects the card, the device,
        callback with the information related to the card used or callbacks with information requesting information to be sent back to the wisepad,
        */
        @Override
        public void onRequestWisePadCheckCardProcess(CheckCardProcess checkCardProcess, ArrayList<String> dataList) {

           /* String msg = "";
            Log.e("check", "onRequestWisePadCheckCardProcess" + checkCardProcess);
            if (checkCardProcess == CheckCardProcess.CheckCardProcess_WAITING_FOR_CARD) {
                mIsPinBypassed = false;
                paymentListener.state(CardTransactionState.SWIPE_CARD);
                state("Please insert or swipe card now.");
            } else if (checkCardProcess == CheckCardProcess.CheckCardProcess_SET_AMOUNT) {
                setAmount();
                paymentListener.state(CardTransactionState.PROCESSING);
                state("Processing");
            } else if (checkCardProcess == CheckCardProcess.CheckCardProcess_PIN_ENTRY_MAG_CARD) {
                paymentListener.state(CardTransactionState.ENTER_PIN);
                state("please enter pin on wisepad or press enter (green key) to bypass pin");
            } else if (checkCardProcess == CheckCardProcess.CheckCardProcess_PIN_ENTRY_ICC_CARD) {
                paymentListener.state(CardTransactionState.ENTER_PIN);
                state("please_enter_pin_on_wisepad_or_press_enter_green_key_to_bypass_pin");

            } else if (checkCardProcess == CheckCardProcess.CheckCardProcess_SELECT_APPLICATION) {

            }*/

        }

        /*@Override
        public void onRequestWisePadCheckCardProcess(CheckCardProcess checkCardProcess, ArrayList<String> arrayList, EmvL2.AidSelectHandler aidSelectHandler) {

        }*/

        /*once the card is detected and then when the proper request had been collected from the user the devcie
        callback the details of the card, and this off-line data can be used to post to the gateway for further validation
        */
        @Override
        public void onReturnWisePadOfflineCardTransactionResults(CheckCardProcessResults checkCardResults,
                                                                 Hashtable<String, Object> paramHashtable) {
            Log.e("check", "onReturnWisePadOfflineCardTransactionResults" + checkCardResults);
            if (checkCardResults == CheckCardProcessResults.ON_REQUEST_ONLINEPROCESS) {
                mCardData = (CardData) paramHashtable.get("cardData");
                if (mCardData.getCardSchemeResults() == CARDSCHEMERRESULTS.ICC_CARD) {
//                    showAmexPinEntry();
                    if (mIsPinBypassed) {
                        SharedPreferences pref = context.getSharedPreferences("regenKey", Context.MODE_PRIVATE);
                        if (pref.getBoolean("pinbypass", false)) {
                            showCardDetails();
                        } else {
                            if (mMSWisepadDeviceController != null) {
                                mMSWisepadDeviceController.sendOnlineProcessResult(null);

                            }
                        }
                    } else {
                        showCardDetails();
                    }

                } else if (mCardData.getCardSchemeResults() == CARDSCHEMERRESULTS.MAG_CARD) {
                    if (mIsPinBypassed) {
                        SharedPreferences pref = context.getSharedPreferences("regenKey", Context.MODE_PRIVATE);
                        if (pref.getBoolean("pinbypass", false)) {
                            showCardDetails();
                        } else {
                            callPaymentFailed("pinbypass false", "Pin bypass disabled");
                        }
                    } else {
                        showCardDetails();
                    }

                } else if (mCardData.getCardSchemeResults() == CARDSCHEMERRESULTS.MAG_AMEXCARD) {

                    if (mIsPinBypassed) {
                        SharedPreferences pref = context.getSharedPreferences("regenKey", Context.MODE_PRIVATE);
                        if (pref.getBoolean("pinbypass", false)) {
                            showAmexPinEntry();
                        }
                    } else {
                        showAmexPinEntry();
                    }


                }


            } else if (checkCardResults == CheckCardProcessResults.NO_CARD) {
                callPaymentFailed("NO_CARD", "No card detected. Please insert or swipe card again and press check card.");
//                paymentListener.onError("NO_CARD", "No card detected. Please insert or swipe card again and press check card.");
            } else if (checkCardResults == CheckCardProcessResults.NOT_ICC) {
                callPaymentFailed("NOT_ICC", "Please use mag card");
            } else if (checkCardResults == CheckCardProcessResults.BAD_SWIPE) {
                callPaymentFailed("BAD_SWIPE", "Swipe Error. Please Swipe Again");
            } else if (checkCardResults == CheckCardProcessResults.MAG_HEAD_FAIL) {
                callPaymentFailed("MAG_HEAD_FAIL", "Magnetic head fail");
            } else if (checkCardResults == CheckCardProcessResults.USE_ICC_CARD) {
                callPaymentFailed("USE_ICC_CARD", "Please use chip card");
            } else if (checkCardResults == CheckCardProcessResults.PIN_ENTERED) {
                paymentListener.state(CardTransactionState.PROCESSING);
                state("PIN entered");
            } else if (checkCardResults == CheckCardProcessResults.PIN_BYPASS) {
                //todo dkb
                mIsPinBypassed = true;
                state("PIN bypassed");
            } else if (checkCardResults == CheckCardProcessResults.PIN_CANCEL) {
                callPaymentFailed("PIN_CANCEL", "PIN canceled");

            } else if (checkCardResults == CheckCardProcessResults.PIN_TIMEOUT) {
                callPaymentFailed("PIN_TIMEOUT", "PIN timeout");
            } else if (checkCardResults == CheckCardProcessResults.PIN_UNKNOWN_ERROR) {
                callPaymentFailed("PIN_UNKNOWN_ERROR", "Key error");
            } else if (checkCardResults == CheckCardProcessResults.PIN_Asterisk) {
                String astreik = (String) paramHashtable.get("key");
                state(astreik);
            } else if (checkCardResults == CheckCardProcessResults.PIN_WRONG_PIN_LENGTH) {
                callPaymentFailed("PIN_WRONG_PIN_LENGTH", context.getString(R.string.pin_wrong_pin_length));
            } else if (checkCardResults == CheckCardProcessResults.PIN_INCORRECT_PIN) {
                callPaymentFailed("PIN_INCORRECT_PIN", context.getString(R.string.no_pin));
            } else if (checkCardResults == CheckCardProcessResults.TRANSACTION_TERMINATED) {
                callPaymentFailed("TRANSACTION_TERMINATED", context.getString(R.string.transaction_terminated));
            } else if (checkCardResults == CheckCardProcessResults.TRANSACTION_DECLINED) {
                callPaymentFailed("TRANSACTION_DECLINED", context.getString(R.string.transaction_declined));
            } else if (checkCardResults == CheckCardProcessResults.TRANSACTION_CANCELED_OR_TIMEOUT) {
                callPaymentFailed("TRANSACTION_CANCELED_OR_TIMEOUT", context.getString(R.string.transaction_cancel));
            } else if (checkCardResults == CheckCardProcessResults.TRANSACTION_CAPK_FAIL) {
                //todo dkb
                callPaymentFailed("TRANSACTION_CAPK_FAIL", context.getString(R.string.transaction_capk_fail));
            } else if (checkCardResults == CheckCardProcessResults.TRANSACTION_NOT_ICC) {
                callPaymentFailed("TRANSACTION_NOT_ICC", context.getString(R.string.transaction_not_icc));
            } else if (checkCardResults == CheckCardProcessResults.TRANSACTION_SELECT_APP_FAIL) {
                callPaymentFailed("TRANSACTION_SELECT_APP_FAIL", context.getString(R.string.transaction_app_fail));
            } else if (checkCardResults == CheckCardProcessResults.TRANSACTION_DEVICE_ERROR) {
                callPaymentFailed("TRANSACTION_DEVICE_ERROR", context.getString(R.string.transaction_device_error));
            } else if (checkCardResults == CheckCardProcessResults.TRANSACTION_APPLICATION_BLOCKED) {
                callPaymentFailed("TRANSACTION_APPLICATION_BLOCKED", context.getString(R.string.transaction_application_blocked));
            } else if (checkCardResults == CheckCardProcessResults.TRANSACTION_ICC_CARD_REMOVED) {
                callPaymentFailed("TRANSACTION_ICC_CARD_REMOVED", context.getString(R.string.transaction_icc_card_removed));
            } else if (checkCardResults == CheckCardProcessResults.TRANSACTION_CARD_BLOCKED) {
                callPaymentFailed("TRANSACTION_CARD_BLOCKED", context.getString(R.string.transaction_card_blocked));
            } else if (checkCardResults == CheckCardProcessResults.TRANSACTION_CARD_NOT_SUPPORTED) {
                callPaymentFailed("TRANSACTION_CARD_NOT_SUPPORTED", context.getString(R.string.transaction_card_not_supported));
            } else if (checkCardResults == CheckCardProcessResults.TRANSACTION_CONDITION_NOT_SATISFIED) {
                callPaymentFailed("TRANSACTION_CONDITION_NOT_SATISFIED", context.getString(R.string.transaction_condition_not_satisfied));
            } else if (checkCardResults == CheckCardProcessResults.TRANSACTION_INVALID_ICC_DATA) {
                callPaymentFailed("TRANSACTION_CONDITION_NOT_SATISFIED", context.getString(R.string.transaction_invalid_icc_data));
            } else if (checkCardResults == CheckCardProcessResults.TRANSACTION_MISSING_MANDATORY_DATA) {
                callPaymentFailed("TRANSACTION_MISSING_MANDATORY_DATA", context.getString(R.string.transaction_missing_mandatory_data));
            } else if (checkCardResults == CheckCardProcessResults.TRANSACTION_NO_EMV_APPS) {
                callPaymentFailed("TRANSACTION_NO_EMV_APPS", context.getString(R.string.transaction_no_emv_apps));
            } else if (checkCardResults == CheckCardProcessResults.CANCEL_CHECK_CARD) {
                callPaymentFailed("CANCEL_CHECK_CARD", context.getString(R.string.canceled_please_try_again));
            } else {
                callPaymentFailed("Unknown error", context.getString(R.string.unknown_error));
            }
        }

        /*during the process of detecting the card and collecting the data from the user when the device encounters any issues it callback
        through this delegate to notify the application with the specifics of the error.
        */
        @Override
        public void onError(Error errorState, String errorMsg) {

            //TODO dkb
            String msg = "";

            if (errorState == Error.UNKNOWN) {
                msg = (context.getString(R.string.unknown_error));
            } else if (errorState == Error.CMD_NOT_AVAILABLE) {
                msg = (context.getString(R.string.command_not_available));
            } else if (errorState == Error.TIMEOUT) {
                msg = (context.getString(R.string.device_no_response));
            } else if (errorState == Error.DEVICE_BUSY) {
                msg = (context.getString(R.string.device_busy));
            } else if (errorState == Error.INPUT_OUT_OF_RANGE) {
                msg = (context.getString(R.string.out_of_range));
            } else if (errorState == Error.INPUT_INVALID_FORMAT) {
                msg = (context.getString(R.string.invalid_format));
            } else if (errorState == Error.INPUT_INVALID) {
                msg = (context.getString(R.string.input_invalid));
            } else if (errorState == Error.CASHBACK_NOT_SUPPORTED) {
                msg = (context.getString(R.string.cashback_not_supported));
            } else if (errorState == Error.CRC_ERROR) {
                msg = (context.getString(R.string.crc_error));
            } else if (errorState == Error.COMM_ERROR) {
                msg = (context.getString(R.string.comm_error));
            } else if (errorState == Error.FAIL_TO_START_BT) {
                msg = (context.getString(R.string.fail_to_start_bluetooth_v2));
            } else if (errorState == Error.FAIL_TO_START_AUDIO) {
                msg = (context.getString(R.string.fail_to_start_audio));
            } else if (errorState == Error.COMM_LINK_UNINITIALIZED) {
                msg = (context.getString(R.string.comm_link_uninitialized));
            } else if (errorState == Error.INVALID_FUNCTION_IN_CURRENT_CONNECTION_MODE) {
                msg = (context.getString(R.string.invalid_function));
            } else if (errorState == Error.BTV4_NOT_SUPPORTED) {
                msg = (context.getString(R.string.bluetooth_4_not_supported));
            } else if (errorState == Error.FAIL_TO_START_SERIAL) {
                msg = ("Fail to start serial");
            } else if (errorState == Error.USB_DEVICE_NOT_FOUND) {
                msg = ("Usb device not found");
            } else if (errorState == Error.USB_DEVICE_PERMISSION_DENIED) {
                msg = ("Usb device permission denied");
            } else if (errorState == Error.USB_NOT_SUPPORTED) {
                msg = ("Usb device not supported");
            } else if (errorState == Error.CHANNEL_BUFFER_FULL) {
                msg = (context.getString(R.string.channel_buffer_full));
            } else if (errorState == Error.BLUETOOTH_PERMISSION_DENIED) {
                msg = (context.getString(R.string.bluetooth_permission_denied));
            } else if (errorState == Error.HARDWARE_NOT_SUPPORTED) {
                msg = ("Harware not supported");
            } else if (errorState == Error.TAMPER) {
                msg = ("Device tampered");
            } else if (errorState == Error.PCI_ERROR) {
                msg = ("Pci error");
            } else {
                msg = (context.getString(R.string.unknown_error));
            }

            callPaymentFailed(msg, msg);


        }

        /*during the process of detecting the card and collecting the data from the user the device callback's
         *through this delegate to notify the application about the information about the wise pad current processing state, this
         *information can be displayed back to the user and this information presented is just a text and the
         * wise pad does not expect any action further actions from the user, this as to be used only for presenting the state of the wisepad to the user.
         */
        @Override
        public void onRequestDisplayWispadStatusInfo(DisplayText displayText) {

            //TODO dkb
            if (displayText == DisplayText.NOT_ICC_CARD) {
//                paymentListener.onError("NOT_ICC_CARD", "Please use mag card");
                callPaymentFailed("NOT_ICC_CARD", context.getString(R.string.card_inserted));
            } else if (displayText == DisplayText.NO_EMV_APPS) {
                callPaymentFailed("NO_EMV_APPS", context.getString(R.string.card_inserted));
            } else if (displayText == DisplayText.APPROVED) {
                state(context.getString(R.string.approved));
            } else if (displayText == DisplayText.CALL_YOUR_BANK) {
                callPaymentFailed("CALL_YOUR_BANK", context.getString(R.string.call_your_bank));
            } else if (displayText == DisplayText.DECLINED) {
                callPaymentFailed("DECLINED", context.getString(R.string.decline));
            } else if (displayText == DisplayText.ENTER_PIN_BYPASS) {
                //todo dkb state or error
                state(context.getString(R.string.please_enter_pin_on_wisepad_or_press_enter_green_key_to_bypass_pin));
            } else if (displayText == DisplayText.ENTER_PIN) {
                state(context.getString(R.string.enter_pin));
            } else if (displayText == DisplayText.INCORRECT_PIN) {
                callPaymentFailed("INCORRECT_PIN", context.getString(R.string.incorrect_pin));
            } else if (displayText == DisplayText.INSERT_CARD) {
                //TODO dkb inserterror or state
//                setWisePadStateErrorInfo(context.getString(R.string.insert_card));
                paymentListener.state(CardTransactionState.SWIPE_CARD);
            } else if (displayText == DisplayText.NOT_ACCEPTED) {
                callPaymentFailed("NOT_ACCEPTED", context.getString(R.string.not_accepted));
            } else if (displayText == DisplayText.PIN_OK) {
                paymentListener.state(CardTransactionState.PROCESSING);
                state(context.getString(R.string.pin_ok));
//                state(context.getString(R.string.pin_ok));
            } else if (displayText == DisplayText.PLEASE_WAIT) {

				/*
				As the state is pin result no need show other messages
				as we are waiting for the online process, so we are skipping this message
				for old firmware after pinentry result we are getting this extra message.
				 */

                if (getWisePadTranscationState() != WisePadTransactionState.WisePadTransactionState_Pin_Entry_Results)
                    state(context.getString(R.string.wait));

            } else if (displayText == DisplayText.REMOVE_CARD) {
                state(context.getString(R.string.remove_card));
            } else if (displayText == DisplayText.USE_MAG_STRIPE) {
                callPaymentFailed("USE_MAG_STRIPE", context.getString(R.string.use_mag_stripe));
            } else if (displayText == DisplayText.TRY_AGAIN) {
                callPaymentFailed("TRY_AGAIN", context.getString(R.string.try_again));
            } else if (displayText == DisplayText.REFER_TO_YOUR_PAYMENT_DEVICE) {
                //todo dkb check error or msg
//                setWisePadStateErrorInfo(context.getString(R.string.refer_payment_device));
                state(context.getString(R.string.refer_payment_device));
//                paymentListener.state("Please refer to your payment device");
            } else if (displayText == DisplayText.TRANSACTION_TERMINATED) {
                callPaymentFailed("TRANSACTION_TERMINATED", context.getString(R.string.transaction_terminated));
//                paymentListener.onError("TRANSACTION_TERMINATED", "Terminated");
//                setWisePadStateErrorInfo(context.getString(R.string.transaction_terminated));
            } else if (displayText == DisplayText.PROCESSING) {
                paymentListener.state(CardTransactionState.PROCESSING);
                state(context.getString(R.string.processing));
//                state(context.getString(R.string.processing));
            } else if (displayText == DisplayText.LAST_PIN_TRY) {
                //todo dkb error or state
//                paymentListener.onError("LAST_PIN_TRY", "Last PIN try");
                callPaymentFailed("LAST_PIN_TRY", context.getString(R.string.last_pin_try));
//                setWisePadStateErrorInfo(context.getString(R.string.last_pin_try));
            } else if (displayText == DisplayText.SELECT_ACCOUNT) {
                //todo dkb
//                paymentListener.onError("SELECT_ACCOUNT", "select account");
                state(context.getString(R.string.select_account));
//                state(context.getString(R.string.select_account));
            } else if (displayText == DisplayText.LOW) {
                state(context.getString(R.string.battery_low));
            } else if (displayText == DisplayText.CRITICALLY_LOW) {
                state(context.getString(R.string.battery_critically_low));
//                paymentListener.state("Device battery critically low and powered off");
//                setWisePadStateErrorInfo(context.getString(R.string.battery_critically_low));
            }
        }

        /*
         * Returns the information about the device, though this callback function initiated through getDeviceInfo
         * */
        @Override
        public void onReturnDeviceInfo(Hashtable<String, String> paramHashtable) {
//            setWisepadDeviceInfo(paramHashtable);
        }

        @Override
        public void onReturnWispadNetwrokSettingInfo(WispadNetwrokSetting wispadNetwrokSetting, boolean status, Hashtable<String, Object> netwrokSettingInfo) {

        }


        @Override
        public void onReturnNfcDataExchangeResult(boolean isSuccess, Hashtable<String, String> data) {

            if (isSuccess) {
				/*String text = "nfc_data_exchange_success ";
				text += "\n" + "ndef_record "  + data.get("ndefRecord");
				setNFCDeviceStatusInfo(text);*/

                String text = data.get("ndefRecord");
//                setNFCReadResult(text);

            } else {
                String text = "nfc_data_exchange_fail ";
                text += "\n" + "Error " + data.get("errorMessage");
//                setNFCDeviceStatusInfo(text);
            }
        }

        @Override
        public void onReturnNfcDetectCardResult(NfcDetectCardResult nfcDetectCardResult, Hashtable<String, Object> data) {

        }
    }


    private void showAmexPinEntry() {
        dialog = showDialogPin(context, mCardSaleDlgTitle, "Please enter security pin of your amex card.", "ok", "cancel", "");
        ImageView mpinEntryImageView1 = null;
        ImageView mpinEntryImageView2 = null;
        ImageView mpinEntryImageView3 = null;
        ImageView mpinEntryImageView4 = null;


        mpinEntryImageView1 = (ImageView) dialog.findViewById(R.id.creditsale_IMG_amex_pin1);
        mpinEntryImageView2 = (ImageView) dialog.findViewById(R.id.creditsale_IMG_amex_pin2);
        mpinEntryImageView3 = (ImageView) dialog.findViewById(R.id.creditsale_IMG_amex_pin3);
        mpinEntryImageView4 = (ImageView) dialog.findViewById(R.id.creditsale_IMG_amex_pin4);

        pinIndication[0] = mpinEntryImageView1;
        pinIndication[1] = mpinEntryImageView2;
        pinIndication[2] = mpinEntryImageView3;
        pinIndication[3] = mpinEntryImageView4;


        ((Button) dialog.findViewById(R.id.btn1)).setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                AmexPinEntered(v);
            }
        });
        ((Button) dialog.findViewById(R.id.btn2)).setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                AmexPinEntered(v);
            }
        });
        ((Button) dialog.findViewById(R.id.btn3)).setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                AmexPinEntered(v);
            }
        });
        ((Button) dialog.findViewById(R.id.btn4)).setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                AmexPinEntered(v);
            }
        });
        ((Button) dialog.findViewById(R.id.btn5)).setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                AmexPinEntered(v);
            }
        });
        ((Button) dialog.findViewById(R.id.btn6)).setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                AmexPinEntered(v);
            }
        });
        ((Button) dialog.findViewById(R.id.btn7)).setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                AmexPinEntered(v);
            }
        });
        ((Button) dialog.findViewById(R.id.btn8)).setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                AmexPinEntered(v);
            }
        });
        ((Button) dialog.findViewById(R.id.btn9)).setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                AmexPinEntered(v);
            }
        });
        ((Button) dialog.findViewById(R.id.key_BTN_0)).setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                AmexPinEntered(v);
            }
        });
        ((Button) dialog.findViewById(R.id.key_BTN_00)).setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                AmexPinEntered(v);
            }
        });
        ((ImageButton) dialog.findViewById(R.id.key_BTN_Del)).setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                AmexPinEntered(v);
            }
        });
        dialog.show();

    }


    public static Dialog showDialogPin(Context context, String title, String msg,
                                       String firstBtnText, String secondBtnText, String thirdText) {
        Dialog dialog = new Dialog(context, R.style.styleCustDlg);
        dialog.setContentView(R.layout.creditsale_amexcardpinentryview);
        dialog.setCancelable(false);
        dialog.setCanceledOnTouchOutside(false);
        ;

        return dialog;

    }

    public void AmexPinEntered(View v) {
        if (v.getId() == R.id.key_BTN_Del) {
            int strLength = mStrKeyCode.length();
            if (mStrKeyCode.length() > 0) {
                mStrKeyCode = mStrKeyCode.substring(0, strLength - 1);
                pinIndication[mStrKeyCode.length()].setImageResource(R.drawable.imagecircle_inactive);
            }

        } else {
            if (mStrKeyCode.length() < 4) {
                if (mStrKeyCode.length() == 3 && v.getId() == R.id.key_BTN_00) {
                    Toast.makeText(context, "Invalid pin input, should be 4 digits in length", Toast.LENGTH_SHORT);
                } else {
                    pinIndication[mStrKeyCode.length()].setImageResource(R.drawable.imagecircle_active);
                    mStrKeyCode = mStrKeyCode + v.getTag();
                }
            }
            if (mStrKeyCode.length() == 4) {
                if (dialog != null)
                    dialog.dismiss();
                mAmexSecurityCode = mStrKeyCode;
                showCardDetails();

            }
        }
    }

    private void setAmount() {
        if (mMSWisepadDeviceController != null)
            mMSWisepadDeviceController.setAmount(request.getString("amount"), MSWisepadDeviceControllerResponseListener.TransactionType.GOODS);
    }

    public WisePadTransactionState getWisePadTranscationState() {
        if (mMSWisepadDeviceController != null)
            return mMSWisepadDeviceController.getWisePadTransactionState();

        return WisePadTransactionState.WisePadTransactionState_Ready;
    }


    public void showCardDetails() {

        if (getWisePadTranscationState() == WisePadTransactionState.WisePadTransactionState_ICC_Online_Process
                || getWisePadTranscationState() == WisePadTransactionState.WisePadTransactionState_MAG_Online_Process) {
            processCardSaleOnline();

        }
    }

    /**
     * processCardSaleOnline
     * call up the API request which further processes the secured card data collected from the device by posting the data
     * to online network and the responses are handled through the call back functions and are appropriately presented to the user
     */

    public void processCardSaleOnline() {
        paymentListener.state(CardTransactionState.PROCESSING);
        SharedPreferences pref = context.getSharedPreferences("regenKey", Context.MODE_PRIVATE);
        String refCode = pref.getString("referenceid", "");
        String token = pref.getString("sessiontoken", "");
        {
            callCardTransaction(refCode, token);
        }
    }

    /* private void callCashAtPos(String refCode, String token) {
         MSWisepadController.getSharedMSWisepadController(context,
                 MSWisepadController.GATEWAY_ENVIRONMENT.LABS,
                 MSWisepadController.NETWORK_SOURCE.SIM,
                 mMSGatewayConncetionObserver).processSaleWithCashOnline(
                 refCode,
                 token,
                 paymentAmount,
                 "0.0",
                 "",
                 transactionId,
                 "",
                 "",
                 false,
                 false,
                 mAmexSecurityCode,
                 paymentAmount,
                 "",
                 "",
                 "",
                 "",
                 "",
                 "",
                 "",
                 "",
                 "",
                 "",
                 "",
                 new MSWisepadControllerResponseListenerObserver());

     }
 */
    private void callCardTransaction(String refCode, String token) {

        MSWisepadController.getSharedMSWisepadController(context,
                MSWisepadController.GATEWAY_ENVIRONMENT.LABS,
                MSWisepadController.NETWORK_SOURCE.SIM,
                mMSGatewayConncetionObserver).processCardSaleOnline(
                refCode,
                token,
                request.getString("amount"),
                "0.0",
                "",
                request.getString("transactionId"),//invoiceno  (If Single Invoice No. Is configured for the Merchant then this has to be unique for every transaction. )
                "",
                "",
                false,
                false,
                mAmexSecurityCode,
                0,
                0,
                "",//ClientId of the purchaser, need to send if required otherwise can send empty string for this.
                "",
                "",
                "",
                "",
                "",
                "",
                "",
                "",
                "",
                "",
                new MSWisepadControllerResponseListenerObserver());
    }

    class MSWisepadControllerResponseListenerObserver implements MSWisepadControllerResponseListener {

        public void onReponseData(MSDataStore aMSDataStore) {


            if (aMSDataStore instanceof CardSaleResponseData) {
                mCardSaleResponseData = (CardSaleResponseData) aMSDataStore;
                if (!mCardSaleResponseData.getResponseStatus()) {
                    handleResponse();
                } else {
//                    playSound(100, R.raw.approved);
                    handleResponse();
                }

            }
        }
    }

    public void handleResponse() {

        if (mCardSaleResponseData.getResponseStatus()) {
            doUnbindMswipeWisepadDeviceService();
            paymentListener.onSuccess(mCardSaleResponseData);
            paymentListener.onSuccess(mCardSaleResponseData);
        } else {
            String errorno = "";
            try {
                errorno = ((mCardSaleResponseData.getFO39Tag().length() > 0) ? mCardSaleResponseData.getFO39Tag() : mCardSaleResponseData.getErrorNo() + "");
            } catch (Exception ex) {
                errorno = mCardSaleResponseData.getErrorNo() + "";
            }
            String mDeclineErrorMsg = mCardSaleResponseData.getResponseFailureReason() + " (" + mCardSaleResponseData.getErrorCode() + "-" + errorno + ")";
            callPaymentFailed(errorno, mDeclineErrorMsg);
        }

    }


    public interface IPaymentListener {

        void onError(String errorCode, String errorMessage);

        void state(CardTransactionState msg);

        void onSuccess(CardSaleResponseData transaction);

    }
}
