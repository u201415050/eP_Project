//
//  MswipeTransactionHelper.h
//  project_1
//
//  Created by Dharmita Bhatt on 4/11/19.
//  Copyright © 2019 Facebook. All rights reserved.
//

#import <Foundation/Foundation.h>
#import "MSWisepadController.h"

@protocol TransactionDelegate;
@interface MswipeTransactionHelper : NSObject<MSWisepadControllerResponseListener>
- (void)doTransaction:(NSMutableDictionary *) data;
@property (nonatomic, weak) id<TransactionDelegate> delegate;
@property (nonatomic, strong) NSMutableDictionary                 *requestData;
@end
@protocol TransactionDelegate <NSObject>

@optional
- (void)onTrasactionSuccess:(CardSaleResponseData *)response;
- (void)onTransactionFailure:(NSMutableDictionary *)error;

@end

