import {Platform, StyleSheet } from 'react-native';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';

export const styles = StyleSheet.create({
  container: {
    height: hp('7.8%'),
    width: wp('100%'),
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    elevation:4
  },
  iconSize: {
    width: wp('6%'), 
    height: wp('6%'),
    marginLeft: wp('3.75%'),
    marginRight: wp('1%'),
  },
  iconLeft: {
    marginLeft: wp('4%'),
  },
  input: {
    width: '80%',
    height: '100%',
    paddingBottom: hp('0.85%'),
    fontFamily: 'Montserrat-SemiBold',
    fontSize: wp('3.9%'),
    letterSpacing:wp('0.1%'),
    color: '#174285',
    fontWeight: 'normal',
  },
})

export const Shadows = {
  width: wp('100%'),
  height: hp('8.5%'),
  color: '#000',
  border: hp('0.8%'),
  opacity: 0.05,
  x: 0,
  y: hp('0.2%'),
}