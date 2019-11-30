//
//  EncryptHelper.m
//  Epaisa E105
//
//  Created by Halil Kabaca on 12/02/14.
//  Copyright (c) 2014 Epaisa. All rights reserved.
//

#import "EncryptHelper.h"


static char base64EncodingTable[64] = {
    'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P',
    'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', 'a', 'b', 'c', 'd', 'e', 'f',
    'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v',
    'w', 'x', 'y', 'z', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '+', '/'
};



@implementation EncryptHelper

- (NSString*) doCipher:(NSString*)plainText enc:(CCOperation)encryptOrDecrypt
{
    
    const void *vplainText;
    size_t plainTextBufferSize;
    
    NSData *EncryptData;
    
    if (encryptOrDecrypt == kCCDecrypt)
    {
        NSString *newplaintext = [self dereplaceCharactersFromString:plainText];
        EncryptData = [newplaintext dataUsingEncoding:NSUTF8StringEncoding];
        
        EncryptData = [[NSData alloc] initWithBase64EncodedString:newplaintext options:0];
        
        plainTextBufferSize = [EncryptData length]  * 2;
        plainTextBufferSize = [EncryptData length];
        //plainTextBufferSize = 8;
        vplainText = [EncryptData bytes];
    }
    else
    {
        plainTextBufferSize = [plainText length];
        vplainText = (const void *) [plainText UTF8String];
    }
    
    
    CCCryptorStatus ccStatus;
    uint8_t *bufferPtr = NULL;
    size_t bufferPtrSize = 0;
    size_t movedBytes = 0;
    //  uint8_t ivkCCBlockSize3DES;
    
    bufferPtrSize = (plainTextBufferSize + kCCBlockSize3DES) & ~(kCCBlockSize3DES - 1);
    bufferPtr = malloc( bufferPtrSize * sizeof(uint8_t));
    memset((void *)bufferPtr, 0x0, bufferPtrSize);
    
    
    unsigned char result1[24];
    unsigned char IV3[8];
    
    
    //get key and iv//
    NSString * strKey = [EncryptHelper keychainStringFromMatchingIdentifier:@"DeviceBDKKey"];
    NSString * strIV = [EncryptHelper keychainStringFromMatchingIdentifier:@"DeviceIV"];
    
    //This is poor programming practice; PLEASE REMOVE LATER
    strKey  = @"E4HD9h4DhS23DYfhHemkS3Nf";
    strIV   = @"fYfhHeDm";
    
    for (int i=0; i < [strKey length]; i++)
    {
        result1[i] = [strKey characterAtIndex:i];
    }
    
    
    for (int i=0; i < [strIV length]; i++)
    {
        IV3[i] = [strIV characterAtIndex:i];
    }
    
    
    uint8_t iv[kCCBlockSize3DES];
    memset((void *) iv, 0x0, (size_t) sizeof(iv));
    
    ccStatus = CCCrypt(encryptOrDecrypt,
                       kCCAlgorithm3DES,
                       kCCOptionPKCS7Padding ,
                       result1, //key
                       kCCKeySize3DES,
                       IV3,  //iv,
                       vplainText,  //plainText,
                       plainTextBufferSize,
                       (void *)bufferPtr,
                       bufferPtrSize,
                       &movedBytes);
    
    //if (ccStatus == kCCSuccess) NSLog(@"SUCCESS");
    
    if (ccStatus == kCCParamError) return @"PARAM ERROR";
    else if (ccStatus == kCCBufferTooSmall) return @"BUFFER TOO SMALL";
    else if (ccStatus == kCCMemoryFailure) return @"MEMORY FAILURE";
    else if (ccStatus == kCCAlignmentError) return @"ALIGNMENT";
    else if (ccStatus == kCCDecodeError) return @"DECODE ERROR";
    else if (ccStatus == kCCUnimplemented) return @"UNIMPLEMENTED";
    
    NSString *result;
    
    if (encryptOrDecrypt == kCCDecrypt)
    {
        //NSLog(@"moved bytes: %zu",movedBytes);
        
        result = [ [NSString alloc] initWithData: [NSData dataWithBytes:(const void *)bufferPtr length:(NSUInteger)movedBytes] encoding:NSASCIIStringEncoding];
        
    }
    else
    {
        NSData *myData = [NSData dataWithBytes:(const void *)bufferPtr length:(NSUInteger)movedBytes];
        
        result = [self base64StringFromData:myData length:(int)myData.length];
        
        //halilk: replace string for sending on post data
        result = [self replaceCharactersFromString:result];
        
    }
    
    return result;
}



- (NSString *)base64StringFromData:(NSData *)data length:(int)length
{
    unsigned long ixtext, lentext;
    long ctremaining;
    unsigned char input[3], output[4];
    short i, charsonline = 0, ctcopy;
    const unsigned char *raw;
    NSMutableString *result;
    
    lentext = [data length];
    if (lentext < 1)
        return @"";
    result = [NSMutableString stringWithCapacity: lentext];
    raw = [data bytes];
    ixtext = 0;
    
    while (true) {
        ctremaining = lentext - ixtext;
        if (ctremaining <= 0)
            break;
        for (i = 0; i < 3; i++) {
            unsigned long ix = ixtext + i;
            if (ix < lentext)
                input[i] = raw[ix];
            else
                input[i] = 0;
        }
        output[0] = (input[0] & 0xFC) >> 2;
        output[1] = ((input[0] & 0x03) << 4) | ((input[1] & 0xF0) >> 4);
        output[2] = ((input[1] & 0x0F) << 2) | ((input[2] & 0xC0) >> 6);
        output[3] = input[2] & 0x3F;
        ctcopy = 4;
        switch (ctremaining) {
            case 1:
                ctcopy = 2;
                break;
            case 2:
                ctcopy = 3;
                break;
        }
        
        for (i = 0; i < ctcopy; i++)
            [result appendString: [NSString stringWithFormat: @"%c", base64EncodingTable[output[i]]]];
        
        for (i = ctcopy; i < 4; i++)
            [result appendString: @"="];
        
        ixtext += 3;
        charsonline += 4;
        
        if ((length > 0) && (charsonline >= length))
            charsonline = 0;
    }
    return result;
}

- (NSString *) base64StringFromData:(NSData *)data
{
    return [self base64StringFromData:data length:(int)[data length]];
}


- (NSString*) replaceCharactersFromString:(NSString*)plainText
{
    NSString * temp = [plainText stringByReplacingOccurrencesOfString:@"+" withString:@"-"];
    temp = [temp stringByReplacingOccurrencesOfString:@"=" withString:@","];
    temp = [temp stringByReplacingOccurrencesOfString:@"/" withString:@"_"];
    
    return temp;
}


- (NSString*) dereplaceCharactersFromString:(NSString*)plainText
{
    NSString * temp = [plainText stringByReplacingOccurrencesOfString:@"-" withString:@"+"];
    temp = [temp stringByReplacingOccurrencesOfString:@"," withString:@"="];
    temp = [temp stringByReplacingOccurrencesOfString:@"_" withString:@"/"];
    
    return temp;
}




+ (NSMutableDictionary *)setupSearchDirectoryForIdentifier:(NSString *)identifier {
    
    // Setup dictionary to access keychain.
    NSMutableDictionary *searchDictionary = [[NSMutableDictionary alloc] init];
    // Specify we are using a password (rather than a certificate, internet password, etc).
    [searchDictionary setObject:(__bridge id)kSecClassGenericPassword forKey:(__bridge id)kSecClass];
    // Uniquely identify this keychain accessor.
    [searchDictionary setObject:@"E105" forKey:(__bridge id)kSecAttrService];
    
    // Uniquely identify the account who will be accessing the keychain.
    NSData *encodedIdentifier = [identifier dataUsingEncoding:NSUTF8StringEncoding];
    [searchDictionary setObject:encodedIdentifier forKey:(__bridge id)kSecAttrGeneric];
    [searchDictionary setObject:encodedIdentifier forKey:(__bridge id)kSecAttrAccount];
    
    return searchDictionary;
}

+ (NSData *)searchKeychainCopyMatchingIdentifier:(NSString *)identifier
{
    
    NSMutableDictionary *searchDictionary = [self setupSearchDirectoryForIdentifier:identifier];
    // Limit search results to one.
    [searchDictionary setObject:(__bridge id)kSecMatchLimitOne forKey:(__bridge id)kSecMatchLimit];
    
    // Specify we want NSData/CFData returned.
    [searchDictionary setObject:(__bridge id)kCFBooleanTrue forKey:(__bridge id)kSecReturnData];
    
    // Search.
    NSData *result = nil;
    CFTypeRef foundDict = NULL;
    OSStatus status = SecItemCopyMatching((__bridge CFDictionaryRef)searchDictionary, &foundDict);
    
    if (status == noErr) {
        result = (__bridge_transfer NSData *)foundDict;
    } else {
        result = nil;
    }
    
    return result;
}

+ (NSString *)keychainStringFromMatchingIdentifier:(NSString *)identifier
{
    NSData *valueData = [self searchKeychainCopyMatchingIdentifier:identifier];
    if (valueData) {
        NSString *value = [[NSString alloc] initWithData:valueData
                                                encoding:NSUTF8StringEncoding];
        return value;
    } else {
        return nil;
    }
}

+ (BOOL)createKeychainValue:(NSString *)value forIdentifier:(NSString *)identifier
{
    
    NSMutableDictionary *dictionary = [self setupSearchDirectoryForIdentifier:identifier];
    NSData *valueData = [value dataUsingEncoding:NSUTF8StringEncoding];
    [dictionary setObject:valueData forKey:(__bridge id)kSecValueData];
    
    // Protect the keychain entry so it's only valid when the device is unlocked.
    [dictionary setObject:(__bridge id)kSecAttrAccessibleWhenUnlocked forKey:(__bridge id)kSecAttrAccessible];
    
    // Add.
    OSStatus status = SecItemAdd((__bridge CFDictionaryRef)dictionary, NULL);
    
    // If the addition was successful, return. Otherwise, attempt to update existing key or quit (return NO).
    if (status == errSecSuccess) {
        return YES;
    } else if (status == errSecDuplicateItem){
        return [self updateKeychainValue:value forIdentifier:identifier];
    } else {
        return NO;
    }
}

+ (BOOL)updateKeychainValue:(NSString *)value forIdentifier:(NSString *)identifier
{
    
    NSMutableDictionary *searchDictionary = [self setupSearchDirectoryForIdentifier:identifier];
    NSMutableDictionary *updateDictionary = [[NSMutableDictionary alloc] init];
    NSData *valueData = [value dataUsingEncoding:NSUTF8StringEncoding];
    [updateDictionary setObject:valueData forKey:(__bridge id)kSecValueData];
    
    // Update.
    OSStatus status = SecItemUpdate((__bridge CFDictionaryRef)searchDictionary,
                                    (__bridge CFDictionaryRef)updateDictionary);
    
    if (status == errSecSuccess) {
        return YES;
    } else {
        return NO;
    }
}

+ (void)deleteItemFromKeychainWithIdentifier:(NSString *)identifier
{
    NSMutableDictionary *searchDictionary = [self setupSearchDirectoryForIdentifier:identifier];
    CFDictionaryRef dictionary = (__bridge CFDictionaryRef)searchDictionary;
    
    //Delete.
    SecItemDelete(dictionary);
}



// Here we are taking in our string hash, placing that inside of a C Char Array, then parsing it through the SHA256 encryption method.
+ (NSString*)computeSHA256DigestForString:(NSString*)input
{
    
    const char *cstr = [input cStringUsingEncoding:NSUTF8StringEncoding];
    NSData *data = [NSData dataWithBytes:cstr length:input.length];
    uint8_t digest[CC_SHA256_DIGEST_LENGTH];
    
    // This is an iOS5-specific method.
    // It takes in the data, how much data, and then output format, which in this case is an int array.
    CC_SHA256(data.bytes, (int)data.length, digest);
    
    // Setup our Objective-C output.
    NSMutableString* output = [NSMutableString stringWithCapacity:CC_SHA256_DIGEST_LENGTH * 2];
    
    // Parse through the CC_SHA256 results (stored inside of digest[]).
    for(int i = 0; i < CC_SHA256_DIGEST_LENGTH; i++) {
        [output appendFormat:@"%02x", digest[i]];
    }
    
    return output;
}



- (NSString*)MD5:(NSString *)inputstr
{
    // Create pointer to the string as UTF8
    const char *ptr = [inputstr UTF8String];
    
    // Create byte array of unsigned chars
    unsigned char md5Buffer[CC_MD5_DIGEST_LENGTH];
    
    // Create 16 byte MD5 hash value, store in buffer
    CC_MD5(ptr, strlen(ptr), md5Buffer);
    
    // Convert MD5 value in the buffer to NSString of hex values
    NSMutableString *output = [NSMutableString stringWithCapacity:CC_MD5_DIGEST_LENGTH * 2];
    for(int i = 0; i < CC_MD5_DIGEST_LENGTH; i++)
        [output appendFormat:@"%02x",md5Buffer[i]];
    
    return output;
}







@end
