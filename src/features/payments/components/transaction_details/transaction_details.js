import React, { Component } from 'react';
import {
  View,
  Image,
  TouchableOpacity,
  Animated,
  ScrollView,
  Platform,
} from 'react-native';
import { TextMontserrat } from 'components';
import EStyleSheet from 'react-native-extended-stylesheet';
import ProductsHeader from './components/products_header/products_header';
import ProductsItem from './components/products_item/products_item';
import { formatNumberCommasDecimal } from 'api';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { isTablet } from '../../../cash_register/constants/isLandscape';
import _ from 'lodash';
import { connect } from 'react-redux';
import moment from 'moment';
import CustomItemHelper from '../../../../factory/custom_item_helper';
import { cashActions } from '../../../cash_register/actions';
class TransactionDetails extends Component {
  constructor(props) {
    super(props);
    console.log(this.props.order.customItems);
  }
  SHOW_MORE_ARROW_DOWN = require('../../assets/icons/arrow_show_more.png');
  CART_ICON = require('../../../cash_register/assets/icons/cart_xxhdi.png');
  state = {
    expanded: this.props.custom || false,
    animation: new Animated.Value(1),
    today: new Date(),
  };
  _setMaxHeight(event) {
    if (!this.props.custom) {
      this.setState({
        maxHeight: event.nativeEvent.layout.height,
      });
    }
  }
  _setMinHeight(event) {
    console.log('_setMinHeight called!');
    this.setState({
      minHeight: 10,
    });
  }
  toggle() {
    console.log('toggle called!');
    //Step 1
    let initialValue = this.state.expanded
        ? this.state.maxHeight
        : this.state.minHeight,
      finalValue = this.state.expanded
        ? this.state.minHeight
        : this.state.maxHeight;

    this.setState({
      expanded: !this.state.expanded, //Step 2
    });

    this.state.animation.setValue(initialValue); //Step 3
    Animated.spring(
      //Step 4
      this.state.animation,
      {
        toValue: finalValue,
      }
    ).start(); //Step 5

    setTimeout(
      () => {
        this.setState({ showView: this.state.expanded });
      },
      this.state.expanded ? 500 : 0
    );
  }

  render() {
    const order = this.props.order;
    const { taxesGroup } = order.calculateTaxes(order.customItems || []);
    // const taxesGroup = {};

    return (
      <View
        style={[
          styles.transactionDetailsContainer,
          this.props.custom ? { width: '100%' } : null,
        ]}
      >
        <View style={styles.transactionDetails}>
          <View style={styles.detailsIcon}>
            <View>
              <View style={styles.badge}>
                <TextMontserrat style={styles.badgeText}>
                  {order.customItems.length}
                </TextMontserrat>
              </View>
              <Image
                style={{tintColor:'#174285', width: hp('3.3%'), height: hp('3.3%') }}
                source={this.CART_ICON}
              />
            </View>
          </View>
          <View style={styles.detailsDescription}>
            <TextMontserrat
              style={{
                ...styles.detailsDescriptionText,
                ...styles.detailsDescriptionTextName,
                paddingLeft: hp('1.7%'),
              }}
            >
              {order.customer
                ? order.customer.name.length > 14
                  ? order.customer.name.substr(0, 14) + '..'
                  : order.customer.name
                : 'Guest'}
            </TextMontserrat>
          </View>
          <View style={styles.detailsDate}>
            <TextMontserrat
              style={{
                ...styles.detailsDateText,
                ...styles.detailsDateTextFull,
              }}
            >
              {moment().format('D MMM YYYY')}
            </TextMontserrat>
            <TextMontserrat style={styles.detailsDescriptionText}>
              {moment().format('hh:mm A')}
            </TextMontserrat>
          </View>
        </View>

        <Animated.View
          style={[
            {
              backgroundColor: '#fff',
              overflow: 'hidden',
            },
            // this.props.custom ? null : { height: this.state.animation },
          ]}
        >
          {(this.state.showView || this.props.custom) && (
            <View>
              <View
                style={[styles.productsView]}
                onLayout={this._setMaxHeight.bind(this)}
              >
                <ProductsHeader />
                {this.props.custom ? (
                  <ScrollView
                    showsVerticalScrollIndicator={false}
                    style={{ height: hp('10%') }}
                  >
                    {order.customItems.map((item, i) => {
                      return (
                        <ProductsItem
                          key={i}
                          product={item}
                          taxes={false}
                          number={i + 1}
                        />
                      );
                    })}
                  </ScrollView>
                ) : (
                  order.customItems.map((item, i) => {
                    return (
                      <ProductsItem
                        key={i}
                        product={item}
                        taxes={false}
                        number={i + 1}
                      />
                    );
                  })
                )}

                <View style={totalsStyle.container}>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                    }}
                  >
                    <TextMontserrat style={totalsStyle.subtotal}>
                      Sub Total
                    </TextMontserrat>
                    <TextMontserrat
                      style={{
                        ...totalsStyle.subtotal,
                        color: TEXT_COLOR_ACTIVE,
                      }}
                    >
                      ₹
                      {formatNumberCommasDecimal(
                        parseFloat(order.subTotal).toFixed(2)
                      )}
                    </TextMontserrat>
                  </View>
                  {Object.entries(taxesGroup).map((item, i) => {
                    return (
                      <View
                        key={i}
                        style={{
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                        }}
                      >
                        <TextMontserrat style={totalsStyle.cgst}>
                          {item[0].toUpperCase() /* + ' @ ' + i.percentage + '%'*/}
                        </TextMontserrat>
                        <TextMontserrat
                          style={{
                            ...totalsStyle.cgst,
                            color: TEXT_COLOR_ACTIVE,
                          }}
                        >
                          ₹
                          {formatNumberCommasDecimal(
                            parseFloat(item[1].value).toFixed(2)
                          )}
                        </TextMontserrat>
                      </View>
                    );
                  })}
                  {order.totalDiscount > 0 || order.deliveryCharges > 0 ? (
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                      }}
                    >
                      <TextMontserrat style={totalsStyle.subtotal}>
                        Total Amount
                      </TextMontserrat>
                      <TextMontserrat
                        style={{
                          ...totalsStyle.subtotal,
                          color: TEXT_COLOR_ACTIVE,
                        }}
                      >
                        ₹
                        {formatNumberCommasDecimal(
                          parseFloat(order.subTotalWithTaxes).toFixed(2)
                        )}
                      </TextMontserrat>
                    </View>
                  ) : null}
                  {order.totalDiscount > 0 ? (
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                      }}
                    >
                      <TextMontserrat style={totalsStyle.discount}>
                        Discount
                      </TextMontserrat>
                      <TextMontserrat style={totalsStyle.discount}>
                        ₹
                        {formatNumberCommasDecimal(
                          parseFloat(order.totalDiscount).toFixed(2)
                        )}
                      </TextMontserrat>
                    </View>
                  ) : null}
                  {order.deliveryCharges > 0 ? (
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                      }}
                    >
                      <TextMontserrat style={totalsStyle.cgst}>
                        Delivery Charge
                      </TextMontserrat>
                      <TextMontserrat
                        style={{
                          ...totalsStyle.cgst,
                          color: TEXT_COLOR_ACTIVE,
                        }}
                      >
                        ₹
                        {formatNumberCommasDecimal(
                          parseFloat(order.deliveryCharges).toFixed(2)
                        )}
                      </TextMontserrat>
                    </View>
                  ) : null}
                </View>
              </View>
            </View>
          )}
        </Animated.View>
        <View
          style={[
            styles.transactionAmount,
            this.props.custom ? { borderColor: '#ddd' } : null,
          ]}
        >
          <View style={styles.totalAmountText}>
            <TextMontserrat style={styles.textAmount}>
              Total Payable
            </TextMontserrat>
          </View>
          <View style={styles.totalAmountValue}>
            <TextMontserrat
              style={{ ...styles.textAmount, ...styles.textAmountValue }}
            >
              ₹
              {formatNumberCommasDecimal(
                parseFloat(order.totalPrice).toFixed(2)
              )}
            </TextMontserrat>
          </View>
        </View>
        {isTablet || this.props.custom ? null : (
          <TouchableOpacity
            style={styles.showMore}
            activeOpacity={0.6}
            onPress={this.toggle.bind(this)}
            onLayout={this._setMinHeight.bind(this)}
          >
            <View style={{ justifyContent: 'center' }}>
              <TextMontserrat style={styles.showMoreText}>
                SHOW {this.state.expanded ? 'LESS' : 'MORE'}
              </TextMontserrat>
              <Image
                style={{
                  tintColor: '#174285',
                  position: 'absolute',
                  right: -hp('3.2%'),

                  height: hp('1.8%') * 0.6,
                  width: hp('1.8%'),
                  marginHorizontal: 5,
                  transform: [
                    { rotate: this.state.expanded ? '180deg' : '0deg' },
                  ],
                }}
                source={this.SHOW_MORE_ARROW_DOWN}
              />
            </View>
          </TouchableOpacity>
        )}
      </View>
    );
  }
}

const TEXT_COLOR = '#47525D';
const TEXT_COLOR_LIGHT = '#5D6770';
const TEXT_COLOR_ACTIVE = '#174285';

const totalsStyle = EStyleSheet.create({
  container: {
    paddingHorizontal: '2rem',
    paddingTop: '.5rem',
    borderTopWidth: 1,
    borderColor: '#ddd',
  },
  subtotal: {
    fontSize: hp('2%'), //'1.6rem',
    fontWeight: 'bold',
    color: TEXT_COLOR,
  },
  cgst: {
    fontSize: hp('2%'), //'1.6rem',
    fontWeight: '600',
    color: TEXT_COLOR,
  },
  discount: {
    fontSize: hp('2%'), //'1.6rem',
    fontWeight: '600',
    color: '#FF6000',
  },
});
const styles = EStyleSheet.create({
  $height: isTablet ? (Platform.OS === 'ios' ? 45 : 45) : 45,
  transactionDetailsContainer: {
    backgroundColor: 'white',
    borderWidth: isTablet ? hp('0.1') : hp('0.05'),
    borderColor: '#ddd',
    borderRadius: 3,
    elevation: 3,
  },
  textAmount: {
    fontWeight: 'bold',
    fontSize: hp('2.4%'), //'2rem',
    color: TEXT_COLOR,
  },
  textAmountValue: {
    color: TEXT_COLOR_ACTIVE,
  },
  transactionDetails: {
    borderBottomWidth: hp('0.1'),
    borderColor: '#ddd',
    flexDirection: 'row',
    paddingHorizontal: isTablet ? wp('2%') : wp('4%'),
    paddingVertical: isTablet ? hp('1.15%') : hp('1%'),
    // backgroundColor: 'yellow'
  },
  detailsIcon: {
    // height: '$height',
    // flex: 1.2,
    width: isTablet ? wp('3.2%') : wp('5%'),
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: wp('0.75%'),
    // backgroundColor:'blue',
  },
  detailsDescription: {
    flex: 4,
    // height: '$height',
    justifyContent: 'space-around',
  },
  detailsDescriptionText: {
    fontSize: hp('1.8%'), //'1.4rem',
    fontWeight: '600',
    color: TEXT_COLOR_LIGHT,
  },
  detailsDescriptionTextName: {
    fontSize: hp('2.8%'), //'1.9rem',
  },
  detailsDate: {
    // flex: 2,
    // height: '$height',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
  },
  detailsDateText: {
    fontSize: '1.1rem',
    fontWeight: '500',
    color: TEXT_COLOR,
  },
  detailsDateTextFull: {
    fontSize: isTablet ? hp('2.3%') : hp('1.9%'), //'1.5rem',
  },
  transactionAmount: {
    paddingHorizontal: isTablet ? wp('2%') : wp('4%'),
    paddingVertical: isTablet ? hp('1.15%') : hp('1%'),
    borderBottomWidth: 1,
    borderColor: isTablet ? '#ddd' : TEXT_COLOR_ACTIVE,
    flexDirection: 'row',
    justifyContent: 'space-between',
    // backgroundColor: 'green'
  },
  showMore: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: '.5rem',
    flexDirection: 'row',
  },
  showMoreText: {
    fontWeight: '600',
    color: TEXT_COLOR_ACTIVE,
    fontSize: hp('1.6%'), //'1.1rem',
  },
  badge: {
    position: 'absolute',
    top: -hp('1.2%'), //'-1rem',
    right: -hp('1.2%'), //'-.7rem',
    backgroundColor: TEXT_COLOR,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
    width: hp('1.8%'),
    height: hp('1.8%'),
    zIndex: 99,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: hp('1%'),
    fontWeight: '600',
    zIndex: 99,
    textAlign: 'center',
  },
  productsView: {
    // height: '3.8rem * 3',
  },
});
const mapStateToProps = state => {
  return {
    state: state.cashData,
  };
};

const mapDispatchToProps = dispatch => ({
  clear_order: () => dispatch(cashActions.clear_data()),
  clear_customer: () => dispatch(cashActions.clear_customer()),
});
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TransactionDetails);
