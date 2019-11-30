import {Platform, StyleSheet } from 'react-native';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';

export const styles = StyleSheet.create({
  container: {
    height: hp('7.7%'),
    width: wp('62.5%'),
    flexDirection: 'row',
    backgroundColor:'#fff',
    shadowOffset: { width: 0, height: 3 },
                  shadowColor: 'grey',
                  shadowOpacity: 0.5,
                  shadowRadius: 10,
  }, 
  buttonContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: hp('0.4%'),
  },
  buttonTitle: {
    fontSize: hp('2.2%'),
    fontWeight: '700',
    color: '#52565F',
    letterSpacing: wp('0.1%'),
  },
})