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

@interface ReceiptDetailsResponseData : CardData
{
}

@property (nonatomic, strong) NSString* StrReciptData;
@property (nonatomic, strong) ReceiptData* reciptData;


@end
