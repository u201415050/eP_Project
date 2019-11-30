
import React, { Component } from 'react';
import { Dimensions,View, Text, StyleSheet, ImageBackground,TouchableOpacity,Image, Modal} from 'react-native';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import colors from '../../../styles/colors';

class ModalOptions extends Component {
    render() {
        const {openDiscount, openDelivery, disable} = this.props
        return(
            <View style={styles.container}>
                <TouchableOpacity disabled={disable} style={[styles.rowOption,{marginTop:hp('0.5%')},disable?{opacity:0.6}:null]} onPress={openDiscount}>
                    <Image style={styles.icon} source={require("../../../assets/img/Discount2.png")} />
                    <Text style={styles.label}>Discount</Text>
                </TouchableOpacity>
                <TouchableOpacity disabled={disable} style={[styles.rowOption,{marginTop:hp('0.6%'),marginBottom:hp('0.5%')},disable?{opacity:0.6}:null]} onPress={openDelivery}>
                    <Image style={styles.icon} source={require("../../../assets/img/Delivery2.png")} />
                    <Text style={styles.label}>Delivery Charge</Text>
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
        top:hp('7%'),
        right:hp('2.6%'),
        backgroundColor:colors.white,
        elevation: 30,
        borderRadius: 3,
        borderColor: colors.opacityDin(0.2),
        borderWidth: 1,
    },
    rowOption:{
        flexDirection:'row',
        alignItems: 'center',
        paddingHorizontal: 4,
    },
    icon:{
        height:hp('4.6%'),
        width:hp('4.6%'),
    },
    label:{
        color: colors.lightBlack,
        fontFamily: "Montserrat-SemiBold",
        paddingHorizontal: 6,
        fontSize: hp('2.4%'),
    }
});

export default ModalOptions;
