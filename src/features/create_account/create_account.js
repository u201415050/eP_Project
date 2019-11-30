import React, { Component } from 'react';
import ReactNative, {
  View,
  Dimensions,
  KeyboardAvoidingView,
  Keyboard,
  TouchableWithoutFeedback,
  ScrollView,
} from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';

import { Colors, isPhone } from 'api';
import {
  DoubleBackground,
  Timer,
  ButtonClose,
  Card,
  TextMontserrat,
  BackHeader,
  Loading,
  TouchableText,
  PopUp,
  ButtonGradient,
  Alert,
  FloatingTextInput,
  PhoneInput,
  Logo,
} from 'components';
import CreateAccountForm from './components/create_account_form';
import TermsModal from './components/terms_modal';
import ESignModal from './components/esign_modal';
import Checkmark from './components/checkmark';
import CheckmarkBig from './components/checkmark_big';
import OtpInputs from './components/otp_inputs';
import AccountCreated from '../account_created/account_created';
import { LOGIN } from 'navigation/screen_names';
import { portraitStyles } from './styles/portrait';
import { landscapeStyles } from './styles/landscape';
import { ButtonGradientCustom } from './components/buttons';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import Orientation from 'react-native-orientation-locker';
import { isTablet } from '../cash_register/constants/isLandscape';
import * as yup from 'yup';
import {
  check_email,
  check_mobile,
  check_email_improved,
} from './../../services/user_service';
import password_validations from './api/password_validations';
import { BoxShadow } from 'react-native-shadow';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import DeviceInfo from 'react-native-device-info';
//import mixpanel from '../../services/mixpanel';
import { openOverlay } from 'react-native-blur-overlay';

const isPortrait = () => {
  const dim = Dimensions.get('window');
  if (dim.height >= dim.width) {
    return true;
  } else {
    return false;
  }
};

class CreateAccount extends Component {
  static navigationOptions = {
    header: null,
  };
  constructor(props) {
    super(props);
    openOverlay();

    //mixpanel.track('Create Account Screen');
  }

  timer = null;

  state = {
    modalTerms: false,
    modalESign: false,
    esign: true,
    seller: true,
    termsAccepted: true,
    can_resend_otp: false,
    alert: {
      show: false,
    },
    userData: {},
    orientation: !isTablet,
    show_choose_otp: false,
    mobileNotValid: false,
    formErrors: {},
    offset: 0,
    destinationCloseButton: true,
  };

  UNSAFE_componentWillMount() {
    !isTablet ? Orientation.lockToPortrait() : Orientation.lockToLandscape();
  }

  USER_SQUEMA = yup.object().shape({
    UserFirstName: yup.string().required(),
    UserLastName: yup.string().required(),
    CountryCode: yup.string().required(),
    CallingCode: yup.string().required(),
    UserMobileNumber: yup
      .string()
      .min(10)
      .test('unique-number', 'this number is already taken', value => {
        this.setState({ formValid: false });
        return check_mobile(value).then(resp => {
          //console.log({ MOBILE: resp });
          // alert(resp.verified.toString())
          //alert(JSON.stringify(resp))
          return !resp.exists || !resp.verified; //||!resp.verified;
        });
      })
      .required(),
    Username: yup
      .string()
      .email()
      .test('unique-email', 'this email is already taken', async value => {
        this.setState({ formValid: false });
        const { response } = await check_email_improved(value);
        const { exists, message, verified } = response.username;
        const formErrors = this.state.formErrors;
        formErrors.Username = [];
        if (
          !verified ||
          (!exists && message === 'There is no user found with given details.')
        ) {
          this.setState({ formErrors });

          return true;
        }

        if (value != '') formErrors.Username = [message];

        // return check_email(value).then(resp => {
        //   console.log({ EMAIL: resp });
        //   const errors =
        //     resp.errors[0] == 'There is no user found with given details.'
        //       ? []
        //       : resp.errors;
        //   return !resp.exists && errors.length == 0;
        // });
        this.setState({ formErrors });
        return false;
      })
      .required(),
    otpType: yup
      .number()
      .integer()
      .required(),
    registeredReferralCode: yup.string(),
    BusinessName: yup.string(),
    Password: yup
      .string()
      .test('password-valid', 'password is not valid', value => {
        let errors = 0;
        password_validations.map(validation => {
          if (!validation.validateInput(value)) {
            errors++;
          }
        });
        const valid = errors === 0 ? true : false;
        console.log({ VALID_PASS: valid });
        return Promise.resolve(valid);
      })
      .required(),
  });

  _toggleModal = key => {
    this.setState({ [key]: !this.state[key] });
  };

  _toggleTerms = () => {
    const check = !this.state.esign || !this.state.seller ? true : false;
    this.setState({ esign: check, seller: check });
  };

  getOtpSentTo = () => {
    if (this.props.register.otpType === 2) {
      return this.state.userData.UserMobileNumber != '' &&
        this.state.userData.UserMobileNumber != undefined &&
        this.state.userData.UserMobileNumber != null
        ? '+' +
            this.state.userData.CallingCode +
            ' ' +
            this.state.userData.UserMobileNumber.substring(
              this.state.userData.UserMobileNumber.length - 10
            )
        : '';
    } else {
      return this.props.register.email;
    }
  };

  getStyles = () => {
    return EStyleSheet.create({
      mainContainer: {
        flex: 1,
      },
      scroll: {},
      logoContainer: {
        flexGrow: 1,
        justifyContent: 'center',
      },
      cardContainer: {
        alignItems: 'center',
        flexGrow: 1,
      },
      card: {
        paddingHorizontal: '3rem',
        paddingBottom: '2rem',
      },
      termsContainer: {
        marginVertical: '.5rem',
        marginBottom: '.5rem',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
      },
      termsMainContainer: {
        alignItems: 'center',
        flexDirection: isTablet ? 'row' : 'column',
        justifyContent: 'center',
        //marginBottom: '1.5rem',
      },
      termsText: {
        fontSize: this.state.orientation ? wp('3.1%') : hp('1.8%'), //Dimensions.get('screen').width <= 320 ? 12 : 14,
        fontWeight: '500',
        textAlign: 'center',
        color: '#666',
      },
      touchableText: {
        fontSize: this.state.orientation ? wp('3.1%') : hp('1.8%'), //Dimensions.get('screen').width <= 320 ? 12 : 14,
        fontWeight: '700',
        color: Colors.primary,
      },

      createAccountContainer: {
        alignItems: 'center',
        marginBottom: 20,
      },
      opt_container: {
        width: '85%',
      },
      '@media (min-width: 500)': {
        $scale: 1.5,
        $width: 320,
        card: {
          width: '$width',
          paddingHorizontal: '2.5rem',
          paddingBottom: '1.5rem',
          borderRadius: 14,
        },
        createAccountButton: {
          width: '$width',
        },
        opt_container: {
          width: '$width',
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
        createAccountButton: {
          width: '$width',
        },
      },
    });
  };

  _lockCreateButton = value => {
    this.setState({ mobileNotValid: value });
  };

  _setUserData = async userData => {
    const formValid = await this.USER_SQUEMA.isValid(userData);
    this.setState({
      formValid,
      userData,
    });
    // this.USER_SQUEMA.validate(data)
    //   .then(() => {
    //     this.setState({ formValid: true });
    //   })
    //   .catch(() => {
    //     this.setState({ formValid: false });
    //   });
    // this.setState({ userData: data });
  };

  _handleCreateAccount = async () => {
    const formValid = await this.USER_SQUEMA.isValid(this.state.userData);
    this.setState({ formValid });
    if (!this.state.seller || !this.state.esign) {
      this.setState({
        alert: {
          show: true,
          message: ['You must accept the terms and conditions'],
        },
      });
    }
    if (!formValid) {
      return this.setState({
        alert: {
          show: true,
          message: ['You must provide valid data'],
        },
      });
    } else {
      this.setState({ show_choose_otp: true });
    }
  };

  scrollToItem = ref => {
    ref.measureLayout(
      ReactNative.findNodeHandle(this.scrollViewRef),
      (x, y) => {
        this.scrollViewRef.scrollTo({ x: 0, y: y, animated: true });
      }
    );
  };

  otp_inputs = null;

  render() {
    const numberSentTo = this.getOtpSentTo();

    const styles = this.getStyles();
    const { seller, esign } = this.state;

    const shadowOpt = {
      width: this.state.orientation
        ? wp('12.5%') * 6 - wp('1.6%')
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

    return (
      <DoubleBackground>
        {/* <KeyboardAwareScrollView
            enableOnAndroid={true}
          > */}

        <TouchableWithoutFeedback
          onPress={() => {
            this.scrollViewRef.scrollTo({ x: 0, y: 0, animated: true });
            Keyboard.dismiss();
          }}
          accessible={false}
        >
          <View
            scrollEnabled={false}
            //ref={element => (this.scrollViewRef = element)}
            style={{
              marginTop: this.state.orientation ? hp('7%') : 0,
              flex: 1,
              width: '100%',
            }}
          >
            <KeyboardAvoidingView
              behavior="position"
              keyboardVerticalOffset={this.state.offset}
            >
              {/* <KeyboardAvoidingView
              behavior="padding"
              enabled
              keyboardVerticalOffset={this.state.orientation ? null : hp('6%')}
            > */}

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
                  <ScrollView
                    style={{ height: '100%' }}
                    ref={x => (this.scrollViewRef = x)}
                    keyboardShouldPersistTaps={'handled'}
                  >
                    <CreateAccountForm
                      changePad={val => {
                        this.setState({ offset: val });
                      }}
                      scrollToEnd={() =>
                        this.scrollViewRef.scrollToEnd({
                          animated: true,
                        })
                      }
                      scrollTo={val =>
                        this.scrollViewRef.scrollTo({
                          x: 0,
                          y: val,
                          animated: true,
                        })
                      }
                      onChangeForm={this._setUserData.bind(this)}
                      // isValid={formValid => this.setState({ formValid })}
                      containerStyle={{
                        height: '100%',
                        width: '100%',
                        paddingBottom: hp('2%'),
                      }}
                      lockCreateButton={this._lockCreateButton.bind(this)}
                      formErrors={this.state.formErrors}
                    />
                    {this.props.register.loading && <Loading />}
                  </ScrollView>
                </Card>
              </View>
              {/* </KeyboardAvoidingView> */}

              <View style={styles.termsMainContainer}>
                <View style={styles.termsContainer}>
                  <Checkmark
                    onPress={this._toggleTerms.bind(this)}
                    checked={seller && esign}
                  />
                  <TextMontserrat style={styles.termsText}>
                    {' '}
                    ePaisa's{' '}
                  </TextMontserrat>
                  <TouchableText
                    style={styles.touchableText}
                    onPress={() => this._toggleModal('modalTerms')}
                  >
                    Seller Agreement
                  </TouchableText>
                  <TextMontserrat style={styles.termsText}>
                    {' '}
                    and{' '}
                  </TextMontserrat>
                  <TouchableText
                    style={styles.touchableText}
                    onPress={() => this._toggleModal('modalESign')}
                  >
                    e-Sign Consent
                  </TouchableText>
                </View>
              </View>

              <View
                style={
                  this.state.orientation
                    ? portraitStyles.createNewAccountContainer
                    : landscapeStyles.createNewAccountContainer
                }
              >
                <ButtonGradientCustom
                  title={'CREATE NEW ACCOUNT'}
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
                  onPress={this._handleCreateAccount}
                  disabled={
                    !this.state.formValid ||
                    this.state.mobileNotValid ||
                    !(this.state.seller && this.state.esign)
                  }
                />
              </View>
            </KeyboardAvoidingView>
          </View>
        </TouchableWithoutFeedback>
        {/* </KeyboardAwareScrollView> */}

        {/* ***************  MODALS *************** */}
        <TermsModal
          decline={() => {
            this.setState({ seller: false });
            this._toggleModal('modalTerms');
          }}
          visible={this.state.modalTerms}
          accept={() => {
            this.setState({ seller: true });
            this._toggleModal('modalTerms');
          }}
        />
        <ESignModal
          decline={() => {
            this.setState({ esign: false });
            this._toggleModal('modalESign');
          }}
          visible={this.state.modalESign}
          accept={() => {
            this.setState({ esign: true });
            this._toggleModal('modalESign');
          }}
        />
        {/* this.props.register.show_otp */}
        {this.props.register.show_otp && (
          //true && (
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
              <ButtonClose onPress={() => this.props.hide_success_modal()} />
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
                We have sent a
              </TextMontserrat>
              <TextMontserrat
                style={
                  this.state.orientation
                    ? { fontWeight: '600', color: '#444', fontSize: wp('4%') }
                    : { fontWeight: '600', color: '#444', fontSize: hp('3%') }
                }
              >
                confirmation code to
              </TextMontserrat>
              <TextMontserrat
                style={
                  this.state.orientation
                    ? {
                        fontWeight: '700',
                        color: Colors.primary,
                        fontSize:
                          numberSentTo.length > 18 ? wp('4.1%') : wp('4.5%'),
                      }
                    : {
                        fontWeight: '700',
                        color: Colors.primary,
                        fontSize: hp('3.5%'),
                      }
                }
              >
                {numberSentTo}
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
                {' '}
                Insert Confirmation Code{' '}
              </TextMontserrat>
              <BoxShadow setting={shadowOpt}>
                <OtpInputs
                  ref={input => (this.otp_inputs = input)}
                  valid={this.props.register.otp_valid}
                  invalid={this.props.register.otp_invalid}
                  data={[
                    'first',
                    'second',
                    'third',
                    'fourth',
                    'fifth',
                    'sixty',
                  ]}
                  onComplete={otp => {
                    console.log('complete');
                    this.props.verify_otp(
                      this.props.register.auth_key,
                      otp,
                      this.props.register.otpType
                    );
                  }}
                />
              </BoxShadow>
              {this.props.register.otp_invalid && (
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
                <View
                  style={{ borderRadius: hp('20%'), elevation: hp('0.6%') }}
                >
                  <ButtonGradientCustom
                    title="RESEND OTP"
                    disabled={!this.state.can_resend_otp}
                    onPress={() => {
                      this.props.resend_otp(
                        this.props.register.auth_key,
                        this.props.register.otpType
                      );
                      this.otp_inputs._clean_fields();
                      this.props.register.otp_valid = false;
                      this.props.register.otp_invalid = false;
                      this.timer.restart();
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
            </View>
          </PopUp>
        )}
        {/* this.state.show_choose_otp */}
        {this.state.show_choose_otp && (
          <PopUp
            style={{
              ...styles.opt_container,
              padding: 30,
            }}
          >
            <View style={{ position: 'absolute', right: 15, top: 15 }}>
              {this.state.destinationCloseButton && (
                <ButtonClose
                  onPress={() => this.setState({ show_choose_otp: false })}
                />
              )}
            </View>
            <View>
              <TextMontserrat
                style={{
                  fontWeight: '600',
                  fontSize: 17,
                  textAlign: 'center',
                  color: '#47525D',
                }}
              >
                Where do you want your confirmation code?
              </TextMontserrat>
            </View>
            {/* email */}
            <View style={{ flexDirection: 'row' }}>
              {/* input */}
              <View>
                <FloatingTextInput
                  label={'E-mail'}
                  value={this.state.userData.Username}
                  disabled={true}
                  inputStyle={{ width: '100%' }}
                />
              </View>
              <View
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  width: 40,
                  backgroundColor: 'white',
                  position: 'absolute',
                  right: 0,
                  height: '100%',
                  paddingTop: 20,
                }}
              >
                <CheckmarkBig
                  size={32}
                  checked={this.state.userData.otpType === 1}
                  onPress={() =>
                    this.setState({
                      userData: {
                        ...this.state.userData,
                        otpType: 1,
                      },
                    })
                  }
                />
              </View>
            </View>
            <View
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                paddingVertical: 10,
              }}
            >
              <TextMontserrat
                style={{ fontWeight: '700', fontSize: 22, color: '#47525D' }}
              >
                OR
              </TextMontserrat>
            </View>
            <View style={{ flexDirection: 'row' }}>
              <View>
                <PhoneInput
                  CountryCode={this.state.userData.CountryCode}
                  CallingCode={this.state.userData.CallingCode}
                  label={'Mobile Number'}
                  value={this.state.userData.UserMobileNumber.substring(
                    this.state.userData.UserMobileNumber.length - 10
                  )}
                  disabled={true}
                />
              </View>
              <View
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  width: 40,
                  backgroundColor: 'white',
                  position: 'absolute',
                  right: 0,
                  height: '100%',
                  paddingTop: 20,
                }}
              >
                <CheckmarkBig
                  size={32}
                  checked={this.state.userData.otpType === 2}
                  onPress={() =>
                    this.setState({
                      userData: {
                        ...this.state.userData,
                        otpType: 2,
                      },
                    })
                  }
                />
              </View>
            </View>
            <View style={{ justifyContent: 'center', alignItems: 'center' }}>
              <View style={{ width: '70%', paddingTop: 20 }}>
                <ButtonGradient
                  onPress={() => {
                    this.setState(
                      { destinationCloseButton: false, show_choose_otp: false },
                      () => {
                        this.setState({ loading: true });
                      }
                    );
                    this.props.create_account(this.state.userData, () =>
                      this.setState({ loading: false })
                    );
                    // this.setState({ show_choose_otp: false });
                  }}
                  title="SEND"
                />
              </View>
            </View>
          </PopUp>
        )}
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
        {this.props.register.show_alert && (
          <Alert
            textSize={1.5}
            fontWeight="600"
            message={this.props.register.errors}
            buttonTitle="OK"
            onPress={() => {
              this.props.hide_success_modal();
            }}
          />
        )}

        {this.state.alert.show && (
          <Alert
            textSize={1.5}
            fontWeight="600"
            message={this.state.alert.message}
            buttonTitle="OK"
            onPress={() => {
              this.setState({ alert: { show: false } });
            }}
          />
        )}
        {this.state.loading && <Loading />}
        {this.props.register.showAccountCreatedModal && (
          <AccountCreated
            onButtonClick={() => {
              this.props.hide_success_modal();
              this.props.navigation.replace(LOGIN);
            }}
          />
        )}
      </DoubleBackground>
    );
  }
}

export default CreateAccount;
