import { sendRequest, encryptRequest } from './server-api';
import { AsyncStorage } from 'react-native';
import realm, { getTable, createRow, updateRow } from './realm_service';
import { epaisaRequest } from './epaisa_service';

export function customRequest(parameters, endpoint, auth_key, method) {
  const returnEncrypt = encryptRequest(auth_key, parameters);
  return sendRequest(returnEncrypt, endpoint, method);
}

export async function getSettings() {
  const user = realm.objectForPrimaryKey('User', 0);
  const { merchantId, userId } = user;
  try {
    const settings = await epaisaRequest(
      { merchantId, userId },
      '/setting',
      'POST'
    );
    console.log('SETTINGS:', settings.response);
    return settings.response;
  } catch (error) {
    console.log({ SETTINGS_ERROR: error });
  }
}

export async function setSetting(settingName, settingoptionsparams) {
  const user = realm.objectForPrimaryKey('User', 0);
  const { merchantId, userId } = user;

  try {
    const settings = await epaisaRequest(
      {
        userId,
        merchantId,
        settingName,
        settingoptionsparams,
      },
      '/setting',
      'PUT'
    );
    console.log({ settings });
    if (settings.success) {
      const setting = Array.from(
        realm.objects('Settings').filtered(`name CONTAINS[c] "${settingName}"`)
      )[0];
      setting.setSynced(true);
    }
    return settings;
  } catch (error) {
    //console.log({ SETTINGS_ERROR: error });
  }
}

export async function setLocalSettings() {
  try {
    const settings = await getSettings();
    // alert(JSON.stringify(settings))
    var hideLinkFingerprintModal = 0;
    const hideFingerprint = await AsyncStorage.getItem(
      `@HideLinkFingerprintModal`
    );
    if (hideFingerprint != null) {
      hideLinkFingerprintModal = parseInt(hideFingerprint); // 1 = hide, 0 = don't hide
    }

    for (const setting of settings) {
      var settingsOptions = [];

      if (setting.settingId == 8) {
        // const tempSettings = [];
        const tempSettings = setting.settingoptionsparams.map(i => {
          return i.settingParamId == 89 && hideFingerprint != null
            ? { ...i, value: hideLinkFingerprintModal == 0 ? 1 : 0 }
            : i;
        });

        settingsOptions = tempSettings;
      } else {
        settingsOptions = setting.settingoptionsparams;
      }
      //if(setting.settingName[0]=="T"){
      //alert(JSON.stringify(setting))
      //}
      const data = {
        id: setting.settingId,
        name: setting.settingName,
        value: JSON.stringify(settingsOptions),
        // value: JSON.stringify(setting.settingoptionsparams),
      };
      //if(setting.settingName==="Transaction"){

      //}
      createRow('Settings', data, true);
    }
  } catch (SET_SETTINGS_ERROR) {
    //console.log({ SET_SETTINGS_ERROR });
  }
}

export async function updateSetting(updater, data, oparameters) {
  updateRow(updater);
  const { setting, ...parameters } = data;
  setSetting(setting, oparameters ? oparameters : parameters);
}

export function getLocalSettings() {
  return getTable('Settings').map(x => x);
}

export function getLocalSettingRowTEST(category) {
  let element = getTable('Settings').filtered(
    `name CONTAINS[c] "${category}"`
  )[0];
  let configs = JSON.parse(element.value);
  return configs;
}
export function getLocalSettingRow(category, config) {
  let element = getTable('Settings').filtered(
    `name CONTAINS[c] "${category}"`
  )[0];
  //console.log('first:',category, config)
  if (!element) return;
  let configs = JSON.parse(element.value);
  if (!config) {
    return configs;
  }
  let value;
  for (let i = 0; i < configs.length; i++) {
    if (configs[i].settingParamName == config) {
      value = configs[i];
      break;
    }
  }
  if (!value) return;
  return value.value;
}
