import React, { Component } from 'react';
import {
  View,
  ImageBackground,
  ScrollView,
  Linking,
  Modal,
  TouchableOpacity,
  BackHandler,
} from 'react-native';
import PaymentsHeader from '../../components/header/header';
import { TextMontserrat } from 'components';
import EStyleSheet from 'react-native-extended-stylesheet';
import TransactionDetails from './../../components/transaction_details/transaction_details';
import { connect } from 'react-redux';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import * as screen_names from '../../../../navigation/screen_names';
import * as payment_names from '../../../settings/components/icons/payments/payment_names';
import { getLocalSettingRow } from '../../../../services/settings_service';
import colors from '../../../cash_register/styles/colors';
import LinearGradient from 'react-native-linear-gradient';
import { isTablet } from '../../../cash_register/constants/isLandscape';
import ItemsContainer from '../../../cash_register/components/ItemsContainer/itemsContainer';
import * as screenNames from 'navigation/screen_names';
import { cashActions } from '../../../cash_register/actions';
import { PayAmount } from './components/pay_amount/pay_amount';
import Details from '../../../invoice/components/content/details/details';
import { clearPayment } from './../../actions/payment_actions';
import alert_service from '../../../../services/alert_service';
import { onPressBack } from '../../../../api/confirm';
class CheckoutScreen extends Component {
  static navigationOptions = ({ navigation }) => ({
    header: () => {
      const split = navigation.getParam('split', false);
      return (
        <PaymentsHeader
          replaceBack={onPressBack}
          navigation={navigation}
          title={split ? 'SPLIT' : 'CHECKOUT'}
          headerRight={true}
        />
      );
    },
  });

  constructor(props) {
    super(props);

    this.screenNames = {
      [payment_names.CARD]: screen_names.PAYMENTS_CARD,
      [payment_names.CASH]: screen_names.PAYMENTS_CASH,
      [payment_names.WALLETS]: screen_names.PAYMENTS_WALLET,
      [payment_names.UPI_PAYMENTS]: screen_names.PAYMENTS_UPI,
      [screenNames.INVOICE]: screenNames.INVOICE,
    };
    console.log({ checkout_props: this.props });
    if (this.props.payment.on) {
      this.payment = this.props.payment;
      this.split = this.payment.split;
    }
  }

  state = {
    visible: false,
    amountToPay: 0,
  };
  componentDidMount() {
    if (this.props.payment.on) {
      this.props.payment.on('payment_succesfull', this.paymentListener);
    }

    if (this.props.navigation) {
      this._willBlurSubscription = BackHandler.addEventListener(
        'hardwareBackPress',
        onPressBack.bind(this, this.props.payment, this.props.navigation)
      );
    }
  }

  componentWillUnmount() {
    if (this.props.payment.off) {
      this.props.payment.off('payment_succesfull', this.paymentListener);
    }

    this._didFocusSubscription && this._didFocusSubscription.remove();
    if (this._willBlurSubscription) {
      this._willBlurSubscription.remove();
    }
  }
  paymentListener = () => {
    this.forceUpdate();
  };
  _willBlurSubscription;

  renderTransactionsDetails() {
    if (!this.payment) {
      return null;
    }
    return (
      <View>
        {this.payment.transactions
          .filter(x => x.process.response.transactionStatusId === 2)
          .map((transaction, i) => {
            const { icon, title, items } = transaction.getPaymentDetails();
            return (
              <Details
                noPadd={isTablet}
                transaction={transaction}
                key={'transaction_' + i}
                payment={this.payment}
                refund={false}
                last={true}
                split={this.split}
                total={transaction.process.response.transactionAmount}
                items={items}
                icon={icon}
                title={title}
              />
            );
          })}
      </View>
    );
  }

  render() {
    return (
      <ImageBackground
        source={require('../../../../assets/images/bg/loadingBackground.png')}
        style={{
          paddingVertical: 20,
          flex: 1,
        }}
      >
        <ScrollView>
          <View style={{ paddingHorizontal: 10 }}>
            <TransactionDetails
              order={this.split ? this.props.payment.order : this.props.order}
              //order={this.props.order}
              data={this.props.state}
            />
          </View>
          <View style={{ paddingHorizontal: 10 }}>
            {this.split && (
              <PayAmount
                payment={this.payment}
                payAmount={
                  this.payment
                    ? this.payment.getAmountToPay()
                    : this.props.order.totalPrice
                }
                onChangeAmount={amountToPay => {
                  if (this.props.payment) {
                    this.props.payment.paymentAmount = +amountToPay;
                    this.forceUpdate();
                  }
                }}
              />
            )}
          </View>
          <View style={{ height: 120 }}>
            <ItemsContainer
            navParams={{checkout: true}}
              disabled={() => {
                if (this.payment) {
                  const payment = this.payment;
                  const min = payment.paymentAmount < 1;
                  const notEqual =
                    payment.paymentAmount != payment.getAmountToPay();

                  const max =
                    payment.paymentAmount > payment.getAmountToPay() - 1 &&
                    notEqual;

                  if (min || max) {
                    return true;
                  }
                }
                return false;
              }}
              total={this.props.order.totalPrice}
              amountToPay={this.state.amountToPay}
              setwallet={this.props.set_wallet}
              togglePayment={screen => {
                this.props.navigation.navigate(this.screenNames[screen]);
              }}
              split={this.split}
            />
          </View>
          {this.renderTransactionsDetails()}
          {/* {this.payment && <CashPayment />} */}
          <View
            style={{
              flex: 1,
              flexGrow: 1,
              justifyContent: 'flex-end',
            }}
          />
        </ScrollView>

        <Modal
          visible={this.state.visible}
          onRequestClose={() => {
            this.setState({ visible: false });
          }}
          transparent={true}
          animationType="fade"
        >
          <View
            style={{
              width: '100%',
              backgroundColor: colors.opacityDin(0.6),
              justifyContent: 'center',
              alignItems: 'center',
              height: '100%',
            }}
          >
            <View
              style={{
                width: isTablet ? '20%' : '80%',
                height: hp('29%'),
                elevation: 5,
                backgroundColor: 'white',
                borderRadius: 6,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <TextMontserrat
                style={{ fontWeight: '600', fontSize: hp('2.3%') }}
              >
                Please contact our Customer
              </TextMontserrat>
              <TextMontserrat
                style={{ fontWeight: '600', fontSize: hp('2.3%') }}
              >
                Happiness team on
              </TextMontserrat>
              <TouchableOpacity
                onPress={() => {
                  Linking.openURL('tel://+919810001234');
                }}
              >
                <TextMontserrat
                  style={{
                    fontWeight: '600',
                    fontSize: hp('2.3%'),
                    color: '#174285',
                  }}
                >
                  +91 9810001234
                </TextMontserrat>
              </TouchableOpacity>
              <TextMontserrat
                style={{ fontWeight: '600', fontSize: hp('2.3%') }}
              >
                to activate this feature.
              </TextMontserrat>
              <TouchableOpacity
                onPress={() => this.setState({ visible: false })}
                style={{
                  borderRadius: 50,
                  elevation: 9,
                  backgroundColor: 'white',
                  marginTop: hp('3%'),
                  width: '70%',
                  height: hp('6%'),
                }}
              >
                <LinearGradient
                  colors={['#174285', '#0079AA']}
                  start={{ x: 0, y: 1 }}
                  end={{ x: 1, y: 1 }}
                  style={{
                    borderRadius: 50,
                    alignItems: 'center',
                    width: '100%',
                  }}
                >
                  <View
                    style={{
                      width: '100%',
                      height: '100%',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <TextMontserrat
                      style={styles.textDiscountAddButtonPortrait}
                    >
                      OK
                    </TextMontserrat>
                  </View>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </ImageBackground>
    );
  }
}

const styles = EStyleSheet.create({
  circleButton: {
    marginRight: '1.7rem',
  },
  textDiscountAddButtonPortrait: {
    color: 'white',
    fontSize: hp('1.95%'),
    letterSpacing: 1.33,
    textAlign: 'center',
    fontWeight: '600',
  },
});
const mapStateToProps = state => ({
  state: state.cashData,
  payment: state.payment_data.payment,
  order: state.payment_data.order,
});
const mapDispatchToProps = dispatch => ({
  set_wallet: val => {
    return dispatch(cashActions.set_wallet(val));
  },
  clearPayment: () => dispatch(clearPayment()),
});
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CheckoutScreen);
