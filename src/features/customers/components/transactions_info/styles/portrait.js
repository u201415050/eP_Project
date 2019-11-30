import {Platform, StyleSheet } from 'react-native';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';

export const portraitStyles = StyleSheet.create({
  noConnectionLabel: {
    color: '#52565F', 
    fontSize: wp('4.8%'), 
    fontWeight: '600'
  },
})