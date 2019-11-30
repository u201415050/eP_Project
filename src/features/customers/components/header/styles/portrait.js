import { Platform, StyleSheet } from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

export const styles = StyleSheet.create({
  container: {
    height: hp('10%'),
    width: wp('100%'),
    backgroundColor: '#174285',
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    elevation:6
  },
  labelCentral: {
    color: '#fff',
    fontSize: wp('4.2%'),
    letterSpacing: hp('0.1%'),
    textAlign: 'center',
    fontFamily: 'Montserrat-Bold',
  },
  iconSize: {
    width: wp('5.2%'),
    height: wp('5.2%'),
  },
  iconSizeBack: {
    width: wp('4.5%'),
    height: wp('4.5%'),
  },
  iconLeft: {
    marginLeft: wp('2.5%'),
    height: '85%', 
    width: wp('9.2%'), 
    justifyContent: 'center', 
    alignItems: 'center',
  },
  iconRight: {
    marginRight: wp('2.5%'),
    height: '85%', 
    width: wp('9.2%'), 
    justifyContent: 'center', 
    alignItems: 'center',
  },
});

export const Shadows = {
  width: wp('100%'),
  height: hp('10%'),
  color: '#000',
  border: hp('0.8%'),
  opacity: 0.3,
  x: 0,
  y: hp('0.15%'),
};
