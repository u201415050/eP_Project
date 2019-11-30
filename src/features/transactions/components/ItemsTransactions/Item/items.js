import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, ImageBackground, Image} from 'react-native';
import colors from '../../../styles/colors';
import EStyleSheet from 'react-native-extended-stylesheet';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';

export default class Items extends Component{
  render() {
    const{source,label, item} = this.props
    return (
      
      <View style={styles.container}>
        
        <Image source={item.icon} style={styles.icon} />
        
        <Text style={styles.title}>{item.label}</Text>
      </View>
    );
  }
}

const styles = EStyleSheet.create({
  container: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems:'center',
  },
  icon:{
    width:hp('10%'),
    height:hp('10%'),
    margin:hp('1%'),
    justifyContent: 'center',
    alignItems:'center',
  },
  title:{
    color: colors.slateGray,
    fontSize: hp('1.5%'),
    fontFamily:'Montserrat-Bold'
  },
  
});
