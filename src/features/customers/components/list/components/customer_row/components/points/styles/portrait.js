import {Platform, StyleSheet } from 'react-native';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';

export const portraitStyles = StyleSheet.create({
  container: {
    width: wp('20%'),
    height: '100%',
    justifyContent:'center'
  },
  pointsNumber: {
    fontSize: wp('3.6%'),
    fontWeight: '700',
    color: '#52565F',
    width: '100%',
    textAlign: 'center',
    letterSpacing: wp('0.2%'),
  },
  label: {
    fontSize: wp('2.6%'),
    fontWeight: '400',
    color: '#888888',
    width: '100%',
    textAlign: 'center',
    marginTop: hp('0.5%'),
    letterSpacing: wp('0.2%'),
  },
})