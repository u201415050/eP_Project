import React, { Component } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Colors } from "api";
import { FloatingTextInput, Select } from "./index";

class SelectWithTextInput extends Component {
  state = {
    showOptions: false,
    options: this.props.options || [],
    value: this.props.options ? this.props.options[0] : ""
  };

  render() {
    const { underlineStyle } = styles;
    const { style, options } = this.props;
    return (
      <View style={[{ zIndex: 1 }, style]}>
        <View style={{ width: "100%", flexDirection: "row" }}>
          <View
            style={{
              zIndex: 1,
              flex: 1,
              borderRightWidth: 2,
              borderColor: Colors.primary,
              height: "100%"
            }}
          >
            <Select underline={false} options={options} />
          </View>
          <View style={{ flex: 3 }}>
            <FloatingTextInput margin={0} underline={false} />
          </View>
        </View>
        <View style={underlineStyle} />
      </View>
    );
  }
}
const styles = {
  underlineStyle: {
    left: 3,
    backgroundColor: Colors.primary,
    height: 3
  }
};
export default SelectWithTextInput;
