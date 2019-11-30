import {Platform, StyleSheet } from 'react-native';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';

export const portraitStyles = StyleSheet.create({
  container: {
    height: hp('10%'),
    width: wp('100%'),
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderBottomWidth: hp('0.05'),
    borderBottomColor: '#95979b',
  },
  photoContainer: {
    height: hp('6.25%'),
    width: hp('6.25%'),
    borderRadius: hp('6.25%')/2,
    marginHorizontal: wp('3.9%'),
  },
  personalInfoContainer: {
    width: wp('57%'),
    height: '100%',
    justifyContent: 'center',
  },
  name: {
    fontSize: wp('3.6%'),
    fontWeight: '700',
    color: '#52565F',
    letterSpacing: wp('0.2%'),
  },
  cardNumber: {
    fontSize: wp('2.6%'),
    fontWeight: '400',
    color: '#888888',
    marginTop: hp('0.5%'),
    letterSpacing: wp('0.2%'),
  },
})