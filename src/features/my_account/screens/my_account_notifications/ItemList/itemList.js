import React, { Component } from 'react';
import { View, Image, StyleSheet, TouchableOpacity } from 'react-native';

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

import Orientation from 'react-native-orientation-locker';
import { TextMontserrat } from 'components';
import { isTablet } from '../../../../cash_register/constants/isLandscape';

class ItemList extends Component {
  componentWillMount() {
    !isTablet ? Orientation.lockToPortrait() : Orientation.lockToLandscape();
  }
  render() {
    const type_active = {
      ['In - App']: require('../../../assets/img/app.png'),
      ['Email']: require('../../../assets/img/e-mail.png'),
      ['SMS']: require('../../../assets/img/sms.png'),
    };
    const type_disable = {
      ['In - App']: require('../../../assets/img/app_disable.png'),
      ['Email']: require('../../../assets/img/e-mail_disable.png'),
      ['SMS']: require('../../../assets/img/sms_disable.png'),
    };
    const renderItem = item => {
      return (
        <TouchableOpacity
          style={{ alignItems: 'center', marginTop: hp('0.5%') }}
          onPress={() => item.toggle()}
        >
          <Image
            source={
              item.active ? type_active[item.type] : type_disable[item.type]
            }
            style={{ width: hp('6.5%'), height: hp('6.5') }}
          />
          <TextMontserrat
            style={{
              fontSize: isTablet ? hp('2%') : hp('1.5%'),
              marginTop: hp('0.1%'),
              fontWeight: '600',
            }}
          >
            {item.type}
          </TextMontserrat>
        </TouchableOpacity>
      );
    };
    // const list = [
    //   { type: 'In - App', active: true },
    //   { type: 'Email', active: true },
    //   { type: 'SMS', active: true },
    // ];
    const { title, list } = this.props;

    return (
      <View style={styles.container}>
        <TextMontserrat
          style={{
            color: '#174285',
            marginTop: hp('0.5%'),
            fontSize: isTablet ? hp('2.25%') : hp('1.7%'),
            fontWeight: '700',
          }}
        >
          {title}
        </TextMontserrat>
        <View
          style={{
            width: '100%',
            paddingHorizontal: wp(isTablet ? '10%' : '2%'),
            marginTop: hp('1%'),
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          {list.map(item => renderItem(item))}
        </View>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    paddingHorizontal: wp(isTablet ? '2.2%' : '5%'),
    height: '17%',
    width: '100%',
    marginTop: hp('1%'),
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
});
export default ItemList;
