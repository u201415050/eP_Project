
import React, { Component } from 'react';
import { Dimensions,View, Text, StyleSheet, ImageBackground,TouchableOpacity,Image} from 'react-native';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import { isTablet } from '../../../../../constants/isLandscape';


class OptionsContainer extends Component {
    render() {
        const{actionClose,openDiscount,openDelivery}=this.props
        const isLandscape= isTablet
        const options = !isLandscape?[
            {source: require('../../../assets/Delivery2.png'),onpress:openDelivery},
            {source: require('../../../assets/Discount2.png'),onpress:openDiscount},
            {source: require('../../../assets/Close2.png'),onpress:actionClose},
        ]:[
            {source: require('../../../assets/Delivery2.png'),onpress:openDelivery},
            {source: require('../../../assets/Discount2.png'),onpress:openDiscount},
            {source: require('../../../assets/Close2.png')},
        ]
        return (
            <View style={styles.container}>

                <View style={styles.textContainer}>
                    <Text style={styles.titlePoints}>400 Points</Text>
                </View>

                <View style={[styles.drawerRightTitleContainer]}>
                {
                    options.map((item,i)=>{
                        return(
                        <TouchableOpacity key={i} onPress={item.onpress}>
                            <Image source={item.source}
                                style={[styles.drawerRightIcon,item.extraStyle]}/>
                        </TouchableOpacity>)
                    })
                }
                </View>

            </View>     
                   
        );
    }
}

// define your styles
const styles = StyleSheet.create({
    container:{
        height:hp('13.6%'),
        width:'50%',
        backgroundColor: '#5D6770',
        flexDirection:'column',  
        alignItems: 'flex-end'
    },
    textContainer:{
        width:'100%', 
        height:hp('5.8%'), 
        alignItems:'flex-end', 
        justifyContent:'flex-end', 
        paddingRight:hp('2.3%')
    },
    drawerRightIcon:{
        width:hp('5.5%'),
        height:hp('5.5%'),
        resizeMode: 'contain',
        alignItems:'flex-start',
    },
    drawerRightTitleContainer:{
        height:hp('7.8%'),
        flexDirection:'row',
        width:hp('20%'),
        marginRight:hp('1.7%'),
        paddingTop:hp('0.8%'),
        justifyContent:'space-between',
    },
    titlePoints:{
        fontSize:hp('2.7%'), 
        fontFamily:'Montserrat-Bold', 
        color:'white'
    }
});

export default OptionsContainer;
