import {Platform, StyleSheet } from 'react-native';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import {Colors} from 'api';

export const landscapeStyles = StyleSheet.create({
    backHeaderLandscapeStyle: {
        zIndex:0, 
        flex:0, 
        position:'absolute',
        paddingTop:hp('3%'), 
        height:hp('10%'), 
        marginLeft:wp('0.5%'),
    },
    logoContainer: {
        height:hp('20%'),
        width:'100%',
        paddingTop:hp('4.1%'),
    },
    cardContainer: {
        alignItems: 'center',
    },
    card: {
        width: wp('45.7%'),
        height: hp('58%'),
        backgroundColor:'white',
        borderRadius:hp('2%'),
        paddingHorizontal:wp('4.7%'),
        justifyContent:'center',
        elevation:10,
        shadowColor: '#000000',
        shadowOffset: {
            width: 0,
            height: 3
        },
        shadowRadius: 5,
        shadowOpacity: 1.0,
    },
    forgotPasswordText: {
        fontWeight: '700',
        color: Colors.primary,
        textAlign: 'center',
        fontSize: hp('2.5%'),
        marginTop:hp('0.7%')
    },
    buttonResetPassword: {
        width:wp('45.7%'), 
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
    textSignIn: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: hp('2.6%'),
        letterSpacing: 1.33,
    },
    containerCreateAccount: {
        alignItems: 'center',
        justifyContent: 'flex-end',
        // height:hp('22.35%'),
        // paddingBottom:hp('8.35%')
    },
    headerStyle: {
        fontSize: wp('1.8%'),
        fontWeight: '700',
        textAlign: 'center',
    },
    createNewAccountContainer : {
        flex: 1,
        alignItems:'center', 
        // justifyContent: 'center',
        // backgroundColor: 'green',
    },
    buttonResendOtp: {
        height: hp('7.8%'),
        width: wp('26.35%'),
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
        fontSize: hp('2.65'),
        fontWeight: '600'
    }, 
})