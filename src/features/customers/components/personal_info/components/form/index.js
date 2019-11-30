import React, { Component } from 'react';
import {
  View,
  Text,
  Dimensions,
  Image,
  TouchableOpacity,
  DatePickerAndroid,
  AsyncStorage,
  PermissionsAndroid,
  Alert,
  Platform,
  NetInfo,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { Card, FloatingTextInput, PhoneInput } from 'components';
import * as UserServices from 'services/user_service';
import * as portraitStyles from './styles/portrait';
import * as landscapeStyles from './styles/landscape';
import loading_service from '../../../../../../services/loading_service';
import Geolocation from 'react-native-geolocation-service';
import alert_service from 'services/alert_service';
import moment from 'moment';
import CalendarDate from '../../../../../../components_general/utilities/calendarDate';
import { epaisaRequest } from '../../../../../../services/epaisa_service';
import realm from 'services/realm_service';

const isPortrait = () => {
  const dim = Dimensions.get('window');
  if (dim.height >= dim.width) {
    return true;
  } else {
    return false;
  }
};

class PersonalInfoForm extends Component {
  constructor(props) {
    super(props);
    console.log('ITEM FOR CUSTOMER', this.props.item);
    this.state = {
      isPortrait: isPortrait(),
      auth_key: '',
      coords: {},
      customer: this.props.item,
      customerFirstname: this.props.item.firstName,
      customerLastname: this.props.item.lastName,
      customerEmail: this.props.item.email,
      customerPhone: this.props.item.phoneNumber,
      customerAnniversary:
        this.props.item.customerDetails.length > 0
          ? this.props.item.customerDetails[0].paramValue
              .split('-')
              .reverse()
              .join('/')
          : '',
      customerBirthday: this.props.item.dob
        ? this.props.item.dob
            .split('-')
            .reverse()
            .join('/')
        : '',
      customerAddress: this.props.item.address1 || '',
      customerPinCode: this.props.item.pincode || '',
      customerCity: '',
      customerState: '',
      customerCountry: '',
      errors: {},
      dateBirthSelected: moment(),
      dateAnniversarySelected: moment(),
      typeDate: '',
      calendar: false,

      isFocusedAddress: false,

      firstNameSelection: null,
      lastNameSelection: null,
      emailSelection: null,
      birthdaySelection: null,
      anniversarySelection: null,
      addressSelection: null,
      citySelection: null,
      stateSelection: null,
      countrySelection: null,

      selectionDefault: { start: 0, end: 0 },
    };
  }

  componentDidMount() {
    const user = realm.objectForPrimaryKey('User', 0);

    this.setState({ auth_key: user.auth_key });

    if (this.state.customerPinCode != '') {
      this.fetchStateAndCity(this.state.customerPinCode, this.setCursorOnStart);
    }

    // alert(JSON.stringify(this.props.isEditable))
    // alert(JSON.stringify(this.props.item))
  }

  UNSAFE_componentWillReceiveProps(props) {
    this.setState({
      customer: props.item,
      customerFirstname: props.item.firstName,
      customerLastname: props.item.lastName,
      customerEmail: props.item.email,
      customerPhone: props.item.phoneNumber,
      customerAnniversary:
        props.item.customerDetails.length > 0
          ? props.item.customerDetails[0].paramValue
              .split('-')
              .reverse()
              .join('/')
          : '',
      customerBirthday: props.item.dob
        ? props.item.dob
            .split('-')
            .reverse()
            .join('/')
        : '',
      customerAddress: props.item.address1 || '',
      customerPinCode: props.item.pincode || '',
    });
  }
  onContentSize = () => {
    this.setState(
      {
        selectionDefault: { start: 0, end: 0 },
      },
      () =>
        this.setState({
          selectionDefault: null,
        })
    );
  };
  requestLocationPermission = async () => {
    try {
      const granted =
        Platform.OS == 'android'
          ? await PermissionsAndroid.request(
              PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
              {
                title: 'Allow Location Permissions',
                message:
                  'ePaisa requires your permission to get ' + 'your location.',
              }
            )
          : '';
      if (
        granted ===
        (Platform.OS == 'android' ? PermissionsAndroid.RESULTS.GRANTED : '')
      ) {
        console.log('You can use the location');
        //loading_service.showLoading();
        Geolocation.getCurrentPosition(
          position => {
            console.log('CORDS', position);
            this.setState({ coords: position.coords }, () => {
              this.getLocationAddress(this.state.coords);
            });
          },
          error => {
            // See error code charts below.
            console.log(error.code, error.message);
            loading_service.hideLoading();
            /*alert_service.showAlert(
              'A problem occurred on this proccess: ' + error.message
            );*/
          },
          { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
        );
      } else {
        console.log('Location permission denied');
        alert_service.showAlert('Permission denied. Location not available');
      }
    } catch (err) {
      console.warn(err);
      /*alert_service.showAlert(
        'A problem occurred on this proccess:' + err.message
      );*/
    }
  };

  getLocationAddress = value => {
    //var newAddress = '';
    fetch(
      'https://maps.googleapis.com/maps/api/geocode/json?address=' +
        value.latitude +
        ',' +
        value.longitude +
        '&key=' +
        'AIzaSyCnL-az4h0lpbi6J6WHTFhqXn_vujK3X3s'
    )
      .then(response => response.json())
      .then(responseJson => {
        if (responseJson.status === 'OK') {
          //console.log(responseJson.results[0].formatted_address);
          this.setState(
            { customerAddress: responseJson.results[0].formatted_address },
            () => this.sendEditRequest()
          );
          // alert(responseJson.results[0].formatted_address)
          //newAddress = responseJson.results[0].formatted_address;
          //alert(this.state.customerAddress)
        } else {
          loading_service.hideLoading();
          alert_service.showAlert('Location service not available');
        }
      });
    //return newAddress;
  };

  fetchStateAndCity = async (pinCode, callback) => {
    let isConnected = await NetInfo.isConnected.fetch();
    //alert(pinCode)
    if (isConnected) {
      if (pinCode != '' && pinCode.length === 6) {
        //loading_service.showLoading();

        epaisaRequest({ pincode: pinCode }, '/area/index', 'POST')
          .then(res => {
            //alert(JSON.stringify(res))
            if (res.success == 1) {
              let response = res.response.Areas;
              loading_service.hideLoading();
              //if (parsedResponse.PostOffice.length > 0) {
              //const postOffice = parsedResponse.PostOffice[0];
              this.setState(
                {
                  customerCity: response.cityName,
                  customerState: response.stateName,
                  // merchantCountryCode: countriesCodes[postOffice.Country],
                  customerCountry: response.countryName,
                },
                () => {
                  callback();
                  setTimeout(this.onContentSize, 500);
                }
              );
            } else {
              loading_service.hideLoading();
              if (parsedResponse.Message == 'No records found') {
                alert_service.showAlert('Invalid PIN code');
                this.setState({ customerPinCode: '' });
              } else {
                alert_service.showAlert(
                  'An error occurred during this process'
                );
              }
            }
          })
          .catch(error => {
            /*alert(error)*/
          });
      } else {
        alert('PIN Code must contain 6 digits');
        this.setState({ customerPinCode: '' });
      }
    } else {
      //alert_service.showAlert('Please, connect to Internet');
    }
  };

  _textChange(key, value) {
    this.setState({ [key]: value });
    const errors = this.state.errors;
    errors[key] = [];
    this.setState(
      {
        errors,
      },
      () => {}
    );
  }

  _checkFirstName() {
    const { customerFirstname } = this.state;
    const regex = new RegExp(/^[a-zA-Z ]+$/);
    if (!regex.test(customerFirstname)) {
      return this.setState({
        errors: {
          ...(this.state.errors || {}),
          customerFirstname: ['Enter valid name'],
        },
      });
    }
  }

  _checkLastName() {
    const { customerLastname } = this.state;
    const regex = new RegExp(/^[a-zA-Z ]+$/);
    if (!regex.test(customerLastname)) {
      return this.setState({
        errors: {
          ...(this.state.errors || {}),
          customerLastname: ['Enter valid lastname'],
        },
      });
    }
  }

  _checkBirthDay() {
    const { customerBirthday } = this.state;

    const regExpression = '[0-9]{1,2}(/|-)[0-9]{1,2}(/|-)[0-9]{4}';
    if (!customerBirthday.match(regExpression) && customerBirthday !== '') {
      return this.setState({
        errors: {
          ...(this.state.errors || {}),
          customerBirthday: ['Enter valid date'],
        },
      });
    }

    const dateArray = customerBirthday.split('/');

    if (dateArray[0] > 31 || dateArray[0] < 1) {
      return this.setState({
        errors: {
          ...(this.state.errors || {}),
          customerBirthday: ['Enter valid date'],
        },
      });
    }

    if (dateArray[1] > 12 || dateArray[1] < 1) {
      return this.setState({
        errors: {
          ...(this.state.errors || {}),
          customerBirthday: ['Enter valid date'],
        },
      });
    }
  }

  _checkAnniversary() {
    const { customerAnniversary } = this.state;

    const regExpression = '[0-9]{1,2}(/|-)[0-9]{1,2}(/|-)[0-9]{4}';
    if (
      !customerAnniversary.match(regExpression) &&
      customerAnniversary !== ''
    ) {
      alert('notmatch');
      return this.setState({
        errors: {
          ...(this.state.errors || {}),
          customerAnniversary: ['Enter valid date'],
        },
      });
    }

    const dateArray = customerAnniversary.split('/');

    if (dateArray[0] > 31 || dateArray[0] < 1) {
      alert('notmatch1');
      return this.setState({
        errors: {
          ...(this.state.errors || {}),
          customerAnniversary: ['Enter valid date'],
        },
      });
    }

    if (dateArray[1] > 12 || dateArray[1] < 1) {
      alert('notmatch2');
      return this.setState({
        errors: {
          ...(this.state.errors || {}),
          customerAnniversary: ['Enter valid date'],
        },
      });
    }
  }

  validationsForm = () => {
    var valid = true;
    var regLetters = /^[a-zA-Z ]+$/;
    const dateExpression = '[0-9]{1,2}(/|-)[0-9]{1,2}(/|-)[0-9]{4}';

    if (
      this.state.customerFirstname === '' ||
      !regLetters.test(this.state.customerFirstname)
    ) {
      this._checkFirstName();
      valid = false;
    }
    if (
      this.state.customerLastname === '' ||
      !regLetters.test(this.state.customerLastname)
    ) {
      this._checkLastName();
      valid = false;
    }
    if (
      !this.state.customerAnniversary.match(dateExpression) &&
      this.state.customerAnniversary !== ''
    ) {
      this._checkAnniversary();
      valid = false;
    }
    if (
      !this.state.customerBirthday.match(dateExpression) &&
      this.state.customerBirthday !== ''
    ) {
      this._checkBirthDay();
      valid = false;
    }

    return valid;
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
          customerAnniversary: `${day < 10 ? '0' + day : day}/${
            monthTemp < 10 ? '0' + monthTemp : monthTemp
          }/${year}`,
        });
        this.anniversaryInput._changeText(
          `${day < 10 ? '0' + day : day}/${
            monthTemp < 10 ? '0' + monthTemp : monthTemp
          }/${year}`
        );
      }
    } catch ({ code, message }) {
      console.warn('Cannot open date picker', message);
    }
  };

  setDateBirthday = async () => {
    try {
      const { action, year, month, day } = await DatePickerAndroid.open({
        date: new Date(),
        minDate: new Date(1930, 0, 1),
        maxDate: new Date(),
      });
      if (action !== DatePickerAndroid.dismissedAction) {
        var monthTemp = month + 1;
        this.setState({
          customerBirthday: `${day < 10 ? '0' + day : day}/${
            monthTemp < 10 ? '0' + monthTemp : monthTemp
          }/${year}`,
        });
        this.birthdayInput._changeText(
          `${day < 10 ? '0' + day : day}/${
            monthTemp < 10 ? '0' + monthTemp : monthTemp
          }/${year}`
        );
      }
    } catch ({ code, message }) {
      console.warn('Cannot open date picker', message);
    }
  };

  setCursorOnStart = () => {
    this.setState(
      {
        firstNameSelection: { start: 0, end: 0 },
        lastNameSelection: { start: 0, end: 0 },
        // emailSelection: {start: 0, end: 0},
        birthdaySelection: { start: 0, end: 0 },
        anniversarySelection: { start: 0, end: 0 },
        addressSelection: { start: 0, end: 0 },
        citySelection: { start: 0, end: 0 },
        stateSelection: { start: 0, end: 0 },
        countrySelection: { start: 0, end: 0 },
      },
      () =>
        this.setState({
          firstNameSelection: null,
          lastNameSelection: null,
          // emailSelection: null,
          birthdaySelection: null,
          anniversarySelection: null,
          addressSelection: null,
          citySelection: null,
          stateSelection: null,
          countrySelection: null,
        })
    );
  };

  sendEditRequest = async () => {
    let isConnected = await NetInfo.isConnected.fetch();

    this.setCursorOnStart();

    if (isConnected) {
      this.editOnAPI();
      // this.editOnLocalDB();
    } else {
      //alert('No internet connection');
      this.editOnLocalDB();
    }
  };

  editOnAPI = async () => {
    if (this.validationsForm()) {
      //loading_service.showLoading();
      const {
        auth_key,
        customer,
        customerAddress,
        customerFirstname,
        customerLastname,
        customerBirthday,
        customerAnniversary,
        customerPinCode,
      } = this.state;

      let jsonToSend = {
        customerId: customer.customerId,
        email: customer.email,
        phoneNumber: customer.phoneNumber,
        address1: customerAddress,
        firstName: customerFirstname,
        lastName: customerLastname,
        dob: this.formatDate(customerBirthday),
        pincode: customerPinCode,
        customerDetails: [
          {
            paramName: 'doa',
            paramValue: this.formatDate(customerAnniversary),
          },
        ],
      };
      console.log('DATA', jsonToSend);
      await epaisaRequest(jsonToSend, '/customer', 'PUT')
        .then(res => {
          console.log('edit_customer', res);
          if (res.success == 1) {
            //this.props.changeCustomer({ ...this.props.item, ...jsonToSend });
            //this.props.updateCardInfo(res.response);
            loading_service.hideLoading();
          } else {
            loading_service.hideLoading();
            //alert_service.showAlert('A problem occurred during this proccess');
          }
        })
        .catch(error => {
          console.log(error);
          loading_service.hideLoading();
        });
    } else {
      loading_service.hideLoading();
    }
  };

  editOnLocalDB = () => {
    // alert('called : ')
    if (this.validationsForm()) {
      const modifiedItem = {
        ...this.props.item,
        firstName: this.state.customerFirstname,
        lastName: this.state.customerLastname,
        dob: this.state.customerBirthday,
        address1: this.state.customerAddress,
        pincode: this.state.customerPinCode,
        customerDetails: [
          {
            paramName: 'doa',
            paramValue: this.state.customerAnniversary,
          },
        ],
        sync: 'n',
      };

      const updt = realm.objectForPrimaryKey(
        'CustomerAPI',
        this.props.item.customerId
      );
      realm.write(() => {
        updt.firstName = this.state.customerFirstname;
        updt.lastName = this.state.customerLastname;
        updt.dob = this.state.customerBirthday;
        updt.address1 = this.state.customerAddress;
        updt.pincode = this.state.customerPinCode;
        (updt.customerDetails = [
          {
            paramName: 'doa',
            paramValue: this.state.customerAnniversary,
          },
        ]),
          (updt.sync = 'n');
      });

      // alert('updated')
    }
  };

  toTimestamp = strDate => {
    myDate = strDate.split('/');
    var newDate = +myDate[1] - 1 + '-' + myDate[0] + '-' + myDate[2];
    return Date.parse(newDate) / 1000;
  };

  formatDate = strDate => {
    return strDate
      .split('/')
      .reverse()
      .join('-');
  };

  render() {
    const isPortrait = this.state.isPortrait;
    const styles = isPortrait ? portraitStyles.styles : landscapeStyles.styles;

    const customer = this.state.customer;
    const numberSplit = this.state.customerPhone.split(' ');
    const callingCode = numberSplit[0].replace('+', '');
    const countryCode = this.props.item.countryCode;
    const phoneNumber = numberSplit[1];
    const addressFound = this.state.customerAddress;

    console.log('COUNTRY CODE', countryCode);
    console.log('PHONE NUMBER', phoneNumber);

    const { errors } = this.state;

    return (
      <View style={styles.container}>
        <Card style={styles.card}>
          <View
            style={{ flexDirection: 'row', flex: 1, alignItems: 'flex-end' }}
          >
            <View
              style={{
                width: hp('5%'),
                justifyContent: 'flex-end',
                marginRight: wp('2.5%'),
              }}
            >
              <Image
                source={require('../../assets/images/name.png')}
                style={{ height: hp('5%'), width: hp('5%') }}
                resizeMode={'contain'}
              />
            </View>
            <View
              style={[
                { flexDirection: 'row', flex: 1 },
                isPortrait ? { height: hp('7%') } : { height: hp('9%') },
              ]}
            >
              <View style={{ width: '50%' }}>
                <FloatingTextInput
                  ref={input => (this.firstnameinput = input)}
                  label={'First Name'}
                  value={this.state.customerFirstname}
                  onlyLetters={true}
                  disabled={!this.props.isEditable}
                  onFocus={() => this.setState({ firstNameSelection: null })}
                  onBlur={this.sendEditRequest.bind(this)}
                  onSubmitEditing={this.sendEditRequest.bind(this)}
                  onChangeText={val => {
                    this._textChange('customerFirstname', val);
                    this.setState({
                      errors: {
                        ...this.state.errors,
                        firstName: [],
                      },
                    });
                  }}
                  selection={this.state.firstNameSelection}
                  onContentSizeChange={() =>
                    this.setState(
                      {
                        firstNameSelection: { start: 0, end: 0 },
                      },
                      () =>
                        this.setState({
                          firstNameSelection: null,
                        })
                    )
                  }
                  labelSizeUp={isPortrait ? hp('1.5%') : hp('2%')}
                  labelSizeDown={isPortrait ? hp('2%') : hp('2.3%')}
                  labelPlacingUp={isPortrait ? 0 : hp('2%')}
                  labelPlacingDown={isPortrait ? hp('3%') : hp('5%')}
                  inputContainerStyle={
                    isPortrait ? { height: hp('3%') } : { height: hp('7%') }
                  }
                  touched={true}
                  inputStyle={
                    isPortrait
                      ? {
                          fontSize: hp('2%'),
                          height: hp('5%'),
                          marginTop: hp('2%'),
                          paddingBottom: 0,
                        }
                      : {
                          fontSize: hp('2.5%'),
                          height: hp('5%'),
                          marginTop: hp('4%'),
                          paddingBottom: 0,
                        }
                  }
                  underlineStyle={
                    isPortrait ? { height: hp('0.4%') } : { height: hp('0.4%') }
                  }
                  iconStyle={
                    isPortrait
                      ? { bottom: hp('0.1%'), zIndex: 0 }
                      : { bottom: hp('0.1%'), zIndex: 0 }
                  }
                  iconSize={isPortrait ? hp('2.7%') : hp('3%')}
                  errors={errors.customerFirstname || []}
                />
              </View>
              <View style={{ width: '50%' }}>
                <FloatingTextInput
                  label={'Last Name'}
                  lineLeft={true}
                  value={this.state.customerLastname}
                  onlyLetters={true}
                  disabled={!this.props.isEditable}
                  onFocus={() => this.setState({ lastNameSelection: null })}
                  onBlur={this.sendEditRequest.bind(this)}
                  onSubmitEditing={this.sendEditRequest.bind(this)}
                  onChangeText={val => {
                    this._textChange('customerLastname', val);
                    this.setState({
                      errors: {
                        ...this.state.errors,
                        lastName: [],
                      },
                    });
                  }}
                  selection={this.state.lastNameSelection}
                  onContentSizeChange={() =>
                    this.setState(
                      {
                        lastNameSelection: { start: 0, end: 0 },
                      },
                      () =>
                        this.setState({
                          lastNameSelection: null,
                        })
                    )
                  }
                  labelSizeUp={isPortrait ? hp('1.5%') : hp('2%')}
                  labelSizeDown={isPortrait ? hp('2%') : hp('2.3%')}
                  labelPlacingUp={isPortrait ? 0 : hp('2%')}
                  labelPlacingDown={isPortrait ? hp('3%') : hp('5%')}
                  inputContainerStyle={
                    isPortrait ? { height: hp('3%') } : { height: hp('7%') }
                  }
                  touched={true}
                  inputStyle={
                    isPortrait
                      ? {
                          fontSize: hp('2%'),
                          height: hp('5%'),
                          marginTop: hp('2%'),
                          paddingBottom: 0,
                        }
                      : {
                          fontSize: hp('2.5%'),
                          height: hp('5%'),
                          marginTop: hp('4%'),
                          paddingBottom: 0,
                        }
                  }
                  underlineStyle={
                    isPortrait ? { height: hp('0.4%') } : { height: hp('0.4%') }
                  }
                  iconStyle={
                    isPortrait
                      ? { bottom: hp('0.1%'), zIndex: 0 }
                      : { bottom: hp('0.1%'), zIndex: 0 }
                  }
                  iconSize={isPortrait ? hp('2.7%') : hp('3%')}
                  errors={errors.customerLastname || []}
                />
              </View>
            </View>
          </View>
          <View
            style={{ flexDirection: 'row', flex: 1, alignItems: 'flex-end' }}
          >
            <View
              style={{
                width: hp('5%'),
                justifyContent: 'flex-end',
                marginRight: wp('2.5%'),
              }}
            >
              <Image
                source={require('../../assets/images/email.png')}
                style={{ height: hp('5%'), width: hp('5%') }}
                resizeMode={'contain'}
              />
            </View>
            <View
              style={[
                { flex: 1 },
                isPortrait ? { height: hp('7%') } : { height: hp('9%') },
              ]}
            >
              <FloatingTextInput
                label={'E-mail'}
                value={this.state.customerEmail}
                disabled={true}
                /*onChangeText={val => this._textChange('Username', val)}
                  onSubmitEditing={this._checkEmail.bind(this)}
                  onBlur={this._checkEmail.bind(this)}
                  errors={errors.Username || []}*/
                selection={this.state.emailSelection}
                onContentSizeChange={() =>
                  this.setState(
                    {
                      emailSelection: { start: 0, end: 0 },
                    },
                    () =>
                      this.setState({
                        emailSelection: null,
                      })
                  )
                }
                autoCapitalize={'none'}
                touched={true}
                labelSizeUp={isPortrait ? hp('1.5%') : hp('2%')}
                labelSizeDown={isPortrait ? hp('2%') : hp('2.3%')}
                labelPlacingUp={isPortrait ? 0 : hp('2%')}
                labelPlacingDown={isPortrait ? hp('3%') : hp('5%')}
                inputContainerStyle={
                  isPortrait ? { height: hp('3%') } : { height: hp('7%') }
                }
                touched={true}
                inputStyle={
                  isPortrait
                    ? {
                        width: '100%',
                        fontSize: hp('2%'),
                        height: hp('5%'),
                        marginTop: hp('2%'),
                        paddingBottom: 0,
                      }
                    : {
                        width: '100%',
                        fontSize: hp('2.5%'),
                        height: hp('5%'),
                        marginTop: hp('4%'),
                        paddingBottom: 0,
                      }
                }
                underlineStyle={
                  isPortrait ? { height: hp('0.4%') } : { height: hp('0.4%') }
                }
                iconStyle={
                  isPortrait
                    ? { bottom: hp('0.1%'), zIndex: 0 }
                    : { bottom: hp('0.1%'), zIndex: 0 }
                }
                iconSize={isPortrait ? hp('2.7%') : hp('3%')}
              />
            </View>
          </View>
          <View
            style={{ flexDirection: 'row', flex: 1, alignItems: 'flex-end' }}
          >
            <View
              style={{
                width: hp('5%'),
                justifyContent: 'flex-end',
                marginRight: wp('2.5%'),
              }}
            >
              <Image
                source={require('../../assets/images/phone.png')}
                style={{ height: hp('5%'), width: hp('5%') }}
                resizeMode={'contain'}
              />
            </View>
            <View
              style={[
                { flex: 1 },
                isPortrait ? { height: hp('7%') } : { height: hp('9%') },
              ]}
            >
              <PhoneInput
                personal={true}
                label={'Mobile Number'}
                value={phoneNumber}
                CallingCode={callingCode}
                CountryCode={countryCode}
                nonEditable={true}
                /*onTextClear={this._onTextClear.bind(this, 'mobile')}
                onChange={this._changePhone}
                onSubmitEditing={() => this._checkMobile()}
                onBlur={() => this._checkMobile()}
                errors={errors.mobile || []}*/
                restyleComp={true}
                labelSizeUp={isPortrait ? hp('1.5%') : hp('2%')}
                labelSizeDown={isPortrait ? hp('2%') : hp('2.3%')}
                labelPlacingUp={isPortrait ? 0 : hp('1%')}
                labelPlacingDown={isPortrait ? hp('3%') : hp('5%')}
                inputContainerStyle={
                  isPortrait ? { height: hp('3%') } : { height: hp('7%') }
                }
                touched={true}
                inputStyle={
                  isPortrait
                    ? {
                        borderLeftWidth: 0,
                        fontSize: hp('2%'),
                        height: hp('5%'),
                        marginTop: hp('2%'),
                        paddingBottom: 0,
                      }
                    : {
                        borderLeftWidth: 0,
                        fontSize: hp('2.5%'),
                        height: hp('6%'),
                        marginTop: hp('3%'),
                        paddingBottom: 0,
                      }
                }
                underlineStyle={
                  isPortrait ? { height: hp('0.4%') } : { height: hp('0.4%') }
                }
                iconStyle={
                  isPortrait
                    ? { bottom: hp('0.1%'), zIndex: 0 }
                    : { bottom: hp('0.1%'), zIndex: 0 }
                }
                iconSize={isPortrait ? hp('2.7%') : hp('3%')}
              />
            </View>
          </View>
          <View style={{ flexDirection: 'row', flex: 1 }}>
            <View
              style={{ flexDirection: 'row', flex: 1, alignItems: 'flex-end' }}
            >
              <TouchableOpacity
                style={{
                  width: hp('5%'),
                  justifyContent: 'flex-end',
                  marginRight: wp('2.5%'),
                }}
                onPress={() =>
                  this.setState({ calendar: true, typeDate: 'birth' })
                }
                disabled={!this.props.isEditable}
              >
                <Image
                  source={require('../../assets/images/calendar.png')}
                  style={{ height: hp('5%'), width: hp('5%') }}
                  resizeMode={'contain'}
                />
              </TouchableOpacity>
              <View
                style={[
                  { flex: 1 },
                  isPortrait ? { height: hp('7%') } : { height: hp('9%') },
                ]}
              >
                <TouchableOpacity
                  style={{ flex: 1 }}
                  onPress={() =>
                    this.setState({ calendar: true, typeDate: 'birth' })
                  }
                  activeOpacity={0.6}
                  disabled={!this.props.isEditable}
                >
                  <FloatingTextInput
                    //date={true}
                    disabled={true}
                    label={'Birthdate'}
                    // labelOptional={'(dd/mm/yyyy)'}
                    value={this.state.customerBirthday}
                    ref={input => {
                      this.birthdayInput = input;
                    }}
                    onChangeText={v => {
                      this.setState(
                        {
                          customerBirthday: v,
                          errors: {
                            ...this.state.errors,
                            customerBirthday: [],
                          },
                        },
                        () => {
                          this.sendEditRequest();
                        }
                      );
                    }}
                    keyboardType={'number-pad'}
                    returnKeyType={'done'}
                    maxLength={10}
                    onBlur={() => {
                      this.sendEditRequest();
                    }}
                    selection={this.state.birthdaySelection}
                    onContentSizeChange={() =>
                      this.setState(
                        {
                          birthdaySelection: { start: 0, end: 0 },
                        },
                        () =>
                          this.setState({
                            birthdaySelection: null,
                          })
                      )
                    }
                    touched={true}
                    labelSizeUp={isPortrait ? hp('1.5%') : hp('2%')}
                    labelSizeDown={isPortrait ? hp('2%') : hp('2.3%')}
                    labelPlacingUp={isPortrait ? 0 : hp('1%')}
                    labelPlacingDown={isPortrait ? hp('3%') : hp('5%')}
                    inputContainerStyle={
                      isPortrait ? { height: hp('3%') } : { height: hp('7%') }
                    }
                    inputStyle={
                      isPortrait
                        ? {
                            width: '100%',
                            borderLeftWidth: 0,
                            fontSize: hp('2%'),
                            height: hp('5%'),
                            marginTop: hp('2%'),
                            paddingBottom: 0,
                          }
                        : {
                            width: '100%',
                            borderLeftWidth: 0,
                            fontSize: hp('2.5%'),
                            height: hp('6%'),
                            marginTop: hp('3%'),
                            paddingBottom: 0,
                          }
                    }
                    underlineStyle={
                      isPortrait
                        ? { height: hp('0.4%') }
                        : { height: hp('0.4%') }
                    }
                    iconStyle={
                      isPortrait
                        ? { bottom: hp('0.1%'), zIndex: 0 }
                        : { bottom: hp('0.1%'), zIndex: 0 }
                    }
                    iconSize={isPortrait ? hp('2.7%') : hp('3%')}
                    nocancel={true}
                    errors={errors.customerBirthday || []}
                  />
                </TouchableOpacity>
              </View>
            </View>
            <View
              style={{
                height: '100%',
                width: isPortrait ? wp('0.5%') : wp('0.2%'),
                justifyContent: 'flex-end',
                marginLeft: isPortrait ? wp('1.5%') : wp('1%'),
                marginRight: isPortrait ? wp('1.5%') : wp('1%'),
              }}
            >
              <View
                style={{
                  height: isPortrait ? '50%' : '65%',
                  width: '100%',
                  backgroundColor: '#eee',
                }}
              />
            </View>
            <View
              style={{ flexDirection: 'row', flex: 1, alignItems: 'flex-end' }}
            >
              <TouchableOpacity
                style={{
                  width: hp('5%'),
                  justifyContent: 'flex-end',
                  marginRight: wp('2.5%'),
                }}
                onPress={() =>
                  this.setState({ calendar: true, typeDate: 'anniversary' })
                }
                disabled={!this.props.isEditable}
              >
                <Image
                  source={require('../../assets/images/calendar.png')}
                  style={{ height: hp('5%'), width: hp('5%') }}
                  resizeMode={'contain'}
                />
              </TouchableOpacity>
              <View
                style={[
                  { flex: 1 },
                  isPortrait ? { height: hp('7%') } : { height: hp('9%') },
                ]}
              >
                <TouchableOpacity
                  style={{ flex: 1 }}
                  onPress={() =>
                    this.setState({ calendar: true, typeDate: 'anniversary' })
                  }
                  activeOpacity={0.6}
                  disabled={!this.props.isEditable}
                >
                  <FloatingTextInput
                    //date={true}
                    disabled={true}
                    label={'Anniversary'}
                    // labelOptional={'(dd/mm/yyyy)'}
                    value={this.state.customerAnniversary}
                    ref={input => {
                      this.anniversaryInput = input;
                    }}
                    onChangeText={v => {
                      this.setState(
                        {
                          customerAnniversary: v /*, errorAnniversary: false*/,
                        },
                        () => {
                          // if (this.state.customerAnniversary.length === 10)
                          this.sendEditRequest();
                        }
                      );
                    }}
                    selection={this.state.anniversarySelection}
                    onContentSizeChange={() =>
                      this.setState(
                        {
                          anniversarySelection: { start: 0, end: 0 },
                        },
                        () =>
                          this.setState({
                            anniversarySelection: null,
                          })
                      )
                    }
                    keyboardType={'number-pad'}
                    returnKeyType={'done'}
                    maxLength={10}
                    //onBlur={this._checkAnniversary.bind(this)}
                    touched={true}
                    labelSizeUp={isPortrait ? hp('1.5%') : hp('2%')}
                    labelSizeDown={isPortrait ? hp('2%') : hp('2.3%')}
                    labelPlacingUp={isPortrait ? 0 : hp('1%')}
                    labelPlacingDown={isPortrait ? hp('3%') : hp('5%')}
                    inputContainerStyle={
                      isPortrait ? { height: hp('3%') } : { height: hp('7%') }
                    }
                    inputStyle={
                      isPortrait
                        ? {
                            borderLeftWidth: 0,
                            fontSize: hp('2%'),
                            height: hp('5%'),
                            marginTop: hp('2%'),
                            paddingBottom: 0,
                            flex: 1,
                          }
                        : {
                            flex: 1,
                            borderLeftWidth: 0,
                            fontSize: hp('2.5%'),
                            height: hp('6%'),
                            marginTop: hp('3%'),
                            paddingBottom: 0,
                          }
                    }
                    underlineStyle={
                      isPortrait
                        ? { height: hp('0.4%') }
                        : { height: hp('0.4%') }
                    }
                    iconStyle={
                      isPortrait
                        ? { bottom: hp('0.1%'), zIndex: 0 }
                        : { bottom: hp('0.1%'), zIndex: 0 }
                    }
                    iconSize={isPortrait ? hp('2.7%') : hp('3%')}
                    nocancel={true}
                    errors={errors.customerAnniversary || []}
                  />
                </TouchableOpacity>
              </View>
            </View>
          </View>
          <View
            style={{ flexDirection: 'row', flex: 1, alignItems: 'flex-end' }}
          >
            <TouchableOpacity
              style={{
                width: hp('5%'),
                justifyContent: 'flex-end',
                marginRight: wp('2.5%'),
              }}
              onPress={() => this.requestLocationPermission()}
              disabled={!this.props.isEditable}
            >
              <Image
                source={require('../../assets/images/address.png')}
                style={{ height: hp('5%'), width: hp('5%') }}
                resizeMode={'contain'}
              />
            </TouchableOpacity>
            <View
              style={[
                { flex: 1 },
                isPortrait ? { height: hp('7%') } : { height: hp('9%') },
              ]}
            >
              <FloatingTextInput
                ref={input => (this.addressInput = input)}
                label={'Address'}
                value={addressFound}
                disabled={!this.props.isEditable}
                onBlur={this.sendEditRequest.bind(this)}
                onFocus={() => {
                  this.setState({ addressSelection: null });
                }}
                onSubmitEditing={this.sendEditRequest.bind(this)}
                onChangeText={val => {
                  this._textChange('customerAddress', val);
                  this.setState({
                    errors: {
                      ...this.state.errors,
                      firstName: [],
                    },
                  });
                }}
                selection={this.state.addressSelection}
                onContentSizeChange={() =>
                  this.setState(
                    {
                      addressSelection: { start: 0, end: 0 },
                    },
                    () =>
                      this.setState({
                        addressSelection: null,
                      })
                  )
                }
                labelSizeUp={isPortrait ? hp('1.5%') : hp('2%')}
                labelSizeDown={isPortrait ? hp('2%') : hp('2.3%')}
                labelPlacingUp={isPortrait ? 0 : hp('2%')}
                labelPlacingDown={isPortrait ? hp('3%') : hp('5%')}
                inputContainerStyle={
                  isPortrait ? { height: hp('3%') } : { height: hp('7%') }
                }
                touched={true}
                inputStyle={
                  isPortrait
                    ? {
                        width: '90%',
                        fontSize: hp('2%'),
                        height: hp('5%'),
                        marginTop: hp('2%'),
                        paddingBottom: 0,
                      }
                    : {
                        width: '90%',
                        fontSize: hp('2.5%'),
                        height: hp('5%'),
                        marginTop: hp('4%'),
                        paddingBottom: 0,
                      }
                }
                underlineStyle={
                  isPortrait ? { height: hp('0.4%') } : { height: hp('0.4%') }
                }
                iconStyle={
                  isPortrait
                    ? { bottom: hp('0.1%'), zIndex: 0 }
                    : { bottom: hp('0.1%'), zIndex: 0 }
                }
                iconSize={isPortrait ? hp('2.7%') : hp('3%')}
                // errors={['Omar is shit']}
                //errors={errors.firstName || []}
              />
            </View>
          </View>
          <View
            style={{ flexDirection: 'row', flex: 1, alignItems: 'flex-end' }}
          >
            <View
              style={{
                width: hp('5%'),
                justifyContent: 'flex-end',
                marginRight: wp('2.5%'),
              }}
            >
              <View style={{ height: hp('5%'), width: hp('5%') }} />
            </View>
            <View
              style={[
                { flexDirection: 'row', flex: 1 },
                isPortrait ? { height: hp('7%') } : { height: hp('9%') },
              ]}
            >
              <View style={{ flex: 1 }}>
                <FloatingTextInput
                  ref={input => (this.pininput = input)}
                  label={'Pin Code'}
                  value={this.state.customerPinCode}
                  keyboardType={'numeric'}
                  returnKeyType={'done'}
                  onlyNumbers={true}
                  maxLength={6}
                  disabled={!this.props.isEditable}
                  onBlur={() => {
                    this.fetchStateAndCity(
                      this.state.customerPinCode,
                      this.sendEditRequest
                    );
                  }}
                  onSubmitEditing={() => {
                    this.fetchStateAndCity(
                      this.state.customerPinCode,
                      this.sendEditRequest
                    );
                  }}
                  onChangeText={val => {
                    this._textChange('customerPinCode', val);
                    this.setState({
                      errors: {
                        ...this.state.errors,
                        customerPinCode: [],
                      },
                    });
                  }}
                  labelSizeUp={isPortrait ? hp('1.5%') : hp('2%')}
                  labelSizeDown={isPortrait ? hp('2%') : hp('2.3%')}
                  labelPlacingUp={isPortrait ? 0 : hp('2%')}
                  labelPlacingDown={isPortrait ? hp('3%') : hp('5%')}
                  inputContainerStyle={
                    isPortrait ? { height: hp('3%') } : { height: hp('7%') }
                  }
                  touched={true}
                  inputStyle={
                    isPortrait
                      ? {
                          fontSize: hp('2%'),
                          height: hp('5%'),
                          marginTop: hp('2%'),
                          paddingBottom: 0,
                        }
                      : {
                          fontSize: hp('2.5%'),
                          height: hp('5%'),
                          marginTop: hp('4%'),
                          paddingBottom: 0,
                        }
                  }
                  underlineStyle={
                    isPortrait ? { height: hp('0.4%') } : { height: hp('0.4%') }
                  }
                  iconStyle={
                    isPortrait
                      ? { bottom: hp('0.1%'), zIndex: 0 }
                      : { bottom: hp('0.1%'), zIndex: 0 }
                  }
                  iconSize={isPortrait ? hp('2.7%') : hp('3%')}
                  errors={errors.customerPinCode || []}
                />
              </View>
            </View>
          </View>
          <View
            style={{ flexDirection: 'row', flex: 1, alignItems: 'flex-end' }}
          >
            <View
              style={{
                width: hp('5%'),
                justifyContent: 'flex-end',
                marginRight: wp('2.5%'),
              }}
            >
              <View style={{ height: hp('5%'), width: hp('5%') }} />
            </View>
            <View
              style={[
                { flexDirection: 'row', flex: 1 },
                isPortrait ? { height: hp('7%') } : { height: hp('9%') },
              ]}
            >
              <View style={{ width: '50%' }}>
                <FloatingTextInput
                  ref={input => (this.cityinput = input)}
                  label={'City'}
                  value={this.state.customerCity}
                  onlyLetters={true}
                  disabled={true}
                  // onFocus={()=>this.setState({firstNameSelection: null})}
                  onBlur={() => {
                    this.onContentSize();
                  }}
                  // onSubmitEditing={this.sendEditRequest.bind(this)}
                  onChangeText={val => {
                    this._textChange('customerCity', val);
                    this.setState({
                      errors: {
                        ...this.state.errors,
                        customerCity: [],
                      },
                    });
                  }}
                  selection={this.state.selectionDefault}
                  onContentSizeChange={this.onContentSize}
                  labelSizeUp={isPortrait ? hp('1.5%') : hp('2%')}
                  labelSizeDown={isPortrait ? hp('2%') : hp('2.3%')}
                  labelPlacingUp={isPortrait ? 0 : hp('2%')}
                  labelPlacingDown={isPortrait ? hp('3%') : hp('5%')}
                  inputContainerStyle={
                    isPortrait ? { height: hp('3%') } : { height: hp('7%') }
                  }
                  touched={true}
                  inputStyle={
                    isPortrait
                      ? {
                          fontSize: hp('2%'),
                          height: hp('5%'),
                          marginTop: hp('2%'),
                          paddingBottom: 0,
                        }
                      : {
                          fontSize: hp('2.5%'),
                          height: hp('5%'),
                          marginTop: hp('4%'),
                          paddingBottom: 0,
                        }
                  }
                  underlineStyle={
                    isPortrait ? { height: hp('0.4%') } : { height: hp('0.4%') }
                  }
                  iconStyle={
                    isPortrait
                      ? { bottom: hp('0.1%'), zIndex: 0 }
                      : { bottom: hp('0.1%'), zIndex: 0 }
                  }
                  iconSize={isPortrait ? hp('2.7%') : hp('3%')}
                  errors={errors.customerCity || []}
                />
              </View>
              <View style={{ width: '50%' }}>
                <FloatingTextInput
                  label={'State'}
                  lineLeft={true}
                  value={this.state.customerState}
                  onlyLetters={true}
                  disabled={true}
                  // onFocus={()=>this.setState({lastNameSelection: null})}
                  // onBlur={this.sendEditRequest.bind(this)}
                  // onSubmitEditing={this.sendEditRequest.bind(this)}
                  onChangeText={val => {
                    this._textChange('customerState', val);
                    this.setState({
                      errors: {
                        ...this.state.errors,
                        customerState: [],
                      },
                    });
                  }}
                  selection={this.state.stateSelection}
                  onContentSizeChange={() =>
                    this.setState(
                      {
                        stateSelection: { start: 0, end: 0 },
                      },
                      () =>
                        this.setState({
                          stateSelection: null,
                        })
                    )
                  }
                  labelSizeUp={isPortrait ? hp('1.5%') : hp('2%')}
                  labelSizeDown={isPortrait ? hp('2%') : hp('2.3%')}
                  labelPlacingUp={isPortrait ? 0 : hp('2%')}
                  labelPlacingDown={isPortrait ? hp('3%') : hp('5%')}
                  inputContainerStyle={
                    isPortrait ? { height: hp('3%') } : { height: hp('7%') }
                  }
                  touched={true}
                  inputStyle={
                    isPortrait
                      ? {
                          fontSize: hp('2%'),
                          height: hp('5%'),
                          marginTop: hp('2%'),
                          paddingBottom: 0,
                        }
                      : {
                          fontSize: hp('2.5%'),
                          height: hp('5%'),
                          marginTop: hp('4%'),
                          paddingBottom: 0,
                        }
                  }
                  underlineStyle={
                    isPortrait ? { height: hp('0.4%') } : { height: hp('0.4%') }
                  }
                  iconStyle={
                    isPortrait
                      ? { bottom: hp('0.1%'), zIndex: 0 }
                      : { bottom: hp('0.1%'), zIndex: 0 }
                  }
                  iconSize={isPortrait ? hp('2.7%') : hp('3%')}
                  errors={errors.customerState || []}
                />
              </View>
            </View>
          </View>
          <View
            style={{ flexDirection: 'row', flex: 1, alignItems: 'flex-end' }}
          >
            <View
              style={{
                width: hp('5%'),
                justifyContent: 'flex-end',
                marginRight: wp('2.5%'),
              }}
            >
              <View style={{ height: hp('5%'), width: hp('5%') }} />
            </View>
            <View
              style={[
                { flexDirection: 'row', flex: 1 },
                isPortrait ? { height: hp('7%') } : { height: hp('9%') },
              ]}
            >
              <View style={{ flex: 1 }}>
                <FloatingTextInput
                  ref={input => (this.countryinput = input)}
                  label={'Country'}
                  returnKeyType={'done'}
                  value={this.state.customerCountry}
                  disabled={true}
                  // onFocus={()=>this.setState({firstNameSelection: null})}
                  onBlur={
                    () => {}
                    // this.sendEditRequest.bind(this)
                  }
                  onSubmitEditing={
                    () => {}
                    // this.sendEditRequest.bind(this)
                  }
                  onChangeText={val => {
                    this._textChange('customerCountry', val);
                    this.setState({
                      errors: {
                        ...this.state.errors,
                        customerCountry: [],
                      },
                    });
                  }}
                  selection={this.state.countrySelection}
                  onContentSizeChange={() =>
                    this.setState(
                      {
                        countrySelection: { start: 0, end: 0 },
                      },
                      () =>
                        this.setState({
                          countrySelection: null,
                        })
                    )
                  }
                  labelSizeUp={isPortrait ? hp('1.5%') : hp('2%')}
                  labelSizeDown={isPortrait ? hp('2%') : hp('2.3%')}
                  labelPlacingUp={isPortrait ? 0 : hp('2%')}
                  labelPlacingDown={isPortrait ? hp('3%') : hp('5%')}
                  inputContainerStyle={
                    isPortrait ? { height: hp('3%') } : { height: hp('7%') }
                  }
                  touched={true}
                  inputStyle={
                    isPortrait
                      ? {
                          fontSize: hp('2%'),
                          height: hp('5%'),
                          marginTop: hp('2%'),
                          paddingBottom: 0,
                        }
                      : {
                          fontSize: hp('2.5%'),
                          height: hp('5%'),
                          marginTop: hp('4%'),
                          paddingBottom: 0,
                        }
                  }
                  underlineStyle={
                    isPortrait ? { height: hp('0.4%') } : { height: hp('0.4%') }
                  }
                  iconStyle={
                    isPortrait
                      ? { bottom: hp('0.1%'), zIndex: 0 }
                      : { bottom: hp('0.1%'), zIndex: 0 }
                  }
                  iconSize={isPortrait ? hp('2.7%') : hp('3%')}
                  errors={errors.customerCountry || []}
                />
              </View>
            </View>
          </View>
          <CalendarDate
            active={this.state.calendar}
            closeModal={() => this.setState({ calendar: false })}
            minDate={moment().subtract(80, 'years')}
            maxDate={this.state.typeDate == 'birth' ? moment() : null}
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
                }); /* dateBirthSelected:this.state.customerBirthday!=''?moment(this.state.customerBirthday,"DD/MM/YYYY"):moment()}, () => {
                //this._changeForm(this.state);
                this.birthdayInput._changeText(this.state.dateBirthSelected.format("DD/MM/YYYY"));
            });*/
              } else {
                this.setState({
                  calendar: false,
                }); /*dateAnniversarySelected:this.state.customerAnniversary!=''?moment(this.state.customerAnniversary,"DD/MM/YYYY"):moment()}, () => {
                //this._changeForm(this.state);
                this.anniversaryInput._changeText(this.state.dateAnniversarySelected.format("DD/MM/YYYY"));
            });*/
              }
            }}
            handleOk={() => {
              if (this.state.typeDate == 'birth') {
                this.setState(
                  {
                    calendar: false,
                    customerBirthday: this.state.dateBirthSelected,
                  },
                  () => {
                    //this._changeForm(this.state);
                    this.birthdayInput._changeText(
                      this.state.dateBirthSelected.format('DD/MM/YYYY')
                    );
                  }
                );
              } else {
                this.setState(
                  {
                    calendar: false,
                    customerAnniversary: this.state.dateAnniversarySelected,
                  },
                  () => {
                    //this._changeForm(this.state);
                    this.anniversaryInput._changeText(
                      this.state.dateAnniversarySelected.format('DD/MM/YYYY')
                    );
                  }
                );
              }
            }}
          />
        </Card>
      </View>
    );
  }
}

export default PersonalInfoForm;
