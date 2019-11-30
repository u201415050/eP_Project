import React, { Component } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Colors } from "api";
import Icon from "react-native-vector-icons/FontAwesome";
import { TextMontserrat } from "components";
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';

class Select extends Component {
  state = {
    showOptions: false,
    options: this.props.options || [],
    value: this.props.options ? this.props.options[0] : ""
  };

  _toggleOptions = () => {
    this.setState({ showOptions: !this.state.showOptions });
  };

  _selectOption = value => {
    this.setState({ value });
    this._toggleOptions();
  };

  renderUnderline = () => {
    const { underline } = this.props;
    if (underline != false) {
      return <View style={styles.underlineStyle} />;
    }
  };

  renderOptions() {
    if (this.state.showOptions) {
      return (
        <View
          style={{
            zIndex: 9999,
            top: 53,
            position: "absolute",
            width: "100%",
            backgroundColor: "#fafafa",
            borderRadius: 3,
            elevation: 2,
            shadowOffset: {
              width: 5,
              height: 5
            },
            shadowColor: "black",
            shadowOpacity: 1
          }}
        >
          {this.state.options.map((item, i) => (
            <TouchableOpacity onPress={() => this._selectOption(item)} key={i}>
              <View
                style={{
                  height: 10,
                  width: "100%",
                  justifyContent: "center",
                  alignItems: "center"
                }}
              >
                <TextMontserrat style={{ fontSize: 20, fontWeight: "600" }}>
                  {item}
                </TextMontserrat>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      );
    }
  }
  render() {
    const styles = {
      underlineStyle: {
        left: 3,
        backgroundColor: Colors.primary,
        height: 3,
        width: "100%"
      },
      selectContainer: {
        height: wp('2.0%'),
        marginTop: 20
      }
    };

    const { underlineStyle, selectContainer } = styles;

    return (
      <View style={selectContainer}>
        <TouchableOpacity
          onPress={this._toggleOptions}
          style={{
            flex: 1,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            top: 5
          }}
        >
          <View>
            <TextMontserrat
              style={{
                fontSize: 20,
                color: this.props.color, //"#6b6b6b",
                fontWeight: "600"
              }}
            >
              {this.state.value}
            </TextMontserrat>
          </View>
          <View style={{ paddingLeft: 10 }}>
            <Icon name={"angle-down"} size={30} />
          </View>
        </TouchableOpacity>
        {this.renderOptions()}
        {this.renderUnderline()}
      </View>
    );
  }
}

export default Select;
