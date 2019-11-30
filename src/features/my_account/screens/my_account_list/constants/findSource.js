import React, { Component } from 'react';
import { View, Image, StyleSheet } from 'react-native';
import * as screen_names from '../../../../../navigation/screen_names';
import { getLocalSettingRow, updateSetting } from '../../../../../services/settings_service';
import { getTable } from '../../../../../services/realm_service';
import DeviceIcon from '../../../components/icons/device_icon/device_icon';
import HardwareIcon from '../../../components/icons/hardware_icon/hardware_icon';
import PaymentsIcon from '../../../components/icons/payments_icon/payments_icon';
import TransactionsIcon from '../../../components/icons/transactions_icon/transactions_icon';

export function filtrate(val){
  const ICONS = {
    EnableSound: require('../../../assets/img/sound.png'),
    EnableCamera: require('../../../assets/img/camera.png'),
    EnableFingerprint: require('../../../assets/img/fingerprint.png'),
  };
  let settingsDevice = getTable('Settings')
        .filtered('name CONTAINS[c] "device"')
        .map(item => item)[0];
  let settingsTransaction = getTable('Settings')
        .filtered('name CONTAINS[c] "transaction"')
        .map(item => item)[0];
  const constants = {
    ROUND_OFF: 'RoundOff',
    OFFLINE_TRASACTIONS: 'OfflineTransactions',
    SEND_OTP_ON_REFUND: 'SendOTPonRefund',
  };
  const values = [
    { label: 'Enable Offline Transactions' },
    { label: 'Enable Round-off' },
    {label:'Send OTP on Refund'}
  ];
  const activeOptionsIndex = {};
  let transaction_settings = JSON.parse(settingsTransaction.value).map((option, index) => {
          
            toggle= () => {
              transaction_settings[index].value = !transaction_settings[index]
                .value;
                if(option.settingParamName=='OfflineTransactions') element[7].value=transaction_settings[index].value
                if(option.settingParamName=='RoundOff') element[8].value=transaction_settings[index].value
                if(option.settingParamName=='SendOTPonRefund') element[9].value=transaction_settings[index].value
                // console.log(option)
                updateSetting(
                  () => {
                    settingsTransaction.value = JSON.stringify(transaction_settings);
                  },
                  {
                    setting: settingsTransaction.name,
                    [option.settingParamName]: `${
                      transaction_settings[index].value ? 1 : 0
                    }`,
                  }
                );
              
            }
              
          const value =
            option.value === 'True' || option.value === '1' || option.value === true
              ? true
              : false;
              //console.log(option)
              //console.log(values[index])
          return { ...option, toggle,value };
          
        });
let device_settings = JSON.parse(settingsDevice.value).map((item, i) => {
  return {
    ...item,
    active: item.settingParamActive == 'No' ? true : false,
    value: Boolean(+item.value),
    toggle: () => {
        device_settings[i].value = !device_settings[i].value;
        if(item.settingParamName=='EnableSound') element[0].value=device_settings[i].value
        if(item.settingParamName=='EnableCamera') element[1].value=device_settings[i].value
        if(item.settingParamName=='EnableFingerprint') element[3].value=device_settings[i].value
        //if()element[0].label== device_settings[i].value
        //if(item.settingParamName==) device_settings[i].value
        updateSetting(
          () => {
            settingsDevice.value = JSON.stringify(device_settings);
          },
          {
            setting: settingsDevice.name,
            [item.settingParamName]: `${
              device_settings[i].value ? 1 : 0
            }`,
          }
        );
    },
    type:'toggle',
    renderIcon:ICONS[item.settingParamName],
    par:'device',
    label: item.settingParamName.split(/(?=[A-Z])/).join(' '),
  };})
  let tran1=transaction_settings[0]
  tran1.label=values[0].label
  tran1.type='toggle'
  tran1.par='transaction'
  tran1.noIcon=true
  let tran2=transaction_settings[1]
  tran2.label=values[1].label
  tran2.type='toggle'
  tran2.par='transaction'
  tran2.noIcon=true
  //let tran3=transaction_settings[24]
  //tran3.label=values[2].label
  //tran3.type='toggle'
  //tran3.par='transaction'
  //tran3.noIcon=true
  //console.log(tran3)
  let element=[
    ...device_settings,
    {
      type:'touchable',
      renderIcon:require('../../../assets/img/printer.png'),
      label: 'Printers',
      screen: screen_names.SETTINGS_PRINTER,
      noGet:true
    },
    {
      type:'touchable',
      renderIcon:require('../../../assets/img/card.png'),
      label: 'Card Readers',
      screen: screen_names.SETTINGS_CARDREADER,
      noGet:true
    },
    {
      type:'touchable',
      renderIcon:require('../../../assets/img/cash.png'),
      label: 'Cash Drawers',
      screen: screen_names.SETTINGS_CASHDRAWER,
      noGet:true
    },
    tran1,
    tran2,
    //tran3,
    {
      type:'touchable',
      renderIcon:()=><DeviceIcon/>,
      component:true,
      label: 'Device',
      screen: screen_names.SETTINGS_DEVICE,
      noGet:true
    },
    {
      type:'touchable',
      renderIcon:()=><HardwareIcon/>,
      component:true,
      label: 'Hardware',
      screen: screen_names.SETTINGS_HARDWARE,
      noGet:true
    },
    {
      type:'touchable',
      renderIcon:()=><PaymentsIcon/>,
      component:true,
      label: 'Payment Options',
      screen: screen_names.SETTINGS_PAYMENTS,
      noGet:true
    },
    {
      type:'touchable',
      renderIcon:()=><TransactionsIcon/>,
      component:true,
      label: 'Transactions',
      screen: screen_names.SETTINGS_TRANSACTIONS,
      noGet:true
    }
  ];

  return element.filter(item=>item.label.toLowerCase().search(val.toLowerCase())!=-1)
}