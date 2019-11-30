import realm from '../realm_service';
import DeviceInfo from 'react-native-device-info';
import DeviceIMEI from 'react-native-imei';
import { Platform, PermissionsAndroid } from 'react-native';
import Geolocation from 'react-native-geolocation-service';

export default class RealmDeviceInfo {
  static schema = {
    name: 'RealmDeviceInfo',
    primaryKey: 'id',
    properties: {
      id: 'int',
      version: 'string?',
      imei: 'string?',
      os: 'string?',
      device: 'string?',
      location: 'string?',
    },
  };
  static async init() {
    return new Promise(async (resolve, reject) => {
      const parameters = {
        id: 0,
      };
      let grantedReadPhone;
      let grantedGeo;
      if (Platform.OS === 'android') {
        grantedReadPhone = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.READ_PHONE_STATE
        );
        grantedGeo = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
        );
      }
      if (
        Platform.OS === 'android' &&
        grantedReadPhone === PermissionsAndroid.RESULTS.GRANTED &&
        grantedGeo === PermissionsAndroid.RESULTS.GRANTED
      ) {
        const imei = await DeviceIMEI.getImei();
        parameters.version = DeviceInfo.getVersion();
        parameters.imei = imei[0];
        parameters.os = `${Platform.OS} ${Platform.Version}`;
        parameters.device = `${DeviceInfo.getManufacturer()} ${DeviceInfo.getModel()}`;
        realm.write(() => {
          realm.create(RealmDeviceInfo.schema.name, parameters, true);
        });
        Geolocation.getCurrentPosition(
          position => {
            const coords = position.coords;
            const info = realm.objectForPrimaryKey(
              RealmDeviceInfo.schema.name,
              0
            );
            realm.write(() => {
              info.location = `${coords.latitude},${coords.longitude}`;
            });
            resolve(info);
          },
          error => {
            // See error code charts below.
            reject(error);
          },
          { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
        );
      } else {
        reject({ message: 'Permission Error' });
      }
    });
  }
}
