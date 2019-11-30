import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View,ImageBackground,Image} from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import { isTablet } from '../../../constants/isLandscape';
export default class Result extends Component{
  render() {
    const {amount} = this.props
    const isLandscape = isTablet
    return (
      <View style={styles.container}>
        <Image resizeMode="stretch" source={require('../../../assets/img/rectangleLarge.png')} style={{position:'absolute', top:0, left:0,width: '99%',height:hp('9%'),}}/>
            <View style={[styles.fieldResult, isLandscape?{paddingHorizontal: hp('5%')}:null]}>
                <Text style={styles.textField}>Amount</Text>
                <Text style={styles.textField}>₹{amount}</Text>
            </View>
      </View>
    );
  }
}

const styles = EStyleSheet.create({
  container: {
    width: '100%',
    alignItems:'center',
    justifyContent: 'center',
    height:hp('9.5%'),
  },
  imgb:{
    
    width: '100%',
    height:hp('9.5%'),
    alignItems:'center',
  },
  fieldResult:{
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: hp('2.5%'),
    width: '100%',
    alignItems:'center',
  },
  textField:{
    fontSize: hp('2.5%'),
    fontFamily:'Montserrat-ExtraBold'
  },
});
