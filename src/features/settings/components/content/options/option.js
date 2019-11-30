import React, { Component } from 'react';
import { View, Text, StyleSheet , Image} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import colors from '../../../styles/colors';
import { TextMontserrat } from '../../../../modal_customer/components/texts';

class Option extends Component {
  render() {
    return (
      <View style={styles.container}>
        <Image source={this.props.icon} style={{width:hp('6.5%'),height:hp('6.5%')}}/>
        <TextMontserrat style={{color:'#52565F',opacity:0.9,marginLeft: hp('2.5%'),fontWeight:'900', fontSize: hp('2.1%'),}}>{this.props.label}</TextMontserrat>
        <Image source={require('../../../assets/img/arrow.png')} opacity={0.3} resizeMode="stretch" style={{position:'absolute',right:hp('4%'),width:hp('1.6%'),height:hp('2.7%')}}/>
      </View>
    );
  }
}

// define your styles
const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    width:'95%',
    height:hp('10%'),
    marginBottom: hp('1.7%'),
    backgroundColor: colors.white,
    elevation: 4,
    borderRadius: 6,
    paddingLeft: hp('2.5%'),
  },
});

export default Option;
