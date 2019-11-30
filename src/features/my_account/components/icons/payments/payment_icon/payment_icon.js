import React, { Component } from 'react';
import { Image, TouchableOpacity,View } from 'react-native';
import * as screen_names from './../payment_names';
class PaymentIcon extends Component {
  render() {
    const DISABLED = this.props.disabled;

    const images = {
      [screen_names.RUPAY]: DISABLED
        ? require(`./../assets/icons/rupay_disabled.png`)
        : require(`./../assets/icons/rupay.png`),
      [screen_names.RUPAY]: DISABLED
        ? require(`./../assets/icons/rupay_disabled.png`)
        : require(`./../assets/icons/rupay.png`),
      [screen_names.MASTERCARD]: DISABLED
        ? require(`./../assets/icons/mastercard_disabled.png`)
        : require(`./../assets/icons/mastercard.png`),
      [screen_names.MAESTRO]: DISABLED
        ? require(`./../assets/icons/maestro_disabled.png`)
        : require(`./../assets/icons/maestro.png`),
      [screen_names.DINERS]: DISABLED
        ? require(`./../assets/icons/diners_disabled.png`)
        : require(`./../assets/icons/diners.png`),
      [screen_names.VISA]: DISABLED
        ? require(`./../assets/icons/visa_disabled.png`)
        : require(`./../assets/icons/visa.png`),
      [screen_names.DISCOVER]: DISABLED
        ? require(`./../assets/icons/discover_disabled.png`)
        : require(`./../assets/icons/discover.png`),

      [screen_names.FREECHARGE]: DISABLED
        ? require(`./../assets/icons/freecharge_disabled.png`)
        : this.props.main
        ? require('./../assets/icons/freecharge_main.png')
        : require(`./../assets/icons/freecharge.png`),
      [screen_names.CITRUS]: DISABLED
        ? require(`./../assets/icons/citrus_disabled.png`)
        : this.props.main
        ? require('./../assets/icons/citrus_main.png')
        : require(`./../assets/icons/citrus.png`),
      [screen_names.POCKETS]: DISABLED
        ? require(`./../assets/icons/pockets_disabled.png`)
        : this.props.main
        ? require('./../assets/icons/pockets_main.png')
        : require(`./../assets/icons/pockets.png`),
      [screen_names.M_PESA]: DISABLED
        ? require(`./../assets/icons/mpesa_disabled.png`)
        : this.props.main
        ? require('./../assets/icons/mpesa_main.png')
        : require(`./../assets/icons/mpesa.png`),
      [screen_names.OLA_MONEY]: DISABLED
        ? require(`./../assets/icons/olamoney_disabled.png`)
        : this.props.main
        ? require('./../assets/icons/olamoney_main.png')
        : require(`./../assets/icons/olamoney.png`),
      [screen_names.MOBIKWIK]: DISABLED
        ? require(`./../assets/icons/mobikwik_disabled.png`)
        : this.props.main
        ? require('./../assets/icons/mobikwik_main.png')
        : require(`./../assets/icons/mobikwik.png`),

      [screen_names.SPLIT]: DISABLED
        ? require(`./../assets/icons/split_disabled.png`)
        : require(`./../assets/icons/split.png`),
      [screen_names.AADHAARPAY]: DISABLED
        ? require(`./../assets/icons/aadhaarpay_disabled.png`)
        : require(`./../assets/icons/aadhaarpay.png`),
      [screen_names.CHEQUE]: DISABLED
        ? require(`./../assets/icons/cheque_disabled.png`)
        : require(`./../assets/icons/cheque.png`),
      [screen_names.WALLETS]: DISABLED
        ? require(`./../assets/icons/wallets_disabled.png`)
        : require(`./../assets/icons/wallets.png`),
      [screen_names.UPI]: DISABLED
        ? require(`./../assets/icons/upi_disabled.png`)
        : this.props.main
        ? require('./../assets/icons/upi_main.png')
        : require('./../assets/icons/upi.png'),
      [screen_names.UPI_QR]: DISABLED
        ? require(`./../assets/icons/upiqr_disabled.png`)
        : this.props.main
        ? require('./../assets/icons/upiqr_main.png')
        : require(`./../assets/icons/upiqr.png`),
      [screen_names.OTHERS]: DISABLED
        ? require(`./../assets/icons/others_disabled.png`)
        : require(`./../assets/icons/others.png`),

      [screen_names.EMI]: DISABLED
        ? require(`./../assets/icons/emi_disabled.png`)
        : require(`./../assets/icons/emi.png`),
      [screen_names.EMI_PAYMENTS]: DISABLED
        ? require(`./../assets/icons/emi_disabled.png`)
        : require(`./../assets/icons/emi.png`),
      [screen_names.CASH]: DISABLED
        ? require(`./../assets/icons/cash_disabled.png`)
        : require(`./../assets/icons/cash.png`),
      [screen_names.TENDERING]: DISABLED
        ? require(`./../assets/icons/tendering_disabled.png`)
        : require(`./../assets/icons/tendering.png`),
      [screen_names.CARD]: DISABLED
        ? require(`./../assets/icons/card_disabled.png`)
        : require(`./../assets/icons/card.png`),
      [screen_names.CASH_POS]: DISABLED
        ? require(`./../assets/icons/cashpos_disabled.png`)
        : require(`./../assets/icons/cashpos.png`),
      [screen_names.UPI_PAYMENTS]: DISABLED
        ? require(`./../assets/icons/upi_payments_disabled.png`)
        : require(`./../assets/icons/upi_payments.png`),
    };
    const { size } = this.props;
    return (
      <TouchableOpacity disabled={DISABLED&&this.props.container} style={this.props.styleCustom} onPress={this.props.onPress} activeOpacity={0.6}>
        
        <Image
          style={{
            width: this.props.size || 60,
            height: this.props.size || 60,
            
          }}
          resizeMode="contain"
          source={images[this.props.iconName]}
        />
       { !DISABLED&&!this.props.container&&this.props.section?<View style={{position:'absolute',borderColor:'green',
            borderWidth:2,width: this.props.size*(this.props.iconName==screen_names.OTHERS?1:0.95) || 60,
            height: this.props.size*(this.props.iconName==screen_names.OTHERS?1:0.95) || 60,borderRadius:this.props.size || 60}}/>:null}
      </TouchableOpacity>
    );
  }
}

export default PaymentIcon;
