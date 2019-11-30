//
//  MswipeTransaction.h
//  project_1
//
//  Created by Dharmita Bhatt on 4/11/19.
//  Copyright © 2019 Facebook. All rights reserved.
//

#import <Foundation/Foundation.h>
#import "ChangePassword.h"
#import "LoginHelper.h"
#import "MswipeTransactionHelper.h"


@protocol MSwipeTransactionDelegate;
@interface MswipeTransaction : NSObject<LoginDelegate,ChangePasswordDelegate,TransactionDelegate>
- (void)startTransaction:(NSMutableDictionary *) data;
@property (nonatomic, weak) id<MSwipeTransactionDelegate> delegate;
@property (nonatomic, strong) NSMutableDictionary                 *requestData;
@end

@protocol MSwipeTransactionDelegate <NSObject>

@optional
- (void)onTrasactionSuccess:(NSMutableDictionary *)response;
- (void)onTransactionFailure:(NSMutableDictionary *)error;

@optional
- (void)onRefundSuccess:(NSMutableDictionary *)response;
- (void)onRefundFailure:(NSMutableDictionary *)error;

@end


