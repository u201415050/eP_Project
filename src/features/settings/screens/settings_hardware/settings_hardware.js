import React, { Component } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import SettingButton from '../../components/setting_button/setting_button';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { isTablet } from '../../constants/isLandscape';
import Option from '../../components/content/options/option';
import colors from '../../styles/colors';
import Orientation from 'react-native-orientation-locker';
import Header from '../../components/header/header';
import { getTable } from '../../../../services/realm_service';
import { updateSetting } from '../../../../services/settings_service';

import NavigationService from '../../../../services/navigation';
import * as screen_names from '../../../../navigation/screen_names';
class SettingsHardware extends Component {
  static navigationOptions = ({ navigation }) => ({
    header: <Header isBack={true} label="HARDWARE" navigation={navigation} />,
  });
  constructor() {
    super();
    this.ICONS = {
      EnableSound: require('../../assets/img/sound.png'),
      EnableCamera: require('../../assets/img/camera.png'),
      EnableFingerprint: require('../../assets/img/fingerprint.png'),
    };
    // const settings = getTable('Settings')
    //   .filtered('name CONTAINS[c] "hardware"')
    //   .map(item => item)[0];
    // console.log({ settings });
    // this.device_settings = JSON.parse(settings.value).map((item, i) => {
    //   return {
    //     ...item,
    //     active: item.settingParamActive == 'No' ? true : false,
    //     value: Boolean(+item.value),
    //     toggle: () => {
    //       this.device_settings[i].value = !this.device_settings[i].value;
    //       this.setState({ device_settings: this.device_settings }, () => {
    //         updateSetting(
    //           () => {
    //             settings.value = JSON.stringify(this.state.device_settings);
    //           },
    //           {
    //             setting: settings.name,
    //             [item.settingParamName]: `${
    //               this.device_settings[i].value ? 1 : 0
    //             }`,
    //           }
    //         );
    //       });
    //     },
    //     label: item.settingParamName.split(/(?=[A-Z])/).join(' '),
    //   };
    // });
    // this.state = {
    //   device_settings: this.device_settings,
    // };
  }
  state = {
    checked: false,
  };
  componentWillMount() {
    !isTablet ? Orientation.lockToPortrait() : Orientation.lockToLandscape();
  }
  render() {
    const val = [
      {
        image: require('../../assets/img/printer.png'),
        label: 'Printers',
        screen: screen_names.SETTINGS_PRINTER,
      },
      {
        image: require('../../assets/img/card.png'),
        label: 'Card Readers',
        screen: screen_names.SETTINGS_CARDREADER,
      },
      {
        image: require('../../assets/img/cash.png'),
        label: 'Cash Drawers',
        screen: screen_names.SETTINGS_CASHDRAWER,
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
        {val.map((item, i) => {
          return (
            <SettingButton
              type="touchable"
              renderIcon={() => (
                <Image
                  source={item.image}
                  style={{ width: hp('6.5%'), height: hp('6.5%') }}
                />
              )}
              onPress={() => {
                NavigationService.navigate(item.screen);
              }}
              key={i}
              title={item.label}
            />
          );
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
export default SettingsHardware;
