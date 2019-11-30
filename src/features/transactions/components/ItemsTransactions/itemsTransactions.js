import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View,ScrollView} from 'react-native';
import Items from './Item/items'
import colors from '../../styles/colors';
import { Categories, CategoriesLarge } from '../../constants/categories';
import EStyleSheet from 'react-native-extended-stylesheet';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import { isTablet } from '../../constants/isLandscape';

export default class ItemsTransactions extends Component{
  render() {
    const isLandscape= isTablet
    return (
      <View style={[styles.container, isLandscape?{paddingHorizontal: 0}:null]}>
                 <ScrollView horizontal={true}>

      {
        isLandscape?
        CategoriesLarge.map((item,i)=>{
          return(
            <Items key={i} item={item}/>
          )
        })
        :
        Categories.map((item,i)=>{
          return(
            <Items key={i} item={item}/>
          )
        })
      }
                  </ScrollView>

      </View>
    );
  }
}

const styles = EStyleSheet.create({
  container: {
    width: '100%',
    height:hp('14%'),
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
