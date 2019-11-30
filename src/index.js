import { Provider } from 'react-redux';
import React, { Component } from 'react';
import store from './myStore';
import AppNavigator from './navigation/navigators';
import NavigationService from './services/navigation';
import AlertService from './services/alert_service';
import AlertDoubleService from './services/alert_double_service';
import LoadingService from './services/loading_service';
import { Alert, Loading } from 'components';
import { EventEmitter } from 'events';
import notifications_service from './services/notifications_service';
import { AsyncStorage, Platform, PermissionsAndroid } from 'react-native';
import OneSignal from 'react-native-onesignal';
import AlertDoubleButtons from './components_general/popups/AlertDoubleButtons';
import AlertDouble from './services/alert_double_class';
//import Mixpanel from './services/mixpanel';
import DeviceInfo from 'react-native-device-info';
import DeviceIMEI from 'react-native-imei';
//import winston from 'winston';
class AlertMsg extends EventEmitter {
  constructor() {
    super();
    this.visible = false;
    this.message = '';
  }
  setButtonAction(action) {
    this.action = action;
  }
  onPress() {
    this.action();
    this.hide();
  }
  show(msg, action, buttonTitle, messageTitle, closeIcon) {
    this.message = msg;
    this.visible = true;
    this.action = action;
    this.buttonTitle = buttonTitle;
    this.messageTitle = messageTitle;
    this.closeIcon = closeIcon;
    this.emit('STATUS_CHANGED', true);
  }
  hide() {
    this.visible = false;
    this.emit('STATUS_CHANGED', false);
  }
}

class LoadingMsg extends EventEmitter {
  show() {
    this.emit('STATUS_CHANGED', true);
  }
  hide() {
    this.emit('STATUS_CHANGED', false);
  }
}
export default class Root extends Component {
  constructor(props) {
    super(props);

    if (Platform.OS === 'android') {
      // eslint-disable-next-line no-undef
      if (__DEV__) {
        OneSignal.inFocusDisplaying(1);
        console.log(OneSignal.getTags());
      } else {
        OneSignal.inFocusDisplaying(0);
      }

      OneSignal.init('1dcbf889-6856-45ed-a76a-a15081952d12'); //--> Epaisa
    }
    //Mixpanel.init('23b10b45aee631b6199f11531f6b9778');
    this.alert = new AlertMsg();
    this.alert.setButtonAction(() => this.setState({ alert_visible: false }));

    this.alert.on('STATUS_CHANGED', visible => {
      this.setState({ alert_visible: visible });
    });

    AlertService.setTopLevelAlert(this.alert);
    // DOUBLE ALERT SET UP
    this.alert_double = new AlertDouble();
    AlertDoubleService.setTopLevelAlertDouble(this.alert_double);
    this.alert_double.on('STATUS_CHANGED', double_alert => {
      this.setState({ double_alert });
    });

    this.loading = new LoadingMsg();
    this.loading.on('STATUS_CHANGED', loading => {
      this.setState({ loading });
    });
    LoadingService.setTopLevelLoading(this.loading);
    if (Platform.OS === 'android') {
      AsyncStorage.getItem('@CURRENT_USER_ID').then(id => {
        notifications_service.init(+id);
      });
    }
  }
  state = {
    alert_visible: false,
    double_alert: false,
  };

  render() {
    return (
      <Provider store={store}>
        <AppNavigator
          onNavigationStateChange={(prev, next, action) => {
            NavigationService.setNavigationState(prev, next, action);
            NavigationService.history.navigationListener(action);
          }}
          ref={navigatorRef => {
            NavigationService.setTopLevelNavigator(navigatorRef);
          }}
        />
        {this.state.alert_visible && (
          <Alert
            textSize={1.4}
            fontWeight="600"
            message={[this.alert.message]}
            buttonTitle={this.alert.buttonTitle}
            closeIcon={this.alert.closeIcon}
            messageTitle={this.alert.messageTitle}
            onPress={() => {
              this.alert.onPress();
            }}
            onPressCloseButton={() => this.alert.hide()}
          />
        )}
        <AlertDoubleButtons
          positiveAction={this.alert_double.positiveAction.bind(
            this.alert_double
          )}
          negativeAction={this.alert_double.negativeAction.bind(
            this.alert_double
          )}
          visible={this.state.double_alert}
          message={this.alert_double.message}
          title={this.alert_double.title}
          titleCancel={this.alert_double.titleCancel}
          titleConfirm={this.alert_double.titleConfirm}
          close={this.alert_double.hide.bind(this.alert_double)}
        />
        {this.state.loading && <Loading />}
      </Provider>
    );
  }
}
