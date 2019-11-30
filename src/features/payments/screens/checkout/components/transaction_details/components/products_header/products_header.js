import React, { Component } from 'react';
import { View, Image, TouchableOpacity, Animated } from 'react-native';
import { TextMontserrat } from 'components';
import EStyleSheet from 'react-native-extended-stylesheet';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
class ProductsHeader extends Component {
  render() {
    return (
      <View style={headerStyle.headerContainer}>
        <View style={{ flex: 1,alignItems:'center' }}>
          <TextMontserrat style={headerStyle.headerText}>S No.</TextMontserrat>
        </View>
        <View style={{ flex: 3 }}>
          <TextMontserrat style={headerStyle.headerText}>
            Description
          </TextMontserrat>
        </View>
        <View style={{ flex: 1.5, alignItems: 'center' }}>
          <TextMontserrat style={headerStyle.headerText}>Qty</TextMontserrat>
        </View>
        <View
          style={{
            flex: 2.5,
            alignItems: 'flex-end',
          }}
        >
          <TextMontserrat style={headerStyle.headerText}>Price</TextMontserrat>
        </View>
      </View>
    );
  }
}

const TEXT_COLOR = '#47525D';
const TEXT_COLOR_LIGHT = '#5D6770';
const TEXT_COLOR_ACTIVE = '#174285';
const headerStyle = EStyleSheet.create({
  headerContainer: {
    borderBottomWidth: 1,
    borderColor: '#ddd',
    flexDirection: 'row',
    paddingRight: '2rem',
    paddingLeft: hp('1%'),
    paddingVertical: '.5rem',
  },
  headerText: {
    fontSize: hp('1.7%'),//'1.3rem',
    fontWeight: '700',
    color: TEXT_COLOR,
  },
});

export default ProductsHeader;