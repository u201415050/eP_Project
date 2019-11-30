import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, Image, Dimensions, Modal,TouchableOpacity} from 'react-native';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import EStyleSheet from 'react-native-extended-stylesheet';
import colors from '../../../../../styles/colors';
export default class Option extends Component{
    
    render() {
        //const {active,toggle}=this.props
        const {label, icon, active, index, handleOption, size,} = this.props
        const Icon = icon!= "" ? icon : require('../../../../../assets/img/iconOption.png')
        const activeStyle=active?{tintColor:colors.white}:{tintColor:colors.noactiveGray}
        const activeStyleText=active?{color:colors.white}:{color:colors.noactiveGray}
        const extrasize = size == "default"? null: size == "medium"? {height: hp('4.5%'),width:hp('4.5%')}:size == "large"? {height: hp('5%'),width:hp('5%')}:null
        const marginLeft = size == "medium"? -hp('0.3%'):size == "large"? -hp('0.5%'):null
        return (
            <TouchableOpacity style={styles.container} onPress={()=>handleOption(index)}>
                <Image source={Icon} style={[activeStyle,styles.img,extrasize, {marginLeft}]}/>      
                <Text style={[activeStyleText,styles.optionText]}>{label}</Text>
            </TouchableOpacity>
        );
    }
}

const styles = EStyleSheet.create({
    container: {
        width: '100%',
        height: '10%',
        flexDirection: 'row',
        justifyContent:'flex-start',
        alignItems:'center',
      },
      optionText:{
        fontSize: hp('3%'),
        fontFamily: 'Montserrat-SemiBold',
      },
      img:{
        height: hp('4%'),
        width:hp('4%'), 
        marginRight: '6%',
      },
      '@media (min-width: 200) and (max-width: 400)': { // media queries
        optionText:{
            fontSize: 14,
        },
      }
});
