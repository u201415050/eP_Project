/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */


#import "AppDelegate.h"
#import "../../node_modules/react-native-orientation-locker/iOS/RCTOrientation/Orientation.h"
#import <React/RCTBundleURLProvider.h>
#import <React/RCTRootView.h>
#import <Instabug/Instabug.h>
//#import "Mixpanel.h"

@implementation AppDelegate

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
  
  
  [Instabug startWithToken:@"833b62157acfd01a270b2a8e8ab76a80" invocationEvents: IBGInvocationEventShake | IBGInvocationEventScreenshot];
  NSURL *jsCodeLocation;
//[Mixpanel sharedInstanceWithToken:@"23b10b45aee631b6199f11531f6b9778"];
  #ifdef DEBUG
    jsCodeLocation = [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index" fallbackResource:nil];
  #else
    jsCodeLocation = [[NSBundle mainBundle] URLForResource:@"main" withExtension:@"jsbundle"];
  #endif

  RCTRootView *rootView = [[RCTRootView alloc] initWithBundleURL:jsCodeLocation
                                                      moduleName:@"project_1"
                                               initialProperties:nil
                                                   launchOptions:launchOptions];
  rootView.backgroundColor = [[UIColor alloc] initWithRed:1.0f green:1.0f blue:1.0f alpha:1];

  self.window = [[UIWindow alloc] initWithFrame:[UIScreen mainScreen].bounds];
  UIViewController *rootViewController = [UIViewController new];
  rootViewController.view = rootView;
  self.window.rootViewController = rootViewController;
  [self.window makeKeyAndVisible];
  return YES;
}
- (UIInterfaceOrientationMask)application:(UIApplication *)application supportedInterfaceOrientationsForWindow:(UIWindow *)window {
 return [Orientation getOrientation];
}
@end
