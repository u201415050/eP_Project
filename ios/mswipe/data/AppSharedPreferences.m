//
//  AppSharedPreferences.m
//  MSWisePadWebRocket
//
//  Created by satish reddy on 6/14/16.
//  Copyright © 2016 Mwsipe. All rights reserved.
//

#import "AppSharedPreferences.h"
#define log_tab @""

@implementation AppSharedPreferences


+ (void) setGatewayType:(GatewayEnvironment) gatewayType
{
    
    [[NSUserDefaults standardUserDefaults] setObject:@(gatewayType) forKey:@"gatewayType"];
    [[NSUserDefaults standardUserDefaults] synchronize];
}

+ (GatewayEnvironment) getGatewayType
{
    return (GatewayEnvironment)[[NSUserDefaults standardUserDefaults]  integerForKey:@"gatewayType"];
    
}


+ (void) setSessionToken:(NSString *)sessionToken
{

    [[NSUserDefaults standardUserDefaults] setObject:sessionToken
            forKey:@"sessiontoken"];
    [[NSUserDefaults standardUserDefaults] synchronize];
}

+ (NSString*) getSessionToken
{
    return [[NSUserDefaults standardUserDefaults] 
            stringForKey:@"sessiontoken"];
}


+ (void) setReferenceId:(NSString *)referenceId
{

    [[NSUserDefaults standardUserDefaults] setObject:referenceId 
            forKey:@"referenceid"];
    [[NSUserDefaults standardUserDefaults] synchronize];
}

+ (NSString*) getReferenceId
{
    return [[NSUserDefaults standardUserDefaults] 
            stringForKey:@"referenceid"];
}

+ (void) setIMeiNo:(NSString *)imeiNo
{

    [[NSUserDefaults standardUserDefaults] setObject:imeiNo 
            forKey:@"imeiNo"];
    [[NSUserDefaults standardUserDefaults] synchronize];
}

+ (NSString*) getIMeiNo
{
    return [[NSUserDefaults standardUserDefaults] 
            stringForKey:@"imeiNo"];
}


+ (void) setUserId:(NSString *) userId
{

    [[NSUserDefaults standardUserDefaults] setObject:userId 
            forKey:@"userId"];
    [[NSUserDefaults standardUserDefaults] synchronize];
}

+ (NSString*) getUserId
{
    return [[NSUserDefaults standardUserDefaults] 
            stringForKey:@"userId"];
}


+ (Boolean) getPinBasedUserLogin
{
    return [[NSUserDefaults standardUserDefaults] boolForKey: @"pinBasedUserLogin"];
    
}
+ (void) setPinBasedUserLogin : (Boolean) pinBasedUserLogin
{
    [[NSUserDefaults standardUserDefaults] setBool: pinBasedUserLogin forKey:@"pinBasedUserLogin"];
    [[NSUserDefaults standardUserDefaults] synchronize];
    
}

+ (void) setUserName: (NSString*) userName
{

    [[NSUserDefaults standardUserDefaults] setObject:userName  
            forKey:@"userName"];
    [[NSUserDefaults standardUserDefaults] synchronize];
}

+ (NSString*) getUserName
{
    
    return [[NSUserDefaults standardUserDefaults] 
            stringForKey:@"userName"];
}


+ (void) setMerchantName: (NSString*) merchantName
{
    [[NSUserDefaults standardUserDefaults] setObject:merchantName forKey:@"merchantName"];
    [[NSUserDefaults standardUserDefaults] synchronize];
}

+ (NSString*) getMerchantName
{
    return [[NSUserDefaults standardUserDefaults] stringForKey: @"merchantName"];
}


+ (void) setMerchantAddress: (NSString*) merchantAddress
{
    [[NSUserDefaults standardUserDefaults] setObject:merchantAddress forKey:@"merchantAddress"];
    [[NSUserDefaults standardUserDefaults] synchronize];
}


+ (void) setMerchantBankName: (NSString*) merchantBankName
{
    [[NSUserDefaults standardUserDefaults] setObject:merchantBankName forKey:@"merchantBankName"];
    [[NSUserDefaults standardUserDefaults] synchronize];
}

+ (NSString*) getMerchantBankName
{
    return [[NSUserDefaults standardUserDefaults] stringForKey: @"merchantBankName"];
}

+ (void) setMerchantAccNo: (NSString*) merchantAccNo
{
    [[NSUserDefaults standardUserDefaults] setObject:merchantAccNo forKey:@"merchantAccNo"];
    [[NSUserDefaults standardUserDefaults] synchronize];
}

+ (NSString*) getMerchantAccNo
{
    return [[NSUserDefaults standardUserDefaults] stringForKey: @"merchantAccNo"];
}

+ (NSString*) getMerchantAddress
{
    return [[NSUserDefaults standardUserDefaults] stringForKey: @"merchantAddress"];
}


+ (void) setMID: (NSString*) mid
{
    [[NSUserDefaults standardUserDefaults] setObject:mid forKey:@"mid"];
    [[NSUserDefaults standardUserDefaults] synchronize];
}

+ (NSString*) getMID
{
    return [[NSUserDefaults standardUserDefaults] stringForKey: @"mid"];
}


+ (void) setTID: (NSString*) tid
{
    [[NSUserDefaults standardUserDefaults] setObject:tid forKey:@"tid"];
    [[NSUserDefaults standardUserDefaults] synchronize];
}

+ (NSString*) getTID
{
    return [[NSUserDefaults standardUserDefaults] stringForKey: @"tid"];
}


+ (void) setBusinessName: (NSString*) businessName
{
    [[NSUserDefaults standardUserDefaults] setObject:businessName forKey:@"businessName"];
    [[NSUserDefaults standardUserDefaults] synchronize];
}

+ (NSString*) getBusinessName
{
    return [[NSUserDefaults standardUserDefaults] stringForKey: @"businessName"];
}


+ (void) setAddress: (NSString*) address
{
    [[NSUserDefaults standardUserDefaults] setObject:address forKey:@"address"];
    [[NSUserDefaults standardUserDefaults] synchronize];
}

+ (NSString*) getAddress
{
    return [[NSUserDefaults standardUserDefaults] stringForKey: @"address"];
}

+ (NSString*) getCurrency
{
    return [[NSUserDefaults standardUserDefaults] stringForKey: @"currency"];
}
+ (void) setCurrency: (NSString*) currency
{
    [[NSUserDefaults standardUserDefaults] setObject:currency  forKey:@"currency"];
    [[NSUserDefaults standardUserDefaults] synchronize];
}


+ (Boolean) getTipEnabled
{
    return [[NSUserDefaults standardUserDefaults] boolForKey: @"tipenabled"];

}
+ (void) setTipEnabled : (Boolean) tipEnabled
{
    [[NSUserDefaults standardUserDefaults] setBool: tipEnabled forKey:@"tipenabled"];
    [[NSUserDefaults standardUserDefaults] synchronize];

}

+ (Boolean) getCashEnabled
{
    return [[NSUserDefaults standardUserDefaults] boolForKey: @"cashenabled"];

}
+ (void) setCashEnabled : (Boolean) cashEnabled
{
    [[NSUserDefaults standardUserDefaults] setBool: cashEnabled forKey:@"cashenabled"];
    [[NSUserDefaults standardUserDefaults] synchronize];

}

+ (Boolean) getReceiptEnabled
{
    return [[NSUserDefaults standardUserDefaults] boolForKey: @"receiptenabled"];

}
+ (void) setReceiptEnabled : (Boolean) tipEnabled
{
    [[NSUserDefaults standardUserDefaults] setBool: tipEnabled forKey:@"receiptenabled"];
    [[NSUserDefaults standardUserDefaults] synchronize];

}

+ (void) setConvenienceFees: (float) conveniencefees
{

    [[NSUserDefaults standardUserDefaults] setFloat: conveniencefees
            forKey:@"conveniencefees"];
    [[NSUserDefaults standardUserDefaults] synchronize];
}

+ (float) getConvenienceFees
{
    return [[NSUserDefaults standardUserDefaults] 
            floatForKey:@"conveniencefees"];
}


+ (void) setServerTax: (float) servicetax
{

    [[NSUserDefaults standardUserDefaults] setInteger:servicetax  
            forKey:@"servicetax"];
    [[NSUserDefaults standardUserDefaults] synchronize];
}

+ (float) getServerTax
{
    return [[NSUserDefaults standardUserDefaults] 
            integerForKey:@"servicetax"];
}

+ (Boolean) getPinBypass
{
    return [[NSUserDefaults standardUserDefaults] 
            boolForKey: @"pinbypass"];

}

+ (void) setPinBypass : (Boolean) pinBypass
{
    [[NSUserDefaults standardUserDefaults] setBool:pinBypass  
            forKey:@"pinbypass"];
    [[NSUserDefaults standardUserDefaults] synchronize];
}

+ (NSString*) getLastConnectedBTv4DeviceName
{
    return [[NSUserDefaults standardUserDefaults] 
            stringForKey: @"lastConnectedBTv4DeviceName"];
}

+ (void) setLastConnectedBTv4DeviceName: (NSString*) deviceNmae
{
    [[NSUserDefaults standardUserDefaults] setObject:deviceNmae  
            forKey:@"lastConnectedBTv4DeviceName"];
    [[NSUserDefaults standardUserDefaults] synchronize];
}

+ (NSString*) getDeviceSerialNumber
{
  return [[NSUserDefaults standardUserDefaults]
          stringForKey: @"deviceSerialNumber"];
}

+ (void) setDeviceSerialNumber: (NSString*) deviceNmae
{
  [[NSUserDefaults standardUserDefaults] setObject:deviceNmae
                                            forKey:@"deviceSerialNumber"];
  [[NSUserDefaults standardUserDefaults] synchronize];
}


+ (Boolean) getPreauthEnabled
{
    return [[NSUserDefaults standardUserDefaults] boolForKey: @"preauthenabled"];
}

+ (void) setPreauthEnabled : (Boolean) preauthEnabled
{
    [[NSUserDefaults standardUserDefaults] setBool: preauthEnabled forKey:@"preauthenabled"];
    [[NSUserDefaults standardUserDefaults] synchronize];
}

+ (Boolean) getEMIEnabled
{
    return [[NSUserDefaults standardUserDefaults] boolForKey: @"emienabled"];
    
}
+ (void) setEMIEnabled : (Boolean) EMIEnabled
{
    [[NSUserDefaults standardUserDefaults] setBool: EMIEnabled forKey:@"emienabled"];
    [[NSUserDefaults standardUserDefaults] synchronize];
}


+ (Boolean) getSaleWithCashEnabled
{
    return [[NSUserDefaults standardUserDefaults] boolForKey: @"salewithcashenabled"];
    
}
+ (void) setSaleWithCashEnabled : (Boolean) saleWithCashEnabled
{
    [[NSUserDefaults standardUserDefaults] setBool: saleWithCashEnabled forKey:@"salewithcashenabled"];
    [[NSUserDefaults standardUserDefaults] synchronize];
    
}

+ (Boolean) getCashSaleEnabled
{
    return [[NSUserDefaults standardUserDefaults] boolForKey: @"cashsaleenabled"];
    
}
+ (void) setCashSaleEnabled : (Boolean) cashSaleEnabled
{
    [[NSUserDefaults standardUserDefaults] setBool: cashSaleEnabled forKey:@"cashsaleenabled"];
    [[NSUserDefaults standardUserDefaults] synchronize];
    
}

+ (Boolean) getVoidEnabled
{
    return [[NSUserDefaults standardUserDefaults] boolForKey: @"voidenabled"];
    
}
+ (void) setVoidEnabled : (Boolean) voidEnabled
{
    [[NSUserDefaults standardUserDefaults] setBool: voidEnabled forKey:@"voidenabled"];
    [[NSUserDefaults standardUserDefaults] synchronize];
}

+ (Boolean) getRefundEnabled
{
    return [[NSUserDefaults standardUserDefaults] boolForKey: @"refundenabled"];
    
}

+ (void) setRefundEnabled : (Boolean) refundEnabled
{
    [[NSUserDefaults standardUserDefaults] setBool: refundEnabled forKey:@"refundenabled"];
    [[NSUserDefaults standardUserDefaults] synchronize];
}

+ (Boolean) getPrinterSupport
{
    return [[NSUserDefaults standardUserDefaults] boolForKey: @"printersupport"];
}
+ (void) setPrinterSupport: (Boolean) printerSupport
{
    [[NSUserDefaults standardUserDefaults] setBool:printerSupport  forKey:@"printersupport"];
    [[NSUserDefaults standardUserDefaults] synchronize];
}

+ (Boolean) getPrinterSignature
{
    return [[NSUserDefaults standardUserDefaults] boolForKey: @"printersignature"];
}

+ (void) setPrinterSignature: (Boolean) printerSignature
{
    [[NSUserDefaults standardUserDefaults] setBool:printerSignature  forKey:@"printersignature"];
    [[NSUserDefaults standardUserDefaults] synchronize];
}



@end
