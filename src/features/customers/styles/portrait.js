import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

export const portraitStyles = {
  loadingContainer: {
    width: wp('100%'), 
    height: hp('7%'), 
    alignItems: 'center', 
    justifyContent: 'center', 
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    position: 'absolute',
    bottom: 0,
  },
  loadingSearching: {
    flex: 1, 
    paddingTop: hp('10%'),
  },
  noUsersLabel: {
    color: '#52565F', 
    fontSize: wp('4.8%'), 
    fontWeight: '600'
  },
}