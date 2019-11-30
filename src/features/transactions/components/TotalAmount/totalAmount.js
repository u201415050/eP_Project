import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View} from 'react-native';
import colors from '../../styles/colors';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import EStyleSheet from 'react-native-extended-stylesheet';
export default class TotalAmount extends Component{
  render() {
    const {value} = this.props
    return (
      <View style={styles.container}>
        <Text style={styles.title} >TOTAL AMOUNT</Text>
        <Text style={styles.title} >₹{value}</Text>
      </View>
    );
  }
}

const styles = EStyleSheet.create({
  container: {
    width: '100%',
    height:hp('4%'),
    flexDirection:'row',
    justifyContent:'space-between',
    alignItems: 'center',
    backgroundColor: colors.slateGray,
    paddingHorizontal: 20,
    elevation:-3
  },
  title:{
    color: colors.white,
    fontSize: 13,
    letterSpacing: 2,
    fontFamily: 'Montserrat-SemiBold'
  },
  '@media (min-width: 200) and (max-width: 400)': { // media queries
    title:{
      fontSize: 11,
      fontWeight: '500',
      letterSpacing: 1,
    },
    container: {
      
      paddingHorizontal: 14,
    },
  }
});
