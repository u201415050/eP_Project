import React, { Component } from 'react';
import {
  Text,
  View,
  Image,
  Dimensions,
  TouchableOpacity,
  Modal,
  StyleSheet,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

import { connect } from 'react-redux';
import colors from '../../../modal_delivery/styles/colors';
import { isTablet } from '../../../fingerprint/constants/isLandscape';
import { TextMontserrat } from 'components';
import D3Transactions from '../D3/index';
import totalSales from '../totalSales/totalSales';
import { formatNumberCommasDecimal } from 'api';
class TransactionsGraphic extends Component {
  state = {
    show: false,
  };
  render() {
    const periodButton = () => {
      return (
        <TouchableOpacity
          style={{
            position: 'absolute',
            borderColor: '#174285',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingHorizontal: wp('2%'),
            paddingVertical: wp('1.5%'),
            borderRadius: wp('2%'),
            borderWidth: 3,
            right: wp('4.5%'),
            top: wp('2%'),
            flexDirection: 'row',
          }}
        >
          <TextMontserrat
            style={{
              paddingRight: wp('3.5%'),
              color: '#174285',
              fontSize: wp('3.5%'),
              fontWeight: '700',
              opacity: 0.9,
              letterSpacing: wp('0.2%'),
            }}
          >
            Week
          </TextMontserrat>
          <Image
            resizeMode="stretch"
            style={{
              tintColor: '#174285',
              height: wp('2.6%'),
              width: wp('3.1%'),
            }}
            source={require('../../assets/img/arrow_show_more.png')}
          />
        </TouchableOpacity>
      );
    };
    const { rangeDate, data } = this.props;
    ///const data = this.props.data.length==0?data2:data
    console.log(data);
    return (
      <View style={styles.container}>
        <View
          
          style={styles.header}
        >
          <TextMontserrat
            style={{
              color: '#222222',
              fontSize: isTablet ? hp('3.2%') : wp('5.8%'),
              opacity: 0.9,
              fontWeight: '700',
            }}
          >
            Transaction
          </TextMontserrat>
          <TextMontserrat
            style={{
              color: '#222222',
              fontSize: isTablet ? hp('1.7%') : wp('3%'),
              opacity: 0.6,
              fontWeight: '500',
              letterSpacing: isTablet ? hp('0.2%') : wp('0.3%'),
            }}
          >
            {rangeDate.from.format('MMM D, YYYY')} -{' '}
            {rangeDate.to.format('MMM D, YYYY')}
          </TextMontserrat>
        </View>
        <View style={styles.footer}>
          <View
            style={{
              marginTop: isTablet ? hp('6%') : hp('4%'),
            }}
          >
            {this.props.show ? (
              <D3Transactions
                ref={x => (this.graphic = x)}
                width={isTablet ? wp('50%') * 0.92 : wp('95%')}
                button="#AFCBF8"
                gradient="#B6D2FF"
                lineColor="#2F80F6"
                data={data}
              />
            ) : <View style={{width:'100%',color: '#222222', paddingVertical:hp('4%'),alignItems:'center'}}>
            <TextMontserrat style={{fontSize:hp('3%'), fontWeight:'800'}}>
              There's no transactions
            </TextMontserrat>
          </View>}
          </View>
        </View>
        <View
          style={{
            width: '100%',
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: isTablet ? 0 : hp('5%'),
            paddingVertical: hp('1%'),
          }}
        >
          <TextMontserrat
            style={{
              color: '#222222',
              fontSize: isTablet ? hp('2.2%') : wp('3.8%'),
              opacity: 0.5,
              fontWeight: '500',
            }}
          >
            Gross Sales
          </TextMontserrat>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Image
              source={require('../../assets/img/up.png')}
              style={{ width: (hp('3%') * 40) / 56, height: hp('3%') }}
            />
            <TextMontserrat
              style={{
                color: '#24272B',
                fontSize: isTablet ? hp('3.2%') : wp('5.8%'),
                fontWeight: '600',
              }}
            >
              {' '}
              ₹
              {formatNumberCommasDecimal(
                parseFloat(this.props.totalSales).toFixed(2)
              )}
            </TextMontserrat>
          </View>
        </View>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    width: isTablet ? '92%' : '95%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.darkWhite,
    elevation: 10,
    flex: 1,
    paddingTop: hp('4%'),
    borderRadius: wp('2%'),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
  },
  comExtra: {
    fontSize: wp('3.3%'),
    opacity: 0.5,
    color: '#222222',
    fontWeight: '800',
    letterSpacing: wp('0.4%'),
    marginTop: -hp('1%'),
  },
  ruppeSign: {
    fontSize: wp('7%'),
    opacity: 0.8,
    color: '#222222',
    marginTop: wp('4%'),
  },
  valueInteger: {
    fontSize: wp('20%'),
    color: '#222222',
    fontWeight: '200',
    marginLeft: wp('2%'),
  },
  valueDecimal: {
    fontSize: wp('6.6%'),
    color: '#222222',
    opacity: 0.7,
    fontWeight: '600',
    marginTop: wp('7%'),
    letterSpacing: wp('0.4%'),
  },
  header: {
    width: '100%',
    paddingHorizontal: isTablet ? hp('4%') : wp('5%'),
  },
  footer: {
    width: '100%',
    alignItems: 'center',
    marginTop: isTablet ? hp('3%') : hp('1.7%'),
  },
  bolTextCompany: {
    fontSize: wp('5%'),
    fontWeight: '800',
    color: '#455A64',
  },
  bolValues: {
    fontSize: wp('3.5%'),
    fontWeight: '500',
    color: '#737A92',
  },
  indicators: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: hp('2%'),
    paddingHorizontal: wp('3%'),
  },
});
const mapStateToProps = state => ({});

const dispatchActionsToProps = dispatch => ({});
export default connect(
  mapStateToProps,
  dispatchActionsToProps
)(TransactionsGraphic);
