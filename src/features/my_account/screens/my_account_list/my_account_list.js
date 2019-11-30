import React, { Component } from 'react';
import { View, Image, StyleSheet, BackHandler } from 'react-native';
import SettingButton from '../../components/setting_button/setting_button';
import Header from '../../components/header/header';
import * as screen_names from '../../../../navigation/screen_names';
import NavigationService from '../../../../services/navigation';

import colors from '../../styles/colors';
import SettingButtonLandscape from '../../components/setting_button_land/setting_button_land';

import { filtrate } from './constants/findSource';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { getLocalSettingRow } from '../../../../services/settings_service';
import MyAccountPersonal from '../my_account_personal/my_account_personal';
import MyAccountBusiness from '../my_account_business/my_account_business';
import MyAccountNotifications from '../my_account_notifications/my_account_notifications';
import MyAccountReports from '../my_account_reports/my_account_reports';
import MyAccountPassword from '../my_account_password/my_account_password';
import { isTablet } from '../../../cash_register/constants/isLandscape';
const isPhone = !isTablet;
class MyAccountList extends Component {
  state = {
    payments: false,
    active: 0,
    activeChild: 0,
    searchMode: false,
    listFilter: [],
    val: '',
  };
  constructor(props) {
    super(props);
  }
  static navigationOptions = ({ navigation }) => {
    const { params = {} } = navigation.state;

    return {
      header: (
        <Header
          exit={() => {
            params.exit();
          }}
          find={val => {
            params.handle(val);
          }}
          label="MY ACCOUNT"
          navigation={navigation}
        />
      ),
    };
  };
  componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);
    this.props.navigation.setParams({
      handle: this.onChange,
      exit: this.exit,
    });
  }
  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackPress);
  }

  handleBackPress = () => {
    NavigationService.navigate(screen_names.CASH_REGISTER); // works best when the goBack is async
    return true;
  };
  onChange = val => {
    this.setState({ searchMode: val != '' });
    if (val != '') {
      let tempList = filtrate(val);
      this.setState({ val: val, listFilter: tempList });
    }
  };
  getState = () => {
    return this.state.searchText;
  };
  my_account_list = [
    {
      title: 'Personal',
      renderIcon: () => {
        return (
          <Image
            source={require('../../assets/img/personal.png')}
            style={{ width: hp('6%'), height: hp('6%') }}
          />
        );
      },
      type: 'touchable',
      screen: screen_names.MY_ACCOUNT_PERSONAL,
    },
    {
      title: 'Business',
      renderIcon: () => {
        return (
          <Image
            source={require('../../assets/img/business.png')}
            style={{ width: hp('6%'), height: hp('6%') }}
          />
        );
      },
      type: 'touchable',
      screen: screen_names.MY_ACCOUNT_BUSINESS,
    },
    {
      title: 'Notifications',
      renderIcon: () => {
        return (
          <Image
            source={require('../../assets/img/notifications.png')}
            style={{ width: hp('6%'), height: hp('6%') }}
          />
        );
      },
      type: 'touchable',
      screen: screen_names.MY_ACCOUNT_NOTIFICATIONS,
    },
    {
      title: 'Reports',
      renderIcon: () => {
        return (
          <Image
            source={require('../../assets/img/reports.png')}
            style={{ width: hp('6%'), height: hp('6%') }}
          />
        );
      },
      type: 'touchable',
      screen: screen_names.MY_ACCOUNT_REPORTS,
    },
    {
      title: 'Password',
      renderIcon: () => {
        return (
          <Image
            source={require('../../assets/img/password.png')}
            style={{ width: hp('6%'), height: hp('6%') }}
          />
        );
      },
      type: 'touchable',
      screen: screen_names.MY_ACCOUNT_PASSWORD,
    },
  ];
  exit = () => {
    this.setState({ searchMode: false });
  };

  render() {
    const bgImage = !isTablet
      ? require('../../../../assets/images/bg/loadingBackground.png')
      : require('../../../../assets/images/bg/loadingBackgroundLandscape.png');
    return (
      <View
        style={[styles.container, !isPhone ? { flexDirection: 'row' } : null]}
      >
        {isPhone ? (
          <Image
            style={{
              position: 'absolute',
              width: '100%',
              height: hp('100%'),
              top: 0,
              left: 0,
              bottom: 0,
              right: 0,
            }}
            resizeMode="stretch"
            source={bgImage}
          />
        ) : null}
        {isPhone ? (
          <View style={{ paddingTop: 20, alignItems: 'center' }}>
            {this.state.searchMode
              ? this.state.listFilter.map((item, i) => {
                  if (item.label == 'enable Touch Id') return null;
                  else {
                    console.log(item.settingParamName, item.par, item.label);
                    let valueActive = item.noGet
                      ? true
                      : getLocalSettingRow(item.par, item.settingParamName);
                    return (
                      <SettingButton
                        onPress={() => {
                          this.setState({
                            searchMode: false,
                            listFilter: [],
                            val: '',
                          });
                          NavigationService.navigate(item.screen);
                        }}
                        key={`${item.label}${i}`}
                        renderIcon={() =>
                          item.component ? (
                            item.renderIcon()
                          ) : (
                            <Image
                              source={item.renderIcon}
                              style={{ width: hp('6.5%'), height: hp('6.5%') }}
                            />
                          )
                        }
                        noIcon={item.noIcon || false}
                        type={item.type}
                        size={45}
                        title={item.label}
                        checked={
                          valueActive == true || valueActive == 1 ? true : false
                        }
                        toggle={() => {
                          item.toggle();
                          this.setState({
                            listFilter: filtrate(this.state.val),
                          });
                        }}
                      />
                    );
                  }
                })
              : this.my_account_list.map((item, i) => {
                  return (
                    <SettingButton
                      onPress={() => {
                        this.setState({
                          searchMode: false,
                          listFilter: [],
                          val: '',
                        });
                        NavigationService.navigate(item.screen);
                      }}
                      key={`${item.title}${i}`}
                      renderIcon={item.renderIcon}
                      type={item.type}
                      size={45}
                      title={item.title}
                    />
                  );
                })}
          </View>
        ) : null}
        {!isPhone ? (
          <View
            style={{
              width: '35%',
              position: 'absolute',
              top: 0,
              left: 0,
              height: '100%',
              // backgroundColor: colors.darkWhite,
              zIndex: 1,
              // elevation: 30,
              // shadowOffset: { width: 5, height: 5 },
              // shadowColor: 'grey',
              // shadowOpacity: 0.5,
              // shadowRadius: 7,
              borderRightWidth: wp('0.05%'),
            }}
          >
            <View style={{ alignItems: 'center' }}>
              {this.my_account_list.map((item, i) => {
                return (
                  <SettingButtonLandscape
                    childPress={val => {
                      this.setState({ searchMode: false, activeChild: val });
                    }}
                    onPress={() => {
                      this.setState({
                        searchMode: false,
                        active: i,
                        activeChild: 0,
                      });
                    }}
                    key={`${item.title}${i}`}
                    renderIcon={item.renderIcon}
                    type={item.type}
                    size={45}
                    title={item.title}
                    active={this.state.active == i}
                    child={item.children || null}
                    activeChild={this.state.activeChild}
                  />
                );
              })}
            </View>
          </View>
        ) : null}
        {!isPhone ? (
          <View style={{ width: '100%', paddingLeft: '35%', height: '100%' }}>
            <Image
              style={{
                position: 'absolute',
                width: '100%',
                height: hp('100%'),
                top: 0,
                left: 0,
                bottom: 0,
                right: 0,
              }}
              resizeMode="stretch"
              source={bgImage}
            />
            {this.state.searchMode ? (
              <View style={{ paddingTop: 20, alignItems: 'center' }}>
                {this.state.listFilter.map((item, i) => {
                  if (item.label == 'enable Touch Id') return null;
                  else {
                    console.log;
                    let valueActive = item.noGet
                      ? true
                      : getLocalSettingRow(item.par, item.settingParamName);
                    return (
                      <SettingButton
                        onPress={() => {
                          this.setState({
                            searchMode: false,
                            listFilter: [],
                            val: '',
                          });
                          NavigationService.navigate(item.screen);
                        }}
                        key={`${item.label}${i}`}
                        renderIcon={() => (
                          <Image
                            source={item.renderIcon}
                            style={{ width: hp('6.5%'), height: hp('6.5%') }}
                          />
                        )}
                        noIcon={item.noIcon || false}
                        type={item.type}
                        size={45}
                        title={item.label}
                        checked={
                          valueActive == true || valueActive == 1 ? true : false
                        }
                        toggle={() => {
                          item.toggle();
                          this.setState({
                            listFilter: filtrate(this.state.val),
                          });
                        }}
                      />
                    );
                  }
                })}
              </View>
            ) : null}
            {this.state.active == 0 && !this.state.searchMode ? (
              <MyAccountPersonal />
            ) : null}
            {this.state.active == 1 && !this.state.searchMode ? (
              <MyAccountBusiness />
            ) : null}
            {this.state.active == 2 && !this.state.searchMode ? (
              <MyAccountNotifications />
            ) : null}
            {this.state.active == 3 && !this.state.searchMode ? (
              <MyAccountReports />
            ) : null}
            {this.state.active == 4 && !this.state.searchMode ? (
              <MyAccountPassword />
            ) : null}
          </View>
        ) : null}
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
});
export default MyAccountList;
