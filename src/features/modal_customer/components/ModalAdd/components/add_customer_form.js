import React, { Component } from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  Image,
  DatePickerAndroid,
  Dimensions,
  AsyncStorage,
  NetInfo,
  Platform,
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
import alert_service from '../../../../../services/alert_service';
//import DatePicker from 'react-native-datepicker'
import ModalLogout from '../../../../cash_register/components/Modals/ModalLogout/modalLogout';
import moment from 'moment';
import CalendarDate from '../../../../../components_general/utilities/calendarDate';
import { epaisaRequest } from '../../../../../services/epaisa_service';
import realm, { createRow } from '../../../../../services/realm_service';
import alert_double_service from 'services/alert_double_service';
import AlertDoubleButtons from '../../../../../components_general/popups/AlertDoubleButtons';
import {
  callingCodes,
  countriesCodes,
} from '../../../../my_account/constants/countries';
import { isTablet } from 'components';

const isPortrait = () => {
  return !isTablet;
};
class AddCustomerForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      customerId: '',
      Username: '',
      Password: '',
      UserFirstName: '',
      UserLastName: '',
      UserMobileNumber: '',
      CountryCode: '',
      Anniversary: '',
      otpType: 1,
      DateBirth: '',
      errors: {},
      nameError: false,

      orientation: isPortrait(),
      errorBirthday: false,
      errorAnniversary: false,

      show_otp: false,
      customerIdTemp: '',
      sentToNumber: '',
      merchantId: 0,

      otpInputColor: '#174285',
      otpError: false,
      otpResend: false,
      calendar: false,
      modalInvalid: false,
      dateBirthSelected: moment().subtract(18, 'years'),
      dateAnniversarySelected: moment(),
      typeDate: '',
      alertdouble: false,
      selectionDefault: Platform.OS == 'android' ? { start: 0, end: 0 } : null,
    };
  }
  onContentSize = () => {
    if (Platform.OS == 'android') {
      this.setState(
        {
          selectionDefault: { start: 0, end: 0 },
        },
        () =>
          this.setState({
            selectionDefault: null,
          })
      );
    }
  };
  _checkEmail() {
    const { Username } = this.state;
    var regEmail = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,3}$/i;
    if (Username === '' || !regEmail.test(Username)) {
      return this.setState({
        errors: {
          ...(this.state.errors || {}),
          Username: ['Enter a valid e-mail address'],
        },
      });
    }
    this.onContentSize();
  }

  _checkMobile() {
    console.log('PHONE VALIDATION CALLED');
    const { UserMobileNumber, CallingCode } = this.state;
    const regex = new RegExp(/^\d{10}$/);
    if (!regex.test(UserMobileNumber)) {
      return this.setState({
        errors: {
          ...(this.state.errors || {}),
          mobile: ['Enter a valid mobile number'],
        },
      });
    }
  }

  _checkNames() {
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
    this.onContentSize();
  }

  _checkLastNames() {
    const { UserLastName } = this.state;
    const regex = new RegExp(/^[a-zA-Z ]+$/);
    if (UserLastName !== '' && !regex.test(UserLastName)) {
      return this.setState({
        errors: {
          ...(this.state.errors || {}),
          lastName: ['Enter valid lastname'],
        },
      });
    }
    this.onContentSize();
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
    var valid = true;

    if (this.state.UserFirstName === '') {
      errors['UserFirstName'] = ['First name cannot be empty'];
    }

    if (this.state.UserLastName === '') {
      errors['UserLastName'] = ['Last name cannot be empty'];
    }
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
        for (const key in this.state.errors) {
          if (errors.hasOwnProperty(key)) {
            const element = this.state.errors[key];
            if (element.length > 0) {
              valid = false;
            }
          }
        }
        console.log(errors);
        //this.props.isValid(valid);
      }
    );
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

  _checkBirthDay() {
    const regExpression = '[0-9]{1,2}(-)[0-9]{1,2}(-)[0-9]{4}';
    if (
      this.state.DateBirth != '' &&
      !this.state.DateBirth.match(regExpression)
    ) {
      this.setState({
        errorBirthday: true,
      });
      return;
    }

    const dateArray = this.state.DateBirth.split('-'); // dd-mm-yyyy to mm-dd-yyyy
    var actualYear = moment().format('YYYY');

    if (parseInt(actualYear) < parseInt(dateArray[2])) {
      this.setState({
        errorBirthday: true,
      });
      return;
    }

    var newDate = dateArray[1] + '-' + dateArray[0] + '-' + dateArray[2];

    if (
      this.state.DateBirth != '' &&
      !moment(`${newDate}`, 'MM-DD-YYYY').isValid()
    ) {
      this.setState({
        errorBirthday: true,
      });
      return;
    }
  }

  _checkAnniversary() {
    const regExpression = '[0-9]{1,2}(-)[0-9]{1,2}(-)[0-9]{4}';
    if (
      this.state.Anniversary != '' &&
      !this.state.Anniversary.match(regExpression)
    ) {
      this.setState({
        errorAnniversary: true,
      });
      return;
    }

    const dateArray = this.state.Anniversary.split('-'); // dd-mm-yyyy to mm-dd-yyyy
    var actualYear = moment().format('YYYY');

    if (parseInt(actualYear) < parseInt(dateArray[2])) {
      this.setState({
        errorAnniversary: true,
      });
      return;
    }

    var newDate = dateArray[1] + '-' + dateArray[0] + '-' + dateArray[2];

    if (
      this.state.Anniversary != '' &&
      !moment(`${newDate}`, 'MM-DD-YYYY').isValid()
    ) {
      this.setState({
        errorAnniversary: true,
      });
      return;
    }
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

  clearErrors = () => {
    this.setState({ otpError: false, otpInputColor: '#174285' });
  };

  validationsForm = () => {
    var valid = true;

    var regEmail = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,3}$/i;
    var regLetters = /^[a-zA-Z ]+$/;
    var regNumbers = /^\d{10}$/;
    const dateExpression = '[0-9]{1,2}(/|-)[0-9]{1,2}(/|-)[0-9]{4}';

    if (
      this.state.UserFirstName === '' ||
      !regLetters.test(this.state.UserFirstName)
    ) {
      this._checkNames();
      valid = false;
    }
    if (
      this.state.UserLastName !== '' &&
      !regLetters.test(this.state.UserLastName)
    ) {
      this._checkLastNames();
      valid = false;
    }
    if (
      this.state.Username === '' ||
      !regEmail.test(String(this.state.Username).toLowerCase())
    ) {
      this._checkEmail();
      valid = false;
    }
    if (
      this.state.UserMobileNumber === '' ||
      this.state.UserMobileNumber.length !== 10
    ) {
      this._checkMobile();
      valid = false;
    }
    if (
      !this.state.Anniversary.match(dateExpression) &&
      this.state.Anniversary !== ''
    ) {
      this._checkAnniversary();
      valid = false;
    }
    if (
      !this.state.DateBirth.match(dateExpression) &&
      this.state.DateBirth !== ''
    ) {
      this._checkBirthDay();
      valid = false;
    }

    return valid;
  };

  toTimestampFromPicker = strDate => {
    //yyyy-mm-dd
    myDate = strDate.split('-');
    var newDate = myDate[1] + '/' + myDate[2] + '/' + myDate[0]; //mm-dd-yyyy
    return Date.parse(newDate) / 1000;
  };

  actionRegisterCustomer = async () => {
    if (this.validationsForm()) {
      loading_service.showLoading();
      const dateOfBirth = this.state.DateBirth;
      const dateBirth = dateOfBirth
        ? moment(dateOfBirth, 'DD-MM-YYYY').format('YYYY-MM-DD')
        : '';
      const dateOfAnniversary = this.state.Anniversary;
      const dateAnniversary = dateOfAnniversary
        ? moment(dateOfAnniversary, 'DD-MM-YYYY').format('YYYY-MM-DD')
        : '';
      epaisaRequest(
        {
          firstName: this.state.UserFirstName,
          lastName: this.state.UserLastName || '',
          email: this.state.Username,
          phoneNumber:
            '+' + this.state.CallingCode + ' ' + this.state.UserMobileNumber,
          countryCode: this.state.CountryCode,
          dob: dateBirth,
          customerDetails: [{ paramName: 'doa', paramValue: dateAnniversary }],
        },
        '/customer/add',
        'POST'
      )
        .then(response => {
          loading_service.hideLoading();

          console.log('on response addCustomer');
          console.log(response);
          if (response.success == 1) {
            /************************************          OTP SEND?          ****************************** */
            AsyncStorage.setItem('totalCustomers', response.response.Total);

            const id =
              response.response.customerId ||
              response.response.Customer.customerId;
            const sentTo =
              response.response.phoneNumber ||
              response.response.Customer.phoneNumber;
            this.setState({
              show_otp: true,
              customerIdTemp: id,
              sentToNumber: sentTo,
              merchantId: 0,
            });
            /************************************************************ */
          } else {
            console.log('on response 0');
            console.log(response);

            if (response.errorCode == '2.16.455') {
              if (response.messageDetails.hasOwnProperty('email')) {
                alert_service.showAlert(response.messageDetails.email);
                this.setState({
                  errors: {
                    ...(this.state.errors || {}),
                    Username: ['Enter a valid e-mail address'],
                  },
                });
              } else if (response.messageDetails.hasOwnProperty('lastName')) {
                alert_service.showAlert(response.messageDetails.lastName);
                this.setState({
                  errors: {
                    ...(this.state.errors || {}),
                    UserLastName: ['Enter a valid lastname'],
                  },
                });
              } else {
                alert_service.showAlert(response.messageDetails.phoneNumber);
                this.setState({
                  errors: {
                    ...(this.state.errors || {}),
                    mobile: ['Enter a valid mobile number'],
                  },
                });
              }
            } else if (response.errorCode == '2.16.456') {
              if (response.messageDetails.hasOwnProperty('email')) {
                alert_service.showAlert(
                  'This email address is already registered in your customer list'
                );
                this.setState({
                  errors: {
                    ...(this.state.errors || {}),
                    Username: ['Enter a valid e-mail address'],
                  },
                });
              } else {
                alert_service.showAlert(
                  'This number is already registered in your customer list'
                );
                this.setState({
                  errors: {
                    ...(this.state.errors || {}),
                    mobile: [
                      'This number is already registered in your customer list',
                    ],
                  },
                });
              }
            } else if (
              response.message ==
              'Your request was made with invalid credentials.'
            ) {
              //this.props.closeFormFromOtp()
              this.setState({ modalInvalid: true });
            } else {
              alert_service.showAlert(
                /*response.message*/ "Your data couldn't be saved"
              );
            }
          }
        })
        .catch(error => {
          loading_service.hideLoading();
          alert(error);
        });
    } else {
      //alert_service.showAlert('Please, enter valid data');
      this.setState(
        {
          errors: {
            ...this.state.errors,
            firstName:
              this.state.UserFirstName === '' ? ['Enter valid name'] : [],
            //lastName: this.state.UserLastName === '' ? ['Enter valid lastname'] : [],
            Username:
              this.state.Username === ''
                ? ['Enter a valid e-mail address']
                : [],
            mobile:
              this.state.UserMobileNumber == ''
                ? ['Enter a valid mobile number']
                : [],
          },
        },
        () => console.log(this.state.errors)
      );
    }
  };

  actionCallOtpApi = async (authKey, customId, otpNumber) => {
    let userData = realm.objectForPrimaryKey('User', 0);
    loading_service.showLoading();
    epaisaRequest(
      { customerId: customId, otp: otpNumber },
      '/customer/validate',
      'POST'
    ).then(response => {
      console.log('on RSPONSE actionCallOtpApi', response);
      console.log('FIRSTPART:', response);
      if (response.success == 1) {
        this.setState({ show_otp: false });

        /*AsyncStorage.setItem('totalCustomers',response.response.Total);
          epaisaRequest({
            customerId: customId,
            email: this.state.Username,
            firstName: this.state.UserFirstName,
            lastName: this.state.UserLastName,}, '/customer', 'PUT').then(response=>console.log("EDITING", response))
          */ epaisaRequest(
          {
            merchantId: userData.merchantId,
            offset: 0,
            otpIsNull: true,
          },
          '/customer',
          'GET'
        ).then(response => {
          console.log('SECONDPART:', response);
          try {
            let custo = response.response.Customer.filter(item => {
              return item.customerId == customId;
            });
            console.log('LISTOTAL:', custo);
            if (custo.length > 0) {
              let selected = custo[0];
              console.log('Selected', selected);
              let data = {
                customerId: selected.customerId,
                firstName: selected.firstName,
                lastName: selected.lastName,
                email: this.state.Username,
                phoneNumber: selected.phoneNumber,
                countryCode: selected.countryCode,
                customerDetails: [],
              };

              console.log('DATA', data);
              createRow('CustomerAPI', data, true);
            }
            /**/
          } catch (error) {
            alert(error);
          }
          AsyncStorage.setItem('totalCustomers', response.response.Total);
          this.props.list_customers({
            customers: response.response.Customer,
            userdata: {
              auth_key: authKey,
              merchantId: userData.merchantId,
            },
          });
          //AsyncStorage.setItem('totalCustomers', response.response.Total);
          /*this.props.list_customers({
                customers: response.response.Customer,
                userdata: {
                  auth_key: authKey,
                  merchantId: userData.merchantId,
                },
              });*/
          this.props.addCustomer({
            customerId: this.state.customerIdTemp + '',
            name: this.state.UserFirstName + ' ' + this.state.UserLastName,
            number:
              '+' + this.state.CallingCode + ' ' + this.state.UserMobileNumber,
          });
          if (this.props.onFinished) {
            this.props.onFinished();
          } else {
            loading_service.hideLoading();
          }
        });
      } else {
        loading_service.hideLoading();
        this.setState({
          otpInputColor: '#D0021B',
          otpError: true,
          otpResend: true,
        });
        if (response.message == 'Cannot save data!') {
          loading_service.hideLoading();
          this.setState({
            errors: {
              ...(this.state.errors || {}),
              mobile: ['Enter a valid mobile number'],
            },
          });
        }
        if (
          response.message == 'Your request was made with invalid credentials.'
        ) {
          loading_service.hideLoading();
          //this.props.closeFormFromOtp()
          this.setState({ modalInvalid: true });
        }
      }
    });
  };

  setDateBorn = async () => {
    try {
      const { action, year, month, day } = await DatePickerAndroid.open({
        date: new Date(),
        minDate: new Date(1930, 0, 1),
        maxDate: new Date(),
      });
      if (action !== DatePickerAndroid.dismissedAction) {
        var monthTemp = month + 1;
        this.setState({
          DateBirth: `${day < 10 ? '0' + day : day}-${
            monthTemp < 10 ? '0' + monthTemp : monthTemp
          }-${year}`,
        });
        this.birthInput._changeText(
          `${day < 10 ? '0' + day : day}-${
            monthTemp < 10 ? '0' + monthTemp : monthTemp
          }-${year}`
        );
      }
    } catch ({ code, message }) {
      console.warn('Cannot open date picker', message);
    }
  };

  setDateAnniversary = async () => {
    try {
      const { action, year, month, day } = await DatePickerAndroid.open({
        date: new Date(),
        minDate: new Date(1930, 0, 1),
      });
      if (action !== DatePickerAndroid.dismissedAction) {
        var monthTemp = month + 1;
        this.setState({
          Anniversary: `${day < 10 ? '0' + day : day}-${
            monthTemp < 10 ? '0' + monthTemp : monthTemp
          }-${year}`,
        });
        this.anniversaryInput._changeText(
          `${day < 10 ? '0' + day : day}-${
            monthTemp < 10 ? '0' + monthTemp : monthTemp
          }-${year}`
        );
      }
    } catch ({ code, message }) {
      console.warn('Cannot open date picker', message);
    }
  };
  setValueFetched = value => {
    if (value.indexOf('@') != -1) {
      this.setState({ Username: value });
      //this.emailInput._changeText(value)
    } else if (!isNaN(value.substr(1))) {
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
      this.onContentSize();
    }, 1);
  }
  render() {
    const {
      Username,
      Password,
      UserFirstName,
      UserLastName,
      Anniversary,
      DateBirth,
      errors,
      UserMobileNumber,
    } = this.state;
    return (
      <View style={styles.formContainer}>
        <View
          style={[
            {},
            styles.nameInputs,
            this.state.orientation
              ? { height: hp('9.5%') }
              : { height: hp('12%') },
          ]}
        >
          <View style={{ flex: 1 }}>
            <FloatingTextInput
              ref={input => (this.firstnameinput = input)}
              label={'First Name'}
              value={UserFirstName}
              onlyLetters={true}
              returnKeyType={'done'}
              onSubmitEditing={this._checkNames.bind(this)}
              onBlur={this._checkNames.bind(this)}
              onChangeText={val => {
                this._textChange('UserFirstName', val);
                this.setState({
                  errors: {
                    ...this.state.errors,
                    firstName: [],
                  },
                });
              }}
              labelSizeUp={this.state.orientation ? wp('3%') : hp('2.2%')}
              labelSizeDown={this.state.orientation ? wp('3.5%') : hp('2.7%')}
              labelPlacingUp={0}
              labelPlacingDown={this.state.orientation ? hp('4%') : hp('4%')}
              inputContainerStyle={
                this.state.orientation
                  ? { height: hp('8%') }
                  : { height: hp('9.1%') }
              }
              selection={this.state.selectionDefault}
              onContentSizeChange={this.onContentSize}
              touched={true}
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
              // errors={['Omar is shit']}
              errors={errors.firstName || []}
            />
          </View>
          <View style={{ flex: 1 }}>
            <FloatingTextInput
              label={'Last Name'}
              lineLeft={true}
              value={UserLastName}
              onlyLetters={true}
              returnKeyType={'done'}
              onSubmitEditing={this._checkLastNames.bind(this)}
              onBlur={this._checkLastNames.bind(this)}
              onChangeText={val => {
                this._textChange('UserLastName', val);
                this.setState({
                  errors: {
                    ...this.state.errors,
                    lastName: [],
                  },
                });
              }}
              selection={this.state.selectionDefault}
              onContentSizeChange={this.onContentSize}
              touched={true}
              labelSizeUp={this.state.orientation ? wp('3%') : hp('2.2%')}
              labelSizeDown={this.state.orientation ? wp('3.5%') : hp('2.7%')}
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
              : { height: hp('12%') },
          ]}
        >
          <FloatingTextInput
            label={'E-mail'}
            value={Username}
            inputRef={input => (this.emailInput = input)}
            onChangeText={val => this._textChange('Username', val)}
            onSubmitEditing={this._checkEmail.bind(this)}
            onBlur={this._checkEmail.bind(this)}
            errors={errors.Username || []}
            autoCapitalize={'none'}
            touched={true}
            returnKeyType={'done'}
            selection={this.state.selectionDefault}
            onContentSizeChange={this.onContentSize}
            labelSizeUp={this.state.orientation ? wp('3%') : hp('2.2%')}
            labelSizeDown={this.state.orientation ? wp('3.5%') : hp('2.7%')}
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
                    width: '90%',
                    borderLeftWidth: 0,
                    fontSize: hp('2.1%'),
                    height: hp('5%'),
                    marginTop: hp('3%'),
                    paddingBottom: 0,
                  }
                : {
                    width: '85%',
                    borderLeftWidth: 0,
                    fontSize: hp('2.7%'),
                    height: hp('6.9%'),
                    marginTop: hp('3%'),
                    marginLeft: 0,
                    paddingBottom: 0,
                  }
            }
            underlineStyle={
              this.state.orientation
                ? { height: hp('0.4%') }
                : { height: hp('0.4%') }
            }
            //iconStyle={{bottom: hp('0.1%'), zIndex: 0,}}
            iconSize={this.state.orientation ? hp('3%') : hp('3.8%')}
          />
        </View>
        <View
          style={[
            styles.nameInputs,
            this.state.orientation
              ? { height: hp('9.5%') }
              : { height: hp('12%') },
          ]}
        >
          <PhoneInput
            ref={x => {
              this.callRef = x;
            }}
            inputRef={x => {
              this.mobileInput = x;
            }}
            label={'Mobile Number'}
            onTextClear={this._onTextClear.bind(this, 'mobile')}
            onChange={this._changePhone}
            touched={true}
            onSubmitEditing={this._checkMobile.bind(this)}
            onBlur={this._checkMobile.bind(this)}
            errors={errors.mobile || []}
            restyleComp={true}
          />
          {/*<FloatingTextInput
            value={UserMobileNumber}
            onChangeText={val => this._textChange('UserMobileNumber', val)}
            errors={errors.mobile || []}
            autoCapitalize={'none'}
          />*/}
        </View>
        <View
          style={[
            styles.nameInputs,
            { flexDirection: 'column' },
            this.state.orientation
              ? { height: hp('9.5%') }
              : { height: hp('12%') },
          ]}
        >
          <TouchableOpacity
            style={{ flex: 1, zIndex: 10 }}
            onPress={() => this.setState({ calendar: true, typeDate: 'birth' })}
          >
            <FloatingTextInput
              //date={true}
              label={'Date of Birth'}
              labelOptional={'(DD-MM-YYYY)'}
              value={this.state.DateBirth}
              ref={input => {
                this.birthInput = input;
              }}
              onChangeText={v =>
                this.setState({ DateBirth: v, errorBirthday: false })
              }
              disabled={true}
              keyboardType={'number-pad'}
              returnKeyType={'done'}
              maxLength={10}
              onBlur={this._checkBirthDay.bind(this)}
              onSubmitEditing={this._checkBirthDay.bind(this)}
              touched={true}
              optionalLabelFontsizeUp={
                this.state.orientation ? wp('2.4%') : hp('1.9%')
              }
              optionalLabelFontsizeDown={
                this.state.orientation ? wp('2.9%') : hp('2.4%')
              }
              labelSizeUp={this.state.orientation ? wp('3%') : hp('2.2%')}
              labelSizeDown={this.state.orientation ? wp('3.5%') : hp('2.7%')}
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
              nocancel={true}
            />
            <TouchableOpacity
              style={{
                position: 'absolute',
                right: hp('1.6%'),
                bottom: this.state.orientation ? hp('2.75%') : hp('2.7%'),
              }}
              onPress={() =>
                this.setState({ calendar: true, typeDate: 'birth' })
              }
            >
              <Image
                style={
                  this.state.orientation
                    ? { opacity: 0.6, height: hp('2.7%'), width: hp('2.7%') }
                    : { opacity: 0.6, height: hp('3.5%'), width: hp('3.5%') }
                }
                source={require('../../../assets/icons/calendar.png')}
              />
            </TouchableOpacity>
          </TouchableOpacity>
          {this.state.errorBirthday && (
            <TextMontserrat
              style={{
                fontSize: this.state.orientation ? wp('3%') : hp('1.85%'),
                fontWeight: '600',
                color: 'red',
                marginTop: this.state.orientation ? hp('0.5%') : hp('1.1%'),
              }}
            >
              Please enter a valid date.
            </TextMontserrat>
          )}
        </View>
        <View
          style={[
            styles.nameInputs,
            { flexDirection: 'column' },
            this.state.orientation
              ? { height: hp('9.5%') }
              : { height: hp('12%') },
          ]}
        >
          <TouchableOpacity
            style={{ flex: 1, zIndex: 10 }}
            onPress={() =>
              this.setState({ calendar: true, typeDate: 'anniversary' })
            }
          >
            <FloatingTextInput
              //date={true}
              label={'Anniversary'}
              labelOptional={'(DD-MM-YYYY)'}
              value={this.state.Anniversary}
              ref={input => {
                this.anniversaryInput = input;
              }}
              onChangeText={v =>
                this.setState({ Anniversary: v, errorAnniversary: false })
              }
              keyboardType={'number-pad'}
              returnKeyType={'done'}
              maxLength={10}
              disabled={true}
              onSubmitEditing={this._checkAnniversary.bind(this)}
              onBlur={this._checkAnniversary.bind(this)}
              touched={true}
              optionalLabelFontsizeUp={
                this.state.orientation ? wp('2.4%') : hp('1.9%')
              }
              optionalLabelFontsizeDown={
                this.state.orientation ? wp('2.9%') : hp('2.4%')
              }
              labelSizeUp={this.state.orientation ? wp('3%') : hp('2.2%')}
              labelSizeDown={this.state.orientation ? wp('3.5%') : hp('2.7%')}
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
              nocancel={true}
            />
            <TouchableOpacity
              style={{
                position: 'absolute',
                right: hp('1.6%'),
                bottom: this.state.orientation ? hp('2.75%') : hp('2.7%'),
              }}
              onPress={() =>
                this.setState({ calendar: true, typeDate: 'anniversary' })
              }
            >
              <Image
                style={
                  this.state.orientation
                    ? { opacity: 0.6, height: hp('2.7%'), width: hp('2.7%') }
                    : { opacity: 0.6, height: hp('3.5%'), width: hp('3.5%') }
                }
                source={require('../../../assets/icons/calendar.png')}
              />
            </TouchableOpacity>
          </TouchableOpacity>
          {this.state.errorAnniversary && (
            <TextMontserrat
              style={{
                fontSize: this.state.orientation ? wp('3%') : hp('1.85%'),
                fontWeight: '600',
                color: 'red',
                marginTop: this.state.orientation ? hp('0.5%') : hp('1.1%'),
              }}
            >
              Please enter a valid date.
            </TextMontserrat>
          )}
        </View>
        <View
          style={[
            styles.nameInputs,
            { justifyContent: 'center' },
            this.state.orientation
              ? {
                  height: hp('7.5%'),
                  paddingTop: hp('0.5%'),
                  marginTop: hp('2%'),
                }
              : { height: hp('12%'), paddingTop: hp('4%') },
          ]}
        >
          <TouchableOpacity
            onPress={async () => {
              const isConnected = await NetInfo.isConnected.fetch();

              if (isConnected) {
                /*if(Platform.OS==="ios"){
                    this.setState({alertdouble:true})
                  }
                  alert_double_service.showAlertDouble(
                    'Confirmation',
                    `Please verify customer data by clicking cancel. You may update this data from customer details section at anytime.`,
                    this.actionRegisterCustomer,
                    ()=>{},
                    "OK",
                    "CANCEL"
                  );*/
                // alert_double_service.showAlertDouble(
                //   'Confirmation',
                //   `Please verify customer data by clicking cancel. You may update this data from customer details section at anytime.`,
                //   this.actionRegisterCustomer,
                //   ()=>{},
                //   "OK",
                //   "CANCEL"
                // );
                this.actionRegisterCustomer();
              } else {
                alert_service.showAlert('Please connect to Internet');
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
              colors={['#174285', '#0079AA']}
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
        <ModalLogout
          active={this.state.modalInvalid}
          closeModal={() => {
            this.setState({ modalInvalid: false });
          }}
        />
        {this.state.alertdouble ? (
          <AlertDoubleButtons
            positiveAction={() => {
              this.setState(
                { alertdouble: false },
                this.actionRegisterCustomer
              );
            }}
            negativeAction={() => {
              this.setState({ alertdouble: false });
            }}
            visible={this.state.alertdouble}
            message={`Please make sure that the information provided is correct, they cannot be altered once submitted`}
            title={'Confirm'}
            titleConfirm="PROCEED"
            titleCancel="RECHECK"
            close={() => this.setState({ alertdouble: false })}
          />
        ) : null}
        <CalendarDate
          active={this.state.calendar}
          closeModal={() => this.setState({ calendar: false })}
          currentDate={(this.state.typeDate == 'birth'
            ? this.state.dateBirthSelected
            : this.state.dateAnniversarySelected
          ).format('YYYY-MM-DD')}
          minDate={moment('1930-01-01')}
          maxDate={
            this.state.typeDate == 'birth'
              ? moment().subtract(18, 'years')
              : moment(`${moment().format('YYYY')}-12-31`)
          }
          dateSelected={
            this.state.typeDate == 'birth'
              ? this.state.dateBirthSelected
              : this.state.dateAnniversarySelected
          }
          onDayPress={date => {
            if (this.state.typeDate == 'birth') {
              this.setState({ dateBirthSelected: date });
            } else {
              this.setState({ dateAnniversarySelected: date });
            }
          }}
          handleCancel={() => {
            if (this.state.typeDate == 'birth') {
              this.setState({
                calendar: false,
              }); /*dateBirthSelected:this.state.DateBirth!=''?moment(this.state.DateBirth,"DD-MM-YYYY"):moment()}, () => {
                this._changeForm(this.state);
                this.birthInput._changeText(this.state.dateBirthSelected.format("DD-MM-YYYY"));
            });*/
            } else {
              this.setState({
                calendar: false,
              }); /*, dateAnniversarySelected:this.state.Anniversary!=''?moment(this.state.Anniversary,"DD-MM-YYYY"):moment()}, () => {
                this._changeForm(this.state);
                this.anniversaryInput._changeText(this.state.dateAnniversarySelected.format("DD-MM-YYYY"));
            });*/
            }
          }}
          handleOk={() => {
            if (this.state.typeDate == 'birth') {
              this.setState(
                { calendar: false, DateBirth: this.state.dateBirthSelected },
                () => {
                  this._changeForm(this.state);
                  this.birthInput._changeText(
                    this.state.dateBirthSelected.format('DD-MM-YYYY')
                  );
                }
              );
            } else {
              this.setState(
                {
                  calendar: false,
                  Anniversary: this.state.dateAnniversarySelected,
                },
                () => {
                  this._changeForm(this.state);
                  this.anniversaryInput._changeText(
                    this.state.dateAnniversarySelected.format('DD-MM-YYYY')
                  );
                }
              );
            }
          }}
        />
        {//this.props.show_customer_otp &&
        this.state.show_otp && (
          //true &&
          <OtpForm
            customerId={this.state.customerIdTemp}
            customerPhone={this.state.sentToNumber}
            verifyCustomer={val => this.props.verifyCustomer(val)}
            otpInputColor={this.state.otpInputColor}
            otpError={this.state.otpError}
            otpResend={this.state.resend_otp}
            otpValid={this.actionCallOtpApi}
            resendOtp={this.actionRegisterCustomer}
            cleanError={this.clearErrors}
            close={() => {
              this.setState({ show_otp: false });
              // this.props.closeFormFromOtp();
            }}
          />
        )}
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
    marginBottom: hp('3%'),
    alignItems: 'center',
  },
};

export default AddCustomerForm;
