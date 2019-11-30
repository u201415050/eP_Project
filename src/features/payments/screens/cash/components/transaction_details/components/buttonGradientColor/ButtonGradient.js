import React, { Component } from 'react';
import { Platform, View, TouchableOpacity, Dimensions } from 'react-native';
import { TextMontserrat } from 'components';
import LinearGradient from 'react-native-linear-gradient';
import EStyleSheet from 'react-native-extended-stylesheet';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';

const isPortrait = () => {
  const dim = Dimensions.get('window');
  if (dim.height >= dim.width) {
    return true;
  } else {
    return false;
  }
};

class ButtonGradient extends Component {
  state = {
    clicks: 0,

    orientation: isPortrait(),
  };
  reset = () => {
    this.setState({ clicks: 0 });
  };

  render() {
    const {
      radius,
      colorText,
      title,
      onPress,
      style,
      disabled,
      firstColor,
      secondColor,
      heightB,
      cant,
      canAddTender,
      widthCustom,
    } = this.props;
    const { buttonText, linearGradient, container, shadow } = styles;
    const color = disabled
      ? // Disabled Colors
        ['#BDC1CD', '#BDC1CD']
      : // Active Colors
        [secondColor, secondColor];

    const handlePress = () => {
      if (!disabled) {
        // if is button is not disabled, do onPress!

        let val = onPress();
        //alert(val);
        if (val) {
          this.setState({ clicks: this.state.clicks + 1 });
        }
      }
    };

    return (
      <TouchableOpacity
        activeOpacity={disabled ? 1 : 0.5}
        onPress={handlePress}
        style={[widthCustom ? { width: widthCustom } : null]}
      >
        <View style={[
          style,
          heightB ? { height: hp('6.0%') } : null,
          { elevation:3,position:'absolute', top:0}
        ]} />
        <View
          style={[
            container,
            style,
            heightB ? { height: hp('6.0%') } : null,
            {elevation:3,}
            //widthCustom ? { width: widthCustom } : null,
          ]}
        >
          <LinearGradient
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            colors={color}
            style={[linearGradient, radius ? { borderRadius: radius } : null]}
          >
            <TextMontserrat
              style={{
                ...buttonText,
                color: colorText || '#ffffff',
                marginVertical: 0,
              }}
            >
              {title}
            </TextMontserrat>
          </LinearGradient>
        </View>
        {cant && this.state.clicks > 0 ? (
          <View
            style={{
              position: 'absolute',
              top: -hp('1'),
              right: -hp('1'),
              height: hp('4%'),
              // width: hp('4%'),
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: firstColor,
              borderRadius: hp('2%'),
              elevation:4,
              paddingHorizontal: this.state.orientation ? wp('1.8%') : wp('0.8%'),
            }}
          >
            <TextMontserrat style={{ fontWeight: '700', fontSize:hp('2%')}}>
              x{this.state.clicks}
            </TextMontserrat>
          </View>
        ) : null}
      </TouchableOpacity>
    );
  }
}

const styles = EStyleSheet.create({
  container: {
    height: '5rem',
    width: '100%',
    borderRadius: '5rem',
    ...Platform.select({
      ios: {
        shadowOffset: { width: 1, height: 2 },
        shadowColor: 'black',
        shadowOpacity: 0.5,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  borderR: {
    borderRadius: '2.5rem',
  },
  shadow: {
  //  borderRadius: 0,
    elevation: 2,
    width: '100%',
    height: '100%',
    position: 'absolute',
    borderRadius: '2.5rem',
    backgroundColor: 'white',
  },
  linearGradient: {
    flex: 1,
    borderRadius: '5rem',
    justifyContent: 'center',
  },
  buttonText: {
    fontSize: hp('2%'), //'1.2rem',
    letterSpacing: 1.33,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#ffffff',
  },
  '@media (min-width: 500)': {
    buttonText: {
      fontSize: hp('2.6%'), //'1.6rem',
      margin: '1.4rem',
      fontWeight: '600',
    },
  },
});

export default ButtonGradient;
