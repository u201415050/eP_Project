//
//  MSwipeData.h
//  Mswipe-EMV
//
//  Created by satish reddy on 11/3/13.
//
//

#import <Foundation/Foundation.h>

#import "ApplicationData.h"
#import "LoginResponseData.h"

@interface MSwipeData : NSObject
{

}

+ (void) clearMSDataPreferences ;
+ (void) saveLoginPreferences : (LoginResponseData*) loginResponseData;

@end
