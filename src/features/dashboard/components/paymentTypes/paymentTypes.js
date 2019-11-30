import React, { Component } from 'react';
import { AnimatedCircularProgress } from 'react-native-circular-progress';

import {
  Text,
  View,
  Image,
  Dimensions,
  TouchableOpacity,
  Modal,
  StyleSheet,
  ScrollView,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import * as d3 from 'd3';
import * as shape from 'd3-shape';
import { connect } from 'react-redux';
import colors from '../../../modal_delivery/styles/colors';
import { isTablet } from '../../../fingerprint/constants/isLandscape';
import { TextMontserrat } from 'components';
import { getIcon } from '../../utils/paymentIcons';
import { formatNumberCommasDecimal } from 'api';
class PaymentTypes extends Component {
  render() {
    const circle = (
      firstcolor,
      secondcolor,
      radius,
      weight,
      backgroundColor,
      percent,
      back,
      name
    ) => {
      const grade = (360 * percent) / 100;
      const rotate = 360 - grade > 180 ? 360 - grade - 180 : 360 - grade;
      const change = 360 - grade > 180;
      return (
        <View
          style={[
            styles.outerCircle,
            {
              width: radius * 2,
              height: radius * 2,
              borderRadius: radius,
              backgroundColor: firstcolor,
              transform: [{ rotate: `${back}deg` }],
            },
          ]}
        >
          <View
            style={[
              styles.outerCircle,
              {
                width: radius,
                height: radius * 2,
                backgroundColor: secondcolor,
                borderRadius: radius,
                borderTopRightRadius: 0,
                borderBottomRightRadius: 0,
                //transform: [ { rotate: /* rotate it according to percentage */ } ],
              },
            ]}
          />
          <View
            style={{
              transform: [{ rotate: `${rotate}deg` }],
              borderRadius: radius,
              height: '100%',
              width: '100%',
              position: 'absolute',
              top: 0,
              left: 0,
            }}
          >
            <View
              style={[
                styles.outerCircle,
                {
                  width: radius,
                  height: radius * 2,
                  borderRadius: radius,
                  borderTopRightRadius: 0,
                  borderBottomRightRadius: 0,
                  backgroundColor: change ? secondcolor : firstcolor,
                },
              ]}
            />
          </View>
          <View
            style={{
              borderRadius: radius,
              height: '100%',
              alignItems: 'center',
              justifyContent: 'center',
              width: '100%',
              position: 'absolute',
              top: 0,
              left: 0,
            }}
          >
            <View
              style={[
                styles.outerCircle,
                {
                  width: radius * 2 - weight,
                  height: radius * 2 - weight,
                  borderRadius: radius,
                  backgroundColor: backgroundColor,
                },
              ]}
            />
          </View>
        </View>
      );
    };
    const { payments, grossSales } = this.props;
    const elements = ['#174185', '#ED202E', '#E16C28'];

    const paymentButton = (item, i) => {
      const decimal = parseFloat(item.totalAmount).toFixed(2);
      const percent = (100 * item.totalAmount) / grossSales;
      return (
        <View
          style={[
            {
              paddingHorizontal: isTablet ? wp('2%') : wp('4.5%'),
              marginRight: isTablet ? wp('1.5%') : wp('3%'),
              backgroundColor: colors.darkWhite,
              elevation: 6,
              paddingVertical: isTablet ? hp('2%') : hp('3.5%'),
              borderRadius: wp('2%'),
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.2,
              shadowRadius: 8,
            },
            // isTablet ? null : null,
            {justifyContent: 'space-around'}
          ]}
        >
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              //backgroundColor: 'green'
            }}
          >
            <AnimatedCircularProgress
              size={isTablet ? hp('10%') : wp('14%')}
              width={3}
              fill={percent>98&&payments.length>1?98:percent<2?2:percent}
              rotation={0}
              tintColor={elements[Math.floor(Math.random() * 3)]}
              onAnimationComplete={() => console.log('onAnimationComplete')}
              backgroundColor={colors.darkWhite}
            >
              {() => (
                <Image
                  source={getIcon(item.displayName)}
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: (isTablet ? hp('10%') : wp('14%')) - 6,
                    height: (isTablet ? hp('10%') : wp('14%')) - 6,
                  }}
                />
              )}
            </AnimatedCircularProgress>

            
          </View>
          <View
            style={{
              flexDirection: 'column',
              marginTop: isTablet ? 0 : 0,
              justifyContent: 'center',
              // backgroundColor:'yellow'
            }}
          >
            <TextMontserrat
              style={{
                paddingRight: wp('3.5%'),
                color: '#222222',
                fontSize: isTablet ? hp('4%') : wp('5.5%'),
                fontWeight: '700',
                opacity: 0.9,
                letterSpacing: wp('0.2%'),
              }}
            >
              <TextMontserrat
                style={{
                  paddingRight: wp('3.5%'),
                  color: '#222222',
                  fontSize: isTablet ? hp('3.2%') : wp('4%'),
                  fontWeight: '700',
                  opacity: 0.9,
                  letterSpacing: wp('0.2%'),
                }}
              >
                ₹
              </TextMontserrat>
              {formatNumberCommasDecimal(parseInt(item.totalAmount))}.
              <TextMontserrat
                style={{
                  paddingRight: wp('3.5%'),
                  color: '#222222',
                  fontSize: isTablet ? hp('2.8%') : wp('3.3%'),
                  fontWeight: '700',
                  opacity: 0.9,
                  letterSpacing: wp('0.2%'),
                }}
              >
                {decimal.substr(decimal.length - 2, 2)}
              </TextMontserrat>
            </TextMontserrat>
            <TextMontserrat
              style={{
                fontSize: isTablet ? hp('2.6%') : wp('3.5%'),
                opacity: 0.5,
                fontWeight: '600',
                color: '#222222',
              }}
            >
              {item.displayName}
            </TextMontserrat>
          </View>
        </View>
      );
    };
    return (
      <View style={[styles.container, isTablet ? { flex: 1 } : null]}>
        <View style={styles.header}>
          <TextMontserrat
            style={{
              color: '#222222',
              fontSize: isTablet ? hp('3.2%') : wp('5.8%'),
              opacity: 0.9,
              fontWeight: '700',
            }}
          >
            Payment Types
          </TextMontserrat>
          <Image
            style={{
              opacity: 1,
              marginRight: isTablet ? hp('5%') : wp('4%'),
              width: isTablet ? hp('4%') : wp('7%'),
              height: isTablet ? hp('3%') : wp('5%'),
            }}
            resizeMode="stretch"
            source={require('../../assets/img/right-arrow.png')}
          />
        </View>
        {
          payments.length>0?
        
        <ScrollView
          showsHorizontalScrollIndicator={false}
          style={{ width: '100%' }}
          horizontal={true}
          contentContainerStyle={{
            paddingLeft: wp('2.8%'),
            paddingVertical: hp('2%'),
          }}
        >
          {payments.map((item, i) => {
            return paymentButton(item, i);
          })}
        </ScrollView>:
        <View style={{width:'100%',color: '#222222', paddingVertical:hp('4%'),alignItems:'center'}}>
          <TextMontserrat style={{fontSize:hp('3%'), fontWeight:'800'}}>
            There's no payments
          </TextMontserrat>
        </View>
        }
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.darkWhite,
    borderRadius: 10,
    marginTop: hp('3%'),
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
    width: '85%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  footer: {
    width: '100%',
    paddingHorizontal: wp('5%'),
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
)(PaymentTypes);
