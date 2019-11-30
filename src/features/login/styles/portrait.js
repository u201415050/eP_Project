import { Platform, StyleSheet } from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { Colors } from 'api';

export const portraitStyles = StyleSheet.create({
  logoContainer: {
    height: hp('24.2%'),
    width: '100%',
    justifyContent: 'flex-end',
    marginBottom: hp('4.6%'),
  },
  cardContainer: {
    alignItems: 'center',
  },
  card: {
    width: wp('86.6%'),
    height: hp('27.8%'),
    backgroundColor: 'white',
    borderRadius: hp('2%'),
    paddingHorizontal: wp('8.8%'),
    paddingTop: hp('3%'),
    elevation: 10,
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowRadius: 5,
    shadowOpacity: 1.0,
  },
  loginFingerprintText: {
    fontWeight: '700',
    color: Colors.primary,
    textAlign: 'center',
    fontSize: wp('3.5%'),
  },
  forgotPasswordText: {
    fontWeight: '700',
    color: Colors.primary,
    textAlign: 'center',
    fontSize: wp('3.5%'),
    marginTop: hp('2.1%'),
  },
  buttonSignIn: {
    width: wp('86.6%'),
    height: hp('7.5%'),
    marginTop: hp('2.3%'),
    borderRadius: hp('20%'),
    justifyContent: 'center',
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowOffset: { width: 1, height: 2 },
        shadowColor: 'black',
        shadowOpacity: 0.5,
      },
      android: {
        elevation: hp('0.4%'),
      },
    }),
  },
  textSignIn: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: hp('1.8%'),
    letterSpacing: 1.33,
  },
  buttonCreateAccount: {
    width: wp('86.6%'),
    height: hp('7.5%'),
    borderWidth: hp('0.15%'),
    borderRadius: hp('20%'),
    borderColor: '#979797',
  },
  textCreateAccount: {
    color: '#164486',
    fontWeight: 'bold',
    fontSize: hp('1.8%'),
    letterSpacing: 1.33,
  },
  containerCreateAccount: {
    alignItems: 'center',
    justifyContent: 'flex-end',
    height: hp('29.5%'),
    paddingBottom: hp('9%'),
  },
});
