//
//  MSDataStore.h
//  MSWisePadWebRocket
//
//  Created by satish reddy on 6/16/16.
//  Copyright © 2016 Mwsipe. All rights reserved.
//

#import <Foundation/Foundation.h>

@interface MSDataStore : NSObject
{

}

@property (nonatomic, assign) Boolean               ResponseStatus;
@property (nonatomic, strong) NSString*             ResponseFailureReason;
@property (nonatomic, strong) NSString*             ResponseSuccessMessage;
@property (nonatomic, assign) int                   ErrorNo;
@property (nonatomic, strong) NSString*             ErrorCode;
@property (nonatomic, strong) NSMutableDictionary*  userInfo;

@end
