//
//  ChangePassword.h
//  project_1
//
//  Created by Dharmita Bhatt on 4/11/19.
//  Copyright © 2019 Facebook. All rights reserved.
//

#import <Foundation/Foundation.h>
#import "MSWisepadController.h"
#import "Networking.h"


@protocol ChangePasswordDelegate;

@interface ChangePassword : NSObject<MSWisepadControllerResponseListener,NetworkingDelegate>

//change password call
- (void)changePassword:(NSMutableDictionary *) request;
-(void) updateDevice;


@property (nonatomic, weak) id<ChangePasswordDelegate> delegate;
@property (nonatomic, strong) NSMutableDictionary                 *requestData;
@property (nonatomic, strong) NSString                 *oldPassword;
@property (nonatomic, strong) NSString                 *unPassword;
@end

@protocol ChangePasswordDelegate <NSObject>

@optional
- (void)onChangePasswordSuccess:(NSString *)unPassword;
- (void)onChangePasswordFailure:(NSMutableDictionary *)error;

@end




