import React, { Component } from 'react';
import { View, Image, ImageBackground, ScrollView } from 'react-native';
import PaymentsHeader from '../../components/header/header';
import TransactionDetails from './../../components/transaction_details/transaction_details';
import { ButtonGradient, Alert } from 'components';
import { connect } from 'react-redux';
import { isTablet } from '../../../cash_register/constants/isLandscape';
import EStyleSheet from 'react-native-extended-stylesheet';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import { TextMontserrat } from 'components';
import FormUPI from './components/formUPI/formUPI';
import { formatNumberCommasDecimal } from 'api';
import alert_service from '../../../../services/alert_service';
import WaitingPayment from './components/waiting_payment/waiting_payment';
import * as yup from 'yup';
import RCTRealtime from '../../../../services/RCTRealtime';
import NavigationService from 'services/navigation';
import { cancelPendingTransactions } from 'api';
import { onPressBack } from '../../../../api/confirm';
//import mixpanel from '../../../../services/mixpanel';
const _messageListenerCreator = (transactionId, payment, navigation) => {
  // for test
  /* setTimeout(() => {
    RCTRealtime.emit('onMessageEvent', {
      type: 'UPI',
      transactionStatusId: 6,
      transactionId,
    });
  }, 5000); */
  return (data, callback) => {
    const { type, transactionStatusId } = data;
    if (data.transactionId === transactionId) {
      if (type === 'UPI') {
        if (transactionStatusId === 2) {
          payment.paymentResponse.process.response.transactionStatusId = 2;
          payment.emit('payment_succesfull');
        } else {
          // alert('rejected');
          if (callback) {
            callback();
          }

          /*alert_service.showAlert('Payment failed', () => {
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
          });*/
        }
      }
    }
  };
};
class PaymentsUpi extends Component {
  static navigationOptions = ({ navigation }) => ({
    header: isTablet ? null : (
      <PaymentsHeader
        navigation={navigation}
        title="UPI"
        headerRight
        replaceBack={onPressBack}
      />
    ),
  });

  constructor(props) {
    super(props);
    //mixpanel.track('UPI Payment');

    this.payment = this.props.payment;

    this.order =
      this.props.navigation != null
        ? this.props.navigation.getParam('order', null)
        : null;
  }

  state = {
    payCant: 0,
    attemps: 0,
    step: 'initiate',
  };

  componentDidMount() {
    cancelPendingTransactions(this.payment);
  }
  componentWillUnmount() {
    if (this.listener) {
      RCTRealtime.removeListener('onMessageEvent', this.listener);
    }
  }

  UPI_SQUEMA = yup.object().shape({
    virtualAddress: yup
      .string()
      .min(4)
      .test('valid-address', 'Insert a valid address', value =>
        new RegExp(/[\w]*[@][\w]+/).test(value)
      )
      .required(),
    remark: yup.string().required(),
  });
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
  render() {
    return (
      <ImageBackground
        source={require('../../../../assets/images/bg/loadingBackground.png')}
        style={{
          paddingHorizontal: 10,
          paddingVertical: 20,
          width: '100%',
          flex: 1,
        }}
      >
        <ScrollView
          // showsVerticalScrollIndicator={true}
          style={{ flex: 1 }}
          scrollEnabled={true}
          keyboardShouldPersistTaps={'handled'}
        >
          <TransactionDetails
            data={this.props.state}
            manual={this.order != null}
            order={this.props.payment.order}
          />
          {this.state.step === 'initiate' && (
            <View style={styles.containerBox}>
              <View style={styles.titleContainer}>
                <Image
                  source={require('../../assets/icons/UPI.png')}
                  style={{
                    marginLeft: hp('1%'),
                    marginTop: hp('1%'),
                    marginBottom: hp('1%'),
                    marginRight: hp('1.5%'),
                    height: hp('5.5%'),
                    width: hp('5.5%'),
                  }}
                />
                <TextMontserrat
                  style={{
                    opacity: 0.8,
                    color: '#5D6770',
                    fontWeight: '700',
                    fontSize: hp('2.2%'),
                  }}
                >
                  UPI
                </TextMontserrat>
              </View>
              <View style={styles.bodyContainer}>
                <View style={{ width: '88%', marginBottom: hp('2%') }}>
                  <FormUPI
                    onChangeForm={async x => {
                      const upi = {
                        virtualAddress: x.VirtualAddress,
                        remark: x.Remark,
                      };
                      this.UPI_SQUEMA.validate(upi)
                        .then(() => {
                          this.setState({ upi, formValid: true });
                        })
                        .catch(err => {
                          console.log({ err });
                          this.setState({ upi, formValid: false });
                        });
                    }}
                    onCollect={() => {}}
                  />
                </View>
              </View>
            </View>
          )}
          {this.state.step === 'process' && (
            <View
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                width: '100%',
              }}
            >
              <WaitingPayment size={!isTablet ? hp('25%') : wp('20%')} />
            </View>
          )}
          <View style={{ height: hp('3%') }} />
          {this.state.step === 'initiate' && (
            <View>
              <ButtonGradient
                absolute={true}
                disabled={!this.state.formValid}
                onPress={() => {
                  this.payment
                    .payStep('process', {
                      data: this.state.upi,
                      upi: true,
                      skipSuccess: true,
                      transactionTypeId: 20,
                    })
                    .then(async res => {
                      this.setState({ step: 'process' });
                      this.listener = _messageListenerCreator(
                        res.response.transactionId,
                        this.payment,
                        this.props.navigation
                      );
                      RCTRealtime.on('onMessageEvent', data => {
                        this.listener.call(this, data, () => {
                          this.setState({
                            alertActive: true,
                            alertMessage: 'Payment failed',
                          });
                        });
                      });
                    })
                    .catch(err => {
                      console.log(err);
                      this.setState({ attemps: this.state.attemps + 1 });
                      this.setState({
                        alertActive: true,
                        alertMessage: err.message,
                      });
                      //alert_service.showAlert(err.message);
                    });
                }}
                title={
                  this.state.attemps < 1
                    ? 'PAY ₹' +
                      formatNumberCommasDecimal(
                        this.payment.paymentAmount.toFixed(2)
                      )
                    : 'RETRY PAY'
                }
                labelSize={isTablet ? hp('2.5%') : wp('3%')}
                style={{ height: hp('7%'), width: '100%' }}
              />
            </View>
          )}
          <View style={{ height: hp('3%') }} />
        </ScrollView>
        {this.state.alertActive && (
          <Alert
            textSize={1.5}
            fontWeight="600"
            message={[this.state.alertMessage]}
            buttonTitle="OK"
            onPress={() => {
              this.setState({ alertActive: false }, () =>
                setTimeout(() => {
                  if (this.state.alertMessage == 'Payment failed') {
                    if (this.payment.split) {
                      if (this.props.navigation) {
                        return NavigationService.backToSplit();
                      } else {
                        this.payment.emit('toggle_invoice', {
                          screen: 'PaymentsCheckout',
                        });
                      }
                    } else {
                      NavigationService.reset('CashRegister');
                    }
                  }
                }, 300)
              );
            }}
          />
        )}
      </ImageBackground>
    );
  }
}
const styles = EStyleSheet.create({
  containerBox: {
    backgroundColor: 'white',
    borderWidth: 0.5,
    borderColor: '#ddd',
    borderRadius: 3,
    elevation: 3,
    marginTop: hp('1%'),
  },
  titleContainer: {
    width: '100%',
    borderBottomWidth: 1,
    borderColor: 'rgba(0,0,0,0.1)',
    flexDirection: 'row',
    alignItems: 'center',
  },
  bodyContainer: {
    width: '100%',
    alignItems: 'center',
  },
  containerOtpFields: {
    alignItems: 'center',
  },
  labelOtp: {
    textAlign: 'center',
    fontWeight: '700',
    marginBottom: hp('0.5%'),
    fontSize: hp('1.5%'),
    color: '#6B6B6B',
  },
});
const mapStateToProps = state => ({
  state: state.cashData,
  payment: state.payment_data.payment,
  order: state.payment_data.order,
});
export default connect(mapStateToProps)(PaymentsUpi);
