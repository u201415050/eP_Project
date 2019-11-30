import React, { Component } from 'react';
import {
  StyleSheet,
  Modal,
  View,
  Image,
  Text,
  TouchableOpacity,
  ScrollView,
  Platform,
  Dimensions,
  NetInfo,
} from 'react-native';
import AlertDoubleButtons from '../../../../../components_general/popups/AlertDoubleButtons';
import { Alert as AlertNative } from 'react-native';
import colors from '../../../../account_created/styles/colors';
import { CardWithHeader } from '../../../../cash_register/components/cards';
import { isTablet } from '../../../constants/isLandscape';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import { TextMontserrat, Loading, Alert } from 'components';
import { Icons } from 'api';
import ItemProduct from './itemProduct/itemProduct';
import moment from 'moment';
import ModalReceipt from '../ModalReceipt/modalReceipt';
import Payment from '../../../../../factory/payment';
import { getLocalSettingRow } from '../../../../../services/settings_service';
import OtpRefund from '../../../../invoice/components/otp_refund/otp_refund';
import loading_service from '../../../../../services/loading_service';
import ModalPrinters from '../../../../modal_printers/modal_printers';
import PaymentResponse from '../../../../../factory/payment_response';
import alert_service from '../../../../../services/alert_service';
import alert_double_service from '../../../../../services/alert_double_service';
import { refundTransaction } from '../../../../../sync/sync_tasks';
import realm, { createRow } from '../../../../../services/realm_service';
import { formatNumberCommasDecimal } from '../../../../../api';
import { epaisaRequest } from '../../../../../services/epaisa_service';

const isPortrait = () => {
  const dim = Dimensions.get('window');
  if (dim.height >= dim.width) {
    return true;
  } else {
    return false;
  }
};

class ModalDetails extends Component {
  /*constructor(props) {
    super(props)
    this.payment_service = new PaymentService()
    this.payment_service.paymentVoid(id, () => {

    })
  }*/
  state = {
    sendModal: false,
    refunded: false,
    printerModal: false,
    show_refund_otp: false,
    loading: false,
    alert: false,
    message: '',
    orientation: isPortrait(),
    refOff: false,
  };
  getColor = tipo => {
    if (tipo == 'APPROVED') {
      return '#43C141';
    } else if (tipo == 'SETTLED') {
      return '#04A754';
    } else if (tipo == 'PENDING') {
      return '#EADF00';
    } else if (tipo == 'FAILED') {
      return '#FF3D00';
    } else if (tipo == 'CANCELLED') {
      return '#F16623';
    } else if (tipo == 'DEPOSITED') {
      return '#2D8586';
    } else if (tipo == 'VOIDED') {
      return '#640563';
    } else if (tipo == 'REFUNDED') {
      return '#EB6BAA';
    } else {
      return 'gray';
    }
  };
  getImage(nom) {
    if (nom.indexOf('Cash') != -1) {
      return require('../../../assets/img/Cash.png');
    } else if (nom.indexOf('Card') != -1) {
      return require('../../../assets/img/Card.png');
    } else if (nom.indexOf('Wallet') != -1) {
      return require('../../../assets/img/wallets.png');
    } else if (nom.indexOf('UPI') != -1) {
      return require('../../../assets/img/upi.png');
    } else if (nom.indexOf('Split') != -1) {
      return require('../../../assets/img/split.png');
    } else if (nom.indexOf('Cheque') != -1) {
      return require('../../../assets/img/cheque.png');
    } else if (nom.indexOf('EMI') != -1) {
      return require('../../../assets/img/emi.png');
    } else {
      return require('../../../assets/img/Cash.png');
    }
  }
  getType(nom) {
    if (nom.indexOf('Cash') != -1) {
      return 'Cash';
    } else if (nom.indexOf('Card') != -1) {
      return 'Card';
    } else if (nom.indexOf('Wallet') != -1) {
      return 'Wallet';
    } else if (nom.indexOf('UPI') != -1) {
      return 'UPI';
    } else if (nom.indexOf('Split') != -1) {
      return 'Split';
    } else if (nom.indexOf('Cheque') != -1) {
      return 'Cheque';
    } else if (nom.indexOf('EMI') != -1) {
      return 'EMI';
    } else return 'Card';
  }
  payment = null;
  confirmVoid = data => {
    const that = this;

    alert_double_service.showAlertDouble(
      'Confirm',
      data != null
        ? data.transactionType == 'Split'
          ? 'The payment cannot be voided, please pay through cash'
          : `Are you sure you would like to void this transaction?`
        : `Are you sure you would like to void this transaction?`,
      async () => {
        //alert("sdj")
        let isConnected = await NetInfo.isConnected.fetch();
        if (isConnected) {
          that.voidAction.call(null, data);
        } else {
          createRow('TransactionVoided', { paymentId: data.paymentId }, true);
          refundTransaction(data.paymentId);
          this.setState({
            alert: data.transactionType != 'Split',
            message: 'Payment refund completed!',
            refOff: true,
            refunded: true,
          });
        }
      }
    );
  };
  getSettingOTP = async () => {
    const user = realm.objectForPrimaryKey('User', 0);

    return epaisaRequest(
      { settingId: 9, merchantId: user.merchantId, userId: user.userId },
      '/setting',
      'POST'
    ).then(res => {
      let val = res.response[0].settingoptionsparams.filter(
        x => x.settingParamName == 'SendOTPonRefund'
      );
      if (val.length > 0) {
        val = val[0];
        let value = val.value == 1 || val.value == '1' || val.value == true;
        return value;
      } else {
        return (
          getLocalSettingRow('Transaction', 'SendOTPonRefund') === '1' ||
          getLocalSettingRow('Transaction', 'SendOTPonRefund') == true
        );
      }
    });
  };
  async componentDidMount() {
    //alert(isOtp);
  }
  voidAction = data => {
    const configs = { sendOtpOnRefund: false };
    //alert(getLocalSettingRow('Transaction', 'SendOTPonRefund'))
    this.getSettingOTP().then(res => {
      configs.sendOtpOnRefund = res;
      if (
        data.transactionTypeId == 22 ||
        data.transactionTypeId == 24 ||
        data.transactionTypeId == 36
      ) {
        try {
          // loading_service.showLoading();
          const transaction = data.transactions[0];
          PaymentResponse.cardRefund(
            data.transactionTypeId,
            data.transactionAmount,
            {
              invoiceNumber: transaction.invoiceNumber,
              deviceId: transaction.deviceId,
              last4Digits: transaction.last4Digits,
              stanID: transaction.stanID,
            },
            data.paymentId,
            res => {
              loading_service.hideLoading();
              if (res.success) {
                refundTransaction(data.paymentId);
                this.setState({
                  alert: Platform.OS === 'ios',
                  message: 'Payment refund completed!',
                  refunded: true,
                });
              }
              // this.props.changeTransaction(
              //   this.payment.transactionId
              // );
              // this.setState({ refunded: true });
            }
          );
        } catch (error) {
          loading_service.hideLoading();
          alert_service.showAlert('There was an error please try again!');
        }
        return;
      }
      //alert(1)
      const payment = new Payment(
        {
          transactionId: data.transactionId,
          paymentId: data.paymentId,
          products: [],
          deliveryCharges: 0,
          generalDiscount: 0,
        },
        configs
      );
      payment.on('request', () => {
        if (Platform.OS === 'android') {
          loading_service.showLoading();
        } else {
          //this.setState({ loading: false });
        }
      });
      payment.on('done', () => {
        if (Platform.OS === 'android') {
          loading_service.hideLoading();
        } else {
          this.setState({
            loading: false,
          });
          /*
          alert: Platform.OS === 'ios',
          message: 'Payment refund completed!',
        });*/
        }
      });
      this.payment = payment;
      this.otp_refund.payment = payment;
      //this.setState({ loading: configs.sendOtpOnRefund != true });
      let handle = val => {
        //this.props.changeTransaction(this.payment.transactionId)
        // );
        // this.setState({ refunded: true });
        //alert(1)
        //if(val=="Payment refund completed!"){
        //alert(1)
        //refundTransaction(data.paymentId)
        //}
        //alert('works')
        this.setState({ loading: false }, () =>
          this.setState(
            {
              message: val,
              refunded:
                val == 'Payment refund completed!' ||
                val.indexOf(
                  'Transactions are not voided. Please retry or refund'
                ) != -1,
            },
            () => {
              setTimeout(() => {
                this.setState({
                  alert:
                    val.indexOf(
                      'Transactions are not voided. Please retry or refund'
                    ) == -1 && Platform.OS === 'ios',
                });
              }, 1000);
            }
          )
        );
      };
      this.otp_refund.refund(handle, true);
    });
  };

  render() {
    const { active, closeModal, refundOffline } = this.props;

    let { data, auth_key } = this.props;

    const pay = data != null ? this.getType(data.transactionType) : 'Card';
    if (data) {
      //alert(data.transactionStatus)
    }

    const day = moment.unix(data != null ? data.created_at : 11111111);
    let isFour = day;
    let isAfter = moment().unix() - isFour.unix() < 86400;
    const status =
      data != null
        ? this.state.refunded || this.state.refOff
          ? 'Refunded'
          : data.transactionStatus
        : 'Approved';
    const validStatus = ['Settled', 'Approved'];
    const canPrint = status == 'Approved';
    let canVoid;
    if (data != null) {
      canVoid =
        (data.transactionType == 'Cash' ||
          data.transactionType == 'Split' ||
          data.transactionType.toUpperCase().indexOf('CHEQUE') != -1 ||
          this.getType(data.transactionType) == 'Card' ||
          (this.getType(data.transactionType) == 'Wallet' &&
            data.transactionType.indexOf('Pockets') == -1 &&
            data.transactionType.indexOf('Mobikwik') == -1 &&
            data.transactionType.indexOf('Ola') == -1)) &&
        validStatus.includes(status);
    } else {
      canVoid = false;
    }
    if (
      //canVoid &&
      (data != null ? !validStatus.includes(data.transactionStatus) : false) ||
      this.state.refunded
    ) {
      canVoid = false;
    }
    const description = [
      {
        name: 'Payment ID',
        value: data != null ? data.paymentId : '1111111',
      },
      {
        name: 'Transaction ID',
        value: data != null ? data.transactionId : '1111111',
      },
      {
        name: 'Date',
        value: moment(day).format('DD MMM YYYY'),
      },
      {
        name: 'Time',
        value: moment(day).format('hh:mm A'),
      },
      {
        name: 'Status',
        value: status,
      },
    ];
    if (this.getType(data != null ? data.transactionType : '') == 'Wallet') {
      description.pop();
      description.push({
        name: 'Wallet',
        value: data.transactionType,
      });
      description.push({
        name: 'Status',
        value: status,
      });
    }
    let items = {
      paymentId: data != null ? data.paymentId : '1111111',
      date: moment(day).format('DD MMM YYYY'),
      time: moment(day).format('hh:mm A'),
    };
    return (
      <Modal
        visible={active}
        transparent={true}
        animationType="fade"
        onRequestClose={() => {
          this.setState({ refunded: false });
          closeModal();
        }}
      >
        <View style={styles.container}>
          <CardWithHeader
            headerCustom={
              <View
                style={{
                  flexDirection: 'row',
                  borderBottomWidth: 2,
                  borderBottomColor: 'rgba(0,0,0,0.5)',
                  alignItems: 'center',
                  width: '100%',
                }}
              >
                <Image
                  style={{
                    width: hp('7%'),
                    marginVertical: hp('0.5%'),
                    marginLeft: wp(isTablet ? wp('1%') : wp('1%')),
                    marginRight: wp(isTablet ? wp('1%') : wp('1%')),
                    height: hp('7%'),
                  }}
                  source={this.getImage(pay)}
                />
                <TextMontserrat
                  style={{
                    flex: 1,
                    fontSize: hp('3%'),
                    fontWeight: '900',
                    color: 'rgba(0,0,0,0.7)',
                  }}
                >
                  {pay} Payment
                </TextMontserrat>
                <TouchableOpacity
                  onPress={() => {
                    if (this.state.refunded) {
                      refundTransaction(data.paymentId);
                      this.props.handleFilter();
                    }
                    this.setState({ refunded: false, alert: false });
                    closeModal();
                  }}
                >
                  <Image
                    source={Icons.close}
                    style={{
                      marginRight: wp('3%'),
                      width: hp('2.4%'),
                      height: hp('2.4%'),
                    }}
                  />
                </TouchableOpacity>
              </View>
            }
            isLandscape={isTablet}
            sizeHeaderLabel={isTablet ? '3.5%' : '3%'}
            onPressCloseButton={() => {
              this.setState({ refunded: false, refOff: false });
              closeModal();
            }}
            customBodyStyle={{ alignItems: 'center', justifyContent: 'center' }}
            headerTitle="Customer Information"
            closeButton={true}
            customCardStyle={{ width: wp('95') }}
          >
            <View style={styles.wrapper}>
              <View style={styles.description}>
                {description.map((item, i) => {
                  if (pay == 'Split' && item.name == 'Transaction ID') {
                    return null;
                  } else {
                    return (
                      <View style={styles.item} key={i}>
                        <TextMontserrat
                          style={{
                            flex: 5,
                            fontSize: this.state.orientation
                              ? wp('3.3%')
                              : hp('1.8%'),
                            fontWeight: '900',
                            color: 'rgba(0,0,0,0.7)',
                          }}
                        >
                          {item.name}
                        </TextMontserrat>
                        <TextMontserrat
                          style={{
                            flex: 1,
                            fontSize: this.state.orientation
                              ? wp('3.3%')
                              : hp('1.8%'),
                            fontWeight: '600',
                          }}
                        >
                          :
                        </TextMontserrat>
                        <TextMontserrat
                          style={{
                            flex: 8,
                            color:
                              item.name == 'Status'
                                ? this.getColor(item.value.toUpperCase())
                                : '#5D6770',
                            fontSize: this.state.orientation
                              ? wp('3.3%')
                              : hp('1.8%'),
                            fontWeight: '600',
                          }}
                        >
                          {item.value}
                        </TextMontserrat>
                      </View>
                    );
                  }
                })}
              </View>
              <View style={[styles.total]}>
                <TextMontserrat
                  style={{
                    fontSize: hp('2.5%'),
                    color: 'rgba(0,0,0,0.7)',
                    fontWeight: '900',
                  }}
                >
                  Amount Paid
                </TextMontserrat>
                <TextMontserrat
                  style={{
                    fontSize: hp('2.5%'),
                    color: '#174285',
                    fontWeight: '900',
                  }}
                >
                  ₹
                  {formatNumberCommasDecimal(
                    parseFloat(data ? data.transactionAmount : 0).toFixed(2)
                  )}
                </TextMontserrat>
              </View>
              <TextMontserrat
                style={{
                  borderColor: '#EBEBEB',
                  color: 'rgba(0,0,0,0.7)',
                  borderBottomWidth: 1,
                  width: '100%',
                  marginTop: hp('1%'),
                  paddingBottom: hp('1%'),
                  paddingHorizontal: wp('4%'),
                  fontSize: this.state.orientation ? wp('3.3%') : hp('1.8%'),
                  fontWeight: '900',
                }}
              >
                Sale Details
              </TextMontserrat>
              <ScrollView style={{ height: hp('10%'), width: '100%' }}>
                {data != null && data.order != null
                  ? data.order.customItems.map((item, i) => {
                      //if (i == 0) alert(JSON.stringify(data));
                      return <ItemProduct key={i} item={item} />;
                    })
                  : null}
              </ScrollView>
              <View style={[styles.total, { marginTop: hp('1%') }]}>
                <TextMontserrat
                  style={{
                    fontSize: hp('2.5%'),
                    color: 'rgba(0,0,0,0.7)',
                    fontWeight: '900',
                  }}
                >
                  Sub Total
                </TextMontserrat>
                <TextMontserrat
                  style={{
                    fontSize: hp('2.5%'),
                    color: '#174285',
                    fontWeight: '900',
                  }}
                >
                  ₹
                  {formatNumberCommasDecimal(
                    parseFloat(
                      data != null && data.order != null
                        ? data.paymentAmount
                        : 0
                    ).toFixed(2)
                  )}
                </TextMontserrat>
              </View>
              {pay == 'Split' ? (
                <View style={{ width: '100%', alignItems: 'flex-start' }}>
                  <TextMontserrat
                    style={{
                      borderColor: '#EBEBEB',
                      color: 'rgba(0,0,0,0.7)',
                      borderBottomWidth: 1,
                      width: '100%',
                      marginTop: hp('1%'),
                      paddingBottom: hp('1%'),
                      paddingHorizontal: wp('4%'),
                      fontSize: this.state.orientation
                        ? wp('3.3%')
                        : hp('1.8%'),
                      fontWeight: '900',
                    }}
                  >
                    Transaction Details
                  </TextMontserrat>
                  <ScrollView
                    contentContainerStyle={{ paddingHorizontal: wp('4%') }}
                    style={{
                      borderColor: '#EBEBEB',
                      borderBottomWidth: 1,
                      height: hp('10%'),
                      width: '100%',
                    }}
                  >
                    {data.transactionsList.map(transaction => {
                      if (
                        transaction.transactionStatus != 'Failed' &&
                        transaction.transactionStatus != 'Cancelled'
                      )
                        return (
                          <View
                            style={{
                              width: '100%',
                              marginTop: hp('0.5%'),
                              flexDirection: 'row',
                              justifyContent: 'space-between',
                            }}
                          >
                            <TextMontserrat
                              style={{
                                fontSize: this.state.orientation
                                  ? wp('3.3%')
                                  : hp('1.8%'),
                                fontWeight: '700',
                              }}
                            >
                              Paid by{' '}
                              {data != null
                                ? transaction.transactionType.indexOf(
                                    'Wallet'
                                  ) != -1
                                  ? transaction.transactionType
                                  : this.getType(transaction.transactionType)
                                : 'Card'}
                            </TextMontserrat>
                            <TextMontserrat
                              style={{
                                fontSize: hp('1.8%'),
                                color: '#174285',
                                fontWeight: '700',
                              }}
                            >
                              ₹
                              {parseFloat(
                                data != null && data.order != null
                                  ? transaction.transactionAmount
                                  : 0
                              ).toFixed(2)}
                            </TextMontserrat>
                          </View>
                        );
                    })}
                  </ScrollView>
                </View>
              ) : null}
              <View style={styles.buttonsContainer}>
                <TouchableOpacity
                  disabled={!canPrint || this.state.printerModal}
                  onPress={() => {
                    //let isConnected = await NetInfo.isConnected.fetch()
                    //if(isConnected){
                    console.log(1);
                    this.setState({ printerModal: true });
                    //}else{
                    // alert_service.showAlert("Please connect to internet")
                    //}
                  }}
                  style={[
                    styles.buttonsFot,
                    !canPrint ? { opacity: 0.7 } : null,
                  ]}
                >
                  <TextMontserrat style={styles.btnText}>PRINT</TextMontserrat>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={async () => {
                    let isConnected = await NetInfo.isConnected.fetch();
                    if (isConnected) {
                      this.setState({ sendModal: true });
                    } else {
                      alert_service.showAlert('Please connect to internet');
                    }
                  }}
                  style={styles.buttonsFot}
                >
                  <TextMontserrat style={styles.btnText}>SEND</TextMontserrat>
                </TouchableOpacity>
                <TouchableOpacity
                  disabled={!canVoid}
                  onPress={() => {
                    // let isConnected = await NetInfo.isConnected.fetch()
                    //if(isConnected){
                    if (Platform.OS === 'ios') {
                      this.setState({ alertdouble: true });
                    } else {
                      this.confirmVoid(data);
                    }
                    //this.confirmVoid(data)
                    //}else{
                    //  alert_service.showAlert("Please connect to internet")
                    //}
                  }}
                  style={[
                    styles.buttonsFot,
                    !canVoid ? { opacity: 0.7 } : null,
                  ]}
                >
                  <TextMontserrat style={styles.btnText}>VOID</TextMontserrat>
                </TouchableOpacity>
              </View>
            </View>
          </CardWithHeader>

          <ModalReceipt
            paymentId={data != null ? data.paymentId : '1111111'}
            auth_key={auth_key}
            active={this.state.sendModal}
            closeModal={() => this.setState({ sendModal: false })}
          />
          <ModalPrinters
            //payment={this.props.payment}
            isMswipe={false}
            transactions={true}
            items={items}
            active={this.state.printerModal}
            closeModal={() => this.setState({ printerModal: false })}
          />
          <OtpRefund
            ref={ref => (this.otp_refund = ref)}
            payment={this.payment}
            onRefund={() => {
              //this.props.changeTransaction(this.payment.transactionId);
              this.setState({ refunded: true });
            }}
          />
          {this.state.loading ? <Loading /> : null}
          {this.state.alert ? (
            <Alert
              textSize={1.5}
              fontWeight="600"
              message={[this.state.message]}
              buttonTitle="OK"
              onPress={() => {
                if (this.state.message == 'Payment refund completed!') {
                }
                if (this.state.refOff) {
                  refundOffline(data.paymentId);
                }
                this.setState({ alert: false });
              }}
            />
          ) : null}
          {this.state.alertdouble ? (
            <AlertDoubleButtons
              positiveAction={async () => {
                //alert("sdj")
                let isConnected = await NetInfo.isConnected.fetch();
                if (isConnected) {
                  this.voidAction(data);
                } else {
                  createRow(
                    'TransactionVoided',
                    { paymentId: data.paymentId },
                    true
                  );
                  refundTransaction(data.paymentId);
                  this.setState({
                    alert: true,
                    alertdouble: false,
                    message: 'Payment refund completed!',
                    refOff: true,
                    refunded: true,
                  });
                }
              }}
              negativeAction={() => {
                this.setState({ alertdouble: false });
              }}
              visible={this.state.double_alert}
              message={
                data != null
                  ? data.transactionType == 'Split'
                    ? 'The payment cannot be voided, please pay through cash'
                    : `Are you sure you would like to void this transaction?`
                  : `Are you sure you would like to void this transaction?`
              }
              title={'Confirm'}
              close={() => this.setState({ alertdouble: false })}
            />
          ) : null}
        </View>
      </Modal>
    );
  }
}

// define your styles
const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.opacityDin(0.6),
  },
  wrapper: {
    width: '100%',
    alignItems: 'center',
  },
  description: {
    width: '100%',
    alignItems: 'center',
    paddingHorizontal: wp(isTablet ? '1%' : '4%'),
    marginTop: hp('1%'),
  },
  item: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginBottom: hp('0.8%'),
  },
  total: {
    width: '100%',
    flexDirection: 'row',
    paddingHorizontal: wp('5%'),
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: hp('1%'),
    paddingVertical: hp('1.5%'),
    borderColor: '#EBEBEB',
    borderTopWidth: 1,
    borderBottomWidth: 1,
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: wp('4%'),
    paddingVertical: hp('1.5%'),
    width: '100%',
  },
  buttonsFot: {
    width: '32%',
    backgroundColor: '#D8D8D8',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: hp('1%'),
    elevation: 5,
    paddingVertical: hp('1.3%'),
  },
  btnText: {
    fontSize: hp('2.3%'),
    color: '#47525D',
    fontWeight: '800',
  },
});

export default ModalDetails;
