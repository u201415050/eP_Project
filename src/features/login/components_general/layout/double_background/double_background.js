import React, { Component, Fragment } from 'react';
import { View, Image, Dimensions, Platform } from 'react-native';
import { SafeAreaView } from 'components';
import backgroung_portrait from './assets/backgroung_portrait.png';
import background_image_login_landscape from './assets/background_image_login_landscape.png';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { Colors } from '../../../../../api';
import { isTablet } from '../../../../cash_register/constants/isLandscape';
import colors from '../../../../account_created/styles/colors';

const isPortrait = () => {
  const dim = Dimensions.get('window');
  if (dim.height >= dim.width) {
    return true;
  } else {
    return false;
  }
};
class DoubleBackground extends Component {
  render() {
    const { children } = this.props;
    return (
      <SafeAreaView fullscreen={true}>
        <View style={{ flex: 1 }}>
          {isPortrait() ? (
            <Image
              source={backgroung_portrait}
              style={{ height: hp('100%'), width: '100%' }}
              resizeMode={'stretch'}
            />
          ) : (
            <Image
              source={background_image_login_landscape}
              style={{ height: hp('100%'), width: '100%' }}
              resizeMode={'stretch'}
            />
          )}

          <View
            style={{
              flex: 1,
              position: 'absolute',
              width: '100%',
              height: '100%',
            }}
          >
            {children}
          </View>
        </View>
      </SafeAreaView>
    );
  }
}

export default DoubleBackground;
