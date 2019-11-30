import {Platform, StyleSheet } from 'react-native';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import {Colors} from 'api';

export const portraitStyles = StyleSheet.create({
    backHeaderPortraitStyle: {
        zIndex:0, 
        flex:0, 
        paddingTop:hp('1%'), 
        height:hp('6%'), 
        marginLeft:wp('1.5%')
    },
    logoContainer: {
        height:hp('16.5%'),
        width:'100%',
        paddingTop:hp('1.5%'),
    },
    cardContainer: {
        alignItems: 'center',
        height: hp('56.9%'),
        //backgroundColor:'green',
        marginTop:hp('-2.1%')
    },
    card: {
        width: wp('86.6%'),
        height: hp('53.8%'),
        backgroundColor:'white',
        borderRadius:hp('2%'),
        paddingTop:0,
        paddingHorizontal:wp('8.8%'),
        //paddingTop:hp('3%'),
        elevation:10,
        shadowColor: '#000000',
        shadowOffset: {
            width: 0,
            height: 3
        },
        shadowRadius: 5,
        shadowOpacity: 1.0,
    },
    buttonResetPassword: {
        width:wp('86.6%'), 
        height:hp('7.5%'),
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
    textSignIn: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: hp('1.8%'),
        letterSpacing: 1.33,
    },
    containerCreateAccount: {
        alignItems: 'center',
        justifyContent: 'flex-end',
        height:hp('29.5%'),
        paddingBottom:hp('8.35%')
    },
    headerStyle: {
        fontSize: wp('3.5%'),
        fontWeight: '700',
        textAlign: 'center',
    },
    createNewAccountContainer : {
        width:'100%', 
        alignItems:'center', 
        marginTop:hp('1.7%')
    },
    buttonResendOtp: {
        height: hp('6.25%'),
        width: wp('50%'),
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
                elevation: hp('0.65%'),
            }
        })
    },
    buttonResendOtpText: {
        fontSize: wp('3.15%'),
        fontWeight: '600'
    },    
})