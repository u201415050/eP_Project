import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

export const landscapeStyles = {
  container: {
    width: '100%',
    height: hp('81.8%'),
    flexDirection: 'column',
    paddingHorizontal: wp('11%'),
    paddingTop: hp('2.5%'),
    paddingBottom: hp('3.75%'),
  },
  dividerHolder: {
    position: 'absolute', 
    height: '100%', 
    width: wp('100%'), 
  },
  dividerInnerHolder: {
    height: '100%', 
    width: wp('100%'), 
    flexDirection: 'row', 
  },
  dividerContainer: {
    height: '100%', 
    width: hp('0.15%'),
    justifyContent: 'flex-end',
    paddingBottom: '4%',
    marginLeft: wp('33.33%')
  },
  divider: {
    height: '89%', 
    width: '100%', 
    backgroundColor: '#D0EBFF', 
  },
}