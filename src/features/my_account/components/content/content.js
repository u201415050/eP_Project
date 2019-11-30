import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Option from './options/option';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import colors from '../../styles/colors';

class Content extends Component {
  render() {
    const val=[
      {image:require('../../assets/img/device.png'), label:'Device'},
      {image:require('../../assets/img/hardware.png'),label:'Hardware'},
      {image:require('../../assets/img/payment.png'),label:'Payment Options'},
      {image:require('../../assets/img/loyalty.png'),label:'Loyalty'},
      {image:require('../../assets/img/transaction.png'),label:'Transactions'}]
    return (
      <View style={styles.container}>
        {
          val.map((item,i)=>{
            return <Option icon={item.image} key={i} label={item.label}/>
          })
        }
      </View>
    );
  }
}

// define your styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    width:'100%',
    paddingTop: hp('2.7%'),
    backgroundColor:colors.darkWhite
  },
});

export default Content;
