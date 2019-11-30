import React, { Component } from 'react';
import {
  View,
  Image,
  ImageBackground,
  ScrollView,
  TouchableOpacity,
  NetInfo,
} from 'react-native';
import PaymentsHeader from '../../components/header/header';
import { TextMontserrat } from 'components';
import ButtonGradient from './components/transaction_details/components/buttonGradientColor/ButtonGradient';
import TransactionDetails from './../../components/transaction_details/transaction_details';
import { connect } from 'react-redux';
import { formatNumberCommasDecimal } from 'api';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import { isTablet } from '../../../cash_register/constants/isLandscape';
import { cancelPendingTransactions } from 'api';
import alert_service from '../../../../services/alert_service';
import { cashActions } from '../../../cash_register/actions';
//import mixpanel from '../../../../services/mixpanel';
import RealmPayment from '../../../../services/realm_models/realm_payment';
import * as _ from 'lodash';
import ButtonGradientPay from '../../../../components_general/buttons/ButtonGradientPay';
class CashPayments extends Component {
  static navigationOptions = ({ navigation }) => ({
    header: isTablet ? null : (
      <PaymentsHeader navigation={navigation} title="CASH" headerRight={true} />
    ),
  });

  constructor(props) {
    super(props);
    this.split = _.get(this.props, 'payment.split', false);
    //mixpanel.track('Cash Payment');

    // for improve cash payment start
    if (!this.split) {
      const realm_payment = RealmPayment.get('currentPayment');

      this.payment = realm_payment;
    } else {
      // commented for improve cash payment start
      this.payment = this.props.payment;
      this.order =
        this.props.navigation != null
          ? this.props.navigation.getParam('order', null)
          : null;
      if (this.isSplit()) {
        this.payment.payStep('initiate').then(next => {
          if (next.previous_payment) {
            return this.payment
              .cancel(next.lastPaymentId)
              .then(() => {
                this.payment.payStep('initiate');
              })
              .catch(err => {
                alert_service.showAlert(err.message, err.action);
              });
          }
        });
      }
      // commented for improve cash payment end
    }

    console.log({ tttt: this.payment });

    // for improve cash payment end
  }
  state = {
    payCant: 100,
    hastender: false,
  };

  componentDidMount() {
    cancelPendingTransactions(this.payment);
    let payAmount = this.payment.paymentAmount;

    this.setState({ payCant: payAmount });
  }

  isSplit() {
    return this.payment.split;
  }

  pay() {
    if (!this.payment.split) {
      this.payment.pay();
      if (this.props.isTablet) {
        // console.log(this.payment);

        this.props.toggleInvoice({ screen: 'InvoiceCash' });
      } else {
        this.props.navigation.goToInvoice('InvoiceCash');
      }
    } else {
      this.onPay(); // commented for improve cash
    }
  }

  async onPay() {
    const connect = await NetInfo.isConnected.fetch();
    if (this.isSplit()) {
      return this.payment
        .payStep('process', {
          data: {},
          transactionTypeId: 2,
          next: {},
        })
        .catch(err => {
          alert_service.showAlert(err.message, err.action);
        });
    }
    //loadiing
    this.payment
      .payWithCash({}, !connect)
      .then(() => {})
      .catch(err => {
        alert_service.showAlert(err.message, err.action);
      });
  }
  renderChange() {
    let change;
    if (
      this.state.payCant == 0 ||
      this.state.payCant < this.payment.paymentAmount
    ) {
      change = '0.00';
    } else {
      change = formatNumberCommasDecimal(
        parseFloat(
          this.state.payCant - parseFloat(this.payment.paymentAmount)
        ).toFixed(2)
      );
    }
    return change;
  }

  changePayCant = val => {
    if (!this.state.hastender) {
      this.setState({ payCant: val, hastender: true }, () => {
        const change = this.renderChange()
          .split(',')
          .join('');
        // alert(change);
        this.payment.setChange(parseFloat(change));
      });

      return true;
    }
    if (this.state.payCant < this.payment.paymentAmount) {
      let payAcum = this.state.payCant + val;
      this.setState(
        {
          payCant: payAcum,
        },
        () => {
          const change = this.renderChange()
            .split(',')
            .join('');
          this.payment.setChange(parseFloat(change));
        }
      );
      return true;
    } else {
      return false;
    }
  };
  toDecimal(number, decimals) {
    decimals = decimals || 100;
    return (
      Math.round(
        number.toFixed(decimals.toString().length - 1) * decimals +
          Number.EPSILON
      ) / decimals
    );
  }
  render() {
    //alert(JSON.stringify(this.order))
    if (this.order != null) {
      products = this.order.products;
      totalDiscount = this.order.generalDiscount;
      totalDelivery = this.order.deliveryCharges;
      type = this.order.generalDiscountType;
    }
    const canAddTender = this.state.payCant < this.payment.paymentAmount;

    if (isTablet) {
      return (
        <ImageBackground
          source={require('../../../../assets/images/bg/loadingBackground.png')}
          style={{
            paddingTop: 5,
            paddingBottom: 10,
            paddingHorizontal: 10,
            height: '100%',
            width: '100%',
          }}
        >
          <View style={{ height: '100%', width: '100%' }}>
            <TransactionDetails
              // order={this.props.payment.order} // commented for improve cash
              order={this.payment.order} // added for improve cash
              data={this.props.state}
              manual={this.order != null}
            />

            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => {
                this.setState({
                  payCant: this.payment.paymentAmount,
                  hastender: false,
                });
                this.butt2000.reset();
                this.butt500.reset();
                this.butt200.reset();
                this.butt100.reset();
                this.butt50.reset();
                this.butt20.reset();
                this.butt10.reset();
                this.butt5.reset();
              }}
              style={{
                width: '100%',
                height: hp('7.5%'),
                marginTop: hp('2%'),
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
                source={require('../../assets/img/rectangle_medium_radius.png')}
              />

              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  paddingHorizontal: wp('2%'),
                  alignItems: 'center',
                }}
              >
                <TextMontserrat
                  style={{
                    fontWeight: '600',
                    fontSize: hp('2.2%'),
                    color: TEXT_COLOR,
                  }}
                >
                  PAY AMOUNT
                </TextMontserrat>
                <TextMontserrat
                  style={{
                    fontWeight: '600',
                    fontSize: hp('2.5%'),
                    color: TEXT_COLOR,
                  }}
                >
                  ₹
                  {formatNumberCommasDecimal(
                    parseFloat(this.payment.paymentAmount).toFixed(2)
                  )}
                </TextMontserrat>
              </View>
            </TouchableOpacity>
            {this.state.payCant < this.payment.paymentAmount && false ? (
              <View style={{ height: hp('2.5%') }} />
            ) : (
              <View style={{ alignItems: 'flex-end', paddingRight: wp('2%') }}>
                <TextMontserrat
                  style={{
                    fontWeight: '600',
                    color: '#D0021B',
                    fontSize: hp('1.85%'),
                  }}
                >
                  {this.state.payCant < this.payment.paymentAmount
                    ? `₹${parseFloat(
                        this.payment.paymentAmount - this.state.payCant
                      ).toFixed(2)} more to pay`
                    : `₹${this.renderChange()} change out of ₹ ${formatNumberCommasDecimal(
                        parseFloat(this.state.payCant).toFixed(2)
                      )}`}
                </TextMontserrat>
              </View>
            )}
            <View
              style={{
                marginTop: hp('1%'),
                marginBottom: hp('1.5%'),
              }}
            >
              <TextMontserrat
                style={{
                  marginTop: hp('0.8'),
                  textAlign: 'center',
                  fontSize: hp('3%'),
                  fontWeight: '800',
                }}
              >
                Easy Tendering
              </TextMontserrat>
              <TextMontserrat
                style={{
                  marginBottom: hp('2%'),
                  textAlign: 'center',
                  fontSize: hp('1.8%'),
                  fontWeight: '600',
                }}
              >
                Tap on an amount to tender for that value
              </TextMontserrat>
            </View>
            <View
              style={{
                flex: 1,
                paddingBottom: hp('2.5%'),
              }}
            >
              <View
                style={{
                  flex: 1,
                  width: '100%',
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                }}
              >
                <ButtonGradient
                  widthCustom="32%"
                  ref={x => (this.butt2000 = x)}
                  canAddTender={canAddTender}
                  onPress={() => {
                    return this.changePayCant(2000);
                  }}
                  cant={true}
                  heightB={true}
                  style={{ marginBottom: hp('1.5%') }}
                  firstColor={'#ECD4EC'}
                  secondColor={'#AB6CAF'}
                  title={'₹2000'}
                />
                <ButtonGradient
                  widthCustom="32%"
                  ref={x => (this.butt500 = x)}
                  canAddTender={canAddTender}
                  onPress={() => {
                    return this.changePayCant(500);
                  }}
                  cant={true}
                  heightB={true}
                  style={{ marginBottom: hp('1.5%') }}
                  firstColor={'#E8DCC6'}
                  secondColor={'#9A968B'}
                  title={'₹500'}
                />
                <ButtonGradient
                  widthCustom="32%"
                  ref={x => (this.butt200 = x)}
                  canAddTender={canAddTender}
                  onPress={() => {
                    return this.changePayCant(200);
                  }}
                  cant={true}
                  heightB={true}
                  style={{ marginBottom: hp('1.5%') }}
                  firstColor={'#F5D1AF'}
                  secondColor={'#E98B42'}
                  title={'₹200'}
                />
              </View>
              <View
                style={{
                  flex: 1,
                  width: '100%',
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                }}
              >
                <ButtonGradient
                  widthCustom="32%"
                  ref={x => (this.butt100 = x)}
                  canAddTender={canAddTender}
                  onPress={() => {
                    return this.changePayCant(100);
                  }}
                  cant={true}
                  heightB={true}
                  style={{ marginBottom: hp('1.5%') }}
                  firstColor={'#EAECFB'}
                  secondColor={'#928BE5'}
                  title={'₹100'}
                />
                <ButtonGradient
                  widthCustom="32%"
                  ref={x => (this.butt50 = x)}
                  canAddTender={canAddTender}
                  onPress={() => {
                    return this.changePayCant(50);
                  }}
                  cant={true}
                  heightB={true}
                  style={{ marginBottom: hp('1.5%') }}
                  firstColor={'#CAE0D4'}
                  secondColor={'#6BD6C7'}
                  title={'₹50'}
                />
                <ButtonGradient
                  widthCustom="32%"
                  ref={x => (this.butt20 = x)}
                  canAddTender={canAddTender}
                  onPress={() => {
                    return this.changePayCant(20);
                  }}
                  cant={true}
                  heightB={true}
                  style={{ marginBottom: hp('1.5%') }}
                  firstColor={'#F3CFAD'}
                  secondColor={'#CE6959'}
                  title={'₹20'}
                />
              </View>
              <View
                style={{
                  flex: 1,
                  width: '100%',
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                }}
              >
                <ButtonGradient
                  widthCustom="32%"
                  ref={x => (this.butt10 = x)}
                  canAddTender={canAddTender}
                  onPress={() => {
                    return this.changePayCant(10);
                  }}
                  cant={true}
                  heightB={true}
                  style={{ marginBottom: hp('3%') }}
                  firstColor={'#E7C2A8'}
                  secondColor={'#B58E7D'}
                  title={'₹10'}
                />
                <ButtonGradient
                  widthCustom="32%"
                  ref={x => (this.butt5 = x)}
                  canAddTender={canAddTender}
                  onPress={() => {
                    return this.changePayCant(5);
                  }}
                  cant={true}
                  heightB={true}
                  style={{ marginBottom: hp('3%') }}
                  firstColor={'#E1DEA7'}
                  secondColor={'#9CAD81'}
                  title={'₹5'}
                />
                <View style={{ width: '32%' }} />
              </View>
              <View
                style={{
                  width: '100%',
                  // height: '10%',
                  justifyContent: 'center',
                  // flex: 1,
                }}
              >
                <ButtonGradientPay
                  disabled={this.state.payCant < this.payment.paymentAmount}
                  onPress={() => {
                    this.pay();
                  }}
                  heightB={hp(isTablet ? '13%' : '12%')}
                  firstColor={'#114B8C'}
                  secondColor={'#0079AA'}
                  title={
                    'PAY ₹' +
                    formatNumberCommasDecimal(
                      this.payment.paymentAmount.toFixed(2)
                    )
                  }
                />
              </View>
            </View>
          </View>
        </ImageBackground>
      );
    } else
      return (
        <ImageBackground
          source={require('../../../../assets/images/bg/loadingBackground.png')}
          style={{
            paddingTop: 20,
            paddingBottom: isTablet ? 10 : 0,
            paddingHorizontal: 10,
            height: '100%',
          }}
        >
          <ScrollView
            keyboardShouldPersistTaps="always"
            style={{ flex: 1, flexGrow: 0.99 }}
            contentContainerStyle={{
              paddingHorizontal: hp('0.1'),
              paddingBottom: hp('2%'),
            }}
            showsVerticalScrollIndicator={false}
          >
            <TransactionDetails
              // order={this.props.payment.order} // commented for improve cash
              order={this.payment.order} // added for improve cash
              data={this.props.state}
              manual={this.order != null}
            />

            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => {
                this.setState({
                  payCant: this.payment.paymentAmount,
                  hastender: false,
                });
                this.butt2000.reset();
                this.butt500.reset();
                this.butt200.reset();
                this.butt100.reset();
                this.butt50.reset();
                this.butt20.reset();
                this.butt10.reset();
                this.butt5.reset();
              }}
              style={{
                width: '100%',
                height: hp('9%'),
                marginTop: hp('2%'),
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
                source={require('../../assets/img/rectangle_medium_radius.png')}
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
                    fontSize: hp('2.2%'),
                    color: TEXT_COLOR,
                  }}
                >
                  PAY AMOUNT
                </TextMontserrat>
                <TextMontserrat
                  style={{
                    fontWeight: '600',
                    fontSize: hp('2.5%'),
                    color: TEXT_COLOR,
                  }}
                >
                  ₹
                  {formatNumberCommasDecimal(
                    parseFloat(this.payment.paymentAmount).toFixed(2)
                  )}
                </TextMontserrat>
              </View>
            </TouchableOpacity>

            {this.state.payCant < this.payment.paymentAmount && false ? (
              <View style={{ height: hp('2.5%') }} />
            ) : (
              <View style={{ alignItems: 'flex-end', marginRight: hp('2%') }}>
                <TextMontserrat
                  style={{
                    fontWeight: '600',
                    color: '#D0021B',
                    fontSize: hp('1.85%'),
                  }}
                >
                  {this.state.payCant < this.payment.paymentAmount
                    ? `₹${this.toDecimal(
                        this.payment.paymentAmount - this.state.payCant,
                        2
                      )} more to pay`
                    : `₹${this.renderChange()} change out of ₹ ${formatNumberCommasDecimal(
                        parseFloat(this.state.payCant).toFixed(2)
                      )}`}
                </TextMontserrat>
              </View>
            )}
            <TextMontserrat
              style={{
                marginTop: hp('0.8'),
                textAlign: 'center',
                fontSize: hp('3%'),
                fontWeight: '800',
              }}
            >
              Easy Tendering
            </TextMontserrat>
            <TextMontserrat
              style={{
                marginBottom: hp('2%'),
                textAlign: 'center',
                fontSize: hp('1.8%'),
                fontWeight: '600',
              }}
            >
              Tap on an amount to tender for that value
            </TextMontserrat>
            <View style={{ flex: 1 }}>
              <View
                style={{ flexDirection: 'row', justifyContent: 'space-around' }}
              >
                <View
                  style={{
                    width: '50%',
                    paddingLeft: hp('2%'),
                    paddingRight: hp('1%'),
                  }}
                >
                  <ButtonGradient
                    ref={x => (this.butt2000 = x)}
                    canAddTender={canAddTender}
                    onPress={() => {
                      return this.changePayCant(2000);
                    }}
                    cant={true}
                    heightB={true}
                    style={{ marginBottom: hp('1.5%') }}
                    firstColor={'#ECD4EC'}
                    secondColor={'#AB6CAF'}
                    title={'₹2000'}
                  />
                  <ButtonGradient
                    ref={x => (this.butt200 = x)}
                    canAddTender={canAddTender}
                    onPress={() => {
                      return this.changePayCant(200);
                    }}
                    cant={true}
                    heightB={true}
                    style={{ marginBottom: hp('1.5%') }}
                    firstColor={'#F5D1AF'}
                    secondColor={'#E98B42'}
                    title={'₹200'}
                  />
                  <ButtonGradient
                    ref={x => (this.butt50 = x)}
                    canAddTender={canAddTender}
                    onPress={() => {
                      return this.changePayCant(50);
                    }}
                    cant={true}
                    heightB={true}
                    style={{ marginBottom: hp('1.5%') }}
                    firstColor={'#CAE0D4'}
                    secondColor={'#6BD6C7'}
                    title={'₹50'}
                  />

                  <ButtonGradient
                    ref={x => (this.butt10 = x)}
                    canAddTender={canAddTender}
                    onPress={() => {
                      return this.changePayCant(10);
                    }}
                    cant={true}
                    heightB={true}
                    style={{ marginBottom: hp('3%') }}
                    firstColor={'#E7C2A8'}
                    secondColor={'#B58E7D'}
                    title={'₹10'}
                  />
                </View>
                <View
                  style={{
                    width: '50%',
                    paddingLeft: hp('1%'),
                    paddingRight: hp('2%'),
                  }}
                >
                  <ButtonGradient
                    ref={x => (this.butt500 = x)}
                    canAddTender={canAddTender}
                    onPress={() => {
                      return this.changePayCant(500);
                    }}
                    cant={true}
                    heightB={true}
                    style={{ marginBottom: hp('1.5%') }}
                    firstColor={'#E8DCC6'}
                    secondColor={'#9A968B'}
                    title={'₹500'}
                  />
                  <ButtonGradient
                    ref={x => (this.butt100 = x)}
                    canAddTender={canAddTender}
                    onPress={() => {
                      return this.changePayCant(100);
                    }}
                    cant={true}
                    heightB={true}
                    style={{ marginBottom: hp('1.5%') }}
                    firstColor={'#EAECFB'}
                    secondColor={'#928BE5'}
                    title={'₹100'}
                  />
                  <ButtonGradient
                    ref={x => (this.butt20 = x)}
                    canAddTender={canAddTender}
                    onPress={() => {
                      return this.changePayCant(20);
                    }}
                    cant={true}
                    heightB={true}
                    style={{ marginBottom: hp('1.5%') }}
                    firstColor={'#F3CFAD'}
                    secondColor={'#CE6959'}
                    title={'₹20'}
                  />

                  <ButtonGradient
                    ref={x => (this.butt5 = x)}
                    canAddTender={canAddTender}
                    onPress={() => {
                      return this.changePayCant(5);
                    }}
                    cant={true}
                    heightB={true}
                    style={{ marginBottom: hp('3%') }}
                    firstColor={'#E1DEA7'}
                    secondColor={'#9CAD81'}
                    title={'₹5'}
                  />
                </View>
              </View>
            </View>
            {/* <View
            style={{
              flex: 1,
              flexGrow: 1,
              justifyContent: 'flex-end',
            }}
          /> */}
            <ButtonGradientPay
              disabled={this.state.payCant < this.payment.paymentAmount}
              onPress={() => {
                this.pay();
              }}
              heightB={hp(isTablet ? '13%' : '12%')}
              firstColor={'#114B8C'}
              secondColor={'#0079AA'}
              title={
                'PAY ₹' +
                formatNumberCommasDecimal(this.payment.paymentAmount.toFixed(2))
              }
            />
          </ScrollView>
        </ImageBackground>
      );
  }
}
const TEXT_COLOR = '#47525D';

const mapStateToProps = state => ({
  state: state.cashData,
  payment: state.payment_data.payment,
  order: state.payment_data.order,
});

const mapDispatchToProps = dispatch => ({
  clear_order: () => dispatch(cashActions.clear_data()),
  clear_customer: () => dispatch(cashActions.clear_customer()),
});
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CashPayments);
