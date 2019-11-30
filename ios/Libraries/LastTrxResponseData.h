//
//  LoginResponseData.h
//  MSWisePadWebRocket
//
//  Created by satish reddy on 6/16/16.
//  Copyright © 2016 Mwsipe. All rights reserved.
//

#import <Foundation/Foundation.h>
#import "MSDataStore.h"

@interface LastTrxResponseData : MSDataStore
{
    
}

@property (nonatomic, strong) NSString*         trxDate;
@property (nonatomic, strong) NSString*         cardHolderName;
@property (nonatomic, strong) NSString*         cardLastFourDigits;
@property (nonatomic, strong) NSString*         trxAmount;
@property (nonatomic, strong) NSString*         trxType;
@property (nonatomic, strong) NSString*         trxNotes;
@property (nonatomic, strong) NSString*         trxMsg;
@property (nonatomic, strong) NSString*         voucherNo;
@property (nonatomic, strong) NSString*         RRNo;
@property (nonatomic, strong) NSString*         stanNo;
@property (nonatomic, strong) NSString*         authCode;
@property (nonatomic, strong) NSString*         trxStatus;
@property (nonatomic, strong) NSString*         terminalMessage;
@property (nonatomic, strong) NSString*         MID;
@property (nonatomic, strong) NSString*         TID;
@property (nonatomic, strong) NSString*         batchNo;
@property (nonatomic, strong) NSString*         receiptNo;


@end
