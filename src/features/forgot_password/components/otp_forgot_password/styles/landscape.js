import {Platform, StyleSheet } from 'react-native';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import {Colors} from 'api';

export const landscapeStyles = StyleSheet.create({
    buttonResendOtp: {
        width:wp('26.4%'), 
        height:hp('7.8%'),
        //marginTop:hp('3.5%'),
        borderRadius:hp('20%'),
        justifyContent:'center',
        alignItems:'center',
        ...Platform.select({
            ios: {
                shadowOffset: { width: 1, height: 2 },
                shadowColor: "black",
                shadowOpacity: .5,
            },
            android: {
                elevation: hp('0.4%'),
            }
        })
    },
    textResendOtp: {
        color: '#fff',//#52565F',
        fontWeight: '600',
        fontSize: hp('2.6%'),
        letterSpacing: 1.33,
    },
    buttonResetPassword: {
        width:wp('34.2%'), 
        height:hp('7.8%'),
        marginTop:hp('0%'),
        borderRadius:hp('20%'),
        justifyContent:'center',
        alignItems:'center',
        ...Platform.select({
            ios: {
                shadowOffset: { width: 1, height: 2 },
                shadowColor: "black",
                shadowOpacity: .5,
            },
            android: {
                elevation: hp('0.35%'),
            }
        })
    },
    textResetPassword: {
        color: '#fff',
        fontWeight: '700',
        fontSize: hp('2.6%'),
        letterSpacing: 1.33,
    },
})