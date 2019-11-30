import DeviceInfo from 'react-native-device-info';
import Colors from './colors';
import Icons from './icons';
import { Platform, Dimensions } from 'react-native';
import {
  formatNumberCommasDecimal,
  toTimestamp,
  toTimestampFromPicker,
  timeStampToDate,
  formatDate,
} from './functions';
import * as _ from 'lodash';
const isPhone =
  Platform.OS === 'ios'
    ? Platform.interfaceIdiom == 'phone'
    : !DeviceInfo.isTablet();

const isPortrait = (() => {
  const dim = Dimensions.get('window');
  if (dim.height >= dim.width) {
    return true;
  } else {
    return false;
  }
})();
const cancelPendingTransactions = payment => {
  const transactions = payment.transactions;
  if (transactions) {
    transactions
      .filter(tx => {
        const status = _.get(tx, 'process.response.transactionStatusId', null);
        if (status !== null && status !== 2 && status !== 5 && status !== 6) {
          return true;
        }
        return false;
      })
      .forEach(tx => {
        const transactionId = _.get(tx, 'process.response.transactionId', null);
        // alert(transactionId + ' Cancelled');
        if (transactionId) {
          payment.cancelTransaction(transactionId);
        }
      });
  }
};
const cleanStr = char => {
  const newChar = char.split('').map(x => {
    return x.charCodeAt() >= 32 && x.charCodeAt() <= 126 ? x : null;
  });
  return newChar.join('');
};
export {
  Colors,
  Icons,
  formatNumberCommasDecimal,
  toTimestamp,
  toTimestampFromPicker,
  timeStampToDate,
  formatDate,
  isPhone,
  isPortrait,
  cancelPendingTransactions,
  cleanStr,
};
