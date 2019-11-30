import {Platform, StyleSheet } from 'react-native';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';

export const styles = StyleSheet.create({
  container: {
    height: hp('78.5%'),
    width: '100%',
    alignItems: 'center',
  },
  card: {
    height: hp('77.5%'),
    width: wp('56%'),
    padding: 0,
    paddingTop: hp('0%'),
    paddingBottom: hp('3%'),
    paddingHorizontal: wp('2.5%'),
  },
})