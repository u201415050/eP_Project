import {Platform, StyleSheet } from 'react-native';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import {Colors} from 'api';

export const portraitStyles = StyleSheet.create({
    buttonResendOtp: {
        width:wp('50%'), 
        height:hp('6.25%'),
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
        fontSize: hp('1.8%'),
        letterSpacing: 1.33,
    },
    buttonResetPassword: {
        width:'100%', 
        height:hp('6.25%'),
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
    textResetPassword: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: hp('1.8%'),
        letterSpacing: 1.33,
    },
})