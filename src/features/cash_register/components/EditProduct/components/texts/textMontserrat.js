import React, { Component } from "react";
import { Text } from "react-native";
import EStyleSheet from 'react-native-extended-stylesheet';
class TextMontserrat extends Component {
  render() {
    let { style, children } = this.props;

    if (!style) {
      style = { fontWeight: "normal" };
    }

    switch (style.fontWeight || "normal") {
      case "normal": weight = "Regular"; break;
      case "bold": weight = "Bold";break;
      case "100": weight = "Thin"; break;
      case "200": weight = "ExtraLight"; break;
      case "300": weight = "Light"; break;
      case "400": weight = "Regular"; break;
      case "500": weight = "Medium"; break;
      case "600": weight = "SemiBold"; break;
      case "700": weight = "Bold"; break;
      case "800": weight = "Bold"; break;
      case "900": weight = "Bold"; break;
      default: weight = "Regular"; break;
    }

    const { fontWeight, ...customStyle } = style;

    const newTextStyle = EStyleSheet.create({
      text: {
        ...customStyle,
        fontFamily: `Montserrat-${weight}`
      }
    });

    return <Text style={newTextStyle.text}>{children}</Text>;
  }
}

export default TextMontserrat;
