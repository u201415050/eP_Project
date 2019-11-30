import React, { Component } from 'react';
import {
  Dimensions,
  View,
  Text,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
  TouchableHighlight,
  KeyboardAvoidingView,
  Image,
  Modal,
  TextInput,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import * as screen_names from '../../../../../navigation/screen_names';
import * as payment_names from '../../../../settings/components/icons/payments/payment_names';
import { connect } from 'react-redux';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import CardWithHeader from '../../cards/card_header';
import CashPayments from '../../../../payments/screens/cash/cash';
import CardPayments from '../../../../payments/screens/card/card';
import WalletPayments from '../../../../payments/screens/wallet/wallet';
import UPIPayments from '../../../../payments/screens/upi/upi';
import UPIScan from '../../../../payments/screens/upi_qr/upi_qr';
import colors from '../../../styles/colors';
import ChequePayments from '../../../../payments/screens/cheque/cheque';
import Checkout from '../../../../payments/screens/checkout/checkout';
import { onPressBack } from '../../../../../api/confirm';
const options = ['%', '₹'];
class ModalCash extends Component {
  constructor() {
    super();
    this.screenNames = {
      [payment_names.CARD]: screen_names.PAYMENTS_CARD,
      [payment_names.CASH]: screen_names.PAYMENTS_CASH,
      [payment_names.WALLETS]: screen_names.PAYMENTS_WALLET,
      [payment_names.UPI_PAYMENTS]: screen_names.PAYMENTS_UPI,
      [screen_names.INVOICE]: screen_names.INVOICE,
    };
  }
  state = {
    optionsActive: false,
    optionSelected: 1,
    valueDiscount: 0,
    inputFocus: false,
    wrong: false,
  };
  addValidate() {
    const { addDiscount } = this.props;
    this.setState({ wrong: false });
    addDiscount({
      discount: parseFloat(this.state.valueDiscount),
      type: options[this.state.optionSelected - 1],
    });
  }
  render() {
    const {
      active,
      closeModal,
      widthModal,
      isLandscape,
      type,
      toggleInvoice,
      toggleQR,
      toggleModalPaymentScreen,
      next,
    } = this.props;
    return (
      <Modal
        visible={active}
        transparent={true}
        animationType="fade"
        onRequestClose={() => {
          onPressBack(this.props.payment, null, false, closeModal, true);
        }}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.container}>
            <KeyboardAvoidingView
              behavior="padding"
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                flex: 1,
              }}
            >
              <CardWithHeader
                isLandscape={isLandscape}
                sizeHeaderLabel={isLandscape ? '3.5%' : '3%'}
                customBodyStyle={{
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
                headerTitle={
                  type == screen_names.PAYMENTS_CASH
                    ? 'Cash'
                    : type == screen_names.PAYMENTS_CARD
                    ? 'Card'
                    : type == screen_names.PAYMENTS_UPI
                    ? 'UPI'
                    : type == screen_names.PAYMENTS_UPI_QR
                    ? 'UPI Scan to Pay'
                    : type == screen_names.PAYMENTS_WALLET
                    ? 'Wallet'
                    : type == screen_names.PAYMENTS_CHEQUE
                    ? 'Cheque'
                    : type == 'PaymentsCheckout'
                    ? 'Split Payment'
                    : 'UMI'
                }
                closeButton={true}
                onPressCloseButton={() => {
                  if (type != screen_names.PAYMENTS_WALLET) {
                    toggleModalPaymentScreen('', false);
                  } else {
                    if (this.modalScreen != null) {
                      this.modalScreen.openCancel();
                    } else {
                      const callback = () => {
                        console.log('AQUI');
                        if (this.props.payment.split) {
                          console.log('first');
                          if (type === 'PaymentsCheckout') {
                            //toggleModalPaymentScreen('', false);
                            return;
                          }
                          this.props.payment.emit('toggle_invoice', {
                            screen: 'PaymentsCheckout',
                          });
                        } else {
                          console.log('second');
                          //toggleModalPaymentScreen('', false);
                        }
                      };
                      onPressBack(
                        this.props.payment,
                        null,
                        false,
                        callback,
                        type === 'PaymentsCheckout'
                      );
                    }
                  }
                  /*const callback = () => {
                    console.log('AQUI');
                    if (this.props.payment.split) {
                      console.log('first');
                      if (type === 'PaymentsCheckout') {
                        //toggleModalPaymentScreen('', false);
                        return;
                      }
                      this.props.payment.emit('toggle_invoice', {
                        screen: 'PaymentsCheckout',
                      });
                    } else {
                      console.log('second');
                      //toggleModalPaymentScreen('', false);
                    }
                  };
                  onPressBack(
                    this.props.payment,
                    null,
                    false,
                    callback,
                    type === 'PaymentsCheckout'
                  );*/
                }}
                customCardStyle={{
                  width: hp(widthModal),
                  height: type == payment_names.CASH ? hp('95%') : hp('88%'),
                }}
              >
                <View style={styles.wrapper}>
                  {type == screen_names.PAYMENTS_CASH ? (
                    <CashPayments
                      next={next}
                      toggleInvoice={toggleInvoice}
                      isTablet={true}
                    />
                  ) : null}
                  {type == screen_names.PAYMENTS_CARD ? <CardPayments /> : null}
                  {type == screen_names.PAYMENTS_UPI ? (
                    <UPIPayments
                      next={next}
                      toggleQR={toggleQR}
                      closeModal={closeModal}
                    />
                  ) : null}
                  {type == screen_names.PAYMENTS_UPI_QR ? (
                    <UPIScan closeModal={closeModal} />
                  ) : null}
                  {type == screen_names.PAYMENTS_WALLET ? (
                    <WalletPayments
                      inputref={x => (this.modalScreen = x)}
                      next={next}
                      toggleInvoice={toggleInvoice}
                      closeModal={() => toggleModalPaymentScreen('', false)}
                    />
                  ) : null}
                  {type == screen_names.PAYMENTS_CHEQUE ? (
                    <ChequePayments next={next} toggleInvoice={toggleInvoice} />
                  ) : null}
                  {type == 'PaymentsCheckout' ? <Checkout /> : null}
                </View>
              </CardWithHeader>
            </KeyboardAvoidingView>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    );
  }
}

// define your styles
const styles = StyleSheet.create({
  container: {
    width: '100%',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.opacityDin(0.6),
  },
  wrapper: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: hp('3%'),
    height: '95%',
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
  },
  rowForm: {
    width: '130%',
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: '#174285',
    borderBottomWidth: 2,
  },
  leftForm: {
    flexDirection: 'row',
    width: '30%',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  separation: {
    borderColor: '#174285',
    borderRightWidth: 2,
    height: '100%',
  },
  rightForm: {
    width: '70%',
    flexDirection: 'row',
    alignItems: 'center',
  },
  drop: {
    marginRight: hp('0.6%'),
  },
  select: {
    textAlign: 'center',
    fontSize: wp('4.4%'),
    marginLeft: 10,
    color: '#174285',
    fontFamily: 'Montserrat-SemiBold',
    marginBottom: 5,
  },
  icon: {
    position: 'absolute',
    right: 4,
  },
  textInput: {
    paddingVertical: 0,
    color: '#174285',
    paddingLeft: wp('6%'),
    fontSize: hp('2.8%'),
    width: '80%',
    marginBottom: 5,
    fontFamily: 'Montserrat-Bold',
  },
  textDiscountAddButtonPortrait: {
    fontFamily: 'Montserrat-SemiBold',
    color: 'white',
    fontSize: hp('1.95%'),
    letterSpacing: 1.33,
    textAlign: 'center',
  },
  touchableModalDiscountAdd: {
    width: '130%',
    height: hp('6.25%'),
    marginTop: hp('5%'),
    borderRadius: 50,
    marginBottom: hp('3%'),
    alignItems: 'center',
  },
  dropdown: {
    position: 'absolute',
    width: '30%',
    elevation: 20,
    top: 0,
    left: 0,
    borderLeftColor: colors.opacityDin(0.1),
    borderRightColor: colors.opacityDin(0.3),
    borderBottomColor: colors.opacityDin(0.3),
    borderWidth: 1,
  },
  option: {
    textAlign: 'center',
    fontSize: hp('2.5%'),
    paddingVertical: hp('1.1%'),
    backgroundColor: '#FAFAFA',
    fontFamily: 'Montserrat-ExtraBold',
  },
  messageWrong: {
    width: '100%',
    position: 'absolute',
    top: 2,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  messageWrongLabel: {
    fontSize: hp('1.5'),
    color: '#D0021B',
    flexWrap: 'wrap',
    fontFamily: 'Montserrat-SemiBold',
    textAlign: 'center',
    justifyContent: 'center',
    marginTop: hp('0.2%'),
  },
});

const mapStateToProps = state => ({
  payment: state.payment_data.payment,
});
export default connect(mapStateToProps)(ModalCash);
