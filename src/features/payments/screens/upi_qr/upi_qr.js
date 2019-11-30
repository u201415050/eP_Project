import React, { Component } from 'react';
import {
  View,
  Image,
  ImageBackground,
  ScrollView,
  BackHandler,
} from 'react-native';
import PaymentsHeader from '../../components/header/header';
import TransactionDetails from './../../components/transaction_details/transaction_details';
import { ButtonGradient } from 'components';
import { connect } from 'react-redux';
import { isTablet } from '../../../cash_register/constants/isLandscape';
import NavigationService from '../../../../services/navigation/index';
import alert_service from '../../../../services/alert_service';
import RCTRealtime from '../../../../services/RCTRealtime';
import { onPressBack } from '../../../../api/confirm';
import { cancelPendingTransactions } from 'api';
//import mixpanel from '../../../../services/mixpanel';
const _messageListenerCreator = (transactionId, payment, navigation) => {
  // for test
  // setTimeout(() => {
  //   RCTRealtime.emit('onMessageEvent', {
  //     type: 'UPI',
  //     transactionStatusId: 2,
  //     transactionId,
  //   });
  // }, 10000);
  return data => {
    const { type, transactionStatusId } = data;
    if (data.transactionId === transactionId) {
      if (type === 'UPI_QR') {
        if (transactionStatusId === 2) {
          payment.paymentResponse.process.response.transactionStatusId = 2;
          payment.emit('payment_succesfull');
        } else {
          // alert('rejected');
          alert_service.showAlert('Payment failed', () => {
            console.log(payment);
            if (payment.split) {
              if (navigation) {
                return NavigationService.backToSplit();
              } else {
                payment.emit('toggle_invoice', {
                  screen: 'PaymentsCheckout',
                });
              }
            } else {
              NavigationService.reset('CashRegister');
            }
          });
        }
      }
    }
  };
};
class PaymentsUpiQr extends Component {
  static navigationOptions = ({ navigation }) => ({
    header: isTablet ? null : (
      <PaymentsHeader
        navigation={navigation}
        title="UPI SCAN TO PAY"
        headerRight
        replaceBack={onPressBack}
      />
    ),
  });
  constructor(props) {
    super(props);
    //mixpanel.track('UPI QR');
    this.payment = this.props.payment;
    this.order =
      this.props.navigation != null
        ? this.props.navigation.getParam('order', null)
        : null;
    this.payment
      .payStep('process', {
        data: {},
        transactionTypeId: 27,
        skipSuccess: true,
        upiqr: true,
      })
      .then(res => {
        if (res.success) {
          this.setState({
            qrImageUrl: `https://chart.googleapis.com/chart?cht=qr&chl=${
              // 'upi://pay?pa=epaisa@eazypay&pn=epaisa&tr=EZY453139819007&am=13.39&cu=INR&mc=5411'
              encodeURIComponent(res.response.qrString)
              // 'https://chart.googleapis.com/chart?cht=qr&chl=omar%20es%20sendo%20marico%20y%20cesar%20se%20lo%20coje'
            }&chs=400x400`,
          });
          this.listener = _messageListenerCreator(
            res.response.transactionId,
            this.payment,
            this.props.navigation
          );
          RCTRealtime.on('onMessageEvent', this.listener.bind(this));
          // setTimeout(() => {
          //   console.log(this.payment.paymentResponse);
          //   this.payment.paymentResponse.process.response.transactionStatusId = 2;
          //   this.payment.emit('payment_succesfull');
          // }, 10000);
        } else {
          if (res.message) {
            alert_service.showAlert(
              res.message,
              this.props.navigation
                ? this.props.navigation.goBack
                : this.props.closeModal
            );
          }
        }
      })
      .catch(err => {
        alert_service.showAlert(
          err.message,
          this.props.navigation
            ? this.props.navigation.goBack
            : this.props.closeModal
        );
      });

    // RCTRealtime.on('onMessageEvent', this._messageListener);
  }

  state = {
    payCant: 0,
    qrImageUrl: 'true',
  };

  componentDidMount() {
    cancelPendingTransactions(this.payment);

    if (this.props.navigation) {
      this._willBlurSubscription = BackHandler.addEventListener(
        'hardwareBackPress',
        onPressBack.bind(
          this,
          this.props.payment,
          this.props.navigation || this.props.closeModal,
          true
        )
      );
    }
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', onPressBack);
    if (this.listener) {
      RCTRealtime.removeListener('onMessageEvent', this.listener);
    }
  }
  changePayCant = (val, tot) => {
    if (val >= tot) {
      this.setState({
        payCant: val,
      });
    } else {
      this.setState({
        payCant: tot,
      });
    }
  };
  _messageListener({ type, transactionStatusId }) {
    console.log({ type, transactionStatusId });
    if (type === 'UPI_QR') {
      if (transactionStatusId === 2) {
        this.payment.paymentResponse.process.response.transactionStatusId = 2;
        this.payment.emit('payment_succesfull');
      } else {
        alert_service.showAlert('Payment failed', () => {
          if (this.payment.split) {
            if (this.props.navigation) {
              return NavigationService.backToSplit();
            }
          } else {
            NavigationService.reset('CashRegister');
          }
        });
      }
    }
  }
  render() {
    return (
      <ImageBackground
        source={require('../../../../assets/images/bg/loadingBackground.png')}
        style={{
          paddingHorizontal: 10,
          paddingVertical: 20,
          width: '100%',
          height: '100%',
        }}
      >
        <ScrollView>
          <TransactionDetails
            data={this.props.state}
            order={this.props.payment.order}
          />
          <View style={{ alignItems: 'center' }}>
            {this.state.qrImageUrl && (
              <Image
                source={{ uri: this.state.qrImageUrl }}
                style={{ width: 400, height: 400 }}
              />
            )}
          </View>
        </ScrollView>
        <View
          style={{
            width: isTablet ? '100%' : '100%',
            alignItems: 'center',
          }}
        >
          <View style={{ width: '100%' }}>
            <ButtonGradient
              onPress={() => {
                onPressBack(
                  this.props.payment,
                  this.props.navigation,
                  false,
                  this.props.closeModal
                );
              }}
              title={'CANCEL'}
            />
          </View>
        </View>
      </ImageBackground>
    );
  }
}

const mapStateToProps = state => ({
  state: state.cashData,
  payment: state.payment_data.payment,
  order: state.payment_data.order,
});
export default connect(mapStateToProps)(PaymentsUpiQr);
