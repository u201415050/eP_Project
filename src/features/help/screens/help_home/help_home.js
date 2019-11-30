import React, { Component, Fragment } from 'react';
import {
  StyleSheet,
  ImageBackground,
  Dimensions,
  View,
  Image,
} from 'react-native';
import Header from '../../../customers/components/header';
import { isTablet } from '../../../cash_register/constants/isLandscape';
import { ButtonOutline, SafeAreaView } from 'components';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import SettingButton from '../../../settings/components/setting_button/setting_button';
import SettingButtonLandscape from '../../../my_account/components/setting_button_land/setting_button_land';
import HelpLearnMore from '../help_learn_more/help_learn_more';
import HelpSupport from '../help_support/help_support';
import HelpLiveChat from '../help_live_chat/help_live_chat';
import colors from '../../../settings/styles/colors';
import { Background } from 'components';
import TeamviewerModule from '../../../../custom_modules/team_viewer_module';
import { DeviceEventEmitter } from 'react-native';
import realm from '../../../../services/realm_service';
const isPortrait = () => {
  const dim = Dimensions.get('window');
  if (dim.height >= dim.width) {
    return true;
  } else {
    return false;
  }
};

class HelpHome extends Component {
  static navigationOptions = {
    header: null,
  };
  state = {
    orientation: isPortrait(),
    status: 'support',
    sharing: false,
    isConnected: true,
  };

  async UNSAFE_componentWillMount() {
    const connected = await NetInfo.isConnected.fetch();
    this.setState({ isConnected: connected });
  }

  render() {
    const bgImage = !isTablet
      ? require('../../../../assets/images/bg/loadingBackground.png')
      : require('../../../../assets/images/bg/loadingBackgroundLandscape.png');
    return (
      <SafeAreaView fullscreen={true} bottomColor={colors.darkWhite}>
        <Background>
          <View
            style={[
              isTablet
                ? {
                    flexDirection: 'row',
                    height: '100%',
                    backgroundColor: colors.darkWhite,
                  }
                : { backgroundColor: colors.darkWhite },
            ]}
          >
            <View
              style={{
                position: 'absolute',
                left: 0,
                top: 0,
                height: '100%',

                width: isTablet ? '35%' : '100%',

                elevation: 29,
              }}
            />
            <View
              style={[
                {
                  position: isTablet ? 'absolute' : 'relative',
                  width: isTablet ? '35%' : '100%',
                  height: '100%',
                  zIndex: 3,
                  // backgroundColor: 'white',
                  // shadowOffset: {
                  //   width: 5,
                  //   height: 5,
                  // },
                  // shadowColor: 'grey',
                  // shadowOpacity: !isTablet ? 0 : 0.5,
                  // shadowRadius: 7,
                  // elevation: 30,
                },
                isTablet
                  ? { left: 0, top: 0, borderRightWidth: wp('0.05%') }
                  : { height: '100%' },
              ]}
            >
              <Header
                label="HELP"
                navigation={this.props.navigation}
                renderRightButton={false}
              />
              <View
                style={{
                  paddingHorizontal: !isTablet ? wp('6%') : 20,
                  paddingVertical: !isTablet ? wp('4%') : 20,
                }}
              >
                <ButtonOutline
                  title={'LEARN MORE'}
                  onPress={() => {
                    if (isTablet) {
                      this.setState({ status: 'learn' });
                    } else {
                      this.props.navigation.navigate('HelpLearnMore');
                    }
                  }}
                  style={
                    this.state.orientation
                      ? {
                          width: wp('86.6%'),
                          height: hp('7.5%'),
                          borderWidth: hp('0.15%'),
                          borderRadius: hp('20%'),
                          borderColor: '#979797',
                        }
                      : {
                          width: wp('45.7%'),
                          height: hp('7.8%'),
                          borderWidth: hp('0.15%'),
                          borderRadius: hp('20%'),
                          borderColor: '#979797',
                        }
                  }
                  buttonCustom={
                    this.state.orientation
                      ? {
                          color: '#164486',
                          fontWeight: 'bold',
                          fontSize: hp('2%'),
                          letterSpacing: 2,
                        }
                      : {
                          color: '#164486',
                          fontWeight: 'bold',
                          fontSize: hp('2%'),
                          letterSpacing: 2,
                        }
                  }
                />
              </View>
              <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                <View style={{ width: '100%', alignItems: 'center' }}>
                  {isTablet ? (
                    <SettingButtonLandscape
                      active={this.state.status == 'support'}
                      type="touchable"
                      onPress={() => {
                        if (isTablet) {
                          this.setState({ status: 'support' });
                        } else {
                          this.props.navigation.navigate('HelpSupport');
                        }
                      }}
                      renderIcon={() => (
                        <Image
                          source={require('../../assets/support.png')}
                          style={{ width: hp('6.5%'), height: hp('6.5%') }}
                        />
                      )}
                      title={'Support'}
                    />
                  ) : (
                    <SettingButton
                      type="touchable"
                      onPress={() => {
                        this.props.navigation.navigate('HelpSupport');
                      }}
                      renderIcon={() => (
                        <Image
                          source={require('../../assets/support.png')}
                          style={{ width: hp('6.5%'), height: hp('6.5%') }}
                        />
                      )}
                      title={'Support'}
                    />
                  )}
                </View>
                <View style={{ width: '100%', alignItems: 'center' }}>
                  {isTablet ? (
                    <SettingButtonLandscape
                      type="touchable"
                      active={this.state.status == 'live'}
                      onPress={() => {
                        if (this.state.isConnected || isTablet) {
                          if (isTablet) {
                            this.setState({ status: 'live' });
                          } else {
                            this.props.navigation.navigate('HelpLiveChat');
                          }
                        } else {
                          alert_service.showAlert('Please connect to Internet');
                        }
                      }}
                      renderIcon={() => (
                        <Image
                          source={require('../../assets/live_chat.png')}
                          style={{ width: hp('6.5%'), height: hp('6.5%') }}
                        />
                      )}
                      title={'Live Chat'}
                    />
                  ) : (
                    <SettingButton
                      type="touchable"
                      onPress={() => {
                        if (this.state.isConnected) {
                          this.props.navigation.navigate('HelpLiveChat');
                        } else {
                          alert_service.showAlert('Please connect to Internet');
                        }
                      }}
                      renderIcon={() => (
                        <Image
                          source={require('../../assets/live_chat.png')}
                          style={{ width: hp('6.5%'), height: hp('6.5%') }}
                        />
                      )}
                      title={'Live Chat'}
                    />
                  )}
                </View>
                <View style={{ width: '100%', alignItems: 'center' }}>
                  {isTablet ? (
                    <SettingButtonLandscape
                      disabled={true}
                      type="touchable"
                      onPress={() => {
                        if (this.state.sharing) {
                          this.setState({ sharing: false });
                          TeamviewerModule.unRegister();
                        } else {
                          this.setState({ sharing: true });

                          let userData = realm.objectForPrimaryKey('User', 0);
                          TeamviewerModule.register();

                          setTimeout(
                            () =>
                              TeamviewerModule.startScreenSharing(
                                userData.userId +
                                  '(' +
                                  userData.merchant.merchantCompanyName +
                                  ')'
                              ),
                            1000
                          );
                        }
                      }}
                      renderIcon={() => (
                        <Image
                          source={require('../../assets/teamviewer.png')}
                          style={{ width: hp('6.5%'), height: hp('6.5%') }}
                        />
                      )}
                      title={'Team Viewer Support'}
                    />
                  ) : (
                    <SettingButton
                      disabled={true}
                      type="touchable"
                      onPress={() => {
                        if (this.state.sharing) {
                          this.setState({ sharing: false });
                          TeamviewerModule.unRegister();
                        } else {
                          this.setState({ sharing: true });

                          let userData = realm.objectForPrimaryKey('User', 0);
                          TeamviewerModule.register();

                          setTimeout(
                            () =>
                              TeamviewerModule.startScreenSharing(
                                userData.userId +
                                  '(' +
                                  userData.merchant.merchantCompanyName +
                                  ')'
                              ),
                            1000
                          );
                        }
                      }}
                      renderIcon={() => (
                        <Image
                          source={require('../../assets/teamviewer.png')}
                          style={{ width: hp('6.5%'), height: hp('6.5%') }}
                        />
                      )}
                      title={'Team Viewer Support'}
                    />
                  )}
                </View>
              </View>
            </View>
            {isTablet ? (
              <View
                style={{
                  height: '92.4%',
                  width: '65%',
                  position: 'absolute',
                  left: wp('35%'),
                  top: hp('7.6%'),
                  backgroundColor: colors.darkWhite,
                }}
              >
                {this.state.status == 'learn' ? (
                  <HelpLearnMore navigation={this.props.navigation} />
                ) : this.state.status == 'support' ? (
                  <HelpSupport />
                ) : this.state.status == 'live' ? (
                  <HelpLiveChat />
                ) : null}
              </View>
            ) : null}
          </View>
        </Background>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({});
export default HelpHome;
