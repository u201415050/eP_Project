import React, { Component } from "react";
import { View, TouchableOpacity, Image } from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp
} from "react-native-responsive-screen";
import { CLOSE } from 'assets';

class ButtonClose extends Component {
    render() {
        const { containerStyle, imageStyle, onPress } = this.props;

        const container = {
            width:hp('2.4%'), 
            height:hp('2.4%'),
            ...containerStyle
        }

        const image = {
            width:hp('2.4%'), 
            height:hp('2.4%'), 
            resizeMode:'contain',
            ...imageStyle
        }

        return (
            <TouchableOpacity onPress={onPress} style={container}>
                <View style={container} >
                    <Image source={CLOSE} style={image} />
                </View>
            </TouchableOpacity>
        );    
    }
}

export default ButtonClose;


