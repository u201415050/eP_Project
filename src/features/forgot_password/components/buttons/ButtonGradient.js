import React from "react";
import { Platform, Text, View, TouchableOpacity } from "react-native";
import { TextMontserrat } from "components";
import LinearGradient from "react-native-linear-gradient";
import EStyleSheet from 'react-native-extended-stylesheet';

const ButtonGradient = ({ title, onPress, style, disabled, buttonTextStyle }) => {

  const { buttonText, linearGradient, container } = styles;
  const color = disabled ? 
    // Disabled Colors
    ['#BDC1CD','#BDC1CD'] : 
    // Active Colors
    ["#114B8C", "#0079AA"];

  const buttonTextColor = disabled ? '#52565F' : '#fff';
  

  handlePress = () => {
    if(!disabled) {
      // if is button is not disabled, do onPress!
      onPress()
    }
  }
  return (
    <TouchableOpacity activeOpacity={disabled ? 1 : .5} onPress={this.handlePress} style={style}>
      <View style={[style, {marginTop:0, elevation:0}]}>
        <LinearGradient
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          colors={color}
          style={[style, {marginTop:0}]}
        >
          <TextMontserrat style={{...buttonTextStyle, color: buttonTextColor}}>{title}</TextMontserrat>
        </LinearGradient>
      </View>
    </TouchableOpacity>
  );
};

const styles = EStyleSheet.create({
  container: {
    height: '5rem',
    width: "100%",
    ...Platform.select({
      ios: {
        shadowOffset: { width: 1, height: 2 },
        shadowColor: "black",
        shadowOpacity: .5,
      },
      android: {
        //elevation: 3,
      }
    })
  },
  linearGradient: {
    flex: 1,
    borderRadius: '5rem',
  },
  buttonText: {
    fontSize: '1.2rem',
    letterSpacing: 1.33,
    fontWeight: "bold",
    textAlign: "center",
    margin: '1.8rem',
    color: "#ffffff"
  },
  '@media (min-width: 500)': {
    buttonText: {
      fontSize: '1.6rem',
      margin: '1.4rem',
      fontWeight: '600'
    }
  }
});

export default ButtonGradient;
