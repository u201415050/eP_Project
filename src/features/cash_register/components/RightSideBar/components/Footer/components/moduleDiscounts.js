import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import Swipeout from 'react-native-swipeout';
import { formatNumberCommasDecimal } from 'api';
import { isTablet } from '../../../../../../fingerprint/constants/isLandscape';
import realm from '../../../../../../../services/realm_service';

class ModuleDiscounts extends Component {
  state = {
    indexDelete: 0,
  };
  render() {
    const {
      totalDiscount,
      subTotal,
      deliveryCharge,
      sgstTax,
      cgstTax,
      igstTax,
      cessTax,
      vatTax,
      type,
      discount,
      subTotalContainer,
      removeDiscount,
      removeDelivery,
      order,
    } = this.props;

    const removeAction = callback => {
      if (realm.isInTransaction) {
        realm.cancelTransaction();
      }
      return callback;
    };

    const swipeBtns = [
      {
        component: <Text style={styles.swipeBtns}>Delete</Text>,
        backgroundColor: '#FFACB6',
        autoClose: true,
        onPress:
          this.state.indexDelete == 1
            ? removeAction(removeDiscount)
            : this.state.indexDelete == 2
            ? removeAction(removeDelivery)
            : null,
      },
    ];
    const strTotal = formatNumberCommasDecimal(
      parseFloat(order.totalPrice > 0 ? order.totalPrice : 0).toFixed(2)
    );
    const toDecimal = (number, decimals) => {
      return (
        Math.round(
          number.toFixed(decimals.toString().length - 1) * decimals +
            Number.EPSILON
        ) / decimals
      );
    };
    return (
      <View style={styles.container}>
        {subTotal > 0 ? (
          <View style={{ width: '100%' }}>
            {igstTax > 0 ? (
              <View style={subTotalContainer}>
                <Text style={styles.subTextGray}>IGST</Text>
                <Text style={[styles.subTextGray, styles.subTextBlue]}>
                  ₹{toDecimal(igstTax, 100).toFixed(2)}
                </Text>
              </View>
            ) : null}
            {sgstTax > 0 ? (
              <View style={subTotalContainer}>
                <Text style={styles.subTextGray}>SGST</Text>
                <Text style={[styles.subTextGray, styles.subTextBlue]}>
                  ₹{toDecimal(sgstTax, 100).toFixed(2)}
                </Text>
              </View>
            ) : null}
            {cgstTax > 0 ? (
              <View style={subTotalContainer}>
                <Text style={styles.subTextGray}>CGST</Text>
                <Text style={[styles.subTextGray, styles.subTextBlue]}>
                  ₹{toDecimal(cgstTax, 100).toFixed(2)}
                </Text>
              </View>
            ) : null}
            {cessTax > 0 ? (
              <View style={subTotalContainer}>
                <Text style={styles.subTextGray}>CESS</Text>
                <Text style={[styles.subTextGray, styles.subTextBlue]}>
                  ₹{toDecimal(cessTax, 100).toFixed(2)}
                </Text>
              </View>
            ) : null}
            {vatTax > 0 ? (
              <View style={subTotalContainer}>
                <Text style={styles.subTextGray}>VAT</Text>
                <Text style={[styles.subTextGray, styles.subTextBlue]}>
                  ₹{toDecimal(vatTax, 100).toFixed(2)}
                </Text>
              </View>
            ) : null}
            {/*<View style={[subTotalContainer, { paddingTop: hp('0.1%') }]}>
              <Text style={styles.subTextGray}>CGST@9%</Text>
              <Text style={[styles.subTextGray, styles.subTextBlue]}>
                ₹{formatNumberCommasDecimal(parseFloat(cgst).toFixed(2))}
              </Text>
            </View>*/}
          </View>
        ) : null}
        <View style={subTotalContainer}>
          <Text
            style={[
              styles.textDark2,
              strTotal.length > 8
                ? { fontSize: hp(isTablet ? '2.8%' : '2.5%') }
                : null,
            ]}
          >
            {totalDiscount > 0 || deliveryCharge > 0
              ? 'Total Amount'
              : 'Total Payable'}
          </Text>
          <Text
            style={[
              styles.textDark2,
              styles.TextBlue2,
              strTotal.length > 8
                ? { fontSize: hp(isTablet ? '2.8%' : '2.5%') }
                : null,
            ]}
          >
            ₹
            {totalDiscount > 0 || deliveryCharge > 0
              ? order.subTotalWithTaxes.toFixed(2)
              : formatNumberCommasDecimal(
                  parseFloat(order.totalPrice).toFixed(2)
                )}
          </Text>
        </View>
        {totalDiscount > 0 ? (
          <Swipeout
            right={swipeBtns}
            autoClose={true}
            backgroundColor={'transparent'}
            buttonWidth={hp('11%')}
            onOpen={() => {
              this.setState({ indexDelete: 1 });
            }}
            onClose={() => {
              this.setState({ indexDelete: 0 });
            }}
          >
            <View style={subTotalContainer}>
              <Text style={styles.subTextOrange}>
                Discount@{type === '%' ? '' : 'Rs. '}
                {type === '%'
                  ? parseFloat(order.generalDiscount).toFixed(2)
                  : parseFloat(order.generalDiscount).toFixed(2)}
                {type === '%' ? '%' : ''}
              </Text>
              <Text style={[styles.subTextOrange, styles.textOrange]}>
                ₹
                {formatNumberCommasDecimal(
                  parseFloat(totalDiscount).toFixed(2)
                )}
              </Text>
            </View>
          </Swipeout>
        ) : null}
        {deliveryCharge > 0 ? (
          <Swipeout
            sensitivity={1}
            right={swipeBtns}
            autoClose={true}
            backgroundColor={'transparent'}
            buttonWidth={hp('11%')}
            onOpen={() => {
              this.setState({ indexDelete: 2 });
            }}
            onClose={() => {
              this.setState({ indexDelete: 0 });
            }}
          >
            <View style={subTotalContainer}>
              <Text style={styles.subTextGray}>Delivery Charge</Text>
              <Text style={[styles.subTextGray, styles.subTextBlue]}>
                ₹
                {formatNumberCommasDecimal(
                  parseFloat(deliveryCharge).toFixed(2)
                )}
              </Text>
            </View>
          </Swipeout>
        ) : null}
        {totalDiscount > 0 || deliveryCharge > 0 ? (
          <View style={subTotalContainer}>
            <Text
              style={[
                styles.textDark2,
                strTotal.length > 8
                  ? { fontSize: hp(isTablet ? '2.8%' : '2.5%') }
                  : null,
              ]}
            >
              Total Payable
            </Text>
            <Text
              style={[
                styles.textDark2,
                styles.TextBlue2,
                strTotal.length > 8
                  ? { fontSize: hp(isTablet ? '2.8%' : '2.5%') }
                  : null,
              ]}
            >
              ₹{toDecimal(order.totalPrice, 100).toFixed(2)}
            </Text>
          </View>
        ) : null}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginBottom: hp('0.80'),
  },
  swipeBtns: {
    fontFamily: 'Montserrat-SemiBold',
    fontSize: hp('2.09%'),
    color: '#D0021B',
    width: '100%',
    height: '100%',
    textAlign: 'center',
    textAlignVertical: 'center',
  },
  subTextOrange: {
    fontSize: hp(isTablet ? '2.5%' : '2.2%'),
    color: '#FF6000',
    fontFamily: 'Montserrat-Bold',
    paddingLeft: hp('2.1%'),
  },
  textOrange: {
    paddingRight: hp('2.2%'),
  },
  subTextGray: {
    fontSize: hp(isTablet ? '2.5%' : '2.2%'),
    color: '#47525D',
    fontFamily: 'Montserrat-Bold',
    paddingLeft: hp('2.1%'),
  },
  subTextBlue: {
    color: '#174285',
    paddingRight: hp('2.2%'),
  },
  textDark2: {
    fontSize: hp(isTablet ? '3%' : '2.8%'),
    letterSpacing: wp('0.03%'),
    color: '#47525D',
    fontFamily: 'Montserrat-Bold',
    paddingBottom: hp('1%'),
    paddingLeft: hp('2.1%'),
  },
  TextBlue2: {
    color: '#174285',
    fontSize: hp(isTablet ? '3%' : '2.8%'),
    letterSpacing: wp('0.03%'),
    paddingRight: hp('2.2%'),
  },
});

export default ModuleDiscounts;
