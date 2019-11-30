import React, { Component } from 'react';
import ReactNative, {
  Platform,
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Modal,
  NativeModules,
  DatePickerAndroid,
  PermissionsAndroid,
  FlatList,
  NetInfo,
  KeyboardAvoidingView,
} from 'react-native';
import { Colors, isPhone } from 'api';
import ImgToBase64 from 'react-native-image-base64';
import { connect } from 'react-redux';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { isTablet } from '../../constants/isLandscape';
import Option from '../../components/content/options/option';
import colors from '../../styles/colors';
import Orientation from 'react-native-orientation-locker';
import Header from '../../components/header/header';
import realm, { getTable, createRow } from '../../../../services/realm_service';
import {
  updateSetting,
  getLocalSettingRow,
} from '../../../../services/settings_service';
import ImagePicker from 'react-native-image-picker';
import {
  TextMontserrat,
  FloatingTextInput,
  PhoneInput,
  PopUp,
  Timer,
  ButtonClose,
} from 'components';
import CheckmarkBig from '../../../create_account/components/checkmark_big';
import Checkmark from '../../../create_account/components/checkmark';
import LinearGradient from 'react-native-linear-gradient';
import { saveValuePersonal } from '../../../login/services/user_service';
import { cashConstants } from '../../../cash_register/constants/actions';
import loading_service from '../../../../services/loading_service';

import alert_service from '../../../../services/alert_service';
import Geolocation from 'react-native-geolocation-service';
import { ButtonCamera } from '../../../cash_register/components/EditProduct/components/buttons';
import ImageResizer from 'react-native-image-resizer';
import CalendarDate from '../../../../components_general/utilities/calendarDate';
import moment from 'moment';
import { BoxShadow } from 'react-native-shadow';
import { epaisaRequest } from '../../../../services/epaisa_service';
import { get_user_country } from '../../../../services/user_service';
import {
  countries,
  countriesCodes,
  callingCodes,
} from '../../constants/countries';
//import mixpanel from '../../../../services/mixpanel';
import OtpInputs from '../../components/otp_inputs';
import ButtonGradientCustom from '../../components/buttons/ButtonGradient';
const countriesList = Object.values(countries);
class MyAccountPersonal extends Component {
  static navigationOptions = ({ navigation }) => ({
    header: <Header isBack={true} label="PERSONAL" navigation={navigation} />,
  });

  constructor(props) {
    super(props);
    //mixpanel.track('Account Personal Screen');

    this.ICONS = {
      user: require('../../assets/img/user.png'),
      email: require('../../assets/img/emailPersonal.png'),
      number: require('../../assets/img/number.png'),
      address: require('../../assets/img/address.png'),
      language: require('../../assets/img/language.png'),
      currency: require('../../assets/img/currency.png'),
      calendar: require('../../assets/img/calendar.png'),
    };
    this.state = {
      indexScroll: 1,
      UserFirstName: props.config != null ? props.config.userFirstName : '', // this.props.config.user.userFirstName,
      UserLastName: props.config != null ? props.config.userLastName : '',

      merchantCountryCode:
        props.merchant != null ? props.merchant.countryCode : '',
      CountryCode:
        props.config != null
          ? countriesCodes[
              callingCodes[
                `+${props.config.userMobileNumber.substr(
                  1,
                  props.config.userMobileNumber.length - 11
                )}`
              ]
            ]
          : '',
      SetCountryCode:
        props.config != null
          ? countriesCodes[
              callingCodes[
                `+${props.config.userMobileNumber.substr(
                  1,
                  props.config.userMobileNumber.length - 11
                )}`
              ]
            ]
          : '',
      CallingCode:
        props.config != null
          ? props.config.userMobileNumber.substr(
              1,
              props.config.userMobileNumber.length - 11
            )
          : '',
      SetCallingCode:
        props.config != null
          ? props.config.userMobileNumber.substr(
              1,
              props.config.userMobileNumber.length - 11
            )
          : '',
      Email: props.config != null ? props.config.username : '',
      SetEmail: props.config != null ? props.config.username : '',
      UserMobileNumber:
        props.config != null ? props.config.userMobileNumber : '',
      SetUserMobileNumber:
        props.config != null ? props.config.userMobileNumber : '',

      Number:
        props.config != null
          ? props.config.userMobileNumber.substr(
              props.config.userMobileNumber.length - 10
            )
          : '',
      SetNumber:
        props.config != null
          ? props.config.userMobileNumber.substr(
              props.config.userMobileNumber.length - 10
            )
          : '',
      Birthdate:
        props.config != null
          ? props.config.dateOfBirth != null
            ? props.config.dateOfBirth
            : ''
          : '',
      Address: props.config != null ? props.config.userAddress1 : '',
      Address2:
        props.config != null
          ? props.config.userAddress2
            ? props.config.userAddress2
            : ''
          : '',
      pincode: props.config != null ? props.config.pincode : '',

      City: props.config != null ? props.config.cityName : '',
      State: props.config != null ? props.config.stateName : '',
      Language: 'English',
      Currency: '(INR) Indian Rupee',
      modalPosition: null,
      coords: '',
      imagePath: '',
      imageHeight: '',
      imageWidth: '',
      openCameraModal: false,
      imageBase64: '',
      userImage:
        props.config != null
          ? props.config.userImage
            ? props.config.userImage.indexOf('png') != -1
              ? props.config.userImage.substr(
                  0,
                  props.config.userImage.indexOf('png') + 4
                )
              : props.config.userImage
            : ''
          : '',
      upload: false,
      dateSelected:
        props.config != null
          ? props.config.dateOfBirth == '' || props.config.dateOfBirth == null
            ? moment()
            : moment(props.config.dateOfBirth, 'DD-MM-YYYY')
          : moment(),
      calendar: false,
      updatedSelection: true,
      selectionDefault: Platform.OS == 'android' ? { start: 0, end: 0 } : null,
      show_otp: false,
      can_resend_otp: false,
      offset: 0,
    };
  }
  requestLocationPermission = async () => {
    let isConnected = await NetInfo.isConnected.fetch();

    if (isConnected) {
      try {
        const granted =
          Platform.OS == 'android'
            ? await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                {
                  title: 'Allow Location Permissions',
                  message:
                    'ePaisa requires your permission to get ' +
                    'your location.',
                }
              )
            : '';
        if (
          granted ===
          (Platform.OS == 'android' ? PermissionsAndroid.RESULTS.GRANTED : '')
        ) {
          console.log('You can use the location');
          loading_service.showLoading();
          navigator.geolocation.getCurrentPosition(
            position => {
              console.log('CORDS', position);
              this.setState({ coords: position.coords }, () => {
                this.getLocationAddress(position.coords);
              });
            },
            error => {
              // See error code charts below.
              console.log(error.code, error.message);
              loading_service.hideLoading();
              /*alert_service.showAlert(
                'Please make sure your location is available'
              );*/
            },
            { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
          );
        } else {
          console.log('Location permission denied');
          //alert_service.showAlert('Permission denied. Location not available');
        }
      } catch (err) {
        console.warn(err);
        //alert_service.showAlert(
        // 'A problem occurred on this proccess:' + err.message
        //);
      }
    } else {
      //alert_service.showAlert('Please, connect to Internet');
    }
  };
  userData = realm.objectForPrimaryKey('User', 0);
  getLocationAddress = value => {
    //var newAddress = '';
    let url =
      'https://maps.googleapis.com/maps/api/geocode/json?address=' +
      value.latitude +
      ',' +
      value.longitude +
      '&key=AIzaSyCnL-az4h0lpbi6J6WHTFhqXn_vujK3X3s';
    console.log(url);
    fetch(url)
      .then(response => response.json())
      .then(responseJson => {
        console.log(responseJson);
        if (responseJson.status === 'OK') {
          let newAddress = responseJson.results[0].formatted_address;
          this.setState(
            {
              Address:
                newAddress.length >= 90 ? newAddress.substr(0, 85) : newAddress,
            },
            () => {
              this.onBlur();

              loading_service.hideLoading();
            }
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
  setDateBorn = async () => {
    try {
      const { action, year, month, day } = await DatePickerAndroid.open({
        date: new Date(),
        minDate: new Date(1930, 0, 1),
        maxDate: new Date(),
      });
      if (action !== DatePickerAndroid.dismissedAction) {
        var monthTemp = month + 1;
        this.setState(
          {
            Birthdate: `${day < 10 ? '0' + day : day}-${
              monthTemp < 10 ? '0' + monthTemp : monthTemp
            }-${year}`,
          },
          this.onBlur
        );
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
  componentWillUnmount() {
    let jsonToSend = {
      ...this.props.config,
      //username: this.state.Email,
      //userMobileNumber: '+' + this.state.CallingCode + this.state.Number,
      userFirstName: this.state.UserFirstName,
      userLastName: this.state.UserLastName,
      cityName: this.state.City,
      stateName: this.state.State,
      userAddress1: this.state.Address,
      userAddress2: this.state.Address2,
      pincode: this.state.pincode,
      dateOfBirth: this.state.Birthdate,
      userImage: this.state.userImage,
      userMobileNumber:
        '+' +
        this.state.CallingCode +
        (this.state.Number != this.state.SetNumber
          ? this.state.SetNumber
          : this.state.Number),
      username: this.state.Email,
      //countryCode:this.state.CountryCode
    };
    /*if (this.state.Number != this.state.SetNumber) {
      jsonToSend = {
        ...jsonToSend,
        userMobileNumber: '+' + this.state.CallingCode + this.state.Number,
      };
    }
    if(this.state.Email!=this.state.SetEmail){
      jsonToSend={...jsonToSend,username: this.state.Email}
    }*/
    this.props.set_personalconfig({
      user: jsonToSend,
      merchant: {
        ...this.props.merchant,
        //countryCode: this.state.merchantCountryCode,
      },
    });
    this.onBlur();
  }

  componentDidMount() {
    // alert(countriesCodes[callingCodes[`+${this.state.CallingCode}`]])
    setTimeout(() => {
      this.onContentSize();
      //console.log("mobileRAPHEL", this.mobileField)
    }, 1);
    //alert(1)

    //alert(getTable('EditUser').length!=0?JSON.stringify(getTable('EditUser')[0]):'No hay')
    //get_user_country().then(x => {
    this.setState({
      countrycodeName: countries[this.state.merchantCountryCode],
    });
    //});
    this.fetchStateAndCity(this.onBlur);
  }
  _textChange = (key, value) => {
    this.setState({ [key]: value });
  };

  fetchStateAndCity = async callback => {
    let isConnected = await NetInfo.isConnected.fetch();

    if (isConnected) {
      if (this.state.pincode != '') {
        // loading_service.showLoading();
        epaisaRequest({ pincode: this.state.pincode }, '/area/index', 'POST')
          .then(res => {
            //alert(JSON.stringify(res))
            if (res.success == 1) {
              let response = res.response.Areas;
              loading_service.hideLoading();
              //if (parsedResponse.PostOffice.length > 0) {
              //const postOffice = parsedResponse.PostOffice[0];
              this.setState(
                {
                  City: response.cityName,
                  State: response.stateName,
                  merchantCountryCode:
                    countriesCodes[response.countryName || 'India'],
                  countrycodeName: response.countryName || 'India',
                  Country: response.countryName || 'India',
                },
                () => callback()
              );
            } else {
              loading_service.hideLoading();
              if (parsedResponse.Message == 'No records found') {
                alert_service.showAlert('Invalid PIN code');
                this.setState({ pincode: '' });
              } else {
                alert_service.showAlert(
                  'An error occurred during this process'
                );
              }
            }
          })
          .catch(error => {
            loading_service.hideLoading();
          });
      }
    } else {
      //alert_service.showAlert('Please, connect to Internet');
    }
  };
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
  openImagePicker() {
    const options = {
      title: 'Select your option',
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    };

    if (getLocalSettingRow('device', 'EnableCamera') == 0) {
      //this.setState({openCameraModal:!this.state.openCameraModal})
      ImagePicker.launchImageLibrary(options, response => {
        if (response.didCancel) {
        } else if (response.error) {
          //alert('Something went wrong with this option. Try again later.');
          console.log(response.error);
        } else if (response.customButton) {
          //alert('Custom button tapped : ' + response.customButton);
        } else {
          this.setState({
            imagePath: response.uri,
            imageHeight: response.height,
            imageWidth: response.width,
            userImage: response.uri,
            upload: true,
          });
        }
      });
    } else {
      ImagePicker.showImagePicker(options, response => {
        if (response.didCancel) {
        } else if (response.error) {
          //alert('Something went wrong with this option. Try again later.');
          console.log(response.error);
        } else if (response.customButton) {
          //alert('Custom button tapped : ' + response.customButton);
        } else {
          this.setState({
            imagePath: response.uri,
            imageHeight: response.height,
            imageWidth: response.width,
            userImage: response.uri,
            upload: true,
          });
        }
      });
    }
  }
  componentDidUpdate() {
    if (this.state.upload) {
      this.setState({ upload: false });
      //loading_service.showLoading()
      ImageResizer.createResizedImage(
        this.state.userImage,
        200,
        (200 * this.state.imageHeight) / this.state.imageWidth,
        'PNG',
        0,
        0
      )
        .then(response => {
          //alert(response.uri)
          if (Platform.OS === 'ios') {
            ImgToBase64.getBase64String(response.uri).then(base64String => {
              this.onBlur(base64String);
            });
          } else {
            NativeModules.RNImageToBase64.getBase64String(
              response.uri,
              (err, base64) => {
                try {
                  //alert(base64)
                  this.onBlur(base64);
                } catch {
                  console.log(err);
                }
              }
            );
          }

          //.catch(err => doSomethingWith(err));
          /**/
        })
        .catch(err => {
          console.log(err);
        });
    }
  }
  validateEmail = email => {
    var re = /\S+@\S+\.\S+/;
    return re.test(email);
  };
  onBlur = async (base64, isNumber, isEmail) => {
    //this.setState({updatedSelection:true})
    let jsonToSend = {
      //...this.props.config,
      //username: this.state.Email,
      //userMobileNumber: this.state.UserMobileNumber,
      userFirstName: this.state.UserFirstName,
      userLastName: this.state.UserLastName,
      cityName: this.state.City,
      stateName: this.state.State,
      userAddress1: this.state.Address,
      userAddress2: this.state.Address2,
      pincode: this.state.pincode,
      dateOfBirth: this.state.Birthdate,
      //merchantCountryCode: '1'//this.state.merchantCountryCode,
      //"files":this.state.imageBase64
    };
    if (base64) {
      jsonToSend.files = base64;
    }
    if (isNumber && this.state.Number != this.state.SetNumber) {
      //loading_service.showLoading();
      jsonToSend.userMobileNumber = this.state.UserMobileNumber;
    }
    if (
      isEmail &&
      this.state.Email != this.state.SetEmail &&
      this.validateEmail(this.state.Email)
    ) {
      //loading_service.showLoading();
      jsonToSend.username = this.state.Email;
    }
    let isConnected = await NetInfo.isConnected.fetch();
    if (isConnected) {
      epaisaRequest(
        { ...jsonToSend, notUpdateUnverifiedFields: true },
        '/user/profile',
        'PUT'
      ).then(res => {
        loading_service.hideLoading();
        console.log('EPA', res);
        if (res.success == 0 && (isNumber || isEmail)) {
          if ((res.errorCode = '2.2.4')) {
            alert_service.showAlert(
              `This ${
                isNumber ? 'phone number' : 'email address'
              } is already taken.`
            );
            if (isNumber) {
              this.setState({
                Number: this.state.SetNumber,
                CallingCode: this.state.SetCallingCode,
              });
            } else if (isEmail) {
              this.setState({ Email: this.state.SetEmail });
            }
          }
        } else {
          //alert(this.state.SetNumber)
          if (isNumber) {
            loading_service.hideLoading();
            let canCall =
              this.state.Number != this.state.SetNumber &&
              isNumber &&
              this.state.Number.length == 10;
            if (canCall) this.setState({ show_otp: isNumber, typeOTP: 2 });
            else {
              this.setState({
                Number: this.state.SetNumber,
                CallingCode: this.state.SetCallingCode,
              });
            }
          } else if (isEmail) {
            let canEmail =
              this.state.Email != this.state.SetEmail &&
              isEmail &&
              this.validateEmail(this.state.Email);
            if (canEmail) {
              //epaisaRequest({type:1},'/user/verify','POST').then(res=>{*/
              loading_service.hideLoading();
              /*console.log("VERIFYAQUI",res)*/
              this.setState({ show_otp: true, typeOTP: 1 });
              /*})*/
              //alert_service.showAlert("Please login again.", this.userData.signOut())
            } else {
              loading_service.hideLoading();
              this.setState({ Email: this.state.SetEmail });
            }
          }
        }
      });
    } else {
      try {
        // alert("edited")
        createRow(
          'EditUser',
          {
            id: 0,
            username: this.state.Email,
            userMobileNumber: '+' + this.state.CallingCode + this.state.Number,
            userFirstName: this.state.UserFirstName,
            userLastName: this.state.UserLastName,
            cityName: this.state.City || '',
            stateName: this.state.State || '',
            userAddress1: this.state.Address,
            userAddress2: this.state.Address2,
            pincode: this.state.pincode,
            dateOfBirth: this.state.Birthdate,
            merchantCountryCode: this.state.merchantCountryCode,
          },
          true
        );
      } catch (error) {
        //alert(error);
      }
    }
    this.onContentSize();
    //saveValuePersonal(this.props.userPermi.auth_key, jsonToSend);
  };
  _changePhone = value => {
    //alert(value.callingCode)
    this.setState({
      Number: value.phone,
      UserMobileNumber: '+' + value.callingCode + value.phone,
      CallingCode: value.callingCode,
    });
  };
  scrollToItem = ref => {
    ref.measureLayout(
      ReactNative.findNodeHandle(this.scrollRef),
      (x, y, width, height) => {
        console.log('HEIGHT', height);
        setTimeout(
          () =>
            this.scrollRef.scrollTo({
              x: 0,
              y: y - height,
              animated: true,
            }),
          200
        );
      }
    );
  };
  componentWillMount() {
    !isTablet ? Orientation.lockToPortrait() : Orientation.lockToLandscape();
  }
  render() {
    const bgImage = !isTablet
      ? require('../../../../assets/images/bg/loadingBackground.png')
      : require('../../../../assets/images/bg/loadingBackgroundLandscape.png');
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

    //alert(val)
    return (
      <View style={styles.container}>
        <Image
          style={{
            position: 'absolute',
            width: '100%',
            flex: 1,
            top: 0,
            left: 0,
            bottom: 0,
            right: 0,
          }}
          resizeMode="stretch"
          source={bgImage}
        />
        <KeyboardAvoidingView
          behavior="position"
          style={{ width: '100%', flex: 1 }}
          contentContainerStyle={{ flex: 1 }}
          keyboardVerticalOffset={this.state.offset}
        >
          <View
            style={{
              width: '100%',
              height: hp(isTablet ? '23%' : '25%'),
              backgroundColor: 'white',
              elevation: 7,
              alignItems: 'center',
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: 0.2,
              shadowRadius: 2,
              justifyContent: 'center',
            }}
          >
            <TouchableOpacity onPress={this.openImagePicker.bind(this)}>
              <ButtonCamera
                userImage={this.state.userImage}
                resizeMode="cover"
                borderRadius={hp('8%')}
                containerStyle={{
                  width: hp('15%'),
                  height: hp('15%'),
                  borderRadius: hp('8%'),
                  backgroundColor: 'rgba(0,0,0,0.2)',
                }}
                imageSize={'5'}
                onPress={this.openImagePicker.bind(this)}
                imageSource={
                  this.state.imagePath === '' ? null : this.state.imagePath
                }
                imageAtributes={{
                  height: this.state.imageHeight,
                  width: this.state.imageWidth,
                }}
              />
              <Image
                resizeMode="cover"
                source={require('../../assets/img/pencil.png')}
                style={{
                  width: hp('6%'),
                  position: 'absolute',
                  bottom: -hp('1%'),
                  height: hp('6%'),
                }}
              />
            </TouchableOpacity>
            <TextMontserrat
              style={{
                fontSize: hp('2.2%'),
                fontWeight: '700',
                textAlign: 'center',
                marginTop: hp('1%'),
              }}
            >
              {this.state.UserFirstName + ' ' + this.state.UserLastName}
            </TextMontserrat>
          </View>

          <ScrollView
            keyboardDismissMode="on-drag"
            ref={x => (this.scrollRef = x)}
            keyboardShouldPersistTaps="always"
            style={{
              flex: 1,
              marginTop: isTablet ? -hp('0.1%') : 0,
              width: '100%',
              //paddingHorizontal: wp(isTablet ? '3%' : '5%'),
            }}
          >
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'flex-end',
                marginTop: hp('1%'),
                paddingHorizontal: wp(isTablet ? '3%' : '5%'),
              }}
            >
              <Image
                source={this.ICONS.user}
                style={{
                  width: hp('5%'),
                  height: hp('5%'),
                  marginRight: wp(isTablet ? '1%' : '3%'),
                }}
              />
              <View
                style={[
                  {},
                  styles.nameInputs,
                  {
                    flex: 1,
                  },
                  !isTablet ? { height: hp('7%') } : { height: hp('9%') },
                ]}
              >
                <View style={{ width: '50%' }}>
                  <FloatingTextInput
                    inputRef={input => (this.firstnameinput = input)}
                    label={'First Name'}
                    value={this.state.UserFirstName}
                    onBlur={() => {
                      this.onContentSize();
                      this.onBlur();
                    }}
                    onlyLetters={true}
                    /*onSubmitEditing={this._checkNames.bind(this)}
              onBlur={this._checkNames.bind(this)}*/
                    onChangeText={val => {
                      this._textChange('UserFirstName', val);
                      /*this.setState({errors: {
                  ...this.state.errors,
                  firstName: [],},
                })*/
                    }}
                    onFocus={() => {
                      this.setState({
                        offset: isTablet ? -hp('20%') : -hp('5%'),
                      });
                      //if (isTablet) {
                      this.scrollRef.scrollTo({
                        x: 0,
                        y: 0,
                        animated: true,
                      });
                      //}
                    }}
                    labelSizeUp={!isTablet ? hp('1.5%') : hp('2%')}
                    labelSizeDown={!isTablet ? hp('2%') : hp('2.3%')}
                    labelPlacingUp={!isTablet ? 0 : hp('2%')}
                    labelPlacingDown={!isTablet ? hp('3%') : hp('5%')}
                    inputContainerStyle={
                      !isTablet ? { height: hp('3%') } : { height: hp('7%') }
                    }
                    touched={true}
                    inputStyle={
                      !isTablet
                        ? {
                            width: '80%',
                            fontSize: hp('2%'),
                            height: hp('5%'),
                            marginTop: hp('2%'),
                            paddingBottom: 0,
                          }
                        : {
                            width: '80%',
                            fontSize: hp('2.5%'),
                            height: hp('5%'),
                            marginTop: hp('4%'),
                            paddingBottom: 0,
                          }
                    }
                    underlineStyle={
                      !isTablet
                        ? { height: hp('0.4%') }
                        : { height: hp('0.4%') }
                    }
                    iconStyle={
                      !isTablet
                        ? { bottom: hp('0.1%'), zIndex: 0 }
                        : { bottom: hp('0.1%'), zIndex: 0 }
                    }
                    iconSize={!isTablet ? hp('2.7%') : hp('3%')}
                    selection={this.state.selectionDefault}
                    onContentSizeChange={this.onContentSize}
                    // errors={['Omar is shit']}
                    //errors={errors.firstName || []}
                  />
                </View>
                <View style={{ width: '50%' }}>
                  <FloatingTextInput
                    inputRef={input => (this.lastnameinput = input)}
                    label={'Last Name'}
                    lineLeft={true}
                    value={this.state.UserLastName}
                    onlyLetters={true}
                    onBlur={() => {
                      this.onContentSize();
                      this.onBlur();
                    }}
                    onFocus={() => {
                      this.setState({
                        offset: isTablet ? -hp('20%') : -hp('5%'),
                      });

                      this.scrollRef.scrollTo({
                        x: 0,
                        y: 0,
                        animated: true,
                      });
                    }}
                    selection={this.state.selectionDefault}
                    onContentSizeChange={this.onContentSize}
                    onChangeText={val => {
                      this._textChange('UserLastName', val);
                      /*this.setState({errors: {
                  ...this.state.errors,
                  firstName: [],},
                })*/
                    }}
                    /*onSubmitEditing={this._checkLastNames.bind(this)}
              onBlur={this._checkLastNames.bind(this)}
              onChangeText={val => {
                this._textChange('UserLastName', val); 
                this.setState({errors: {
                  ...this.state.errors,
                  lastName: [],},
                })}
              }*/
                    labelSizeUp={!isTablet ? hp('1.5%') : hp('2%')}
                    labelSizeDown={!isTablet ? hp('2%') : hp('2.3%')}
                    labelPlacingUp={!isTablet ? 0 : hp('2%')}
                    labelPlacingDown={!isTablet ? hp('3%') : hp('5%')}
                    inputContainerStyle={
                      !isTablet ? { height: hp('3%') } : { height: hp('7%') }
                    }
                    touched={true}
                    inputStyle={
                      !isTablet
                        ? {
                            width: '80%',
                            fontSize: hp('2%'),
                            height: hp('5%'),
                            marginTop: hp('2%'),
                            paddingBottom: 0,
                          }
                        : {
                            width: '80%',
                            fontSize: hp('2.5%'),
                            height: hp('5%'),
                            marginTop: hp('4%'),
                            paddingBottom: 0,
                          }
                    }
                    underlineStyle={
                      !isTablet
                        ? { height: hp('0.4%') }
                        : { height: hp('0.4%') }
                    }
                    iconStyle={
                      !isTablet
                        ? { bottom: hp('0.1%'), zIndex: 0 }
                        : { bottom: hp('0.1%'), zIndex: 0 }
                    }
                    iconSize={!isTablet ? hp('2.7%') : hp('3%')}
                    // errors={['Omar is shit']}
                    //errors={errors.firstName || []}
                  />
                </View>
              </View>
            </View>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'flex-end',
                marginTop: hp('1%'),
                paddingHorizontal: wp(isTablet ? '3%' : '5%'),
              }}
            >
              <Image
                source={this.ICONS.email}
                style={{
                  width: hp('5%'),
                  height: hp('5%'),
                  marginRight: wp(isTablet ? '1%' : '3%'),
                }}
              />
              <View
                style={[
                  {},
                  styles.nameInputs,
                  {
                    flex: 1,
                  },
                  !isTablet ? { height: hp('7%') } : { height: hp('9%') },
                ]}
              >
                <FloatingTextInput
                  inputRef={input => (this.emailinput = input)}
                  label={'E-mail'}
                  onBlur={() => {
                    this.onContentSize();
                    this.onBlur(null, null, true);
                  }}
                  value={this.state.Email}
                  onChangeText={val => {
                    this._textChange('Email', val);
                    /*this.setState({errors: {
                    ...this.state.errors,
                    firstName: [],},
                  })*/
                  }}
                  onFocus={() => {
                    this.setState({
                      offset: isTablet ? -hp('7%') : -hp('7%'),
                    });
                    this.scrollRef.scrollTo({
                      x: 0,
                      y: 0,
                      animated: true,
                    });
                  }}
                  /*onChangeText={val => this._textChange('Username', val)}
                onSubmitEditing={this._checkEmail.bind(this)}
                onBlur={this._checkEmail.bind(this)}
          errors={errors.Username || []}*/
                  autoCapitalize={'none'}
                  touched={true}
                  labelSizeUp={!isTablet ? hp('1.5%') : hp('2%')}
                  labelSizeDown={!isTablet ? hp('2%') : hp('2.3%')}
                  labelPlacingUp={!isTablet ? 0 : hp('2%')}
                  labelPlacingDown={!isTablet ? hp('3%') : hp('5%')}
                  inputContainerStyle={
                    !isTablet ? { height: hp('3%') } : { height: hp('7%') }
                  }
                  selection={this.state.selectionDefault}
                  onContentSizeChange={this.onContentSize}
                  touched={true}
                  inputStyle={
                    !isTablet
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
                    !isTablet ? { height: hp('0.4%') } : { height: hp('0.4%') }
                  }
                  iconStyle={
                    !isTablet
                      ? { bottom: hp('0.1%'), zIndex: 0 }
                      : { bottom: hp('0.1%'), zIndex: 0 }
                  }
                  iconSize={!isTablet ? hp('2.7%') : hp('3%')}
                />
              </View>
            </View>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'flex-end',
                marginTop: hp('1%'),
                paddingHorizontal: wp(isTablet ? '3%' : '5%'),
              }}
            >
              <Image
                source={this.ICONS.number}
                style={{
                  width: hp('5%'),
                  height: hp('5%'),
                  marginRight: wp(isTablet ? '1%' : '3%'),
                }}
              />
              <View
                style={[
                  {},
                  styles.nameInputs,
                  {
                    flex: 1,
                  },
                  !isTablet ? { height: hp('8%') } : { height: hp('9%') },
                ]}
              >
                <PhoneInput
                  personal={true}
                  label={'Mobile Number'}
                  onBlur={() => this.onBlur(null, true)}
                  value={this.state.Number}
                  CountryName={countries[this.state.CountryCode]}
                  CallingCode={
                    this.state.UserMobileNumber
                      ? this.state.UserMobileNumber.substr(
                          1,
                          this.state.UserMobileNumber.length - 11
                        )
                      : ''
                  }
                  onSubmitEditing={() => this.onBlur(null, true)}
                  CountryCode={
                    this.state.UserMobileNumber
                      ? countriesCodes[
                          callingCodes[
                            `+${this.state.UserMobileNumber.substr(
                              1,
                              this.state.UserMobileNumber.length - 11
                            )}`
                          ]
                        ]
                      : ''
                  }
                  fontSizeCode={wp('3%')}
                  onChange={this._changePhone}
                  onFocus={() => {
                    this.setState({
                      offset: isTablet ? -hp('10%') : 0,
                    });
                    //if (isTablet) {
                    this.scrollRef.scrollTo({
                      x: 0,
                      y: hp('3%'),
                      animated: true,
                    });
                    //}
                  }}
                  //disabled={true}
                  /*onTextClear={this._onTextClear.bind(this, 'mobile')}
            onChange={this._changePhone}
            onSubmitEditing={() => this._checkMobile()}
            onBlur={() => this._checkMobile()}
            errors={errors.mobile || []}*/
                  restyleComp={true}
                  labelSizeUp={!isTablet ? hp('1.5%') : hp('2%')}
                  labelSizeDown={!isTablet ? hp('2%') : hp('2.3%')}
                  labelPlacingUp={!isTablet ? 0 : hp('1%')}
                  labelPlacingDown={!isTablet ? hp('3%') : hp('5%')}
                  inputContainerStyle={
                    !isTablet ? { height: hp('3%') } : { height: hp('7%') }
                  }
                  touched={true}
                  inputStyle={
                    !isTablet
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
                    !isTablet ? { height: hp('0.4%') } : { height: hp('0.4%') }
                  }
                  iconStyle={
                    !isTablet
                      ? { bottom: hp('0.1%'), zIndex: 0 }
                      : { bottom: hp('0.1%'), zIndex: 0 }
                  }
                  iconSize={!isTablet ? hp('2.7%') : hp('3%')}
                />
              </View>
            </View>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'flex-end',
                marginTop: hp('1%'),
                paddingHorizontal: wp(isTablet ? '3%' : '5%'),
              }}
            >
              <TouchableOpacity
                onPress={() => this.setState({ calendar: true })}
              >
                <Image
                  source={this.ICONS.calendar}
                  style={{
                    width: hp('5%'),
                    height: hp('5%'),
                    marginRight: wp(isTablet ? '1%' : '3%'),
                  }}
                />
              </TouchableOpacity>
              <View
                style={[
                  {},
                  styles.nameInputs,
                  {
                    flex: 1,
                  },
                  !isTablet ? { height: hp('7%') } : { height: hp('9%') },
                ]}
              >
                <FloatingTextInput
                  ref={ref => (this.birthInput = ref)}
                  disabled={true}
                  onBlur={this.onBlur}
                  label={'Birthdate'}
                  value={this.state.Birthdate}
                  /*onChangeText={val => this._textChange('Username', val)}
                onSubmitEditing={this._checkEmail.bind(this)}
                onBlur={this._checkEmail.bind(this)}
                errors={errors.Username || []}*/
                  autoCapitalize={'none'}
                  touched={true}
                  labelSizeUp={!isTablet ? hp('1.5%') : hp('2%')}
                  labelSizeDown={!isTablet ? hp('2%') : hp('2.3%')}
                  labelPlacingUp={!isTablet ? 0 : hp('2%')}
                  labelPlacingDown={!isTablet ? hp('3%') : hp('5%')}
                  inputContainerStyle={
                    !isTablet ? { height: hp('3%') } : { height: hp('7%') }
                  }
                  touched={true}
                  inputStyle={
                    !isTablet
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
                    !isTablet ? { height: hp('0.4%') } : { height: hp('0.4%') }
                  }
                  iconStyle={
                    !isTablet
                      ? { bottom: hp('0.1%'), zIndex: 0 }
                      : { bottom: hp('0.1%'), zIndex: 0 }
                  }
                  iconSize={!isTablet ? hp('2.7%') : hp('3%')}
                />
              </View>
            </View>
            <View
              ref={x => (this.address1Container = x)}
              style={{
                flexDirection: 'row',
                alignItems: 'flex-end',
                marginTop: hp('1%'),
                paddingHorizontal: wp(isTablet ? '3%' : '5%'),
              }}
            >
              <TouchableOpacity onPress={this.requestLocationPermission}>
                <Image
                  source={this.ICONS.address}
                  style={{
                    width: hp('5%'),
                    height: hp('5%'),
                    marginRight: wp(isTablet ? '1%' : '3%'),
                  }}
                />
              </TouchableOpacity>
              <View
                style={[
                  {},
                  styles.nameInputs,
                  {
                    flex: 1,
                  },
                  !isTablet ? { height: hp('7%') } : { height: hp('9%') },
                ]}
              >
                <FloatingTextInput
                  label={'Address 1'}
                  inputRef={input => (this.address1input = input)}
                  onBlur={() => {
                    this.onContentSize();
                    this.onBlur();
                  }}
                  value={this.state.Address}
                  onChangeText={val => {
                    this._textChange('Address', val);
                  }}
                  onFocus={() => {
                    this.setState({
                      offset: isTablet ? hp('10%') : hp('10%'),
                    });
                    //if (isTablet) {
                    this.scrollRef.scrollTo({
                      x: 0,
                      y: hp('3%'),
                      animated: true,
                    });
                    //}
                  }}
                  /*onChangeText={val => this._textChange('Username', val)}
                onSubmitEditing={this._checkEmail.bind(this)}
                onBlur={this._checkEmail.bind(this)}
                errors={errors.Username || []}*/
                  autoCapitalize={'none'}
                  touched={true}
                  labelSizeUp={!isTablet ? hp('1.5%') : hp('2%')}
                  labelSizeDown={!isTablet ? hp('2%') : hp('2.3%')}
                  labelPlacingUp={!isTablet ? 0 : hp('2%')}
                  labelPlacingDown={!isTablet ? hp('3%') : hp('5%')}
                  inputContainerStyle={
                    !isTablet ? { height: hp('3%') } : { height: hp('7%') }
                  }
                  touched={true}
                  inputStyle={
                    !isTablet
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
                    !isTablet ? { height: hp('0.4%') } : { height: hp('0.4%') }
                  }
                  iconStyle={
                    !isTablet
                      ? { bottom: hp('0.1%'), zIndex: 0 }
                      : { bottom: hp('0.1%'), zIndex: 0 }
                  }
                  iconSize={!isTablet ? hp('2.7%') : hp('3%')}
                  selection={this.state.selectionDefault}
                  onContentSizeChange={this.onContentSize}
                />
              </View>
            </View>
            <View
              ref={x => (this.address2Container = x)}
              style={{
                flexDirection: 'row',
                alignItems: 'flex-end',
                marginTop: hp('0.5%'),
                paddingHorizontal: wp(isTablet ? '3%' : '5%'),
              }}
            >
              <View
                style={[
                  {},
                  styles.nameInputs,
                  {
                    flex: 1,
                    marginLeft: hp('5%') + wp(isTablet ? '1%' : '3%'),
                  },
                  !isTablet ? { height: hp('7%') } : { height: hp('9%') },
                ]}
              >
                <FloatingTextInput
                  inputRef={input => (this.address2input = input)}
                  label={'Address 2'}
                  onBlur={() => {
                    this.onBlur();
                  }}
                  value={this.state.Address2}
                  onChangeText={val => {
                    this._textChange('Address2', val);
                    /*this.setState({errors: {
                    ...this.state.errors,
                    firstName: [],},
                  })*/
                  }}
                  /*onChangeText={val => this._textChange('Username', val)}
                onSubmitEditing={this._checkEmail.bind(this)}
                onBlur={this._checkEmail.bind(this)}
                errors={errors.Username || []}*/
                  onFocus={() => {
                    this.setState({
                      offset: isTablet ? hp('10%') : hp('10%'),
                    });
                    if (isTablet) {
                      this.scrollRef.scrollTo({
                        x: 0,
                        y: hp('10%'),
                        animated: true,
                      });
                    }
                  }}
                  autoCapitalize={'none'}
                  touched={true}
                  labelSizeUp={!isTablet ? hp('1.5%') : hp('2%')}
                  labelSizeDown={!isTablet ? hp('2%') : hp('2.3%')}
                  labelPlacingUp={!isTablet ? 0 : hp('2%')}
                  labelPlacingDown={!isTablet ? hp('3%') : hp('5%')}
                  inputContainerStyle={
                    !isTablet ? { height: hp('3%') } : { height: hp('7%') }
                  }
                  touched={true}
                  inputStyle={
                    !isTablet
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
                    !isTablet ? { height: hp('0.4%') } : { height: hp('0.4%') }
                  }
                  iconStyle={
                    !isTablet
                      ? { bottom: hp('0.1%'), zIndex: 0 }
                      : { bottom: hp('0.1%'), zIndex: 0 }
                  }
                  iconSize={!isTablet ? hp('2.7%') : hp('3%')}
                  selection={this.state.selectionDefault}
                  onContentSizeChange={this.onContentSize}
                />
              </View>
            </View>
            <View
              ref={x => (this.pincodeContainer = x)}
              style={{
                flexDirection: 'row',
                alignItems: 'flex-end',
                marginTop: hp('0.5%'),
                paddingHorizontal: wp(isTablet ? '3%' : '5%'),
              }}
            >
              <View
                style={[
                  {},
                  styles.nameInputs,
                  {
                    flex: 1,
                    marginLeft: hp('5%') + wp(isTablet ? '1%' : '3%'),
                  },
                  !isTablet ? { height: hp('7%') } : { height: hp('9%') },
                ]}
              >
                <FloatingTextInput
                  inputRef={input => (this.pincode = input)}
                  label={'Pin Code'}
                  onBlur={() => {
                    this.fetchStateAndCity(this.onBlur);
                  }}
                  value={this.state.pincode}
                  onChangeText={val => {
                    this._textChange('pincode', val);
                  }}
                  // onSubmitEditing={()=>alert('submit')}
                  maxLength={6}
                  keyboardType={'numeric'}
                  onlyNumbers={true}
                  returnKeyType={'done'}
                  onFocus={() => {
                    this.setState({
                      offset: isTablet ? hp('10%') : hp('10%'),
                    });
                    if (isTablet) {
                      this.scrollRef.scrollTo({
                        x: 0,
                        y: hp('15%'),
                        animated: true,
                      });
                    }
                  }}
                  /*onChangeText={val => this._textChange('Username', val)}
                onSubmitEditing={this._checkEmail.bind(this)}
                onBlur={this._checkEmail.bind(this)}
                errors={errors.Username || []}*/
                  autoCapitalize={'none'}
                  touched={true}
                  labelSizeUp={!isTablet ? hp('1.5%') : hp('2%')}
                  labelSizeDown={!isTablet ? hp('2%') : hp('2.3%')}
                  labelPlacingUp={!isTablet ? 0 : hp('2%')}
                  labelPlacingDown={!isTablet ? hp('3%') : hp('5%')}
                  inputContainerStyle={
                    !isTablet ? { height: hp('3%') } : { height: hp('7%') }
                  }
                  touched={true}
                  inputStyle={
                    !isTablet
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
                    !isTablet ? { height: hp('0.4%') } : { height: hp('0.4%') }
                  }
                  iconStyle={
                    !isTablet
                      ? { bottom: hp('0.1%'), zIndex: 0 }
                      : { bottom: hp('0.1%'), zIndex: 0 }
                  }
                  iconSize={!isTablet ? hp('2.7%') : hp('3%')}
                />
              </View>
            </View>

            <View
              style={{
                flexDirection: 'row',
                alignItems: 'flex-end',
                marginTop: hp('0.5%'),
                paddingHorizontal: wp(isTablet ? '3%' : '5%'),
              }}
            >
              <View
                style={[
                  {},
                  styles.nameInputs,
                  {
                    flex: 1,
                    marginLeft: hp('5%') + wp(isTablet ? '1%' : '3%'),
                  },
                  !isTablet ? { height: hp('7%') } : { height: hp('9%') },
                ]}
              >
                <View style={{ width: '50%' }}>
                  <FloatingTextInput
                    disabled={true}
                    ref={input => (this.cityinput = input)}
                    label={'City'}
                    selection={this.state.selectionDefault}
                    onContentSizeChange={this.onContentSize}
                    value={this.state.City}
                    onBlur={() => {
                      this.onBlur();
                    }}
                    onlyLetters={true}
                    /*onSubmitEditing={this._checkNames.bind(this)}
              onBlur={this._checkNames.bind(this)}*/
                    onChangeText={val => {
                      this._textChange('City', val);

                      /*this.setState({errors: {
                  ...this.state.errors,
                  firstName: [],},
                })*/
                    }}
                    labelSizeUp={!isTablet ? hp('1.5%') : hp('2%')}
                    labelSizeDown={!isTablet ? hp('2%') : hp('2.3%')}
                    labelPlacingUp={!isTablet ? 0 : hp('2%')}
                    labelPlacingDown={!isTablet ? hp('3%') : hp('5%')}
                    inputContainerStyle={
                      !isTablet ? { height: hp('3%') } : { height: hp('7%') }
                    }
                    touched={true}
                    inputStyle={
                      !isTablet
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
                      !isTablet
                        ? { height: hp('0.4%') }
                        : { height: hp('0.4%') }
                    }
                    iconStyle={
                      !isTablet
                        ? { bottom: hp('0.1%'), zIndex: 0 }
                        : { bottom: hp('0.1%'), zIndex: 0 }
                    }
                    iconSize={!isTablet ? hp('2.7%') : hp('3%')}
                    // errors={['Omar is shit']}
                    //errors={errors.firstName || []}
                  />
                </View>
                <View style={{ width: '50%' }}>
                  <FloatingTextInput
                    disabled={true}
                    selection={this.state.selectionDefault}
                    onContentSizeChange={this.onContentSize}
                    inputRef={input => (this.stateinput = input)}
                    label={'State'}
                    lineLeft={true}
                    value={this.state.State}
                    onlyLetters={true}
                    onBlur={() => {
                      this.onBlur();
                    }}
                    onChangeText={val => {
                      this._textChange('State', val);
                      /*this.setState({errors: {
                  ...this.state.errors,
                  firstName: [],},
                })*/
                    }}
                    /*onSubmitEditing={this._checkLastNames.bind(this)}
              onBlur={this._checkLastNames.bind(this)}
              onChangeText={val => {
                this._textChange('UserLastName', val); 
                this.setState({errors: {
                  ...this.state.errors,
                  lastName: [],},
                })}
              }*/
                    labelSizeUp={!isTablet ? hp('1.5%') : hp('2%')}
                    labelSizeDown={!isTablet ? hp('2%') : hp('2.3%')}
                    labelPlacingUp={!isTablet ? 0 : hp('2%')}
                    labelPlacingDown={!isTablet ? hp('3%') : hp('5%')}
                    inputContainerStyle={
                      !isTablet ? { height: hp('3%') } : { height: hp('7%') }
                    }
                    touched={true}
                    inputStyle={
                      !isTablet
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
                      !isTablet
                        ? { height: hp('0.4%') }
                        : { height: hp('0.4%') }
                    }
                    iconStyle={
                      !isTablet
                        ? { bottom: hp('0.1%'), zIndex: 0 }
                        : { bottom: hp('0.1%'), zIndex: 0 }
                    }
                    iconSize={!isTablet ? hp('2.7%') : hp('3%')}
                    // errors={['Omar is shit']}
                    //errors={errors.firstName || []}
                  />
                </View>
              </View>
            </View>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'flex-end',
                marginTop: hp('0.5%'),
                paddingHorizontal: wp(isTablet ? '3%' : '5%'),
              }}
            >
              <TouchableOpacity
                disabled={true}
                ref={ref => (this.countryBtn = ref)}
                style={[
                  {},
                  styles.nameInputs,
                  {
                    flex: 1,
                    marginLeft: hp('5%') + wp(isTablet ? '1%' : '3%'),
                  },
                  !isTablet ? { height: hp('7%') } : { height: hp('9%') },
                ]}
                onPress={() => {
                  this.countryBtn.measureInWindow((x, y, width) => {
                    this.setState({
                      modalPosition: {
                        x: x,
                        y: y,
                        width: width,
                        cate: 'Country',
                      },
                    });
                  });
                }}
              >
                <FloatingTextInput
                  disabled={true}
                  inputRef={input => (this.countrycode = input)}
                  label={'Country'}
                  onBlur={() => {
                    this.onBlur();
                  }}
                  value={this.state.countrycodeName}
                  onChangeText={val => {
                    this._textChange('countrycodeName', val);
                    /*this.setState({errors: {
                    ...this.state.errors,
                    firstName: [],},
                  })*/
                  }}
                  /*onChangeText={val => this._textChange('Username', val)}
                onSubmitEditing={this._checkEmail.bind(this)}
                onBlur={this._checkEmail.bind(this)}
                errors={errors.Username || []}*/
                  autoCapitalize={'none'}
                  touched={true}
                  labelSizeUp={!isTablet ? hp('1.5%') : hp('2%')}
                  labelSizeDown={!isTablet ? hp('2%') : hp('2.3%')}
                  labelPlacingUp={!isTablet ? 0 : hp('2%')}
                  labelPlacingDown={!isTablet ? hp('3%') : hp('5%')}
                  inputContainerStyle={
                    !isTablet ? { height: hp('3%') } : { height: hp('7%') }
                  }
                  touched={true}
                  inputStyle={
                    !isTablet
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
                    !isTablet ? { height: hp('0.4%') } : { height: hp('0.4%') }
                  }
                  iconStyle={
                    !isTablet
                      ? { bottom: hp('0.1%'), zIndex: 0 }
                      : { bottom: hp('0.1%'), zIndex: 0 }
                  }
                  iconSize={!isTablet ? hp('2.7%') : hp('3%')}
                />
              </TouchableOpacity>
            </View>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'flex-end',
                marginTop: hp('1%'),
                paddingHorizontal: wp(isTablet ? '3%' : '5%'),
              }}
            >
              <Image
                source={this.ICONS.language}
                style={{
                  width: hp('5%'),
                  height: hp('5%'),
                  marginRight: wp(isTablet ? '1%' : '3%'),
                }}
              />
              <TouchableOpacity
                ref={ref => (this.languageBtn = ref)}
                style={[
                  {},
                  styles.nameInputs,
                  {
                    flex: 1,
                  },
                  !isTablet ? { height: hp('7%') } : { height: hp('9%') },
                ]}
                onPress={() => {
                  this.languageBtn.measureInWindow((x, y, width) => {
                    this.setState({
                      modalPosition: {
                        x: x,
                        y: y,
                        width: width,
                        cate: 'Language',
                      },
                    });
                  });
                }}
              >
                <FloatingTextInput
                  disabled={true}
                  nocancel={true}
                  label={'Language'}
                  value={this.state.Language}
                  /*onChangeText={val => this._textChange('Username', val)}
                onSubmitEditing={this._checkEmail.bind(this)}
                onBlur={this._checkEmail.bind(this)}
                errors={errors.Username || []}*/
                  autoCapitalize={'none'}
                  touched={true}
                  onBlur={this.onBlur}
                  labelSizeUp={!isTablet ? hp('1.5%') : hp('2%')}
                  labelSizeDown={!isTablet ? hp('2%') : hp('2.3%')}
                  labelPlacingUp={!isTablet ? 0 : hp('2%')}
                  labelPlacingDown={!isTablet ? hp('3%') : hp('5%')}
                  inputContainerStyle={
                    !isTablet ? { height: hp('3%') } : { height: hp('7%') }
                  }
                  touched={true}
                  inputStyle={
                    !isTablet
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
                    !isTablet ? { height: hp('0.4%') } : { height: hp('0.4%') }
                  }
                  iconStyle={
                    !isTablet
                      ? { bottom: hp('0.1%'), zIndex: 0 }
                      : { bottom: hp('0.1%'), zIndex: 0 }
                  }
                  iconSize={!isTablet ? hp('2.7%') : hp('3%')}
                />
              </TouchableOpacity>
            </View>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'flex-end',
                marginTop: hp('1%'),
                marginBottom: hp('2%'),
                paddingHorizontal: wp(isTablet ? '3%' : '5%'),
              }}
            >
              <Image
                source={this.ICONS.currency}
                style={{
                  width: hp('5%'),
                  height: hp('5%'),
                  marginRight: wp(isTablet ? '1%' : '3%'),
                }}
              />
              <View
                style={[
                  {},
                  styles.nameInputs,
                  {
                    flex: 1,
                  },
                  !isTablet ? { height: hp('7%') } : { height: hp('9%') },
                ]}
              >
                <FloatingTextInput
                  disabled={true}
                  nocancel={true}
                  label={'Currency'}
                  value={this.state.Currency}
                  /*onChangeText={val => this._textChange('Username', val)}
                onSubmitEditing={this._checkEmail.bind(this)}
                onBlur={this._checkEmail.bind(this)}
                errors={errors.Username || []}*/
                  autoCapitalize={'none'}
                  touched={true}
                  onBlur={this.onBlur}
                  labelSizeUp={!isTablet ? hp('1.5%') : hp('2%')}
                  labelSizeDown={!isTablet ? hp('2%') : hp('2.3%')}
                  labelPlacingUp={!isTablet ? 0 : hp('2%')}
                  labelPlacingDown={!isTablet ? hp('3%') : hp('5%')}
                  inputContainerStyle={
                    !isTablet ? { height: hp('3%') } : { height: hp('7%') }
                  }
                  touched={true}
                  inputStyle={
                    !isTablet
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
                    !isTablet ? { height: hp('0.4%') } : { height: hp('0.4%') }
                  }
                  iconStyle={
                    !isTablet
                      ? { bottom: hp('0.1%'), zIndex: 0 }
                      : { bottom: hp('0.1%'), zIndex: 0 }
                  }
                  iconSize={!isTablet ? hp('2.7%') : hp('3%')}
                />
              </View>
            </View>
          </ScrollView>
          <CalendarDate
            active={this.state.calendar}
            currentDate={this.state.dateSelected.format('YYYY-MM-DD')}
            closeModal={() => this.setState({ calendar: false })}
            minDate={moment().subtract(80, 'years')}
            maxDate={moment().subtract(18, 'years')}
            dateSelected={this.state.dateSelected}
            onDayPress={date => this.setState({ dateSelected: date })}
            handleCancel={() => {
              this.setState(
                {
                  calendar: false,
                  Birthdate:
                    this.state.Birthdate != ''
                      ? this.state.Birthdate
                      : moment().format('DD-MM-YYYY'),
                  dateSelected:
                    this.state.Birthdate != ''
                      ? moment(this.state.Birthdate, 'DD-MM-YYYY')
                      : moment(),
                },
                () => {
                  /// this._changeForm(this.state);
                  this.onBlur();
                  this.birthInput._changeText(
                    this.state.dateSelected.format('DD-MM-YYYY')
                  );
                }
              );
            }}
            handleOk={() => {
              this.setState(
                {
                  calendar: false,
                  Birthdate: this.state.dateSelected.format('DD-MM-YYYY'),
                },
                () => {
                  //this._changeForm(this.state);
                  this.onBlur();
                  this.birthInput._changeText(
                    this.state.dateSelected.format('DD-MM-YYYY')
                  );
                }
              );
            }}
          />
          {this.state.show_otp && (
            //true && (

            <PopUp
              Avoid={'padding'}
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
                    this.setState({
                      Number: this.state.SetNumber,
                      CallingCode: this.state.SetCallingCode,
                      CountryCode: this.state.SetCountryCode,
                      Email: this.state.SetEmail,
                      show_otp: false,
                      invalid: false,
                      valid: false,
                    });
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
                  {this.state.typeOTP == 1
                    ? this.state.Email
                    : this.state.UserMobileNumber}
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
                  onStart={() => this.setState({ can_resend_otp: true })}
                  onFinished={() => this.setState({ can_resend_otp: false })}
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
                      //loading_service.showLoading();
                      epaisaRequest(
                        {
                          otpValue: otp,
                          type: this.state.typeOTP,
                          identifier:
                            this.state.typeOTP == 1
                              ? this.state.Email
                              : this.state.UserMobileNumber,
                        },
                        '/user/verify',
                        'PUT'
                      ).then(res => {
                        console.log('RESPOSTA', res);
                        loading_service.hideLoading();
                        if (res.success == 1) {
                          if (this.state.typeOTP == 1) {
                            this.setState({
                              SetEmail: this.state.Email,
                            });
                          } else {
                            this.setState({
                              SetUserMobileNumber: this.state.UserMobileNumber,
                              SetNumber: this.state.Number,
                              SetCallingCode: this.state.CallingCode,
                              SetCountryCode: this.state.CountryCode,
                            });
                          }
                          this.setState(
                            { valid: false, invalid: false, show_otp: false },
                            () =>
                              alert_service.showAlert(
                                (this.state.typeOTP == 1
                                  ? 'Email address'
                                  : 'Mobile Number') + ' successfully changed!'
                              )
                          );
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
                <View
                  style={{ borderRadius: hp('20%'), elevation: hp('0.6%') }}
                >
                  <View
                    style={{ borderRadius: hp('20%'), elevation: hp('0.6%') }}
                  >
                    <ButtonGradientCustom
                      title="RESEND OTP"
                      disabled={this.state.can_resend_otp}
                      onPress={() => {
                        epaisaRequest(
                          { type: this.state.typeOTP },
                          '/user/verify',
                          'POST'
                        ).then(() => {
                          alert_service.showAlert('New OTP re-sent!', () => {
                            this.timer.restart();
                          });
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
          <Modal
            visible={this.state.modalPosition != null}
            transparent={true}
            onRequestClose={() => {
              this.setState({ modalPosition: null });
            }}
          >
            <TouchableOpacity
              onPress={() => {
                this.setState({ indexScroll: 1, modalPosition: null });
              }}
              style={{
                height: '100%',
                width: '100%',
              }}
            />
            <View
              style={{
                width: '100%',
                alignItems: 'center',
                position: 'absolute',
              }}
            >
              <FlatList
                onEndReached={() => {
                  if (this.state.modalPosition != null) {
                    if (this.state.modalPosition.cate == 'Language') {
                    } else {
                      this.setState({
                        indexScroll: this.state.indexScroll + 1,
                      });
                    }
                  }
                }}
                data={
                  this.state.modalPosition != null
                    ? this.state.modalPosition.cate == 'Language'
                      ? ['English']
                      : countriesList.slice(0, 20 * this.state.indexScroll)
                    : []
                }
                // keyExtractor={this._keyExtractor}
                style={{
                  position: 'absolute',
                  height:
                    this.state.modalPosition != null
                      ? this.state.modalPosition.cate == 'Language'
                        ? hp('4%')
                        : hp('20%')
                      : hp('20%'),
                  backgroundColor: 'white',
                  elevation: 2,
                  top:
                    this.state.modalPosition != null
                      ? this.state.modalPosition.y -
                        (this.state.modalPosition != null
                          ? this.state.modalPosition.cate == 'Language'
                            ? hp('2%')
                            : hp('18%')
                          : hp('18%'))
                      : 0,
                  left:
                    this.state.modalPosition != null
                      ? this.state.modalPosition.x
                      : 0,
                  width:
                    this.state.modalPosition != null
                      ? this.state.modalPosition.width - wp('2%')
                      : 0,
                }}
                renderItem={({ item }) => {
                  if (this.state.modalPosition != null) {
                    if (this.state.modalPosition.cate == 'Language') {
                      return (
                        <TouchableOpacity
                          style={{
                            height: hp('4%'),
                            paddingHorizontal: wp('2%'),
                            justifyContent: 'center',
                          }}
                          onPress={() => {
                            this.setState({
                              Language: item,
                              modalPosition: null,
                            });
                            this._textChange('Language', item);
                          }}
                        >
                          <TextMontserrat
                            style={{ fontSize: hp('1.8%'), fontWeight: '600' }}
                          >
                            {item}
                          </TextMontserrat>
                        </TouchableOpacity>
                      );
                    } else {
                      return (
                        <TouchableOpacity
                          style={{
                            height: hp('4%'),
                            paddingHorizontal: wp('2%'),
                            justifyContent: 'center',
                          }}
                          onPress={() => {
                            this.setState({
                              merchantCountryCode: countriesCodes[item],
                              countrycodeName: item,
                              indexScroll: 1,
                              modalPosition: null,
                            });
                          }}
                        >
                          <TextMontserrat
                            style={{ fontSize: hp('1.8%'), fontWeight: '600' }}
                          >
                            {item}
                          </TextMontserrat>
                        </TouchableOpacity>
                      );
                    }
                  }
                }}
              />
            </View>
          </Modal>
        </KeyboardAvoidingView>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    height: '100%',
    width: '100%',
    backgroundColor: colors.darkWhite,
  },
  nameInputs: {
    flexDirection: 'row',
  },
});
const mapStateToProps = state => ({
  config:
    state.cashData.personalConfig != null
      ? state.cashData.personalConfig.user
      : null,
  merchant:
    state.cashData.personalConfig != null
      ? state.cashData.personalConfig.merchant
      : null,
  userPermi: state.cashData.userPermi,
});
const mapDispatchToProps = dispatch => ({
  set_personalconfig: val => {
    return dispatch({ type: cashConstants.SET_PERSONALCONFIG, payload: val });
  },
});
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MyAccountPersonal);
