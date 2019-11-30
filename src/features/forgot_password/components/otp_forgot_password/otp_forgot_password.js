import React, { Component } from 'react';
import * as _ from 'lodash';
import {
  View,
  Dimensions,
  ScrollView,
  KeyboardAvoidingView,
  TouchableOpacity,
  Image,
  Platform,
} from 'react-native';
import {
  PopUp,
  TextMontserrat,
  ButtonGradient,
  ButtonClose,
  FloatingTextInput,
  Timer,
  Loading,
} from 'components';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import NavigationService from 'services/navigation';

import EStyleSheet from 'react-native-extended-stylesheet';
import OtpInputs from './components/otp_inputs';
import { ButtonGradientCustom } from './components/buttons';
import { portraitStyles } from './styles/portrait';
import { landscapeStyles } from './styles/landscape';
import { Alert } from '../alert_message';
import { BoxShadow } from 'react-native-shadow';
import { isTablet } from 'components';
import { LOGIN } from '../../../../navigation/screen_names';

const isPortrait = () => {
  return !isTablet;
};

class OtpForgotPassword extends Component {
  state = {
    password: '',
    password_confirm: '',

    showAlert: false,
    errorMessage: [],

    can_resend_otp: false,
    can_reset_password: false,
    orientation: isPortrait(),
    errors: {},
    padding: -hp('40%'),
  };

  renderTopMessages = () => {
    const textStyle = {
      fontSize: hp('2.4%'),
      textAlign: 'center',
      fontWeight: '700',
      color: '#4e5965',
      width: '100%',
    };
    return this.props.message.map((element, i) => (
      <TextMontserrat key={i} style={textStyle}>
        {element}
      </TextMontserrat>
    ));
  };

  timer = null;
  inputs = {};

  _password_validations = () => {
    return {
      title: 'Password must contain',
      validations: [
        {
          name: '8 Characters',
          validateInput: val => {
            return val.length > 7;
          },
        },
        {
          name: '1 Number',
          validateInput: val => {
            return /\d/.test(val);
          },
        },
        {
          name: '1 Special Character',
          validateInput: val => {
            return /\W+/.test(val);
          },
        },
      ],
    };
  };

  _password_match = () => {
    if (this.state.password !== this.state.password_confirm) {
      return ['Passwords do not match!'];
    }
    return [];
  };

  _check_match = () => {
    //alert(1);
    this.setState({ padding: -hp('40%') });
    if (this.state.password !== this.state.password_confirm) {
      return this.setState({
        errors: {
          ...(this.state.errors || {}),
          retype: ['Passwords are not matching!'],
        },
      });
    }
  };

  _passwords_validate = () => {
    if (this.state.password === '') {
      this.setState({
        errorMessage: ['Please enter new password.'],
        showAlert: true,
      });
      return true;
    }

    if (
      this.state.password.length < 8 ||
      !/\d/.test(this.state.password) ||
      !/\W+/.test(this.state.password)
    ) {
      this.setState({
        errorMessage: [
          'Password must contain 8 characters, 1 number and 1 special character.',
        ],
        showAlert: true,
      });
      return true;
    }

    if (this.state.password_confirm === '') {
      this.setState({
        errorMessage: ['Please retype your password.'],
        showAlert: true,
      });
      return true;
    }

    if (this.state.password_confirm !== this.state.password) {
      this.setState(
        { errorMessage: ['Passwords are not matching.'], showAlert: true },
        () => {
          this.setState({
            errors: {
              ...(this.state.errors || {}),
              retype: ['Passwords are not matching!'],
            },
          });
        }
      );
      return true;
    }
  };

  opt_inputs = null;

  render() {
    const { style, buttonTitle, onClosePress } = this.props;

    const popupContainer = EStyleSheet.create({
      ...style,
      height: this.state.orientation ? hp('81.25%') : hp('89.8%'),
      width: this.state.orientation ? '85%' : '46%',
      paddingHorizontal: this.state.orientation ? wp('6%') : wp('3%'),
      paddingTop: this.state.orientation ? hp('2.5%') : hp('2.5%'),
    });

    const numberText = {
      textAlign: 'center',
      fontWeight: '700',
      fontSize: hp('2.7%'),
      color: '#174285',
    };

    const labelOtp = {
      textAlign: 'center',
      fontWeight: '700',
      marginBottom: hp('1%'),
      fontSize: this.state.orientation ? wp('3.7%') : hp('2.8%'),
      color: '#6B6B6B',
    };

    const mainContainer = {
      flex: 1,
    };
    const closeContainer = {
      width: '100%',
      alignItems: 'flex-end',
      height: hp('3%'),
    };

    const containerTopMessages = {};

    const containerPhoneNumber = {
      marginBottom: this.state.orientation ? hp('2.5%') : hp('2.5%'),
    };

    const containerOtpFields = {
      alignItems: 'center',
    };

    const containerTimer = {
      marginTop: this.state.orientation ? hp('1%') : hp('1%'),
      marginBottom: this.state.orientation ? hp('3.5%') : hp('1.5%'),
    };

    const timerText = {
      fontSize: this.state.orientation ? wp('7.5%') : hp('5%'),
      fontWeight: 'bold',
      color: '#5D6770',
      textAlign: 'center',
    };

    const resendContainer = {
      alignItems: 'center',
    };

    const shadowOpt = {
      width: this.state.orientation
        ? wp('10.5%') * 6 - wp('1.6%')
        : wp('6%') * 6 - wp('1.5%'),
      height: this.state.orientation
        ? hp('6.25') - hp('0.85%')
        : hp('8%') - hp('1.75%'),
      color: '#000',
      border: this.state.orientation ? hp('1%') : hp('1.8%'),
      radius: this.state.orientation ? 5 : 5,
      opacity: 0.3,
      x: this.state.orientation ? wp('1.4%') : wp('1.2%'),
      y: this.state.orientation ? hp('0.8%') : hp('1.6%'),
    };

    var numberTemp = this.props.reset_password.mobile_number;
    var phoneNumberTemp = numberTemp.substring(
      numberTemp.length - 10,
      numberTemp.length
    );
    var countryCodeTemp = numberTemp.replace(phoneNumberTemp, '');

    console.log('props forgot');
    console.log(
      !this.props.reset_password.otp_valid +
        ' -- ' +
        !this.props.reset_password.auth_key
    );

    return (
      <PopUp
        style={popupContainer}
        paddingAvoid={this.state.padding}
        Avoid={Platform.OS === 'ios' ? true : false}
      >
        <View>
          {this.props.reset_password.loading && <Loading />}

          <View style={closeContainer}>
            <TouchableOpacity
              style={{ position: 'absolute', right: -hp('1%') }}
              onPress={this.props.dismiss_otp}
            >
              <Image
                style={{ height: hp('2.7%'), width: hp('2.7%') }}
                source={require('../../../cash_register/assets/icons/close.png')}
              />
            </TouchableOpacity>
          </View>
          <View style={containerTopMessages}>{this.renderTopMessages()}</View>
          <View style={containerPhoneNumber}>
            <TextMontserrat style={numberText}>
              {countryCodeTemp + ' ' + phoneNumberTemp}
            </TextMontserrat>
          </View>

          <View
            style={{ height: this.state.orientation ? hp('32%') : hp('35%') }}
          >
            <View style={containerOtpFields}>
              <TextMontserrat style={labelOtp}> Insert OTP </TextMontserrat>
              <View
                style={{
                  height: this.state.orientation ? hp('10%') : hp('11.5%'),
                  width: '100%',
                  alignItems: 'center',
                }}
              >
                <BoxShadow setting={shadowOpt}>
                  <OtpInputs
                    ref={input => (this.opt_inputs = input)}
                    valid={this.props.reset_password.otp_valid}
                    invalid={this.props.reset_password.otp_invalid}
                    onChange={() => {}}
                    data={[
                      'first',
                      'second',
                      'third',
                      'fourth',
                      'fifth',
                      'sixth',
                    ]}
                    onComplete={async otp => {
                      await this.props.validate_otp(
                        this.props.reset_password.mobile_number,
                        otp
                      );
                    }}
                    cleanError={() => {
                      this.props.clean_error_otp();
                    }}
                  />
                </BoxShadow>
                {this.props.reset_password.otp_invalid && (
                  <TextMontserrat
                    style={{
                      fontWeight: '600',
                      fontSize: this.state.orientation
                        ? wp('3.1%')
                        : hp('1.9%'),
                      color: '#D0021B',
                      marginTop: this.state.orientation
                        ? hp('1.5%')
                        : hp('2.5%'),
                    }}
                  >
                    Incorrect OTP - Re-insert or resend
                  </TextMontserrat>
                )}
              </View>
            </View>
            <View style={containerTimer}>
              <Timer
                ref={timer => (this.timer = timer)}
                textStyle={timerText}
                onStart={() => this.setState({ can_resend_otp: false })}
                onFinished={() => this.setState({ can_resend_otp: true })}
                minutes={3}
              />
            </View>
            <View style={resendContainer}>
              <View
                style={{
                  width: '100%',
                  alignItems: 'center',
                }}
              >
                <ButtonGradientCustom
                  style={
                    this.state.orientation
                      ? portraitStyles.buttonResendOtp
                      : landscapeStyles.buttonResendOtp
                  }
                  buttonTextStyle={
                    this.state.orientation
                      ? portraitStyles.textResendOtp
                      : landscapeStyles.textResendOtp
                  }
                  title={buttonTitle}
                  disabled={!this.state.can_resend_otp}
                  onPress={() => {
                    this.setState({
                      errors: {
                        ...(this.state.errors || {}),
                        retype: [],
                      },
                    });

                    this.timer.restart();
                    this.props.resend_otp(
                      this.props.reset_password.mobile_number
                    );
                    this.opt_inputs._clean_fields();
                    this.props.reset_password.otp_valid = false;
                    this.props.reset_password.otp_invalid = false;
                    this.props.reset_password.auth_key = false;
                  }}
                />
              </View>
            </View>
          </View>
          <View style={{ height: hp('33.5%') }}>
            <TextMontserrat
              style={{
                fontSize: this.state.orientation ? wp('3.7%') : hp('2.8%'),
                fontWeight: 'bold',
                textAlign: 'center',
              }}
            >
              Enter new password
            </TextMontserrat>

            <FloatingTextInput
              label={'Password'}
              onFocus={() => {
                this.setState({ padding: -hp('10%') });
              }}
              hideValidations={true}
              secureTextEntry={true}
              onBlur={() => this.setState({ padding: -hp('40%') })}
              //editable={false}
              value={this.state.password}
              validate={this._password_validations()}
              onChangeText={password => this.setState({ password })}
              labelSizeUp={this.state.orientation ? wp('3.2%') : hp('2.2%')}
              labelSizeDown={this.state.orientation ? wp('3.8%') : hp('2.7%')}
              labelPlacingUp={0}
              labelPlacingDown={this.state.orientation ? hp('4%') : hp('4%')}
              inputContainerStyle={
                this.state.orientation
                  ? { height: hp('7%'), marginBottom: hp('1%') }
                  : { height: hp('9%'), marginBottom: hp('1%') }
              }
              inputStyle={
                this.state.orientation
                  ? {
                      fontSize: wp('3.8%'),
                      height: hp('5%'),
                      marginTop: hp('3%'),
                      paddingBottom: 0,
                    }
                  : {
                      fontSize: hp('2.7%'),
                      height: hp('6.9%'),
                      marginTop: hp('3%'),
                      paddingBottom: 0,
                    }
              }
              underlineStyle={
                this.state.orientation
                  ? { height: hp('0.4%') }
                  : { height: hp('0.4%') }
              }
              iconStyle={
                this.state.orientation
                  ? { bottom: hp('0.1%'), zIndex: 0 }
                  : { bottom: hp('0.1%'), zIndex: 0 }
              }
              iconSize={this.state.orientation ? hp('3%') : hp('3.8%')}
            />
            <FloatingTextInput
              inputRef={input => (this.retypeInput = input)}
              label={'Re-type Password'}
              onFocus={() => {
                this.setState({ padding: -hp('10%') });
              }}
              hideValidations={true}
              secureTextEntry={true}
              //editable={false}
              // errors={this.state.errors.errorRetype}
              // onBlur={this._check_match()}
              onSubmitEditing={this._check_match.bind(this)}
              onBlur={() => {
                this.setState({ padding: -hp('40%') });
                this._check_match.bind(this);
              }}
              // onChangeText={val => {
              //                 this._textChange('UserFirstName', val);
              //                 this.setState({errors: {
              //                   ...this.state.errors,
              //                   firstName: [],},
              //                 })}
              //               }
              errors={this.state.errors.retype || []}
              value={this.state.password_confirm}
              onChangeText={password_confirm =>
                this.setState({ password_confirm }, () => {
                  this.setState({
                    errors: {
                      ...(this.state.errors || {}),
                      retype: [],
                    },
                  });
                })
              }
              labelSizeUp={this.state.orientation ? wp('3.2%') : hp('2.2%')}
              labelSizeDown={this.state.orientation ? wp('3.8%') : hp('2.7%')}
              labelPlacingUp={0}
              labelPlacingDown={this.state.orientation ? hp('4%') : hp('4%')}
              inputContainerStyle={
                this.state.orientation
                  ? { height: hp('7%') }
                  : { height: hp('7%') }
              }
              inputStyle={
                this.state.orientation
                  ? {
                      fontSize: wp('3.8%'),
                      height: hp('5%'),
                      marginTop: hp('3%'),
                      paddingBottom: 0,
                    }
                  : {
                      fontSize: hp('2.7%'),
                      height: hp('6.9%'),
                      marginTop: hp('3%'),
                      paddingBottom: 0,
                    }
              }
              underlineStyle={
                this.state.orientation
                  ? { height: hp('0.4%') }
                  : { height: hp('0.4%') }
              }
              iconStyle={
                this.state.orientation
                  ? { bottom: hp('0.1%'), zIndex: 0 }
                  : { bottom: hp('0.1%'), zIndex: 0 }
              }
              iconSize={this.state.orientation ? hp('3%') : hp('3.8%')}
            />
            <View
              style={{
                marginTop: this.state.orientation ? hp('4%') : hp('5%'),
                alignItems: 'center',
              }}
            >
              <ButtonGradientCustom
                style={
                  this.state.orientation
                    ? portraitStyles.buttonResetPassword
                    : landscapeStyles.buttonResetPassword
                }
                buttonTextStyle={
                  this.state.orientation
                    ? portraitStyles.textResetPassword
                    : landscapeStyles.textResetPassword
                }
                disabled={
                  !this.props.reset_password.otp_valid &&
                  !this.props.reset_password.auth_key
                }
                title={'RESET PASSWORD'}
                onPress={() => {
                  // if(this.state.password !== this.state.password_confirm){
                  //   this.setState({errors: this._password_match()})
                  // }
                  this.retypeInput.blur();

                  if (!this._passwords_validate()) {
                    if (this._password_match().length === 0) {
                      const {
                        mobile_number,
                        otp_code,
                        auth_key,
                      } = this.props.reset_password;
                      const { password } = this.state;
                      this.props.reset_pass(
                        mobile_number,
                        otp_code,
                        password,
                        auth_key
                      );
                    }
                  }
                }}
              />
            </View>
            {this.state.showAlert && (
              <Alert
                style={
                  this.state.orientation
                    ? { width: wp('85%') }
                    : { width: wp('45.7%') }
                }
                buttonStyle={
                  this.state.orientation
                    ? {
                        width: wp('50%'),
                        height: hp('6.25'),
                        justifyContent: 'center',
                        alignItems: 'center',
                        borderRadius: hp('6%'),
                        marginTop: hp('1.5%'),
                      }
                    : {
                        width: wp('26.3%'),
                        height: hp('7.8%'),
                        justifyContent: 'center',
                        alignItems: 'center',
                        borderRadius: hp('6%'),
                        marginTop: hp('2.5%'),
                      }
                }
                buttonTextStyle={
                  this.state.orientation
                    ? { fontWeight: '700', color: '#fff', fontSize: wp('3.5%') }
                    : { fontWeight: '700', color: '#fff', fontSize: hp('2.8%') }
                }
                message={this.state.errorMessage}
                messageStyle={
                  this.state.orientation
                    ? { fontSize: wp('3.7%') }
                    : { fontSize: hp('2.8%') }
                }
                buttonTitle={'OK'}
                onPress={() => this.setState({ showAlert: false })}
              />
            )}
            {_.get(this.props, 'reset_password.alert', []).length > 0 && (
              <Alert
                style={
                  this.state.orientation
                    ? { width: wp('85%') }
                    : { width: wp('45.7%') }
                }
                buttonStyle={
                  this.state.orientation
                    ? {
                        width: wp('50%'),
                        height: hp('6.25'),
                        justifyContent: 'center',
                        alignItems: 'center',
                        borderRadius: hp('6%'),
                        marginTop: hp('1.5%'),
                      }
                    : {
                        width: wp('26.3%'),
                        height: hp('7.8%'),
                        justifyContent: 'center',
                        alignItems: 'center',
                        borderRadius: hp('6%'),
                        marginTop: hp('2.5%'),
                      }
                }
                buttonTextStyle={
                  this.state.orientation
                    ? { fontWeight: '700', color: '#fff', fontSize: wp('3.5%') }
                    : { fontWeight: '700', color: '#fff', fontSize: hp('2.8%') }
                }
                message={_.get(this.props, 'reset_password.alert', [])}
                messageStyle={
                  this.state.orientation
                    ? { fontSize: wp('3.7%') }
                    : { fontSize: hp('2.8%') }
                }
                buttonTitle={'OK'}
                onPress={() => {
                  this.props.reset_password.dismissAlert();
                  if (this.props.reset_password.dismissAlertSuccess) {
                    setTimeout(() => {
                      this.props.reset_password.dismissAlertSuccess();
                      NavigationService.navigate(LOGIN);
                    });
                  }
                }}
              />
            )}
          </View>
        </View>
      </PopUp>
    );
  }
}

export default OtpForgotPassword;
