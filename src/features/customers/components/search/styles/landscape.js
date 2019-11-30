import {Platform, StyleSheet } from 'react-native';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';

export const styles = StyleSheet.create({
  container: {
    height: hp('6.3%'),
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    marginBottom: hp('0.8%'),
    elevation:4
  },
  iconSize: {
    width: hp('2.5%'), 
    height: hp('2.5%'),
    marginLeft: wp('1.5%'),
    marginRight: wp('1%'),
  },
  iconLeft: {
    marginLeft: wp('1.5%'),
  },
  input: {
    width: '80%',
    height: '100%',
    paddingBottom: hp('0.85%'),
    fontFamily: 'Montserrat-SemiBold',
    fontSize: hp('2.5%'),
    letterSpacing:wp('0.05%'),
    color: '#174285'
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