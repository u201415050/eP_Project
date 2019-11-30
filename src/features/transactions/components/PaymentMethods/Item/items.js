import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, ImageBackground, Image, TouchableOpacity} from 'react-native';
import colors from '../../../styles/colors';
import EStyleSheet from 'react-native-extended-stylesheet';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';

export default class Items extends Component{
  render() {
    const{source,label, item} = this.props
    return (
      
      <TouchableOpacity style={styles.container}>
        
        <Image source={item.icon} style={styles.icon} />
        
        <Text style={styles.title}>{item.label}</Text>
        </TouchableOpacity>
    );
  }
}

const styles = EStyleSheet.create({
  container: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems:'center',
    width:'18%',
    
  },
  icon:{
    width:hp('6%'),
    height:hp('6%'),
    margin:hp('0.5%'),
    justifyContent: 'center',
    alignItems:'stretch',
  },
  title:{
    color: colors.slateGray,
    fontSize: hp('1.4%'),
    fontFamily:'Montserrat-Bold'
  },
  
});
