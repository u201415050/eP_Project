import React, { Component, Fragment } from 'react';
import {
  StyleSheet,
  Dimensions,
  View,
  KeyboardAvoidingView,
  AsyncStorage,
  NetInfo,
  Platform,
} from 'react-native';
import { SafeAreaView, TextMontserrat } from 'components';
import { WebView } from 'react-native-webview';
import Header from '../../../customers/components/header';
import { isTablet } from '../../../cash_register/constants/isLandscape';
import colors from '../../../settings/styles/colors';
import alert_service from '../../../../services/alert_service';
import NavigationService from '../../../../services/navigation/index';
import realm from '../../../../services/realm_service';
import * as screen_names from '../../../../navigation/screen_names';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';

const isPortrait = () => {
  const dim = Dimensions.get('window');
  if (dim.height >= dim.width) {
    return true;
  } else {
    return false;
  }
};

class HelpLiveChat extends Component {
  static navigationOptions = {
    header: null,
  };
  state = {
    orientation: isPortrait(),
    token: null,
    online: true,
  };

  async UNSAFE_componentWillMount() {
    const connected = await NetInfo.isConnected.fetch();
    this.setState({ online: connected });
  }

  componentDidMount() {
    if (this.state.online) {
      const user = realm.objectForPrimaryKey('User', 0);

      AsyncStorage.getItem(`LiveChatToken`).then(token => {
        // alert(
        //   JSON.stringify({
        //     merchant: `${user.userFirstName} ${user.userLastName || ''}`,
        //     phone: `${user.userMobileNumber}`,
        //     email: `${user.username}`,
        //     company: `${(user.merchant || {}).merchantCompanyName || ''}`,
        //   })
        // );
        const runFirst = `
          setTimeout(function() {
            initialize('${token}', {
              merchant: '${user.userFirstName} ${user.userLastName || ''}',
              phone: '${user.userMobileNumber}',
              email: '${user.username}',
              company: '${(user.merchant || {}).merchantCompanyName || ''}'
            });
          }, 1000);
          true; // note: this is required, or you'll sometimes get silent failures
      `;
        this.setState({ runFirst });
      });
    } else {
      if (!isTablet)
        alert_service.showAlert('Please connect to Internet', () => {
          NavigationService.navigate(screen_names.CASH_REGISTER);
        });
    }
  }

  render() {
    // const js = `window.CRISP_TOKEN_ID = '${this.state.token}';`;

    return (
      <SafeAreaView
        disabled={isTablet}
        fullscreen={true}
        bottomColor={colors.darkWhite}
      >
        <View
          behavior="position"
          style={{
            height: '100%',
          }}
          contentContainerStyle={{ height: '100%' }}
        >
          {isTablet ? null : (
            <Header
              label="Live Chat"
              navigation={this.props.navigation}
              renderRightButton={false}
              back={true}
            />
          )}

          {this.state.runFirst ? (
            !this.state.online ? (
              <View
                style={{
                  height: '100%',
                  width: '100%',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <TextMontserrat
                  style={{
                    fontSize: hp('5%'),
                    fontWeight: '900',
                    color: 'rgba(0,0,0,0.5)',
                  }}
                >
                  Please connect to
                </TextMontserrat>
                <TextMontserrat
                  style={{
                    fontSize: hp('5%'),
                    fontWeight: '900',
                    color: 'rgba(0,0,0,0.5)',
                  }}
                >
                  Internet
                </TextMontserrat>
              </View>
            ) : (
              <KeyboardAvoidingView style={{ flex: 1 }}>
                <WebView
                  ref={web => (this.web = web)}
                  originWhitelist={['*']}
                  useWebKit={true}
                  automaticallyAdjustContentInsets={true}
                  style={{ flex: 1 }}
                  source={
                    Platform.OS === 'ios'
                      ? require('./livechat/index.html')
                      : { uri: 'file:///android_asset/livechat/index.html' }
                  } //'file:///android_asset/livechat/index.html' }}
                  javaScriptEnabled={true}
                  injectedJavaScript={this.state.runFirst}
                />
              </KeyboardAvoidingView>
            )
          ) : null}
        </View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    flex: 1,
  },
});
export default HelpLiveChat;
