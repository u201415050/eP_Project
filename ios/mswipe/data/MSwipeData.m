//
//  MSwipeData.m
//  Mswipe-EMV
//
//  Created by satish reddy on 11/3/13.
//
//

#import "MSwipeData.h"
#import "AppDelegate.h"
#import "AppSharedPreferences.h"

#define log_tab @"MswipeData"

@implementation MSwipeData

- (void)dealloc {}


-(bool) saveMSConfigDetails
{
    return YES;
}


+ (void) clearMSDataPreferences 
{
   

    Boolean printerSupport = [AppSharedPreferences getPrinterSupport];
    Boolean printsignature = [AppSharedPreferences getPrinterSignature];
  

    /*
    as need to clear the all the stored data
     */
    NSUserDefaults * defs = [NSUserDefaults standardUserDefaults];
    NSDictionary * dict = [defs dictionaryRepresentation];
    for (id key in dict) {
        [defs removeObjectForKey:key];
    }
    [defs synchronize];
    

   /*
    as required to keep printer settings after logout
     */

    [AppSharedPreferences setPrinterSupport :(printerSupport)];
    [AppSharedPreferences setPrinterSignature :(printsignature)];

    
    
}


+ (void) saveLoginPreferences : (LoginResponseData*) loginResponseData 
{
    
    [AppSharedPreferences setUserName: loginResponseData.firstName];
    [AppSharedPreferences setReferenceId: loginResponseData.referenceId];
    [AppSharedPreferences setSessionToken: loginResponseData.sessionTokeniser];
   
    [AppSharedPreferences setMerchantAccNo: loginResponseData.merchantAccNo];
    [AppSharedPreferences setMerchantName: loginResponseData.merchantName];
    [AppSharedPreferences setMerchantAddress: loginResponseData.merchantAddress];
    [AppSharedPreferences setMerchantBankName: loginResponseData.merchantBankName];
    [AppSharedPreferences setMID: loginResponseData.MID];
    [AppSharedPreferences setTID: loginResponseData.TID];
    [AppSharedPreferences setAddress: loginResponseData.merchantAddress];
    
    [AppSharedPreferences setCurrency: [loginResponseData.currency lowercaseString]];
    [AppSharedPreferences setTipEnabled: loginResponseData.tipsRequired];
    [AppSharedPreferences setReceiptEnabled: loginResponseData.receiptRequired];
    [AppSharedPreferences setCashEnabled: loginResponseData.cashSaleEnabled];
    
    [AppSharedPreferences setPreauthEnabled: loginResponseData.preauthEnabled];
    [AppSharedPreferences setEMIEnabled: loginResponseData.emiEnabled];
    [AppSharedPreferences setSaleWithCashEnabled: loginResponseData.saleWithCashEnabled];
    [AppSharedPreferences setCashSaleEnabled: loginResponseData.cashSaleEnabled];
    [AppSharedPreferences setVoidEnabled: loginResponseData.voidEnabled];
    [AppSharedPreferences setRefundEnabled: loginResponseData.refundEnabled];
        
    [AppSharedPreferences setConvenienceFees : loginResponseData.conveniencePercentage ];
    [AppSharedPreferences setServerTax: loginResponseData.serviceTax ];
    [AppSharedPreferences setPinBypass: loginResponseData.pinBypass];

    
}


@end
