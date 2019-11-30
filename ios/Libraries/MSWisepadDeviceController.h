//
//  MswipeSwiperController.h
//  MswipeIOSSDK
//
//  Created by satish reddy on 4/2/15.
//  Copyright (c) 2015 Msipe. All rights reserved.
//

#import <Foundation/Foundation.h>
@class MSWisepadController;

#import "BBDeviceController.h"
#import "BBDeviceOTAController.h"
#import "MSWisepadDeviceControllerResponseListener.h"
#import "MSWisepadOTADeviceControllerResponseListener.h"

typedef enum  {SWIPE, INSERT, SWIPE_OR_INSERT} WisepadCheckCardMode;

@interface MSWisepadDeviceController : NSObject<BBDeviceControllerDelegate, BBDeviceOTAControllerDelegate>
{    
}

//+ (MSWisepadDeviceController*)sharedInstance;

- (void) releaseMSWisePadController;

- (void) initMswipeWisepadDeviceController : (id) aMSWisepadDeviceControllerResponseListener
                              aAutoConnect : (BOOL) aAutoConnect
             aCallCheckCardAfterConnection : (BOOL) aCallCheckCardAfterConnection
                       aAllowFirwareUpdate : (Boolean) aAllowFirwareUpdate;

- (void) setCheckCardMode : (WisepadCheckCardMode) aWisepadCheckCardMode;

- (void) scanDevices;

- (void) rescanDevices;

- (void) connect : (CBPeripheral *) device;

- (void) disConnect;

/*
 * description 
 *   sets the wisepad connection state and delegates this status to listner objects.
 *  wisePadConnectionState
 *   the current state of the wisepad.
 */
- (void) setWisepadConnectionState :(WisePadConnection) wisePadConnection;

/**
 * description
 *     return the wise pad connection status
 * @return
 * WisePadConnection 
 * 		enum describing the status of the connection    
 */

- (WisePadConnection)  getWisepadConnectionState;

/**
 * description
 *   sets the wisepad transaction state.
 * @param aWisePadTransactionState
 *   the current transaction state of the wisepad that it goes through from the ready state.
 */

- (void) setWisePadTransactionState : (WisePadTransactionState) aWisePadTransactionState;
/**
 * description
 *     return the wisepad transaction status
 * @return
 * WisePadTransactionState
 * 		enum describing the status of the wisepad transaction state which are all the states after ready mode
 */

- (WisePadTransactionState)  getWisePadTransactionState;


/**
 * description
 *    sets the bluetooth status state and delegates this status to listner objects.
 * bluetoothConnectionState
 *    the current status of the bluetooth of device.
 */

- (void) setWisepadConnectionError ;
/***
 * description 
 *      return the connection status of the device
 * @return
 * Boolean
 * 		false if the device is not connected or true if connected
 */

- (bool) isDevicePresent;

/***
 * description 
 *      return device information asynchronously through the callback method
 */

- (void)  getDeviceInfo;


/***
 * description 
 *      initiates the device to start accepting the cards and the and show please swipe or insert on the display
 *this can be called only when the device in ready mode for the other states the the SDK responds with invalid command
 */
- (void) checkCard : (WisepadCheckCardMode) aWisepadCheckCardMode;

/***
 * description 
 *     will move the wisepad form check card state to ready mode, this will cancel the swipe or insert state	
 *      
 */
- (void) cancelCheckCard;

/***
 * description 
 *     Its similar to checkCard, but here the wispad will accept only EMV card, the MAG cards will not be recognized 
 */

- (void) startEmv ;

/**
 * description
 * 		selected the EMV module
 * @param
 * position
 * 		the position is the module to be selected from the list of modules the device returns to the user
 */
- (void) selectApplication : (int) position ;
/**
 * description
 * 		cancel the EMV module selection mode.
 */
- (void) cancelSelectApplication;

/**
 * description 
 *      the online issuer script for the EMV should we written back EMV kernal, and CVM will validate 
 * the script and then either approves or decline the online transaction.
 */
- (void) sendOnlineProcessResult : (NSString*) tlvProcessResultData;

/**
 * description 
 *      The EMV card details are sent and the wisepad goes into online mode, and the resultant script had to be sent to 
 * EMV keranl, and this method will cancel the online process
 */

- (void) cancelOnlineProcess;

- (BOOL) getSetAmountWithOnRequestSetAmountCalled;

/**
 * description 
 *     Set the amount for device, this will display on the device panel, amount on the device can be set
 * before the checkCard process or when the device to set amount state.
 */
- (void) setAmount : (NSString*) amount ;
/**
 * description
 *     Set the amount for device, this will display on the device panel, amount on the device can be set
 * before the checkCard process or when the device to set amount state.
 */
- (void) resetSetAmount;




- (void) setMSWisepadOTADeviceControllerResponseListener :(id) aMSWisepadOTADeviceControllerResponseListener isProduction :( Boolean) isProduction;

- (void)stopFirmwareUpdate;

- (void) startRemoteConfigUpdate;

- (void) startRemoteKeyInjection;

- (void) startRemoteFirmwareUpdate :(int) iFirmwareType;

- (void) readWiFiSettings;

- (void) readGprsSettings;

- (void) updateWiFiSettings :  (NSDictionary*)data;

- (void) updateGprsSettings  : (NSDictionary*)data;

@end


