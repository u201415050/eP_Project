import { StyleSheet } from 'react-native';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';

export const discountStylesPortrait = StyleSheet.create({

    modalBox:{
        height:hp('29.6%'),
        width:wp('69.4%')
    },

    modalDiscountContainer: {
        //backgroundColor: rgba(0,0,0,0.6),
        backgroundColor: 'rgba(47, 49, 51, 0.6)',
        flex: 1,
        //paddingVertical: Dimensions.get('window').height/3,
        //paddingHorizontal: Dimensions.get('window').width/10,
        flexDirection:'row',
        alignItems:'center',
        alignContent:'center',
        justifyContent:'center',
    },

    modalDiscountBoxTop: {
        backgroundColor: 'white',
        height: hp('7%'),
        flexDirection: 'row',
        justifyContent: 'center',
        //alignItems: 'center',
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
    },

    modalDiscountBoxBottom: {
        backgroundColor: 'white',
        height: hp('24.7%'),
        flexDirection: 'column',
        paddingLeft:wp('6.9'),
        paddingRight:wp('6.9'),
        paddingTop:hp('4%'),
        alignItems: 'center',
        borderColor:'#b3b2b2',
        borderTopColor: '#979797',
        borderTopWidth:hp('0.29%'),
        borderBottomLeftRadius: 10,
        borderBottomRightRadius: 10,
        elevation: 20
    },

    modalDiscountDescriptionPortrait: {
        fontFamily: 'Montserrat-Bold',
        textAlign: 'center',
        marginTop: hp('1.45%'),
        color:'#47525D',
        fontSize: hp('3.2%'),
    },

    textInputModal: {
        flexDirection:'column',  
        borderBottomWidth:hp('0.35%'),
        //backgroundColor:'green'
    },

    imageDiscountModalClosePortrait:{
        width:wp('3.9%'), 
        height: hp('3.5%'), 
        resizeMode: 'contain', 
        marginTop:hp('1.6%'), 
        marginRight: wp('2.7%')
    },

    imageDiscountModalErrorPortrait:{
        width:wp('2.6%'), 
        height: hp('2.6%'), 
        resizeMode: 'contain', 
        //paddingBottom:hp('2%'), 
        //paddingLeft: wp('2%')
    },

    textDiscountAddButtonPortrait:{
        fontFamily: 'Montserrat-SemiBold', 
        color:'white', 
        fontSize: hp('1.95%'), 
        letterSpacing: 1.33
    },

    discountModalDiscountInputPortrait:{
        fontFamily: 'Montserrat-Medium',
        fontWeight: '700',
        fontSize: hp('2.05%'),
        paddingTop: hp('2%'),
        paddingHorizontal: wp('4%'),
        paddingBottom: hp('0.4%'),
        position: 'absolute', left: 0, right: 0, bottom: 0
    },

    errorMessagePortrait:{ 
        fontFamily:'Montserrat-Medium', 
        fontSize:hp('1.45%'), 
        color:'#D0021B', 
        width:'100%', 
        paddingTop:hp('0.75%'), 
        paddingLeft:wp('8.9%'), 
    },
    inputsSeparator : {
        height:hp('4%'), 
        width:wp('0.5%'), 
        paddingTop:hp('0.5%')
    },
    clearTextButton : {
        position: "absolute", 
        bottom: 0, 
        right: 0, 
        paddingBottom: hp('0.8%')
    },

})