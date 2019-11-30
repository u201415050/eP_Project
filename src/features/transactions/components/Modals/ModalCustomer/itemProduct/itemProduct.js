import React, { Component } from 'react';
import {
  Dimensions,
  View,
  Text,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
  Image,
  FlatList,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { TextMontserrat } from 'components';
import { formatNumberCommasDecimal } from '../../../../../../api';

class itemProduct extends Component {
  toDecimal(number, decimals) {
    decimals = decimals || 100;
    return (
      Math.round(
        number.toFixed(decimals.toString().length - 1) * decimals +
          Number.EPSILON
      ) / decimals
    );
  }
  render() {
    const { item } = this.props;

    return (
      <View style={styles.container}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'flex-start',
            alignItems: 'center',
            width: '100%',
            paddingHorizontal: wp('5%'),
          }}
        >
          <TextMontserrat
            style={{
              fontWeight: '700',
              fontSize: hp('1.7%'),
              flex: 2,
              textAlign: 'center',
            }}
          >
            {this.toDecimal(item.quantity)}
          </TextMontserrat>
          <TextMontserrat
            style={{
              fontWeight: '700',
              fontSize: hp('1.7%'),
              flex: 7,
              marginLeft: wp('2%'),
              textAlign: 'left',
            }}
          >
            {item.name}
          </TextMontserrat>
          <TextMontserrat
            style={{
              color: '#174285',
              fontWeight: '700',
              fontSize: hp('1.7%'),
              flex: 5,
              textAlign: 'right',
            }}
          >
            ₹
            {formatNumberCommasDecimal(
              parseFloat(
                item.calculatedPrice + item.calculatedDiscount
              ).toFixed(2)
            )}
          </TextMontserrat>
        </View>
        {item.discountEntered > 0 ? (
          <View
            style={{
              flexDirection: 'row',
              marginTop: hp('0.4%'),
              justifyContent: 'flex-start',
              alignItems: 'center',
              width: '100%',
              paddingHorizontal: wp('5%'),
            }}
          >
            <TextMontserrat
              style={{
                fontWeight: '700',
                fontSize: hp('1.7%'),
                flex: 2,
                textAlign: 'center',
              }}
            >
              {' '}
            </TextMontserrat>
            <TextMontserrat
              style={{
                color: '#FF6000',
                fontWeight: '700',
                fontSize: hp('1.7%'),
                flex: 7,
                marginLeft: wp('2%'),
                textAlign: 'left',
              }}
            >
              — Discount
              {item.discountType == '%'
                ? ' @ ' + item.discountEntered + '%'
                : ` @ ₹${parseFloat(item.discountEntered)}`}
            </TextMontserrat>
            <TextMontserrat
              style={{
                color: '#FF6000',
                fontWeight: '700',
                fontSize: hp('1.7%'),
                flex: 5,
                textAlign: 'right',
              }}
            >
              ₹{parseFloat(item.discount).toFixed(2)}
            </TextMontserrat>
          </View>
        ) : null}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginTop: hp('0.6%'),
  },
});

export default itemProduct;
