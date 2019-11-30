/** @format */
import 'react-native-gesture-handler';
import './thepatch';
import {
  AppRegistry,
  Dimensions,
  YellowBox,
  NetInfo,
  Platform,
} from 'react-native';
import App from './src';
import { name as appName } from './app.json';
import EStyleSheet from 'react-native-extended-stylesheet';
import BackgroundTask from './sync';
import BackgroundFetch from 'react-native-background-fetch';
import SyncAdapter from 'react-native-sync-adapter';
import DeviceInfo from 'react-native-device-info';
import Orientation from 'react-native-orientation-locker';
import BiometricsService from './src/services/biometrics';
//import winston from 'winston';
//import { Loggly } from 'winston-loggly-bulk';

//winston.log('info', 'Hello World from Node.js!');
DeviceInfo.isTablet()
  ? Orientation.lockToLandscape()
  : Orientation.lockToPortrait();
const getRem = () => {
  const width = Dimensions.get('window').width;
  if (width > 500) {
    return 14;
  } else if (width <= 320) {
    return 8;
  }
  return 10;
};
EStyleSheet.build({
  $rem: getRem(),
});
YellowBox.ignoreWarnings([
  'Remote debugger is in',
  'Require cycle',
  'Possible',
  'Warning',
  'Virtualized',
  'source',
  'Deprecation',
]);
BiometricsService.init();
// import BackgroundFetch from 'react-native-background-fetch';

// let MyHeadlessTask = async event => {
//   console.log('[BackgroundFetch HeadlessTask] start');

//   // Perform an example HTTP request.
//   // Important:  await asychronous tasks when using HeadlessJS.
//   let response = await fetch(
//     'https://facebook.github.io/react-native/movies.json'
//   );
//   let responseJson = await response.json();
//   console.log('[BackgroundFetch HeadlessTask response: ', responseJson);

//   // Required:  Signal to native code that your task is complete.
//   // If you don't do this, your app could be terminated and/or assigned
//   // battery-blame for consuming too much time in background.
//   if (Platform.OS === 'android') BackgroundFetch.finish();
// };

// // Register your BackgroundFetch HeadlessTask
// if (Platform.OS === 'android')
//   BackgroundFetch.registerHeadlessTask(MyHeadlessTask);
// let MyHeadlessTask = async event => {
//   console.log('[BackgroundFetch HeadlessTask] start');

//   // Perform an example HTTP request.
//   // Important:  await asychronous tasks when using HeadlessJS.
//   let response = await fetch(
//     'https://facebook.github.io/react-native/movies.json'
//   );
//   let responseJson = await response.json();
//   console.log('[BackgroundFetch HeadlessTask response: ', responseJson);

//   // Required:  Signal to native code that your task is complete.
//   // If you don't do this, your app could be terminated and/or assigned
//   // battery-blame for consuming too much time in background.
//   BackgroundFetch.finish();
// };

// Register your BackgroundFetch HeadlessTask
//BackgroundFetch.registerHeadlessTask(MyHeadlessTask);

AppRegistry.registerComponent(appName, () => App);

if (Platform.OS === 'android') {
  AppRegistry.registerHeadlessTask('TASK_SYNC_ADAPTER', () => BackgroundTask);
} else {
  BackgroundFetch.registerHeadlessTask(() => BackgroundTask);
}

function handleFirstConnectivityChange(isConnected) {
  //alert(isConnected);
  console.log('CONNECTED: ', isConnected);
  if (isConnected) {
    if (Platform.OS === 'android') {
      SyncAdapter.syncImmediately({
        syncInterval: 12 * 60 * 60,
        syncFlexTime: 0.5 * 60 * 60,
      });
    } else {
      //alert(1);
      /*BackgroundFetch.configure(
        {
          minimumFetchInterval: 15, // <-- minutes (15 is minimum allowed)
        },
        () => {
          console.log('[js] Received bh event');*/
      //alert(1);
      BackgroundTask();
      /*   //BackgroundFetch.finish(BackgroundFetch.FETCH_RESULT_NEW_DATA);
        },
        error => {
          console.log('[js] RNBackgroundFetch failed to start', error);
        }
      );*/
    }
  }
}
const conecction = NetInfo.isConnected;
conecction.addEventListener('connectionChange', handleFirstConnectivityChange);
