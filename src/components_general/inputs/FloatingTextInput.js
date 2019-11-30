import React, { Component } from 'react';
import {
  View,
  TextInput,
  Text,
  Animated,
  Platform,
  Dimensions,
} from 'react-native';
import { Colors } from 'api';
import IconMaterialIcons from 'react-native-vector-icons/MaterialIcons';
import IconMaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { TextMontserrat } from 'components';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import normalize from './../utilities/helpers/normalizeText';
import EStyleSheet from 'react-native-extended-stylesheet';

/**
 * Example of input with errors and validation
  <FloatingTextInput
      label={'E-mail'}
      errors={['Enter a valid E-mail address']}
  />
  <FloatingTextInput
      label={'Password'}
      secureTextEntry={true}
      validate={{
          title: 'Password must contain',
          validations: [
              {
                  name: '5 Characters',
                  validateInput: (val) => {
                      return val.length > 5;
                  }
              },
              {
                  name: '1 Number',
                  validateInput: (val) => {
                      return /\d/.test(val);
                    }
              },
              {
                  name: '1 Special Character',
                  validateInput: (val) => {
                      return /\W+/.test(val);
                    }
              }
          ]
      }}
  />
 */

const isPortrait = () => {
  const dim = Dimensions.get('window');
  if (dim.height >= dim.width) {
    return true;
  } else {
    return false;
  }
};

class FloatingTextInput extends Component {
  state = {
    isFocused: false,
    value: this.props.value ? `${this.props.value}` : '',
    // value: this.props.defaultValue ? `${this.props.defaultValue}` : this.props.value ? `${this.props.value}` : '',
    secureTextEntry: this.props.secureTextEntry,
    isPassword: this.props.secureTextEntry,
    errors: this.props.errors || [],
    validate: this.props.validate,
    touched: this.props.touched,
    orientation: isPortrait(),
    selection: null,
    changeSelection: true,
  };
  componentDidMount() {
    // this.setState({value: this.props.value ? `${this.props.value}` : '',})
    //alert("third"+this.props.value)
    this.forceUpdate();
  }
  onSelectionChange = event => {
    const selection = event.nativeEvent.selection;
    if (this.state.changeSelection) {
      this.setState(
        {
          selection: { start: selection.start, end: selection.end },
        },
        () => {
          this.setState({
            changeSelection: true,
          });
        }
      );
      //alert(selection.start+'-'+selection.end)
    } else {
      this.setState({
        changeSelection: true,
      });
    }
  };
  componentWillMount() {
    this._animatedIsFocusedAndEmpty = new Animated.Value(
      this.state.value === '' && this.props.value === '' ? 0 : 1
    );
    this._animatedIsFocused = new Animated.Value(0);
    // if(this.props.focus === true) {
    //   this.setState({isFocused: true})
    // }
  }

  componentDidUpdate() {
    Animated.timing(this._animatedIsFocusedAndEmpty, {
      toValue:
        this.state.isFocused ||
        this.state.value !== '' ||
        this.props.focus ||
        this.props.value !== ''
          ? 1
          : 0,
      duration: 200,
    }).start();

    Animated.timing(this._animatedIsFocused, {
      toValue: this.state.isFocused ? 1 : 0,
      duration: 100,
    }).start();
  }

  iconPressHandler = () => {
    if (this.state.isPassword) {
      this.setState({ changeSelection: false });
      this.setState({
        secureTextEntry: !this.state.secureTextEntry,
      });
      return;
    }
    this.setState({ value: '' }, () => {
      this._changeText('');
      if (this.props.onTextClear) {
        this.props.onTextClear();
      }
    });
  };

  handleFocus = () => {
    this.setState({ isFocused: true, touched: true });
    if (this.props.onFocus) {
      this.props.onFocus();
    }
  };

  handleBlur = () => {
    this.setState({ isFocused: false });
    if (this.props.onBlur) {
      this.props.onBlur(this);
    }
  };

  renderValidation = () => {
    const {
      validate: { title, validations },
    } = this.props;
    const textStyle = {
      fontWeight: '600',
      fontSize: EStyleSheet.value('1rem'),
      color: '#6b6b6b',
    };

    return (
      <View style={{ flexDirection: 'row' }}>
        <TextMontserrat style={textStyle}>{title} - </TextMontserrat>
        <View>
          {validations.map((validation, i) => {
            const passed = validation.validateInput(this.state.value);
            const statusColor = passed ? '#00c38a' : '#787878';
            return (
              <View
                key={`validation_${i}`}
                style={{ flexDirection: 'row', alignItems: 'center', left: 3 }}
              >
                <IconMaterialCommunityIcons
                  name="check-circle"
                  color={statusColor}
                />
                <TextMontserrat style={{ ...textStyle, color: statusColor }}>
                  {' '}
                  {validation.name}
                </TextMontserrat>
              </View>
            );
          })}
        </View>
      </View>
    );
  };

  renderIcon = () => {
    if (this.state.isPassword) {
      const icon = this.state.secureTextEntry ? 'eye-off' : 'eye';
      return (
        <IconMaterialCommunityIcons
          style={[styles.iconStyle, this.props.iconStyle]}
          name={icon}
          size={this.props.iconSize || 24}
          color="#666"
          onPress={() => {
            this.iconPressHandler();
            // alert(JSON.stringify(this.state.selection))
            //this.input.setNativeProps({selection:this.state.selection})
            if (this.props.selectionAlg) {
              this.input.blur();
              setTimeout(() => {
                //this.setState({selection:temp})
                this.input.focus();
              }, 40);
            }
          }}
        />
      );
    } else {
      if (this.state.isFocused) {
        return (
          <IconMaterialIcons
            style={[styles.iconStyle, this.props.iconStyle]}
            name={'cancel'}
            size={this.props.iconSize || 24}
            color="#666"
            onPress={this.iconPressHandler}
          />
        );
      }
    }
  };

  _changeText = (v, extra) => {
    if (this.props.onlyNumbers) {
      if (/^[0-9+]*$/.test(v)) {
        this.setState({ value: v });
        if (this.props.onChangeText) {
          if (extra) {
            this.props.onChangeText(v, extra);
          } else {
            this.props.onChangeText(v);
          }
        }
      }
    } else if (this.props.onlyLetters) {
      if (/^[a-zA-Z ]+$/.test(v) || v == '') {
        this.setState({ value: v });
        if (this.props.onChangeText) {
          if (extra) {
            this.props.onChangeText(v, extra);
          } else {
            this.props.onChangeText(v);
          }
        }
      }
    } else if (this.props.validateQuantity) {
      if (
        /^\d{1,3}(\.\d{1,3})?$/.test(v) ||
        /^\d{1,3}\.?$/.test(v) ||
        /^\d{1,3}$/.test(v) ||
        v == ''
      ) {
        if (this.props.onChangeText) {
          if (extra) {
            this.props.onChangeText(v, extra);
          } else {
            this.props.onChangeText(v);
          }
        }
      }
    } else if (this.props.validatePrice) {
      if (
        /^\d{1,6}(\.\d{1,2})?$/.test(v) ||
        /^\d{1,6}\.?$/.test(v) ||
        /^\d{1,6}$/.test(v) ||
        v == ''
      ) {
        if (this.props.onChangeText) {
          if (extra) {
            this.props.onChangeText(v, extra);
          } else {
            this.props.onChangeText(v);
          }
        }
      }
    } else {
      this.setState({ value: v });

      if (this.props.onChangeText) {
        if (extra) {
          this.props.onChangeText(v, extra);
        } else {
          this.props.onChangeText(v);
        }
      }
    }
  };

  _hasError = () => {
    if (this.state.isFocused && this.state.isPassword) {
      return false;
    }
    if (this.props.errors) {
      return this.props.errors.length > 0;
    }
    return false;
  };

  showFlag = () => {
    if (this.props.focus) {
      return true;
    }

    if (this.state.value !== '') {
      return true;
    }

    if (this.props.children && this.state.isFocused) {
      return true;
    }

    return false;
  };

  render() {
    const leftPadding = this.props.lineLeft ? 10 : 0;
    const paddingLeftFlags = this.props.children
      ? this.state.orientation
        ? wp('1.5%')
        : wp('0.5%')
      : 0; // portrait - landscape - no children
    const { isFocused, secureTextEntry } = this.state;
    let value = this.props.value;
    //if(value.indexOf('a')==-1)alert(value)
    const {
      label,
      underline,
      inputStyle,
      keyboardType,
      returnKeyType,
      onSubmitEditing,
      maxLength,
      autoCapitalize,
    } = this.props;

    const inputActiveColor = this._hasError() ? Colors.danger : Colors.primary;
    const inputInActiveColor = this._hasError() ? Colors.danger : '#6b6b6b';
    const ExtendedStyles = EStyleSheet.create({
      labelDown: {
        fontSize: '1.6rem',
      },
      labelUp: {
        fontSize: '1.2rem',
      },
      labelOptionalDown: {
        fontSize: this.props.optionalLabelFontsizeDown || hp('2.2%'), //'1.3rem',
      },
      labelOptionalUp: {
        fontSize: this.props.optionalLabelFontsizeUp || hp('1.9%'), //'1.0rem',
      },
      underline: {
        height: '.2rem',
      },
      textInput: {
        fontSize: '1.4rem',
      },
      errorText: {
        fontSize: '1.1rem',
      },
      '@media (min-width: 500)': {
        textInput: {
          fontSize: '1.6rem',
        },
      },
    });

    const textInputStyle = {
      fontSize: ExtendedStyles.textInput.fontSize,
      color:
        isFocused || this.props.setFocused
          ? inputActiveColor
          : inputInActiveColor,
      paddingVertical: 0,
      height: EStyleSheet.value('4rem') + (this.props.height || 0),
      marginTop: this.props.margin || 20,
      fontFamily: 'Montserrat-SemiBold',
      width: '80%',
    };

    const leftOffset = Platform.OS === 'ios' ? 0 : 0;

    const labelStyle = {
      position: 'absolute',
      fontFamily: 'Montserrat-SemiBold',
      left: leftOffset + leftPadding,
      top: this._animatedIsFocusedAndEmpty.interpolate({
        inputRange: [0, 1],
        outputRange: [
          this.props.labelPlacingDown || 28,
          this.props.labelPlacingUp || this.props.topper || 5,
        ],
      }),
      fontSize: this._animatedIsFocusedAndEmpty.interpolate({
        inputRange: [0, 1],
        outputRange: [
          this.props.labelSizeDown || ExtendedStyles.labelDown.fontSize,
          this.props.labelSizeUp || ExtendedStyles.labelUp.fontSize,
        ],
      }),
      color: '#6b6b6b',
      ...this.props.labelStyle,
    };
    optionalLabelStyle = {
      fontSize: this._animatedIsFocusedAndEmpty.interpolate({
        inputRange: [0, 1],
        outputRange: [
          this.props.optionalLabelSizeDown ||
            ExtendedStyles.labelOptionalDown.fontSize,
          this.props.optionalLabelSizeUp ||
            ExtendedStyles.labelOptionalUp.fontSize,
        ],
      }),
    };

    const underlineStyle = {
      left: leftOffset,
      backgroundColor: this._animatedIsFocused.interpolate({
        inputRange: [0, 1],
        outputRange: this.props.setFocused
          ? [inputActiveColor, inputActiveColor]
          : ['#eee', inputActiveColor],
      }),
      height: ExtendedStyles.underline.height,
      width: '100%',
      marginBottom: 1,
      ...this.props.underlineStyle,
    };

    setDateAsValue = newValue => {
      this.setState({
        value: newValue,
      });
    };

    renderUnderline = () => {
      if (underline != false) {
        return <Animated.View style={underlineStyle} />;
      }
    };

    renderErrors = (color, offset, fontSize) => {
      if (!this.props.errors) return false;
      if (this.state.isPassword && this.state.isFocused) {
        return false;
      }
      return this.props.errors.map((error, i) => {
        error = error[0].toUpperCase() + error.slice(1);
        return (
          <TextMontserrat
            key={`err_${i}`}
            style={{
              fontWeight: '600',
              color: color,
              left: offset,
              fontSize: fontSize,
            }}
          >
            {error}
          </TextMontserrat>
        );
      });
    };
    const CancelIcon = this.props.cancelIcon || true;
    return (
      <View
        style={[
          {
            width: '100%',
            marginBottom:
              this._hasError() && !this.props.editProdutText
                ? hp('2.5%')
                : this.props.hideValidations
                ? 0
                : this.state.isPassword && this.state.isFocused
                ? hp('4%')
                : 0,
          },
          this.props.inputContainerStyle || {},
        ]}
      >
        <Animated.Text style={labelStyle}>
          {label}{' '}
          {this._hasError() && this.state.touched && (
            <IconMaterialCommunityIcons
              size={hp('1.95%')}
              name="alert-circle"
              color={inputActiveColor}
            />
          )}
          <Animated.Text style={optionalLabelStyle}>
            {this.props.labelOptional ? this.props.labelOptional : ''}
          </Animated.Text>
        </Animated.Text>
        <View style={{ flexDirection: 'row' }}>
          {this.props.nocancel ? null : this.renderIcon()}
          {this.props.lineLeft && (
            <View
              style={{
                width: 1,
                height: hp('3.8%'),
                backgroundColor: this.state.isFocused
                  ? inputActiveColor
                  : '#eee',
                position: 'absolute',
                bottom: 0,
              }}
            />
          )}
          {this.showFlag() && (
            <View
              style={{
                alignSelf: 'flex-end',
                marginBottom: this.props.newSeparatorStyle
                  ? this.state.orientation
                    ? hp('1%')
                    : hp('1.6%')
                  : 8,
              }}
            >
              {this.props.children}
            </View>
          )}
          {this.props.newSeparatorStyle
            ? this.props.phone &&
              this.showFlag() && (
                <View
                  style={{
                    height: '100%',
                    width: this.state.orientation ? wp('0.5%') : wp('0.25%'),
                    justifyContent: 'flex-end',
                    alignItems: 'flex-end',
                  }}
                >
                  <View
                    style={{
                      width: this.state.orientation ? wp('0.5%') : wp('0.25%'),
                      height: this.state.orientation ? hp('4%') : hp('5.4%'),
                      backgroundColor: this.state.isFocused
                        ? inputActiveColor
                        : '#eee',
                    }}
                  />
                </View>
              )
            : null}
          <TextInput
            onSelectionChange={
              this.props.selectionAlg ? this.onSelectionChange : null
            }
            editable={!this.props.disabled}
            ref={input => {
              this.input = input;
              //this.input.setNativeProps({value})
              if (this.props.inputRef) {
                this.props.inputRef(input);
              }
            }}
            style={[
              textInputStyle,
              {
                paddingLeft: leftPadding + paddingLeftFlags,
                marginLeft: paddingLeftFlags,
                borderLeftWidth: this.props.phone && this.showFlag() ? 2 : 0,
                borderColor: this.state.isFocused ? inputActiveColor : '#eee',
                fontFamily: 'Montserrat-SemiBold',
                fontWeight: 'normal',
              },
              inputStyle,
            ]}
            clearTextOnFocus={false} // POSSIBLE FIX FOR SECURITY CLEAR
            onFocus={this.handleFocus}
            onBlur={this.handleBlur}
            value={this.props.date ? this.props.value : value}
            onChangeText={v => {
              this._changeText(v);
            }}
            secureTextEntry={secureTextEntry}
            keyboardType={keyboardType}
            underlineColorAndroid="transparent"
            returnKeyType={returnKeyType}
            onSubmitEditing={onSubmitEditing}
            maxLength={this.state.isFocused || value != '' ? maxLength : 0}
            autoCapitalize={autoCapitalize}
            selection={this.props.selection || this.state.selection}
            defaultValue={this.props.defaultValue}
            onContentSizeChange={this.props.onContentSizeChange}
          />
          {this.props.nocancel ? null : this.renderIcon()}
        </View>
        {renderUnderline()}
        {!this.props.editProdutText &&
          this.state.touched &&
          renderErrors(
            inputActiveColor,
            leftOffset,
            // ExtendedStyles.errorText.fontSize
            this.state.orientation ? wp('3%') : hp('1.85%')
          )}
        {!this.props.hideValidations
          ? !!this.props.validate &&
            (this.state.isFocused || this.props.alwaysValidation) &&
            this.renderValidation()
          : null}
      </View>
    );
  }
}
const styles = {
  iconStyle: {
    position: 'absolute',
    right: 5,
    top: '50%',

    zIndex: 50,
  },
};
export default FloatingTextInput;
