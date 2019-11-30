import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  ImageBackground,
  TouchableOpacity,
  Animated,
  Easing,
} from 'react-native';
import colors from '../../../../styles/colors';
import EStyleSheet from 'react-native-extended-stylesheet';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

export default class NumberButton extends Component {
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
    const { number, type, textcolor, handleSum } = this.props;
    const color = textcolor || colors.gray;
    return (
      <TouchableOpacity
        ref={touchable => {
          this.touchable = touchable;
        }}
        style={styles.container}
        onPress={handleSum}
      >
        <ImageBackground
          source={require('../../../../assets/img/RectanglePlus.png')}
          style={styles.imgb}
          resizeMode="stretch"
        >
          <View style={styles.fieldResult}>
            <Text style={[{ color }, styles.textField]}>{number}</Text>
          </View>
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
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fieldResult: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  textField: {
    fontSize: hp('4.5%'),
    fontFamily: 'Montserrat-Bold',
  },
});
