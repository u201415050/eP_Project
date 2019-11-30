import React, { Component } from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  Image,
  DatePickerAndroid,
  Dimensions,
} from 'react-native';
import { FloatingTextInput } from 'components';
import { PhoneInput, TextMontserrat } from 'components';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import LinearGradient from 'react-native-linear-gradient';
import * as userService from '../../../../login/services/user_service';
import OtpForm from './otp_form/otp_form';
import loading_service from '../../../../../services/loading_service';
//import DatePicker from 'react-native-datepicker'

import {
  callingCodes,
  countriesCodes,
} from '../../../../my_account/constants/countries';
import { isTablet } from 'components';
const isPortrait = () => {
  return !isTablet;
};
class AddCustomerHoldForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      Username: '',
      Password: '',
      UserFirstName: '',
      UserLastName: '',
      UserMobileNumber: this.props.numberCustomer,
      errors: {},
      orientation: isPortrait(),
    };
  }

  _checkFirstName() {
    const { UserFirstName } = this.state;
    const regex = new RegExp(/^[a-zA-Z ]+$/);
    if (!regex.test(UserFirstName)) {
      return this.setState({
        errors: {
          ...(this.state.errors || {}),
          firstName: ['Enter valid name'],
        },
      });
    }
  }

  _checkLastName() {
    const { UserLastName } = this.state;
    const regex = new RegExp(/^[a-zA-Z ]+$/);
    if (!regex.test(UserLastName) && UserLastName !== '') {
      return this.setState({
        errors: {
          ...(this.state.errors || {}),
          lastName: ['Enter valid lastname'],
        },
      });
    }
  }

  _checkMobile() {
    const { UserMobileNumber, CallingCode } = this.state;
    const regex = new RegExp(/^\d{10}$/);

    if (CallingCode == '91') {
      if (
        UserMobileNumber.startsWith('1') ||
        UserMobileNumber.startsWith('2') ||
        UserMobileNumber.startsWith('3') ||
        UserMobileNumber.startsWith('4') ||
        UserMobileNumber.startsWith('5')
      ) {
        return this.setState({
          errors: {
            ...(this.state.errors || {}),
            mobile: ['Enter a valid mobile number'],
          },
        });
      }
    }

    if (!regex.test(UserMobileNumber)) {
      return this.setState({
        errors: {
          ...(this.state.errors || {}),
          mobile: ['Enter a valid mobile number'],
        },
      });
    }
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
    const errors = {};
    if (this.state.UserFirstName === '') {
      errors['UserFirstName'] = ['First name cannot be empty'];
    }

    /*if (this.state.UserLastName === '') {
      errors['UserLastName'] = ['Last name cannot be empty'];
    }*/
    if (this.state.Password === '') {
      errors['Password'] = ['Password name cannot be empty'];
    }
    if (this.state.UserMobileNumber === '') {
      errors['UserMobileNumber'] = ['Mobile number cannot be empty'];
    }
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
            if (element.length > 0) {
              valid = false;
            }
          }
        }
        console.log(errors);
        this.props.isValid(valid);
      }
    );
  };
  setValueFetched = value => {
    if (!isNaN(value.substr(1))) {
      let numberParsed = value.substr(value.length - 10);
      let callingCode = value.substr(0, value.length - numberParsed.length);
      //alert(value+' '+numberParsed+' '+callingCode)
      if (value[0] == '+') {
        if (callingCodes[callingCode] != null) {
          //alert(countriesCodes[callingCodes[callingCode]])
          this.setState({
            CountryCode: countriesCodes[callingCodes[callingCode]],
            UserMobileNumber: numberParsed,
            CallingCode: callingCode,
          });
          this.mobileInput._changeText(
            numberParsed,
            countriesCodes[callingCodes[callingCode]]
          );
          //this.callRef.selectCountryCodeByCode("countriesCodes[callingCodes[callingCode]]")
        }
      } else if (value.length <= 10) {
        //alert(1)
        this.setState({
          UserMobileNumber: value,
        });
        this.mobileInput._changeText(value);
      } else {
        if (callingCodes['+' + callingCode] != null) {
          //alert(countriesCodes[callingCodes[callingCode]])
          this.setState({
            CountryCode: countriesCodes[callingCodes['+' + callingCode]],
            UserMobileNumber: numberParsed,
            CallingCode: '+' + callingCode,
          });
          this.mobileInput._changeText(
            numberParsed,
            countriesCodes[callingCodes['+' + callingCode]]
          );
          //this.callRef.selectCountryCodeByCode("countriesCodes[callingCodes[callingCode]]")
        }
      }

      /*this.setState(
        {
          CountryCode: value.alpha2Code,
          UserMobileNumber: value.phone,
          CallingCode: value.callingCode})*/
    } else if (
      value.trim().indexOf(' ') != -1 &&
      /^[a-zA-Z]+$/.test(value.split(' ').join(''))
    ) {
      let names = value.split(' ');
      let newFirstName = '';
      let newLastName = '';
      names.map((item, i) => {
        if (i == 0 || (i == 1 && names.length >= 4)) {
          newFirstName = newFirstName + item + ' ';
        } else {
          newLastName = newLastName + item + ' ';
        }
      });
      this.setState({
        UserFirstName: newFirstName.trim(),
        UserLastName: newLastName.trim(),
      });
    } else if (/^[a-zA-Z]+$/.test(value)) {
      this.setState({ UserFirstName: value.trim() });
    }
  };

  componentDidMount() {
    setTimeout(() => {
      if (this.props.fetched) this.setValueFetched(this.props.fetched);
      // this.onContentSize()
    }, 1);
  }
  validationsForm = () => {
    var valid = true;
    var regLetters = /^[a-zA-Z ]+$/;

    if (
      this.state.UserFirstName === '' ||
      !regLetters.test(this.state.UserFirstName)
    ) {
      this._checkFirstName();
      valid = false;
    }
    if (
      this.state.UserLastName !== '' &&
      !regLetters.test(this.state.UserLastName)
    ) {
      this._checkLastName();
      valid = false;
    }
    if (
      this.state.UserMobileNumber === '' ||
      this.state.UserMobileNumber.length !== 10
    ) {
      this.setState({
        errors: {
          ...(this.state.errors || {}),
          mobile: ['Enter a valid mobile number'],
        },
      });
      valid = false;
    }
    return valid;
  };

  _changePhone = value => {
    const errors = this.state.errors;
    errors['mobile'] = [];
    this.setState({
      CountryCode: value.alpha2Code,
      UserMobileNumber: value.phone,
      CallingCode: value.callingCode,
      errors,
    });
    this._changeForm({
      ...this.state,
      CountryCode: value.alpha2Code,
      UserMobileNumber: value.phone,
    });
  };

  _onTextClear(key) {
    const errors = this.state.errors;
    errors[key] = [];
    this.setState({
      errors,
    });
  }

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

  render() {
    const {
      Username,
      Password,
      UserFirstName,
      UserLastName,
      errors,
      UserMobileNumber,
    } = this.state;
    const { permiss } = this.props;
    const valid =
      this.state.UserFirstName !== '' &&
      this.state.UserFirstName !== undefined &&
      //this.state.UserLastName!=''&&
      this.state.CallingCode !== '' &&
      this.state.CallingCode !== undefined &&
      this.state.UserMobileNumber !== '' &&
      this.state.UserMobileNumber !== undefined;

    return (
      <View style={styles.formContainer}>
        <View
          style={[
            styles.nameInputs,
            this.state.orientation
              ? { height: hp('9.5%') }
              : { height: hp('12%') },
          ]}
        >
          <View style={{ flex: 1 }}>
            <FloatingTextInput
              label={'First Name'}
              value={UserFirstName}
              onChangeText={val => {
                this._textChange('UserFirstName', val);
                this.setState({
                  errors: { ...this.state.errors, firstName: [] },
                });
              }}
              onSubmitEditing={() => this._checkFirstName()}
              onBlur={() => this._checkFirstName()}
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
              errors={errors.firstName || []}
            />
          </View>
          <View style={{ flex: 1 }}>
            <FloatingTextInput
              label={'Last Name'}
              lineLeft={true}
              value={UserLastName}
              onChangeText={val => {
                this._textChange('UserLastName', val);
                this.setState({
                  errors: { ...this.state.errors, lastName: [] },
                });
              }}
              onSubmitEditing={() => this._checkLastName()}
              onBlur={() => this._checkLastName()}
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
              errors={errors.lastName || []}
            />
          </View>
        </View>
        <View
          style={[
            styles.nameInputs,
            this.state.orientation
              ? { height: hp('9.5%') }
              : { height: hp('10.9%') },
          ]}
        >
          <PhoneInput
            inputRef={x => {
              this.mobileInput = x;
            }}
            label={'Mobile Number'}
            onTextClear={this._onTextClear.bind(this, 'mobile')}
            onChange={this._changePhone}
            onSubmitEditing={() => this._checkMobile()}
            onBlur={() => this._checkMobile()}
            errors={errors.mobile || []}
            restyleComp={true}
          />
        </View>
        <View
          style={[
            styles.nameInputs,
            { justifyContent: 'center' },
            this.state.orientation
              ? {
                  height: hp('7.5%'),
                  paddingTop: hp('0.5%'),
                  marginTop: hp('1.5%'),
                }
              : { height: hp('12%'), paddingTop: hp('4%') },
          ]}
        >
          <TouchableOpacity
            disabled={!valid}
            onPress={() => {
              if (this.validationsForm()) {
                this.props.addCustomer({
                  name:
                    this.state.UserFirstName + ' ' + this.state.UserLastName,
                  number:
                    '+' + this.state.CallingCode + this.state.UserMobileNumber,
                });
              }
            }}
            style={[
              styles.touchableModalDiscountAdd,
              this.state.orientation
                ? { width: wp('70.2%'), height: hp('6.25%') }
                : { width: wp('37.1%'), height: hp('7.8%') },
            ]}
          >
            <LinearGradient
              colors={valid ? ['#174285', '#0079AA'] : ['#BDC1CD', '#BDC1CD']}
              start={{ x: 0, y: 1 }}
              end={{ x: 1, y: 1 }}
              style={{
                borderRadius: 50,
                alignItems: 'center',
                width: '100%',
                elevation: 5,
              }}
            >
              <View
                style={{
                  width: '100%',
                  height: '100%',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Text
                  style={[
                    styles.textDiscountAddButtonPortrait,
                    {
                      fontSize: this.state.orientation
                        ? wp('3.5%')
                        : hp('2.8%'),
                    },
                  ]}
                >
                  ADD
                </Text>
              </View>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const styles = {
  nameInputs: {
    flexDirection: 'row',
  },
  formContainer: {
    paddingHorizontal: hp('5%'),
    paddingVertical: hp('1%'),
  },
  textDiscountAddButtonPortrait: {
    fontFamily: 'Montserrat-SemiBold',
    color: 'white',
    fontSize: hp('1.95%'),
    letterSpacing: 1.33,
    textAlign: 'center',
  },
  touchableModalDiscountAdd: {
    width: '100%',
    height: hp('6.25%'),
    //marginTop: hp('4%'),
    borderRadius: 50,
    marginBottom: hp('4%'),
    alignItems: 'center',
  },
};

export default AddCustomerHoldForm;
