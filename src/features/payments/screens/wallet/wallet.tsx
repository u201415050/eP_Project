import React, { Component } from 'react';
import ReactNative, {
  BackHandler,
  Dimensions,
  ImageBackground,
  Keyboard,
  ScrollView,
  TouchableWithoutFeedback,
  View,
  KeyboardAvoidingView,
  Image,
} from 'react-native';
import AlertDoubleButtons from '../../../../components_general/popups/AlertDoubleButtons';
import PaymentsHeader from '../../components/header/header';
import { TextMontserrat, Alert, Loading } from 'components';
import EStyleSheet from 'react-native-extended-stylesheet';
import TransactionDetails from '../../components/transaction_details/transaction_details';
import { connect } from 'react-redux';
import { cancelPendingTransactions, formatNumberCommasDecimal } from 'api';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import { isTablet } from 'components';
import AddCustomerForm from './components/formInvoice/add_customer_form';
import OtpInputs from '../../../forgot_password/components/otp_forgot_password/components/otp_inputs';
import { getLocalSettingRow } from '../../../../services/settings_service';
import ButtonGradientPay from '../../../../components_general/buttons/ButtonGradientPay';
import PaymentIcon from '../../../settings/components/icons/payments/payment_icon/payment_icon';
import * as payment_names from '../../../settings/components/icons/payments/payment_names';
import alert_service from '../../../../services/alert_service';
import * as yup from 'yup';
import {
  AuthenticateResponse,
  PaymentType,
} from '../../../../interfaces/payment_interfaces';
import { NavigationScreenProp } from 'react-navigation';
import { onPressBack } from '../../../../api/confirm';
import DeviceInfo from 'react-native-device-info';
//import mixpanel from "../../../../services/mixpanel";

const isPortrait = () => {
  return !isTablet;
};
class WalletPayments extends Component<Props> {
  static navigationOptions = ({ navigation }: any) => ({
    header: isTablet ? null : (
      <PaymentsHeader
        replaceBack={onPressBack}
        navigation={navigation}
        title="WALLET"
        headerRight={false}
        //callback={this.}
      />
    ),
  });
  payment: PaymentType;
  method: string;
  constructor(props: Props) {
    super(props);
    console.log({ wallet: this.props });
    this.payment = this.props.payment;
    this.order =
      this.props.navigation != null
        ? this.props.navigation.getParam('order', null)
        : null;

    this.method = this.props.payment.method;
    //mixpanel.track(`${this.method} Wallet`);
    console.log({ METHOD: this.method });
    // this.order = this.props.navigation.getParam('order', null);
    // }
    if (this.props.inputref) {
      this.props.inputref(this);
    }
    //this.openCancel = this.openCancel.bind(this);
  }
  scrollRef;
  otpContainer;
  state = {
    otp: '',
    reset_password: { otp_valid: false, otp_invalid: false },
    can_resend_otp: true,
    visibleOtp: false,
    valid: false,
    orientation: isPortrait(),
  };
  componentDidMount() {
    cancelPendingTransactions(this.payment);

    if (this.props.navigation) {
      this._willBlurSubscription = BackHandler.addEventListener(
        'hardwareBackPress',
        onPressBack.bind(this, this.props.payment, this.props.navigation, true)
      );
    }
  }
  componentWillUnmount() {
    if (this._willBlurSubscription) {
      this._willBlurSubscription.remove();
    }
  }

  _willBlurSubscription;

  WALLET_SQUEMA = yup.object().shape({
    mobile: yup
      .string()
      .min(10)
      .min(10)
      .required(),
  });
  authenticatePayment(otp: number) {
    otp = +otp || +this.otp;

    this.payment
      .authenticateWalletPayment(this.payment, otp)
      .then((res: AuthenticateResponse) => {
        this.payment.paymentResponse.process.response.transactionStatusId = 2;
        this.payment.emit('payment_succesfull');
      })
      .catch(err => {
        console.log({ err });
        alert_service.showAlert(err.message, err.action);
        this.setState({
          reset_password: {
            otp_valid: false,
            otp_invalid: true,
          },
        });
      });
  }
  openCancel() {
    if (this.payment.paymentResponse.process) {
      this.setState({ alertdouble: true });
    } else {
      if (this.props.closeModal) {
        this.props.closeModal();
      }
    }
  }
  getOtpFields(): string[] {
    switch (this.method) {
      case payment_names.FREECHARGE:
      case payment_names.CITRUS:
      case payment_names.M_PESA:
        return ['first', 'second', 'third', 'fourth'];

      default:
        return ['first', 'second', 'third', 'fourth', 'fifth', 'sixth'];
    }
  }
  scrollToItem = ref => {
    ref.measureLayout(
      ReactNative.findNodeHandle(this.scrollRef),
      (x, y, width, height) => {
        console.log('HEIGHT', height);
        setTimeout(
          () =>
            this.scrollRef.scrollTo({
              x: 0,
              y: y - height,
              animated: true,
            }),
          200
        );
      }
    );
  };
  scrollToOtp = () => {};
  render() {
    let {
      total_amount,
      totalDiscount,
      totalDelivery,
      type,
      products,
      wallet,
    } = this.props.state;

    if (this.order != null) {
      products = this.order.products;
      totalDiscount = this.order.generalDiscount;
      totalDelivery = this.order.deliveryCharges;
      type = this.order.generalDiscountType;
    }
    let subTotalDiscount = 0;
    (this.order == null ? products : this.order.products).map(item => {
      if (item.type == '%') {
        subTotalDiscount = parseFloat(
          parseFloat(subTotalDiscount) +
            (parseFloat(item.quant) * parseFloat(item.unitPrice) -
              parseFloat(item.discount / 100) *
                (parseFloat(item.quant) * parseFloat(item.unitPrice)))
        );
      } else {
        subTotalDiscount =
          parseFloat(parseFloat(subTotalDiscount)) +
          (parseFloat(item.total) - parseFloat(item.discount));
      }
    });
    let finalDiscount =
      (this.order == null ? type : this.order.generalDiscountType) == '%'
        ? (subTotalDiscount *
            parseFloat(
              this.order == null ? totalDiscount : this.order.generalDiscount
            )) /
          100
        : parseFloat(
            this.order == null ? totalDiscount : this.order.generalDiscount
          );
    let CGST = subTotalDiscount * 0.09;
    let Total =
      parseFloat(subTotalDiscount) -
      parseFloat(finalDiscount) +
      parseFloat(
        this.order == null ? totalDelivery : this.order.deliveryCharges
      ); //+
    //parseFloat(CGST);
    if (
      getLocalSettingRow('Transaction', 'RoundOff') == true ||
      getLocalSettingRow('Transaction', 'RoundOff') == 1
    ) {
      Total = parseInt(Total.toFixed(0));
    }
    const shadowOpt = {
      width: this.state.orientation
        ? wp('12.5%') * this.getOtpFields().length - wp('1.6%')
        : wp('6%') * this.getOtpFields().length - wp('1.5%'),
      height: this.state.orientation
        ? hp('6.25') - hp('0.85%')
        : hp('8%') - hp('1.75%'),
      color: '#000',
      border: this.state.orientation ? hp('1%') : hp('1.8%'),
      radius: this.state.orientation ? 5 : 5,
      opacity: 0.3,
      x: this.state.orientation ? wp('1.4%') : wp('1.2%'),
      y: this.state.orientation ? hp('0.8%') : hp('1.6%'),
    };
    return (
      <View
        style={{
          flex: 1,
          width: '100%',
        }}
      >
        <Image
          source={require('../../../../assets/images/bg/loadingBackground.png')}
          resizeMode="cover"
          style={{
            position: 'absolute',
            width: '100%',
            top: 0,
            height: '100%',
            bottom: 0,
            backgroundColor: isTablet ? null : '#F5F5F5',
          }}
        />
        <View
          style={{
            flex: 1,
            paddingHorizontal: 10,
            paddingVertical: 20,
            paddingTop: isTablet ? 10 : 30,
          }}
        >
          <KeyboardAvoidingView
            behavior={isTablet ? null : 'padding'}
            style={{
              flex: 1,
              //marginTop: isTablet ? -hp('0.1%') : 0,
              width: '100%',
            }}
          >
            <ScrollView
              ref={x => (this.scrollRef = x)}
              style={{
                height: '100%',
              }}
              contentContainerStyle={{ paddingBottom: hp('18%') }}
              keyboardShouldPersistTaps="always"
            >
              <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View>
                  <TransactionDetails
                    data={this.props.state}
                    manual={this.order != null}
                    order={this.props.payment.order}
                  />

                  <View style={styles.containerBox}>
                    <View style={styles.titleContainer}>
                      <PaymentIcon
                        styleCustom={{
                          marginLeft: hp('1%'),
                          marginTop: hp('1%'),
                          marginBottom: hp('1%'),
                          marginRight: hp('1.5%'),
                        }}
                        size={isTablet ? wp('6.5%') * 0.66 : wp('11%')}
                        main={true}
                        iconName={this.method}
                        onPress={() => {}}
                      />

                      <TextMontserrat
                        style={{
                          opacity: 0.8,
                          color: '#5D6770',
                          fontWeight: '700',
                          fontSize: hp('2.4%'),
                        }}
                      >
                        {this.method} Wallet
                      </TextMontserrat>
                    </View>
                    <View style={styles.bodyContainer}>
                      <View
                        style={{
                          width: isTablet ? '100%' : '100%',
                          marginBottom: hp('2%'),
                          paddingHorizontal: hp('2.5%'),
                        }}
                      >
                        <AddCustomerForm
                          disabled={this.state.visibleOtp}
                          onChangeForm={({ UserMobileNumber }) => {
                            this.setState({ formIsValid: false }, () => {
                              const wallet = {
                                mobile: UserMobileNumber,
                              };
                              this.WALLET_SQUEMA.validate(wallet).then(() => {
                                this.setState({ wallet, formIsValid: true });
                              });
                            });
                          }}
                          submitCheck={() => {
                            this.setState({ valid: true });
                          }}
                        />
                      </View>
                    </View>
                  </View>
                </View>
              </TouchableWithoutFeedback>
              {/* this.state.visibleOtp */}
              {this.state.visibleOtp ? (
                <View style={styles.containerBox}>
                  <View
                    ref={x => (this.otpContainer = x)}
                    style={styles.containerOtpFields}
                  >
                    <TextMontserrat style={styles.labelOtp}>
                      {' '}
                      Insert OTP{' '}
                    </TextMontserrat>
                    {/* <BoxShadow setting={shadowOpt}> */}
                    <OtpInputs
                      custom={!isTablet}
                      ref={input => (this.opt_inputs = input)}
                      valid={this.state.reset_password.otp_valid}
                      invalid={this.state.reset_password.otp_invalid}
                      data={this.getOtpFields()}
                      handleFocus={() => {
                        if (!isTablet) {
                          this.scrollToItem(this.otpContainer);
                        }
                      }}
                      onChange={(otp: string) => {
                        this.otp = +otp;
                        const {
                          otp_valid,
                          otp_invalid,
                        } = this.state.reset_password;
                        if (otp_invalid || otp_valid) {
                          this.setState({
                            reset_password: {
                              otp_valid: false,
                              otp_invalid: false,
                            },
                          });
                        }
                      }}
                      onComplete={this.authenticatePayment.bind(this)}
                    />
                    {/* </BoxShadow> */}
                    {this.state.reset_password.otp_invalid && (
                      <TextMontserrat
                        style={{
                          fontWeight: '600',
                          fontSize: hp('1.9%'),
                          marginTop: 10,
                          color: '#D0021B',
                        }}
                      >
                        Incorrect Code - Re-insert or resend
                      </TextMontserrat>
                    )}
                  </View>
                  {/*<View style={containerTimer}>
                <Timer
                  ref={timer => (this.timer = timer)}
                  textStyle={timerText}
                  onStart={() => this.setState({ can_resend_otp: false })}
                  onFinished={() => this.setState({ can_resend_otp: true })}
                />
              </View>
                */}
                  {/* !isTablet ? (
                    <View
                      style={{
                        alignItems: 'center',

                        marginTop: hp('2.6%'),
                        marginBottom: hp('2.6%'),
                      }}
                    >
                      <View style={{ width: '70%' }}>
                        <ButtonGradientPay
                          title={'CONFIRM PAYMENT'}
                          colorText="#FFFFFF"
                          firstColor={'#114B8C'}
                          secondColor={'#0079AA'}
                          onPress={this.authenticatePayment.bind(this)}
                        />
                      </View>
                    </View>
                  ) : null */}
                </View>
              ) : null}
            </ScrollView>
          </KeyboardAvoidingView>
        </View>
        {!this.state.visibleOtp && (
          <View
            style={{
              justifyContent: 'flex-end',
              paddingBottom: hp('3%'),
              paddingHorizontal: 10,
            }}
          >
            <ButtonGradientPay
              disabled={!this.state.formIsValid}
              heightB={hp(isTablet ? '13%' : '12%')}
              onPress={() => {
                // alert(JSON.stringify(this.payment))
                /*isTablet
                ? this.props.toggleInvoice()*/
                this.setState({ loading: true });
                this.payment
                  .payStep('process', {
                    data: { wallet: true, mobile: this.state.wallet.mobile },
                    transactionTypeId:
                      payment_names.TRANSACTION_TYPE_WALLET[this.method],
                    skipSuccess: true,
                  })
                  .then(res => {
                    this.setState({ loading: false }, () => {
                      if (
                        res.response.status === 0 &&
                        res.response.transactionId
                      ) {
                        this.setState({ visibleOtp: true });
                      }
                    });
                  })
                  .catch(err => {
                    this.setState({ loading: false }, () => {
                      if (isTablet) {
                        this.setState({
                          alert: true,
                          alertMessage: err.message,
                        });
                      } else {
                        alert_service.showAlert(err.message, err.action);
                      }
                    });
                  });
                // if (this.state.valid) this.setState({ visibleOtp: true }); //this.props.navigation.navigate(screen_names.INVOICE);
              }}
              firstColor={'#114B8C'}
              secondColor={'#0079AA'}
              title={
                'PAY ₹' +
                formatNumberCommasDecimal(this.payment.paymentAmount.toFixed(2))
              }
            />
          </View>
        )}
        {this.state.alert && (
          <Alert
            textSize={1.5}
            fontWeight="600"
            message={[this.state.alertMessage]}
            buttonTitle="OK"
            onPress={() => {
              this.setState({ alert: false }, () => {
                if (this.state.action) {
                  this.setState({ action: false });
                  if (this.props.closeModal) {
                    this.props.closeModal();
                  }
                }
              });
            }}
          />
        )}
        {this.state.loading && <Loading />}
        {this.state.alertdouble && (
          <AlertDoubleButtons
            positiveAction={async () => {
              try {
                this.setState({ alertdouble: false });
                const cancel = await this.payment.cancel(
                  this.payment.paymentResponse.getPaymentId()
                );
                if (!cancel.success) {
                  throw new Error(cancel.message);
                }
                console.log('SHOWIT');
                this.setState({ alert: true, action: true, alertMessage:"Payment Cancelled!" });
                /*alert_service.showAlert(
                  'Payment Cancelled!',
                  this.props.closeModal()
                );*/
              } catch (error) {}
            }}
            negativeAction={() => {
              this.setState({ alertdouble: false, });
            }}
            visible={this.state.alertdouble}
            message={`Do you want to cancel the payment??`}
            title={'Confirmation'}
            titleConfirm="YES"
            titleCancel="NO"
            close={() => this.setState({ alertdouble: false })}
          />
        )}
        
      </View>
    );
  }
}
const TEXT_COLOR = '#47525D';

const styles = EStyleSheet.create({
  circleButton: {
    marginRight: '1.7rem',
  },
  containerBox: {
    backgroundColor: 'white',
    borderWidth: 0.5,
    borderColor: '#ddd',
    borderRadius: 3,
    elevation: 3,
    paddingBottom: hp('3%'),
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
    marginTop: hp('1'),
    alignItems: 'center',
  },
  containerOtpFields: {
    alignItems: 'center',
    marginBottom: isTablet ? hp('3%') : null,
  },
  labelOtp: {
    textAlign: 'center',
    fontWeight: '600',
    marginBottom: hp('0.5%'),
    marginTop: hp('3%'),
    fontSize: hp('2%'),
    color: '#6B6B6B',
  },
});

const mapStateToProps = state => ({
  state: state.cashData,
  payment: state.payment_data.payment,
  order: state.payment_data.order,
});

export default connect(mapStateToProps)(WalletPayments);
export interface Props {
  visible: true;
  otp: string;
  payment: PaymentType;
  navigation: NavigationScreenProp<{ goToInvoice(): any }>;
  toggleFormVisible: any;
  next: {
    payment: PaymentType;
    title: string;
    icon: string;
    method: string;
  };
}
