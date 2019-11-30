import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View,ScrollView, TouchableWithoutFeedback, Keyboard} from 'react-native';
import Items from './Item/items'
import EStyleSheet from 'react-native-extended-stylesheet';

import colors from '../../../saved_transactions/styles/colors';
import { isTablet } from '../../../cash_register/constants/isLandscape';

export default class ItemsTransactions extends Component{
  render() {
    const isLandscape= isTablet
    return (
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <View style={[styles.container, isLandscape?{paddingHorizontal: 0}:null]}>
              <Items filter={this.props.filter} modifyLimits={this.props.modifyLimits}/>
        </View>
      </TouchableWithoutFeedback>
    );
  }
}

const styles = EStyleSheet.create({
  container: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems:'center',
  },
  title:{
    color: colors.white,
    fontSize: 17,
    fontWeight: '700',
    letterSpacing: 2
  }
});
