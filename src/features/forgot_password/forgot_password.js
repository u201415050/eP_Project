import React, { Component } from 'react';
import {
  Dimensions,
  Keyboard,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { Colors } from 'api';
import { BackHeader, Card, DoubleBackground, Loading, Logo } from 'components';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import EStyleSheet from 'react-native-extended-stylesheet';
import ForgotPasswordForm from './components/forgot_password_form';
import OtpForgotPassword from './components/otp_forgot_password';
import { portraitStyles } from './styles/portrait';
import { landscapeStyles } from './styles/landscape';
import { ButtonGradient } from './components/buttons';
import Orientation from 'react-native-orientation-locker';
import { Alert } from './components/alert_message';
import DeviceInfo from 'react-native-device-info';
import { isTablet } from 'components';
//import mixpanel from '../../services/mixpanel';

const isPortrait = () => {
  return !isTablet;
};

class ForgotPassword extends Component {
  static navigationOptions = {
    header: null,
  };
  constructor(props) {
    super(props);
    //mixpanel.track('Forgot Password Screen');
  }
  state = {
    orientation: isPortrait(),
    loading: false,
    otp: false,
    canResetPassword: false,
    email: {
      valid: false,
      value: '',
    },
    mobile: {
      valid: true,
      value: '',
    },
  };

  UNSAFE_componentWillMount() {
    !DeviceInfo.isTablet()
      ? Orientation.lockToPortrait()
      : Orientation.lockToLandscape();
  }

  getStyles = () => {
    return EStyleSheet.create({
      mainContainer: {
        flex: 1,
      },
      logoContainer: {
        justifyContent: 'center',
        marginVertical: '5rem',
      },
      cardContainer: {
        flex: 1,
        flexGrow: 1,
        alignItems: 'center',
      },
      card: {
        padding: '3rem',
      },
      termsText: {
        fontSize: Dimensions.get('screen').width <= 320 ? 12 : 14,
        fontWeight: '500',
        textAlign: 'center',
        color: '#666',
      },
      touchableText: {
        fontSize: Dimensions.get('screen').width <= 320 ? 12 : 14,
        fontWeight: '700',
        color: Colors.primary,
      },
      resetPasswordButton: {
        marginTop: '4rem',
      },
      '@media (min-width: 500)': {
        $scale: 1.5,
        $width: 320,
        card: {
          width: '$width',
          paddingHorizontal: '2.5rem',
          paddingBottom: '1.5rem',
        },
      },
      '@media (min-width: 320) and (max-width: 500)': {
        $width: '85%',
        card: {
          width: '$width',
        },
        forgotPasswordText: {
          fontSize: '1.6rem',
        },
        containerSignIn: {},
        signInButton: {
          width: '$width',
        },
        resetPasswordButton: {
          width: '$width',
        },
      },
    });
  };

  closeEmail = () => {
    this.setState({ email: false });
  };

  closeOtp = () => {
    this.setState({ otp: false });
  };

  handleChange = ({ email, mobile }) => {
    this.setState({ email, mobile }, () => {
      this.validateForm();
    });
  };

  validateForm = () => {
    const canReset =
      this.state.mobile !== '' || this.state.email !== '' ? true : false;
    this.setState({
      canResetPassword: canReset,
    });
  };

  checkField = key => {
    if (key === 'email') {
      this.props.check_email(this.state.email.value);
    }
  };
  form = null;
  render() {
    const styles = this.getStyles();

    const alertPortraitStyle = {
      height: hp('27.5%'),
      width: wp('85%'),
      justifyContent: 'center',
    };
    const alertLandscapeStyle = {
      height: hp('33%'),
      width: wp('44%'),
      justifyContent: 'center',
    };

    const otpMessage = ['We have sent an OTP to'];

    return (
      <DoubleBackground>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
          <View
            style={{
              height: hp('100%'),
              width: '100%',
              paddingTop: this.state.orientation ? hp('7%') : 0,
            }}
          >
            <KeyboardAvoidingView
              behavior="position"
              enabled
              keyboardVerticalOffset={!DeviceInfo.isTablet() ? null : -hp('3%')}
            >
              <View
                style={
                  this.state.orientation
                    ? portraitStyles.logoContainer
                    : landscapeStyles.logoContainer
                }
              >
                <Logo
                  onPress={() => this.props.navigation.navigate('LearnMore')}
                />
                {this.state.orientation || (
                  <BackHeader
                    {...this.props}
                    style={landscapeStyles.backHeaderLandscapeStyle}
                    size={hp('8.5%')}
                  />
                )}
              </View>
              <View
                style={
                  this.state.orientation
                    ? portraitStyles.cardContainer
                    : landscapeStyles.cardContainer
                }
              >
                <Card
                  style={
                    this.state.orientation
                      ? portraitStyles.card
                      : landscapeStyles.card
                  }
                >
                  <ForgotPasswordForm
                    ref={form => (this.form = form)}
                    onChangeForm={this.handleChange}
                    check_email={this.props.check_email}
                    check_mobile={this.props.check_mobile}
                    email={this.props.reset_password.email}
                    mobile={this.props.reset_password.mobile}
                    headerStyle={
                      this.state.orientation
                        ? portraitStyles.headerStyle
                        : landscapeStyles.headerStyle
                    }
                  />
                </Card>
                {/* disabled={!this.state.canResetPassword} */}
              </View>
            </KeyboardAvoidingView>

            <View
              style={
                this.state.orientation
                  ? { flex: 1, alignItems: 'center' }
                  : { flex: 1, alignItems: 'center', justifyContent: 'center' }
              }
            >
              <ButtonGradient
                disabled={!this.state.canResetPassword}
                title={'RESET PASSWORD'}
                style={
                  this.state.orientation
                    ? portraitStyles.buttonResetPassword
                    : landscapeStyles.buttonResetPassword
                }
                buttonTextStyle={
                  this.state.orientation
                    ? portraitStyles.textSignIn
                    : landscapeStyles.textSignIn
                }
                onPress={() => this.form.onPasswordReset()}
              />
            </View>
            {this.state.orientation && (
              <BackHeader
                {...this.props}
                style={{
                  ...portraitStyles.backHeaderPortraitStyle,
                  position: 'absolute',
                  top: 0,
                  left: 0,
                }}
                size={hp('7%')}
              />
            )}
            {/*this.props.reset_password.alert && (
            <Alert
              textSize={1.5}
              fontWeight="600"
              style={isPortrait() ? alertPortraitStyle : alertLandscapeStyle}
              message={this.props.reset_password.alert}
              // message={[
              //   'Check your registered email with instructions to reset your password',
              // ]}
              buttonTitle="OK"
              onPress={this.props.reset_password.dismissAlert}
            />
          )*/}
            {this.props.reset_password.loading && <Loading />}
            {/* {true && ( */}
            {this.props.reset_password.show_otp && (
              <OtpForgotPassword
                message={otpMessage}
                buttonTitle="RESEND OTP"
                onClosePress={this.closeOtp}
              />
            )}
            {(this.props.reset_password.alert || []).length > 0 && (
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
                message={this.props.reset_password.alert}
                messageStyle={
                  this.state.orientation
                    ? { fontSize: wp('3.7%') }
                    : { fontSize: hp('2.8%') }
                }
                buttonTitle={'OK'}
                onPress={this.props.reset_password.dismissAlert}
              />
            )}
          </View>
        </TouchableWithoutFeedback>
      </DoubleBackground>
    );
  }
}

export default ForgotPassword;
