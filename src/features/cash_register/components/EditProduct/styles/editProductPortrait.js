import { StyleSheet } from 'react-native';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';

export const editProductPortrait = StyleSheet.create({
    containerStyle : {
        height:hp('42%'),  
        width:wp('81%'), 
        padding:0, 
        paddingTop:hp('1.2%'), 
        borderWidth:0.5, 
        borderColor:'#CECECE', 
        backgroundColor:'#fff',   
        borderRadius: 10,
        
        elevation:0
    },
    contentWidth : {
        width:wp('71%')
    },
    cameraButtonContainer : {
        width:wp('22%'), 
        height:hp('10.4%'), 
        borderWidth:1, 
        borderRadius:5, 
        borderColor:'#979797', 
        justifyContent:'center', 
        alignItems:'center',
        marginLeft:wp('0.5%'),
        //marginRight:wp('1%'),
    },
    cancelButtonStyle : {
        width:wp('33.3%'), 
        height:hp('5.45%'), 
        backgroundColor:'#fff', 
        borderWidth:hp('0.25%'), 
        borderColor:'#b30000', 
        borderRadius:wp('4%'), 
        justifyContent:'center', 
        alignItems:'center',
        elevation:hp('0.5%'),
    },
    saveButtonStyle : {
        width:wp('33.3%'), 
        height:hp('5.45%'),  
        borderRadius:wp('4%'), 
        justifyContent:'center', 
        alignItems:'center',
        elevation:hp('0.5%'),
    },
})