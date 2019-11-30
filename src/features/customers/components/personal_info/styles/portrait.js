import {Platform, StyleSheet } from 'react-native';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';

export const styles = StyleSheet.create({
  container: {
    height: hp('87.5%'),
    width: '100%',
    paddingTop: hp('1%'),
  }, 
})