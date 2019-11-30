import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

export const portraitStyles = {
  container: {
    flex: 1,
    flexDirection: 'column',
    paddingHorizontal: wp('7%'),
    paddingTop: hp('2.5%'),
  },
  dividerHolder: {
    position: 'absolute', 
    height: '100%', 
    width: wp('100%'), 
  },
  dividerContainer: {
    height: '100%', 
    width: hp('0.15%'),
    position: 'absolute', 
    alignSelf: 'center',
    justifyContent: 'flex-end',
    paddingBottom: '4%',
  },
  divider: {
    height: '91%', 
    width: '100%', 
    backgroundColor: '#D0EBFF', 
  },
}