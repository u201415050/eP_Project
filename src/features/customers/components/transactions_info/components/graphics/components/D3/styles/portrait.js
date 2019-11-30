import {Platform, StyleSheet } from 'react-native';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';

export const stylesPortrait = StyleSheet.create({
  container: {
    height: '100%',
    width: '94%',
  },
  d3GraphicsContainer: {
    width: wp('94.5%'),
    height: hp('25.75%'),
  },
  datesContainer: {
    width:'94%', 
    justifyContent:'space-between', 
    flexDirection: 'row', 
    position:'absolute', 
    top: 0
  },
  datesTopAxis: {
    fontSize: wp('2.75%'),
    fontWeight: '600',
    color: '#4B5461',
    opacity:0.5
  },
  cursor: {
    width: hp('2%'), 
    height: hp('2%'), 
    backgroundColor: '#174285',
    borderRadius: 30, 
    borderColor: '#FFF', 
    borderWidth: hp('0.3%'),
  },
})