import React from "react";
import { Platform, Text, View, TouchableWithoutFeedback } from "react-native";
import { TextMontserrat } from "../texts";
import LinearGradient from "react-native-linear-gradient";
import EStyleSheet from 'react-native-extended-stylesheet';

const ButtonGradient = ({ title, onPress, style, colorLinearGradient, linearGradientStyle, buttonTextStyle }) => {
  const { linearGradient, container } = styles;
  const color =  (!colorLinearGradient) ? ["#114B8C", "#0079AA"] : colorLinearGradient;
  return (
    <TouchableWithoutFeedback onPress={onPress} >
      <View style={[container, style]}>
        <LinearGradient
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          colors={color}
          style={[linearGradient, linearGradientStyle]}
        >
          <TextMontserrat style={buttonTextStyle}>{title}</TextMontserrat>
        </LinearGradient>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = EStyleSheet.create({
  container: {
    borderRadius: '5rem',
    ...Platform.select({
      ios: {
        shadowOffset: { width: 1, height: 2 },
        shadowColor: "black",
        shadowOpacity: .5,
      },
      android: {
       // elevation: 3,
      }
    })
  },
  linearGradient: {
    borderRadius: '5rem',
    justifyContent: 'center',
    alignItems: 'center',
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
  buttonText: {
    
  },
  
});

export default ButtonGradient;
