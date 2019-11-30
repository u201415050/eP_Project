import React, { Component } from 'react';
import { View, Image, StyleSheet, BackHandler } from 'react-native';
import SettingButton from '../../components/setting_button/setting_button';
import DeviceIcon from '../../components/icons/device_icon/device_icon';
import HardwareIcon from '../../components/icons/hardware_icon/hardware_icon';
import LoyaltyIcon from '../../components/icons/loyalty_icon/loyalty_icon';
import TransactionsIcon from '../../components/icons/transactions_icon/transactions_icon';
import PaymentsIcon from '../../components/icons/payments_icon/payments_icon';
import Header from '../../components/header/header';
import * as screen_names from '../../../../navigation/screen_names';
import NavigationService from '../../../../services/navigation';

import colors from '../../styles/colors';
import SettingButtonLandscape from '../../components/setting_button_land/setting_button_land';
import SettingsDevice from '../settings_device/settings_device';
import SettingsPayments from '../settings_payments/settings_payments';
import SettingsTransactions from '../settings_transactions/settings_transactions';

import SettingsPrinters from '../settings_printers/settings_printers';
import SettingsCardReaders from '../settings_card_readers/settings_card_readers';
import SettingsCashDrawers from '../settings_cash_drawers/settings_cash_drawers';
import Search from '../../components/search/search';
import { filtrate } from './constants/findSource';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { getLocalSettingRow } from '../../../../services/settings_service';

import confirmAlert from '../../api/confirm';
import { isTablet } from '../../../cash_register/constants/isLandscape';
//import mixpanel from '../../../../services/mixpanel';
import realm from '../../../../services/realm_service';
const isPhone = !isTablet;
class SettingsList extends Component {
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
          label="SETTINGS"
          navigation={navigation}
        />
      ),
    };
  };
  constructor(props) {
    super(props);
    //mixpanel.track('Setting Menu Screen');
  }
  state = {
    payments: false,
    active: 0,
    activeChild: 0,
    searchMode: false,
    listFilter: [],
    val: '',
    roleId: realm.objectForPrimaryKey('User', 0).roleId,
  };

  componentDidMount() {
    this;
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
    NavigationService.navigate(screen_names.CASH_REGISTER);
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

  settings_list = [
    {
      title: 'Device',
      renderIcon: () => <DeviceIcon />,
      type: 'touchable',
      screen: screen_names.SETTINGS_DEVICE,
    },
    {
      title: 'Hardware',
      renderIcon: () => <HardwareIcon />,
      type: 'touchable',
      screen: screen_names.SETTINGS_HARDWARE,
      children: [
        {
          type: 'touchable',
          image: require('../../assets/img/printer.png'),
          label: 'Printers',
        },
        {
          type: 'touchable',
          image: require('../../assets/img/card.png'),
          label: 'Card Readers',
        },
        {
          type: 'touchable',
          image: require('../../assets/img/cash.png'),
          label: 'Cash Drawers',
        },
      ],
    },
    {
      title: 'Payment Options',
      renderIcon: () => <PaymentsIcon />,
      type: 'touchable',
      screen: screen_names.SETTINGS_PAYMENTS,
    },
    {
      title: 'Transactions',
      renderIcon: () => <TransactionsIcon />,
      type: 'touchable',
      screen: screen_names.SETTINGS_TRANSACTIONS,
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
              width: wp('100%'),
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
                  if (
                    item.label == 'enable Touch Id' ||
                    (item.label == 'Send OTP on Refund' &&
                      this.state.roleId == 4)
                  )
                    return null;
                  else {
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
                        renderIcon={() => {
                          if (item.component) {
                            const Icon = item.renderIcon;
                            return <Icon />;
                          } else {
                            return (
                              <Image
                                source={item.renderIcon}
                                style={{
                                  width: hp('6.5%'),
                                  height: hp('6.5%'),
                                }}
                              />
                            );
                          }
                        }}
                        noIcon={item.noIcon || false}
                        type={item.type}
                        size={45}
                        title={item.label}
                        checked={item.value}
                        toggle={() => {
                          const action = () => {
                            item.toggle();
                            this.setState({
                              listFilter: filtrate(this.state.val),
                            });
                          };
                          confirmAlert(item.value, action);
                        }}
                      />
                    );
                  }
                })
              : this.settings_list.map((item, i) => {
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
              height: '100%',
              position: 'absolute',
              top: 0,
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
              {this.settings_list.map((item, i) => {
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
              resizeMode="cover"
              source={bgImage}
            />
            {this.state.searchMode ? (
              <View style={{ paddingTop: 20, alignItems: 'center' }}>
                {this.state.listFilter.map((item, i) => {
                  if (item.label == 'enable Touch Id') return null;
                  else {
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
                        checked={item.value}
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
              <SettingsDevice />
            ) : null}
            {this.state.active == 1 &&
            this.state.activeChild == 0 &&
            !this.state.searchMode ? (
              <SettingsPrinters />
            ) : null}
            {this.state.active == 1 &&
            this.state.activeChild == 1 &&
            !this.state.searchMode ? (
              <SettingsCardReaders />
            ) : null}
            {this.state.active == 1 &&
            this.state.activeChild == 2 &&
            !this.state.searchMode ? (
              <SettingsCashDrawers />
            ) : null}
            {this.state.active == 2 && !this.state.searchMode ? (
              <SettingsPayments />
            ) : null}
            {this.state.active == 3 && !this.state.searchMode ? (
              <SettingsTransactions />
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
export default SettingsList;
