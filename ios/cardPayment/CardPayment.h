//
//  CardPayment.h
//  project_1
//
//  Created by Dharmita Bhatt on 4/11/19.
//  Copyright © 2019 Facebook. All rights reserved.
//

#import <Foundation/Foundation.h>
#import <React/RCTBridgeModule.h>
#import "MswipeTransaction.h"


@interface CardPayment : NSObject <RCTBridgeModule,MSwipeTransactionDelegate>
@property (nonatomic, strong)  RCTResponseSenderBlock transactionCallback;;
@end


