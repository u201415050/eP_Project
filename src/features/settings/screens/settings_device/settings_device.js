import React, { Component } from 'react';
import { View, Image, StyleSheet, AsyncStorage } from 'react-native';
import SettingButton from '../../components/setting_button/setting_button';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import colors from '../../styles/colors';
import Orientation from 'react-native-orientation-locker';
import Header from '../../components/header/header';
import realm, { getTable } from '../../../../services/realm_service';
import { updateSetting } from '../../../../services/settings_service';
import confirmAlert from '../../api/confirm';
import {
  FINGERPRINT,
  SETTINGS_DEVICE,
} from '../../../../navigation/screen_names';
import { isTablet } from '../../../cash_register/constants/isLandscape';
//import mixpanel from '../../../../services/mixpanel';
import Biometrics from 'react-native-biometrics';
import biometrics from '../../../../services/biometrics';
import FingerprintUser from '../../../../services/realm_models/fingerprint_user';
import Settings from '../../../../services/realm_models/settings';
import User from '../../../../services/realm_models/user';
import { epaisaRequest } from '../../../../services/epaisa_service';
import DeviceInfo from 'react-native-device-info';
class SettingsDevice extends Component {
  static navigationOptions = ({ navigation }) => ({
    header: <Header isBack={true} label="DEVICE" navigation={navigation} />,
  });
  constructor() {
    super();
    //mixpanel.track('Device Setting Screen');

    this.ICONS = {
      EnableSound: require('../../assets/img/sound.png'),
      EnableCamera: require('../../assets/img/camera.png'),
      EnableFingerprint: require('../../assets/img/fingerprint.png'),
    };
    //console.log('Here is:',getLocalSettingRow('device',"EnableCamera"))
    const settings = Array.from(
      realm.objects('Settings').filtered('name CONTAINS[c] "device"')
    )[0];
    this.device_settings = JSON.parse(settings.value).map((item, i) => {
      return {
        ...item,
        active: item.settingParamActive == 'No' ? true : false,
        value: Boolean(+item.value),
        toggle: () => {
          const currentState = this.device_settings[i].value;
          const action = async () => {
            this.device_settings[i].value = !currentState;
            this.setState({ device_settings: this.device_settings }, () => {
              updateSetting(
                () => {
                  settings.value = JSON.stringify(this.state.device_settings);
                  settings.synced = false;
                },
                {
                  setting: settings.name,
                  [item.settingParamName]: `${
                    this.device_settings[i].value ? 1 : 0
                  }`,
                }
              );
            });
            //alert(item.settingParamName)
            if (item.settingParamName === 'EnableFingerprint') {
              if (
                DeviceInfo.getModel()
                  .toUpperCase()
                  .indexOf('X') == -1
              ) {
                await AsyncStorage.setItem(
                  '@showLoginByFingerprint',
                  this.device_settings[i].value ? '1' : '0'
                ); // 1 = show, 0 = hide
                if (!currentState) {
                  this.props.navigation.navigate(FINGERPRINT, {
                    fromScreen: SETTINGS_DEVICE,
                  });
                } else {
                  const user = User.getCurrentUser();

                  const fingerprint_user = FingerprintUser.getById(user.userId);
                  if (fingerprint_user) {
                    // alert(1);
                    realm.write(() => {
                      fingerprint_user.rejected = true;
                      fingerprint_user.linked = false;
                    });
                  }
                }
              }
            }
          };
          confirmAlert(currentState, action);
        },
        label: item.settingParamName.split(/(?=[A-Z])/).join(' '),
      };
    });
    this.state = {
      device_settings: this.device_settings,
    };
  }

  componentWillMount() {
    !isTablet ? Orientation.lockToPortrait() : Orientation.lockToLandscape();
  }

  async componentWillUnmount() {
    const setting = Settings.getSettingCategory('Device');
    if (!setting.synced) {
      const data_for_sync = setting.getDataForSync();
      try {
        const user = User.getCurrentUser();
        const settings_device = await epaisaRequest(
          {
            userId: user.userId,
            merchantId: user.merchantId,
            settingoptionsparams: data_for_sync,
          },
          '/setting',
          'PUT'
        );
        if (settings_device.success) {
          settings_device.setSynced(true);
        }
        alert(JSON.stringify(settings_device));
      } catch (error) {
        console.log(error);
      }
    }
  }
  render() {
    const val = [
      { image: require('../../assets/img/sound.png'), label: 'Enable Sound' },
      { image: require('../../assets/img/camera.png'), label: 'Enable Camera' },
      {
        image: require('../../assets/img/fingerprint.png'),
        label: 'Enable Fingerprint',
      },
    ];
    const bgImage = !isTablet
      ? require('../../../../assets/images/bg/loadingBackground.png')
      : require('../../../../assets/images/bg/loadingBackgroundLandscape.png');
    return (
      <View style={styles.container}>
        <Image
          style={{
            position: 'absolute',
            width: '100%',
            height: hp('100%'),
            top: 0,
            left: 0,
            bottom: 0,
            right: 0,
          }}
          resizeMode={!isTablet ? 'stretch' : 'cover'}
          source={bgImage}
        />
        {this.state.device_settings
          .filter(i => i.active)
          .map((item, i) => {
            let unshow =
              DeviceInfo.getModel()
                .toUpperCase()
                .indexOf('X') != -1 && item.label === 'Enable Fingerprint';
            if (!unshow) {
              return (
                <SettingButton
                  type="toggle"
                  toggle={item.toggle.bind(this)}
                  renderIcon={() => (
                    <Image
                      source={this.ICONS[item.settingParamName]}
                      style={{ width: hp('6.5%'), height: hp('6.5%') }}
                    />
                  )}
                  checked={item.value}
                  key={i}
                  title={item.label}
                />
              );
            }
          })}
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    height: '100%',
    width: '100%',
    paddingTop: hp('2.7%'),
    backgroundColor: colors.darkWhite,
  },
});
export default SettingsDevice;
