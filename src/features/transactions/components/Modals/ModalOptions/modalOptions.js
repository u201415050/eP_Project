
import React, { Component } from 'react';
import { Dimensions,View, Text, StyleSheet, ImageBackground,TouchableOpacity,Image, Modal} from 'react-native';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import colors from '../../../styles/colors';


class ModalOptions extends Component {
   
      
    render() {
        const {openDiscount, openDelivery} = this.props
        return(
            <View style={styles.container}>
                <TouchableOpacity style={styles.rowOption} onPress={openDiscount}>
                    <Text style={styles.label}>Invoice</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.rowOption} onPress={openDelivery}>
                    <Text style={styles.label}>Type</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.rowOption} onPress={openDelivery}>
                    <Text style={styles.label}>Cash</Text>
                </TouchableOpacity>
            </View>
        )
    }
}

// define your styles
const styles = StyleSheet.create({
    container:{
        position: "absolute",
        justifyContent:'center',
        padding: hp('0.6%'),
        top:hp('17%'),
        right:hp('5.5%'),
        backgroundColor:colors.white,
        elevation: 3,
        borderRadius: 3,
        borderColor: colors.opacityDin(0.2),
        borderWidth: 0.2,
    },
    rowOption:{
        flexDirection:'row',
        alignItems: 'center',
        paddingHorizontal: 5,
        paddingVertical: 4,

    },
    icon:{
        height:hp('4.6%'),
        width:hp('4.6%'),
    },
    label:{
        color: colors.lightBlack,
        fontWeight: '400',
        paddingHorizontal: 6,
        
        fontSize: hp('2%'),
    }
});

export default ModalOptions;
