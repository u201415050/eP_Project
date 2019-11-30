import React, { Component } from 'react';
import { View, StyleSheet, Text, Platform, Linking } from 'react-native';
import BackgroundImage from './components/BackgroundImage/backgroundImage';
import Footer from './components/Footer/footer';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import FingerContainer from './components/FingerContainer/fingerContainer';
import { FingerprintModal } from 'components';
import { isTablet } from '../cash_register/constants/isLandscape';
import { CASH_REGISTER, MAIN_MENU } from 'navigation/screen_names';
import { connect } from 'react-redux';
import Biometrics from 'react-native-biometrics';
import { register_fingerprint } from './actions';
import AndroidOpenSettings from 'react-native-android-open-settings';
import { updateSetting } from '../../services/settings_service';
import realm, { getTable } from '../../services/realm_service';
import { LOGIN, SETTINGS_DEVICE } from '../../navigation/screen_names';
//import mixpanel from '../../services/mixpanel';
import * as _ from 'lodash';
import User from '../../services/realm_models/user';
import Settings from '../../services/realm_models/settings';
import FingerprintUser from '../../services/realm_models/fingerprint_user';
import { epaisaRequest } from '../../services/epaisa_service';
import alert_service from '../../services/alert_service';
class FingerPrint extends Component {
  static navigationOptions = {
    header: null,
  };

  state = {
    modalActive: false,
    status: 'normal',
    fromScreen: '',
    user: User.getCurrentUser(),
  };

  componentDidMount() {
    //mixpanel.track('Fingerprint Screen');

    this.setState({
      fromScreen: _.get(
        this.props.navigation,
        'state.params.fromScreen',
        LOGIN
      ),
    });
    FingerprintUser.unLink(this.state.user.userId);
  }

  toggleModalFinger = (status, callback) => {
    this.setState(
      {
        modalActive: !this.state.modalActive,
        status: status || 'normal',
      },
      () => {
        if (callback) callback();
        console.log(this.state);
      }
    );
  };

  _settingDeviceFingerprint = enabled => {
    const settings = getTable('Settings')
      .filtered('name CONTAINS[c] "device"')
      .map(item => item)[0];

    let fingerPrint = JSON.parse(settings.value);
    fingerPrint = fingerPrint.map((item, i) => {
      // if (item.settingParamId == '89') { // staging
      if (item.settingParamName == 'EnableFingerprint') {
        return {
          ...item,
          active: enabled == '1' ? true : false,
          value: enabled == '1' ? true : false,
        };
      }
      return item;
    });

    updateSetting(
      () => {
        settings.value = JSON.stringify(fingerPrint);
      },
      {
        setting: 'Device',
        EnableFingerprint: enabled, // 0 = disabled , 1 = enabled
      }
    );
  };

  _rejectLinkFingerprint = async () => {
    const device_settings = Settings.getSettingCategory('Device');
    device_settings.updateValue('EnableFingerprint', false);

    const fingerprint_user = FingerprintUser.getById(this.state.user.userId);
    if (fingerprint_user) {
      realm.write(() => {
        fingerprint_user.prompt = true;
        fingerprint_user.linked = false;
      });
    }

    if (this.state.fromScreen === LOGIN) {
      return this.props.navigation.replace(MAIN_MENU);
    } else {
      return this.props.navigation.navigate(SETTINGS_DEVICE);
    }
  };

  _acceptLinkFingerprint = async () => {
    const device_settings = Settings.getSettingCategory('Device');
    device_settings.updateValue('EnableFingerprint', true);

    const user = User.getCurrentUser();
    const fingerprint_user = FingerprintUser.getById(user.userId);
    try {
      const publicKey = await Biometrics.createKeys('register');
      const register = await epaisaRequest(
        {
          userId: user.userId,
          fingerprint: publicKey,
        },
        '/fingerprint/register',
        'POST'
      );
      console.log({ register });
      if (!register.success) {
        throw new Error(register.response);
      }
      // this.props.register_fingerprint(user.userId, publicKey, user.auth_key);
      realm.write(() => {
        fingerprint_user.prompt = true;
        fingerprint_user.linked = true;
      });

      return alert_service.showAlert(register.response, () => {
        if (this.state.fromScreen === LOGIN) {
          return this.props.navigation.replace(CASH_REGISTER);
        } else {
          return this.props.navigation.navigate(SETTINGS_DEVICE);
        }
      });
    } catch (error) {
      return this.toggleModalFinger('error');
    }
  };

  fingerprintError = err => {
    this.toggleModalFinger('error');
    console.log('FINGERPRINT ERROR', err);
  };

  render() {
    console.log(this.props);
    return (
      <View style={styles.container}>
        <BackgroundImage
          source={
            isTablet
              ? require('./assets/img/backgroundL.png')
              : require('./assets/img/backgroundP.png')
          }
        />
        {isTablet ? (
          <View style={styles.wrapper}>
            <Text
              style={[
                styles.textDown,
                { fontSize: hp('2%'), fontFamily: 'Montserrat-SemiBold' },
              ]}
            >
              All of the fingerprints stored on this device can be used to log
              into your ePaisa account.
            </Text>
          </View>
        ) : (
          <View style={styles.wrapper}>
            <Text style={styles.textDown}>
              All of the fingerprints stored on this device can be used to
            </Text>
            <Text style={styles.textDown}>log into your ePaisa account.</Text>
          </View>
        )}
        <FingerContainer />
        <Footer
          linkFingerprint={this._acceptLinkFingerprint}
          onReject={this._rejectLinkFingerprint}
        />

        {this.state.modalActive && (
          <FingerprintModal
            action={this.changeStatus}
            status={this.state.status}
            openSettings={() => {
              if (Platform.OS === 'android') {
                AndroidOpenSettings.securitySettings();
              } else {
                Linking.openURL('App-Prefs:root=General&path=SECURITY');
              }
            }}
            cancel={() => this.setState({ modalActive: false })}
            notNow={() => {
              //this._rejectLinkFingerprint();
              this.setState({ modalActive: false });
            }}
          />
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
  },
  wrapper: {
    width: '100%',
    height: isTablet ? hp('85') : hp('89%'),
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingBottom: hp('1.5%'),
  },
  textDown: {
    textAlign: 'center',
    fontSize: hp('1.4%'),
    fontFamily: 'Montserrat-Bold',
    color: '#575B64',
  },
});

const mapStateToProps = state => {
  console.log(state);
  return {
    user: state.login.user,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    register_fingerprint: (user_id, token, auth_key) =>
      dispatch(register_fingerprint(user_id, token, auth_key)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(FingerPrint);
