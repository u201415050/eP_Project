//
//  MSWisepadDeviceControllerResponseListener.h
//  MSWisePadWebRocket
//
//  Created by satish reddy on 6/25/16.
//  Copyright © 2016 Mwsipe. All rights reserved.
//
#ifndef MSWisepadDeviceControllerResponseListener_h
#define MSWisepadDeviceControllerResponseListener_h

#import <CoreBluetooth/CoreBluetooth.h>

typedef enum
{
    ICC_CARD,
    MAG_CARD,
    MAG_AMEXCARD,
    CARDSCHEMERRESULTS_UNKNOWN,
    
} CARDSCHEMERRESULTS;

typedef enum
{
    TransactionResult_APPROVED = 500,
    TransactionResult_TERMINATED,
    TransactionResult_DECLINED,
    TransactionResult_CANCEL,
    TransactionResult_CAPK_FAIL,
    TransactionResult_NOT_ICC,
    TransactionResult_SELECT_APP_FAIL,
    TransactionResult_DEVICE_ERROR,
    TransactionResult_APPLICATION_BLOCKED,
    TransactionResult_ICC_CARD_REMOVED,
    TransactionResult_CARD_BLOCKED,
    TransactionResult_CARD_NOT_SUPPORTED,
    TransactionResult_CONDITION_NOT_SATISFIED,
    TransactionResult_INVALID_ICC_DATA,
    TransactionResult_MISSING_MANDATORY_DATA,
    TransactionResult_NO_EMV_APPS,
    TransactionResult_AUTO_REVERSAL_TRX
    
}TransactionResult;



typedef enum
{
    DisplayText_AMOUNT_OK_OR_NOT,
    DisplayText_APPROVED,
    DisplayText_CALL_YOUR_BANK,
    DisplayText_CANCEL_OR_ENTER,
    DisplayText_CARD_ERROR,
    DisplayText_DECLINED,
    DisplayText_ENTER_PIN,
    DisplayText_INCORRECT_PIN,
    DisplayText_INSERT_CARD,
    DisplayText_NOT_ACCEPTED,
    DisplayText_PIN_OK,
    DisplayText_PLEASE_WAIT,
    DisplayText_PROCESSING_ERROR,
    DisplayText_REMOVE_CARD,
    DisplayText_USE_CHIP_READER,
    DisplayText_USE_MAG_STRIPE,
    DisplayText_TRY_AGAIN,
    DisplayText_REFER_TO_YOUR_PAYMENT_DEVICE,
    DisplayText_TRANSACTION_TERMINATED,
    DisplayText_TRY_ANOTHER_INTERFACE,
    DisplayText_ONLINE_REQUIRED,
    DisplayText_PROCESSING,
    DisplayText_WELCOME,
    DisplayText_PRESENT_ONLY_ONE_CARD,
    DisplayText_LAST_PIN_TRY,
    DisplayText_CAPK_LOADING_FAILED,
    DisplayText_SELECT_ACCOUNT,
    DisplayText_ENTER_AMOUNT,
    
    DisplayText_ENTER_PIN_BYPASS,
    DisplayText_LOW,
    DisplayText_CRITICALLY_LOW,    
    
    DisplayText_PRESENT_CARD,
    DisplayText_APPROVED_PLEASE_SIGN,
    DisplayText_PRESENT_CARD_AGAIN,
    DisplayText_AUTHORISING,
    DisplayText_INSERT_SWIPE_OR_TRY_ANOTHER_CARD,
    DisplayText_INSERT_OR_SWIPE_CARD,
    DisplayText_MULTIPLE_CARDS_DETECTED,
    DisplayText_TIMEOUT,
    DisplayText_APPLICATION_EXPIRED,
    DisplayText_FINAL_CONFIRM,
    DisplayText_SHOW_THANK_YOU,
    DisplayText_PIN_TRY_LIMIT_EXCEEDED,
    DisplayText_NOT_ICC_CARD,
    DisplayText_CARD_INSERTED,
    DisplayText_CARD_REMOVED,
    DisplayText_NO_EMV_APPS
    
    
} DisplayText;

typedef enum
{
    ErrorType_InvalidInput = 300,
    ErrorType_InvalidInput_NotNumeric,
    ErrorType_InvalidInput_InputValueOutOfRange,
    ErrorType_InvalidInput_InvalidDataFormat,
    ErrorType_InvalidInput_NotAcceptCashbackForThisTransactionType,
    ErrorType_InvalidInput_NotAcceptAmountForThisTransactionType,
    
    ErrorType_Unknown,
    ErrorType_IllegalStateException,
    ErrorType_CommError,
    ErrorType_CommandNotAvailable,
    ErrorType_DeviceBusy,
    
    ErrorType_CommLinkUninitialized,
    ErrorType_InvalidFunctionInBTMode,
    ErrorType_AudioFailToStart,
    ErrorType_AudioFailToStart_OtherAudioIsPlaying,
    ErrorType_AudioBackgroundTimeout,
    ErrorType_AudioRecordingPermissionDenied,
    ErrorType_InvalidFunctionInCurrentConnectionMode,
    ErrorType_BTAlreadyConnected,
    
}DeviceError;

typedef enum
{
    CheckCardProcess_WAITING_FOR_CARD,
    CheckCardProcess_SET_AMOUNT,
    CheckCardProcess_PIN_ENTRY_ICC_CARD,
    CheckCardProcess_PIN_ENTRY_MAG_CARD,
    CheckCardProcess_SELECT_APPLICATION,
    
}CheckCardProcess;

typedef enum
{
    NONE  = 400,
    NOT_ICC,
    BAD_SWIPE,
    MAG_HEAD_FAIL,
    NO_RESPONSE,
    USE_ICC_CARD,
    KEY_ERROR,
    CANCEL_CHECK_CARD,
    PIN_ENTERED,
    PIN_BYPASS,
    PIN_CANCEL,
    PIN_TIMEOUT,
    PIN_KEY_ERROR,
    PIN_WRONG_PIN_LENGTH,
    PIN_INCORRECT_PIN,
    PIN_UNKNOWN_ERROR,
    PIN_Asterisk,
    ON_REQUEST_ONLINEPROCESS,
    TAP_CARD_DETECTED,
    ManualPanEntry,
    
    Transaction_Terminated,
    Transaction_Declined,
    Transaction_CanceledOrTimeout,
    Transaction_CapkFail,
    Transaction_NotIcc,
    Transaction_CardBlocked,
    Transaction_DeviceError,
    Transaction_SelectApplicationFail,
    Transaction_CardNotSupported,
    Transaction_MissingMandatoryData,
    Transaction_NoEmvApps,
    Transaction_InvalidIccData,
    Transaction_ConditionsOfUseNotSatisfied,
    Transaction_ApplicationBlocked,
    Transaction_IccCardRemoved,
    Transaction_CardSchemeNotMatched,
    Transaction_Canceled,
    Transaction_Timeout,
    Transaction_UnknownError
    
}CheckCardProcessResults;





typedef enum
{
    WisePadConnection_NOT_CONNECTED = 100,
    WisePadConnection_CONNECTING,
  	 WisePadConnection_CONNECTED,
  	 WisePadConnection_DIS_CONNECTED,
    WisePadConnection_FAIL_TO_START_BT,
    WisePadConnection_DEVICE_NOTFOUND,
    /*it will using only for display not set the state of the connection since the connecting will be used to
  	  * by the user for the device is in the process of connecting*/
  	 WisePadConnection_DEVICE_DETECTED,
    WisePadConnection_SCANNING,
    WisePadConnection_SCANNING_TIMEOUT,
    
    
    WisePadConnection_BLUETOOTH_SWITCHEDOFF,
  	 WisePadConnection_BLUETOOTH_DISABLED,
    WisePadConnection_BLE_NOTSUPPORTED,
    
  	 WisePadConnection_MULTIPLE_PAIRED_DEVCIES_FOUND,
  	 WisePadConnection_NO_PAIRED_DEVICES_FOUND,
    
    
}WisePadConnection;

typedef enum
{
    WisePadTransactionState_Ready = 200,
    WisePadTransactionState_CheckCard,
    WisePadTransactionState_CancelCheckCard,
    WisePadTransactionState_WaitingForCard,
    
    WisePadTransactionState_MAG_Card,
    WisePadTransactionState_MAG_Pin_Request,
    
    WisePadTransactionState_Pin_Entry_Results,
    
    WisePadTransactionState_ICC_Card,
    WisePadTransactionState_ICC_Pin_Request,
    
    //WisePadTransactionState_Amex_Card_Pin_Request,
    
    WisePadTransactionState_ICC_SetAmount,
    
    WisePadTransactionState_MAG_Online_Process,
    WisePadTransactionState_ICC_Online_Process,
    
} WisePadTransactionState;

typedef enum
{
    WISEPAD_ReadWiFiSettingsResult,
    WISEPAD_UpdateWiFiSettingsResult,
    WISEPAD_ReadGprsSettingsResult,
    WISEPAD_UpdateGprsSettingsResult
    
} WispadNetwrokSetting;

@protocol MSWisepadDeviceControllerResponseListener <NSObject>

/*
 * a call back method that get the the current state of the device.
 * param wisePadConntection
 */
- (void) onReturnWisepadConnection :(WisePadConnection) wisePadConntection
                connectedPeripheral:(CBPeripheral *)connectedPeripheral  foundDevices : (NSArray *)foundDevices;

- (void) onRequestWisePadCheckCardProcess :(CheckCardProcess)
checkCardProcess dataList  : (NSArray*) dataList;

- (void) onReturnWisePadOfflineCardTransactionResults : (CheckCardProcessResults) checkCardResults
                                       paramHashtable :(NSDictionary*) paramHashtable;

- (void) onError :(DeviceError) error errorMsg: (NSString*) errorMsg ;

- (void) onRequestDisplayWispadStatusInfo : (DisplayText) msg;

- (void) onReturnDeviceInfo : (NSDictionary*) paramHashtable;

- (void) onReturnWispadNetwrokSettingInfo :(WispadNetwrokSetting) wispadNetwrokSetting status : ( Boolean) status  netwrokSettingInfo :(NSDictionary*) netwrokSettingInfo;

@end

#endif /* MSWisepadDeviceControllerResponseListener_h */

