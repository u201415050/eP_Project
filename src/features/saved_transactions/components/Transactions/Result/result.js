import React, { Component } from 'react';
import {
  Text,
  View,
  FlatList,
  Image,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import { TextMontserrat } from 'components';
import Swipeout from 'react-native-swipeout';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { isTablet } from '../../../constants/isLandscape';
import colors from '../../../../modal_discount/styles/colors';
import moment from 'moment';
import { getLocalSettingRow } from '../../../../../services/settings_service';
import { formatNumberCommasDecimal } from 'api';
import realm from '../../../../../services/realm_service';
import Order from '../../../../../services/realm_models/order';
import loading_service from '../../../../../services/loading_service';
import * as _ from 'lodash';
import uuid from 'uuid/v1';
import RealmSavedTransaction from '../../../../../services/realm_models/realm_saved_transaction';
export default class Result extends Component {
  state = {
    selected: -1,
    activeSwipe: false,
    opened: null,
  };
  render() {
    //console.log(data)
    return (
      <View style={styles.container}>
        <ScrollView
          style={{ flex: 1 }}
          keyboardShouldPersistTaps="always"
          contentContainerStyle={{ paddingHorizontal: 1 }}
          showsVerticalScrollIndicator={false}
        >
          {this.props.data
            .sort((a, b) => {
              return b.updated_at - a.updated_at;
            })
            .map((item, i) => {
              var day = moment.unix(item.updated_at);
              //if (i == 0) alert(JSON.stringify(item.totalPrice));
              return (
                <View activeOpacity={0.8} key={i} style={{ flex: 1 }}>
                  <View>
                    <Swipeout
                      close={this.state.opened !== item.orderId}
                      autoClose={true}
                      disabled={item.opacity}
                      onOpen={() => this.setState({ opened: item.orderId })}
                      right={[
                        {
                          component: (
                            <TouchableOpacity
                              activeOpacity={0.6}
                              onPress={() => {
                                //item.remove();
                                this.props.removeItem(item.localId);
                                // alert(item.products);
                                // try {
                                //   this.setState({ activeSwipe: false });
                                //   loading_service.showLoading();
                                //   const response = await Order.voidSavedTransactions(
                                //     item.orderId
                                //   );
                                //   const user = realm.objectForPrimaryKey(
                                //     'User',
                                //     0
                                //   );
                                //   user.decrementSavedTransactions();
                                //   this.props.removeItem(item.orderId);
                                //   loading_service.hideLoading();
                                // } catch (error) {
                                //   loading_service.hideLoading();
                                // }
                              }}
                              style={{
                                marginTop: hp('1.5%'),
                                backgroundColor: '#FFACB6',
                                borderRadius: 10,
                                flex: 1,
                                justifyContent: 'center',
                                alignItems: 'center',
                                elevation: 3,
                                marginLeft: wp('1%'),
                              }}
                            >
                              <TextMontserrat
                                style={{
                                  color: '#D71930',
                                  fontWeight: '600',
                                  fontSize: isTablet ? hp(2.3) : wp(4.3),
                                }}
                              >
                                DELETE
                              </TextMontserrat>
                            </TouchableOpacity>
                          ),
                          backgroundColor: 'rgba(0,0,0,0)',
                        },
                      ]}
                      backgroundColor={'transparent'}
                      buttonWidth={isTablet ? hp('16%') : wp('25%')}
                      style={{
                        paddingVertical: hp('0.1%'),
                        paddingHorizontal: 5,
                      }}
                      /*onOpen={() => {
                  this.setState({ indexDelete: 1 });
                }}
                onClose={() => {
                  this.setState({ indexDelete: 0 });
                }}*/
                    >
                      <TouchableOpacity
                        disabled={this.state.selected != -1 || item.opacity}
                        onPress={() => {
                          let order;
                          // alert(
                          //   JSON.stringify(
                          //     realm.objectForPrimaryKey(
                          //       'Order',
                          //       'selected_saved_transaction'
                          //     )
                          //   )
                          // );
                          // return;
                          realm.write(() => {
                            order = realm.create(
                              'Order',
                              {
                                id: 'selected_saved_transaction',
                                deliveryCharges: item.deliveryCharges,
                                generalDiscount: item.generalDiscount,
                                totalDiscount: item.totalDiscount,
                                customItems: [],
                                generalDiscountType: item.generalDiscountType,
                                roundOffAmount: item.roundOffAmount,
                                salesreturnstatus: item.salesreturnstatus,
                                serviceCharges: item.serviceCharges,
                                totalTax: item.totalTax,
                                subTotalWithTaxes: +item.subTotal,
                                subTotal: item.subTotal,
                                calculatedDiscount: item.calculatedDiscount,
                                savedOrderId: item.localId,
                                totalPrice: item.totalPrice,
                                customer: {
                                  id: uuid(),
                                  customerId: item.customerId,
                                  name: item.customerName,
                                  number: item.customerNumber,
                                },
                              },
                              true
                            );

                            order.customItems = JSON.parse(item.products);
                          });
                          order.update();

                          this.props.openDetails();
                        }}
                        style={[
                          styles.card,
                          this.state.selected == i
                            ? { backgroundColor: '#BDC1CD' }
                            : null,
                          item.opacity
                            ? {
                                opacity: 0.6,
                              }
                            : null,
                        ]}
                      >
                        <View style={styles.inone}>
                          <View
                            style={[
                              styles.iconItem,
                              {
                                alignItems: 'center',
                                justifyContent: 'center',
                                marginRight: isTablet ? wp('3%') : wp('8%'),
                                marginTop: hp('1.2%'),
                              },
                            ]}
                          >
                            <Image
                              source={require('../../../assets/img/Cart_Fill.png')}
                              style={[{ width: hp('3%'), height: hp('3%') }]}
                            />
                            <View style={styles.badge}>
                              <Text style={styles.badgeText}>
                                {JSON.parse(item.products).length}
                              </Text>
                            </View>
                          </View>
                          <View style={styles.intwo}>
                            <TextMontserrat
                              style={{
                                ...styles.item,
                                fontSize: isTablet ? hp('1.7%') : wp('4.1%'),
                              }}
                            >
                              {item.customerName.length > 14
                                ? item.customerName.substr(0, 14) + '..'
                                : item.customerName || 'No name' /*item.nom*/}
                            </TextMontserrat>
                            <TextMontserrat
                              style={{
                                ...styles.date,
                                fontSize: isTablet ? hp('1.7%') : wp('3.3%'),
                              }}
                            >
                              {moment(day).format('DD') +
                                moment(day)
                                  .format(' MMM YYYY HH:mm A')
                                  .toUpperCase() /*item.key*/}
                            </TextMontserrat>
                          </View>
                        </View>
                        <View style={styles.inthree}>
                          <TextMontserrat
                            style={{
                              ...styles.price,
                              fontSize: isTablet
                                ? parseFloat(item.totalPrice) < 1000000
                                  ? hp('2.3%')
                                  : hp('2.1%')
                                : wp('4%'),
                            }}
                          >
                            ₹
                            {formatNumberCommasDecimal(
                              getLocalSettingRow('Transaction', 'RoundOff') ==
                                true ||
                                getLocalSettingRow('Transaction', 'RoundOff') ==
                                  1
                            ) && false
                              ? parseInt(item.totalPrice.toFixed(0)).toFixed(2)
                              : item.totalPrice.toFixed(2) /*item.price*/}
                          </TextMontserrat>
                        </View>
                      </TouchableOpacity>
                    </Swipeout>
                  </View>
                </View>
              );
            })}
          <View style={{ marginTop: hp('2%') }} />
        </ScrollView>
      </View>
    );
  }
}

const styles = EStyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
  },
  item: {
    color: '#52565F',
    fontSize: hp('2.2%'),
    fontWeight: '800',
  },
  date: {
    fontSize: hp('1.7%'),
    letterSpacing: hp('0.1%'),
    fontWeight: '600',
    color: '#888888',
    marginTop: hp('0.3%'),
  },
  iconItem: {
    justifyContent: 'center',
    //marginHorizontal: hp('0.3%'),
    alignItems: 'center',
  },

  price: {
    color: '#52565F',
    fontSize: hp('2.3%'),
    fontWeight: '700',
  },
  badge: {
    position: 'absolute',
    left: hp('2.9%') - hp('0.5') - hp('0.1'),
    bottom: hp('2.2%'),
    backgroundColor: colors.gray,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
    paddingHorizontal: hp('0.5'),
  },
  badgeText: {
    color: colors.white,
    fontSize: hp('1.3%'),
    fontFamily: 'Montserrat-Bold',
  },
  card: {
    paddingVertical: hp('2.2%'),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'white',
    borderWidth: 0.2,
    borderRadius: 2,
    paddingHorizontal: isTablet ? wp('3%') : wp('6%'),
    borderColor: '#ddd',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.4,
    shadowRadius: 2,
    elevation: 3,
    marginTop: hp('1.5%'),
  },
  inone: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
  },
  img: {
    width: hp('3.5%'),
    height: hp('3.5%'),
  },
  intwo: {
    height: '100%',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
});
