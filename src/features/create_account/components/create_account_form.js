import React, { Component } from 'react';
import { View, Dimensions } from 'react-native';
import { FloatingTextInput } from 'components';
import { PhoneInput } from 'components';
import {
  check_email,
  check_mobile,
  get_user_country,
} from './../../../services/user_service';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import password_validations from '../api/password_validations';
import { isTablet } from '../../cash_register/constants/isLandscape';

const isPortrait = () => {
  const dim = Dimensions.get('window');
  if (dim.height >= dim.width) {
    return true;
  } else {
    return false;
  }
};

class CreateAccountForm extends Component {
  state = {
    Username: '',
    Password: '',
    UserFirstName: '',
    UserLastName: '',
    UserMobileNumber: '',
    CountryCode: '',
    registeredReferralCode: '',
    otpType: 1,
    BusinessName: '',
    errors: {},

    orientation: isPortrait(),
  };

  componentDidMount() {
    get_user_country().then(x => {
      this.setState(
        {
          CountryCode: x.country_code,
        },
        () => {
          console.log(this.state);
          this.props.onChangeForm(this.state);
        }
      );
    });
  }

  passwordValidations = password_validations;
  validateEmail = email => {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  };
  _checkEmail() {
    //alert(1);
    const { Username } = this.state;
    //alert(!this.validateEmail(Username));
    if (Username === '') {
      return this.setState(
        {
          errors: {
            ...(this.state.errors || {}),
            Username: ['Enter a valid e-mail address'],
          },
        },
        () => this.formIsValid()
      );
    }
    return check_email(Username)
      .then(res => {
        const errors =
          res.errors[0] == 'There is no user found with given details.'
            ? []
            : res.errors;
        const taken = res.exists
          ? ['Email address is already registered.']
          : [];
        return this.setState(
          {
            errors: {
              ...(this.state.errors || {}),
              Username: [...taken, ...errors],
            },
          },
          () => this.formIsValid()
        );
      })
      .catch(err => {
        console.log(err);
      });
  }

  _checkMobile() {
    const { UserMobileNumber, CallingCode } = this.state;

    const regex = new RegExp(/^\d{10}$/);

    if (UserMobileNumber.startsWith('0')) {
      this.props.lockCreateButton(true);
      return this.setState(
        {
          errors: {
            ...(this.state.errors || {}),
            mobile: ['Enter a valid mobile number'],
          },
        },
        () => this.formIsValid()
      );
    }

    if (CallingCode == '91') {
      if (
        UserMobileNumber.startsWith('1') ||
        UserMobileNumber.startsWith('2') ||
        UserMobileNumber.startsWith('3') ||
        UserMobileNumber.startsWith('4') ||
        UserMobileNumber.startsWith('5')
      ) {
        this.props.lockCreateButton(true);
        return this.setState(
          {
            errors: {
              ...(this.state.errors || {}),
              mobile: ['Enter a valid mobile number'],
            },
          },
          () => this.formIsValid()
        );
      }
    }

    if (!regex.test(UserMobileNumber)) {
      this.props.lockCreateButton(true);
      return this.setState(
        {
          errors: {
            ...(this.state.errors || {}),
            mobile: ['Enter a valid mobile number'],
          },
        },
        () => this.formIsValid()
      );
    }
    return check_mobile(`+${CallingCode}${UserMobileNumber}`)
      .then(res => {
        this.props.lockCreateButton(res.exists && res.verified);
        //alert(JSON.stringify(res))
        return this.setState(
          {
            errors: {
              ...(this.state.errors || {}),
              mobile:
                !res.exists || !res.verified
                  ? []
                  : ['Number is already registered'],
            },
          },
          () => this.formIsValid()
        );
      })
      .catch(err => {
        console.log(err);
      });
  }

  _onTextClear(key) {
    const errors = this.state.errors;
    errors[key] = [];
    this.setState({
      errors,
    });
  }

  _textChange(key, value) {
    this.setState({ [key]: value });
    const errors = this.state.errors;
    errors[key] = [];
    this.setState(
      {
        errors,
      },
      () => {
        this._changeForm({
          ...this.state,
          ...{ [key]: value },
        });
        this.formIsValid();
      }
    );
  }

  _changeForm = payload => {
    if (this.props.onChangeForm) {
      const { errors, ...newPayload } = payload;
      this.formIsValid();
      this.props.onChangeForm(newPayload);
    }
  };

  formIsValid = () => {
    const errors = {
      ...this.state.errors,
    };
    if (this.state.UserFirstName === '') {
      errors['UserFirstName'] = ['First name cannot be empty'];
    }

    if (this.state.UserLastName === '') {
      errors['UserLastName'] = ['Last name cannot be empty'];
    }
    if (this.state.Password === '') {
      errors['Password'] = ['Password name cannot be empty'];
    }
    if (this.state.mobile === '') {
      errors['UserMobileNumber'] = ['Mobile number cannot be empty'];
    }
    this.passwordValidations.map((validation, i) => {
      const passed = validation.validateInput(this.state.Password);
      if (!passed) {
        errors['Password'] = ['Password is not valid'];
      }
    });
    this.setState(
      {
        errors: {
          ...(this.state.errors || {}),
          ...errors,
        },
      },
      () => {
        let valid = true;
        for (const key in this.state.errors) {
          if (errors.hasOwnProperty(key)) {
            const element = this.state.errors[key];
            //console.log(element);
            if (element.length > 0) {
              valid = false;
            }
          }
        }
        // this.props.isValid(valid);
      }
    );
  };

  _changePhone = value => {
    //console.log({ value });
    const errors = this.state.errors;
    errors['mobile'] = [];

    this.setState(
      {
        CountryCode: value.alpha2Code,
        UserMobileNumber: value.phone,
        CallingCode: value.callingCode,
        errors,
      },
      () => {
        if (value.phone.length === 10) {
          this._checkMobile();
          this._changeForm({
            ...this.state,
            CallingCode: value.callingCode,
            CountryCode: value.alpha2Code,
            UserMobileNumber: value.phone,
          });
        }
      }
    );
  };

  render() {
    const {
      Username,
      Password,
      UserFirstName,
      UserLastName,
      registeredReferralCode,
      BusinessName,
      errors,
    } = this.state;

    return (
      <View style={this.props.containerStyle}>
        <View style={styles.nameInputs}>
          <View style={{ flex: 1 }}>
            <FloatingTextInput
              inputRef={input => {
                this.firstnameInput = input;
              }}
              label={'First Name'}
              value={UserFirstName}
              onlyLetters={true}
              onChangeText={val => {
                this._textChange('UserFirstName', val);
              }}
              onSubmitEditing={() => {
                this.firstnameInput.setNativeProps({
                  selection: { start: 0, end: 0 },
                });
                this.lastnameInput.focus();
              }}
              onBlur={() => {
                this.firstnameInput.setNativeProps({
                  selection: { start: 0, end: 0 },
                });
              }}
              onFocus={() => {
                if (this.props.changePad) {
                  this.props.changePad(isTablet ? -hp('20%') : -hp('15%'));
                }
                if (this.props.scrollTo) this.props.scrollTo(0);
              }}
              labelSizeUp={this.state.orientation ? hp('1.8%') : hp('2.2%')}
              labelSizeDown={this.state.orientation ? hp('2.1%') : hp('2.7%')}
              labelPlacingUp={0}
              labelPlacingDown={this.state.orientation ? hp('4%') : hp('4%')}
              inputContainerStyle={
                this.state.orientation
                  ? { height: hp('8%') }
                  : { height: hp('9.1%') }
              }
              inputStyle={
                this.state.orientation
                  ? {
                      fontSize: hp('2.1%'),
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
              //inputStyle={{backgroundColor:'#E3C1A5'}}
              // errors={errors.UserFirstName || []}
            />
          </View>
          <View style={{ flex: 1 }}>
            <FloatingTextInput
              inputRef={input => {
                this.lastnameInput = input;
              }}
              label={'Last Name'}
              lineLeft={true}
              onFocus={() => {
                if (this.props.changePad) {
                  this.props.changePad(isTablet ? -hp('20%') : -hp('15%'));
                }
                if (this.props.scrollTo) this.props.scrollTo(0);
              }}
              value={UserLastName}
              onlyLetters={true}
              onChangeText={val => this._textChange('UserLastName', val)}
              onSubmitEditing={() => {
                this.lastnameInput.setNativeProps({
                  selection: { start: 0, end: 0 },
                });
                this.emailInput.focus();
              }}
              onBlur={() => {
                this.lastnameInput.setNativeProps({
                  selection: { start: 0, end: 0 },
                });
              }}
              labelSizeUp={this.state.orientation ? hp('1.8%') : hp('2.2%')}
              labelSizeDown={this.state.orientation ? hp('2.1%') : hp('2.7%')}
              labelPlacingUp={0}
              labelPlacingDown={this.state.orientation ? hp('4%') : hp('4%')}
              inputContainerStyle={
                this.state.orientation
                  ? { height: hp('8%') }
                  : { height: hp('9.1%') }
              }
              inputStyle={
                this.state.orientation
                  ? {
                      fontSize: hp('2.1%'),
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
          </View>
        </View>
        <View>
          <FloatingTextInput
            inputRef={input => {
              this.emailInput = input;
            }}
            label={'E-mail'}
            value={Username}
            onFocus={() => {
              if (this.props.changePad) {
                this.props.changePad(-hp('10%'));
              }
              if (this.props.scrollTo) this.props.scrollTo(0);
            }}
            keyboardType="email-address"
            onChangeText={val => this._textChange('Username', val)}
            onSubmitEditing={() => {
              //alert(1);
              this._checkEmail();
              this.emailInput.setNativeProps({
                selection: { start: 0, end: 0 },
              });
              this.passwordInput.focus();
            }}
            onBlur={() => {
              if (this.state.Username != '') {
                this._checkEmail();
                this.emailInput.setNativeProps({
                  selection: { start: 0, end: 0 },
                });
                this.state.Username != '' ? this._checkEmail.bind(this) : null;
              }
            }}
            errors={[
              ...(errors.Username || []),
              ...(this.props.formErrors.Username || []),
            ]}
            onTextClear={this._onTextClear.bind(this, 'Username')}
            autoCapitalize={'none'}
            labelSizeUp={this.state.orientation ? hp('1.8%') : hp('2.2%')}
            labelSizeDown={this.state.orientation ? hp('2.1%') : hp('2.7%')}
            labelPlacingUp={0}
            labelPlacingDown={this.state.orientation ? hp('4%') : hp('4%')}
            inputContainerStyle={
              this.state.orientation
                ? { height: hp('8%') }
                : { height: hp('9.1%') }
            }
            inputStyle={
              this.state.orientation
                ? {
                    fontSize: hp('2.1%'),
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
        </View>
        <View>
          <FloatingTextInput
            inputRef={input => {
              this.passwordInput = input;
            }}
            label={'Password'}
            secureTextEntry={true}
            value={Password}
            onChangeText={val => this._textChange('Password', val)}
            onSubmitEditing={() => {
              this.passwordInput.setNativeProps({
                selection: { start: 0, end: 0 },
              });
              //this.phoneInput.onFocus();
            }}
            onFocus={() => {
              if (this.props.changePad) {
                this.props.changePad(-hp('8%'));
              }
              if (this.props.scrollTo) this.props.scrollTo(0);
            }}
            validate={{
              title: 'Password must contain',
              validations: this.passwordValidations,
            }}
            errors={
              (this.state.Password !== '' ? this.state.errors.Password : []) ||
              []
            }
            labelSizeUp={this.state.orientation ? hp('1.8%') : hp('2.2%')}
            labelSizeDown={this.state.orientation ? hp('2.1%') : hp('2.7%')}
            labelPlacingUp={0}
            labelPlacingDown={this.state.orientation ? hp('4%') : hp('4%')}
            inputContainerStyle={
              this.state.orientation
                ? { height: hp('8%') }
                : { height: hp('9.1%') }
            }
            inputStyle={
              this.state.orientation
                ? {
                    fontSize: hp('2.1%'),
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
        </View>
        <View>
          <PhoneInput
            inputRef={input => {
              this.phoneInput = input;
            }}
            onTextClear={this._onTextClear.bind(this, 'mobile')}
            onChange={this._changePhone.bind(this)}
            onSubmitEditing={() => this._checkMobile()}
            // onBlur={() => {
            //   this.state.Username != '' ? this._checkMobile() : null;
            // }}
            onFocus={() => {
              if (this.props.changePad) {
                this.props.changePad(-hp('2%'));
              }
              if (this.props.scrollToEnd) this.props.scrollToEnd();
            }}
            onBlur={() => {
              this.state.UserMobileNumber != '' ? this._checkMobile() : null;
            }}
            errors={errors.mobile || []}
            restyleComp={true}
            labelSizeUp={this.state.orientation ? hp('1.8%') : hp('2.2%')}
            labelSizeDown={this.state.orientation ? hp('2.1%') : hp('2.7%')}
          />
        </View>
        <View>
          <FloatingTextInput
            inputRef={input => {
              this.companyInput = input;
            }}
            label={'Company Name'}
            labelOptional={'(Optional)'}
            value={BusinessName}
            onChangeText={val => this._textChange('BusinessName', val)}
            onSubmitEditing={() => {
              this.companyInput.setNativeProps({
                selection: { start: 0, end: 0 },
              });
              this.referralInput.focus();
            }}
            onBlur={() => {
              this.companyInput.setNativeProps({
                selection: { start: 0, end: 0 },
              });
            }}
            onFocus={() => {
              if (this.props.changePad) {
                this.props.changePad(hp('0%'));
              }
              if (this.props.scrollToEnd) this.props.scrollToEnd();
              //this.props.scrollToRef(this.companyInput);
            }}
            labelSizeUp={this.state.orientation ? hp('1.8%') : hp('2.2%')}
            labelSizeDown={this.state.orientation ? hp('2.1%') : hp('2.7%')}
            labelPlacingUp={0}
            labelPlacingDown={this.state.orientation ? hp('4%') : hp('4%')}
            inputContainerStyle={
              this.state.orientation
                ? { height: hp('8%') }
                : { height: hp('9.1%') }
            }
            inputStyle={
              this.state.orientation
                ? {
                    fontSize: hp('2.1%'),
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
        </View>
        <View>
          <FloatingTextInput
            inputRef={input => {
              this.referralInput = input;
            }}
            returnKeyType={'done'}
            label={'Referral Code'}
            labelOptional={'(Optional)'}
            value={registeredReferralCode}
            onChangeText={val =>
              this._textChange('registeredReferralCode', val)
            }
            onFocus={() => {
              if (this.props.changePad) {
                this.props.changePad(hp('0%'));
              }
              //this.props.scrollToRef(this.referralInput);
              if (this.props.scrollToEnd) this.props.scrollToEnd();
            }}
            onlyNumbers={true}
            keyboardType={'numeric'}
            maxLength={6}
            labelSizeUp={this.state.orientation ? hp('1.8%') : hp('2.2%')}
            labelSizeDown={this.state.orientation ? hp('2.1%') : hp('2.7%')}
            labelPlacingUp={0}
            labelPlacingDown={this.state.orientation ? hp('4%') : hp('4%')}
            inputContainerStyle={
              this.state.orientation
                ? { height: hp('8%') }
                : { height: hp('9.1%') }
            }
            inputStyle={
              this.state.orientation
                ? {
                    fontSize: hp('2.1%'),
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
        </View>
      </View>
    );
  }
}

const styles = {
  nameInputs: {
    flexDirection: 'row',
  },
};

export default CreateAccountForm;
