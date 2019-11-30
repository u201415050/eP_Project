import {Platform, StyleSheet } from 'react-native';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';

export const styles = StyleSheet.create({
  container: {
    height: hp('6.25%'),
    width: wp('100%'),
    flexDirection: 'row',
    backgroundColor:'#fff',
  }, 
  buttonContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: hp('0.4%'),
  },
  buttonTitle: {
    fontSize: wp('3.1%'),
    fontWeight: '600',
    color: '#52565F',
    letterSpacing: wp('0.15%'),
  },
})