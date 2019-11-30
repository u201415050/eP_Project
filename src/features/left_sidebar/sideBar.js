import React, { Component } from 'react';
import {
  Platform,
  Text,
  View,
  Image,
  Dimensions,
  TouchableOpacity,
  AsyncStorage,
  SafeAreaView,
  Linking,
  NetInfo,
} from 'react-native';
import AndroidOpenSettings from 'react-native-android-open-settings';
import colors from './styles/colors';
import EStyleSheet from 'react-native-extended-stylesheet';
import ListOptions from './components/ListOptions/listOptions';
import * as screen_names from 'navigation/screen_names';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { TextMontserrat } from 'components';
import { connect } from 'react-redux';
import { isTablet } from './constants/isLandscape';
import { cashActions } from '../cash_register/actions';
import NavigationService from '../../services/navigation/index';
import realm from '../../services/realm_service';
import alert_double_service from '../../services/alert_double_service';
import { NavigationActions } from 'react-navigation';
import Notification from '../../services/realm_models/notification';
import alert_service from '../../services/alert_service';
let keyboard = false;

const isPortrait = () => {
  const dim = Dimensions.get('window');
  if (dim.height >= dim.width) {
    return true;
  } else {
    return false;
  }
};

class SideBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      orientation: isPortrait(),
      notificationsLength: 0,
      isEnabled: false,
      clicked: false,
      firstName: '',
      lastName: '',
      companyName: '',
    };
  }
  componentDidMount() {
    //this.isEnabled = getEnabled().then(res=>alert(res))

    // CAGADA DE EMIL
    // getEnabled(val => {
    //   this.setState({ isEnabled: val });
    // });
    // //alert(JSON.stringify(this.isEnabled))
    // this.keyboardDidShowListener = Keyboard.addListener(
    //   'keyboardDidShow',
    //   this._keyboardDidShow
    // );
    // this.keyboardDidHideListener = Keyboard.addListener(
    //   'keyboardDidHide',
    //   this._keyboardDidHide
    // );

    const user = realm.objectForPrimaryKey('User', 0);
    this.setState({
      firstName: user.userFirstName,
      lastName: user.userLastName,
      companyName: user.merchant.merchantCompanyName,
    });
    const { userId } = user;
    const notifications = realm
      .objects('Notification')
      .filtered(`userId = ${userId}`);
    const array = Array.from(notifications);
    this.setState({
      notificationsLength: array.length,
    });
  }
  componentDidUpdate() {
    // CAGADA DE EMIL
    // getEnabled(val => {
    //   this.setState({ isEnabled: val });
    // });
  }
  // componentWillUnmount() {
  //   this.keyboardDidShowListener.remove();
  //   this.keyboardDidHideListener.remove();
  // }
  user = {};
  merchant = {};
  logout = () => {
    const user = realm.objectForPrimaryKey('User', 0);
    AsyncStorage.setItem(`@lastUserLogged`, '' + user.userId);
    this.props.user.signOut();

    // const resetAction = StackActions.reset({
    //   index: 0,
    //   actions: [
    //     NavigationActions.navigate({ routeName: 'Auth' })
    //   ]
    // })
    // this.props.navigation.dispatch(resetAction);

    this.props.navigation.dispatch(
      NavigationActions.navigate({
        routeName: 'Auth',
      })
    );
    // this.navigate('Auth');
  };

  confirm = () => {
    this.setState({ clicked: true });
    alert_double_service.showAlertDouble(
      'Confirm',
      `Are you sure you would like to log out?`,
      this.logout,
      () => this.setState({ clicked: false })
    );
  };

  navigate = screen => {
    return this.props.navigation.navigate(screen);
  };
  closeDrawer = () => {
    return this.props.navigation.closeLeftDrawer();
  };
  _keyboardDidShow() {
    keyboard = true;
  }

  _keyboardDidHide() {
    keyboard = false;
  }
  render() {
    const { sideOption } = this.props.state;
    const isLandscape = isTablet;
    const paddingLandscape = isLandscape
      ? { paddingHorizontal: wp('3%') }
      : null;
    const { config, configuser } = this.props;
    let imageBus = config
      ? config.merchantCompanyImage != null
        ? config.merchantCompanyImage.indexOf('png') != -1
          ? config.merchantCompanyImage.substr(
              0,
              config.merchantCompanyImage.indexOf('png') + 3
            )
          : config.merchantCompanyImage
        : ''
      : '';

    const notifications = Array.from(
      Notification.getById(this.props.user.userId).filtered(`readed = false`)
    );
    return (
      <SafeAreaView
        style={{ height: '100%', backgroundColor: colors.lightBlack }}
      >
        <View
          style={[
            styles.container,
            keyboard ? { height: hp('100%') } : { height: '100%', flexGrow: 1 },
          ]}
        >
          <View style={[styles.barContainer, paddingLandscape]}>
            <TouchableOpacity
              onPress={() => NavigationService.navigate(screen_names.MAIN_MENU)}
              style={styles.header}
            >
              {config != null ? (
                config.merchantCompanyImage == null ? (
                  <View
                    style={{
                      marginBottom: hp('1%'),
                      backgroundColor: colors.gray,
                      height: hp('8%'),
                      width: hp('8%'),
                      borderRadius: hp('4%'),
                    }}
                  />
                ) : (
                  <Image
                    source={{
                      uri: imageBus,
                    }}
                    style={{
                      borderRadius: hp('4%'),
                      height: hp('8%'),
                      width: hp('8%'),
                      marginBottom: hp('1%'),
                    }}
                  />
                )
              ) : (
                <View
                  style={{
                    marginBottom: hp('1%'),
                    backgroundColor: colors.gray,
                    height: hp('8%'),
                    width: hp('8%'),
                    borderRadius: hp('4%'),
                  }}
                />
              )}

              <TextMontserrat
                numberOfLines={2}
                style={styles.headerTextTop}
              >{`${
                config != null
                  ? config.merchantCompanyName
                  : this.state.companyName
              }`}</TextMontserrat>
              <TextMontserrat
                numberOfLines={2}
                style={styles.headerTextBottom}
              >{`${
                configuser != null
                  ? configuser.userFirstName
                  : this.state.firstName
              } ${
                configuser != null
                  ? configuser.userLastName
                  : this.state.lastName
              }`}</TextMontserrat>
            </TouchableOpacity>
            <ListOptions
              sideOption={sideOption}
              navigate={this.navigate}
              closeDrawer={this.closeDrawer}
            />

            <View style={styles.iconContainer}>
              <TouchableOpacity
                onPress={() => {
                  if (!this.state.isEnabled) {
                    if (Platform.OS === 'android') {
                      AndroidOpenSettings.bluetoothSettings();
                    } else {
                      Linking.openURL('App-Prefs:root=General&path=Bluetooth');
                    }
                  }

                  //
                }}
              >
                <Image
                  source={require('./assets/img/BT.png')}
                  style={{
                    tintColor: this.state.isEnabled
                      ? colors.white
                      : colors.noactiveGray,
                    height: hp('4%'),
                    width: hp('4%') * 0.52,
                  }}
                />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={async () => {
                  this.closeDrawer();
                  if (!(await NetInfo.isConnected.fetch())) {
                    return alert_service.showAlert(
                      'Please connect to Internet.'
                    );
                  }
                  this.navigate(screen_names.DASHBOARD_TOTAL_SALES);
                }}
              >
                <Image
                  source={require('./assets/img/Velo.png')}
                  style={[
                    { height: hp('4%'), width: hp('4%') },
                    NavigationService.history.currentScreenName ==
                    screen_names.DASHBOARD_TOTAL_SALES
                      ? { tintColor: '#FFFFFF' }
                      : null,
                  ]}
                />
              </TouchableOpacity>
              <TouchableOpacity
                disabled={this.state.clicked}
                onPress={this.confirm}
              >
                <Image
                  source={require('./assets/img/Exit.png')}
                  style={{ height: hp('4%'), width: hp('4%') * 1.24 }}
                />
              </TouchableOpacity>
            </View>

            {/* NOTIFICATION ICON ON TOP RIGHT */}
            <View
              style={
                this.state.orientation
                  ? {
                      height: hp('8%'),
                      width: wp('14%'),
                      position: 'absolute',
                      top: 0,
                      right: 0,
                      justifyContent: 'flex-end',
                      // backgroundColor: 'red'
                    }
                  : {
                      height: hp('8%'),
                      width: wp('5.75%'),
                      position: 'absolute',
                      top: 0,
                      right: 0,
                      justifyContent: 'flex-end',
                    }
              }
            >
              <TouchableOpacity
                style={{
                  height: hp('5.1%'),
                  width: hp('5.1%'),
                  justifyContent: 'flex-end',
                  alignItems: 'flex-start',
                  // backgroundColor:'green'
                }}
                onPress={() => {
                  this.closeDrawer();
                  this.props.navigation.dispatch(
                    NavigationActions.navigate({
                      routeName: screen_names.NOTIFICATIONS_HOME,
                    })
                  );
                  // this.props.navigation.closeLeftDrawer();
                }}
              >
                <Image
                  source={require('./assets/icons/notification.png')}
                  style={[
                    { height: hp('3.2%'), width: hp('3.2%') },
                    NavigationService.history.currentScreenName ==
                    screen_names.NOTIFICATIONS_HOME
                      ? { tintColor: '#fff' }
                      : { tintColor: '#ddd' },
                  ]}
                  resizeMode={'contain'}
                />
                {notifications.length > 0 && (
                  <View
                    style={{
                      // height:hp('1.75%'),
                      // width: hp('1.75%'),
                      backgroundColor: '#2ebd41',
                      borderRadius: 20,
                      position: 'absolute',
                      top: !isTablet ? hp('0.3%') : hp('0.05%'),
                      left: !isTablet ? wp('3.2%') : wp('1%'),
                      paddingHorizontal: !isTablet ? wp('1.5%') : wp('0.5%'),
                    }}
                  >
                    <Text
                      style={{
                        color: '#fff',
                        fontSize: !isTablet ? wp('3.8%') : hp('2%'),
                        fontWeight: 'bold',
                      }}
                    >
                      {notifications.length}
                    </Text>
                  </View>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </SafeAreaView>
    );
  }
}

const styles = EStyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    flexGrow: 1,
    backgroundColor: colors.opacityDin(0.5),
    alignItems: 'flex-start',
  },
  barContainer: {
    flex: 1,
    width: '100%',
    backgroundColor: colors.lightBlack,
    paddingHorizontal: wp('8%'),
    //elevation: 200,
  },
  barOptions: {
    flex: 1,
  },
  header: {
    width: '100%',
    marginVertical: hp('5%'),
  },
  headerTextTop: {
    color: colors.white,
    fontWeight: '600',
    fontSize: hp('2.6%'),
  },
  headerTextBottom: {
    color: colors.white,
    fontWeight: '500',
    fontSize: hp('2.3%'),
  },
  iconItem: {
    height: '100%',
    justifyContent: 'center',
    marginHorizontal: 8,
  },
  iconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: hp('4%'),
    marginBottom: hp('3%'),
  },
  '@media (min-width: 200) and (max-width: 400)': {
    // media queries
    /*headerTextTop:{
        fontSize:14
    },
    headerTextBottom:{
        fontSize:13
    },*/
    barContainer: {
      paddingHorizontal: 22,
    },
  },
});
const mapStateToProps = state => ({
  state: state.cashData,
  config:
    state.cashData.personalConfig != null
      ? state.cashData.personalConfig.merchant
      : null,
  configuser:
    state.cashData.personalConfig != null
      ? state.cashData.personalConfig.user
      : null,
  user: state.auth.user,
});
const dispatchActionsToProps = dispatch => ({
  clear_data: () => {
    return dispatch(cashActions.clear_data());
  },
  change_option: val => {
    return dispatch(cashActions.change_option(val));
  },
  clear_customer: () => {
    return dispatch(cashActions.clear_customer());
  },
});
export default connect(
  mapStateToProps,
  dispatchActionsToProps
)(SideBar);
