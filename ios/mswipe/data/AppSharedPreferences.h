//
//  AppSharedPreferencesh
//  MSWisePadWebRocket
//
//  Created by satish reddy on 6/14/16.
//  Copyright © 2016 Mwsipe. All rights reserved.
//

#import <Foundation/Foundation.h>
#import "MSWisepadController.h"



@interface AppSharedPreferences : NSObject
{
}

+ (void) setGatewayType:(GatewayEnvironment) gatewayType;
+ (GatewayEnvironment) getGatewayType;

+ (void) setSessionToken:(NSString *)sessionToken;
+ (NSString*) getSessionToken;

+ (void) setReferenceId:(NSString *)referenceId;
+ (NSString*) getReferenceId;

+ (void) setIMeiNo:(NSString *)imeiNo;
+ (NSString*) getIMeiNo;

+ (void) setUserId:(NSString *) userId;
+ (NSString*) getUserId;

+ (void) setUserName: (NSString*) userName;
+ (NSString*) getUserName;

+ (void) setMerchantName: (NSString*) merchantName;
+ (NSString*) getMerchantName;

+ (void) setMerchantAddress: (NSString*) merchantAddress;
+ (NSString*) getMerchantAddress;

+ (void) setMID: (NSString*) mid;
+ (NSString*) getMID;

+ (void) setTID: (NSString*) tid;
+ (NSString*) getTID;

+ (void) setBusinessName: (NSString*) businessName;
+ (NSString*) getBusinessName;

+ (void) setAddress: (NSString*) address;
+ (NSString*) getAddress;

+ (void) setMerchantBankName: (NSString*) merchantBankName;
+ (NSString*) getMerchantBankName;

+ (void) setMerchantAccNo: (NSString*) merchantAccNo;
+ (NSString*) getMerchantAccNo;

+ (NSString*) getCurrency;
+ (void) setCurrency : (NSString*) currency;

+ (Boolean) getTipEnabled;
+ (void) setTipEnabled : (Boolean) pinBypass;

+ (Boolean) getReceiptEnabled;
+ (void) setReceiptEnabled : (Boolean) tipEnabled;

+ (Boolean) getCashEnabled;
+ (void) setCashEnabled : (Boolean) cashEnabled;

+ (void) setConvenienceFees: (float) conveniencefees;
+ (float) getConvenienceFees;

+ (void) setServerTax: (float) servicetax;
+ (float) getServerTax;

+ (NSString*) getLastConnectedBTv4DeviceName;
+ (void) setLastConnectedBTv4DeviceName: (NSString*) deviceNmae;

+ (Boolean) getPinBypass;
+ (void) setPinBypass : (Boolean) pinBypass;

+ (Boolean) getPreauthEnabled;
+ (void) setPreauthEnabled : (Boolean) preauthEnabled;

+ (Boolean) getEMIEnabled;
+ (void) setEMIEnabled : (Boolean) EMIEnabled;

+ (Boolean) getSaleWithCashEnabled;
+ (void) setSaleWithCashEnabled : (Boolean) saleWithCashEnabled;

+ (Boolean) getCashSaleEnabled;
+ (void) setCashSaleEnabled : (Boolean) cashSaleEnabled;

+ (Boolean) getVoidEnabled;
+ (void) setVoidEnabled : (Boolean) voidEnabled;

+ (Boolean) getRefundEnabled;
+ (void) setRefundEnabled : (Boolean) refundEnabled;

+ (Boolean) getPrinterSupport;
+ (void) setPrinterSupport: (Boolean) printerSupport;

+ (Boolean) getPrinterSignature;
+ (void) setPrinterSignature: (Boolean) printerSignature;

+ (NSString*) getDeviceSerialNumber;
+ (void) setDeviceSerialNumber: (NSString*) deviceNmae;




@end


