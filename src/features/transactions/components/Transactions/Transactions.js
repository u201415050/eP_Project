import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View,ImageBackground} from 'react-native';
import Result from './Result/result'
import EStyleSheet from 'react-native-extended-stylesheet';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import { isTablet } from '../../../settings/constants/isLandscape';

export default class Transactions extends Component{
  render() {
    const isLandscape= isTablet
    const {mapCustomer,openDetails, filters,dateLimits,up,textSearch,loadMore}=this.props

    return (
      <View style={[styles.container]}>
        <Result mapCustomer={mapCustomer} loadMore={loadMore} textSearch={textSearch} up={up} dateLimits={dateLimits} filters={filters} listData2={this.props.data} openDetails={openDetails}/>
      </View>
    );
  }
}

const styles = EStyleSheet.create({
  container: {
    width: '100%',
    alignItems:'center',
    paddingHorizontal: 5,
    flex:1
  },
 
});
