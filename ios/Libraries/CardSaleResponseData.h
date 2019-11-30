//
//  CardSaleResponseData.h
//  MSWisePadWebRocket
//
//  Created by satish reddy on 6/27/16.
//  Copyright © 2016 Mwsipe. All rights reserved.
//

#import <Foundation/Foundation.h>
#import "CardData.h"
#import "ReceiptData.h"

@interface CardSaleResponseData : CardData
{
}

@property (nonatomic, strong) NSString*  CardSaleType;
@property (nonatomic, assign) BOOL      isEMV;

@property (nonatomic, strong) NSString*  CardSaleApprovedMessage;


@property (nonatomic, strong) NSString* EmvCardExpdate;
@property (nonatomic, strong) NSString* SwitchCardType;
@property (nonatomic, strong) NSString* StandId;
	//private String F055tag;
@property (nonatomic, strong) NSString* AuthCode;
@property (nonatomic, strong) NSString* RRNO;
@property (nonatomic, strong) NSString* Date;
@property (nonatomic, strong) NSString* IssuerScript;
	
@property (nonatomic, strong) NSString* TID;
@property (nonatomic, strong) NSString* MID;
@property (nonatomic, strong) NSString* BatchNo;
@property (nonatomic, strong) NSString* VoucherNo;
	
@property (nonatomic, strong) NSString* FO39Tag;

@property (nonatomic, strong) NSString*  ReceiptEnabledForAutoVoid;
@property (nonatomic, strong) NSString* TrxAmount;
@property (nonatomic, assign) bool isAutoVoid;
@property (nonatomic, assign) bool isPreAuthSale;

//to send the reciept data as string to external app
@property (nonatomic, strong) NSString* StrReciptData;

@property (nonatomic, strong) ReceiptData* reciptData;

@end
