import moment from 'moment';
import { Dimensions } from 'react-native';

const isPortrait = () => {
  const dim = Dimensions.get('window');
  if (dim.height >= dim.width) {
    return true;
  } else {
    return false;
  }
};

const orientation = () => {
  const dim = Dimensions.get('window');
  if (dim.height >= dim.width) {
    return 'portrait';
  } else {
    return 'landscape';
  }
}

const formatNumberCommasDecimal = nStr => {
  nStr += '';
  x = nStr.split('.');
  x1 = x[0];
  x2 = x.length > 1 ? '.' + x[1] : '';
  var rgx = /(\d+)(\d{3})/;
  while (rgx.test(x1)) {
    x1 = x1.replace(rgx, '$1' + ',' + '$2');
  }
  return x1 + x2;
};

const toTimestamp = (strDate, split) => {
  myDate = strDate.split(split);
  var newDate = +myDate[1] - 1 + '-' + myDate[0] + '-' + myDate[2];
  return Date.parse(newDate) / 1000;
};

const toTimestampFromPicker = strDate => {
  //yyyy-mm-dd
  myDate = strDate.split('-');
  // alert(JSON.stringify(myDate))
  var newDate = myDate[1] + '/' + myDate[2] + '/' + myDate[0]; //mm-dd-yyyy
  return Date.parse(newDate) / 1000;
};

const timeStampToDate = milliseconds => {
  return moment.unix(milliseconds).format('DD MMM. YYYY');
};

const formatDate = (strDate, split, join) => {
  return strDate
    .split(split)
    .reverse()
    .join(join);
};

export {
  formatNumberCommasDecimal,
  toTimestamp,
  toTimestampFromPicker,
  timeStampToDate,
  formatDate,
  isPortrait,
};
