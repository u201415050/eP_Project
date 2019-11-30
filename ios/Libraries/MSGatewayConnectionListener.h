//
//  MSGatewayConnectionListener.h
//  MswipeWisepadIOSSDK
//
//  Created by Mswipe on 12/16/16.
//  Copyright © 2016 Mswipe IT. All rights reserved.
//

#ifndef MSGatewayConnectionListener_h
#define MSGatewayConnectionListener_h

@protocol MSGatewayConnectionListener <NSObject>

@required

-(void) connecting :(NSString*) status;

-(void) connected :(NSString*) status;

-(void) disconnected :(NSString*) status;

@end


#endif /* MSGatewayConnectionListener_h */
