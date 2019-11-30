import React from 'react';
import { View, Image, Dimensions, TouchableOpacity } from 'react-native';
import TextMontserrat from '../../texts/textMontserrat';
import LogoSrc from './assets/ep_logo.png';
import EStyleSheet from 'react-native-extended-stylesheet';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

const isPortrait = () => {
  const dim = Dimensions.get('window');
  if (dim.height >= dim.width) {
    return true;
  } else {
    return false;
  }
};

const styles = EStyleSheet.create({
  container: {
    alignItems: 'center',
  },
  logoPortrait: {
    height: hp('5.8%'),
    marginBottom: hp('2.2%'),
  },
  lineStylePortrait: {
    borderColor: '#fff',
    backgroundColor: '#FFF',
    width: wp('11%'),
    height: hp('0.3%'),
  },
  textPortrait: {
    marginHorizontal: 15,
    color: 'white',
    fontWeight: '700',
    fontSize: hp('1.8%'),
    letterSpacing: wp('0.2%'),
  },

  logoLandscape: {
    height: hp('7.3%'),
    marginBottom: hp('3.3%'),
  },
  lineStyleLandscape: {
    borderColor: '#fff',
    backgroundColor: '#FFF',
    width: wp('11%'),
    height: hp('0.3%'),
  },
  textLandscape: {
    marginHorizontal: 15,
    color: 'white',
    fontWeight: '700',
    fontSize: hp('1.8%'),
    letterSpacing: wp('0.2%'),
  },
});

const Logo = ({ onPress }) => {
  const {
    container,
    logoPortrait,
    logoLandscape,
    lineStylePortrait,
    lineStyleLandscape,
    textPortrait,
    textLandscape,
  } = styles;
  return (
    <View style={container}>
      <Image
        resizeMode="contain"
        style={isPortrait() ? logoPortrait : logoLandscape}
        source={LogoSrc}
      />
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <View style={isPortrait() ? lineStylePortrait : lineStyleLandscape} />
        <TouchableOpacity
          activeOpacity={onPress && isPortrait() ? 0.2 : 1}
          onPress={() => {
            if (onPress) {
              onPress();
            }
          }}
        >
          <TextMontserrat style={isPortrait() ? textPortrait : textLandscape}>
            LEARN MORE
          </TextMontserrat>
        </TouchableOpacity>
        <View style={isPortrait() ? lineStylePortrait : lineStyleLandscape} />
      </View>
    </View>
  );
};
export default Logo;
