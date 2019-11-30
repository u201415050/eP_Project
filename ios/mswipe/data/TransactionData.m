//
//  TransactionData.m
//  MSWisePadWebRocket
//
//  Created by satish reddy on 6/29/16.
//  Copyright © 2016 Mwsipe. All rights reserved.
//

#import "TransactionData.h"

@implementation TransactionData


- (id)init {
    if (self = [super init]) {
        
        self.mBaseAmount = @"0.00";
        self.mTipAmount = @"0.00";
        self.mSaleCashAmount = @"0.00";
        self.mTotAmount = @"0.00";
        
        self.mChequeNo = @"";
        self.mBaseAmount = @"";
        self.mTipAmount = @"";
        self.mSaleCashAmount = @"";
        self.mTotAmount = @"";
        self.mReceipt = @"";
        self.mPhoneNo = @"";
        self.mEmail = @"";
        self.mNotes = @"";
        self.mAmexSecurityCode = @"";

        self.mEmiPeriod = @"";
        self.mEmiBankCode = @"";

        self.mConvenienceAmount = @"";
        self.mServiceTaxamount = @"";

        self.mCardFirstSixDigit = @"";

        // Refund trx
        self.mDate = @"";
        self.mSelectedDate = @"";
        self.mLast4Digits = @"";
        self.mStandId = @"";
        self.mVoucherNo = @"";
        self.mAuthCode = @"";
        self.mRRNo = @"";
        self.mPrismInvoiceNo = @"";
       
    }
    return self;
}



@end

