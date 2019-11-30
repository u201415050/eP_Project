import React, { Component } from 'react';
import { View, Image, Dimensions } from 'react-native';
import { TextMontserrat } from 'components';
import * as portraitStyles from './styles/portrait';
import * as landscapeStyles from './styles/landscape';

const isPortrait = () => {
  const dim = Dimensions.get('window');
  if (dim.height >= dim.width) {
    return true;
  } else {
    return false;
  }
};

class TransactionItem extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isPortrait: isPortrait(),
    };
  }

  selectName = data => {
    const payment = data.payment;
    if (payment.toUpperCase().indexOf('CASH') != -1) {
      return 'Cash';
    } else if (payment.toUpperCase().indexOf('CHEQUE') != -1) {
      return 'Cheque';
    } else if (payment.toUpperCase().indexOf('EMI') != -1) {
      return 'EMI';
    } else if (payment.toUpperCase().indexOf('WALLET') != -1) {
      const wallet_types = {
        5: 'Citrus',
        8: 'Freecharge',
        9: 'Ola',
        17: 'Mobikwik',
        19: 'Pockets',
        25: 'm-Pesa',
      };
      return wallet_types[data.transactionTypeId] + ' Wallet';
    } else if (payment.toUpperCase().indexOf('UPI') != -1) {
      return 'UPI';
    } else {
      return 'Split';
    }
  };
  selectIcon = payment => {
    switch (payment) {
      case 'Card':
        return require('./assets/icons/card.png');
      case 'Cash':
        return require('./assets/icons/cash.png');
      case 'Cheque':
        return require('./assets/icons/cheque.png');
      case 'EMI':
        return require('./assets/icons/emi.png');
      case 'Citrus Wallet':
      case 'Freecharge Wallet':
      case 'Ola Wallet':
      case 'Mobikwik Wallet':
      case 'Pockets Wallet':
      case 'm-Pesa Wallet':
        return require('./assets/icons/wallet.png');
      case 'UPI':
        return require('./assets/icons/upi.png');
      default:
        return require('./assets/icons/split.png');
    }
  };

  render() {
    const styles = this.state.isPortrait
      ? portraitStyles.styles
      : landscapeStyles.styles;
    const payment = this.props.payment;
    const name = this.selectName(payment);
    const image = this.selectIcon(name);

    return (
      <View style={styles.container}>
        <Image source={image} style={styles.image} />
        <View style={styles.containerPayment}>
          <TextMontserrat style={styles.paymentLabel}>{name}</TextMontserrat>
          <TextMontserrat style={styles.invoiceLabel}>
            {'Invoice No. ' + payment.invoice}
          </TextMontserrat>
        </View>
        <View style={styles.containerTotal}>
          <TextMontserrat style={styles.totalLabel}>
            {'₹' + payment.total}
          </TextMontserrat>
          <TextMontserrat style={styles.dateLabel}>
            {payment.date}
          </TextMontserrat>
        </View>
      </View>
    );
  }
}

export default TransactionItem;
