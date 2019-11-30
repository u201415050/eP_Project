//
//  ApplicationData.h
//  mSwipe
//
//  Created by satish nalluru on 05/01/13.
//  Copyright 2013 __MyCompanyName__. All rights reserved.
//
#import <Foundation/Foundation.h>

#define IS_LABS
#define IS_DEBUGGING_ON

#if defined(IS_DEBUGGING_ON) || defined(IS_DEBUGGING_XMPP_ON)
	//#define DSLog(fmt, ...) NSLog(@"%s: " fmt, __PRETTY_FUNCTION__, ##__VA_ARGS__)
	//#define DSLog(fmt, ...) NSLog(@"" fmt, ##__VA_ARGS__)
    
    #define Logs(log_tab,msgtext,filelogenabled,nslogsenabled,...) [[Logger sharedInstance] log:(log_tab) msg:[NSString stringWithFormat:@"%s=>%d=>%@", __PRETTY_FUNCTION__, __LINE__,msgtext,##__VA_ARGS__] fileWriteEnable:filelogenabled logsWriteEnable:nslogsenabled]
#else
	#define DSLog(...)

#endif

#define AmountLength 7
#define PhoneNoLength 10
#define PasswordLength 6
#define CardLastDigits 3
#define CardPinLength 4


#define AppVersion @"V4.0.5"
#define smsCountryCode @"+91"
#define strCurrency @"inr"

static NSString *currency = @"356";
	
@interface ApplicationData : NSObject 
{
 	    
}

+ (void) setCurrency: (NSString*) currency;
+ (NSString*) getCurrency;
 
@end
