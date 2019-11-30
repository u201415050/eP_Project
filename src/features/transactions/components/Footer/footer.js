import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View,Image, TouchableOpacity} from 'react-native';
import colors from '../../styles/colors';
import EStyleSheet from 'react-native-extended-stylesheet';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
export default class Footer extends Component{
  render() {
    return (
      <TouchableOpacity style={styles.container}>
      <Image source={require('../../assets/img/Group.png')} style={styles.img}/>
        <Text style={styles.title} > ADD CUSTOMER</Text>
      </TouchableOpacity>
    );
  }
}

const styles = EStyleSheet.create({
  container: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems:'center',
    backgroundColor: colors.darkGray,
    paddingHorizontal: 10,
    flex: 1,
  },
  title:{
    color: colors.white,
    fontSize: hp('2.1'),
    letterSpacing: 2,
    fontFamily: 'Montserrat-Bold'
  },
  img:{
    height:hp('3.2%'),
    width:hp('3.2%')
  },
});
