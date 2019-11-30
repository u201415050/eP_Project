import { StyleSheet } from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
export const style = StyleSheet.create({
  container: {
    width: wp('80%'),
  },
  footer: {
    backgroundColor: '#ffffff',
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
    width: '100%',
    height: hp('10%'),
  },
  buttonsContainer: {
    flexDirection: 'row',
    marginBottom: hp('3%'),
    marginRight: wp('3%'),
  },
  button: {
    fontSize: wp('4%'),
    color: '#174285',
    fontWeight: '600',
    marginRight: wp('3%'),
  },
});
export const styleLandscape = StyleSheet.create({
  container: {
    width: wp('40%'),
  },
  footer: {
    backgroundColor: '#ffffff',
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
    width: '100%',
    height: hp('10%'),
  },
  buttonsContainer: {
    flexDirection: 'row',
    marginBottom: hp('2%'),
    marginRight: wp('1%'),
  },
  button: {
    fontSize: hp('3.4%'),
    color: '#174285',
    fontWeight: '600',
    marginRight: wp('1%'),
  },
});
