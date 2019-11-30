import {Platform, StyleSheet } from 'react-native';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';

export const landscapeStyles = StyleSheet.create({
  container: {
    width: wp('8%'),
    height: '100%',
    justifyContent:'center',
  },
  pointsNumber: {
    fontSize: hp('2.4%'),
    fontWeight: '700',
    color: '#52565F',
    width: '100%',
    textAlign: 'center',
    letterSpacing: wp('0.05%'),
  },
  label: {
    fontSize: hp('1.6%'),
    fontWeight: '400',
    color: '#888888',
    width: '100%',
    textAlign: 'center',
    marginTop: hp('0.5%'),
    letterSpacing: wp('0.05%'),
  },
})