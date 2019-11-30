import React, { Component } from 'react';
import {
  Text,
  View,
  Image,
  Dimensions,
  TouchableOpacity,
  Modal,
  StyleSheet,
  Platform,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

import { connect } from 'react-redux';
import colors from '../../../modal_delivery/styles/colors';
import { isTablet } from '../../../fingerprint/constants/isLandscape';
import { TextMontserrat } from 'components';
import { formatNumberCommasDecimal } from 'api';
class TotalSales extends Component {
  state = {
    showOptions: false,
    modalDiscount: false,
    modalDelivery: false,
  };

  render() {
    const { totalSales, rangeDate } = this.props;
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
    let decimal = parseFloat(totalSales).toFixed(2);
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TextMontserrat
            style={{
              color: '#222222',
              fontSize: isTablet ? hp('3.2%') : wp('5.8%'),
              opacity: 0.9,
              fontWeight: '700',
            }}
          >
            Total Sales
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
        <View style={{ width: '100%', alignItems: 'flex-start' }}>
          <View style={styles.footer}>
            <Text style={styles.ruppeSign}>₹</Text>
            <TextMontserrat
              style={{
                ...styles.valueInteger,
                fontSize:
                  (isTablet ? hp('15%') : wp('20%')) -
                  (isTablet ? hp('1%') : wp('1%')) *
                    parseInt(totalSales).toString().length,
              }}
            >
              {formatNumberCommasDecimal(parseInt(totalSales))}.
              <TextMontserrat style={styles.valueDecimal}>
                {decimal.substr(decimal.length - 2, 2)}
                
              </TextMontserrat>
            </TextMontserrat>
            
          </View>
        </View>
        <View
          style={{
            width: '100%',
            paddingHorizontal: isTablet ? hp('4%') : wp('5%'),
          }}
        >
          
        </View>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    width: isTablet ? '90%' : '95%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.darkWhite,
    borderRadius: 10,
    marginTop: isTablet ? 0 : hp('2%'),
    elevation: 10,
    paddingVertical: hp('4%'),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
  },
  comExtra: {
    fontSize: isTablet ? hp('1.8%') : wp('3.3%'),
    opacity: 0.5,
    color: '#222222',
    fontWeight: '800',
    letterSpacing: isTablet ? hp('0.2%') : wp('0.4%'),
    marginTop: -hp('1%'),
  },
  ruppeSign: {
    fontSize: isTablet ? hp('4%') : wp('7%'),
    opacity: 0.8,
    color: '#222222',
    marginTop: isTablet ? hp('2%') : wp('4%'),
  },
  valueInteger: {
    fontSize: wp('20%'),
    color: '#222222',
    fontWeight: '200',
    marginLeft: isTablet ? hp('1.5%') : wp('2%'),
  },
  valueDecimal: {
    fontSize: isTablet ? hp('3.9%') : wp('6.6%'),
    color: 'rgba(0,0,0,0.5)',
    fontWeight: '600',
    marginTop: wp('7%'),
    letterSpacing: wp('0.4%'),
  },
  header: {
    width: '100%',
    paddingHorizontal: isTablet ? hp('4%') : wp('5%'),
  },
  footer: {
    paddingHorizontal: isTablet ? hp('4%') : wp('5%'),
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: hp('1.7%'),
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
)(TotalSales);
