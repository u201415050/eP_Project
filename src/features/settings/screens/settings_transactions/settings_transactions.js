import React, { Component } from 'react';
import { View, Image, StyleSheet } from 'react-native';
import SettingButton from '../../components/setting_button/setting_button';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { isTablet } from '../../constants/isLandscape';
import colors from '../../styles/colors';
import Orientation from 'react-native-orientation-locker';
import Header from '../../components/header/header';
import { TextMontserrat } from 'components';
import realm, { getTable } from '../../../../services/realm_service';
import { setSetting } from '../../../../services/settings_service';
import confirmAlert from '../../api/confirm';
//import mixpanel from '../../../../services/mixpanel';
import Settings from '../../../../services/realm_models/settings';
import RealmSettings from '../../../../services/realm_models/settings';
import { epaisaRequest } from '../../../../services/epaisa_service';
import User from '../../../../services/realm_models/user';

class SettingsTransactions extends Component {
  static navigationOptions = ({ navigation }) => ({
    header: (
      <Header isBack={true} label="TRANSACTIONS" navigation={navigation} />
    ),
  });

  constructor() {
    super();
    //mixpanel.mp.track('Transaction Setting Screen');
    this.realmSetting = RealmSettings.getSettingCategory('Transaction');
    const activeOptionsIndex = {};
    this.constants = {
      ROUND_OFF: 'RoundOff',
      OFFLINE_TRASACTIONS: 'OfflineTransactions',
      SEND_OTP_ON_REFUND: 'SendOTPonRefund',
    };

    this.state = {
      activeOptionsIndex,
      roleId: realm.objectForPrimaryKey('User', 0).roleId,
    };
  }
  componentWillMount() {
    !isTablet ? Orientation.lockToPortrait() : Orientation.lockToLandscape();
  }

  async componentWillUnmount() {
    await this.syncAll();
  }
  syncAll = async () => {
    const setting = Settings.getSettingCategory('Transaction');
    if (!setting.synced) {
      const data_for_sync = setting.getDataForSync();
      try {
        const user = User.getCurrentUser();
        const settings_transaction = await epaisaRequest(
          {
            userId: user.userId,
            merchantId: user.merchantId,
            settingoptionsparams: data_for_sync,
          },
          '/setting',
          'PUT'
        );
        if (settings_transaction.success) {
          setting.setSynced(true);
        }
      } catch (error) {
        console.log(error);
      }
    }
  };
  fixValue = value => {
    return value === 'True' || value === '1' || +value ? true : false;
  };
  getOption = (optionName, getActive) => {
    const c = JSON.parse(this.realmSetting.value).find(
      x => x.settingParamName === optionName
    );
    console.log(optionName, c);
    const value = this.fixValue(c.value);

    return {
      value,
      toggle: () => {
        confirmAlert(value, () => {
          this.realmSetting.updateValue(optionName, !value);
          this.forceUpdate();
          const user = realm.objectForPrimaryKey('User', 0);
          const orderId = `currentOrder_${user.userId}`.toString();
          const order = realm.objectForPrimaryKey('Order', orderId);
          order.update();
          if (optionName == 'SendOTPonRefund') {
            this.syncAll();
          }
        });
      },
    };
  };
  render() {
    const val = [
      { label: 'Enable Offline Transactions' },
      { label: 'Enable Round-off' },
      { label: 'Send OTP on Refund' },
    ];
    const bgImage = !isTablet
      ? require('../../../../assets/images/bg/loadingBackground.png')
      : require('../../../../assets/images/bg/loadingBackgroundLandscape.png');
    return (
      <View style={styles.container}>
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
          resizeMode={!isTablet ? 'stretch' : 'cover'}
          source={bgImage}
        />
        <SettingButton
          type="toggle"
          toggle={() => {
            this.getOption(this.constants.OFFLINE_TRASACTIONS, true).toggle();
            this.forceUpdate();
          }}
          renderIcon={() => {}}
          checked={+this.getOption(this.constants.OFFLINE_TRASACTIONS).value}
          title={val[0].label}
          noIcon={true}
          heightBox={hp('7%')}
          fontText={hp('1.8%')}
        />
        <TextMontserrat
          style={{
            width: '94%',
            fontSize: hp('1.69%'),
            fontWeight: '700',
            opacity: 0.8,
          }}
        >
          Transactions will be processed offline when connection is not
          available. Once you are online the transactions will be uploaded to
          the server.
        </TextMontserrat>
        <View
          style={{
            paddingTop: hp('1.6%'),
            justifyContent: 'center',
            alignItems: 'center',
            width: '100%',
            borderBottomColor: 'rgba(0,0,0,0.1)',
            borderBottomWidth: this.state.roleId != 4 ? 1 : 0,
          }}
        >
          <SettingButton
            type="toggle"
            toggle={this.getOption(this.constants.ROUND_OFF, true).toggle}
            renderIcon={() => {}}
            checked={+this.getOption(this.constants.ROUND_OFF).value}
            title={val[1].label}
            noIcon={true}
            heightBox={hp('7%')}
            fontText={hp('1.8%')}
          />
          <TextMontserrat
            style={{
              width: '94%',
              fontSize: hp('1.69%'),
              fontWeight: '700',
              opacity: 0.8,
              marginBottom: 5,
            }}
          >
            Final amount would be adjusted to nearest rupees. If the value of
            the sales is 100.50 Rs it will make the final amount as 100 Rs.
          </TextMontserrat>
        </View>
        {this.state.roleId != 4 ? (
          <View
            style={{
              paddingTop: hp('1.6%'),
              justifyContent: 'center',
              alignItems: 'flex-start',
              flexDirection: 'column',
              width: '100%',
              paddingHorizontal: hp('3%'),
              paddingBottom: hp('1.6%'),
            }}
          >
            <TextMontserrat
              style={{
                fontSize: hp('2.4%'),
                fontWeight: '900',
                color: '#174285',
              }}
            >
              Refund Permissions
            </TextMontserrat>
          </View>
        ) : null}
        {this.state.roleId != 4 ? (
          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              width: '100%',
            }}
          >
            <SettingButton
              type="toggle"
              toggle={
                this.getOption(this.constants.SEND_OTP_ON_REFUND, true).toggle
              }
              renderIcon={() => {}}
              checked={+this.getOption(this.constants.SEND_OTP_ON_REFUND).value}
              title={val[2].label}
              noIcon={true}
              heightBox={hp('7%')}
              fontText={hp('1.8%')}
            />
            <TextMontserrat
              style={{
                width: '94%',
                fontSize: hp('1.69%'),
                fontWeight: '700',
                opacity: 0.8,
                marginBottom: 5,
              }}
            >
              Enable 2FA while processing refund for your client and avoid loss
              from fraudulent refunds.
            </TextMontserrat>
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
    paddingTop: hp('2.7%'),
    backgroundColor: colors.darkWhite,
  },
});
export default SettingsTransactions;
