import React, { Component } from 'react';
import {
  Dimensions,
  View,
  Text,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
  Image,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import EStyleSheet from 'react-native-extended-stylesheet';
import {
  scale,
  moderateScale,
  verticalScale,
} from '../../../../../constants/util/scaling';
class Button extends Component {
  render() {
    const {disabled, label, backgroundColor, width, color, font } = this.props;

    return (
      <TouchableOpacity
        disabled={disabled}
        style={[{ backgroundColor }, { width }, styles.container, disabled?{opacity:0.5}:null]}
        onPress={() => {
          this.props.onPress();
        }}
      >
        <Text style={[{ color }, styles.labelButton,{fontSize:font}]}>{label}</Text>
      </TouchableOpacity>
    );
  }
}

const styles = EStyleSheet.create({
  container: {
    height: hp('5.8%'),
    borderRadius: hp('0.9%'),
    justifyContent: 'center',
    alignItems: 'center',
    elevation: moderateScale(1.5),
  },
  labelButton: {
    fontFamily: 'Montserrat-Bold',
    fontSize: hp('2.6%'),
    textAlign: 'center',
  },
});

export default Button;
