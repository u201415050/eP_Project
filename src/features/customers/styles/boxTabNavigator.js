import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

export const shadowTabNavigatorStyles = {
  landscape: {
    width: wp('62.5%'),
    height: hp('7.7%'),
    color: '#000',
    border: hp('1%'),
    opacity: 0.3,
    x: 0,
    y: 0,
  }
} 