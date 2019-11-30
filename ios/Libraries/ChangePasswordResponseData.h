//
//  ChangePasswordResponseData.h
//  MSWisePadWebRocket
//
//  Created by satish reddy on 7/15/16.
//  Copyright © 2016 Mwsipe. All rights reserved.
//

#import "MSDataStore.h"

@interface ChangePasswordResponseData : MSDataStore
{

}

@property (nonatomic, strong)  NSString* SessionTokeniser;
@property (nonatomic, strong)  NSString* IntlMDRRate;
@property (nonatomic, strong)  NSString* CreditPremium;
@property (nonatomic, strong)  NSString* CreditNormal;
@property (nonatomic, strong)  NSString* CustNetDL2;
@property (nonatomic, strong)  NSString* CustNetDG2;
@property (nonatomic, strong)  NSString* DLCorporate;
@property (nonatomic, strong)  NSString* DGCorporate;
@property (nonatomic, strong)  NSString* DLPremium;
@property (nonatomic, strong)  NSString* DGPremium;
@property (nonatomic, strong)  NSString* AmexMDRPer;
@property (nonatomic, strong)  NSString* AdvanceRent;
@property (nonatomic, strong)  NSString* ServiceCharge;
@property (nonatomic, strong)  NSString* BillingDate;
@property (nonatomic, strong)  NSString* AmexActivated;
@property (nonatomic, strong)  NSString* MaxValPerTxn;
@property (nonatomic, strong)  NSString* TxnCountLimit;
@property (nonatomic, strong)  NSString* MaxValPerDayTxn;

@end
