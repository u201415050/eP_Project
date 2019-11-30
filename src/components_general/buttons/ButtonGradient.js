import React from 'react';
import { Platform, View, TouchableOpacity } from 'react-native';
import { TextMontserrat } from 'components';
import LinearGradient from 'react-native-linear-gradient';
import EStyleSheet from 'react-native-extended-stylesheet';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';

const ButtonGradient = ({
  resize,
  title,
  onPress,
  labelSize,
  style,
  disabled,
  borderRadius,
  absolute,
}) => {
  const { buttonText, linearGradient, container } = styles;
  const color = disabled
    ? // Disabled Colors
      ['#BDC1CD', '#BDC1CD']
    : // Active Colors
      ['#114B8C', '#0079AA'];

  const buttonTextColor = disabled ? '#52565F' : '#fff';

  const handlePress = () => {
    if (!disabled) {
      // if is button is not disabled, do onPress!
      onPress();
    }
  };
  const radius = borderRadius ? { borderRadius: borderRadius } : {};
  return (
    <TouchableOpacity activeOpacity={disabled ? 1 : 0.5} onPress={handlePress}>
      <View style={[container, style, resize ? { height: hp('8%') } : null]}>
        <LinearGradient
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          colors={color}
          style={[
            linearGradient,
            radius,
            { alignItems: 'center', justifyContent: 'center' },
          ]}
        >
          <TextMontserrat
            style={{
              ...buttonText,
              color: buttonTextColor,
              fontSize: labelSize,
              ...(absolute ? { position: 'absolute' } : {}),
            }}
          >
            {title}
          </TextMontserrat>
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
  },
  buttonText: {
    fontSize: '1.3rem',
    letterSpacing: 1.33,
    fontWeight: 'bold',
    textAlign: 'center',
    margin: '1.5rem',
    color: '#ffffff',
  },
  '@media (min-width: 500)': {
    buttonText: {
      fontSize: '1.6rem',
      margin: '1.4rem',
      fontWeight: '600',
    },
  },
});

export default ButtonGradient;
