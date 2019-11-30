import React, { Component } from 'react';
import { View, Image, TouchableOpacity, Animated } from 'react-native';
import { TextMontserrat } from 'components';
import {formatNumberCommasDecimal} from 'api';
import EStyleSheet from 'react-native-extended-stylesheet';
class ProductsItem extends Component {
  render() {
    const {product} = this.props
    return (
      <View style={content.headerContainer}>
        <View style={content.headerDetail}>
          <View style={{ flex: 1 }}>
            <TextMontserrat style={content.headerText}>{product.id}.</TextMontserrat>
          </View>
          <View style={{ flex: 3 }}>
            <TextMontserrat style={content.headerText}>
              {product.name}
            </TextMontserrat>
          </View>
          <View style={{ flex: 1.5, alignItems: 'center' }}>
            <TextMontserrat style={content.headerText}>{product.quant}</TextMontserrat>
          </View>
          <View
            style={{
              flex: 2.5,
              alignItems: 'flex-end',
            }}
          >
            <TextMontserrat style={content.headerText}>₹{formatNumberCommasDecimal((parseFloat(product.quant)*parseFloat(product.unitPrice)).toFixed(2)) }</TextMontserrat>
          </View>
        </View>
        {/* DISCOUNTS*/
        product.discount!=0?
        <View style={content.headerDetail}>
          <View style={{ flex: 1 }}>
            <TextMontserrat style={content.headerText}> </TextMontserrat>
          </View>
          <View style={{ flex: 3 }}>
            <TextMontserrat style={content.headerDisc}>
            ̶— Discount {product.type=="%"? `@ ${parseFloat(product.discount)}%`:null}
            </TextMontserrat>
          </View>
          <View style={{ flex: 1.5, alignItems: 'center' }}>
            <TextMontserrat style={content.headerText}> </TextMontserrat>
          </View>
          <View
            style={{
              flex: 2.5,
              alignItems: 'flex-end',
            }}
          >
            <TextMontserrat style={content.headerDisc}>₹{product.type=="%"? formatNumberCommasDecimal((parseFloat(product.total)*parseFloat(product.discount)/100).toFixed(2)):formatNumberCommasDecimal(parseFloat(product.discount).toFixed(2))}</TextMontserrat>
          </View>
        </View>:null
      }
      </View>
    );
  }
}

const TEXT_COLOR = '#47525D';
const TEXT_COLOR_LIGHT = '#5D6770';
const TEXT_COLOR_ACTIVE = '#174285';
const content = EStyleSheet.create({
  headerContainer: {
    borderColor: TEXT_COLOR_LIGHT,
    paddingBottom: '.4rem',
  },
  headerDetail:{
    flexDirection: 'row',
    paddingHorizontal: '2rem',
    paddingTop: '.2rem',
  },
  headerText: {
    fontSize: '1.4rem',
    fontWeight: '600',
    color: TEXT_COLOR,
  },
  headerDisc: {
    fontSize: '1.2rem',
    fontWeight: '600',
    color: '#FF6000',
  },
});

export default ProductsItem;
