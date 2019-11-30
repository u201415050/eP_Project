//
//  LoginHelper.m
//  project_1
//
//  Created by Dharmita Bhatt on 4/11/19.
//  Copyright © 2019 Facebook. All rights reserved.
//
#import "LoginHelper.h"
#import <Foundation/Foundation.h>
#import "AppSharedPreferences.h"
#import "MSWisepadController.h"
#import "MSwipeData.h"
#import "LoginResponseData.h"

@interface LoginHelper ()

@end

@implementation LoginHelper

- (void)login:(NSMutableDictionary *)data{
  self.requestData=data;
  NSLog(@"LoginHelper login %@", [data description]);

  [AppSharedPreferences setGatewayType:GatewayEnvironment_LIVE];
  NSLog(@"Second login %@", [data description]);
  [[MSWisepadController sharedInstance: [AppSharedPreferences getGatewayType]
         aMSGatewayConnectionListener : self] authenticateMerchant: data[@"userName"]
   aMerchantPassword: data[@"password"] aMswipeWisepadControllerResponseListener: self];
}

-(void) onResponseData :(id) data
{
  NSLog(@"Third login %@", [data description]);
  [[MSWisepadController sharedInstance] stopMSGatewayConnection];
  
  LoginResponseData *loginResponseData = (LoginResponseData*) data;
  
  [[MSWisepadController sharedInstance: [AppSharedPreferences getGatewayType]
         aMSGatewayConnectionListener : self] stopMSGatewayConnection];
  NSLog(@"THE LOGINRESPONSE: %@", loginResponseData);
  if(loginResponseData.ResponseStatus){
     NSLog(@"LoginHelper login Success");
    [AppSharedPreferences setUserId: self.requestData[@"userName"] ];
     [AppSharedPreferences setDeviceSerialNumber: self.requestData[@"serialNumber"] ];
    [MSwipeData saveLoginPreferences: loginResponseData ];
    [self.delegate onLoginSuccess:loginResponseData];
  }else{
    NSLog(@"LoginHelper login Failure");
    NSMutableDictionary *dict = @{ @"errorCode" : loginResponseData.ErrorCode, @"errorMessage" : loginResponseData.ResponseFailureReason};
    [self.delegate onLoginFailure:dict];
  }
}

- (void) startMSGatewayConnection
{
  if(!mIsConnectingToGateway){
    
    mIsConnectingToGateway = true;
    [[MSWisepadController sharedInstance: [AppSharedPreferences getGatewayType]
           aMSGatewayConnectionListener : self] startMSGatewayConnection];
  }
}
@end
