import DeviceInfo from 'react-native-device-info';
import { Platform, NativeModules } from 'react-native';

const {PlatformConstants } = NativeModules;
export const isTablet = Platform.OS=="android"? DeviceInfo.isTablet():PlatformConstants.interfaceIdiom!="phone";
export const UUID = DeviceInfo.getUniqueID();