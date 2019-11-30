import React, { Component } from 'react';
import {
  View,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
  TouchableOpacity,
  Keyboard,
  TouchableWithoutFeedback,
  NetInfo,
} from 'react-native';
import { CREATE_ACCOUNT, FORGOT_PASSWORD } from 'navigation/screen_names';
import { Colors, isPhone } from 'api';
import {
  ButtonGradient,
  ButtonOutline,
  Card,
  TouchableText,
  FloatingTextInput,
  DoubleBackground,
} from 'components-login';
import DeviceInfo from 'react-native-device-info';
import EStyleSheet from 'react-native-extended-stylesheet';
import Biometrics from 'react-native-biometrics';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { portraitStyles } from './styles/portrait';
import { landscapeStyles } from './styles/landscape';
import { FingerprintModal, Loading } from 'components';
import { Alert } from './components_general/alert_message';
import Orientation from 'react-native-orientation-locker';
import { isTablet } from '../cash_register/constants/isLandscape';
import { TextMontserrat, Logo, PopUp, Timer, ButtonClose } from 'components';
import loading_service from '../../services/loading_service';
//import mixpanel from '../../services/mixpanel';
import BackgroundTimer from 'react-native-background-timer';
import alert_service from 'services/alert_service';
import biometrics from '../../services/biometrics';
import FingerprintUser from '../../services/realm_models/fingerprint_user';
import * as _ from 'lodash';
import OtpInputs from '../my_account/components/otp_inputs';
import ButtonGradientCustom from '../my_account/components/buttons/ButtonGradient';
import { BoxShadow } from 'react-native-shadow';
import { epaisaRequest } from '../../services/epaisa_service';
import { sendOTPPut, sendOTP } from './services/user_service';
import RCTRealtime from '../../services/RCTRealtime';
class Login extends Component {
  static navigationOptions = {
    header: null,
  };

  state = {
    email: '', //am26@epaisa.com',
    password: '', //Test@123',
    loading: false,

    fingerprintAvailable: false,
    showLoginByFingerprint: '0',

    orientation: !isTablet,
    fingerprintStatus: 'normal',
    seconds: 0,
    touchId: false,
    fingerprint_linked: false,
    selectionDefault: { start: 0, end: 0 },
    fingerprint_last_user_id: null,
  };

  async componentDidMount() {
    // 1 = show, 0 = hide

    !DeviceInfo.isTablet()
      ? Orientation.lockToPortrait()
      : Orientation.lockToLandscape();
    //alert(!isTablet)
    //mixpanel.track('Login Screen');
    // await AsyncStorage.getItem(`@showLoginByFingerprint`).then(item => {
    //   if (item != null)
    //     this.setState(
    //       {
    //         showLoginByFingerprint: item,
    //       },
    //       () => {
    //         // alert(this.state.showLoginByFingerprint)
    //       }
    //     );
    // });
    try {
      RCTRealtime.unsubscribeAll();
    } catch (error) {
      //alert(error);
    }

    // RCTRealtime.init();

    biometrics.init();
    const touchId = biometrics.touchId;

    const user_fingerprint = FingerprintUser.getLastLogged();
    //alert(JSON.stringify(user_fingerprint));
    const fingerprint_linked = _.get(user_fingerprint, 'linked', false);
    const fingerprint_last_user_id = _.get(user_fingerprint, 'id', null);

    this.setState(
      {
        touchId,
        fingerprint_linked,
        fingerprint_last_user_id,
        //fingerprintLogin: fingerprint_linked && fingerprint_last_user_id,
      },
      async () => {
        if (touchId && fingerprint_linked) {
          await this.fingerprintLoginModal();
        }
      }
    );

    loading_service.hideLoading();
  }
  componentWillUnmount() {
    this.setState({ seconds: 0 });
    this.forceUpdate();
    BackgroundTimer.clearInterval(this.clockCall);
    BackgroundTimer.stopBackgroundTimer();
  }
  startClock = () => {
    this.setState(
      {
        seconds: 35,
      },
      () => {
        this.clockCall = BackgroundTimer.setInterval(
          () => this.decrementClock(),
          1000
        );
      }
    );
  };

  decrementClock = () => {
    this.setState(
      prevstate => ({
        seconds: prevstate.seconds - 1,
      }),
      () => {
        if (this.state.seconds == 0) {
          BackgroundTimer.clearInterval(this.clockCall);
        }
      }
    );
  };

  fingerprintLoginModal = async () => {
    // if(this.state.seconds != 0){
    //   alert_service.showAlert('Too many failed attempts. Please try again in '+this.state.seconds+' seconds');
    // } else {
    try {
      await this.signatureAndLogin('' + this.state.fingerprint_last_user_id);
    } catch (error) {
      console.log(error);
    }
    // }
  };

  signatureAndLogin = async userId => {
    try {
      const signature = await Biometrics.createSignature(
        'Login with Fingerprint',
        userId
      );
      const fingerprint = {
        signature,
        userId,
      };
      let changeStatus = status => {
        this.setState({ fingerprintStatus: status });
      };
      changeStatus = changeStatus.bind(this);
      NetInfo.isConnected.fetch().then(res => {
        if (res) {
          this.setState({ loading: true });
          let action = handle => {
            this.setState({ loading: false }, handle);
          };
          let showalert = message => {
            setTimeout(
              () =>
                this.setState({
                  alert: true,
                  alert_message: message,
                }),
              500
            );
          };
          action = action.bind(this);
          this.props.login(
            null,
            null,
            fingerprint,
            (auth, emailSend) => {
              this.setState({
                show_otp: true,
                emailSend: emailSend,
                auth: auth,
              });
            },
            action,
            showalert,
            changeStatus
          );
        } else {
          this.setState({
            alert: true,
            alert_message: 'Please connect to internet',
          });
        }
      });
    } catch (error) {
      if (error.code == 'error detecting fingerprint') {
        this.startClock();
        alert_service.showAlert(
          'You made 5 failed attempts. Please try again in 30 seconds'
        );
      }
      console.log({ error });
    }
  };
  passwordInput = {};

  getHeight = () => {
    if (!isTablet) {
      return (
        (Dimensions.get('window').height > 700
          ? 700
          : Dimensions.get('window').height) - (Platform.OS === 'ios' ? 0 : 48)
      );
    } else {
      return (
        (Dimensions.get('window').width > 700
          ? 700
          : Dimensions.get('window').width) - (Platform.OS === 'ios' ? 0 : 48)
      );
    }
  };

  getEStyle = () => {
    return EStyleSheet.create({
      container: {
        flex: 1,
      },
      scroll: {},
      logoContainer: {
        flexGrow: 1,
        justifyContent: 'center',
      },
      alert: {
        width: '85%',
        height: 170,
      },
      '@media (min-width: 500)': {
        $scale: 1.5,
        $width: 600,
        alert: {
          width: '$width',
        },
      },
      '@media (min-width: 320) and (max-width: 500)': {
        $width: '85%',
        alert: {
          width: '$width',
        },
      },
    });
  };

  handleLogin() {
    const { email, password } = this.state;
    NetInfo.isConnected.fetch().then(res => {
      if (res) {
        this.setState({ loading: true });
        let action = handle => {
          this.setState({ loading: false }, handle);
        };
        let showalert = message => {
          setTimeout(
            () =>
              this.setState({
                alert: true,
                alert_message: message,
              }),
            500
          );
        };
        action = action.bind(this);
        this.props.login(
          email,
          password,
          null,
          (auth, emailSend) => {
            this.setState({ show_otp: true, emailSend: emailSend, auth: auth });
          },
          action,
          showalert
        );
      } else {
        this.setState({
          alert: true,
          alert_message: 'Please connect to internet',
        });
      }
    });
  }

  handleHide() {
    this.props.failureHide();
  }

  render() {
    const { forgotContainer } = this.getEStyle();
    const { email, password } = this.state;
    const loginFingerprintStyle = !isTablet
      ? portraitStyles.loginFingerprintText
      : landscapeStyles.loginFingerprintText;
    const shadowOpt = {
      backgroundColor: 'red',
      width: !isTablet
        ? wp('12.5%') * 6 - wp('1.6%')
        : wp('6%') * 6 - wp('1.5%'),
      height: !isTablet ? hp('6.25') - hp('0.85%') : hp('8%') - hp('1.75%'),
      color: '#000',
      border: !isTablet ? hp('1%') : hp('1.8%'),
      radius: !isTablet ? 5 : 5,
      opacity: 0.3,
      x: !isTablet ? wp('1.4%') : wp('1.2%'),
      y: !isTablet ? hp('0.8%') : hp('1.6%'),
    };
    //alert(biometrics.touchId);
    return (
      <DoubleBackground>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
          <View
            style={{ alignItems: 'center', height: hp('100%'), width: '100%' }}
          >
            <KeyboardAvoidingView
              behavior="position"
              enabled
              keyboardVerticalOffset={!isTablet ? null : hp('5%')}
            >
              <View
                style={
                  !isTablet
                    ? portraitStyles.logoContainer
                    : landscapeStyles.logoContainer
                }
              >
                <Logo
                  onPress={() => {
                    this.props.navigation.navigate('LearnMore');
                  }}
                />
              </View>
              <View
                style={
                  !isTablet
                    ? portraitStyles.cardContainer
                    : landscapeStyles.cardContainer
                }
              >
                <Card
                  style={!isTablet ? portraitStyles.card : landscapeStyles.card}
                >
                  <FloatingTextInput
                    keyboardType="email-address"
                    label={'E-mail'}
                    autoCapitalize={'none'}
                    onChangeText={email => this.setState({ email })}
                    value={email}
                    onBlur={() => {}}
                    selection={this.state.selectionDefault}
                    returnKeyType={'next'}
                    onSubmitEditing={() => this.passwordInput.focus()}
                  />
                  {!isTablet || <View style={{ height: hp('1.5%') }} />}
                  <FloatingTextInput
                    inputRef={input => {
                      this.passwordInput = input;
                    }}
                    selectionAlg={true}
                    label={'Password'}
                    autoCapitalize={'none'}
                    secureTextEntry={true}
                    onChangeText={password => this.setState({ password })}
                    value={password}
                    onSubmitEditing={this.handleLogin.bind(this)}
                  />
                  {DeviceInfo.getModel()
                    .toLowerCase()
                    .indexOf('x') == -1 &&
                    this.state.fingerprint_linked && (
                      <TouchableOpacity
                        disabled={this.state.seconds != 0}
                        style={{
                          marginTop: !isTablet ? hp('3.5%') : hp('1.65%'),
                        }}
                        onPress={() => {
                          /* this.setState(
                            {
                              fingerprintLogin:
                                this.state.fingerprint_linked &&
                                this.state.fingerprint_last_user_id,
                            },*/
                          this.fingerprintLoginModal();
                          //);
                        }}
                      >
                        <TextMontserrat
                          style={{
                            ...loginFingerprintStyle,
                            color:
                              this.state.seconds != 0 ? '#6E6E6E' : '#174285',
                          }}
                        >
                          Login with your Fingerprint
                        </TextMontserrat>
                      </TouchableOpacity>
                    )}
                  {this.state.loading && <Loading />}
                  {this.state.alert && (
                    <Alert
                      style={
                        !isTablet
                          ? { width: wp('65.9%'), paddingVertical: hp('4%') }
                          : { width: wp('45.7%'), paddingVertical: hp('5%') }
                      }
                      buttonStyle={
                        !isTablet
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
                        !isTablet
                          ? {
                              fontWeight: '700',
                              color: '#fff',
                              fontSize: wp('3.5%'),
                            }
                          : {
                              fontWeight: '700',
                              color: '#fff',
                              fontSize: hp('2.8%'),
                            }
                      }
                      message={[this.state.alert_message]}
                      messageStyle={
                        !isTablet
                          ? { fontSize: wp('3.7%') }
                          : { fontSize: hp('2.8%') }
                      }
                      buttonTitle={'OK'}
                      onPress={() => this.setState({ alert: false })}
                      // style={alert}
                    />
                  )}
                  {this.props.auth.loginFailureMessage && (
                    <Alert
                      style={
                        !isTablet
                          ? { width: wp('86.9%'), paddingVertical: hp('5%') }
                          : { width: wp('45.7%'), paddingVertical: hp('5%') }
                      }
                      buttonStyle={
                        !isTablet
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
                        !isTablet
                          ? {
                              fontWeight: '700',
                              color: '#fff',
                              fontSize: wp('3.5%'),
                            }
                          : {
                              fontWeight: '700',
                              color: '#fff',
                              fontSize: hp('2.8%'),
                            }
                      }
                      message={[
                        this.props.auth.error
                          ? typeof this.props.auth.error === 'string'
                            ? this.props.auth.error
                            : 'Invalid Fingerprint Credentials'
                          : 'Invalid credentials',
                      ]}
                      messageStyle={
                        !isTablet
                          ? { fontSize: wp('3.7%') }
                          : { fontSize: hp('2.8%') }
                      }
                      buttonTitle={'OK'}
                      onPress={this.handleHide.bind(this)}
                      // style={alert}
                    />
                  )}
                </Card>
              </View>
            </KeyboardAvoidingView>
            <View style={forgotContainer}>
              <TouchableText
                onPress={() => this.props.navigation.navigate(FORGOT_PASSWORD)}
                style={
                  !isTablet
                    ? portraitStyles.forgotPasswordText
                    : landscapeStyles.forgotPasswordText
                }
              >
                Forgot your Password?
              </TouchableText>
            </View>
            <ButtonGradient
              title={'SIGN IN'}
              style={
                !isTablet
                  ? portraitStyles.buttonSignIn
                  : landscapeStyles.buttonSignIn
              }
              buttonTextStyle={
                !isTablet
                  ? portraitStyles.textSignIn
                  : landscapeStyles.textSignIn
              }
              onPress={this.handleLogin.bind(this)}
            />
            <View
              style={
                !isTablet
                  ? portraitStyles.containerCreateAccount
                  : landscapeStyles.containerCreateAccount
              }
            >
              <ButtonOutline
                title={'CREATE NEW ACCOUNT'}
                onPress={() => this.props.navigation.navigate(CREATE_ACCOUNT)}
                style={
                  !isTablet
                    ? portraitStyles.buttonCreateAccount
                    : landscapeStyles.buttonCreateAccount
                }
                buttonTextStyle={
                  !isTablet
                    ? portraitStyles.textCreateAccount
                    : landscapeStyles.textCreateAccount
                }
              />
            </View>
          </View>
        </TouchableWithoutFeedback>
        {// 1 = show, 0 = hide
        // this.state.showLoginByFingerprint == '1' &&
        // (

        this.state.fingerprintLogin && (
          <FingerprintModal
            status={this.state.fingerprintStatus}
            title="Fingerprint - Login"
            description="Login with your fingerprint"
            cancel={() => this.setState({ fingerprintLogin: false })}
            notNow={() => this.setState({ fingerprintLogin: false })}
          />
        )
        // )
        }
        {this.state.show_otp && (
          //true && (

          <PopUp
            style={
              !isTablet
                ? { width: wp('86.9%'), height: hp('53.1%') }
                : { width: wp('45.7%'), height: hp('66.4%') }
            }
          >
            <View
              style={
                !isTablet
                  ? { alignItems: 'flex-end' }
                  : { alignItems: 'flex-end', height: hp('3.5') }
              }
            >
              <ButtonClose
                onPress={() => {
                  this.setState({ show_otp: false });
                }}
              />
            </View>
            <View
              style={
                !isTablet
                  ? { alignItems: 'center', paddingTop: hp('0.8%') }
                  : { alignItems: 'center', paddingTop: hp('1%') }
              }
            >
              <TextMontserrat
                style={
                  !isTablet
                    ? { fontWeight: '600', color: '#444', fontSize: wp('4%') }
                    : { fontWeight: '600', color: '#444', fontSize: hp('3%') }
                }
              >
                We have sent a
              </TextMontserrat>
              <TextMontserrat
                style={
                  !isTablet
                    ? { fontWeight: '600', color: '#444', fontSize: wp('4%') }
                    : { fontWeight: '600', color: '#444', fontSize: hp('3%') }
                }
              >
                confirmation code to
              </TextMontserrat>
              <TextMontserrat
                style={
                  !isTablet
                    ? {
                        fontWeight: '700',
                        color: Colors.primary,
                        fontSize:
                          '1321321321'.length > 18 ? wp('4.1%') : wp('4.5%'),
                      }
                    : {
                        fontWeight: '700',
                        color: Colors.primary,
                        fontSize: hp('3.5%'),
                      }
                }
              >
                {this.state.emailSend}
              </TextMontserrat>
            </View>
            <View style={{ alignItems: 'center' }}>
              <Timer
                ref={timer => (this.timer = timer)}
                textStyle={
                  !isTablet
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
                !isTablet
                  ? { alignItems: 'center', height: hp('15%') }
                  : { alignItems: 'center', height: hp('18%') }
              }
            >
              <TextMontserrat
                style={
                  !isTablet
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
                Insert Confirmation Code{' '}
              </TextMontserrat>
              <BoxShadow setting={shadowOpt}>
                <OtpInputs
                  ref={input => (this.otp_inputs = input)}
                  valid={this.state.valid}
                  invalid={this.state.invalid}
                  data={[
                    'first',
                    'second',
                    'third',
                    'fourth',
                    'fifth',
                    'sixth',
                  ]}
                  onComplete={otp => {
                    loading_service.showLoading();
                    sendOTPPut(this.state.auth, {
                      otpValue: otp,
                      type: 1,
                    }).then(res => {
                      console.log('VALIDATE', res);
                      loading_service.hideLoading();
                      if (res.success == 1) {
                        this.setState(
                          {
                            valid: false,
                            invalid: false,
                            show_otp: false,
                            email: this.state.emailSend,
                          },
                          this.handleLogin.bind(this)
                        ); //,()=>alert_service.showAlert((this.state.typeOTP==1?"Username":"Mobile Number")+" successfully changed!"))
                      } else {
                        this.setState({ invalid: true, valid: false });
                      }
                      //console.log("AQUIESTA", res)
                    });
                  }}
                />
              </BoxShadow>
              {this.state.invalid && (
                <TextMontserrat
                  style={
                    !isTablet
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
                !isTablet
                  ? { alignItems: 'center', marginTop: hp('1.6%') }
                  : { alignItems: 'center', marginTop: hp('3%') }
              }
            >
              <View style={{ borderRadius: hp('20%'), elevation: hp('0.6%') }}>
                <View
                  style={{ borderRadius: hp('20%'), elevation: hp('0.6%') }}
                >
                  <ButtonGradientCustom
                    title="RESEND OTP"
                    disabled={this.state.can_resend_otp}
                    onPress={() => {
                      sendOTP(this.state.auth, { type: 1 }).then(res => {
                        console.log('RESVERIFY:', res);
                      });
                    }}
                    style={
                      !isTablet
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
                      !isTablet
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
        )}
      </DoubleBackground>
    );
  }
}
export default Login;
