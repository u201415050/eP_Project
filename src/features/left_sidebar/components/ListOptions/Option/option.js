import React, { Component } from 'react';
import { Text, View, Image, TouchableOpacity } from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import EStyleSheet from 'react-native-extended-stylesheet';
import colors from '../../../styles/colors';
import NavigationService from '../../../../../services/navigation';
import * as screen_names from '../../../../../navigation/screen_names';
import { TextMontserrat } from 'components';
import { isTablet } from '../../../constants/isLandscape';
export default class Option extends Component {
  getScreenMainIndex() {
    switch (NavigationService.history.currentScreenName) {
      case screen_names.CASH_REGISTER:
        return 0;
      case screen_names.CUSTOMER_LIST:
      case screen_names.CUSTOMER_PERSONAL_DETAILS:
        return 1;
      // case screen_names.NOTIFICATIONS_HOME:
      //   return 2;
      case screen_names.TRANSACTIONS_HISTORY:
        return 2;
      case screen_names.SETTINGS_LIST:
      case screen_names.SETTINGS_TRANSACTIONS:
      case screen_names.SETTINGS_DEVICE:
      case screen_names.SETTINGS_HARDWARE:
      case screen_names.SETTINGS_PAYMENTS:
      case screen_names.SETTINGS_PRINTER:
      case screen_names.SETTINGS_CARDREADER:
      case screen_names.SETTINGS_CASHDRAWER:
        return 3;
      case screen_names.MY_ACCOUNT_LIST:
      case screen_names.MY_ACCOUNT_PERSONAL:
      case screen_names.MY_ACCOUNT_BUSINESS:
      case screen_names.MY_ACCOUNT_NOTIFICATIONS:
      case screen_names.MY_ACCOUNT_REPORTS:
      case screen_names.MY_ACCOUNT_PASSWORD:
        return 4;
      case screen_names.HELP_HOME:
      case screen_names.HELP_SUPPORT:
      case screen_names.HELP_LEARN_MORE:
      case screen_names.HELP_LIVE_CHAT:
        return 5;

      default:
        return null;
    }
  }
  render() {
    //const {active,toggle} = this.props
    const { label, icon, index, data } = this.props;

    const active = this.getScreenMainIndex() === index;
    const Icon =
      icon != '' ? icon : require('../../../assets/img/iconOption.png');

    const activeStyleText = active
      ? { color: colors.white }
      : { color: colors.noactiveGray };

    const sizes = [41 / 34, 1, 1, 38 / 37, 1, 23 / 20, 1];
    return (
      <TouchableOpacity
        style={styles.container}
        onPress={() => {
          this.props.closeDrawer();
          setTimeout(()=>{
          if (active || !data.navigate) {
            
            if (index === 0) {
              NavigationService.navigate(data.navigate, {}, () => {
                NavigationService.history.setLastScreen(index);
              });
            }
            
          } else {
            NavigationService.navigate(data.navigate, {}, () => {
              NavigationService.history.setLastScreen(index);
            });
          }},100)
        }}
      >
        <View
          style={{
            width: isTablet ? hp('7%') : wp('11%'),
            alignItems: 'center',
            marginRight: isTablet ? hp('1.5%') : wp('2%'),
            justifyContent: 'center',
            height: '100%',
          }}
        >
          <Image
            source={Icon}
            resizeMode={'contain'}
            style={{
              width: hp('4%') * sizes[index],
              height: hp('4%'),
              tintColor: active ? colors.white : colors.noactiveGray,
            }}
          />
        </View>

        <Text style={[activeStyleText, styles.optionText]}>{label}</Text>
      </TouchableOpacity>
    );
  }
}

const styles = EStyleSheet.create({
  container: {
    width: '100%',
    height: '10%',
    marginLeft: isTablet ? 0 : -wp('1.2%'),
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  optionText: {
    fontSize: hp('3%'),
    fontFamily: 'Montserrat-SemiBold',
  },
  img: {
    height: hp('4%'),
    width: hp('4%'),
    marginRight: '6%',
  },
});
