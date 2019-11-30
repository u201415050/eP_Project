//
//  ReceiptData.h
//  MSWisePadWebRocket
//
//  Created by satish reddy on 6/27/16.
//  Copyright © 2016 Mwsipe. All rights reserved.
//

#import <Foundation/Foundation.h>

@interface ReceiptData : NSObject
{

}


@property (nonatomic, strong) NSString* bankName;
@property (nonatomic, strong) NSString* merchantName;
@property (nonatomic, strong) NSString* merchantAdd;
@property (nonatomic, strong) NSString* dateTime;
@property (nonatomic, strong) NSString* mId;
@property (nonatomic, strong) NSString* tId;
@property (nonatomic, strong) NSString* batchNo;
@property (nonatomic, strong) NSString* voucherNo;
@property (nonatomic, strong) NSString* refNo;
@property (nonatomic, strong) NSString* saleType;
@property (nonatomic, strong) NSString* cardNo;
@property (nonatomic, strong) NSString* trxType;
@property (nonatomic, strong) NSString* cardType;
@property (nonatomic, strong) NSString* expDate;
@property (nonatomic, strong) NSString* emvSigExpDate;
@property (nonatomic, strong) NSString* cardHolderName;
@property (nonatomic, strong) NSString* currency;
@property (nonatomic, strong) NSString* cashAmount;
@property (nonatomic, strong) NSString* baseAmount;
@property (nonatomic, strong) NSString* tipAmount;
@property (nonatomic, strong) NSString* totalAmount;
@property (nonatomic, strong) NSString* authCode;
@property (nonatomic, strong) NSString* rrNo;
@property (nonatomic, strong) NSString* certif;
@property (nonatomic, strong) NSString* appId;
@property (nonatomic, strong) NSString* appName;
@property (nonatomic, strong) NSString* tvr;
@property (nonatomic, strong) NSString* tsi;
@property (nonatomic, strong) NSString* appVersion;
@property (nonatomic, strong) NSString* isPinVarifed;
@property (nonatomic, strong) NSString* stan;
@property (nonatomic, strong) NSString* cardIssuer;
@property (nonatomic, strong) NSString* emiPerMonthAmount;
@property (nonatomic, strong) NSString* total_Pay_Amount ;
@property (nonatomic, strong) NSString* noOfEmi ;
@property (nonatomic, strong) NSString* interestRate ;
@property (nonatomic, strong) NSString* billNo ;
@property (nonatomic, strong) NSString* firstDigitsOfCard ;

@property (nonatomic, strong) NSString* isConvenceFeeEnable;

	//for cash and bank

@property (nonatomic, strong) NSString* invoiceNo;
@property (nonatomic, strong) NSString* trxDate;
@property (nonatomic, strong) NSString* trxImgDate;
@property (nonatomic, strong) NSString* chequeDate;
@property (nonatomic, strong) NSString* chequeNo;



@end
