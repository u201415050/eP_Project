import React from 'react';
import { Platform, View, TouchableOpacity } from 'react-native';
import { TextMontserrat } from 'components';
import LinearGradient from 'react-native-linear-gradient';
import EStyleSheet from 'react-native-extended-stylesheet';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';

const ButtonGradient = ({ title, onPress, style, disabled,firstColor,secondColor,heightB }) => {
  const { buttonText, linearGradient, container } = styles;
  const color = disabled
    ? // Disabled Colors
      ['#BDC1CD', '#BDC1CD']
    : // Active Colors
      [firstColor, secondColor];

  const handlePress = () => {
    if (!disabled) {
      // if is button is not disabled, do onPress!
      onPress();
    }
  };
  return (
    <TouchableOpacity style={{width:'100%'}} activeOpacity={disabled ? 1 : 0.5} onPress={handlePress}>
      <View style={[container, style,heightB?{height:hp('6.5%')}:null]}>
        <LinearGradient
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          colors={color}
          style={linearGradient}
        >
          <TextMontserrat style={buttonText}>{title}</TextMontserrat>
        </LinearGradient>
      </View>
    </TouchableOpacity>
  );
};

const styles = EStyleSheet.create({
  container: {
    height: '5rem',
    width: '100%',
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
  linearGradient: {
    flex: 1,
    borderRadius: '5rem',
    justifyContent:'center'
  },
  buttonText: {
    fontSize: hp('2%'),//'1.2rem',
    letterSpacing: 1.33,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#ffffff',
  },
  '@media (min-width: 500)': {
    buttonText: {
      fontSize:  hp('2.6%'),//'1.6rem',
      margin: '1.4rem',
      fontWeight: '600',
    },
  },
});

export default ButtonGradient;
