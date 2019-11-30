import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Platform,
  NetInfo,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import Button from './components/button';
import ModuleDiscounts from './components/moduleDiscounts';
import { isTablet } from '../../../../constants/isLandscape';
import { formatNumberCommasDecimal } from 'api';
import { getLocalSettingRow } from '../../../../../../services/settings_service';
import { TextMontserrat } from 'components';
import ModalReceipt from '../../../../../transactions/components/Modals/ModalReceipt/modalReceipt';
import ModalPrinters from '../../../../../modal_printers/modal_printers';
import Payment from '../../../../../../factory/payment';
import moment from 'moment';
import loading_service from '../../../../../../services/loading_service';
import OtpRefund from '../../../../../invoice/components/otp_refund/otp_refund';
import CustomItemHelper from '../../../../../../factory/custom_item_helper';
import OrderHelper from '../../../../../../factory/order_helper';
import alert_service from '../../../../../../services/alert_service';
import alert_double_service from '../../../../../../services/alert_double_service';
import realm, { createRow } from '../../../../../../services/realm_service';
import { refundTransaction } from '../../../../../../sync/sync_tasks';
import PaymentResponse from '../../../../../../factory/payment_response';
import { epaisaRequest } from '../../../../../../services/epaisa_service';

const cardsId = [22, 23, 24, 28, 29, 31, 32, 33, 35, 36, 37];
class Footer extends Component {
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
  state = {
    sendModal: false,
    printerModal: false,
  };
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
          });
          this.props.changeRefund(true);
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
  voidAction = data => {
    const configs = { sendOtpOnRefund: false };
    this.getSettingOTP().then(res => {
      configs.sendOtpOnRefund = res;
      if (
        data.transactionTypeId == 22 ||
        data.transactionTypeId == 24 ||
        data.transactionTypeId == 36
      ) {
        try {
          loading_service.showLoading();
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
              alert_service.showAlert('Payment succesfully refunded!', () => {
                this.props.changeRefund(true);
                this.props.handleFilter();
              });
              // alert(JSON.stringify(res));
              // this.props.changeTransaction(
              //   this.payment.transactionId
              // );
              // this.setState({ refunded: true });
            }
          );
        } catch (error) {
          loading_service.hideLoading();
          console.log('CARDERROR', error);
          alert_service.showAlert('There was an error please try again!');
        }
        return;
      }
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
          this.setState({ loading: false });
        }
      });
      payment.on('done', () => {
        if (Platform.OS === 'android') {
          loading_service.hideLoading();
        } else {
          this.setState({ loading: false });
        }
      });
      this.payment = payment;
      this.otp_refund.payment = payment;
      let handle = val => {
        //this.props.changeTransaction(this.payment.transactionId)
        // );
        // this.setState({ refunded: true });
        //alert(val)
        //alert(1)
        this.setState({ alert: Platform.OS === 'ios', message: val }, () => {
          this.props.changeRefund(true);
          this.props.handleFilter();
        });
      };
      this.otp_refund.refund(handle, true);
    });
  };
  calc() {
    const { products } = this.props;
    const order = new OrderHelper();
    let configs = {
      roundOff: false,
      sendOtpOnRefund: false,
    };
    // check and set round off setting
    if (
      getLocalSettingRow('Transaction', 'RoundOff') === '1' ||
      getLocalSettingRow('Transaction', 'RoundOff') == true
    ) {
      configs.roundOff = true;
    }
    // check and set send otp on refund setting
    if (
      getLocalSettingRow('Transaction', 'SendOTPonRefund') === '1' ||
      getLocalSettingRow('Transaction', 'SendOTPonRefund') == true
    ) {
      configs.sendOtpOnRefund = true;
    }
    order.setConfigs(configs);

    order.generalDiscount = +this.props.discount;
    order.generalDiscountType = this.props.type;
    order.deliveryCharges = +this.props.delivery;
    order.update();
    // console.log({ p: CustomItemHelper.calculateTotals(order.customItems) });

    return order;
  }

  render() {
    const {
      order,
      temporaly,
      taxesGroup,
      allDataofTransaction,
      handleFilter,
      refunded,
      changeRefund,
    } = this.props;
    // alert(JSON.stringify(order))
    const isLandscape = isTablet;
    let canVoid;
    const day = moment.unix(
      allDataofTransaction != null ? allDataofTransaction.created_at : 11111111
    );
    let isFour = day;
    let isAfter = moment().unix() - isFour.unix() < 86400;
    const status =
      allDataofTransaction != null
        ? refunded
          ? 'Refunded'
          : allDataofTransaction.transactionStatus
        : 'Approved';
    const validStatus = ['Settled', 'Approved'];
    const canPrint = status == 'Approved';
    if (allDataofTransaction != null) {
      canVoid =
        (allDataofTransaction.transactionType == 'Cash' ||
          allDataofTransaction.transactionType == 'Split' ||
          allDataofTransaction.transactionType
            .toUpperCase()
            .indexOf('CHEQUE') != -1 ||
          this.getType(allDataofTransaction.transactionType) == 'Card' ||
          (this.getType(allDataofTransaction.transactionType) == 'Wallet' &&
            allDataofTransaction.transactionType.indexOf('Pockets') == -1 &&
            allDataofTransaction.transactionType.indexOf('Mobikwik') == -1 &&
            allDataofTransaction.transactionType.indexOf('Ola') == -1)) &&
        validStatus.includes(status);
    } else {
      canVoid = false;
    }
    if (allDataofTransaction != null)
      if (
        !validStatus.includes(allDataofTransaction.transactionStatus) ||
        refunded
      ) {
        canVoid = false;
      }
    let dateString =
      allDataofTransaction != null
        ? moment.unix(allDataofTransaction.created_at).format('DD/MM/YY') +
          ' at ' +
          moment.unix(allDataofTransaction.created_at).format('h:mm A')
        : '';
    //alert(order.subTotal)
    return (
      <View style={styles.container}>
        {temporaly ? null : (
          <View style={[styles.subTotalContainer, { paddingTop: hp('0.9%') }]}>
            <Text style={styles.textDark1}>Sub Total</Text>
            <Text style={styles.TextBlue1}>
              ₹
              {formatNumberCommasDecimal(
                parseFloat(this.props.temporaly ? 0 : order.subTotal).toFixed(2)
              )}
            </Text>
          </View>
        )}
        {this.props.active ? (
          <View
            style={{
              width: '100%',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <View style={styles.cardContainer}>
              <View style={{ width: '100%' }}>
                <View style={{ width: '100%', flexDirection: 'row' }}>
                  <TextMontserrat
                    style={{
                      flex: 4,
                      color: 'rgba(0,0,0,0.7)',
                      fontSize: isTablet ? hp('1.8%') : hp('1.8%'),
                      fontWeight: '800',
                    }}
                  >
                    Payment ID
                  </TextMontserrat>
                  <TextMontserrat
                    style={{
                      flex: 1,
                      color: 'rgba(0,0,0,0.6)',
                      fontSize: isTablet ? hp('1.8%') : hp('1.8%'),
                      fontWeight: '600',
                    }}
                  >
                    :
                  </TextMontserrat>
                  <TextMontserrat
                    style={{
                      flex: 8,
                      color: 'rgba(0,0,0,0.6)',
                      fontSize: isTablet ? hp('1.8%') : hp('1.8%'),
                      fontWeight: '600',
                    }}
                  >
                    {allDataofTransaction.paymentId}
                  </TextMontserrat>
                </View>
                <View style={{ width: '100%', flexDirection: 'row' }}>
                  <TextMontserrat
                    style={{
                      flex: 4,
                      color: 'rgba(0,0,0,0.7)',
                      fontSize: isTablet ? hp('1.8%') : hp('1.8%'),
                      fontWeight: '800',
                    }}
                  >
                    Status
                  </TextMontserrat>
                  <TextMontserrat
                    style={{
                      flex: 1,
                      color: 'rgba(0,0,0,0.6)',
                      fontSize: isTablet ? hp('1.8%') : hp('1.8%'),
                      fontWeight: '600',
                    }}
                  >
                    :
                  </TextMontserrat>
                  <TextMontserrat
                    style={{
                      flex: 8,
                      color: this.getColor(
                        refunded ? 'REFUNDED' : status.toUpperCase()
                      ),
                      fontSize: isTablet ? hp('1.8%') : hp('1.8%'),
                      fontWeight: '600',
                    }}
                  >
                    {refunded ? 'Refunded' : status}
                  </TextMontserrat>
                </View>
              </View>
              <View
                style={{
                  width: '100%',
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <View
                  style={{
                    justifyContent: 'center',
                    alignItems: 'flex-start',
                  }}
                >
                  <TouchableOpacity
                    onPress={() => {
                      alert(JSON.stringify(allDataofTransaction));
                    }}
                    style={{
                      flexDirection: 'row',
                      borderBottomColor: 'rgba(0,0,0,0.2)',
                      paddingVertical: hp('0.5%'),
                      borderBottomWidth: cardsId.includes(
                        allDataofTransaction.transactionTypeId
                      )
                        ? 1
                        : 0,
                      alignItems: 'center',
                    }}
                  >
                    <TextMontserrat
                      style={{
                        color: this.getColor(
                          refunded ? 'REFUNDED' : status.toUpperCase()
                        ),
                        fontSize: isTablet ? hp('2%') : hp('2.7%'),
                        fontWeight: '900',
                        marginRight: hp('1%'),
                      }}
                    >
                      {refunded ? 'REFUNDED' : status.toUpperCase()}
                    </TextMontserrat>
                    <TextMontserrat
                      style={{
                        color: 'rgba(0,0,0,0.7)',
                        marginTop: hp('0.5%'),
                        fontSize: isTablet ? hp('1.6%') : hp('1.7%'),
                        fontWeight: '600',
                      }}
                    >
                      {dateString}
                    </TextMontserrat>
                  </TouchableOpacity>
                  {cardsId.includes(allDataofTransaction.transactionTypeId) ||
                  this.getType(allDataofTransaction.transactionType) ==
                    'Wallet' ? (
                    <View
                      style={{
                        marginTop: hp('0.5%'),
                        flexDirection: 'row',
                        paddingVertical: hp('0.5%'),
                        alignItems: 'center',
                        backgroundColor: 'white',
                      }}
                    >
                      <TextMontserrat
                        style={{
                          color: 'rgba(0,0,0,0.6)',
                          fontSize: isTablet
                            ? cardsId.includes(
                                allDataofTransaction.transactionTypeId
                              )
                              ? hp('2.1%')
                              : hp('2.5%')
                            : hp('2%'),
                          fontWeight: '700',
                        }}
                      >
                        {cardsId.includes(
                          allDataofTransaction.transactionTypeId
                        )
                          ? 'Card' +
                            (allDataofTransaction.last4Digits
                              ? allDataofTransaction.last4Digits != ''
                                ? ``
                                : ''
                              : '')
                          : allDataofTransaction.transactionType.substr(
                              0,
                              allDataofTransaction.transactionType.length - 7
                            ) + ' Wallet'}
                      </TextMontserrat>
                      {cardsId.includes(
                        allDataofTransaction.transactionTypeId
                      ) ? (
                        allDataofTransaction.last4Digits != null &&
                        allDataofTransaction.last4Digits != '' ? (
                          <TextMontserrat
                            style={{
                              color: 'rgba(0,0,0,0.6)',
                              flex: 1,
                              fontSize: isTablet ? hp('1.7%') : hp('1.8%'),
                              fontWeight: '700',
                            }}
                          >{` | XXXX XXXX XXXX ${
                            allDataofTransaction.last4Digits
                          }`}</TextMontserrat>
                        ) : null
                      ) : null}
                    </View>
                  ) : null}
                </View>
                <TextMontserrat
                  style={{
                    flex: 1,
                    textAlign: 'right',
                    color: '#174285',
                    marginRight: -wp('1%'),
                    fontSize: isTablet
                      ? parseFloat(allDataofTransaction.transactionAmount) > 999
                        ? parseFloat(allDataofTransaction.transactionAmount) >
                          9999
                          ? wp('1.5%')
                          : wp('1.7%')
                        : wp('2%')
                      : hp('3%'),
                    fontWeight: '900',
                  }}
                >
                  ₹
                  {formatNumberCommasDecimal(
                    parseFloat(allDataofTransaction.transactionAmount).toFixed(
                      2
                    )
                  )}
                </TextMontserrat>
              </View>
            </View>
          </View>
        ) : temporaly ? (
          <View style={{ height: hp('1%') }} />
        ) : (
          <ModuleDiscounts
            //cgst={CGST}
            order={order}
            discount={order.discountEntered}
            type={order.generalDiscountType}
            sgstTax={taxesGroup.SGST ? taxesGroup.SGST.value : 0}
            cgstTax={taxesGroup.CGST ? taxesGroup.CGST.value : 0}
            igstTax={taxesGroup.IGST ? taxesGroup.IGST.value : 0}
            cessTax={taxesGroup.CESS ? taxesGroup.CESS.value : 0}
            vatTax={taxesGroup.VAT ? taxesGroup.VAT.value : 0}
            subTotal={order.subTotal}
            totalDiscount={order.totalDiscount}
            Total={order.totalPrice}
            deliveryCharge={order.deliveryCharges}
            subTotalContainer={styles.subTotalContainer}
            removeDiscount={order.updateGeneralDiscount.bind(order, 0, '%')}
            removeDelivery={order.updateDeliveryCharges.bind(order, 0)}
          />
        )}
        {this.props.temporaly ? (
          <View style={styles.buttonsContainer2}>
            <TouchableOpacity
              disabled={!canPrint || !this.props.active}
              onPress={() => this.setState({ printerModal: true })}
              style={[
                styles.buttonsFot,
                !canPrint || !this.props.active ? { opacity: 0.7 } : null,
              ]}
            >
              <TextMontserrat style={styles.btnText}>PRINT</TextMontserrat>
            </TouchableOpacity>
            <TouchableOpacity
              disabled={!this.props.active}
              onPress={() => this.setState({ sendModal: true })}
              style={[
                styles.buttonsFot,
                !this.props.active ? { opacity: 0.7 } : null,
              ]}
            >
              <TextMontserrat style={styles.btnText}>SEND</TextMontserrat>
            </TouchableOpacity>
            <TouchableOpacity
              disabled={!canVoid || !this.props.active}
              onPress={() => this.confirmVoid(allDataofTransaction)}
              style={[
                styles.buttonsFot,
                !canVoid || !this.props.active ? { opacity: 0.7 } : null,
              ]}
            >
              <TextMontserrat style={styles.btnText}>VOID</TextMontserrat>
            </TouchableOpacity>
            <ModalReceipt
              paymentId={
                allDataofTransaction != null
                  ? allDataofTransaction.paymentId
                  : '1111111'
              }
              active={this.state.sendModal}
              closeModal={() => this.setState({ sendModal: false })}
            />
            <ModalPrinters
              //payment={this.props.payment}
              transactions={true}
              items={{
                paymentId: allDataofTransaction
                  ? allDataofTransaction.paymentId
                  : '1111111',
                date: allDataofTransaction
                  ? moment(allDataofTransaction.dateFormat).format(
                      'DD MMM YYYY'
                    )
                  : '',
                time: allDataofTransaction
                  ? moment(allDataofTransaction.dateFormat).format('hh:mm A')
                  : '',
              }}
              active={this.state.printerModal}
              closeModal={() => this.setState({ printerModal: false })}
            />
            <OtpRefund
              ref={ref => (this.otp_refund = ref)}
              payment={this.payment}
              onRefund={() => {
                this.props.changeTransaction(this.payment.transactionId);
                changeRefund(true);
              }}
            />
          </View>
        ) : (
          <View style={styles.buttonsContainer}>
            <Button
              label="HOLD"
              backgroundColor="#D8D8D8"
              width={isLandscape ? '100%' : '30%'}
              color="#47525D"
              disabled={!(order.totalPrice >= 1) || this.props.temporaly}
              onPress={() => this.props.onHoldPress(order.totalPrice)}
              font={order.totalPrice >= 1000 ? hp('2.3%') : hp('2.7%')}
            />
            {!isLandscape ? (
              <Button
                label={`PAY ₹${formatNumberCommasDecimal(
                  parseFloat(order.totalPrice).toFixed(2)
                )}`}
                disabled={!(order.totalPrice >= 1) || this.props.temporaly}
                backgroundColor="#09BA83"
                width={'68%'}
                color="white"
                onPress={this.props.onPayPress}
                font={order.totalPrice >= 1000 ? hp('2.0%') : hp('2.6%')}
              />
            ) : null}
          </View>
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    borderTopWidth: hp('0.2%'),
    borderColor: '#D0D0D0',
    width: '100%',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  subTotalContainer: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  textDark1: {
    fontSize: hp('2.6%'),
    color: '#47525D',
    fontFamily: 'Montserrat-Bold',
    paddingLeft: hp('2.1%'),
  },
  TextBlue1: {
    fontSize: hp('2.6%'),
    color: '#174285',
    fontFamily: 'Montserrat-Bold',
    letterSpacing: wp('0.03%'),
    paddingRight: hp('2.2%'),
  },
  buttonsContainer: {
    flexDirection: 'row',
    height: hp('6.75'),
    width: '100%',
    justifyContent: 'space-between',
    paddingLeft: hp('2.3%'),
    paddingRight: hp('2.3%'),
  },
  buttonsContainer2: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: wp('1%'),
    paddingVertical: hp('1.5%'),
    width: '100%',
  },
  cardContainer: {
    width: '96%',
    backgroundColor: 'white',
    elevation: 3,
    shadowOffset: { width: 3, height: 3 },
    shadowColor: 'grey',
    shadowOpacity: 0.5,
    shadowRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: wp('0.5%'),
    paddingHorizontal: wp('2%'),
    paddingVertical: hp('1.6%'),
    marginTop: hp('1%'),
  },
  buttonsFot: {
    width: '32%',
    backgroundColor: '#D8D8D8',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: hp('1%'),
    elevation: 2,
    paddingVertical: hp('1.3%'),
  },
  btnText: {
    fontSize: hp('2.3%'),
    color: '#47525D',
    fontWeight: '800',
  },
});

export default Footer;
