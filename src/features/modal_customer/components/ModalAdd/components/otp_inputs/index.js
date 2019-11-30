import React, { Component } from 'react';
import {
  View,
  TextInput,
  DeviceEventEmitter,
  Dimensions,
  Keyboard,
} from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { isTablet } from 'components';

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
  };

  componentDidMount() {
    DeviceEventEmitter.addListener('onKeyPressed', e => {
      console.log(e);
    });
  }

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
    this.setState({ otp });
  };

  _handle_complete = () => {
    let string_val = '';
    for (const key in this.state.otp) {
      string_val = `${string_val}${this.state.otp[key]}`;
    }

    this.props.onComplete(parseInt(string_val));
  };

  _get_color_status = () => {
    if (this.props.invalid && !this.props.valid) {
      return '#D0021B';
    } else {
      if (this.props.valid) {
        return '#09BA83';
      }
      return '#174285';
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
            borderRightWidth: hp('0.1%'),
          }
        : {};

      const viewStyle = {
        ...styles.container,
        borderColor: this.props.borderColors, //this._get_color_status(),
        // elevation: hp('0.65%'),
        backgroundColor: '#fff',
        ...firstViewStyle,
        ...lastViewStyle,
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
              if (nativeEvent.key === 'Backspace') {
                if (!isFirst) {
                  this.focusTheField(inputsArr[i - 1]);
                  this.props.cleanErrors();
                }
              }
            }}
            style={styles.input}
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
      <View
        style={{
          flexDirection: 'row',
          borderRadius: 5,
          backgroundColor: '#fff',
          //elevation: hp('0.65%'),
        }}
      >
        {this.renderInputs()}
      </View>
    );
  }
  cal;
}

const styles = {
  container: {
    height: isPortrait() ? hp('6.25%') : hp('8%'),
    width: isPortrait() ? wp('12.5%') : wp('6%'),
    paddingTop: isPortrait() ? hp('0%') : hp('0%'),
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: isPortrait() ? hp('0.1%') : hp('0.1%'),
    borderRightWidth: 0,
    backgroundColor: '#fff',
  },
  input: {
    height: isPortrait() ? hp('6.25%') : hp('8%'),
    width: isPortrait() ? wp('12.5%') : wp('6%'),
    fontFamily: 'Montserrat-SemiBold',
    fontSize: isPortrait() ? wp('6%') : hp('5%'),
    color: '#5D6770',
    paddingBottom: 0,
    textAlign: 'center',
  },
};

export default OtpInputs;
