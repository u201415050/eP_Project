import {Platform, StyleSheet } from 'react-native';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';

export const styles = StyleSheet.create({
  container: {
    justifyContent: 'center', 
    alignItems: 'center', 
    height: hp('44.5%'), 
    width: '100%',
  },
  cardContainer: {
    height: hp('41%'),
    width: wp('94.5%'),
    padding: 0,
    borderRadius: 5,
    elevation: 3,
  },
  calendarContainer: {
    height: hp('6.25%'),
    width: '100%', 
    flexDirection:'row', 
    alignItems: 'center', 
    paddingLeft: wp('5.55%'),
  },
  calendarIcon: {
    width: wp('5.3%'),
    height: hp('3.15%'),
  },
  arrowDownSize: {
    height: wp('4%'),
  },
  graphicContainer: {
    flex: 1,  
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageWarning: {
    height: hp('15%'),
    width: hp('15%'),
  },
  dates: {
    fontSize: wp('3.1%'),
    fontWeight: '700',
    color: '#174285',
    marginLeft: wp('3.9%'),
    marginRight: wp('1.5%'),
  },
  chartImage: {
    width: '100%',
    height: '100%'
  },
  totalContainer: {
    height: hp('9%'),
    width:'100%', 
    flexDirection: 'row',
    justifyContent: 'center', 
    alignItems: 'center', 
  },
  arrowTotal: {
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: wp('1.35%'),
  },
  arrowTotalSize: {
    height: wp('4%'),
  },
  arrowSidesSize: {
    height: wp('8%'),
  },
  arrowLeftTouch: {
    position: 'absolute',
    left: 0,
  },
  arrowRightTouch: {
    position: 'absolute',
    right: 0,
  },
  arrowLeft: {
    color: '#174285'
  },
  arrowRight: {
    color: '#174285'
  },
  totalLabel: {
    fontSize: wp('3%'),
    fontWeight: '500',
    color: '#3E4A59',
  },
  totalText: {
    fontSize: wp('4.65%'),
    fontWeight: '600',
    color: '#24272B',
  },
  noDataLabel: {
    color: '#6B6B6B', 
    fontSize: wp('5%'), 
    fontWeight: '500'
  },
})