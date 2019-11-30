//
//  Networking.m
//  ePaisa-Payments
//
//  Created by Gabriel Alvarado on 6/21/16.
//  Copyright © 2016 ePaisa. All rights reserved.
//

#import "Networking.h"
#import "EncryptHelper.h"



@interface Networking ()

@end

@implementation Networking

- (NSURLSession *)dataSession {
    static NSURLSession *defaultSession = nil;
    static dispatch_once_t onceToken;
    dispatch_once(&onceToken, ^{
        defaultSession = [NSURLSession sessionWithConfiguration:[NSURLSessionConfiguration defaultSessionConfiguration]];
    });
    return defaultSession;
}

#pragma mark - General Methods

- (NSMutableURLRequest *)requestFromURLString:(NSString *)url withPostVariables:(NSString *)variables {
    // Create the request.
    NSMutableURLRequest *request = [NSMutableURLRequest requestWithURL:[NSURL URLWithString:url]];
    
    // Specify that it will be a POST request
    request.HTTPMethod = @"POST";
    
    //[request setHTTPMethod:@"POST"];
    request.timeoutInterval = 60.0;
    
    // This is how we set header fields
    [request setValue:@"application/x-www-form-urlencoded" forHTTPHeaderField:@"Content-Type"];
    
    // Convert your data and set your request's HTTPBody property
    NSData *requestBodyData = [variables dataUsingEncoding:NSUTF8StringEncoding];
    request.HTTPBody = requestBodyData;
    
  return request;

}


#pragma mark -  API Methods

- (void)updateDevice:(NSArray *)data{
    //data[0] token
  //data[1] request json
  //data[2] url
  
            //Prepare the encyrptor for encyrpting post data//
            EncryptHelper  *enchelper = [[EncryptHelper alloc] init];
          
            
            NSString * postvars = @"";
            postvars = [postvars stringByAppendingString:[NSString stringWithFormat: @"requestParams="]];
            
            //now combine all post values and then encrypt//
            NSString * encodeddata = [NSString stringWithFormat:@"%@####%@",
                                      data[0],   //Token
                                      data[1]   //json
                                      ];
            
            //now encrypt all the data
            encodeddata = [enchelper doCipher:encodeddata enc:kCCEncrypt];
            
            postvars = [postvars stringByAppendingString:encodeddata];
            
            NSString* URLString = [NSString stringWithFormat:@"%@/user/devices/update-device-info", data[2] ];
            
            // Create the request.
            NSMutableURLRequest *request = [self requestFromURLString:URLString withPostVariables:postvars];
            
            NSURLSessionDataTask *dataTask = [[self dataSession] dataTaskWithRequest:request
                                                                   completionHandler:^(NSData *data, NSURLResponse *response, NSError *error) {
                                                                       if (error) {
                                                                           dispatch_async(dispatch_get_main_queue(), ^{
                                                                               if ([self.delegate respondsToSelector:@selector(onFailure:)]) {
                                                                                 [self.delegate onFailure:error];
                                                                               }
                                                                           });
                                                                       }
                                                                       else {
                                                                           dispatch_async(dispatch_get_main_queue(), ^{
                                                                               if ([self.delegate respondsToSelector:@selector(onSuccess:)]) {
                                                                                   NSMutableData * mutableData = [NSMutableData dataWithData:data];
                                                                                   [self.delegate onSuccess:mutableData];
                                                                               }
                                                                           });
                                                                       }
                                                                   }];
            [dataTask resume];
        }






@end
