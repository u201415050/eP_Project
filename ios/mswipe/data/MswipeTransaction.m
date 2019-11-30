//
//  MswipeTransaction.m
//  project_1
//
//  Created by Dharmita Bhatt on 4/11/19.
//  Copyright © 2019 Facebook. All rights reserved.
//

#import "MswipeTransaction.h"
#import "AppSharedPreferences.h"
@implementation MswipeTransaction

- (void)startTransaction:(NSMutableDictionary *) data{
  self.requestData=data;
  if ([self isLoggedIn]) {
    NSLog(@"Something To ENTER");
    [self doTransaction];
  }else{
    NSLog(@"Something To Print");
    [self login];
  }
}

-(void)login{
  LoginHelper *loginHelper=[[LoginHelper alloc]init];
  loginHelper.delegate=self;
  [loginHelper login:self.requestData];
}

-(void)changePassword{
  ChangePassword *changePassword=[[ChangePassword alloc]init];
  changePassword.delegate=self;
  [changePassword changePassword:self.requestData];
}

-(void)doTransaction{
  NSLog(@"Something To Print");
  MswipeTransactionHelper *helper=[[MswipeTransactionHelper alloc]init];
  helper.delegate=self;
  [helper doTransaction:self.requestData];
}

-(Boolean) isLoggedIn{
  if([[AppSharedPreferences getReferenceId] length] == 0
     || [[AppSharedPreferences getSessionToken] length] == 0
     ||  ![[AppSharedPreferences getDeviceSerialNumber] isEqualToString:self.requestData[@"serialNumber"]]){
    return false;
  }
  return true;
}


//Login callback
- (void)onLoginSuccess:(LoginResponseData *)loginData{
  if(loginData.firstTimePasswordChanged){
    [self changePassword];
  }else{
      [self doTransaction];
  }
}

- (void)onLoginFailure:(NSMutableDictionary *)error{
  error[@"success"]=false;
  [self.delegate onRefundFailure:error];
}


//Change password callback
- (void)onChangePasswordSuccess:(NSString *)newPassword{
  [self.requestData setObject: newPassword forKey:@"password"];
  [self login];
}

- (void)onChangePasswordFailure:(NSMutableDictionary *)error{
  error[@"success"]=false;
  [self.delegate onRefundFailure:error];
}


//Transaction Callback
- (void)onTrasactionSuccess:(CardSaleResponseData *)cardSaleResponseData{
  NSMutableDictionary *response = [[NSMutableDictionary alloc] init];
   [response setObject:@true forKey:@"success"];
  [response setObject:cardSaleResponseData.AuthCode forKey:@"authCode"];
   [response setObject:cardSaleResponseData.AuthCode forKey:@"apprCode"];
   [response setObject:cardSaleResponseData.RRNO forKey:@"RRN"];
   [response setObject:cardSaleResponseData.AppIdentifier forKey:@"AID"];
   [response setObject:cardSaleResponseData.BatchNo forKey:@"batchNumber"];
   [response setObject:cardSaleResponseData.SwitchCardType forKey:@"cardLabel"];
   [response setObject:cardSaleResponseData.CardSaleType forKey:@"cardType"];
   [response setObject:cardSaleResponseData.Date forKey:@"tdate"];
   [response setObject:cardSaleResponseData.CreditCardNo forKey:@"maskedPAN"];
   [response setObject:cardSaleResponseData.VoucherNo forKey:@"invoiceNumber"];
   [response setObject:cardSaleResponseData.Certif forKey:@"TC"];
   [response setObject:cardSaleResponseData.TSI forKey:@"TSI"];
   [response setObject:cardSaleResponseData.TVR forKey:@"TVR"];
   [response setObject:cardSaleResponseData.CardHolderName forKey:@"cardHolderName"];
   [response setObject:cardSaleResponseData.StandId forKey:@"stanID"];
   [response setObject:@"" forKey:@"cardTicketNo"];
   [response setObject:cardSaleResponseData.Last4Digits forKey:@"last4Digits"];
   [response setObject:cardSaleResponseData.First4Digits forKey:@"first4Digits"];
   [response setObject:@"" forKey:@"cardBalanceAmt"];
  [response setObject:cardSaleResponseData.isAutoVoid?@"true":@"false" forKey:@"isAutoVoid"];
   [response setObject:cardSaleResponseData.FO39Tag forKey:@"F039Tag"];
   [response setObject:cardSaleResponseData.CardSaleApprovedMessage forKey:@"cardSaleApprovedMessage"];
   [response setObject:cardSaleResponseData.EmvCardExpdate forKey:@"emvCardExpdate"];
   [response setObject:cardSaleResponseData.ReceiptEnabledForAutoVoid forKey:@"receiptEnabledForAutoVoid"];
   [response setObject:cardSaleResponseData.reciptData forKey:@"strReceiptData"];
   [response setObject:cardSaleResponseData.SwitchCardType forKey:@"switchCardType"];
   //[response setObject:cardSaleResponseData.mCardSchemeResults forKey:@"cardSchemeResults"];
   [response setObject:cardSaleResponseData.ExpiryDate forKey:@"expiryDate"];
   [response setObject:cardSaleResponseData.ServiceCode forKey:@"serviceCode"];
   [response setObject:cardSaleResponseData.ApplicationName forKey:@"applicationName"];
   [response setObject:cardSaleResponseData.isPin?@"true":@"false" forKey:@"isPin"];
   [response setObject:@"" forKey:@"signatureRequired"];
   [response setObject:@"" forKey:@"tlvData"];
   [response setObject:@"" forKey:@"EPBKsn"];
   [response setObject:@"" forKey:@"EPB"];
   [response setObject:@"" forKey:@"paddingInfo"];
   [response setObject:@"" forKey:@"isAllowFallBack"];
   [response setObject:@"" forKey:@"exceptionStackTrace"];
   [response setObject:cardSaleResponseData.ResponseStatus?@"true":@"false" forKey:@"responseStatus"];

  
}

- (void)onTransactionFailure:(NSMutableDictionary *)error{
  error[@"success"]=false;
  [self.delegate onRefundFailure:error];
}
@end
