import React, { Component } from 'react';
import {
  PermissionsAndroid,
  Alert,
  BackHandler,
  NetInfo,
  Platform,
} from 'react-native';
import { DeviceEventEmitter } from 'react-native';
import { View, ImageBackground, ScrollView } from 'react-native';
import PaymentsHeader from '../../components/header/header';
import { TextMontserrat } from 'components';
import TransactionDetails from './../../components/transaction_details/transaction_details';
import { connect } from 'react-redux';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { isTablet } from '../../../cash_register/constants/isLandscape';
import { getLocalSettingRow } from '../../../../services/settings_service';
import CardImage from './../../components/card_image/card_image';
import * as card_names from './../../components/card_image/image_names';
import * as _ from 'lodash';
import realm from '../../../../services/realm_service';
import CardModule from '../../../../custom_modules/card_module';
import PaymentResponse from '../../../../factory/payment_response';
import ButtonGradient from '../cash/components/transaction_details/components/buttonGradientColor/ButtonGradient';
import alert_service from '../../../../services/alert_service';
import loading_service from '../../../../services/loading_service';
import alert_double_service from '../../../../services/alert_double_service';
import { cancelPendingTransactions } from 'api';
//import mixpanel from '../../../../services/mixpanel';
import { base_url, clientId } from '../../../../env/credentials';

function onPressBack(payment, navigation, navigate) {
  if (payment.processing) {
    return navigate;
  }

  if (payment.paymentResponse.process) {
    alert_double_service.showAlertDouble(
      'Confirmation',
      'Do you want to cancel the payment?',
      async () => {
        try {
          let cancel = {};

          if (payment.split) {
            const transactionId = _.get(
              payment.paymentResponse,
              'process.response.transactionStatusId',
              null
            );
            cancel = await payment.cancelTransaction(transactionId);
            console.log(cancel);
          } else {
            cancel = await payment.cancel(
              payment.paymentResponse.getPaymentId()
            );
          }

          if (!cancel.success) {
            throw new Error(cancel.message);
          }
          alert_service.showAlert('Payment Cancelled!', navigation.goBack);
        } catch (error) {
          navigation.goBack();
        }
      }
    );

    return navigate;
  }

  return navigation.goBack();
}
class CardPayments extends Component {
  static navigationOptions = ({ navigation }) => ({
    header: isTablet ? null : (
      <PaymentsHeader
        navigation={navigation}
        title="CARD PAYMENT"
        headerRight
        payment={this.payment ? this.payment : null}
        replaceBack={onPressBack}
      />
    ),
  });
  constructor(props) {
    super(props);
    //mixpanel.track('Card Payment');

    this.payment = this.props.payment;
    this.startCardPayment();
  }

  state = {
    payCant: 0,
    currentIndex: 0,
    card: card_names.VERIFYING,
  };

  componentDidMount() {
    cancelPendingTransactions(this.payment);

    NetInfo.isConnected.addEventListener(
      'connectionChange',
      // isConnected => {
      //   alert(isConnected);
      // }
      this.handleConnectivityChange.bind(this)
    );
    if (this.props.navigation) {
      this._willBlurSubscription = BackHandler.addEventListener(
        'hardwareBackPress',
        onPressBack.bind(this, this.props.payment, this.props.navigation, true)
      );
    }
    this._cardStatusListener = DeviceEventEmitter.addListener(
      'cardTransactionStatus',
      e => {
        switch (e.state) {
          case 'Processing':
            this.setState({
              card: card_names.VERIFYING,
            });
            break;
          case 'Swipe or insert the card':
            this.setState({
              card: card_names.INSERT,
            });
            break;
          case 'Enter pin':
            this.setState({
              card: card_names.TYPE_PIN,
            });
            break;
          default:
            break;
        }
      }
    );
  }

  componentWillUnmount() {
    NetInfo.removeEventListener('connectionChange', () => {});
    this._cardStatusListener.remove();
    if (this._willBlurSubscription) {
      this._willBlurSubscription.remove();
    }
  }
  handleConnectivityChange(isConnected) {
    if (isConnected) {
      // alert(JSON.stringify(this.payment.paymentResponse.getPaymentId()));

      this.checkAndUpdate();
    }
  }

  card_messages = {
    [card_names.INSERT]: 'SWIPE/INSERT CARD NOW',
    [card_names.SUCCESS]: 'PAYMENT SUCCESSFUL',
    [card_names.ERROR]: 'PAYMENT FAILED',
    [card_names.VERIFYING]: 'VERIFYING......',
    [card_names.TYPE_PIN]: 'PLEASE INPUT PIN',
  };
  _cardStatusListener;

  async startCardPayment() {
    this.setState({
      card: card_names.VERIFYING,
    });
    try {
      // device with ID "0" is the card reader selected
      this.card_reader = realm.objectForPrimaryKey('CardReader', 0);

      if (!this.card_reader) {
        throw new Error('No card readers found');
      }

      const { data, transactionTypeId } = this.getProcessTransactionData(
        this.card_reader
      );

      const res = await this.payment.payStep('process', {
        data,
        transactionTypeId,
        skipSuccess: true,
        card: true,
      });
      this.payment.processing = true;

      //loading_service.hideLoading()
      //alert(JSON.stringify(res))
      let dataSend = this.getStartTransactionData(this.card_reader, res);
      setTimeout(() => {
        CardModule.startTransaction(
          { ...dataSend, userName: dataSend.username },
          e => {
            let response;
            //alert(1)
            if (Platform.OS === 'ios') {
              response = e[0];
            } else {
              response = e;
            }
            if (!response.success) {
              this.payment.processing = false;
            }
            console.log('CARDRESPONSE');
            console.log({ payment_data: this.payment });
            this.updatePayment(response, this.card_reader);
          }
        );
      }, 3000);
    } catch (error) {
      loading_service.hideLoading();
      //alert(JSON.stringify(error))
      this.setState({
        card: card_names.ERROR,
        error: {
          errorCode: '',
          errorMessage: error.message || '',
        },
      });
    }
  }

  getStartTransactionData(card_reader, res) {
    const isIOS = Platform.OS === 'ios';
    if (card_reader.deviceProcessorId === 1) {
      // MRL
      const data = {
        processorId: this.card_reader.deviceProcessorId,
        amount: res.response.transactionAmount,
        cardReaderType: this.card_reader.deviceTypeName,
        serialNumber: this.card_reader.deviceSerialNumber,
        userName: this.card_reader.username,
        password: this.card_reader.password,
        tid: this.card_reader.tid,
        mid: this.card_reader.mid,
      };
      return data;
    } else if (card_reader.deviceProcessorId === 4) {
      // Mosambee
      let data = {
        processorId: this.card_reader.deviceProcessorId,
        amount: res.response.transactionAmount,
        appKey: this.card_reader.appKey,
        accountNumber: 'ACC_NO_' + res.response.merchantId,
        userName: this.card_reader.username,
        password: this.card_reader.password,
        transactionId: '' + res.response.transactionId,
      };

      return data;
    } else if (card_reader.deviceProcessorId === 10) {
      // mSwipe
      let data = {
        amount: res.response.transactionAmount,
        transactionId: '' + res.response.transactionId,
        merchantId: this.card_reader.merchantId,
        userId: this.card_reader.userId,
        deviceActive: this.card_reader.deviceActive,
        deviceId: this.card_reader.deviceId,
        processorId: this.card_reader.deviceProcessorId,
        manufacturerId: this.card_reader.deviceManufacturerId,
        deviceTypeId: this.card_reader.deviceTypeId,
        deviceTypeName: this.card_reader.deviceTypeName,
        serialNumber: this.card_reader.deviceSerialNumber,
        deviceManufacturerName: this.card_reader.deviceManufacturerName,
        // username: this.card_reader.username,
        password: this.card_reader.password,
        url: base_url + '/',
        clientId: clientId,
      };
      if (isIOS) {
        data.username = this.card_reader.username;
      } else {
        data.username = this.card_reader.username;
      }
      return data;
    }
  }
  getProcessTransactionData(card_reader) {
    const isIOS = Platform.OS === 'ios';

    let data;
    let transactionTypeId;
    // MRL
    if (card_reader.deviceProcessorId === 1) {
      data = {
        deviceId: card_reader.deviceId,
        tid: card_reader.tid,
        mid: card_reader.mid,
        deviceProcessorId: card_reader.deviceProcessorId,
        username: card_reader.username,
        password: card_reader.password,
      };
      transactionTypeId = 22;
    }
    // Mosambee
    if (card_reader.deviceProcessorId === 4) {
      data = {
        appKey: card_reader.appKey,
        deviceId: card_reader.deviceId,
        mosambeeMerchantId: card_reader.mosambeeMerchantId,
        username: card_reader.username,
        deviceProcessorId: card_reader.deviceProcessorId,
        password: card_reader.password,
        saltKey: card_reader.saltKey,
      };
      transactionTypeId = 24;
    }
    // mSwipe
    if (card_reader.deviceProcessorId === 10) {
      data = {
        deviceId: card_reader.deviceId,
        deviceProcessorId: card_reader.deviceProcessorId,
        username: card_reader.username,
        password: card_reader.password,
      };
      // if (isIOS) {
      // data.userName = this.card_reader.username;
      // } else {
      //   data.username = this.card_reader.username;
      // }
      transactionTypeId = 36;
    }
    return { data, transactionTypeId };
  }
  async updatePayment(res, card_reader) {
    const { success, ...data } = res;
    const transactionStatusId = success ? 2 : 6;
    let card_status;
    // card_status will decide what image show for the current status
    switch (transactionStatusId) {
      case 6:
        card_status = card_names.ERROR;
        break;
      case 2:
        card_status = card_names.SUCCESS;
        break;
      default:
        break;
    }
    this.setState({
      card: card_status,
      error: {
        errorCode: data.errorCode,
        errorMessage: data.errorMessage || '',
      },
    });
    const processData = this.getProcessTransactionData(card_reader).data;

    const parameters = {
      data: {
        ...processData,
        transactionStatusId,
        ...data,
      },
      transactionTypeId: this.getProcessTransactionData(card_reader)
        .transactionTypeId,
    };
    try {
      let updateRes;
      if (!(await NetInfo.isConnected.fetch())) {
        throw new Error('No internet connection!');
      } else {
        updateRes = await this.payment.payStep('update', parameters);
      }

      if (transactionStatusId == 2 || transactionStatusId == 6) {
        const processRes = this.payment.paymentResponse.process;
        const transaction = new PaymentResponse();
        transaction.setProcess({
          response: processRes.response.transaction,
          transactionDetails: processRes.response.transactionDetails,
          success: processRes.success,
        });
        if (transactionStatusId == 2) {
          this.payment.transactions.push(transaction);

          this.payment.emit('payment_succesfull');
        }
      }
      loading_service.hideLoading();
      return Promise.resolve(updateRes);
    } catch (error) {
      try {
        if (this.payment.paymentResponse.process.response.transactionId) {
          realm.write(() => {
            realm.create('QueuedRequest', {
              parameters: JSON.stringify(parameters.data),
              endpoint: '/payment/update',
              method: 'POST',
              created_at: new Date(),
              key: `${this.payment.paymentResponse.getPaymentId()}`,
              extra: `####${this.payment.paymentResponse.getPaymentId()}####${
                parameters.transactionTypeId
              }####${
                this.payment.paymentResponse.process.response.transactionId
              }`,
            });
          });
        }
      } catch (error) {
        console.log(error);
      }
      loading_service.hideLoading();
      return Promise.reject(error);
    }
  }

  async checkAndUpdate() {
    if (await NetInfo.isConnected.fetch()) {
      this.payment.processing = true;
      const requests = realm
        .objects('QueuedRequest')
        .filtered(
          `key CONTAINS[c] "${this.payment.paymentResponse.getPaymentId()}" AND completed = false`
        );
      Array.from(requests).forEach(async request => {
        loading_service.showLoading();
        try {
          const res = await request.execute();
          // alert(JSON.stringify(res));
        } catch (error) {
          alert(JSON.stringify(error));
        } finally {
          loading_service.hideLoading();
        }
      });
      this.payment.processing = false;
      return { success: true };
    } else {
      return { success: false, message: 'No internet connection!' };
    }
  }

  renderError = () => {
    if (this.state.card === card_names.ERROR) {
      return (
        <View
          style={{
            paddingHorizontal: 30,
            width: '100%',
          }}
        >
          <TextMontserrat
            style={{ fontWeight: '700', fontSize: 20, color: '#52565F' }}
          >
            Error Code : {this.state.error.errorCode}
          </TextMontserrat>
          <TextMontserrat
            style={{ fontWeight: '500', fontSize: 15, color: '#52565F' }}
          >
            {this.state.error.errorMessage}
          </TextMontserrat>
          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              width: '100%',
            }}
          >
            <View style={{ width: '50%' }}>
              <ButtonGradient
                disabled={this.payment.processing}
                onPress={async () => {
                  const cont = await this.checkAndUpdate();
                  if (cont.success) {
                    this.startCardPayment();
                  } else {
                    alert_service.showAlert(cont.message);
                  }
                }}
                heightB={true}
                style={{ marginVertical: hp('1.5%'), marginBottom: hp('3%') }}
                firstColor={'#174285'}
                secondColor={'#0079AA'}
                title={'RETRY'}
              />
            </View>
          </View>
        </View>
      );
    }
  };
  render() {
    let {
      total_amount,
      totalDiscount,
      totalDelivery,
      type,
      products,
    } = this.props.state;

    if (this.order != null) {
      products = this.order.products;
      totalDiscount = this.order.generalDiscount;
      totalDelivery = this.order.deliveryCharges;
      type = this.order.generalDiscountType;
    }
    let subTotalDiscount = 0;
    products.map(item => {
      if (item.type == '%') {
        subTotalDiscount = parseFloat(
          parseFloat(subTotalDiscount) +
            (parseFloat(item.total) -
              parseFloat(item.discount / 100) * parseFloat(item.total))
        );
      } else {
        subTotalDiscount =
          parseFloat(parseFloat(subTotalDiscount)) +
          (parseFloat(item.total) - parseFloat(item.discount));
      }
    });
    let finalDiscount =
      type == '%'
        ? (subTotalDiscount * parseFloat(totalDiscount)) / 100
        : parseFloat(totalDiscount);
    let CGST = subTotalDiscount * 0.09;
    let Total =
      parseFloat(subTotalDiscount) -
      parseFloat(finalDiscount) +
      parseFloat(totalDelivery); //+
    //parseFloat(CGST);
    if (
      getLocalSettingRow('Transaction', 'RoundOff') == true ||
      getLocalSettingRow('Transaction', 'RoundOff') == 1
    ) {
      Total = parseInt(Total.toFixed(0));
    }
    return (
      <ImageBackground
        source={require('../../../../assets/images/bg/loadingBackground.png')}
        style={[
          {
            paddingHorizontal: 10,
            paddingVertical: 20,
            height: '100%',
          },
          isTablet ? { width: '100%' } : null,
        ]}
      >
        {/* <ScrollView
          keyboardShouldPersistTaps="always"
          contentContainerStyle={isTablet ? { paddingHorizontal: 2 } : null}
        > */}
        <TransactionDetails
          data={this.props.state}
          order={this.props.payment.order}
        />
        <ScrollView
          contentContainerStyle={{
            alignItems: 'center',
            justifyContent: 'center',
            marginVertical: 20,
          }}
        >
          <View style={{ marginVertical: 15 }}>
            <TextMontserrat
              style={{
                fontSize: 19,
                fontWeight: '700',
                color: '#174285',
                letterSpacing: 2,
              }}
            >
              {this.card_messages[this.state.card]}
            </TextMontserrat>
          </View>
          <CardImage
            onPress={() => ({})}
            size={isTablet ? hp('32%') : '225'}
            imageName={this.state.card}
          />
          {this.renderError()}
        </ScrollView>
        {/* </ScrollView> */}
      </ImageBackground>
    );
  }
}
const mapStateToProps = state => ({
  state: state.cashData,
  payment: state.payment_data.payment,
  order: state.payment_data.order,
});
export default connect(mapStateToProps)(CardPayments);
