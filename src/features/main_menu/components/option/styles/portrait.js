import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

export const portraitStyles = {
  container: {
    flex: 1,
    justifyContent: 'center', 
    alignItems: 'center', 
    borderBottomWidth: hp('0.2%'),
    borderRightWidth: hp('0.2%'),
    borderColor: '#D0EBFF',
    // borderColor: '#000',
  },
  icon: {
    height: hp('8.5%'),
    width: hp('8.5%'),
    marginBottom: hp('1%'),
  },
  label: {
    width: wp('28%'),
    fontSize: wp('3%'),
    fontWeight: '700',
    color: '#52565F',
    textAlign: 'center',
  },
}