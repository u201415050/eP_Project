import React, { Component } from 'react';
import { View, TextInput, TouchableOpacity, Text } from 'react-native';
import { TextMontserrat } from 'components';
import IconMaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { Dropdown } from 'react-native-material-dropdown';
import IconMaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

export default class TaxInput extends Component {
  state = {
    value: this.props.value,
    showDropdown: false,
    focused: false,
  };

  componentDidMount() {
    this.setState({ value: this.props.value });
  }

  _changeText = v => {
    var x = parseFloat(`${v}`);
    // alert(x);
    if (x === 0) {
      if (this.props.onChangeText) {
        return this.setState({ value: x }, () => this.props.onChangeText(v));
      }
    } else if (isNaN(x)) {
      if (this.props.onChangeText) {
        return this.setState({ value: '' }, () => this.props.onChangeText(v));
      }
    }

    if (!(x < 0.1 || x > 99.99)) {
      if (this.props.onChangeText) {
        this.setState({ value: v }, () => this.props.onChangeText(v));
      }
    }
  };

  iconPressHandler = () => {
    this.setState({ value: '' }, () => {
      this._changeText('');
      if (this.props.onTextClear) {
        this.props.onTextClear();
      }
    });
  };

  render() {
    const label = this.props.label;
    const style = this.props.style;
    const containerHeight = style.containerHeight;
    const containerWidth = style.containerWidth;
    const borderBottom = style.borderBottom;
    const labelSize = style.labelSize;
    const descriptorTypeSize = style.descriptorTypeSize;
    const separatorWidth = style.separatorWidth;
    const inputLeftPadding = style.inputLeftPadding;
    const inputWidth = style.inputWidth;
    const inputFontSize = style.inputFontSize;
    const iconSize = style.iconSize;
    const textIconPaddingBottom = style.textIconPaddingBottom;
    const iconMarginRight = style.iconMarginRight;
    const dropdownWidth = style.dropdownWidth;
    const errorStyle = style.errorStyle;
    const errorMessage = 'Please enter a valid amount';
    const actionPerform = this.props.actionButton;
    const dropdownOffset = this.props.dropdownOffset;
    const dropdownPosition = this.props.dropdownPosition;

    return (
      <View>
        <View
          style={{
            height: containerHeight,
            width: containerWidth ? containerWidth : '100%',
            justifyContent: 'space-between',
            borderBottomWidth: borderBottom,
            borderBottomColor: this.props.error ? '#e30000' : '#174285',
          }}
        >
          <View style={{ flexDirection: 'row' }}>
            <TextMontserrat
              style={{
                fontWeight: '600',
                fontSize: labelSize,
                color: '#6B6B6B',
                marginRight: wp('1.5%'),
              }}
            >
              {label}
            </TextMontserrat>
            {this.props.error && (
              <IconMaterialCommunityIcons
                size={hp('1.95%')}
                name="alert-circle"
                color={'#e30000'}
              />
            )}
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'flex-end' }}>
            <View style={{ width: '27.7%', alignItems: 'center' }}>
              <TextMontserrat
                style={{
                  fontWeight: '600',
                  fontSize: descriptorTypeSize,
                  color: this.props.error ? 'red' : '#174285',
                  paddingBottom: textIconPaddingBottom,
                }}
              >
                %
              </TextMontserrat>
            </View>
            <View
              style={{
                height: containerHeight * 0.5725,
                width: separatorWidth,
                backgroundColor: this.props.error ? '#e30000' : '#174285',
              }}
            />
            {this.props.input === 'dropdown' && (
              <View>
                <View style={{ flexDirection: 'row', paddingLeft: 0, flex: 1 }}>
                  <Dropdown
                    data={this.props.items}
                    value={this.state.value}
                    boxLabelStyle={{
                      fontSize: inputFontSize,
                      color: '#174285',
                      fontFamily: 'Montserrat-SemiBold',
                    }}
                    textColor={'#174285'}
                    style={{
                      fontFamily: 'Montserrat-SemiBold',
                    }}
                    onChangeText={v => this._changeText(v)}
                    containerStyle={{
                      width: inputWidth,
                      height: containerHeight * 0.5725,
                      justifyContent: 'center',
                      paddingLeft: inputLeftPadding,
                      // backgroundColor:'green',
                    }}
                    pickerStyle={{
                      width: inputWidth - separatorWidth,
                      paddingLeft: inputLeftPadding,
                    }}
                    dropdownPosition={dropdownPosition}
                    dropdownMargins={{ min: 0, max: 0 }}
                    dropdownOffset={dropdownOffset}
                    itemTextStyle={{
                      fontFamily: 'Montserrat-SemiBold',
                      fontSize: inputFontSize,
                      fontWeight:"bold"
                    }}
                  />
                </View>
              </View>
            )}
            {this.props.input === 'textInput' && (
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'flex-end',
                  justifyContent: 'space-between',
                  paddingLeft: inputLeftPadding,
                  flex: 1,
                }}
              >
                <TextInput
                  ref={input => {
                    if (this.props.inputRef) {
                      this.props.inputRef(input);
                    }
                  }}
                  defaultValue={this.props.defaultValue}
                  value={this.state.value}
                  onChangeText={v => this._changeText(v)}
                  onFocus={() => this.setState({ focused: true })}
                  onBlur={() => this.setState({ focused: false })}
                  returnKeyType={'done'}
                  style={{
                    fontFamily: 'Montserrat-SemiBold',
                    width: inputWidth,
                    height: containerHeight * 0.5725,
                    fontSize: inputFontSize,
                    color: this.props.error ? '#e30000' : '#174285',
                    position: 'absolute',
                    left: inputLeftPadding,
                    paddingTop: 0,
                    paddingLeft:hp('0.4%'),
                    paddingBottom: textIconPaddingBottom,
                    fontWeight: '600',
                  }}
                  keyboardType={'numeric'}
                  autoCorrect={false}
                  maxLength={this.props.maximumLength}
                />
                {this.state.focused && this.state.value != '' && (
                  <TouchableOpacity
                    style={{
                      position: 'absolute',
                      // marginBottom: textIconPaddingBottom,
                      // marginRight: iconMarginRight,
                      right: iconMarginRight,
                      bottom: textIconPaddingBottom,
                    }}
                    onPress={() => {
                      actionPerform();
                      this.setState({ value: '' });
                    }}
                  >
                    <IconMaterialIcons
                      style={{ width: iconSize, height: iconSize }}
                      name={'cancel'}
                      size={iconSize}
                      color="#666"
                    />
                  </TouchableOpacity>
                )}
              </View>
            )}
          </View>
        </View>
        {/* {this.props.error && (
          <TextMontserrat style={errorStyle}>{errorMessage}</TextMontserrat>
        )} */}
      </View>
    );
  }
}
