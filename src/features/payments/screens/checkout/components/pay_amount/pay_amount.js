import React, { Component } from 'react';
import { Image, View } from 'react-native';
import { TextMontserrat } from 'components';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import MaskedInput from './MaskedInput';
import { isPortrait } from '../../../../../../api';

export class PayAmount extends Component {
  constructor(props) {
    super(props);
    this.payment = this.props.payment;
  }
  state = {
    toPay: this.props.payment.getAmountToPay(),
  };

  render() {
    console.log('AMOUNT_TO_PAY', this.props.payAmount);
    return (
      <View>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginVertical: hp('2%'),
            marginHorizontal: hp('2.8%'),
          }}
        >
          <TextMontserrat
            style={{
              color: '#52565F',
              fontWeight: '700',
              fontSize: isPortrait ? wp('3.8%') : hp('3%'),
            }}
          >
            AMOUNT PAID
          </TextMontserrat>
          <TextMontserrat
            style={{
              color: '#52565F',
              fontWeight: '700',
              fontSize: isPortrait ? wp('3.8%') : hp('3%'),
            }}
          >
            ₹{this.payment.getAmountPaid().toFixed(2)}
          </TextMontserrat>
        </View>
        {/* ---------------------------------------------- */}
        <View
          activeOpacity={0.7}
          onPress={() => {
            this.setState({
              payCant: 0,
            });
          }}
          style={{
            width: '100%',
            height: hp('9%'),
            justifyContent: 'center',
          }}
        >
          <Image
            style={{
              width: '100%',
              height: '100%',
              position: 'absolute',
            }}
            resizeMode="stretch"
            source={require('../../../../assets/img/rectangle_medium_radius.png')}
          />
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              paddingHorizontal: 20,
              alignItems: 'center',
            }}
          >
            <TextMontserrat
              style={{
                fontWeight: '600',
                fontSize: isPortrait ? wp('3.8%') : hp('2.6%'),
                color: '#47525D',
              }}
            >
              PAY AMOUNT
            </TextMontserrat>
            <MaskedInput
              ref={input => (this.maskInput = input)}
              maxLength={15}
              style={{
                flex: 1,
                height: 50,
                color: '#47525D',
                paddingBottom: 0,
                paddingTop: 0,
                fontWeight: '500',
                textAlign: 'right',
                fontSize: isPortrait ? wp('3.8%') : hp('2.8%'),
              }}
              defaultValue={this.props.payAmount}
              maskType="money"
              currencySymbol="₹"
              currencySeparator="."
              maxAmount={this.payment.getAmountToPay()}
              onChangeValue={value => {
                this.setState({ toPay: value }, () => {
                  this.props.onChangeAmount(value);
                });
              }}
            />
          </View>
        </View>
        {/* ---------------------------------------- */}
        <View style={{ alignItems: 'flex-end', marginHorizontal: hp('2.8%') }}>
          <TextMontserrat
            style={{
              color: '#D0021B',
              fontWeight: '600',
              fontSize: isPortrait ? wp('2.8%') : hp('2%'),
            }}
          >
            Balance Amount: ₹
            {(this.payment.getAmountToPay() - this.state.toPay).toFixed(2)}
          </TextMontserrat>
        </View>
      </View>
    );
  }
}
