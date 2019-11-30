import React, { Component } from 'react';
import {
  View,
  Image,
  ImageBackground,
  ScrollView,
  Modal,
  TouchableOpacity,
  Platform,
  NetInfo,
} from 'react-native';
import { TextMontserrat, Loading } from 'components';
import EStyleSheet from 'react-native-extended-stylesheet';
import { connect } from 'react-redux';
import { Icons } from 'api';
import BluetoothSerial, {
  withSubscription,
} from 'react-native-bluetooth-serial-next';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import { isTablet } from '../transactions/constants/isLandscape';
import { cashActions } from '../cash_register/actions';
import {
  ConnectDevice,
  Write,
  DisconnectDevice,
} from '../../services/bluetooth_service';
import { getTransactionDetail } from '../login/services/user_service';
import loading_service from '../../services/loading_service';
import {
  ConnectDeviceIOS,
  WriteDeviceIOS,
} from '../../services/bluetooth_ios_service';
import { epaisaRequest } from '../../services/epaisa_service';
import realm, { getTable } from '../../services/realm_service';
import { GetOneTransaction } from '../../sync/sync_tasks';
import { printMswipe } from '../../services/mswipe_printer_service';
import moment from 'moment';

class ModalPrinter extends Component {
  state = {
    payCant: 0,
    currentIndex: 0,
    listPaired: this.props.state.printer ? this.props.state.printer.list : [],
    listAct: [],
    printing: false,
    connectionsEnds: false,
    show: false,
    multiple: false,
    noUpdate: false,
    showPrinter: false,
    printed: false,
    duplicated: false,
    loading: false,
  };
  selectDevice = val => {
    alert('Printing...');
  };
  makeConnection = async index => {
    const user = realm.objectForPrimaryKey('User', 0);
    const { merchant } = user;
    const isConnected = await NetInfo.isConnected.fetch();
    const { transactions } = this.props;
    let paymentId;
    let date;
    let time;
    try {
      if (transactions) {
        paymentId = this.props.items.paymentId;
        date = this.props.items.date;
        time = this.props.items.time;
      } else {
        paymentId = this.props.payment.paymentResponse
          ? this.props.payment.paymentResponse.getPaymentId()
          : this.props.payment.getPaymentId();

        date = this.props.payment.paymentResponse
          ? this.props.payment.paymentResponse.getDateTime().date
          : moment
              .unix(this.props.payment.transactions[0].finalize.updated_at)
              .format('DD MMM YYYY');
        time = this.props.payment.paymentResponse
          ? this.props.payment.paymentResponse.getDateTime().time
          : moment
              .unix(this.props.payment.transactions[0].finalize.updated_at)
              .format('HH:mm A');
      }
    } catch (error) {
      //alert(JSON.stringify(this.props.payment.transactions))
    }

    //alert(paymentId)

    let response;
    let dataTransactions;
    if (isConnected) {
      this.setState({ loading: true });
      response = await epaisaRequest(
        {
          merchantId: user.merchantId,
          paymentId: [paymentId],
          include: ['orders'],
        },
        '/payment/list',
        'GET'
      );
      dataTransactions = await GetOneTransaction(user, paymentId);
      dataTransactions = dataTransactions.list;
    } else {
      response = {
        response: Array.from(getTable('PaymentGrouped')).filter(
          item => item.paymentId == paymentId
        ),
      };
      dataTransactions = Array.from(getTable('TransactionGrouped')).filter(
        item => item.PaymentId == paymentId
      );
    }
    //alert(JSON.stringify(response.response[0].order.customItems)

    try {
      //alert(JSON.stringify(dataTransactions))
      let listTrans = dataTransactions[0].Transactions.map(objTran => {
        if (objTran.transactionStatusId === 2) {
          return {
            type: objTran.transactionType,
            amount: objTran.transactionAmount,
          };
        }
      });
      //alert(JSON.stringify(listTrans))
      const products = response.response[0].order.customItems.map(item => {
        return {
          quantity: item.quantity,
          name: item.name,
          unitPrice: item.unitPrice,
          discount: item.discountEntered,
          type: item.discountType,
          calculatedDiscount: item.discount,
          totalTax: 0, //item.totalTax,
        };
      });

      const taxesList = response.response[0].order.calculatedTax
        ? response.response[0].order.calculatedTax.map(item => {
            return {
              name: item.name,
              value: item.value,
              taxvalue: item.calculatedTaxValue,
            };
          })
        : [];
      let CGST = {
        name: 'CGST',
        value: 0,
        taxvalue: 0,
      };
      let IGST = {
        name: 'IGST',
        value: 0,
        taxvalue: 0,
      };
      let SGST = {
        name: 'SGST',
        value: 0,
        taxvalue: 0,
      };
      let CESS = {
        name: 'CESS',
        value: 0,
        taxvalue: 0,
      };
      let VAT = {
        name: 'VAT',
        value: 0,
        taxvalue: 0,
      };
      if (taxesList.length > 0) {
        taxesList
          .filter(item => item.name === 'CGST')
          .map(item => {
            CGST.value = parseFloat(CGST.value) + parseFloat(item.value);
            CGST.taxvalue =
              parseFloat(CGST.taxvalue) + parseFloat(item.taxvalue);
          });
        taxesList
          .filter(item => item.name === 'IGST')
          .map(item => {
            IGST.value = parseFloat(IGST.value) + parseFloat(item.value);
            IGST.taxvalue =
              parseFloat(IGST.taxvalue) + parseFloat(item.taxvalue);
          });
        taxesList
          .filter(item => item.name === 'SGST')
          .map(item => {
            SGST.value = parseFloat(SGST.value) + parseFloat(item.value);
            SGST.taxvalue =
              parseFloat(SGST.taxvalue) + parseFloat(item.taxvalue);
          });
        taxesList
          .filter(item => item.name === 'CESS')
          .map(item => {
            CESS.value = parseFloat(CESS.value) + parseFloat(item.value);
            CESS.taxvalue =
              parseFloat(CESS.taxvalue) + parseFloat(item.taxvalue);
          });
        taxesList
          .filter(item => item.name === 'VAT')
          .map(item => {
            VAT.value = parseFloat(VAT.value) + parseFloat(item.value);
            VAT.taxvalue = parseFloat(VAT.taxvalue) + parseFloat(item.taxvalue);
          });
      }
      //alert(JSON.stringify(merchant))

      const object = {
        duplicated: this.state.duplicated,
        companyName: user.companyName || merchant.merchantCompanyName,
        pincode: user.pincode || '',
        address1: user.storeAddress || '', //user.userAddress1||'',
        address2: user.storeAddress2 || '', //user.userAddress2||'',
        city: user.cityName || '',
        state: user.stateName || '',
        date: date,
        time: time,
        paymentId: paymentId,
        subtotal: response.response[0].paymentSubTotal,
        total: response.response[0].paymentAmount,
        paymentType: 'Cash',
        products: products,
        delivery: response.response[0].order.deliveryCharges,
        discountType: response.response[0].order.generalDiscountType,
        discount: response.response[0].order.generalDiscount,
        calculatedDiscount:
          (response.response[0].order.generalDiscount *
            response.response[0].paymentSubTotal) /
          100,
        listTrans: listTrans,
        CESS: CESS || 0, //response.response[0].order.taxes.CESS,
        CGST: CGST || 0, // response.response[0].order.taxes.CGST,
        IGST: IGST || 0, // response.response[0].order.taxes.IGST,
        SGST: SGST || 0, // response.response[0].order.taxes.SGST,
        VAT: VAT || 0, // response.response[0].order.taxes.VAS,
      };

      ConnectDeviceIOS(
        this.state.listPaired[index],
        () => {
          WriteDeviceIOS(object, this.state.listPaired[index]);
          this.setState({ loading: false });
          this.setState(
            { duplicated: true, showPrinter: false, printing: true },
            () => {
              setTimeout(() => {
                BluetoothSerial.device(
                  this.state.listPaired[index].id
                ).disconnect();
                this.props.closeModal();
                this.setState({ printing: false, noUpdate: false });
              }, 7000);
            }
          );
        },
        () => {
          BluetoothSerial.device(this.state.listPaired[index].id).disconnect();
          DisconnectDevice(this.state.listPaired[index], true);
          alert("can't connect");
          this.props.closeModal();
        },
        true
      );
    } catch (e) {
      alert(e);
    }
  };
  print = () => {
    if (
      this.props.active &&
      this.state.listPaired.length == 1 &&
      !this.state.printing
    ) {
      this.setState({ printing: true });
      setTimeout(() => {
        this.props.closeModal();
        this.setState({ printing: false });
      }, 3000);
    }
  };

  componentDidMount() {
    let temp = [];

    this.state.listPaired.map((item, i) => {
      if (i % 2 == 0) {
        temp.push([]);
      }
      temp[temp.length - 1].push(item);
    });

    this.setState({ listAct: temp, one: this.state.listPaired.length == 1 });
  }
  componentDidUpdate() {
    if (this.props.active && !this.state.noUpdate) {
      if (this.state.one) {
        this.makeConnection(0);
      } else {
        this.setState({ showPrinter: true });
      }
      this.setState({ noUpdate: true });
    }
  }
  render() {
    const { active, closeModal } = this.props;
    return (
      <Modal
        visible={active && !this.state.printed}
        onRequestClose={closeModal}
        transparent={true}
        animationType="fade"
      >
        <View
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0,0,0,0.6)',
          }}
        >
          {this.state.printing ? (
            <View
              style={{
                width: isTablet ? hp('60%') : wp('60%'),
                borderRadius: wp('2%'),
                backgroundColor: 'white',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <TextMontserrat
                style={{
                  color: '#5D6770',
                  fontSize: hp('2.8%'),
                  fontWeight: '700',
                  marginTop: hp('4%'),
                  marginBottom: hp('4%'),
                }}
              >
                Printing...
              </TextMontserrat>
            </View>
          ) : null}
          {this.state.showPrinter ? (
            <View
              style={{
                width: isTablet ? hp('70%') : wp('85%'),
                borderRadius: wp('2%'),
                backgroundColor: 'white',
                alignItems: 'center',
              }}
            >
              <TextMontserrat
                style={{
                  color: '#5D6770',
                  fontSize: hp('2.8%'),
                  fontWeight: '700',
                  marginTop: hp('2%'),
                  marginBottom: hp('2%'),
                }}
              >
                Select Printer
              </TextMontserrat>
              <View
                style={{
                  backgroundColor: '#EBEBEB',
                  height: hp('0.1%'),
                  width: '100%',
                  marginBottom: hp('0.1%'),
                }}
              />
              {this.state.listAct.length > 0 ? (
                <ScrollView
                  style={{ width: '100%', height: hp('26%') }}
                  contentContainerStyle={{ paddingHorizontal: wp('0.3%') }}
                >
                  {this.state.listAct.map((item, i) => {
                    return (
                      <View
                        key={i}
                        style={{
                          flexDirection: 'row',
                          width: '100%',
                          justifyContent: 'space-around',
                          marginBottom:
                            this.state.listAct.length == i + 1 ? hp('2%') : 0,
                        }}
                      >
                        {item.map((item2, j) => {
                          return (
                            <TouchableOpacity
                              key={j}
                              activeOpacity={0.7}
                              onPress={() => {
                                this.makeConnection(i * 2 + j);
                              }}
                              style={[
                                null,
                                {
                                  backgroundColor: 'white',
                                  alignItems: 'center',
                                  elevation: 3,
                                  borderRadius: 5,
                                  width: isTablet ? wp('17%') : wp('35%'),
                                  paddingVertical: hp('1.5%'),
                                  marginTop: hp('2%'),
                                },
                                /*this.state.printer==(i+1)?{backgroundColor:'#BDC1CD'}:*/ null,
                              ]}
                            >
                              <TextMontserrat
                                style={{
                                  fontSize: hp('1.6%'),
                                  fontWeight: '900',
                                  color: '#52565F',
                                  opacity: 0.8,
                                  marginBottom: hp('1%'),
                                }}
                              >
                                {'Cashier ' + (i * 2 + j + 1)}
                              </TextMontserrat>
                              <Image
                                source={require('../settings/assets/img/printer.png')}
                                style={{
                                  height: hp('11.5%'),
                                  width: hp('11.5%'),
                                }}
                              />
                              <TextMontserrat
                                style={{
                                  fontSize: hp('1.65%'),
                                  fontWeight: '800',
                                  width: '80%',
                                  opacity: 0.8,
                                  color: '#52565F',
                                  marginTop: hp('0.5%'),
                                  textAlign: 'center',
                                }}
                              >
                                {'Model: ' +
                                  (item2.name ? item2.name : item2.address)}
                              </TextMontserrat>
                            </TouchableOpacity>
                          );
                        })}
                      </View>
                    );
                  })}
                </ScrollView>
              ) : (
                <View
                  style={{
                    marginBottom: hp('1.5%'),
                    paddingBottom: hp('1%'),
                    paddingTop: hp('4%'),
                    width: '100%',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Image
                    source={require('../settings/assets/img/printerEmpty.png')}
                    style={{
                      width: (hp('12%') * 248) / 264,
                      height: hp('12%'),
                    }}
                  />
                  <TextMontserrat
                    style={{
                      opacity: 0.85,
                      fontSize: hp('2.3%'),
                      color: '#888888',
                      fontWeight: '800',
                    }}
                  >
                    No Printers Detected
                  </TextMontserrat>
                </View>
              )}
              <TouchableOpacity
                style={{
                  position: 'absolute',
                  top: hp('2%'),
                  right: hp('0.1%'),
                }}
                onPress={closeModal}
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
          ) : null}
        </View>
        {this.state.loading ? <Loading /> : null}
      </Modal>
    );
  }
}

const styles = EStyleSheet.create({});
const mapStateToProps = state => ({
  state: state.cashData,
  user:
    state.cashData.personalConfig != null
      ? state.cashData.personalConfig.user
      : null,
  merchant:
    state.cashData.personalConfig != null
      ? state.cashData.personalConfig.merchant
      : null,
  // payment: state.payment_data.payment,
});
const mapDispatchToProps = dispatch => ({
  set_printers: val => {
    return dispatch(cashActions.set_printers(val));
  },
  select_printers: val => {
    return dispatch(cashActions.select_printers(val));
  },
});
export default connect(mapStateToProps)(ModalPrinter);
