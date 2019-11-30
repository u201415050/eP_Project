import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  ImageBackground,
  Image,
  TouchableOpacity,
  Easing,
  Animated,
} from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

export default class HighButtonV extends React.PureComponent {
  componentDidMount() {
    this.touchable.setOpacityTo = this.setOpacityTo;
  }
  setOpacityTo(value, duration) {
    Animated.timing(this.state.anim, {
      toValue: value,
      duration: 0,
      easing: Easing.inOut(Easing.quad),
      useNativeDriver: true,
    }).start();
  }
  render() {
    const { type, icon, label, color, actionButton } = this.props;
    return (
      <TouchableOpacity
        ref={touchable => {
          this.touchable = touchable;
        }}
        style={styles.container}
        onPress={actionButton}
      >
        <ImageBackground
          source={require('../../../../assets/img/rectangleHigh.png')}
          style={styles.imgb}
          resizeMode="stretch"
        >
          {type === 'icon' ? (
            <Image source={icon} style={styles.imgb2} />
          ) : (
            <Text style={[{ color }, styles.textField]}>{label}</Text>
          )}
        </ImageBackground>
      </TouchableOpacity>
    );
  }
}

const styles = EStyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  imgb: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imgb2: {
    width: hp('4.3%'),
    height: hp('4.3%'),
    justifyContent: 'center',
    alignItems: 'center',
  },
  fieldResult: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  textField: {
    fontSize: hp('8%'),
    fontFamily: 'Montserrat-Bold',
  },
});
