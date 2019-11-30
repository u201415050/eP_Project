//
//  MSWisepadOTADeviceControllerResponseListener.h
//  MSWisePadWebRocket
//
//  Created by satish reddy on 6/25/16.
//  Copyright © 2016 Mwsipe. All rights reserved.
//
#ifndef MSWisepadOTADeviceControllerResponseListener_h
#define MSWisepadOTADeviceControllerResponseListener_h

#import <CoreBluetooth/CoreBluetooth.h>

typedef enum
{
    COMPLTED,
    PROGRESS
}OTAWisePadResults;


typedef enum
{
    BATTERY_LOW_ERROR,
    DEVICE_COMM_ERROR,
    FAILED,
    NO_UPDATE_REQUIRED,
    SERVER_COMM_ERROR,
    SETUP_ERROR,
    STOPPED,
    InvalidControllerStateError,
    IncompatibleFirmwareHex,
    IncompatibleConfigHex
    
}OTAWisePadError;


@protocol MSWisepadOTADeviceControllerResponseListener <NSObject>


- (void) onReturnWisePadOTAResults :(OTAWisePadResults) results
                        percentage : (double) percentage;

- (void) onWisePadOTAError :(OTAWisePadError) error;

@end

#endif /* MSWisepadOTADeviceControllerResponseListener_h */

