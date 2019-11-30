import React, { Component } from 'react';
import { View, Dimensions, Platform } from 'react-native';
import { Alert, ButtonClose, PopUp, TextMontserrat, Timer } from 'components';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import ButtonGradientCustom from '../../../create_account/components/buttons/ButtonGradient';
import OtpInputs from '../../../create_account/components/otp_inputs/index';
import { BoxShadow } from 'react-native-shadow';
import { Colors } from 'api';
import { portraitStyles } from '../../../create_account/styles/portrait';
import { landscapeStyles } from '../../../create_account/styles/landscape';
import NavigationService from 'services/navigation';
import alert_service from '../../../../services/alert_service';
import { isTablet } from 'components';
const isPortrait = () => {
  return !isTablet;
};

export default class OtpRefund extends Component {
  constructor(props) {
    super(props);
    this.payment = this.props.payment;
    // this.payment.on('show_refund_otp', show_refund_otp => {
    //   this.setState({ show_refund_otp });
    // });
    // this.payment
    //   .paymentVoid(this.payment)
    //   .then(res => {
    //     this.payment.emit('show_refund_otp', true);
    //     this.setState({
    //       sendTo: res.response.userFirstName + ' ' + res.response.userLastName,
    //       phoneTo: res.response.userMobileNumber,
    //     });
    //   })
    //   .catch(err => {
    //     alert_service.showAlert(err.message, err.action);
    //   });
  }
  state = {
    orientation: isPortrait(),
    can_resend_otp: false,
    otp_invalid: false,
    sendTo: '',
    phoneTo: '',
    show_refund_otp: false,
    alertActive: false,
  };

  timer = {};
  otp_inputs = {};

  onComplete(otp) {
    //return alert(otp)
    this.payment
      .paymentVoid(
        this.payment,
        () => {
          if (this.props.onRefund) {
            //alert(1)
            this.props.onRefund();
            this.setState({ show_refund_otp: false });
          } else {
            NavigationService.reset('CashRegister');
          }
        },
        otp
      )
      .then(wrong => {
        //alert(2)
        if (!wrong.success) {
          //alert(3)
          this.setState({ otp_invalid: true });
        }
      })
      .catch(err => {
        //alert(err.message)
        if (
          err.message.indexOf(
            'Transactions are not voided. Please retry or refund'
          ) != -1
        ) {
          if (this.props.onRefund) {
            this.props.onRefund();
            this.setState({ show_refund_otp: false });
          } else {
            NavigationService.reset('CashRegister');
          }
        } else {
          //alert(otp)
          this.setState({
            alertActive: true,
            alertMessage: err.message,
            action: err.action,
          });
          //alert_service.showAlert(err.message, err.action)
        }
      });
  }
  refund(handle, noback, alert) {
    this.payment
      .paymentVoid(this.payment, () => {
        this.setState({ show_refund_otp: false });
        if (noback) {
        } else {
          NavigationService.reset('CashRegister');
        }
      })
      .then(res => {
        //alert(1)
        //if (Platform.OS === 'ios') {
        //if(handle)handle(res.message);
        //if (this.props.onRefund) {
        //this.props.onRenfund()}
        //}
        this.setState({
          show_refund_otp: true,
          sendTo:
            (res.response ? res.response.userFirstName : 'Main') +
            ' ' +
            (res.response ? res.response.userLastName : 'Merchant'),
          phoneTo: res.response ? res.response.userMobileNumber : '',
        });
      })
      .catch(err => {
        if (Platform.OS === 'ios') {
          handle(err.message);
        } else {
          if (noback || alert) {
            handle(err.message);
          }
          if (
            err.message.indexOf(
              'Transactions are not voided. Please retry or refund'
            ) == -1
          ) {
            alert_service.showAlert(err.message, () => {
              if (noback) {
              } else NavigationService.reset('CashRegister');
            });
          }
        }
      });
  }
  render() {
    const shadowOpt = {
      width: this.state.orientation
        ? wp('12.5%') * 4 - wp('0.2%')
        : wp('6%') * 4 - wp('1.5%'),
      height: this.state.orientation
        ? hp('6.25') - hp('0%')
        : hp('8%') - hp('1.75%'),
      color: '#000',
      radius: this.state.orientation ? 5 : 5,
      opacity: 0.13,
      x: this.state.orientation ? wp('1%') : wp('1.2%'),
      y: this.state.orientation ? hp('0.5%') : hp('1.6%'),
    };
    if (!this.state.show_refund_otp) {
      return null;
    }
    return (
      <PopUp
        Avoid="padding"
        style={
          this.state.orientation
            ? { width: wp('86.9%'), height: hp('53.1%') }
            : { width: wp('45.7%'), height: hp('66.4%') }
        }
      >
        <View
          style={
            this.state.orientation
              ? { alignItems: 'flex-end' }
              : { alignItems: 'flex-end', height: hp('3.5') }
          }
        >
          <ButtonClose
            onPress={() => this.setState({ show_refund_otp: false })}
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
                    fontWeight: '600',
                    color: Colors.primary,
                    fontSize: wp('4%'),
                  }
                : {
                    fontWeight: '600',
                    color: Colors.primary,
                    fontSize: hp('3%'),
                  }
            }
          >
            {this.state.sendTo}
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
            {this.state.phoneTo}
          </TextMontserrat>
        </View>
        <View style={{ alignItems: 'center' }}>
          <Timer
            ref={timer => (this.timer = timer)}
            textStyle={
              this.state.orientation
                ? {
                    fontWeight: '700',
                    fontSize: wp('6.9%'),
                    marginTop: hp('2.65%'),
                    marginBottom: hp('2.8%'),
                  }
                : {
                    fontWeight: '700',
                    fontSize: hp('5.8%'),
                    marginTop: hp('2.65%'),
                    marginBottom: hp('3.2%'),
                  }
            }
            minutes={3}
            onStart={() => this.setState({ can_resend_otp: false })}
            onFinished={() => this.setState({ can_resend_otp: true })}
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
            Insert Confirmation Code
          </TextMontserrat>
          <BoxShadow setting={shadowOpt}>
            <OtpInputs
              onChange={() => this.setState({ otp_invalid: false })}
              ref={input => (this.otp_inputs = input)}
              valid={false}
              invalid={this.state.otp_invalid}
              data={['first', 'second', 'third', 'fourth']}
              onComplete={this.onComplete.bind(this)}
            />
          </BoxShadow>
          {this.state.otp_invalid && (
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
          <View style={{ borderRadius: hp('20%') }}>
            <View style={{ borderRadius: hp('20%') }}>
              <ButtonGradientCustom
                title="RESEND OTP"
                disabled={!this.state.can_resend_otp}
                onPress={() => {
                  this.timer.restart();
                  // this.props.resend_otp(
                  //   this.props.register.auth_key,
                  //   this.props.register.otpType
                  // );
                  // this.otp_inputs._clean_fields();
                  // this.props.register.otp_valid = false;
                  // this.props.register.otp_invalid = false;
                  this.payment.paymentVoidResendOtp(this.payment);
                }}
                style={
                  this.state.orientation
                    ? portraitStyles.buttonResendOtp
                    : landscapeStyles.buttonResendOtp
                }
                buttonTextStyle={
                  this.state.orientation
                    ? portraitStyles.buttonResendOtpText
                    : landscapeStyles.buttonResendOtpText
                }
              />
            </View>
          </View>
          {this.state.alertActive ? (
            <Alert
              textSize={1.5}
              fontWeight="600"
              message={[this.state.alertMessage]}
              buttonTitle="OK"
              onPress={() => {
                /*if (this.state.alertMessage.indexOf('completed') != -1) {
                  alert(JSON.stringify(this.state.action));
                }*/
                this.setState({ alertActive: false }, () => {
                  this.setState({ show_refund_otp: false }, () => {
                    if (this.props.closeModal) {
                      this.props.closeModal();
                    }
                    if (this.props.onRefund) {
                      this.props.onRefund();
                    }
                  });
                });
              }}
            />
          ) : null}
        </View>
      </PopUp>
    );
  }
}
