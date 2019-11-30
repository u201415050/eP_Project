//
//  LoginHelper.h
//  project_1
//
//  Created by Dharmita Bhatt on 4/11/19.
//  Copyright © 2019 Facebook. All rights reserved.
//


#import <Foundation/Foundation.h>
#import "MSWisepadController.h"

#import "LoginResponseData.h"

@protocol LoginDelegate;

@interface LoginHelper : NSObject<MSWisepadControllerResponseListener>{
  BOOL mIsConnectingToGateway;
}

//login call
- (void)login:(NSMutableDictionary *) request;


@property (nonatomic, weak) id<LoginDelegate> delegate;
@property (nonatomic, strong) NSMutableDictionary                 *requestData;
@end

@protocol LoginDelegate <NSObject>

@optional
- (void)onLoginSuccess:(LoginResponseData *)loginData;
- (void)onLoginFailure:(NSMutableDictionary *)error;

@end
