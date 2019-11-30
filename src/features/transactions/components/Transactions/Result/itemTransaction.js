//import liraries
import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import moment from 'moment';
import { TextMontserrat } from 'components';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { isTablet } from '../../../../cash_register/constants/isLandscape';
import { formatNumberCommasDecimal } from 'api';
class ItemTransaction extends Component {
  getColor(tipo) {
    if (tipo == 'APPROVED') {
      return '#8FC742';
    } else if (tipo == 'SETTLED') {
      return '#04A754';
    } else if (tipo == 'PENDING') {
      return '#EADF00';
    } else if (tipo == 'FAILED') {
      return '#FF3D00';
    } else if (tipo == 'CANCELLED') {
      return '#F16623';
    } else if (tipo == 'DEPOSITED') {
      return '#2D8586';
    } else if (tipo == 'VOIDED') {
      return '#640563';
    } else if (tipo == 'REFUNDED') {
      return '#EB6BAA';
    } else {
      return 'gray';
    }
  }
  getImage(nom) {
    if (nom.indexOf('Cash') != -1) {
      return require('../../../assets/img/Cash.png');
    } else if (nom.indexOf('Card') != -1) {
      return require('../../../assets/img/Card.png');
    } else if (nom.indexOf('Wallet') != -1) {
      return require('../../../assets/img/wallets.png');
    } else if (nom.indexOf('UPI') != -1) {
      return require('../../../assets/img/upi.png');
    } else if (nom.indexOf('Split') != -1) {
      return require('../../../assets/img/split.png');
    } else if (nom.indexOf('Cheque') != -1) {
      return require('../../../assets/img/cheque.png');
    } else if (nom.indexOf('EMI') != -1) {
      return require('../../../assets/img/emi.png');
    } else {
      return require('../../../assets/img/Card.png');
    }
  }
  getType(nom) {
    if (nom.indexOf('Cash') != -1) {
      return 'Cash';
    } else if (nom.indexOf('Card') != -1) {
      return 'Card';
    } else if (nom.indexOf('Wallet') != -1) {
      return 'Wallet';
    } else if (nom.indexOf('UPI') != -1) {
      return 'UPI';
    } else if (nom.indexOf('Split') != -1) {
      return 'Split';
    } else if (nom.indexOf('Cheque') != -1) {
      return 'Cheque';
    } else if (nom.indexOf('EMI') != -1) {
      return 'EMI';
    } else return 'Card';
  }
  getIfCard = name => {
    if (name.indexOf('ePaisa') != -1) {
      return 'Card Payment';
    } else {
      return name;
    }
    //if()
  };
  render() {
    const {
      openDetails,
      day,
      item,
      index,
      length,
      textSearch,
      indexOf,
      customerData,
    } = this.props;
    return (
      <TouchableOpacity
        onPress={() => {
          let newItem = { ...item, ...customerData };
          openDetails(newItem);
        }}
        key={index}
        style={{ flex: 1, marginBottom: index + 1 == length ? hp('1%') : 0 }}
      >
        <View style={styles.card}>
          <View style={styles.inone}>
            <View style={styles.inin}>
              <Image
                style={styles.img}
                source={this.getImage(item.transactionType)}
              />
            </View>
            <View style={{ justifyContent: 'space-between' }}>
              <View style={styles.inFour}>
                <TextMontserrat style={styles.item}>
                  {this.getType(item.transactionType)}
                </TextMontserrat>
                <TextMontserrat style={styles.date}>
                  {moment(day).format('DD') + moment(day).format(' MMM YYYY')}
                </TextMontserrat>
              </View>
              <View style={{ marginBottom: hp('0.5%') }}>
                {textSearch != '' ? (
                  item.paymentId.toString().indexOf(textSearch) != -1 ? (
                    <View style={{ flexDirection: 'row' }}>
                      <TextMontserrat style={styles.inv}>
                        Payment ID{' '}
                      </TextMontserrat>
                      <TextMontserrat style={styles.inv}>
                        {item.paymentId.toString().substr(0, indexOf)}
                      </TextMontserrat>
                      <TextMontserrat style={styles.high}>
                        {textSearch}
                      </TextMontserrat>
                      <TextMontserrat style={styles.inv}>
                        {item.paymentId
                          .toString()
                          .substr(indexOf + textSearch.length)}
                      </TextMontserrat>
                    </View>
                  ) : (
                    <TextMontserrat style={styles.inv}>
                      Payment ID {item.paymentId}
                    </TextMontserrat>
                  )
                ) : (
                  <TextMontserrat style={styles.inv}>
                    Payment ID {item.paymentId}
                  </TextMontserrat>
                )}
              </View>
            </View>
          </View>
          <View style={styles.inthree}>
            <TextMontserrat
              style={{
                ...styles.price,
                color: this.getColor(item.transactionStatus.toUpperCase()),
              }}
            >
              ₹
              {formatNumberCommasDecimal(
                parseFloat(item.transactionAmount).toFixed(2)
              )}
            </TextMontserrat>
            <TextMontserrat
              style={{
                fontSize: isTablet ? hp('1.85%') : hp('1.5%'),
                color: 'rgba(0,0,0,0.5)',
                fontWeight: '700',
              }}
            >
              {' '}
              {item.transactionStatus.toUpperCase()}
            </TextMontserrat>
          </View>
        </View>
      </TouchableOpacity>
    );
  }
}

// define your styles
const styles = StyleSheet.create({
  container: {
    width: '100%',
    flex: 1,
  },
  item: {
    color: '#52565F',
    fontSize: isTablet ? hp('3%') : hp('2.2%'),
    fontWeight: '800',
  },
  date: {
    fontSize: isTablet ? hp('1.85%') : hp('1.5%'),
    letterSpacing: hp('0.1%'),
    fontWeight: '700',
    color: '#888888',
    marginTop: hp('0.5%'),
    marginLeft: isTablet ? wp('1%') : wp('3%'),
  },
  inv: {
    fontSize: isTablet ? hp('2%') : hp('1.6%'),
    fontWeight: '700',
    color: '#888888',
  },
  high: {
    fontSize: hp('1.6%'),
    fontWeight: '700',
    color: '#888888',
    backgroundColor: '#5AC8FA',
  },
  price: {
    color: '#8FC742',
    fontSize: isTablet ? hp('3%') : hp('2.1%'),
    fontWeight: '700',
    marginBottom: hp('0.5%'),
    letterSpacing: 1,
  },

  card: {
    paddingVertical: hp('1.4%'),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'white',
    borderWidth: 0.2,
    borderRadius: 2,
    paddingHorizontal: isTablet ? wp('2%') : wp('4%'),
    borderColor: '#ddd',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 4,
    marginTop: hp('1.5%'),
  },
  inone: {
    paddingLeft: hp('0.5%'),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  inFour: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginBottom: hp('0.4%'),
  },
  inthree: {
    alignItems: 'flex-end',
    justifyContent: 'center',
    marginBottom: hp('0.4%'),
  },
  inin: {
    paddingRight: hp('1.8%'),
  },
  img: {
    width: hp('7%'),
    height: hp('7%'),
  },
});

//make this component available to the app
export default ItemTransaction;
