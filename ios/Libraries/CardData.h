//
//  CardData.h
//  MSWisePadWebRocket
//
//  Created by satish reddy on 6/26/16.
//  Copyright © 2016 Mwsipe. All rights reserved.
//

#import <Foundation/Foundation.h>
#import "MSDataStore.h"
#import "MSWisepadDeviceControllerResponseListener.h"

@interface CardData : MSDataStore
{

}

@property (nonatomic, assign) CARDSCHEMERRESULTS mCardSchemeResults ;

@property (nonatomic, strong) NSString* CreditCardNo;
@property (nonatomic, strong) NSString* CardHolderName;
@property (nonatomic, strong) NSString* ExpiryDate;
@property (nonatomic, strong) NSString* First4Digits;
@property (nonatomic, strong) NSString* Last4Digits;


@property (nonatomic, strong) NSString* DeviceId;
@property (nonatomic, strong) NSString* ServiceCode;
@property (nonatomic, strong) NSString* TVR;
@property (nonatomic, strong) NSString* TSI;
@property (nonatomic, strong) NSString* ApplicationName;
@property (nonatomic, strong) NSString* AppIdentifier;
@property (nonatomic, strong) NSString* Certif;
@property (nonatomic, assign) bool isPin;
@end
