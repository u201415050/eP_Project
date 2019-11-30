import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View,ImageBackground} from 'react-native';
import Result from './Result/result'
import EStyleSheet from 'react-native-extended-stylesheet';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import { isTablet } from '../../constants/isLandscape';
export default class Notifications extends Component{
  render() {
    const isLandscape= isTablet
    const {openTransaction}=this.props

    return (
      <View style={[styles.container,isLandscape?{paddingHorizontal:10, flex:0, flexGrow:1, flexWrap: 'wrap'}:null]}>
        <Result  />
       
      </View>
    );
  }
}

const styles = EStyleSheet.create({
  container: {
    width: '100%',
    alignItems:'center',
    backgroundColor:'white',
    paddingHorizontal: 5,
    height:hp('100%'),
  },
 
});
