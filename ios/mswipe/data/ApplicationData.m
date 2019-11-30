//
//  RecordBoothData.m
//  SleepKeeper
//
//  Created by Satish on 25/10/11.
//  Copyright 2011 __MyCompanyName__. All rights reserved.
//

#import "ApplicationData.h"


@implementation ApplicationData

- (id)init {
    if ((self = [super init]))
    {
        
        
    }
    return self;
}

- (void)dealloc 
{

   
    
}

+ (void) setCurrency: (NSString*) currency
{
    currency = currency;
}

+ (NSString*) getCurrency
{
    
    return currency;
}

@end
