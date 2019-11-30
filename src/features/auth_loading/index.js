import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  ImageBackground,
  Image,
  Platform,
  AsyncStorage,
} from 'react-native';
import BackgroundTask from '../../../sync';
import { connect } from 'react-redux';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { cashActions } from '../cash_register/actions';
import { cashConstants } from '../cash_register/constants/actions';
import { isTablet } from '../cash_register/constants/isLandscape';
import Orientation from 'react-native-orientation-locker';
import realm from '../../services/realm_service';
import RCTRealtime from '../../services/RCTRealtime';
import { epaisaRequest } from '../../services/epaisa_service';
import Geolocation from 'react-native-geolocation-service';
import { PermissionsAndroid } from 'react-native';
import notifications_service from '../../services/notifications_service';
import DeviceInfo from 'react-native-device-info';
const isPortrait = () => {
  return !DeviceInfo.isTablet();

  /*const dim = Dimensions.get('window');
  if (dim.height >= dim.width) {
    return true;
  } else {
    return false;
  }*/
};

import RealmDeviceInfo from '../../services/realm_models/RealmDeviceInfo';
import uuid from 'uuid/v4';
class AuthLoading extends Component {
  constructor(props) {
    super(props);

    this._bootstrapAsync();
    this.state = {
      orientation: !DeviceInfo.isTablet(), //isPortrait(),
      value: null,
      products: [],
      extras: null,
    };
    this.getAllData();
    this.getCurrentPosition();
    RealmDeviceInfo.init();
    // this.betterList =''
    //  Object.entries(countries).map(item=>{this.betterList+= `["${item[1]}"]:'${item[0]}',`})
    // console.log(this.betterList)
  }

  UNSAFE_componentWillMount() {
    DeviceInfo.isTablet()
      ? Orientation.lockToLandscape()
      : Orientation.lockToPortrait();
  }

  getCurrentPosition() {
    if (Platform.OS === 'android') {
      PermissionsAndroid.check(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
      )
        .then(async hasLocationPermission => {
          if (!hasLocationPermission) {
            const permission = await PermissionsAndroid.request(
              PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
            );
            if (permission !== PermissionsAndroid.RESULTS.GRANTED) {
              return;
            }
          }
          Geolocation.getCurrentPosition(
            position => {
              const user = realm.objectForPrimaryKey('User', 0);
              if (user) {
                realm.write(() => {
                  user.userLocation = position.coords;
                });
                // alert(JSON.stringify(user));
              }
            },
            error => {
              // See error code charts below.
              console.log(error.code, error.message);
            },
            { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
          );
        })
        .catch(err => console.log(err));
    } else {
      Geolocation.getCurrentPosition(
        position => {
          const user = realm.objectForPrimaryKey('User', 0);
          if (user) {
            realm.write(() => {
              user.userLocation = position.coords;
            });
            // alert(JSON.stringify(user));
          }
        },
        error => {
          // See error code charts below.
          console.log(error.code, error.message);
        },
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
      );
    }
    // try {
    //   navigator.geolocation.getCurrentPosition(pos => {
    //     const user = realm.objectForPrimaryKey('User', 0);
    //     if (user) {
    //       realm.write(() => {
    //         user.userLocation = pos.coords;
    //       });
    //       // alert(JSON.stringify(user));
    //     }
    //   });
    // } catch (error) {
    //   this.getCurrentPosition();
    // }
  }
  getAllData() {
    //var content = {products:[],extras:null}
    const { get_data } = this.props;
    get_data(null);
  }
  // Fetch the token from storage then navigate to our appropriate place
  _bootstrapAsync = async () => {
    // const userToken = await AsyncStorage.getItem('userToken');
    // This will switch to the App screen or Auth screen and this loading
    // screen will be unmounted and thrown away.
    try {
      // const user = await AsyncStorage.getItem('user');
      let userData = realm.objectForPrimaryKey('User', 0);
      // const order = await AsyncStorage.getItem('order');
      // const orderPay = await AsyncStorage.getItem('orderPay');
      if (userData) {
        // if (order) {
        //   this.props.set_custom_order(order);
        // }
        // if (orderPay) {
        //   this.props.set_custom_order_pay(orderPay);
        // }
        // const customer =
        //   getTable('Customer').length > 0 ? getTable('Customer')[0] : null;
        // if (customer != null) {
        //   if (customer.name != '') {
        //     this.props.add_customer({
        //       name: customer.name,
        //       number: customer.number,
        //       rewardPoints: 0,
        //     });
        //   }
        // }
        // let userJ = JSON.parse(user);
        // this.props.set_user(userJ);
        await AsyncStorage.setItem(`LiveChatToken`, uuid());
        epaisaRequest(
          {
            merchantId: userData.merchantId,
          },
          '/user/profile',
          'GET'
        ).then(response => {
          let syncDataUser = realm.objects('EditUser');
          let syncDataBusiness = realm.objects('EditBusiness');
          //alert(syncDataBusiness.length)
          let newResponse = response.response;
          if (syncDataUser.length != 0) {
            let itemEdit = Array.from(syncDataUser)[0];
            delete itemEdit.id;
            newResponse.user = { ...newResponse.user, ...itemEdit };
          }
          if (syncDataBusiness.length != 0) {
            //alert("PAS")
            let itemEdit = Array.from(syncDataBusiness)[0];
            delete itemEdit.id;
            newResponse.merchant = { ...newResponse.merchant, ...itemEdit };
          }
          //alert(JSON.stringify(response.response))
          this.props.set_personalconfig(newResponse);
        });
        /*userService.getNotificationUser(userJ.response.auth_key).then(
          response=>{
           this.props.set_notificationconfig(response.response)
          }
        )*/
        //alert(1)
        BackgroundTask();
        epaisaRequest(
          {
            merchantId: userData.merchantId,
            otpIsNull: true,
          },
          '/customer',
          'GET'
        )
          // userService
          //   .getCustomers(userJ.response.auth_key, userJ.response.merchantId)
          .then(response => {
            const { list_customers } = this.props;
            list_customers({
              totalCustomers: response.response.Total,
              customers:
                response.success == 1 ? response.response.Customer : [],
              userdata: {
                auth_key: userData.auth_key,
                merchantId: userData.merchantId,
              },
            });
          });
        if (Platform.OS === 'android') {
          notifications_service.init(userData.userId);
        }
      } else {
        userData = {};
      }
      //if (Platform.OS === 'android') {
      RCTRealtime.init();
      //}
      setTimeout(() => {
        this.props.navigation.navigate(userData.authenticated ? 'App' : 'Auth');
      }, 1000);
    } catch (error) {
      console.log({ ERROR_LOADING: error });
      setTimeout(() => {
        this.props.navigation.navigate('Auth');
      }, 2000);
    }
  };

  render() {
    return (
      <ImageBackground
        source={
          !DeviceInfo.isTablet()
            ? require('../../assets/images/bg/loadingBackground.png')
            : require('../../assets/images/bg/loadingBackgroundLandscape.png')
        }
        style={styles.backgroundImage}
        resizeMode={'stretch'}
      >
        <View style={styles.centerAnimation}>
          <Image
            style={{
              width: !DeviceInfo.isTablet() ? wp('45.8%') : wp('29.2%'),
              resizeMode: 'contain',
            }}
            source={require('../../assets/images/bg/epaisa_logo.png')}
          />
        </View>
      </ImageBackground>
    );
  }
}

const styles = StyleSheet.create({
  backgroundImage: {
    width: '100%',
    height: '100%',
  },
  container: {
    flex: 1,
    //backgroundColor: '#fff',
  },
  centerAnimation: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    //backgroundColor: '#fff',
  },
});
const mapDispatchToProps = dispatch => ({
  get_data: val => {
    return dispatch(cashActions.get_data(val));
  },
  set_user: val => {
    return dispatch(cashActions.set_user(val));
  },
  add_customer: val => {
    return dispatch(cashActions.add_customer(val));
  },
  list_customers: val => {
    return dispatch({ type: cashConstants.LIST_CUSTOMERS, payload: val });
  },
  set_personalconfig: val => {
    return dispatch({ type: cashConstants.SET_PERSONALCONFIG, payload: val });
  },
  set_notificationconfig: val => {
    return dispatch({
      type: cashConstants.SET_NOTIFICATIONCONFIG,
      payload: val,
    });
  },
  set_custom_order: val => {
    return dispatch({ type: cashConstants.SET_CUSTOM_ORDER, payload: val });
  },
  set_custom_order_pay: val => {
    return dispatch({ type: cashConstants.SET_CUSTOM_ORDER_PAY, payload: val });
  },
  set_userpermi: val => {
    return dispatch({ type: cashConstants.SET_USERPERMI, payload: val });
  },
});
export default connect(
  null,
  mapDispatchToProps
)(AuthLoading);
