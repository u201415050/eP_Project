//
//  MSSignatureReceiptView.h
//  MswipeWisepad
//
//  Created by satish reddy on 9/26/14.
//  Copyright (c) 2014 Mswipe. All rights reserved.
//

#import <UIKit/UIKit.h>
#import "CardSaleResponseData.h"
#import "CashSaleResponseData.h"

@interface MSSignatureReceiptView : UIView
{
}

- (void) clear;
- (UIImage*) renderSingature : (int) width;
- (NSData*) renderSignatureData;
- (BOOL) isSignatureDrawn;


- (void) setCardSaleResponsedata : (CardSaleResponseData*) cardSaleResponseData;
- (void) setCashSaleResponsedata : (CashSaleResponseData*) cashSaleResponseData;

@end
