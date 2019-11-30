import React, { Component } from 'react';
import { View, Image, TouchableOpacity, Animated } from 'react-native';
import { TextMontserrat } from 'components';
import { formatNumberCommasDecimal } from 'api';
import EStyleSheet from 'react-native-extended-stylesheet';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';

class ProductsItem extends Component {
  render() {
    const { product, taxes, number } = this.props;
    return (
      <View style={content.headerContainer}>
        <View style={content.headerDetail}>
          <View style={{ flex: 1, alignItems: 'center' }}>
            <TextMontserrat style={content.headerText}>
              {number}.
            </TextMontserrat>
          </View>
          <View style={{ flex: 3 }}>
            <TextMontserrat numberOfLines={1} style={content.headerText}>
              {product.name}
            </TextMontserrat>
          </View>
          <View style={{ flex: 1.5, alignItems: 'center' }}>
            <TextMontserrat style={content.headerText}>
              {product.quantity}
            </TextMontserrat>
          </View>
          <View
            style={{
              flex: 2.5,
              alignItems: 'flex-end',
            }}
          >
            <TextMontserrat style={content.headerTextTotal}>
              ₹
              {formatNumberCommasDecimal(
                (
                  parseFloat(product.quantity) * parseFloat(product.unitPrice)
                ).toFixed(2)
              )}
            </TextMontserrat>
          </View>
        </View>
        {/* DISCOUNTS*/
        product.calculatedDiscount != 0 ? (
          <View style={content.headerDetail}>
            <View style={{ flex: 1 }}>
              <TextMontserrat style={content.headerText}> </TextMontserrat>
            </View>
            <View style={{ flex: 4.5 }}>
              <TextMontserrat style={content.headerDisc}>
                — Discount{' '}
                {product.discountType == '%'
                  ? `@ ${parseFloat(product.discountEntered)}%`
                  : `@ ₹${parseFloat(product.discountEntered)}`}
              </TextMontserrat>
            </View>
            
            <View
              style={{
                flex: 2.5,
                alignItems: 'flex-end',
              }}
            >
              <TextMontserrat style={content.headerDisc}>
                ₹
                {product.discountType == '%'
                  ? formatNumberCommasDecimal(
                      parseFloat(product.calculatedDiscount).toFixed(2)
                    )
                  : formatNumberCommasDecimal(
                      parseFloat(product.discountEntered).toFixed(2)
                    )}
              </TextMontserrat>
            </View>
          </View>
        ) : null}
        {/* IGST*/
        product.igst != 0 && taxes ? (
          <View style={content.headerDetail}>
            <View style={{ flex: 1 }}>
              <TextMontserrat style={content.headerText}> </TextMontserrat>
            </View>
            <View style={{ flex: 3 }}>
              <TextMontserrat style={content.headerTaxes}>
                ̶— IGST {`@ ${parseFloat(product.igst)}%`}
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
              <TextMontserrat style={content.taxesDetails}>
                ₹
                {formatNumberCommasDecimal(
                  (
                    (parseFloat(product.unitPrice) * parseFloat(product.igst)) /
                    100
                  ).toFixed(2)
                )}
              </TextMontserrat>
            </View>
          </View>
        ) : null}
        {/* SGST */
        product.sgst != 0 && taxes ? (
          <View style={content.headerDetail}>
            <View style={{ flex: 1 }}>
              <TextMontserrat style={content.headerText}> </TextMontserrat>
            </View>
            <View style={{ flex: 3 }}>
              <TextMontserrat style={content.headerTaxes}>
                ̶— SGST {`@ ${parseFloat(product.sgst)}%`}
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
              <TextMontserrat style={content.taxesDetails}>
                ₹
                {formatNumberCommasDecimal(
                  (
                    (parseFloat(product.unitPrice) * parseFloat(product.sgst)) /
                    100
                  ).toFixed(2)
                )}
              </TextMontserrat>
            </View>
          </View>
        ) : null}
        {/* CGST */
        product.cgst != 0 && taxes ? (
          <View style={content.headerDetail}>
            <View style={{ flex: 1 }}>
              <TextMontserrat style={content.headerText}> </TextMontserrat>
            </View>
            <View style={{ flex: 3 }}>
              <TextMontserrat style={content.headerTaxes}>
                ̶— CGST {`@ ${parseFloat(product.cgst)}%`}
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
              <TextMontserrat style={content.taxesDetails}>
                ₹
                {formatNumberCommasDecimal(
                  (
                    (parseFloat(product.unitPrice) * parseFloat(product.cgst)) /
                    100
                  ).toFixed(2)
                )}
              </TextMontserrat>
            </View>
          </View>
        ) : null}
        {/* CESS */
        product.cess != 0 && taxes ? (
          <View style={content.headerDetail}>
            <View style={{ flex: 1 }}>
              <TextMontserrat style={content.headerText}> </TextMontserrat>
            </View>
            <View style={{ flex: 3 }}>
              <TextMontserrat style={content.headerTaxes}>
                ̶— CESS {`@ ${parseFloat(product.cess)}%`}
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
              <TextMontserrat style={content.taxesDetails}>
                ₹
                {formatNumberCommasDecimal(
                  (
                    (parseFloat(product.unitPrice) * parseFloat(product.cess)) /
                    100
                  ).toFixed(2)
                )}
              </TextMontserrat>
            </View>
          </View>
        ) : null}
        {/* VAT */
        product.vat != 0 && taxes ? (
          <View style={content.headerDetail}>
            <View style={{ flex: 1 }}>
              <TextMontserrat style={content.headerText}> </TextMontserrat>
            </View>
            <View style={{ flex: 3 }}>
              <TextMontserrat style={content.headerTaxes}>
                ̶— VAT {`@ ${parseFloat(product.vat)}%`}
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
              <TextMontserrat style={content.taxesDetails}>
                ₹
                {formatNumberCommasDecimal(
                  (
                    (parseFloat(product.unitPrice) * parseFloat(product.vat)) /
                    100
                  ).toFixed(2)
                )}
              </TextMontserrat>
            </View>
          </View>
        ) : null}
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
  headerDetail: {
    flexDirection: 'row',
    paddingRight: '2rem',
    paddingLeft: hp('1%'),
    paddingTop: '.2rem',
  },
  headerText: {
    fontSize: hp('1.9%'), //'1.4rem',
    fontWeight: '600',
    color: TEXT_COLOR,
  },
  headerTextTotal: {
    fontSize: hp('1.9%'), //'1.4rem',
    fontWeight: '600',
    color: TEXT_COLOR_ACTIVE,
  },
  headerDisc: {
    fontSize: hp('1.7%'), //'1.2rem',
    fontWeight: '600',
    color: '#FF6000',
  },
  headerTaxes: {
    fontSize: hp('1.7%'), //'1.2rem',
    fontWeight: '600',
    color: TEXT_COLOR,
  },
  taxesDetails: {
    fontSize: hp('1.7%'), //'1.2rem',
    fontWeight: '600',
    color: TEXT_COLOR_ACTIVE,
  },
});

export default ProductsItem;
