import { StyleSheet } from 'react-native';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';

export const discountStylesLandscape = StyleSheet.create({

    textInputModalLandscape: {
        flexDirection:'column',  
        borderBottomWidth:hp('0.35%'),
    },
    imageDiscountModalErrorLandscape:{
        width:wp('1.9%'), 
        height: hp('1.9%'), 
        resizeMode: 'contain', 
        //marginTop:hp('2.1%'), 
        //marginRight: wp('1.1%')
    },
    discountModalDiscountInputLandscape:{
        fontFamily: 'Montserrat-Medium',
        fontWeight: '600',
        fontSize: hp('2.1%'),
        paddingHorizontal: wp('1.9%'),
        paddingBottom: hp('0.4%'),
        position: 'absolute', left: 0, right: 0, bottom: 0
    },

})