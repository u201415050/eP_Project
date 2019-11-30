import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

export const landscapeStyles = {
  container: {
    height: hp('18.2%'),
    width: '100%',
    alignItems: 'center',
  },
  logo: {
    width: hp('7.2%'),
    height: hp('7.2%'),
    borderRadius: hp('3.6%'),
    backgroundColor: '#959899',
    marginTop: hp('2.5%'),
    marginBottom: hp('0.5%'),
  },
  companyContainer: {
    width: '100%',
    paddingHorizontal: '11%',
  },
  companyName: {
    color: '#52565F',
    fontSize: hp('3.2%'),
    fontWeight: '700',
    marginBottom: hp('0.3%'),
    textAlign:'center',
  },
  customerContainer: {
    width: '100%',
    paddingHorizontal: '11%',
  },
  customerName: {
    color: '#52565F',
    fontSize: hp('2.7%'),
    fontWeight: '600',
    textAlign:'center',
  },
};
