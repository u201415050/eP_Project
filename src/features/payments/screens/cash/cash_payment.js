import React, { Component } from 'react';
import { View, Image, TouchableOpacity, NetInfo } from 'react-native';
import { TextMontserrat } from 'components';
import ButtonGradient from './components/transaction_details/components/buttonGradientColor/ButtonGradient';
import { connect } from 'react-redux';
import { formatNumberCommasDecimal } from 'api';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';

import alert_service from '../../../../services/alert_service';
import { cashActions } from '../../../cash_register/actions';
class CashPayment extends Component {
  constructor(props) {
    super(props);
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
  }
  state = {
    payCant: 100,
    hastender: false,
  };

  componentDidMount() {
    let payAmount = this.payment.paymentAmount;

    this.setState({ payCant: payAmount });
  }

  isSplit() {
    return this.payment.paymentAmount < this.payment.order.totalPrice;
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
    if (this.state.payCant == 0) {
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
        this.payment.setChange(this.renderChange());
      });
      return;
    }
    if (this.state.payCant < this.payment.paymentAmount) {
      let payAcum = this.state.payCant + val;
      this.setState(
        {
          payCant: payAcum,
        },
        () => {
          this.payment.setChange(this.renderChange());
        }
      );
    }
  };
  render() {
    return (
      <View
        keyboardShouldPersistTaps="always"
        style={{ flex: 1 }}
        contentContainerStyle={{
          paddingHorizontal: hp('0.1'),
          paddingVertical: hp('2%'),
        }}
        showsVerticalScrollIndicator={false}
      >
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => {
            this.setState({
              payCant: 0,
            });
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

        {this.state.payCant < this.payment.paymentAmount ? (
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
              ₹{this.renderChange()} change out of ₹
              {formatNumberCommasDecimal(
                parseFloat(this.state.payCant).toFixed(2)
              )}
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
                onPress={() => {
                  this.changePayCant(2000);
                }}
                heightB={true}
                style={{ marginBottom: hp('1.5%') }}
                firstColor={'#ECD4EC'}
                secondColor={'#AB6CAF'}
                title={'₹2000'}
              />
              <ButtonGradient
                onPress={() => {
                  this.changePayCant(200);
                }}
                heightB={true}
                style={{ marginBottom: hp('1.5%') }}
                firstColor={'#F5D1AF'}
                secondColor={'#E98B42'}
                title={'₹200'}
              />
              <ButtonGradient
                onPress={() => {
                  this.changePayCant(50);
                }}
                heightB={true}
                style={{ marginBottom: hp('1.5%') }}
                firstColor={'#CAE0D4'}
                secondColor={'#6BD6C7'}
                title={'₹50'}
              />

              <ButtonGradient
                onPress={() => {
                  this.changePayCant(10);
                }}
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
                onPress={() => {
                  this.changePayCant(500);
                }}
                heightB={true}
                style={{ marginBottom: hp('1.5%') }}
                firstColor={'#E8DCC6'}
                secondColor={'#9A968B'}
                title={'₹500'}
              />
              <ButtonGradient
                onPress={() => {
                  this.changePayCant(100);
                }}
                heightB={true}
                style={{ marginBottom: hp('1.5%') }}
                firstColor={'#EAECFB'}
                secondColor={'#928BE5'}
                title={'₹100'}
              />
              <ButtonGradient
                onPress={() => {
                  this.changePayCant(20);
                }}
                heightB={true}
                style={{ marginBottom: hp('1.5%') }}
                firstColor={'#F3CFAD'}
                secondColor={'#CE6959'}
                title={'₹20'}
              />

              <ButtonGradient
                onPress={() => {
                  this.changePayCant(5);
                }}
                heightB={true}
                style={{ marginBottom: hp('3%') }}
                firstColor={'#E1DEA7'}
                secondColor={'#9CAD81'}
                title={'₹5'}
              />
            </View>
          </View>
        </View>
        <View
          style={{
            flex: 1,
            flexGrow: 1,
            justifyContent: 'flex-end',
          }}
        />
        <ButtonGradient
          disabled={this.state.payCant < this.payment.paymentAmount}
          onPress={() => {
            this.onPay();
          }}
          //heightB={hp(isTablet?'13%':'12%')}
          firstColor={'#114B8C'}
          secondColor={'#0079AA'}
          title={
            'PAY ₹' +
            formatNumberCommasDecimal(this.payment.paymentAmount.toFixed(2))
          }
        />
      </View>
    );
  }
}
const TEXT_COLOR = '#47525D';

const mapStateToProps = state => ({
  state: state.cashData,
  payment: state.payment_data.payment,
});

const mapDispatchToProps = dispatch => ({
  clear_order: () => dispatch(cashActions.clear_data()),
  clear_customer: () => dispatch(cashActions.clear_customer()),
});
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CashPayment);
