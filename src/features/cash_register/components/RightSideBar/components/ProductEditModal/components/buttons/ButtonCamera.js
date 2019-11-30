import React, { Component } from "react";
import { View, TouchableOpacity, Image, ImageBackground, StyleSheet } from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp
} from "react-native-responsive-screen";
import {TextMontserrat} from 'components'
import colors from '../../../../../../styles/colors'
import isTablet from '../../../../../../constants/isLandscape'
const CAMERA = require('../assets/photo_camera.png');

class ButtonCamera extends Component {
    render() {
        // const { imageSource,imageAtributes, containerStyle, imageSize, onPress } = this.props;
        // const calculateImage = imageAtributes.height/imageAtributes.width;
        // const container = {
        //     width:hp('2.4%'), 
        //     height:hp('2.4%'),
        //     justifyContent:'center',
        //     alignItems:'center',
        //     ...containerStyle
        // }

        const { onPress, style, namePhoto } = this.props;

        const image = {
            height: '35%',
            
            resizeMode:'contain',
        }
        
        return (
            <TouchableOpacity 
                onPress={onPress} 
                style={style}
            >

                {//INICIALES NAME PRODUCT
                    namePhoto!=null?
                    <View style={styles.containerName}>
                        <TextMontserrat style={styles.productName}>
                        {namePhoto.length>=2?namePhoto.substr(0,2).toUpperCase():namePhoto.substr(0,1).toUpperCase()}
                        </TextMontserrat>
                    </View>
                    :
                    <Image 
                        source={CAMERA} 
                        style={image} 
                    />
                }
            </TouchableOpacity>
        );    
    }
}

const styles = StyleSheet.create({
    containerName: {
        height:'100%',
        borderWidth:1,
        borderColor:'rgba(0,0,0,0.5)' , 
        width:'100%',
        alignItems: 'center',
        justifyContent: 'center', 
        backgroundColor: colors.noactiveGray , 
        position:'absolute', 
        top:0,
        left:0,
        borderRadius:hp('1%')
    },
    productName: {
        color:colors.darkWhite,
        fontSize: isTablet?hp('3.5%'):hp('3%'),
        fontWeight: '700'
    }

})
export default ButtonCamera;