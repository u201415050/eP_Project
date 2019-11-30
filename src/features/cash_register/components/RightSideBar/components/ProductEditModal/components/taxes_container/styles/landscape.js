import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

export const styles = {
  dropdown: {
    containerHeight: hp('7.48%'),
    borderBottom: hp('0.35%'),
    labelSize: hp('2%'),
    descriptorTypeSize: hp('2%'),
    separatorWidth: wp('0.1%'),
    inputWidth: wp('19.55%'),
    inputLeftPadding: wp('2.3%'),
    inputFontSize: hp('2%'),
    textIconPaddingBottom: hp('0.7%'),
  },
  textInput: {
    containerHeight: hp('7.48%'),
    borderBottom: hp('0.35%'),
    labelSize: hp('2%'),
    descriptorTypeSize: hp('2%'),
    separatorWidth: wp('0.1%'),
    inputWidth: wp('14%'),
    inputLeftPadding: wp('2%'),
    inputFontSize: hp('2%'),
    iconSize: hp('3%'),
    textIconPaddingBottom: hp('0.7%'),
    iconMarginRight: wp('0%'),
    errorStyle: {
      fontSize: hp('1.6%'),
      fontWeight: '600',
      color: 'red',
    },
  }
}