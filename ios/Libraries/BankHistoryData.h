//
//  BankHistoryData.h
//  MSWisePadWebRocket
//
//  Created by satish reddy on 7/9/16.
//  Copyright © 2016 Mwsipe. All rights reserved.
//

#import <Foundation/Foundation.h>

@interface BankHistoryData : NSObject
{
}

@property (nonatomic, strong) NSString  *Date;
@property (nonatomic, strong) NSString  *Amount;
@property (nonatomic, strong) NSString  *TrxType;
@property (nonatomic, strong) NSString  *Voucher;
@property (nonatomic, strong) NSString  *MerchantInvoice;
@property (nonatomic, strong) NSString  *ChequeNo;


@end
