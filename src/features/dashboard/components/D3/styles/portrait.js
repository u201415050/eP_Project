import { Platform, StyleSheet } from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { isTablet } from '../../../../cash_register/constants/isLandscape';

export const stylesPortrait = StyleSheet.create({
  container: {},
  d3GraphicsContainer: {
    width: wp('94.5%'),
    //height: hp('40%'),
  },
  datesTopAxis: {
    fontSize: isTablet ? hp('1.7%') : wp('2.75%'),
    fontWeight: '500',
    color: '#4B5461',
    opacity: 0.5,
  },
});
