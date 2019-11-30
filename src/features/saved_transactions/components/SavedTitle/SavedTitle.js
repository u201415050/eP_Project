import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View} from 'react-native';
import colors from '../../styles/colors';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import EStyleSheet from 'react-native-extended-stylesheet';
import { TextMontserrat } from 'components';
export default class SavedTitle extends Component{
  render() {
    const {value} = this.props
    return (
      <View>
      <View style={styles.container}>
        <TextMontserrat style={styles.title} >SAVED TRANSACTIONS</TextMontserrat>
      </View>
      </View>
    );
  }
}

const styles = EStyleSheet.create({
  container: {
    width: '100%',
    height:hp('6%'),
    flexDirection:'row',
    justifyContent:'center',
    alignItems: 'center',
    backgroundColor: colors.slateGray,
    paddingHorizontal: 20,
    elevation:8
  },
  title:{
    color: colors.white,
    fontSize: hp('2%'),
    fontWeight: '900',
    letterSpacing: 2,
  }
});
