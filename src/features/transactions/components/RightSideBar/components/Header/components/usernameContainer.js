
import React, { Component } from 'react';
import { Dimensions,View, Text, StyleSheet, ImageBackground,TouchableOpacity,Image} from 'react-native';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';

class UsernameContainer extends Component {
    render() {
        return (
             <View style={styles.container}>
                <View style={styles.usernameBox}>
                    <View style={styles.shadowBox} />

                    <View style={styles.borderBox}>
                        <Text numberOfLines={1} 
                            style={[styles.defaultText,{paddingTop:hp('0.40%'),paddingRight:wp('2%'), fontSize:hp('2.2%')}]}>Username</Text>
                        <Text numberOfLines={1} 
                            style={[styles.defaultText,{paddingTop:hp('0.2%'), fontSize:hp('1.85%')}]}>174 265 44</Text>
                    </View>                 
                </View>
            </View>
                   
        );
    }
}

const styles = StyleSheet.create({  
    container:{
        height:hp('13.6%'),
        width:'50%',
        backgroundColor: '#5D6770',
    },
    usernameBox:{
        height:'100%', 
        paddingLeft:hp('1.9%'), 
        paddingTop:hp('2.6%'),
    },
    shadowBox:{
        height:hp('7%'), 
        width:'96%',  
        backgroundColor:'#000000', 
        flexDirection: 'column', 
        position:'absolute', 
        top:hp('3%'), 
        left:hp('1.8%'), 
        borderRadius:hp('1.4%'), 
        opacity:0.15
    },
    borderBox:{
        height:hp('7%'), 
        width:'95%', 
        backgroundColor:'#5D6770',  
        flexDirection: 'column', 
        borderWidth:hp('0.14%'), 
        borderRadius:hp('1.4%')
    },
    defaultText:{
        height:'50%', 
        width:'100%',
        paddingLeft:wp('2%'), 
        fontFamily:'Montserrat-Bold', 
        color:'white'
    }
});

export default UsernameContainer;
