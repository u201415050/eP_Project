import { StyleSheet } from 'react-native';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';

export const editProductLandscape = StyleSheet.create({
    containerStyle : {
        height:hp('44%'), 
        width:wp('31%'), 
        padding:0, 
        paddingTop:hp('1.2%'), 
        borderWidth:0.5, 
        borderColor:'#CECECE', 
        backgroundColor:'#fff',
        elevation:0
    },
    contentWidth : {
        width:wp('28.2%'),
        //backgroundColor:'#E4C58E'
    },
    cameraButtonContainer : {
        width:wp('9%'), 
        height:hp('10.4%'), 
        borderWidth:1, 
        borderRadius:5, 
        borderColor:'#979797', 
        justifyContent:'center', 
        alignItems:'center',
        marginLeft:wp('1%'),
        //marginRight:wp('0.5%'),
    },
    cancelButtonStyle : {
        width:wp('11%'), 
        height:hp('5.35%'), 
        backgroundColor:'#fff', 
        borderWidth:hp('0.25%'), 
        borderColor:'#b30000', 
        borderRadius:wp('1.6%'), 
        justifyContent:'center', 
        alignItems:'center',
        elevation:hp('0.5%'),
    },
    saveButtonStyle : {
        width:wp('11%'), 
        height:hp('5.35%'),  
        borderRadius:wp('1.6%'), 
        justifyContent:'center', 
        alignItems:'center',
        elevation:hp('0.5%'),
    },
})