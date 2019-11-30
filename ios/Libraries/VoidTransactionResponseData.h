//
//  LoginResponseData.h
//  MSWisePadWebRocket
//
//  Created by satish reddy on 6/16/16.
//  Copyright © 2016 Mwsipe. All rights reserved.
//

#import <Foundation/Foundation.h>
#import "MSDataStore.h"
#import "ReceiptData.h"

@interface VoidTransactionResponseData : MSDataStore
{
    
}

@property (nonatomic, strong) NSString*         trxDate;
@property (nonatomic, strong) ReceiptData*      reciptData;


@end
