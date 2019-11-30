import React, { Component } from 'react';
import { Dimensions,View, Text, StyleSheet, ImageBackground,TouchableOpacity,Image} from 'react-native';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import { scale, moderateScale, verticalScale} from '../../../../../constants/util/scaling';
class Button extends Component {
    render() {
        const {label, backgroundColor, width, color} = this.props

        return (
                <TouchableOpacity style={[{backgroundColor},{width},styles.container]} onPress={()=>{alert('Not implemented for this version.')}}>
                    <Text style={[{color},styles.labelButton]}>{label}</Text>
                </TouchableOpacity>
        );
    }
}

const styles = StyleSheet.create({
    
    container:{
        height:hp('5.8%'), 
        borderRadius:hp('0.9%'), 
        justifyContent:'center', 
        alignItems:'center', 
        elevation: moderateScale(1.5)
    },
    labelButton:{
        fontFamily:'Montserrat-Bold', 
        fontSize:hp('2.6%'),
        textAlign:'center',
    }
});

export default Button;
