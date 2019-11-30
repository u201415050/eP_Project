import React, { Component } from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Text,
  Platform,
  NetInfo,
} from 'react-native';

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import colors from '../../../styles/colors';
import { Alert, TextMontserrat, Loading } from 'components';
import { formatNumberCommasDecimal } from 'api';
import { isTablet } from '../../../../fingerprint/constants/isLandscape';
import PaymentIcon from '../../../../settings/components/icons/payments/payment_icon/payment_icon';
import Swipeout from 'react-native-swipeout';
import OtpRefund from '../../otp_refund/otp_refund';
import PaymentResponse from '../../../../../factory/payment_response';
import NavigationService from 'services/navigation';
import { getLocalSettingRow } from '../../../../../services/settings_service';
import Payment from '../../../../../factory/payment';
import alert_double_service from '../../../../../services/alert_double_service';
import alert_service from '../../../../../services/alert_service';
import AlertDoubleButtons from '../../../../../components_general/popups/AlertDoubleButtons';
import moment from 'moment';
import { epaisaRequest } from '../../../../../services/epaisa_service';

class Details extends Component {
  constructor(props) {
    super(props);
    console.log(this.props);
    this.tenderingChange = this.props.transaction.tenderingChange
      ? `₹${this.props.transaction.tenderingChange}`
      : this.props.payment.paymentResponse.tenderingChange
      ? `₹${this.props.payment.paymentResponse.tenderingChange}`
      : false;
    // : false;
    this.state = {
      loading: false,
      alertMessage: '',
      alertActive: false,
      alertdouble: false,
      connected: true,
    };
  }
  async componentDidMount() {
    let isConnected = await NetInfo.isConnected.fetch();
    this.setState({
      connected: isConnected,
      newDate: moment().format('DD MMM YYYY'),
      newTime: moment().format('h:mm A'),
    });
  }
  confirmVoid = () => {
    this.setState({ alertdouble: true });
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
  refundAction = () => {
    const response = this.props.transaction.process.response;
    const configs = { sendOtpOnRefund: false };
    //this.setState({loading:Platform.OS==="ios"})
    this.getSettingOTP().then(res => {
      configs.sendOtpOnRefund = res;
      if (
        response.transactionTypeId == 36 ||
        response.transactionTypeId == 22 ||
        response.transactionTypeId == 24
      ) {
        PaymentResponse.cardRefund(
          response.transactionTypeId,
          response.transactionAmount,
          this.props.transaction.process.transactionDetails,
          this.props.transaction.process.response.paymentId,
          res => {
            console.log(res);
            if (res.success) {
              /*alert_service.showAlert('Payment refunded', () => {
              NavigationService.reset('CashRegister');
            });*/
              this.setState({ alertActive: true, alertMessage: alertmsg });
            } else {
              this.setState({
                alertActive: true,
                alertMessage: 'Error when try to refund.',
              });
              //alert_service.showAlert('Error', () => null);
            }
          }
        );
        // this.props.transaction.cardRefund();
      } else {
        //alert(JSON.stringify(this.props.items))
        const payment = new Payment(
          {
            transactionId: this.props.items[1].value,
            paymentId: this.props.items[0].value,
            products: [],
            deliveryCharges: 0,
            generalDiscount: 0,
          },
          configs
        );
        //alert(JSON.stringify(configs))
        this.otp_refund.payment = payment;
        let handle = alertmsg => {
          //, (alertmsg)
          //this.setState({loading:false})//, alertMessage: alertmsg, alertActive: Platform.OS=="ios"})
          if (Platform.OS == 'ios') {
            //this.setState({loading:false})
            //alert(1)
            this.setState({ alertActive: true, alertMessage: alertmsg }, () => {
              //NavigationService.reset('CashRegister');
            });
          }
        };
        this.otp_refund.refund(handle.bind(this), false, true);
      }
    });
  };

  render() {
    const { title, icon, items, total, closeModal } = this.props;
    console.log('PAYMENT OBJECT', this.props.payment);

    const swipeBtns = [
      {
        component: (
          <TouchableOpacity
            activeOpacity={0.6}
            onPress={() => {
              // alert(JSON.stringify(this.props.transaction));
              //this.confirmVoid();
              this.setState({ alertdouble: true });
            }}
            style={{
              backgroundColor: '#4A4A4A',
              borderRadius: 10,
              flex: 1,
              marginBottom: 10,
              justifyContent: 'center',
              alignItems: 'center',
              elevation: 3,
              marginRight: '6%',
            }}
          >
            <TextMontserrat
              style={{
                color: 'white',
                fontWeight: '600',
                margin: 5,
                fontSize: isTablet ? wp('1.4%') : wp('4.3%'),
              }}
            >
              REFUND
            </TextMontserrat>
          </TouchableOpacity>
        ),
        backgroundColor: 'rgba(0,0,0,0)',
      },
    ];
    const split = this.props.split;
    return (
      <View style={{ width: '100%' }}>
        <Swipeout
          right={this.props.refund ? swipeBtns : null}
          backgroundColor={'transparent'}
          style={{
            backgroundColor: 'blue',
            width: '100%',
            paddingRight: isTablet ? (this.props.noPadd ? 0 : wp('1%')) : 0,
          }}
          buttonWidth={isTablet ? wp('9%') : wp('30%')}
          onOpen={() => {
            this.setState({ indexDelete: 1 });
          }}
          onClose={() => {
            this.setState({ indexDelete: 0 });
          }}
        >
          <View
            style={[
              styles.container,
              this.props.noPadd ? { left: 0 } : null,
              isTablet ? { width: '100%' } : null,
            ]}
          >
            <View
              style={[
                styles.titleContainer,
                { backgroundColor: split ? '#43C141' : 'white' },
              ]}
            >
              <View
                style={{
                  marginLeft: hp('2.5%'),
                  marginTop: hp('0.6'),
                  marginBottom: hp('0.3'),
                  marginRight: hp('1.8%'),
                }}
              >
                <TouchableOpacity
                  onPress={() => {
                    //alert(this.props.refund);
                  }}
                >
                  <PaymentIcon main={true} iconName={icon} size={hp('5.5%')} />
                </TouchableOpacity>
              </View>
              <TextMontserrat
                style={{
                  opacity: 0.9,
                  color: split ? 'white' : '#5D6770',
                  fontWeight: '700',
                  fontSize: hp('2.6%'),
                }}
              >
                {title}
              </TextMontserrat>
              {split && (
                <View style={{ marginRight: hp('2.5%'), flexGrow: 1 }}>
                  <TextMontserrat
                    style={{
                      opacity: 0.9,
                      color: 'white',
                      fontWeight: '700',
                      fontSize: hp('2.6%'),
                      textAlign: 'right',
                    }}
                  >
                    ₹{parseFloat(this.props.total).toFixed(2)}
                  </TextMontserrat>
                </View>
              )}
            </View>
            <View style={styles.itemContainer}>
              {items.map((item, i) => {
                return (
                  <View
                    key={i}
                    style={{
                      flexDirection: 'row',
                      width: '100%',
                      marginBottom: hp('0.8%'),
                    }}
                  >
                    <TextMontserrat
                      style={{
                        color: '#5D6770',
                        paddingLeft: hp('2.5%'),
                        width: '40%',
                        textAlign: 'left',
                        fontWeight: '900',
                        fontSize: hp('1.9%'),
                      }}
                    >
                      {item.name}
                    </TextMontserrat>
                    <TextMontserrat
                      style={{
                        color: '#5D6770',
                        width: '7%',
                        textAlign: 'left',
                        fontWeight: '900',
                        fontSize: hp('1.9%'),
                      }}
                    >
                      :
                    </TextMontserrat>
                    <TextMontserrat
                      style={{
                        color: '#5D6770',
                        textAlign: 'left',
                        fontWeight: '600',
                        fontSize: hp('1.9%'),
                      }}
                    >
                      {this.state.connected
                        ? item.value
                        : item.name === 'Date'
                        ? this.state.newDate
                        : item.name === 'Time'
                        ? this.state.newTime
                        : item.value}
                    </TextMontserrat>
                  </View>
                );
              })}
            </View>
            {/* {!split && ( */}
            <View style={styles.footerContainer}>
              {this.tenderingChange && (
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}
                >
                  <TextMontserrat
                    style={{
                      color: '#47525D',
                      fontWeight: '800',
                      fontSize: hp('2.2%'),
                    }}
                  >
                    Change
                  </TextMontserrat>
                  <TextMontserrat
                    style={{
                      color: '#174285',
                      fontWeight: '800',
                      fontSize: hp('2.2%'),
                    }}
                  >
                    {this.tenderingChange}
                  </TextMontserrat>
                </View>
              )}
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                }}
              >
                <TextMontserrat
                  style={{
                    color: '#47525D',
                    fontWeight: '800',
                    fontSize: hp('2.6%'),
                  }}
                >
                  Amount Paid
                </TextMontserrat>
                <TextMontserrat
                  style={{
                    color: '#174285',
                    fontWeight: '800',
                    fontSize: hp('2.6%'),
                  }}
                >
                  ₹{formatNumberCommasDecimal(parseFloat(total).toFixed(2))}
                </TextMontserrat>
              </View>
            </View>
            {/* )} */}
          </View>
          {this.state.loading ? <Loading /> : null}
        </Swipeout>
        <OtpRefund
          ref={ref => (this.otp_refund = ref)}
          payment={this.props.payment}
          closeModal={() => {
            setTimeout(() => {
              if (this.props.closeModal) this.props.closeModal();
              else {
                if (!isTablet) {
                  NavigationService.reset('CashRegister');
                }
              }
            }, 500);
          }}
        />
        <AlertDoubleButtons
          positiveAction={() => {
            this.setState({ alertdouble: false }, this.refundAction);
          }}
          negativeAction={() => {
            this.setState({ alertdouble: false });
          }}
          visible={this.state.alertdouble}
          message={`Are you sure you would like to refund this transaction?`}
          title={'Confirm'}
          titleConfirm="YES"
          titleCancel="NO"
          close={() => this.setState({ alertdouble: false })}
        />
        {this.state.alertActive ? (
          <Alert
            textSize={1.5}
            fontWeight="600"
            message={[this.state.alertMessage]}
            buttonTitle="OK"
            onPress={() => {
              this.setState({ alertActive: false }, () => {
                if (isTablet) {
                  this.props.closeModal();
                } else {
                  NavigationService.reset('CashRegister');
                }
              });
            }}
          />
        ) : null}
      </View>
    );
  }
}

// define your styles
const styles = StyleSheet.create({
  container: {
    width: wp('96%'),
    marginBottom: hp('1.7%'),
    backgroundColor: colors.white,
    elevation: 3,
    left: '2%',
    shadowOffset: { width: 1, height: 1 },
    shadowColor: 'grey',
    shadowOpacity: 0.5,
    shadowRadius: 3,
    borderRadius: 6,
  },
  titleContainer: {
    width: '100%',
    borderBottomWidth: 1,
    borderColor: 'rgba(0,0,0,0.1)',
    borderTopRightRadius: 4,
    borderTopLeftRadius: 4,
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemContainer: {
    width: '100%',
    marginTop: hp('1'),
    borderBottomWidth: 1,
    borderColor: 'rgba(0,0,0,0.1)',
  },
  footerContainer: {
    width: '100%',
    paddingHorizontal: hp('2.5%'),
    paddingVertical: hp('1%'),
  },
});

export default Details;
