//
//  Logger.h
//  Mswipe EMV
//
//  Created by satish reddy on 11/1/13.
//
//

#import <Foundation/Foundation.h>

@interface Logger : NSObject {
    
    NSString *filePath;
    bool errroInCreatingFileForLogs;
    bool mLogsWriteEnabled;
}

+ (Logger*)sharedInstance;

@property(nonatomic, retain) NSString *filePath;

-(void) log : (NSString *)log_tab msg:(NSString *)msg fileWriteEnable : (BOOL) _fileWriteEnable logsWriteEnable : (BOOL) _logsWriteEnable;

-(void) setLogsWriteEnabled :(bool) alogsWriteEnable;
@end

