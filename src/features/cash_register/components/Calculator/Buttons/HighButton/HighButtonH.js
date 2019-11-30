import React from 'react';
import {
  Text,
  View,
  ImageBackground,
  TouchableOpacity,
  Easing,
  Animated,
} from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import colors from '../../../../styles/colors';
export default class HighButtonH extends React.PureComponent {
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
    const { number, actionButton } = this.props;
    return (
      <TouchableOpacity
        ref={touchable => {
          this.touchable = touchable;
        }}
        style={styles.container}
        onPress={actionButton}
      >
        <ImageBackground
          source={require('../../../../assets/img/rectangleHigh2.png')}
          style={styles.imgb}
          resizeMode="stretch"
        >
          <View style={styles.fieldResult}>
            <Text style={styles.textField}>{number}</Text>
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
    flex: 2,
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
    color: colors.gray,
  },
});
