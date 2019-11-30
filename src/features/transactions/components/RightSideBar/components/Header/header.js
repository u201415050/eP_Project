//import liraries
import React, { Component } from 'react';
import { Dimensions,View, Text, StyleSheet, ImageBackground,TouchableOpacity,Image} from 'react-native';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import UsernameContainer from './components/usernameContainer';
import OptionsContainer from './components/optionsContainer';
// create a component
class Header extends Component {
    render() {
        const{actionClose, openDiscount,openDelivery}=this.props
        return (
            <View style={styles.container}>
                    <UsernameContainer/>
                    <OptionsContainer actionClose={actionClose} openDiscount={openDiscount} openDelivery={openDelivery}/>
            </View> 
        );
    }
}

// define your styles
const styles = StyleSheet.create({
    container:{
        width:'100%', 
        height:hp('13.6%'), 
        flexDirection:'row', 
        borderBottomWidth:hp('0.15%'), 
        elevation:hp('1.4%'),
        backgroundColor:'#5D6770',
    }
});

//make this component available to the app
export default Header;
