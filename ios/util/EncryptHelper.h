//
//  EncryptHelper.h
//  Epaisa E105
//
//  Created by Halil Kabaca on 12/02/14.
//  Copyright (c) 2014 Epaisa. All rights reserved.
//

#import <Foundation/Foundation.h>
#import <CommonCrypto/CommonCrypto.h>
#include <CommonCrypto/CommonCryptor.h>
#import "Base64.h"
#import <Security/Security.h>
#import <CommonCrypto/CommonHMAC.h>

@interface EncryptHelper : NSObject

- (NSString*) doCipher:(NSString*)plainText enc:(CCOperation)encryptOrDecrypt;
- (NSString *)base64StringFromData:(NSData *)data length:(int)length;
- (NSString *) base64StringFromData:(NSData *)data;
- (NSString*) replaceCharactersFromString:(NSString*)plainText;
- (NSString*) dereplaceCharactersFromString:(NSString*)plainText;
- (NSString*)MD5:(NSString *)inputstr;


//keychain methods//

// Generic exposed method to search the keychain for a given value. Limit one result per search.
+ (NSData *)searchKeychainCopyMatchingIdentifier:(NSString *)identifier;

// Calls searchKeychainCopyMatchingIdentifier: and converts to a string value.
+ (NSString *)keychainStringFromMatchingIdentifier:(NSString *)identifier;

// Default initializer to store a value in the keychain.
+ (BOOL)createKeychainValue:(NSString *)value forIdentifier:(NSString *)identifier;

// Updates a value in the keychain. If you try to set the value with createKeychainValue: and it already exists,
// this method is called instead to update the value in place.
+ (BOOL)updateKeychainValue:(NSString *)value forIdentifier:(NSString *)identifier;

// Delete a value in the keychain.
+ (void)deleteItemFromKeychainWithIdentifier:(NSString *)identifier;


@end
