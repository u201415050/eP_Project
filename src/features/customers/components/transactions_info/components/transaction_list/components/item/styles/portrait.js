import {Platform, StyleSheet } from 'react-native';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';

export const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    width: wp('95.6%'),
    height:hp('10%'),
    backgroundColor: '#fff',
    elevation: 2,
    borderRadius: 3,
    borderColor: '#ddd',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.2,
      shadowRadius: 2,  
    paddingLeft: wp('5%'),
    paddingRight: wp('5%'),
    marginBottom: hp('1.25%'),
  },
  image: {
    width:hp('6.5%'),
    height:hp('6.5%')
  },
  containerPayment: {
    width: wp('32%'),
    height: '100%',
    marginLeft: wp('3.5%'),
    justifyContent: 'center',
  },
  paymentLabel: {
    color:'#52565F',
    fontWeight:'900', 
    fontSize: wp('3.6%'),
    marginBottom: hp('0.6%'),
  },
  invoiceLabel: {
    color:'#888888',
    fontWeight:'600', 
    fontSize: wp('2.65%'),
  },
  containerTotal: {
    height: '100%',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  totalLabel: {
    color:'#8FC742',
    fontWeight:'900', 
    fontSize: wp('3.6%'),
    marginBottom: hp('0.6%'),
  },
  dateLabel: {
    color:'#888888',
    fontWeight:'600', 
    fontSize: wp('2.65%'),
  },
});