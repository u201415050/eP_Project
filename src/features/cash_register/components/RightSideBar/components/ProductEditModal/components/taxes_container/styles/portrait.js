import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

export const styles = {
  dropdown: {
    containerHeight: hp('7.48%'),
    borderBottom: hp('0.35%'),
    labelSize: wp('3.1%'),
    descriptorTypeSize: wp('3.5%'),
    separatorWidth: wp('0.4%'),
    inputWidth: wp('53%'),
    inputLeftPadding: wp('5.1%'),
    inputFontSize: wp('3.6%'),
    textIconPaddingBottom: hp('0.7%'),
    iconSize: hp('3%'),
  },
  textInput: {
    containerHeight: hp('7.48%'),
    borderBottom: hp('0.35%'),
    labelSize: wp('3.1%'),
    descriptorTypeSize: wp('3.5%'),
    separatorWidth: wp('0.4%'),
    inputWidth: wp('38.5%'),
    inputLeftPadding: wp('4.2%'),
    inputFontSize: wp('3.6%'),
    iconSize: hp('3%'),
    textIconPaddingBottom: hp('0.7%'),
    iconMarginRight: wp('1%'),
    errorStyle: {
      fontSize: wp('2.6%'),
      fontWeight: '600',
      color: 'red',
    },
  }
}

