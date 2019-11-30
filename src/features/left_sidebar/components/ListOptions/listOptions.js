import React, { Component } from 'react';
import { View } from 'react-native';
import * as screen_names from 'navigation/screen_names';
import EStyleSheet from 'react-native-extended-stylesheet';
import Option from './Option/option';
import DeviceInfo from 'react-native-device-info';
import notifications_service from '../../../../services/notifications_service';

export default class ListOptions extends Component {
  state = {
    listOptions: this.listOptions,
  };

  componentDidMount() {
    this.setState({ listOptions: this.listOptions });

    notifications_service.on('update_notifications', this.onNewNotification);
    notifications_service.update();
  }

  componentWillUnmount() {
    notifications_service.removeListener(
      'update_notifications',
      this.onNewNotification
    );
  }
  onNewNotification(res) {
    this.listOptions[2].notifications = res.total;
    this.setState({ listOptions: this.listOptions });
  }
  listOptions = [
    {
      label: 'Cash Register',
      icon: require('../../assets/icons/cash.png'),
      size: 'large',
      navigate: screen_names.CASH_REGISTER,
    },
    {
      label: 'Customers',
      icon: '',
      size: 'default',
      navigate: screen_names.CUSTOMER_LIST,
    },
    // {
    //   label: 'Notifications',
    //   icon: require('../../assets/icons/notification.png'),
    //   size: 'large',
    //   navigate: screen_names.NOTIFICATIONS_HOME,
    //   notifications: 0,
    // },
    {
      label: 'Transactions',
      icon: require('../../assets/icons/transactions.png'),
      size: 'medium',
      navigate: screen_names.TRANSACTIONS_HISTORY,
    },
    {
      label: 'Settings',
      icon: require('../../assets/img/Settings.png'),
      size: 'default',
      navigate: screen_names.SETTINGS_LIST,
    },
    {
      label: 'My Account',
      icon: require('../../assets/icons/myaccount.png'),
      size: 'medium',
      navigate: screen_names.MY_ACCOUNT_LIST,
    },
    {
      label: `Help - v${DeviceInfo.getVersion()}`,
      icon: require('../../assets/icons/help.png'),
      size: 'medium',
      navigate: screen_names.HELP_HOME,
    },
  ];

  render() {
    const { sideOption } = this.props;

    return (
      <View style={styles.container}>
        {this.state.listOptions &&
          this.state.listOptions.map((item, i) => {
            return (
              <Option
                notifications={item.notifications}
                data={item}
                key={i}
                size={item.size}
                index={i}
                label={item.label}
                closeDrawer={this.props.closeDrawer}
                active={i == sideOption}
                icon={item.icon}
              />
            );
          })}
      </View>
    );
  }
}

const styles = EStyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
  },
});
