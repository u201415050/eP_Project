import React, { Component } from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import SettingButton from '../../components/setting_button/setting_button';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { isTablet } from '../../constants/isLandscape';
import { connect } from 'react-redux';
import colors from '../../styles/colors';
import Orientation from 'react-native-orientation-locker';
import Header from '../../components/header/header';

import { TextMontserrat } from 'components';
import ItemList from './ItemList/itemList';
import * as _ from 'lodash';
import { SettingsHelper } from './helpers/settings_helper';
//import mixpanel from '../../../../services/mixpanel';

class MyAccountNotifications extends Component {
  static navigationOptions = ({ navigation }) => ({
    header: (
      <Header isBack={true} label="NOTIFICATIONS" navigation={navigation} />
    ),
  });
  constructor(props) {
    super(props);
    //mixpanel.track('Account Notifications Screen');

    this.configsHandler = new SettingsHelper('Notification');
    this.configsHandler.on('update', value => {
      if (value) {
        this.configsHandler.unsuscribedAll = false;
      } else {
        this.configsHandler.unsuscribedAll = this.configsHandler.checkUnsuscribedAll();
      }
      this.setState({
        configs: this.configsHandler.configs,
        unsuscribedAll: this.configsHandler.unsuscribedAll,
      });
    });
    this.configsHandler.on('update_all', value => {
      this.setState({ unsuscribedAll: value });
    });
    this.configsHandler.on(
      'save',
      _.debounce(() => {
        this.configsHandler.save();
      }, 2000)
    );
    this.state.configs = this.configsHandler.configs;
    this.state.unsuscribedAll = this.configsHandler.unsuscribedAll;
  }
  state = {
    configs: [],
    unsuscribedAll: false,
  };

  UNSAFE_componentWillMount() {
    !isTablet ? Orientation.lockToPortrait() : Orientation.lockToLandscape();
  }

  render() {
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
          resizeMode="stretch"
          source={bgImage}
        />
        <View style={{ width: '100%', flex: 1, alignItems: 'center' }}>
          <TextMontserrat
            style={{
              color: '#174285',
              marginTop: hp('1.6%'),
              fontSize: isTablet ? hp('2.95%') : hp('2.4%'),
              fontWeight: '600',
            }}
          >
            Notifications
          </TextMontserrat>
          <TextMontserrat
            style={{
              color: '#52565F',
              opacity: 0.9,
              marginTop: hp('0.1%'),
              fontSize: isTablet ? hp('2.25%') : hp('1.7%'),
              fontWeight: '600',
            }}
          >
            Receive Notifications
          </TextMontserrat>
          {this.state.configs.map((button, i) => (
            <ItemList
              key={'key_' + i}
              title={button.title}
              list={button.list}
            />
          ))}
          <View
            style={{
              flex: 1,
              width: '100%',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <SettingButton
              onPress={() => {}}
              backgroundImage={bgImage}
              noIcon={true}
              type={'toggle'}
              size={45}
              title={'Unsubscribe from all'}
              checked={this.state.unsuscribedAll}
              toggle={() => {
                this.configsHandler.updateAll(!this.state.unsuscribedAll);
              }}
            />
          </View>
        </View>
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
  config: state.cashData.notificationConfig,
});
export default connect(mapStateToProps)(MyAccountNotifications);
