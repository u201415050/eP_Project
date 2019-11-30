//
//  CardPayment.m
//  project_1
//
//  Created by Dharmita Bhatt on 4/11/19.
//  Copyright © 2019 Facebook. All rights reserved.
//

#import "CardPayment.h"
#import "EncryptHelper.h"

@implementation CardPayment{
   
   NSMutableDictionary *transactionRequest;
}
RCT_EXPORT_MODULE();

RCT_EXPORT_METHOD(startTransaction:(NSDictionary*) request :(RCTResponseSenderBlock)callback)
{
  //processor id for mSwipe is 10
    if([request[@"processorId"] isEqualToNumber:[NSNumber numberWithInt:10]]) {
      self.transactionCallback=callback;
      transactionRequest=[request mutableCopy];
      EncryptHelper  *enchelper = [[EncryptHelper alloc] init];
      [transactionRequest setObject:[enchelper doCipher:transactionRequest[@"userName"] enc:kCCDecrypt] forKey:@"userName"];
      [transactionRequest setObject:[enchelper doCipher:transactionRequest[@"password"] enc:kCCDecrypt] forKey:@"password"];
      
      MswipeTransaction* mSwipeTransaction=[[MswipeTransaction alloc]init];
      mSwipeTransaction.delegate=self;
      [mSwipeTransaction startTransaction:self->transactionRequest];
    }else{
      NSMutableDictionary *dict = @{@"success":@false,@"errorCode" : @"CP_002", @"errorMessage" : @"No Processor Found"};
      [self onTransactionFailure:dict];
    }
 
}

//
- (void)onTrasactionSuccess:(NSMutableDictionary *)response{
  NSArray *array = @[response];
  self.transactionCallback(array);
}

- (void)onTransactionFailure:(NSMutableDictionary *)error{
  NSArray *array = @[error];
  NSLog(@"THE ERROR: %@",error);
  // transactionCallback(array);
  self.transactionCallback(array);
}
@end
