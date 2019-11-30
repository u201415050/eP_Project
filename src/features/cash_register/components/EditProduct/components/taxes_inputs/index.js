import React, { Component } from 'react';
import { View, TextInput, TouchableOpacity } from 'react-native';
import { TextMontserrat } from 'components';
import IconMaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { Dropdown } from 'react-native-material-dropdown';

export default class TaxInput extends Component {
  constructor(props) {
    super(props);
  }

  state = {
    value: this.props.value,
    showDropdown: false,
  };

  componentDidMount() {
    this.setState({ value: this.props.value });
  }

  UNSAFE_componentWillReceiveProps(props) {
    //this.setState({value: props.value})
  }

  _changeText = v => {
    if (this.props.onChangeText) {
      this.setState({ value: v }, () => this.props.onChangeText(v));
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

    //var obj = JSON.parse('{ "firstName":"name1", "lastName": "last1" }');
    //["5", "12", "18", "28"]
    //console.log('TAXES', this.props.items);
    let dropdownDataStr = this.props.items
      ? this.props.items.substring(1, this.props.items.length - 1).split(',')
      : [];

    let data =
      dropdownDataStr.length > 0
        ? dropdownDataStr.map(function(item) {
            return JSON.parse('{ "value":' + item + '}');
          })
        : [];

    return (
      <View>
        <View
          style={{
            height: containerHeight,
            width: containerWidth ? containerWidth : '100%',
            justifyContent: 'space-between',
            borderBottomWidth: borderBottom,
            borderBottomColor: this.props.error ? 'red' : '#174285',
          }}
        >
          <TextMontserrat
            style={{ fontWeight: '600', fontSize: labelSize, color: '#6B6B6B' }}
          >
            {label}
          </TextMontserrat>
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
                backgroundColor: this.props.error ? 'red' : '#174285',
              }}
            />
            {this.props.input === 'dropdown' && (
              <View>
                <View style={{ flexDirection: 'row', paddingLeft: 0, flex: 1 }}>
                  <Dropdown
                    data={data}
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
                    /*
                        renderBase={() => (
                          <IconDropdown
                            color="#666"
                            style={{width:iconSize, height:iconSize}}
                            onPress={null}
                            name={'md-arrow-dropdown'}
                            size={iconSize}
                            />
                        )}   */

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
                  value={this.state.value}
                  onChangeText={v => this._changeText(v)}
                  style={{
                    fontFamily: 'Montserrat-SemiBold',
                    width: inputWidth,
                    height: containerHeight * 0.5725,
                    fontSize: inputFontSize,
                    color: this.props.error ? 'red' : '#174285',
                    position: 'absolute',
                    left: inputLeftPadding,
                    paddingTop: 0,
                    paddingBottom: textIconPaddingBottom,
                    fontWeight: 'normal',
                  }}
                  keyboardType={'numeric'}
                  autoCorrect={false}
                  maxLength={this.props.maximumLength}
                />
                <TouchableOpacity
                  style={{
                    position: 'absolute',
                    // marginBottom: textIconPaddingBottom,
                    // marginRight: iconMarginRight,
                    right: iconMarginRight,
                    bottom: textIconPaddingBottom,
                  }}
                  onPress={actionPerform}
                >
                  <IconMaterialIcons
                    style={{ width: iconSize, height: iconSize }}
                    name={'cancel'}
                    size={iconSize}
                    color="#666"
                  />
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
        {this.props.error && (
          <TextMontserrat style={errorStyle}>{errorMessage}</TextMontserrat>
        )}
      </View>
    );
  }
}
