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

@interface CashSaleResponseData : CardData
{
}

@property (nonatomic, strong) NSString*  CaseSaleType;
@property (nonatomic, strong) NSString*  CashSaleApprovedMessage;

@property (nonatomic, strong) NSString* Amount;
@property (nonatomic, strong) NSString* InvoiceNo;
@property (nonatomic, strong) NSString* MID;
@property (nonatomic, strong) NSString* TID;
@property (nonatomic, strong) NSString* VoucherNo;
@property (nonatomic, strong) NSString* Date;


//to send the reciept data as string to external app
@property (nonatomic, strong) NSString* StrReciptData;

@property (nonatomic, strong) ReceiptData* reciptData;

@end
