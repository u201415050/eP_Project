import {Platform, StyleSheet } from 'react-native';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';

export const stylesLandscape = StyleSheet.create({
  container: {
    height: '100%',
    width: '96%',
  },
  d3GraphicsContainer: {
    width: wp('59%'),
    height: hp('25.75%'),
  },
  datesContainer: {
    width:'96%', 
    justifyContent:'space-between', 
    flexDirection: 'row', 
    position:'absolute', 
    top: 0
  },
  datesTopAxis: {
    fontSize: hp('2.5%'),
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