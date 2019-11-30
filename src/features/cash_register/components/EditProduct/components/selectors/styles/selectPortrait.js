import { StyleSheet } from 'react-native';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';

export const selectPortrait = StyleSheet.create({
    dropdownContainer : {
        width: wp('8%'), 
        height:'100%',
        justifyContent:'flex-end', 
        paddingBottom:hp('0.95%'), 
        alignItems:'center'
    },
    pickerStyle : {
        width:wp('8%'), 
        height:hp('11.14%'), 
        elevation: 5, 
        paddingTop: 0
    },
    
})