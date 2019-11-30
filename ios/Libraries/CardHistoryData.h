//
//  CardHistoryData.h
//  MSWisePadWebRocket
//
//  Created by satish reddy on 7/9/16.
//  Copyright © 2016 Mwsipe. All rights reserved.
//

#import <Foundation/Foundation.h>

@interface CardHistoryData : NSObject
{
}

@property (nonatomic, strong) NSString  *TrxType;
@property (nonatomic, strong) NSString  *Date;
@property (nonatomic, strong) NSString  *CardFourDigits;
@property (nonatomic, strong) NSString  *Amount;
@property (nonatomic, strong) NSString  *CardType;
@property (nonatomic, strong) NSString  *StandId;
@property (nonatomic, strong) NSString  *Voucher;
@property (nonatomic, strong) NSString  *AuthNo;
@property (nonatomic, strong) NSString  *RRNo;
@property (nonatomic, strong) NSString  *MerchantInvoice;
@property (nonatomic, strong) NSString  *Notes;


@property (nonatomic, strong) NSString  *TrxStatus;
@property (nonatomic, strong) NSString  *TerminalMessage;
@end
