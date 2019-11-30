import React, { Component, Fragment } from 'react';
import { StyleSheet, Dimensions, View, WebView, NetInfo } from 'react-native';
import { SafeAreaView, TextMontserrat } from 'components';
import Header from '../../../customers/components/header';
import { isTablet } from '../../../cash_register/constants/isLandscape';
import colors from '../../../my_account/styles/colors';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';

const isPortrait = () => {
  const dim = Dimensions.get('window');
  if (dim.height >= dim.width) {
    return true;
  } else {
    return false;
  }
};

class HelpSupport extends Component {
  static navigationOptions = {
    header: null,
  };
  async componentDidMount() {
    const isConnected = await NetInfo.isConnected.fetch();

    this.setState({ online: isConnected });
  }
  state = {
    orientation: isPortrait(),
  };

  render() {
    return (
      <SafeAreaView
        disabled={isTablet}
        fullscreen={true}
        bottomColor={colors.darkWhite}
      >
        <View
          style={{
            height: '100%',
            width: '100%',
          }}
        >
          {isTablet ? null : (
            <Header
              label="SUPPORT"
              navigation={this.props.navigation}
              renderRightButton={false}
              back={true}
            />
          )}
          {!this.state.online ? (
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
                  textAlign: 'center',
                  fontSize: hp('5%'),
                  fontWeight: '900',
                  color: '#7F7F7F',
                }}
              >
                Please connect to
              </TextMontserrat>
              <TextMontserrat
                style={{
                  textAlign: 'center',
                  fontSize: hp('5%'),
                  fontWeight: '900',
                  color: '#7F7F7F',
                }}
              >
                Internet
              </TextMontserrat>
            </View>
          ) : (
            <WebView
              style={{ width: '100%' }}
              originWhitelist={['*']}
              source={{ uri: 'https://support.epaisa.com/hc/en-us' }}
            />
          )}
        </View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({});
export default HelpSupport;
