//
//  Networking.h
//  ePaisa-Payments
//
//  Created by Gabriel Alvarado on 6/21/16.
//  Copyright © 2016 ePaisa. All rights reserved.
//

#import <Foundation/Foundation.h>

@protocol NetworkingDelegate;

@interface Networking : NSObject

//update device Calls
- (void)updateDevice:(NSArray *) data;


@property (nonatomic, weak) id<NetworkingDelegate> delegate;

@end

@protocol NetworkingDelegate <NSObject>

@optional
- (void)onSuccess:(NSMutableData *)data;
- (void)onFailure:(NSError *)error;

@end
