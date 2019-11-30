import { Platform, StyleSheet } from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

export const landscapeStyles = StyleSheet.create({
  container: {
    height: hp('8.1%'),
    width: wp('33.5%'),
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderBottomWidth: hp('0.05'),
    borderBottomColor: '#95979b',
  },
  photoContainer: {
    height: hp('5.5%'),
    width: hp('5.5%'),
    borderRadius: hp('2.75%'),
    marginHorizontal: wp('1.45%'),
  },
  personalInfoContainer: {
    width: wp('20%'),
    height: '100%',
    justifyContent: 'center',
  },
  name: {
    fontSize: hp('2.4%'),
    fontWeight: '700',
    color: '#52565F',
    letterSpacing: wp('0.05%'),
  },
  cardNumber: {
    fontSize: hp('1.6%'),
    fontWeight: '400',
    color: '#888888',
    marginTop: hp('0.5%'),
    letterSpacing: wp('0.05%'),
  },
});
