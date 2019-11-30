//
//  LoginResponseData.h
//  MSWisePadWebRocket
//
//  Created by satish reddy on 6/16/16.
//  Copyright © 2016 Mwsipe. All rights reserved.
//

#import <Foundation/Foundation.h>
#import "MSDataStore.h"

@interface LoginResponseData : MSDataStore
{
}


@property (nonatomic, assign) Boolean           firstTimePasswordChanged;
@property (nonatomic, strong) NSString*         referenceId;
@property (nonatomic, strong) NSString*         sessionTokeniser;
@property (nonatomic, strong) NSString*         imeiNo;

@property (nonatomic, strong) NSString*         firstName;
@property (nonatomic, strong) NSString*         currency;

@property (nonatomic, assign) Boolean           adminUser;
@property (nonatomic, assign) Boolean           tipsRequired;
@property (nonatomic, assign) Boolean           receiptRequired;
@property (nonatomic, assign) Boolean           cashSaleEnabled;
@property (nonatomic, assign) Boolean           preauthEnabled;
@property (nonatomic, assign) Boolean           saleWithCashEnabled;
@property (nonatomic, assign) Boolean           emiEnabled;
@property (nonatomic, assign) Boolean           voidEnabled;
@property (nonatomic, assign) Boolean           refundEnabled;
@property (nonatomic, assign) Boolean           CAATEnabled;
@property (nonatomic, assign) Boolean           MVisaEnabled;
@property (nonatomic, assign) Boolean           groupLoginUser;
@property (nonatomic, assign) Boolean           pinBasedLogin;

@property (nonatomic, assign) Boolean           pinBypass;
@property (nonatomic, assign) Boolean           g2User;


@property (nonatomic, assign) float             conveniencePercentage;
@property (nonatomic, assign) float              serviceTax;

@property (nonatomic, strong) NSString*         merchantName;
@property (nonatomic, strong) NSString*         MID;
@property (nonatomic, strong) NSString*         TID;
@property (nonatomic, strong) NSString*         merchantAddress;
@property (nonatomic, strong) NSString*         merchantAccNo;
@property (nonatomic, strong) NSString*         merchantBankName;
@property (nonatomic, strong) NSString*         visaId;
@property (nonatomic, strong) NSString*         MCC;
@property (nonatomic, strong) NSString*         city;
@property (nonatomic, strong) NSString*         state;
@property (nonatomic, strong) NSString*         OTP;

@property (nonatomic, strong) NSString*         mDealerCode;
@property (nonatomic, strong) NSString*         mDealerName;
@property (nonatomic, strong) NSString*         mTypeFinancing;
@property (nonatomic, strong) NSString*         mBusinessProductCode;


@end
