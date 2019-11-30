//import liraries
import React, { Component } from 'react';
import { Dimensions,View, Text, StyleSheet, ImageBackground,TouchableOpacity,Image} from 'react-native';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
// create a component
class BackgroundImage extends Component {
    render() {
        const {source} = this.props
        return (
            <ImageBackground
            source={ source }
            style={styles.backgroundImage}
            resizeMode= {'stretch'}
            />
        );
    }
}

// define your styles
const styles = StyleSheet.create({
    backgroundImage: {
        position: 'absolute',
        width:'100%',
        height:'100%',
    },
});

//make this component available to the app
export default BackgroundImage;
