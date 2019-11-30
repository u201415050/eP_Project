//
//  MswipeTransactionHelper.m
//  project_1
//
//  Created by Dharmita Bhatt on 4/11/19.
//  Copyright © 2019 Facebook. All rights reserved.
//

#import "MswipeTransactionHelper.h"
#import "AppSharedPreferences.h"

@implementation MswipeTransactionHelper

- (void)doTransaction:(NSMutableDictionary *) data{
  self.requestData=data;
  NSLog(@"MswipeTransactionHelper doTransaction %@", [data description]);
  [[MSWisepadController sharedInstance] processCardSaleOnline : [AppSharedPreferences getReferenceId]
                                            aSessionTokeniser : [AppSharedPreferences getSessionToken]
                                                      aAmount : self.requestData[@"amount"]
                                                   aTipAmount : @"0.00"
                                                    aMobileNo :@""
                                                   aInvoiceNo : self.requestData[@"transactionId"]
                                                       aEmail : @""
                                                        aNotes: @""
                                                aIsTipEnabled : [AppSharedPreferences getTipEnabled]
                                            aIsReceiptEnabled : [AppSharedPreferences getReceiptEnabled]
                                            aAmexSecurityCode : @""
                                    aConveniencefeePercentage : [AppSharedPreferences getConvenienceFees]
                                        aServiceTaxPercentage : [AppSharedPreferences getServerTax]
                                                aExtraNoteOne : @""
                                                aExtraNoteTwo : @""
                                              aExtraNoteThree : @""
                                               aExtraNoteFour : @""
                                               aExtraNoteFive : @""
                                                aExtraNoteSix : @""
                                              aExtraNoteSeven : @""
                                              aExtraNoteEight : @""
                                               aExtraNoteNine : @""
                                                aExtraNoteTen : @""
                     aMswipeWisepadControllerResponseListener : self];
  
}
- (void)onResponseData:(id)data {
   CardSaleResponseData* response = (CardSaleResponseData*) data;
  NSLog(@"THE RESPONSE: %@", response);
  if(response.ResponseStatus){
    NSLog(@"MswipeTransactionHelper doTransaction Success");
      [self.delegate onTrasactionSuccess:response];
  }else{
     NSLog(@"MswipeTransactionHelper doTransaction Failure");
    NSMutableDictionary *dict = @{ @"errorCode" : response.ErrorCode, @"errorMessage" : response.ResponseFailureReason};
    [self.delegate onTransactionFailure:dict];
  }
}

@end
