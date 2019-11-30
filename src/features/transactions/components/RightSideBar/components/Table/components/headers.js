import React, { Component } from 'react';
import { Dimensions,View, Text, StyleSheet, ImageBackground,TouchableOpacity,Image} from 'react-native';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';

class Headers extends Component {
    render() {
        return (
            <View style={styles.container}>
                <Text style={[styles.defaultHeader,{width:'15%', textAlign:'center'}]}>S No.</Text>
                <Text style={[styles.defaultHeader,{width:'38%',textAlign:'left'}]}>Description</Text>
                <Text style={[styles.defaultHeader,{width:'15%',textAlign:'center'}]}>Qty</Text>
                <Text style={[styles.defaultHeader,{width:'32%',textAlign:'right', paddingRight:hp('2.3%')}]}>Price</Text>
            </View>    
        );
    }
}

// define your styles
const styles = StyleSheet.create({
    container: {
        flexDirection:'row', 
        height:hp('3.95%'), 
        alignItems:'center', 
        justifyContent: 'flex-start',
        borderBottomWidth:hp('0.15%'), 
        borderColor:'#D0D0D0'
    },
    defaultHeader:{
        fontFamily:'Montserrat-Bold', 
        fontSize:hp('1.8%'), 
        color:'#555555',
        
    }
});

//make this component available to the app
export default Headers;
