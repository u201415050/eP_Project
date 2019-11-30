//
//  TransactionData.h
//  MSWisePadWebRocket
//
//  Created by satish reddy on 6/29/16.
//  Copyright © 2016 Mwsipe. All rights reserved.
//

#import <Foundation/Foundation.h>

@interface TransactionData : NSObject
{
}

@property(nonatomic, strong) NSString* mBaseAmount;
@property(nonatomic, strong) NSString* mTipAmount;
@property(nonatomic, strong) NSString* mSaleCashAmount;
@property(nonatomic, strong) NSString* mTotAmount;
@property(nonatomic, strong) NSString* mReceipt;
@property(nonatomic, strong) NSString* mPhoneNo;
@property(nonatomic, strong) NSString* mEmail;
@property(nonatomic, strong) NSString* mNotes;

@property(nonatomic, strong) NSString* mNoteOne;
@property(nonatomic, strong) NSString* mNoteTwo;
@property(nonatomic, strong) NSString* mNoteThree;
@property(nonatomic, strong) NSString* mNoteFour;
@property(nonatomic, strong) NSString* mNoteFive;
@property(nonatomic, strong) NSString* mNoteSix;
@property(nonatomic, strong) NSString* mNoteSeven;
@property(nonatomic, strong) NSString* mNoteEight;
@property(nonatomic, strong) NSString* mNoteNine;
@property(nonatomic, strong) NSString* mNoteTen;

@property(nonatomic, assign) bool isAmexCard;
@property(nonatomic, strong) NSString* mAmexSecurityCode;

@property(nonatomic, strong) NSString* mEmiPeriod;
@property(nonatomic, strong) NSString* mEmiBankCode;
@property(nonatomic, strong) NSString* mEmiRate;

@property(nonatomic, strong) NSString* mConvenienceAmount;
@property(nonatomic, strong) NSString* mServiceTaxamount;

@property(nonatomic,strong)  NSMutableArray* mArrPreauthSaleTrxData;

@property(nonatomic, strong) NSString* mCardFirstSixDigit;
@property(nonatomic,strong)  NSMutableArray* mArrEMIOptionsData;

// Refund trx

@property(nonatomic, strong) NSString* mDate;
@property(nonatomic, strong) NSString* mSelectedDate;
@property(nonatomic, strong) NSString* mLast4Digits;
@property(nonatomic, strong) NSString* mStandId;
@property(nonatomic, strong) NSString* mVoucherNo;
@property(nonatomic, strong) NSString* mAuthCode;
@property(nonatomic, strong) NSString* mRRNo;
@property(nonatomic, strong) NSString* mPrismInvoiceNo;

//bank trx
@property(nonatomic, strong) NSString* mChequeNo;
@property(nonatomic, strong) NSString* mChequeDate;


@end
