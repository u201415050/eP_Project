
import React, { Component } from 'react';
import { Dimensions,View, Text, StyleSheet, ImageBackground,TouchableOpacity,Image} from 'react-native';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import { isTablet } from '../../../../../constants/isLandscape';
class AddItems extends Component {
    render() {
        const {actionClose} = this.props
        return (
                <View  style={styles.container} >
                
                    <Text style={styles.carEmpty}>Your Cart is empty</Text>
                    <TouchableOpacity onPress={isTablet?null:actionClose}>
                        <Text style={styles.addMore}>Add Items</Text>
                    </TouchableOpacity>
                </View>
        );
    }
}

const styles = StyleSheet.create({
    container:{
        width:'100%',
        flex:1,
        justifyContent:'center',
        alignItems: 'center',
      },
      addMore: {
        fontSize:hp('2.75%'),
        fontFamily: 'Montserrat-Bold',
        color:'#174285',
      },
      carEmpty: {
        fontSize:hp('2.80%'),
        fontFamily: 'Montserrat-Bold',
        color:'#BDC1CD',
      },
});

export default AddItems;
