import * as screen_names from '../../../../../navigation/screen_names';
import DeviceIcon from '../../../components/icons/device_icon/device_icon';
import HardwareIcon from '../../../components/icons/hardware_icon/hardware_icon';
import PaymentsIcon from '../../../components/icons/payments_icon/payments_icon';
import TransactionsIcon from '../../../components/icons/transactions_icon/transactions_icon';
import Settings from '../../../../../services/realm_models/settings';

const getTransactionSettings = () => {
  const transaction_setting = Settings.getSettingCategory('Transaction');
  const values = [
    {
      label: 'Enable Offline Transactions',
      settingParamName: 'OfflineTransactions',
    },
    {
      label: 'Enable Round-off',
      settingParamName: 'RoundOff',
    },
    {
      label: 'Send OTP on Refund',
      settingParamName: 'SendOTPonRefund',
    },
  ];
  return values.map(setting => {
    const value = transaction_setting.get(setting.settingParamName);
    const toggle = () => {
      transaction_setting.updateValue(setting.settingParamName, !value);
    };
    return {
      ...setting,
      value: value,
      toggle,
      type: 'toggle',
      noIcon: true,
    };
  });
};
const getDeviceSettings = () => {
  const device_setting = Settings.getSettingCategory('device');
  const values = [
    {
      label: 'Enable Sound',
      settingParamName: 'EnableSound',
      renderIcon: require('../../../assets/img/sound.png'),
    },
    {
      label: 'Enable Camera',
      settingParamName: 'EnableCamera',
      renderIcon: require('../../../assets/img/camera.png'),
    },
    {
      label: 'Enable Fingerprint',
      settingParamName: 'EnableFingerprint',
      renderIcon: require('../../../assets/img/fingerprint.png'),
    },
  ];
  return values.map(setting => {
    const value = device_setting.get(setting.settingParamName);
    const toggle = () => {
      device_setting.updateValue(setting.settingParamName, !value);
    };
    return {
      ...setting,
      value: value,
      toggle,
      type: 'toggle',
    };
  });
};
export function filtrate(val) {
  let element = [
    {
      type: 'touchable',
      renderIcon: require('../../../assets/img/printer.png'),
      label: 'Printers',
      screen: screen_names.SETTINGS_PRINTER,
    },
    {
      type: 'touchable',
      renderIcon: require('../../../assets/img/card.png'),
      label: 'Card Readers',
      screen: screen_names.SETTINGS_CARDREADER,
    },
    {
      type: 'touchable',
      renderIcon: require('../../../assets/img/cash.png'),
      label: 'Cash Drawers',
      screen: screen_names.SETTINGS_CASHDRAWER,
    },
    {
      type: 'touchable',
      renderIcon: DeviceIcon,
      component: true,
      label: 'Device',
      screen: screen_names.SETTINGS_DEVICE,
    },
    {
      type: 'touchable',
      renderIcon: HardwareIcon,
      component: true,
      label: 'Hardware',
      screen: screen_names.SETTINGS_HARDWARE,
    },
    {
      type: 'touchable',
      renderIcon: PaymentsIcon,
      component: true,
      label: 'Payment Options',
      screen: screen_names.SETTINGS_PAYMENTS,
    },
    {
      type: 'touchable',
      renderIcon: TransactionsIcon,
      component: true,
      label: 'Transactions',
      screen: screen_names.SETTINGS_TRANSACTIONS,
    },
    ...getDeviceSettings(),
    ...getTransactionSettings(),
  ];

  return element.filter(
    item => item.label.toLowerCase().search(val.toString().toLowerCase()) != -1
  );
}
