import React from 'react';
import { Text, View, TouchableOpacity } from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import { TextMontserrat } from '../texts';

const ButtonOutline = ({ title, onPress, style, buttonTextStyle }) => {
  const { buttonStyle, buttonText } = styles;
  return (
    <TouchableOpacity activeOpacity={0.5} onPress={onPress}>
      <View style={[buttonStyle, style]}>
        <TextMontserrat style={buttonTextStyle}>{title}</TextMontserrat>
      </View>
    </TouchableOpacity>
  );
};

const styles = EStyleSheet.create({
  buttonStyle: {
    backgroundColor: 'white',
    borderColor: '#666',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: '#164486',
    fontWeight: 'bold',
    fontSize: '1.2rem',
    letterSpacing: 1.33,
  },
  '@media (min-width: 500)': {
    buttonText: {
      fontSize: '1.6rem',
      margin: '1.4rem',
      fontWeight: '600',
    },
  },
});

export default ButtonOutline;
