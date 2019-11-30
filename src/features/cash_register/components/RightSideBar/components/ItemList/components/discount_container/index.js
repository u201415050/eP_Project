import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { formatNumberCommasDecimal } from 'api';
import { TextMontserrat } from 'components';
import { styles } from './styles';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';

class DiscountProduct extends Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  render() {
    const item = this.props.item;

    return (
      <View style={{ width: '100%', flexDirection: 'row' }}>
        <View style={{ width: '15%' }} />
        <View style={{ width: '53%' }}>
          <TextMontserrat style={styles}>
            — Discount{' '}
            {item.discountType == '%'
              ? `@ ${parseFloat(item.discountEntered).toFixed(2)}%`
              : `@ ₹${parseFloat(item.discountEntered).toFixed(2)}`}
          </TextMontserrat>
        </View>
        <View
          style={{
            width: '32%',
            alignItems: 'flex-end',
            paddingRight: wp('4%'),
          }}
        >
          <TextMontserrat style={styles}>
            {'₹ '}
            {item.discountType == '%'
              ? formatNumberCommasDecimal(
                  parseFloat(
                    (item.unitPrice * item.quantity * item.discountEntered) /
                      100
                  ).toFixed(2)
                )
              : formatNumberCommasDecimal(
                  parseFloat(item.discountEntered).toFixed(2)
                )}
          </TextMontserrat>
        </View>
      </View>
    );
  }
}

export default DiscountProduct;
