import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

export const shadowStyles = {
  landscape: {
    width: wp('37.5%'),
    height: hp('90%'),
    color: '#000',
    border: wp('1%'),
    opacity: 0.325,
    x: 0,
    y: wp('0.4%'),
  }
} 
