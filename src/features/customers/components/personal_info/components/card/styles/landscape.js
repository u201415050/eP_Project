import {Platform, StyleSheet } from 'react-native';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';

export const styles = StyleSheet.create({
  container: {
    width: '100%',
  }, 
  cardContainer: {
    height: hp('42%'),
    width: wp('62.5%'),
    alignItems: 'center',
  },
  cardView: {
    height: hp('42%'),
    width: wp('50.5%'), 
    paddingHorizontal: hp('6%'),
  },
  cardImage: {
    height: hp('42%'), 
    width: wp('50.5%'), 
    position:'absolute',
  },
  cardFirstRow: {
    flexDirection: 'row', 
    flex: 1.2,
  },
  cardSecondRow: {
    flex: 0.8,
  },
  cardThirdRow: {
    flexDirection: 'row', 
    flex: 1,
  },
  photoSpace: {width: hp('7.5%'), justifyContent:'center',marginRight: hp('2%'), paddingTop:hp('1.5%')},
  nameSpace: {flex: 2.15, justifyContent:'center', paddingTop:hp('1.8%')},
  sinceSpace: {flex: 1.1, justifyContent:'center', paddingTop:hp('1.8%')},
  photoContainer: {
    height: hp('7.5%'),
    width: hp('7.5%'),
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
    fontSize: hp('1.5%'),
    fontWeight: '500',
    color: '#fff',
  },
  nameText: {
    fontSize: hp('2.4%'),
    fontWeight: '600',
    color: '#fff',
    // marginTop: hp('0.5%'),
  },
  sinceLabel: {
    fontSize: hp('1.8%'),
    fontWeight: '500',
    color: '#D59A66',
  },
  sinceText: {
    fontSize: hp('2.4%'),
    fontWeight: '600',
    color: '#D59A66',
    marginTop: hp('0.5%'),
  },
  cardNumber: {
    fontSize: hp('4%'),
    fontWeight: '500',
    color: '#fff',
    letterSpacing: wp('0.3%'),
    marginTop: hp('0.5%'),
  },
  loyaltyLabel: {
    fontSize: hp('1.8%'),
    fontWeight: '500',
    color: '#F8E71C',
    textAlign:'center'
  },
  loyaltyText: {
    fontSize: hp('2.4%'),
    fontWeight: '600',
    color: '#F8E71C',
    marginTop: hp('0.5%'),
    textAlign: 'center',
  },
  pointsLabel: {
    fontSize: hp('1.8%'),
    fontWeight: '500',
    color: '#4CD964',
    textAlign:'center'
  },
  pointsText: {
    fontSize: hp('2.4%'),
    fontWeight: '600',
    color: '#4CD964',
    marginTop: hp('0.75%'),
    textAlign: 'center',
  },
  expiryLabel: {
    fontSize: hp('1.8%'),
    fontWeight: '500',
    color: '#FF2D55',
    textAlign:'center'
  },
  expiryText: {
    fontSize: hp('2.4%'),
    fontWeight: '600',
    color: '#FF2D55',
    marginTop: hp('0.75%'),
    textAlign: 'center',
  },
})