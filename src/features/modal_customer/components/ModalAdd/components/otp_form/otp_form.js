import React, { Component } from 'react';

import { View, Dimensions, Platform, AsyncStorage } from 'react-native';
import { Timer, ButtonClose, TextMontserrat, PopUp } from 'components';
import OtpInputs from '../otp_inputs/index';
import ButtonGradientCustom from '../buttons/ButtonGradient';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { Colors } from 'api';
import { BoxShadow } from 'react-native-shadow';
import { isTablet } from 'components';

const isPortrait = () => {
  return !isTablet;
};

export default class OtpForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      can_resend_otp: false,
      orientation: isPortrait(),
      auth_key: '',
    };
  }

  componentDidMount() {
    //console.log('**** OTP FORM *****')
    //this.setState({ auth_key : user.response.auth_key });
  }

  render() {
    const closeAction = this.props.close;

    const shadowOpt = {
      width: this.state.orientation
        ? wp('12.5%') * 4 - wp('1.6%')
        : wp('6%') * 4 - wp('1.5%'),
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

    var otpInputColor = this.props.otpInputColor;
    var otpError = this.props.otpError;
    const otpResend = this.props.otpResend;

    return (
      <PopUp
        Avoid={'padding'}
        style={
          this.state.orientation
            ? { width: wp('86.9%'), height: hp('53.1%') }
            : { width: wp('45.7%'), height: hp('66.4%') }
        }
      >
        <View
          style={
            this.state.orientation
              ? { alignItems: 'flex-end', height: hp('2%') }
              : { alignItems: 'flex-end', height: hp('3.5') }
          }
        >
          <ButtonClose
            onPress={
              () => {
                closeAction();
                this.props.cleanError();
              }
              // this.props.hide_success_modal()
            }
          />
        </View>
        <View
          style={
            this.state.orientation
              ? { alignItems: 'center', paddingTop: hp('0.8%') }
              : { alignItems: 'center', paddingTop: hp('1%') }
          }
        >
          <TextMontserrat
            style={
              this.state.orientation
                ? { fontWeight: '600', color: '#444', fontSize: wp('4%') }
                : { fontWeight: '600', color: '#444', fontSize: hp('3%') }
            }
          >
            We have sent an OTP to
          </TextMontserrat>
          <TextMontserrat
            style={
              this.state.orientation
                ? {
                    fontWeight: '700',
                    color: Colors.primary,
                    fontSize: wp('4.5%'),
                  }
                : {
                    fontWeight: '700',
                    color: Colors.primary,
                    fontSize: hp('3.5%'),
                  }
            }
          >
            {this.props.customerPhone}
          </TextMontserrat>
        </View>
        <View style={{ alignItems: 'center' }}>
          <Timer
            ref={timer => (this.timer = timer)}
            textStyle={
              this.state.orientation
                ? {
                    fontWeight: '700',
                    fontSize: wp('7.1%'),
                    marginTop: hp('5.5%'),
                    marginBottom: hp('2.8%'),
                  }
                : {
                    fontWeight: '700',
                    fontSize: hp('5.8%'),
                    marginTop: hp('6.75%'),
                    marginBottom: hp('3.2%'),
                  }
            }
            minutes={3}
            onStart={() => this.setState({ can_resend_otp: false })}
            onFinished={() => {
              this.setState({ can_resend_otp: true });
              otpError = true;
            }}
          />
        </View>
        <View
          style={
            this.state.orientation
              ? { alignItems: 'center', height: hp('15%') }
              : { alignItems: 'center', height: hp('18%') }
          }
        >
          <TextMontserrat
            style={
              this.state.orientation
                ? {
                    fontWeight: '600',
                    fontSize: wp('3.3%'),
                    marginBottom: hp('0.95%'),
                  }
                : {
                    fontWeight: '600',
                    fontSize: hp('2.7%'),
                    marginBottom: hp('1%'),
                  }
            }
          >
            {' '}
            Insert OTP{' '}
          </TextMontserrat>
          <BoxShadow setting={shadowOpt}>
            <OtpInputs
              cleanErrors={this.props.cleanError}
              borderColors={otpInputColor}
              ref={input => (this.otp_inputs = input)}
              valid={() => {}} //this.props.register.otp_valid}
              invalid={() => {}} //this.props.register.otp_invalid}
              data={['first', 'second', 'third', 'fourth']}
              onComplete={otp => {
                console.log('complete Add customer fields otp');
                /*this.props.verifyCustomer(
                  this.state.auth_key,
                  this.props.customerId,
                  otp
                );*/
                this.props.otpValid(
                  this.state.auth_key,
                  this.props.customerId,
                  otp
                );
              }}
            />
          </BoxShadow>
          {otpError && (
            //true && (
            <TextMontserrat
              style={
                this.state.orientation
                  ? {
                      fontWeight: '600',
                      fontSize: wp('3.15%'),
                      color: '#D0021B',
                      marginTop: hp('1.1%'),
                    }
                  : {
                      fontWeight: '600',
                      fontSize: hp('2.35%'),
                      color: '#D0021B',
                      marginTop: hp('2.2%'),
                    }
              }
            >
              Incorrect OTP - Re-insert or resend
            </TextMontserrat>
          )}
        </View>
        <View
          style={
            this.state.orientation
              ? { alignItems: 'center', marginTop: hp('1.6%') }
              : { alignItems: 'center', marginTop: hp('3%') }
          }
        >
          <View style={{ borderRadius: hp('20%'), elevation: hp('0.6%') }}>
            <View style={{ borderRadius: hp('20%'), elevation: hp('0.6%') }}>
              <ButtonGradientCustom
                title="RESEND OTP"
                disabled={!this.state.can_resend_otp || otpResend}
                onPress={() => {
                  this.props.resendOtp();
                  this.timer.restart();
                  this.props.cleanError();
                  this.otp_inputs._clean_fields();
                  this.setState({ can_resend_otp: false });
                  /*this.timer.restart();
                  this.props.resend_otp(
                    this.props.register.auth_key,
                    this.props.register.otpType
                  );
                  this.otp_inputs._clean_fields();
                  this.props.register.otp_valid = false;
                  this.props.register.otp_invalid = false;*/
                }}
                style={
                  this.state.orientation
                    ? {
                        height: hp('6.25%'),
                        width: wp('50%'),
                        borderRadius: hp('20%'),
                        justifyContent: 'center',
                        alignItems: 'center',
                        ...Platform.select({
                          ios: {
                            shadowOffset: { width: 1, height: 2 },
                            shadowColor: 'black',
                            shadowOpacity: 0.5,
                          },
                          android: {
                            elevation: hp('0.65%'),
                          },
                        }),
                      }
                    : {
                        height: hp('7.8%'),
                        width: wp('26.35%'),
                        borderRadius: hp('20%'),
                        justifyContent: 'center',
                        alignItems: 'center',
                        ...Platform.select({
                          ios: {
                            shadowOffset: { width: 1, height: 2 },
                            shadowColor: 'black',
                            shadowOpacity: 0.5,
                          },
                          android: {
                            elevation: hp('0.65%'),
                          },
                        }),
                      }
                }
                buttonTextStyle={
                  this.state.orientation
                    ? {
                        fontSize: wp('3.15%'),
                        fontWeight: '600',
                      }
                    : {
                        fontSize: hp('2.65'),
                        fontWeight: '600',
                      }
                }
              />
            </View>
          </View>
        </View>
      </PopUp>
    );
  }
}
