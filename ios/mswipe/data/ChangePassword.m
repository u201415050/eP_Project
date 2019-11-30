//
//  ChangePassword.m
//  project_1
//
//  Created by Dharmita Bhatt on 4/11/19.
//  Copyright © 2019 Facebook. All rights reserved.
//

#import "ChangePassword.h"
#import <Foundation/Foundation.h>
#import "AppSharedPreferences.h"
#import "MSWisepadController.h"
#import "MSwipeData.h"
@interface ChangePassword ()

@end
@implementation ChangePassword

- (void)changePassword:(NSMutableDictionary *)data{
  self.requestData=data;
  [AppSharedPreferences setGatewayType:GatewayEnvironment_LIVE];
  
  self.oldPassword=data[@"password"];
  
  if ([ self.oldPassword length]>=10) {
    self.unPassword=self.oldPassword;
  }else{
    self.unPassword= [self.oldPassword stringByAppendingString:@"12"];
  }
  
  [[MSWisepadController sharedInstance: [AppSharedPreferences getGatewayType]
         aMSGatewayConnectionListener : self] changePassword:[AppSharedPreferences getReferenceId]
   aSessionTokeniser: [AppSharedPreferences getSessionToken] aPassword: self.oldPassword
   aNewPassword:self.unPassword aMswipeWisepadControllerResponseListener: self];
}

-(void) onResponseData :(id) data
{
  [[MSWisepadController sharedInstance: [AppSharedPreferences getGatewayType]
         aMSGatewayConnectionListener : self] stopMSGatewayConnection];
  
  
  MSDataStore *msDataStore = (MSDataStore*) data;
  
  if(msDataStore.ResponseStatus)
  {
    [self updateDevice];
    [AppSharedPreferences setReferenceId : @""];
    [AppSharedPreferences setSessionToken : @""];
  }
  else{
    NSMutableDictionary *dict = @{ @"errorCode" : msDataStore.ErrorCode, @"errorMessage" : msDataStore.ResponseFailureReason};
    [self.delegate onChangePasswordFailure:dict];
    
  }
}

-(void) updateDevice{
  
  NSDictionary *processorKeys = @{@"username" :self.requestData[@"userName"],
                                  @"password" : self.unPassword
                                  };
  
  NSDictionary *jsonDictionary = @{@"merchantId" : self.requestData[@"merchantId"],
                                   @"userId" : self.requestData[@"userId"],
                                   @"deviceActive" : self.requestData[@"deviceActive"],
                                   @"deviceId" : self.requestData[@"deviceId"],
                                   @"deviceProcessorId" : self.requestData[@"processorId"],
                                   @"manufacturerId" : self.requestData[@"manufacturerId"],
                                   @"deviceTypeId" : self.requestData[@"deviceTypeId"],
                                   @"deviceTypeName" : self.requestData[@"deviceTypeName"],
                                   @"deviceSerialNumber" : self.requestData[@"serialNumber"],
                                   @"deviceManufacturerName" : self.requestData[@"deviceManufacturerName"],
                                   @"deviceProcessorKeyValue" : processorKeys
                                   };
  
  //Covert JSON to a string
  NSError *error;
  NSString *jsonString;
  NSData *jsonData = [NSJSONSerialization dataWithJSONObject:jsonDictionary
                                                     options:NSJSONWritingPrettyPrinted
                                                       error:&error];
  
  if (! jsonData) {
    NSMutableDictionary *dict = @{ @"errorCode" : @"Error", @"errorMessage" : @"Error while building response"};
    [self.delegate onChangePasswordFailure:dict];
  } else {
    jsonString = [[NSString alloc] initWithData:jsonData encoding:NSUTF8StringEncoding];
    NSLog(@"getUserDevices Call JSON String: %@", jsonString);
  }
  Networking *networking = [[Networking alloc] init];
  networking.delegate=self;
  [networking updateDevice:@[ self.requestData[@"authKey"],
                               jsonString,
                               self.requestData[@"url"]
                                ]];
                              }
                              
                              //API Call back
                              
 - (void)onSuccess:(NSMutableData *)data{
    NSString* newStr = [[NSString alloc] initWithData:data encoding:NSUTF8StringEncoding];
    NSLog(@"Data arrived from server: %@",newStr);
    
    
    //now parse the data//
    NSError* error;
    NSDictionary *dictionary = [NSJSONSerialization JSONObjectWithData:data
                                                               options:NSJSONReadingAllowFragments
                                                                 error:&error];
    
    if(!error)
    {
      if([dictionary[@"status"] isEqualToNumber:[NSNumber numberWithInt:1]])
      {
        [self.delegate onChangePasswordSuccess:self.unPassword];
      }else{
        NSMutableDictionary *dict = @{ @"errorCode" : @"Error", @"errorMessage" : dictionary[@"message"]};
        [self.delegate onChangePasswordFailure:dict];
      }}else{
        NSMutableDictionary *dict = @{ @"errorCode" : @"Error", @"errorMessage" : @"Error while parsing the response"};
        [self.delegate onChangePasswordFailure:dict];
      }
  }
                              
                              
                              
- (void)onFailure:(NSError *)error{
    
    NSString * errorMessage = @"Unknown error ocurred while expecting update device response from the server!";
    NSMutableDictionary *dict = @{ @"errorCode" : @"Error", @"errorMessage" : errorMessage};
    [self.delegate onChangePasswordFailure:dict];
  }
                              
                              @end
