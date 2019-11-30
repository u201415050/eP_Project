import { Platform, StyleSheet } from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import DeviceInfo from 'react-native-device-info'
export const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  cardContainer: {
    height: hp('30%'),
    width: wp('100%'),

     //addingHorizontal: wp('6%'),
  },
  cardView: {
    height: hp('30%'),
    width: wp('100%'), 
    paddingHorizontal: DeviceInfo.getModel().toUpperCase().indexOf('X')!=-1? hp('4.5%'):hp('5.5%'),
    paddingVertical: DeviceInfo.getModel().toUpperCase().indexOf('X')!=-1? 0:hp('1%'),
  },
  cardImage: {
    height: hp('30%'), 
    width: wp('95%'), 
    position:'absolute',
    alignSelf: 'center',
  },
  cardFirstRow: {
    flexDirection: 'row',
    paddingTop:hp('1%'),
    flex: 1.2,
  },
  cardSecondRow: {
    flex: 0.75,
    paddingBottom: hp('2.25%'),
    paddingTop: hp('1.5%')


  },
  cardThirdRow: {
    flexDirection: 'row',
    flex: 1.05,
  },
  photoSpace: { flex: 0.8, justifyContent: 'center', paddingTop: hp('1.5%') },
  nameSpace: { flex: 2.2, justifyContent: 'center', paddingTop: hp('1.8%'), paddingLeft:hp('1.7%') },
  sinceSpace: { flex: 1, justifyContent: 'center', paddingTop: hp('1.8%') },
  photoContainer: {
    height: hp('7.3%'),
    width: hp('7.3%'),
    borderRadius: hp('3.75%'), 
    overflow: 'hidden',
  },
  editContainer: {
    height: hp('3%'),
    width: hp('3%'),
    position: 'absolute',
    bottom: 0,
    left: 0,
  },
  nameLabel: {
    fontSize: wp('3%'),
    fontWeight: '600',
    paddingBottom: 5,
    color: '#fff',
  },
  nameText: {
    fontSize: wp('3.6%'),
    fontWeight: '700',
    color: '#fff',
    // marginTop: hp('0.75%'),
  },
  sinceLabel: {
    fontSize: wp('3%'),
    fontWeight: '600',
    color: '#D59A66',
  },
  sinceText: {
    fontSize: wp('3.6%'),
    fontWeight: '700',
    color: '#D59A66',
    marginTop: hp('0.75%'),
  },
  cardNumber: {
    fontSize: wp('6.1%'),
    fontWeight: '600',
    color: '#fff',
    letterSpacing: wp('0.75%'),
    marginTop: hp('0.75%'),
  },
  loyaltyLabel: {
    fontSize: wp('3%'),
    fontWeight: '600',
    color: '#F8E71C',
  },
  loyaltyText: {
    fontSize: wp('3.6%'),
    fontWeight: '700',
    color: '#F8E71C',
    marginTop: hp('0.75%'),
  },
  pointsLabel: {
    fontSize: wp('3%'),
    fontWeight: '600',
    color: '#4CD964',
  },
  pointsText: {
    fontSize: wp('3.6%'),
    fontWeight: '700',
    color: '#4CD964',
    marginTop: hp('0.75%'),
  },
  expiryLabel: {
    fontSize: wp('3%'),
    fontWeight: '600',
    color: '#FF2D55',
  },
  expiryText: {
    fontSize: wp('3.6%'),
    fontWeight: '700',
    color: '#FF2D55',
    marginTop: hp('0.75%'),
  },
});
