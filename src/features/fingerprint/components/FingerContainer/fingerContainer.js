//import liraries
import React, { Component } from 'react';
import { Dimensions,View, Text, StyleSheet, ImageBackground,TouchableOpacity,Image} from 'react-native';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import { isTablet } from '../../constants/isLandscape';
// create a component
class FingerContainer extends Component {
    render() {
        return (
            <View style={styles.container}>
                <View style={styles.wrapper}> 
                    <Image source={require('../../assets/img/finger.png')} style={{height:hp('5%'), width:hp('5%')*0.86}}/>
                </View>
               
                <Text style={styles.textLogin}>Log in with your fingerprint</Text>
                
                <Text style={styles.textDescription}>{isTablet?"Use your fingerprint for faster, easier access to your ePaisa account.":"Use your fingerprint for faster, easier access to"}</Text>
                {!isTablet?<Text style={styles.textDescription}>your ePaisa account.</Text>:null}
            </View>
        );
    }
}

// define your styles
const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        width:'100%',
        height:'100%',
        alignItems:'center',
        justifyContent:'center'
    },
    wrapper:{
        backgroundColor:'#52565F',
        borderRadius: hp('8%'),
        width: hp('10%'),
        height: hp('10%'),
        alignItems:'center',
        justifyContent:'center'
    },
    textLogin:{
        fontSize:hp('3%'),
        fontFamily:'Montserrat-SemiBold',
        color:'#52565F',
        marginTop:hp('4.8%')
    },
    textDescription:{
        fontSize:hp('1.85%'),
        fontFamily:'Montserrat-SemiBold',
        color:'#52565F',
    }
});

//make this component available to the app
export default FingerContainer;
