import React, { Component } from 'react';
import { View, TextInput, Dimensions, Platform } from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { isTablet } from '../../../../../cash_register/constants/isLandscape';

const isPortrait = () => {
  return !isTablet;
};

class OtpInputs extends Component {
  inputs = {};
  focusTheField = id => {
    this.inputs[id].focus();
  };
  state = {
    otp: {},

    orientation: isPortrait(),
  };

  _handle_change = (value, i, callback) => {
    if (/^(\s*|\d+)$/.test(value)) {
      this.setState(
        prevState => ({
          otp: {
            ...prevState.otp,
            [i]: value,
          },
        }),
        () => {
          if (value !== '') {
            callback();
          }
        }
      );
    }
  };

  _clean_fields = () => {
    const otp = {};
    for (const key in this.state.otp) {
      otp[key] = '';
    }
    console.log(otp);
    this.setState({ otp });
  };
  getOtpString = () => {
    let string_val = '';
    for (const key in this.state.otp) {
      string_val = `${string_val}${this.state.otp[key]}`;
    }
    return string_val;
  };
  _handle_complete = () => {
    this.props.onComplete(parseInt(this.getOtpString()));
  };

  _get_color_status = () => {
    if (this.props.invalid && !this.props.valid) {
      return '#D0021B';
    } else {
      if (this.props.valid) {
        return '#09BA83';
      }
      return '#8CA1C3';
    }
  };

  renderInputs = () => {
    const border = 5;
    const inputsArr = this.props.data;
    return inputsArr.map((x, i) => {
      const isFirst = i === 0;
      const isLast = i === inputsArr.length - 1;

      const firstViewStyle = isFirst
        ? {
            borderTopLeftRadius: border,
            borderBottomLeftRadius: border,
          }
        : {};

      const lastViewStyle = isLast
        ? {
            borderTopRightRadius: border,
            borderBottomRightRadius: border,
            borderRightWidth: 0.5, //this.props.custom?1:1.5,
          }
        : {};
      const { custom } = this.props;
      const viewStyle = {
        ...styles.container,
        borderColor: this._get_color_status(),
        elevation: 0.5,
        backgroundColor: '#fff',
        ...firstViewStyle,
        ...lastViewStyle,
        width: custom
          ? isPortrait()
            ? wp('12.5%')
            : wp('4.9%')
          : isPortrait()
          ? wp('10.5%')
          : wp('6%'),
        //borderWidth:custom?0: 0,
      };

      return (
        <View key={`input_${i}`} style={viewStyle}>
          <TextInput
            ref={input => {
              this.inputs[x] = input;
            }}
            returnKeyType={isLast ? 'done' : 'next'}
            onSubmitEditing={() => {
              var incomplete =
                Object.values(this.state.otp).length < this.props.data.length ||
                Object.values(this.state.otp).includes('');
              if (incomplete) {
                if (isLast) {
                  this._handle_complete();
                } else {
                  this.focusTheField(inputsArr[i + 1]);
                }
              } else {
                this._handle_complete();
              }
            }}
            value={this.state.otp[i]}
            onChangeText={value =>
              this._handle_change(value, i, () => {
                this.props.onChange(this.getOtpString());

                var incomplete =
                  Object.values(this.state.otp).length <
                    this.props.data.length ||
                  Object.values(this.state.otp).includes('');
                //alert(JSON.stringify(incomplete))
                if (incomplete) {
                  if (!isLast) {
                    this.focusTheField(inputsArr[i + 1]);
                  }
                  if (isLast && value != '') {
                    this._handle_complete();
                  }
                } else {
                  this._handle_complete();
                }
              })
            }
            onKeyPress={({ nativeEvent }) => {
              if (this.props.cleanError) {
                this.props.cleanError();
              }
              if (nativeEvent.key === 'Backspace') {
                this.props.onChange();
                if (!isFirst) this.focusTheField(inputsArr[i - 1]);
              }
            }}
            onFocus={() => {
              if (this.props.handleFocus) this.props.handleFocus();
            }}
            onBlur={() => {
              if (this.props.handleBlur) this.props.handleBlur();
            }}
            style={[styles.input, custom ? { width: wp('24.5%') } : null]}
            keyboardType="numeric"
            maxLength={1}
            blurOnSubmit={isLast ? true : false}
            underlineColorAndroid="transparent"
          />
        </View>
      );
    });
  };

  render() {
    return (
      <View>
        <View
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            top: 0,
            left: 0,
            elevation: 2.7,
          }}
        />
        <View
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            top: 0,
            left: 0,
            elevation: 2.8,
          }}
        />
        <View
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            top: 0,
            left: 0,
            elevation: 2.9,
          }}
        />
        <View
          style={{
            flexDirection: 'row',
            borderRadius: 5,
            backgroundColor: '#fff',
            elevation: 3,
          }}
        >
          {this.renderInputs()}
        </View>
      </View>
    );
  }
}

const styles = {
  container: {
    height: isPortrait() ? hp('6.25') : hp('8%'),
    width: isPortrait() ? wp('10.5%') : wp('6%'),
    paddingTop: isPortrait() ? hp('0%') : hp('0%'),
    justifyContent: 'center',
    alignItems: 'center',
    //borderWidth: 1.5,
    borderWidth: 0.5,
    borderRightWidth: 0,
    backgroundColor: '#fff',
  },
  input: {
    height: isPortrait()
      ? Platform.OS === 'ios'
        ? hp('6.25%')
        : hp('6%')
      : hp('7.75%'),
    width: isPortrait() ? wp('10%') : wp('5.75%'),
    bottom: isPortrait()
      ? Platform.OS === 'ios'
        ? hp('0.1%')
        : hp('0.5%')
      : hp('0%'),
    fontFamily: 'Montserrat-SemiBold',
    fontSize: isPortrait() ? wp('6%') : hp('5%'),
    color: '#5D6770',
    paddingBottom: 0,
    textAlign: 'center',
  },
};

export default OtpInputs;
