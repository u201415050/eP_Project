//import liraries
import React, { Component } from 'react';
import { Dimensions,View, Text, StyleSheet, ImageBackground,TouchableOpacity,Image} from 'react-native';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import LinearGradient from 'react-native-linear-gradient';
import {isTablet} from '../../constants/isLandscape';
// create a component
class Footer extends Component {
    render() {
        const {linkFingerprint}= this.props
        return (
            <View style={[styles.container, isTablet?{alignItems:'flex-start'}:null]}>
                <TouchableOpacity style={[styles.button, {backgroundColor: 'white'},
                isTablet?{width: '45%', borderRadius:35, elevation:4,height:'80%'}:{borderTopWidth: 1,}]} 
                onPress={this.props.onReject}>
                    <Text style={[styles.labelButtonWhite,isTablet?{fontSize: hp('2.3%')}:null]} >NOT NOW</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.button, isTablet?{width: '45%', height:'80%',elevation:4}:null]} onPress={linkFingerprint}>
                <LinearGradient 
                    colors={['#174285', '#0079AA']} 
                    start={{ x: 0, y: 1 }}
                    end={{ x: 1, y: 1 }}
                    style={ {alignItems: 'center',justifyContent:'center', width:'100%',  borderRadius:isTablet?35:0} }>           
                    <View style= {{width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center'}} >
                        <Text style={{color:'#FFFFFF',fontSize: isTablet?hp('2.2%'):hp('1.8%'),fontFamily:'Montserrat-SemiBold'}}>LINK YOUR</Text>
                        <Text style={{color:'#FFFFFF',fontSize: isTablet?hp('2.2%'):hp('1.8%'),fontFamily:'Montserrat-SemiBold'}}>FINGERPRINT</Text>     
                    </View>
                </LinearGradient>
                </TouchableOpacity>
            </View>
        );
    }
}

// define your styles
const styles = StyleSheet.create({
    container: {
        width:isTablet?'55%':'100%',
        flex:1,
        flexDirection: 'row',
        borderTopColor: '#174285',
        justifyContent: isTablet?'space-between':null
    },
    button:{
        width:'50%',
        alignItems: 'center',
        justifyContent:'center',
        shadowOffset: { width: 3, height: 3 },
                  shadowColor: 'black',
                  shadowOpacity: 0.3,
                  shadowRadius: 10,
    },
    labelButtonWhite:{
        color:'#174285',
        fontSize: hp('1.8%'),
        fontFamily:'Montserrat-Bold',
    }
    
});

//make this component available to the app
export default Footer;
