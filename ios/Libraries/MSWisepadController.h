//
//  NSObject+MswipeController.h
//  MswipeWisepadSDK
//
//  Created by satish reddy on 12/29/14.
//  Copyright (c) 2014 Mswipe. All rights reserved.
//

#import <Foundation/Foundation.h>
typedef enum
{
    GatewayEnvironment_DEVELOPMENT,
    GatewayEnvironment_LIVE,
    
} GatewayEnvironment;
#import "MSSignatureReceiptView.h"
#import "CardSaleResponseData.h"
#import "CashSaleResponseData.h"


@protocol MSWisepadControllerResponseListener <NSObject>

-(void) onResponseData :(id) data;

@end


@interface MSWisepadController : NSObject
{

}

+ (id)sharedInstance;

+ (id)sharedInstance:(GatewayEnvironment) gatewayEnvironment
aMSGatewayConnectionListener: (id) aMSGatewayConnectionListener;



- (void) setGatewayEnvironment:(GatewayEnvironment) gatewayEnvironment;
- (GatewayEnvironment) getGatewayEnvironment;
- (NSString*) getNetworkSourceId;
- (void) startMSGatewayConnection;
    
- (void) stopMSGatewayConnection;

- (void) authenticateMerchant :(NSString*) aMerchantId aMerchantPassword : (NSString*) aMerchantPassword
            aMswipeWisepadControllerResponseListener : (id) aMswipeWisepadControllerResponseListener;

- (void) authenticateNonPinBasedMerchant :(NSString*) aMerchantId aMerchantPassword : (NSString*) aMerchantPassword
            aMswipeWisepadControllerResponseListener : (id) aMswipeWisepadControllerResponseListener;

- (void) changePassword :(NSString*) aMerchantId aSessionTokeniser : (NSString*) aSessionTokeniser
            aPassword : (NSString*) aPassword aNewPassword : (NSString*) aNewPassword 
            aMswipeWisepadControllerResponseListener : (id) aMswipeWisepadControllerResponseListener;

- (void) getLastTransactionDetails :(NSString*) aMerchantId aSessionTokeniser : (NSString*) aSessionTokeniser
            aMswipeWisepadControllerResponseListener : (id) aMswipeWisepadControllerResponseListener;

- (void) processResendReceipt : (NSString*) aMerchantID
                 aSessionToken: (NSString*) aSessionToken
                       aAmount: (NSString*) aAmount
           aCardLastFourDigits: (NSString*) aCardLastFourDigits
                       aStanNo: (NSString*) aStanNo
    aMswipeWisepadControllerResponseListener : (id) aMswipeWisepadControllerResponseListener;


- (void) processCardSaleOnline :(NSString*) aReferenceId
             aSessionTokeniser :(NSString*) aSessionTokeniser
                       aAmount :(NSString*) aAmount
                    aTipAmount :(NSString*) aTipAmount
                     aMobileNo :(NSString*) aMobileNo
                    aInvoiceNo :(NSString*) aInvoiceNo
                        aEmail :(NSString*) aEmail
                        aNotes :(NSString*) aNotes
                 aIsTipEnabled :(Boolean) aIsTipEnabled
             aIsReceiptEnabled :(Boolean) aIsReceiptEnabled
             aAmexSecurityCode :(NSString*) aAmexSecurityCode
     aConveniencefeePercentage :(float) aConveniencefeePercentage
         aServiceTaxPercentage :(float) aServiceTaxPercentage
                 aExtraNoteOne :(NSString*) aExtraNoteOne
                 aExtraNoteTwo :(NSString*) aExtraNoteTwo
               aExtraNoteThree :(NSString*) aExtraNoteThree
                aExtraNoteFour :(NSString*) aExtraNoteFour
                aExtraNoteFive :(NSString*) aExtraNoteFive
                 aExtraNoteSix :(NSString*) aExtraNoteSix
               aExtraNoteSeven :(NSString*) aExtraNoteSeven
               aExtraNoteEight :(NSString*) aExtraNoteEight
                aExtraNoteNine :(NSString*) aExtraNoteNine
                 aExtraNoteTen :(NSString*) aExtraNoteTen
aMswipeWisepadControllerResponseListener : (id) aMswipeWisepadControllerResponseListener;



- (void) processEMISaleOnline :(NSString*) aReferenceId
            aSessionTokeniser :(NSString*) aSessionTokeniser
                      aAmount :(NSString*) aAmount
                   aTipAmount :(NSString*) aTipAmount
                    aMobileNo :(NSString*) aMobileNo
                   aInvoiceNo :(NSString*) aInvoiceNo
                       aEmail :(NSString*) aEmail
                       aNotes :(NSString*) aNotes
                aIsTipEnabled :(Boolean) aIsTipEnabled
            aIsReceiptEnabled :(Boolean) aIsReceiptEnabled
            aAmexSecurityCode :(NSString*) aAmexSecurityCode
                 aEmiBankCode :(NSString*) aEmiBankCode
                   aEmiPeriod :(NSString*) aEmiPeriod
aMswipeWisepadControllerResponseListener : (id) aMswipeWisepadControllerResponseListener;


- (void) processPreauthSaleOnline :(NSString*) aReferenceId
                aSessionTokeniser :(NSString*) aSessionTokeniser
                          aAmount :(NSString*) aAmount
                       aTipAmount :(NSString*) aTipAmount
                        aMobileNo :(NSString*) aMobileNo
                       aInvoiceNo :(NSString*) aInvoiceNo
                           aEmail :(NSString*) aEmail
                           aNotes :(NSString*) aNotes
                    aIsTipEnabled :(Boolean) aIsTipEnabled
                aIsReceiptEnabled :(Boolean) aIsReceiptEnabled
                aAmexSecurityCode :(NSString*) aAmexSecurityCode
aMswipeWisepadControllerResponseListener : (id) aMswipeWisepadControllerResponseListener;


- (void) processSaleWithCashOnline :(NSString*) aReferenceId
                 aSessionTokeniser :(NSString*) aSessionTokeniser
                           aAmount :(NSString*) aAmount
                        aTipAmount :(NSString*) aTipAmount
                         aMobileNo :(NSString*) aMobileNo
                        aInvoiceNo :(NSString*) aInvoiceNo
                            aEmail :(NSString*) aEmail
                            aNotes :(NSString*) aNotes
                     aIsTipEnabled :(Boolean) aIsTipEnabled
                 aIsReceiptEnabled :(Boolean) aIsReceiptEnabled
                 aAmexSecurityCode :(NSString*) aAmexSecurityCode
                   aSaleCashAmount :(NSString*) aSaleCashAmount
aMswipeWisepadControllerResponseListener : (id) aMswipeWisepadControllerResponseListener;

- (void) processUPISaleOnline :(NSString*) aReferenceId
            aSessionTokeniser : (NSString*) aSessionTokeniser
                      aAmount : (NSString*) aAmount
                   aTipAmount : (NSString*) aTipAmount
                    aMobileNo :(NSString*) aMobileNo
                   aInvoiceNo :(NSString*) aInvoiceNo
                       aEmail : (NSString*) aEmail
                       aNotes : (NSString*) aNotes
                aIsTipEnabled : (Boolean) aIsTipEnabled
            aIsReceiptEnabled : (Boolean) aIsReceiptEnabled
            aAmexSecurityCode :(NSString*) aAmexSecurityCode
aMswipeWisepadControllerResponseListener : (id) aMswipeWisepadControllerResponseListener;

- (void) processMChargeSaleOnline : (NSString*) aReferenceId
                aSessionTokeniser : (NSString*) aSessionTokeniser
                          aAmount : (NSString*) aAmount
                       aTipAmount : (NSString*) aTipAmount
                        aMobileNo : (NSString*) aMobileNo
                       aInvoiceNo : (NSString*) aInvoiceNo
                           aEmail : (NSString*) aEmail
                           aNotes : (NSString*) aNotes
                    aIsTipEnabled : (Boolean) aIsTipEnabled
                aIsReceiptEnabled : (Boolean) aIsReceiptEnabled
                aAmexSecurityCode : (NSString*) aAmexSecurityCode
                  aMchargeTopUpId : (NSString*) aMchargeTopUpId
                aMchargeSessionId : (NSString*) aMchargeSessionId
                 aMchargeMobileNo : (NSString*) aMchargeMobileNo
aMswipeWisepadControllerResponseListener : (id) aMswipeWisepadControllerResponseListener;

- (void) processCardSaleReceipt : (NSString*) aReferenceId
              aSessionTokeniser : (NSString*) aSessionTokeniser
          aCardSaleResponseData : (CardSaleResponseData*) aCardSaleResponseData
       aMSSignatureReceiptView  : (MSSignatureReceiptView*) aMSSignatureReceiptView
aMswipeWisepadControllerResponseListener : (id) aMswipeWisepadControllerResponseListener;


- (void) getEMISaleOptionsDetails :(NSString*) aMerchantId
                aSessionTokeniser :(NSString*) aSessionTokeniser
                        trxAmount :(NSString*) trxAmount
                     first6Digits :(NSString*) first6Digits
aMswipeWisepadControllerResponseListener : (id) aMswipeWisepadControllerResponseListener;


- (void) getCardSaleTrxDetails :(NSString*) aMerchantId
             aSessionTokeniser :(NSString*) aSessionTokeniser
                       trxDate :(NSString*) trxDate
                     trxAmount :(NSString*) trxAmount
                   last4Digits :(NSString*) last4Digits
aMswipeWisepadControllerResponseListener : (id) aMswipeWisepadControllerResponseListener;

- (void) processVoidTransaction :(NSString*) aMerchantId
              aSessionTokeniser :(NSString*) aSessionTokeniser
                        trxDate :(NSString*) trxDate
                      trxAmount :(NSString*) trxAmount
                    last4Digits :(NSString*) last4Digits
                         stanId :(NSString*) stanId
                      voucherNo :(NSString*) voucherNo
aMswipeWisepadControllerResponseListener : (id) aMswipeWisepadControllerResponseListener;

- (void) getCardSaleTrxDetailsWithOTP :(NSString*) aMerchantId
                   aSessionTokeniser :(NSString*) aSessionTokeniser
                             trxDate :(NSString*) trxDate
                           trxAmount :(NSString*) trxAmount
                         last4Digits :(NSString*) last4Digits
aMswipeWisepadControllerResponseListener : (id) aMswipeWisepadControllerResponseListener;

- (void) initiateVoidTransactionWithOTP :(NSString*) aMerchantId
                      aSessionTokeniser :(NSString*) aSessionTokeniser
aMswipeWisepadControllerResponseListener : (id) aMswipeWisepadControllerResponseListener;

- (void) processVoidTransactionWithOTP :(NSString*) aMerchantId
                     aSessionTokeniser :(NSString*) aSessionTokeniser
                               trxDate :(NSString*) trxDate
                             trxAmount :(NSString*) trxAmount
                           last4Digits :(NSString*) last4Digits
                                stanId :(NSString*) stanId
                             voucherNo :(NSString*) voucherNo
                                   otp :(NSString*) otp
aMswipeWisepadControllerResponseListener : (id) aMswipeWisepadControllerResponseListener;


- (void) getPreauthSaleTrxDetails :(NSString*) aMerchantId
                aSessionTokeniser :(NSString*) aSessionTokeniser
                          trxDate :(NSString*) trxDate
                        trxAmount :(NSString*) trxAmount
                      last4Digits :(NSString*) last4Digits
aMswipeWisepadControllerResponseListener : (id) aMswipeWisepadControllerResponseListener;


- (void) processPreauthComplete :(NSString*) aMerchantId
              aSessionTokeniser :(NSString*) aSessionTokeniser
                        trxDate :(NSString*) trxDate
                      trxAmount :(NSString*) trxAmount
                    last4Digits :(NSString*) last4Digits
                         stanId :(NSString*) stanId
                      voucherNo :(NSString*) voucherNo
                 prismInvoiceNo :(NSString*) prismInvoiceNo
aMswipeWisepadControllerResponseListener : (id) aMswipeWisepadControllerResponseListener;


- (void) getCardHistory :(NSString*) aMerchantId
                aSessionTokeniser :(NSString*) aSessionTokeniser
aMswipeWisepadControllerResponseListener : (id) aMswipeWisepadControllerResponseListener;


- (void) getMVisaHistory :(NSString*) aMerchantId
                 aSessionTokeniser :(NSString*) aSessionTokeniser
aMswipeWisepadControllerResponseListener : (id) aMswipeWisepadControllerResponseListener;

- (void) getCashHistory :(NSString*) aMerchantId
                aSessionTokeniser :(NSString*) aSessionTokeniser
aMswipeWisepadControllerResponseListener : (id) aMswipeWisepadControllerResponseListener;


- (void) getBankHistory :(NSString*) aMerchantId
                aSessionTokeniser :(NSString*) aSessionTokeniser
aMswipeWisepadControllerResponseListener : (id) aMswipeWisepadControllerResponseListener;


- (void) getCaatHistory :(NSString*) aMerchantId
                aSessionTokeniser :(NSString*) aSessionTokeniser
aMswipeWisepadControllerResponseListener : (id) aMswipeWisepadControllerResponseListener;


-(void) processCashSale: (NSString*) aMerchantId
      aSessionTokeniser: (NSString*) aSessionTokeniser
               aReceipt: (NSString*) aReceipt
                aAmount: (NSString*) aAmount
               aPhoneNo: (NSString*) aPhoneNo
                 aEmail: (NSString*) aEmail
                 aNotes: (NSString*) aNotes
aMswipeWisepadControllerResponseListener : (id) aMswipeWisepadControllerResponseListener;


-(void) processBankSale: (NSString*) aMerchantId
      aSessionTokeniser: (NSString*) aSessionTokeniser
               aReceipt: (NSString*) aReceipt
                aAmount: (NSString*) aAmount
               aPhoneNo: (NSString*) aPhoneNo
                 aEmail: (NSString*) aEmail
                 aNotes: (NSString*) aNotes
              aChequeNo: (NSString*) aChequeNo
            aChequeDate: (NSString*) aChequeDate
aMswipeWisepadControllerResponseListener : (id) aMswipeWisepadControllerResponseListener;


- (void) getCardSummary :(NSString*) aMerchantId
              aSessionTokeniser :(NSString*) aSessionTokeniser
              aDate :(NSString*) aDate
                  aMswipeWisepadControllerResponseListener : (id) aMswipeWisepadControllerResponseListener;

- (void) getMVisaSummary :(NSString*) aMerchantId
                aSessionTokeniser :(NSString*) aSessionTokeniser
                            aDate :(NSString*) aDate
aMswipeWisepadControllerResponseListener : (id) aMswipeWisepadControllerResponseListener;

- (void) getCashSummary :(NSString*) aMerchantId
              aSessionTokeniser :(NSString*) aSessionTokeniser
              aDate :(NSString*) aDate
                  aMswipeWisepadControllerResponseListener : (id) aMswipeWisepadControllerResponseListener;

- (void) getBankSummary :(NSString*) aMerchantId
              aSessionTokeniser :(NSString*) aSessionTokeniser
              aDate :(NSString*) aDate
                  aMswipeWisepadControllerResponseListener : (id) aMswipeWisepadControllerResponseListener;


- (void) processCashSaleReceipt : (NSString*) aReferenceId
              aSessionTokeniser : (NSString*) aSessionTokeniser
          aCashSaleResponseData : (CashSaleResponseData*) aCashSaleResponseData
       aMSSignatureReceiptView  : (MSSignatureReceiptView*) aMSSignatureReceiptView
aMswipeWisepadControllerResponseListener : (id) aMswipeWisepadControllerResponseListener;

- (void) getTrxReceiptData : (NSString*) aReferenceId
         aSessionTokeniser : (NSString*) aSessionTokeniser
                   aStanId : (NSString*) aStanId
aMswipeWisepadControllerResponseListener : (id) aMswipeWisepadControllerResponseListener;


- (void) processMCardSale :(NSString*) aReferenceId
        aSessionTokeniser :(NSString*) aSessionTokeniser
                  aAmount :(NSString*) aAmount
               aTipAmount :(NSString*) aTipAmount
                aMobileNo :(NSString*) aMobileNo
               aInvoiceNo :(NSString*) aInvoiceNo
                   aEmail :(NSString*) aEmail
                   aNotes :(NSString*) aNotes
            aIsTipEnabled :(Boolean) aIsTipEnabled
        aIsReceiptEnabled :(Boolean) aIsReceiptEnabled
        aAmexSecurityCode :(NSString*) aAmexSecurityCode
aConveniencefeePercentage :(float) aConveniencefeePercentage
    aServiceTaxPercentage :(float) aServiceTaxPercentage
                 aIsTopup :(Boolean) aIsTopup
               aIsReOrder :(Boolean) aIsReOrder
            aExtraNoteOne :(NSString*) aExtraNoteOne
            aExtraNoteTwo :(NSString*) aExtraNoteTwo
          aExtraNoteThree :(NSString*) aExtraNoteThree
           aExtraNoteFour :(NSString*) aExtraNoteFour
           aExtraNoteFive :(NSString*) aExtraNoteFive
            aExtraNoteSix :(NSString*) aExtraNoteSix
          aExtraNoteSeven :(NSString*) aExtraNoteSeven
          aExtraNoteEight :(NSString*) aExtraNoteEight
           aExtraNoteNine :(NSString*) aExtraNoteNine
            aExtraNoteTen :(NSString*) aExtraNoteTen
aMswipeWisepadControllerResponseListener : (id) aMswipeWisepadControllerResponseListener;



@end
