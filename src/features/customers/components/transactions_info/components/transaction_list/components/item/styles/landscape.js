import {Platform, StyleSheet } from 'react-native';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';

export const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    width: '95.6%',
    height:hp('10%'),
    backgroundColor: '#fff',
    elevation: 2,
    borderRadius: 3,
    paddingLeft: wp('2.2%'),
    paddingRight: wp('2.2%'),
    marginBottom: hp('1.25%'),
    shadowOffset: { width: 2, height: 2 },
    shadowColor: 'grey',
    shadowOpacity: 0.5,
    shadowRadius: 5,
  },
  image: {
    width:hp('6.5%'),
    height:hp('6.5%')
  },
  containerPayment: {
   flex:1,
    height: '100%',
    marginLeft: wp('1.5%'),
    justifyContent: 'center',
  },
  paymentLabel: {
    color:'#52565F',
    fontWeight:'900', 
    fontSize: hp('2.3%'),
    marginBottom: hp('0.6%'),
  },
  invoiceLabel: {
    color:'#888888',
    fontWeight:'600', 
    fontSize: hp('1.6%'),
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
    fontSize: hp('2.3%'),
    marginBottom: hp('0.6%'),
  },
  dateLabel: {
    color:'#888888',
    fontWeight:'600', 
    fontSize: hp('1.6%'),
  },
});