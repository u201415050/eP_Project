import React, { Component } from "react";
import {TouchableOpacity } from "react-native";
import {TextMontserrat} from "components"
class TouchableText extends Component {
  render() {
    const {children, style, opacity, onPress} = this.props;
    return (
        <TouchableOpacity onPress={onPress} opacity={opacity}>
            <TextMontserrat style={style}>
                {children}
            </TextMontserrat>
        </TouchableOpacity>
    )
  }
}

export default TouchableText;
