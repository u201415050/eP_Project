import React, { Component } from 'react';
import { PaymentType } from '../../../../interfaces/payment_interfaces';
import {
  View,
  ScrollView,
  Modal,
  TouchableOpacity,
  Linking,
  Dimensions,
  NetInfo,
  Image,
  PermissionsAndroid,
  Platform,
} from 'react-native';
import DeviceInfo from 'react-native-device-info';
import colors from '../../styles/colors';
import EStyleSheet from 'react-native-extended-stylesheet';
import Sound from 'react-native-sound';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { isTablet } from '../../constants/isLandscape';
import AudioPlayer from 'react-native-audioplayer';
import { getTable } from '../../../../services/realm_service';
import { getLocalSettingRow } from '../../../../services/settings_service';
import {
  TextMontserrat,
  CardWithHeader,
  ButtonGradient,
  ButtonGradientOutline,
  Loading,
  Alert,
} from 'components';
import { FloatingTextInput } from '../../../login/components_general/inputs';
import LinearGradient from 'react-native-linear-gradient';
import PaymentIcon from '../../../settings/components/icons/payments/payment_icon/payment_icon';
import * as paymentNames from '../../../settings/components/icons/payments/payment_names';
import * as screenNames from '../../../../navigation/screen_names';

import NavigationService from '../../../../services/navigation';
import { connect } from 'react-redux';
import AlertService from '../../../../services/alert_service';
import alert_double_service from '../../../../services/alert_double_service';
import loading_service from '../../../../services/loading_service';
import PaymentSettingsHelper from '../../../../services/payment_settings_helper';
import { cashActions } from '../../actions';
import { clearPayment } from '../../../payments/actions/payment_actions.js';
import realm from 'services/realm_service';
import * as _ from 'lodash';
import PaymentHelper from '../../../../factory/payment_helper';
import Settings from '../../../../services/realm_models/settings';
import RealmSavedTransaction from '../../../../services/realm_models/realm_saved_transaction';
import PaymentResponse from '../../../../factory/payment_response';
import RealmPayment from '../../../../services/realm_models/realm_payment';
import AndroidOpenSettings from 'react-native-android-open-settings';
import AlertDoubleButtons from '../../../../components_general/popups/AlertDoubleButtons';
class CustomField {
  constructor(field) {
    this.fieldName = field.label;
    this.fieldValue = field.value || '';
  }
  updateValue(value) {
    this.fieldValue = value;
  }
  valid() {
    return this.fieldValue === '';
  }
}
class CustomFields {
  constructor(fields) {
    this.fields = fields.map(field => {
      return new CustomField(field);
    });
  }

  getCustomFields() {
    return this.fields;
  }
}
/** Class containing all the payment icons. */
class ItemsContainer extends Component {
  payment: PaymentType;
  constructor(props) {
    super(props);

    this.paymentNames = {
      [paymentNames.EMI_PAYMENTS]: 'EMI',
      [paymentNames.CASH]: 'Cash',
      [paymentNames.UPI_PAYMENTS]: 'UPI',
      [paymentNames.WALLETS]: 'Wallet',
      [paymentNames.CHEQUE]: 'Cheque',
      [paymentNames.CARD]: 'Card',
      [paymentNames.OTHERS]: 'Others',
    };
    // let others;

    this.settings = getTable('Settings');

    const settings = getLocalSettingRow('Transaction');
    const categories_enabled = settings.find(
      x => x.settingParamName === 'PaymentCategoriesEnabled'
    );
    const types_enabled = settings.find(
      x => x.settingParamName === 'TransactionTypeEnabled'
    );

    const payment_settings = new PaymentSettingsHelper(
      JSON.parse(categories_enabled.value),
      JSON.parse(types_enabled.value)
    );
    const pd = payment_settings.getPaymentData();

    // DISABLE UPI PAYMENTS
    // delete pd['4'];

    const payments_data = Object.values(pd)
      .filter(x => x.enabled && !x.hide)
      .map(x => {
        const data = {
          iconName: x.name,
          name: x.label,
          methods: [],
          dropdown: false,
          tendering: x.tendering,
        };
        if (x.types) {
          data.methods = Object.values(x.types)
            .filter(y => y.enabled)
            .map(y => {
              return {
                name: y.name,
                iconName: y.name,
                parent: x.name,
              };
            });
          if (x.dropdown) {
            data.dropdown = true;
          }
        }
        return data;
      });
    this.payments = payments_data;
    this.settingsCustomFields = this.settings
      .filtered('name CONTAINS[c] "Transaction"')
      .map(x => {
        const value = JSON.parse(x.value);
        const results = value.find(x => x.settingParamName == 'customField');
        let active = false;
        let fields = [];
        if (results) {
          if (+results.value) {
            active = true;
            fields = value
              .filter(item => {
                return (
                  item.settingParamName === 'customField1' ||
                  item.settingParamName === 'customField2'
                );
              })
              .map(item => ({
                name: item.settingParamName,
                label: item.value,
              }));
          }
        }
        return { active, fields };
      })[0];
    this.showCustomFields = this.settingsCustomFields.active;
    this.customFields = new CustomFields(this.settingsCustomFields.fields);
  }
  state = {
    visible: false,
    modal_options: false,
    modalLayout: {},
    custom_fields: false,
    dimensionModal: null,
    alertActive: false,
  };
  iosPlaySound() {
    Sound.setCategory('Playback', false);
    const s = new Sound('payment_success.mp3', Sound.MAIN_BUNDLE, err => {
      if (err) {
        console.log(err);
        return;
      }
      s.play();
    });
  }
  // componentWillUnmount() {
  //   if (!this.props.split) {
  //     this.props.clearPayment()
  //   }
  // }

  payments = [];
  payment_icons = {};
  showOptionsModal = item => {
    if (!item.dropdown) {
      return;
    }
    const screenMiddle = Dimensions.get('window').width / 2;
    this.measures[item.iconName].measureInWindow((x, y, width, height) => {
      const left = x < screenMiddle;

      const totalWidth =
        width * (item.methods.length >= 3 ? 3 : item.methods.length) +
        wp(
          item.iconName == 'UPIPayments'
            ? isTablet
              ? '7%'
              : '13%'
            : isTablet
            ? '9.7%'
            : '16%'
        );
      //alert(totalWidth)
      const totalHeight =
        (item.methods.length > 3 ? 2 : 1) *
        (item.methods.length > 3 ? wp('26%') : wp('32%'));

      let offset;
      if (left) {
        offset = x - totalWidth / 2;

        x = offset < 0 ? -offset : x;
      } else {
        const screen = screenMiddle * 2;
        offset = x + totalWidth / 2;
        x = offset > screen ? x - totalWidth / 2 + 10 : x;
      }
      this.setState(
        {
          modal_options: true,
          modalLayout: { x, y, width, height },
          methods: item.methods,
          totalWidth,
          totalHeight,
        },
        () => {}
      );
    });
  };
  measures = {};
  disabledButtons = {};

  getConfigs() {
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
    return configs;
  }

  /**
   * generates the payment object and assign it to this.payment
   * @param {Object} order - The order object value.
   * @param {boolean} skipInit - Skips the initiate payment call.
   * @return {void} The x value.
   */
  constructPayment(order: any, skipInit: boolean = false) {
    // initiate the configurations for the payment
    const configs = this.getConfigs();
    // initiate Payment Object
    // this.payment = new Payment(order, configs);
    const user = realm.objectForPrimaryKey('User', 0);
    if (!user) {
      return {};
    }
    let orderId;
    if (this.props.orderId) {
      orderId = this.props.orderId.toString();
    } else {
      orderId = `currentOrder_${user.userId}`.toString();
    }
    // alert(orderId);
    // return;
    order = realm.objectForPrimaryKey('Order', orderId);
    this.payment = new PaymentHelper();
    this.payment.setOrder(order);

    if (user) {
      const coords = user.userLocation;
      if (coords) {
        this.payment.location = `${coords.latitude},${coords.longitude}`;
      }
    }
    // const customer = this.props.cashData.customer;
    const customer = order.customer;
    if (customer) {
      if (customer.customerId) {
        this.payment.setPaymentCustomerId(customer.customerId + '');
      }
    }

    // adding events for payment object

    // trigger when a network request is made
    // loading modal is shown
    this.payment.on('request', () => {
      //loading_service.showLoading();
      this.setState({ loading: true });
    });

    // trigger when a network request is done
    // loading modal is hidden
    this.payment.on('done', () => {
      this.setState({ loading: false });
    });
    // this.payment.on('cancelled', () => {
    //   const orderId = `currentOrder_${user.userId}`.toString();
    //   order = realm.objectForPrimaryKey('Order', orderId);
    //   order.removeCustomItems();
    // });

    // trigger when a payment is succesfull
    //
    this.payment.on('payment_succesfull', () => {
      ({ PAYMENT_SUCCES: this.payment });
      // check if sound setting is enabled
      // plays success soundconsole.log
      if (
        getLocalSettingRow('Device', 'EnableSound') === '1' ||
        getLocalSettingRow('Device', 'EnableSound') == true
      ) {
        AudioPlayer.play('payment_success.mp3');
        this.iosPlaySound();
      }

      // check if the total payment amount isn't paid, and clear the cart
      // on split payment we can have succesfull payments but we haven't paid the total amount
      // only if the total amount is paid, we clear the cart
      // alert(this.payment.getAmountToPay())
      if (this.props.onClick) {
        this.props.onClick();
      }
      if (this.payment.getAmountToPay() <= 0) {
        if (order.savedOrderId) {
          // const orderSaved = realm.objectForPrimaryKey('RealmSavedTransaction', order.savedOrderId)
          // Order.voidSavedTransactions(orderSaved.orderId)
          RealmSavedTransaction.setPaid(order.savedOrderId);
          // realm.write(() => {
          //   realm.delete(orderSaved);
          // });
        }
        if (!skipInit) {
          if (!this.props.order) {
            const orderId = `currentOrder_${user.userId}`.toString();
            order = realm.objectForPrimaryKey('Order', orderId);
            order.removeCustomItems();
          }
        }
        // we finalize the payment
        this.payment.payStep('finalize');

        // if we are on tablet, we show the invoice screen as a modal
        // else we navigate
        if (this.props.onClick) {
          this.props.onClick();
        }
        if (isTablet) {
          return this.props.toggleInvoice({
            screen: 'Invoice',
          });
        } else {
          return NavigationService.goToInvoice(screenNames.INVOICE);
        }
      }
      // if the total amount isn't paid it means it's a split payment
      // we go back to split screen
      if (isTablet) {
        this.payment.emit('toggle_invoice', { screen: 'PaymentsCheckout' });
      } else {
        NavigationService.backToSplit();
      }
    });
    this.payment.on('TransactionSuccessful', () => {
      if (
        getLocalSettingRow('Device', 'EnableSound') === '1' ||
        getLocalSettingRow('Device', 'EnableSound') == true
      ) {
        AudioPlayer.play('payment_success.mp3');
      }
    });

    this.payment.on('custom_fields_added', () => {
      this.customFields = new CustomFields(this.settingsCustomFields.fields);
      this.setState({ custom_fields: false });
      this.pay();
      console.log(this.customFields);
      console.log(this.payment);
    });

    // create a new reference for the payment object on redux
    this.props.setPayment(this.payment);
  }

  /**
   * choose what will be the payment process according to the
   * payment method selected
   * @param {boolean} skipInit - Skips the initiate payment call.
   * @return {Promise<Object>} The x value.
   */
  async beginPayment(skipInit: boolean = false) {
    // check internet connection
    const connected = await NetInfo.isConnected.fetch();

    // item will be the payment method selected
    const item = this.state.method;

    // check if is UPI payment
    if (item.parent == paymentNames.UPI_PAYMENTS) {
      // if is UPI
      let next = {
        screen: screenNames.PAYMENTS_UPI,
        extra: {
          method: item.iconName,
          payment: this.payment,
          title: 'UPI Payment',
          icon: paymentNames.UPI_PAYMENTS,
          order: this.props.order,
        },
      };
      // if is UPI QR
      if (item.iconName === paymentNames.UPI_QR) {
        next.screen = screenNames.PAYMENTS_UPI_QR;
      }

      // hide the UPI payments dropdown
      this.setState({ modal_options: false });

      // initiate the payment process
      return this.payment.payStep('initiate', { next });
    }

    // check if is UPI payment
    if (item.iconName === paymentNames.CASH) {
      let next;
      // if tendering setting is active
      if (item.tendering) {
        next = {
          screen: screenNames.PAYMENTS_CASH,
          extra: {
            payment: this.payment,
            title: 'Cash Payment',
            icon: paymentNames.CASH,
            void: true,
            order: this.props.order,
            offline: !connected,
          },
        };

        // return data to navigate to cash screen
        return Promise.resolve(next);
      }
      // if not tendering the payment will be executed
      next = {
        screen: screenNames.INVOICE,
        extra: {
          payment: this.payment,
          title: 'Cash Payment',
          icon: paymentNames.CASH,
          void: true,
          order: this.props.order,
        },
        withoutTendering: true,
      };

      // execute pay with cash, and return response

      if (this.payment.split) {
        return this.payment.payStep('process', {
          data: {},
          transactionTypeId: 2,
          next: { withoutTendering: true },
        });
      }

      return this.payment.payWithCash(next, !connected);
    }
    // if payment is Wallet
    if (item.parent == paymentNames.WALLETS) {
      let refund = true;

      // disable refund for pockets wallet payment
      if (item.iconName === 'Pockets') {
        refund = false;
      }
      let next = {
        screen: screenNames.PAYMENTS_WALLET,
        extra: {
          method: item.iconName,
          payment: this.payment,
          title: 'Wallet Payment',
          icon: paymentNames.WALLETS,
          void: refund,
          order: this.props.order,
        },
      };
      this.payment.setMethod(item.iconName);

      this.setState({ modal_options: false });
      if (skipInit) {
        return Promise.resolve(next);
      }
      return this.payment.payStep('initiate', { next });
    }
    if (item.iconName === paymentNames.CHEQUE) {
      let next = {
        screen: screenNames.PAYMENTS_CHEQUE,
        extra: {
          payment: this.payment,
          title: 'Cheque Payment',
          icon: paymentNames.CHEQUE,
          void: true,
          order: this.props.order,
        },
      };

      if (this.props.payment.paymentResponse.initiate) {
        return Promise.resolve(next);
      }
      return this.payment.payStep('initiate', { next });
    }
    if (item.iconName === paymentNames.SPLIT) {
      let next = {
        screen: 'PaymentsCheckout',
        extra: {
          split: true,
        },
      };
      this.payment.setSplit(true);
      return this.payment.payStep('initiate', { next });
    }
    if (item.iconName === paymentNames.CARD) {
      let next;
      if (this.props.order) {
        next = {
          screen: screenNames.PAYMENTS_CARD,
          extra: {
            payment: this.payment,
            title: 'Card Payment',
            icon: paymentNames.CARD,
            void: true,
            order: this.props.order,
          },
        };
      } else {
        next = {
          screen: screenNames.PAYMENTS_CARD,
          extra: {
            payment: this.payment,
            title: 'Card Payment',
            icon: paymentNames.CARD,
            void: true,
          },
        };
      }
      return this.payment.payStep('initiate', { next });
    }

    return Promise.resolve(null);
  }
  afterPayment(next) {
    // if we are on tablet, we show the invoice screen as a modal
    // else we navigate
    if (isTablet) {
      if (!next.withoutTendering) {
        const split = _.get(next, 'extra.payment.split', false);
        // if (split) {
        //   // alert(`OPEN: ${next.screen}`)
        // } else {
        this.payment.emit('toggle_invoice', next);
        // }
      }
      setTimeout(() => {
        for (const key in this.disabledButtons) {
          if (this.disabledButtons[key]) {
            this.disabledButtons[key].loading = false;
          }
          this.forceUpdate();
        }
      }, 1000);
      console.log({ NEXT_DATA_TO_TEST: next });
    } else {
      if (this.props.onClick) {
        this.props.onClick();
      }
      if (this.props.split) {
        return NavigationService.navigate(next.screen, next.extra);
      }
      return NavigationService.goToInvoice(next.screen, {
        ...next.extra,
        ...(this.props.navParams || {}),
      });
    }
  }

  async pay(skipInit: boolean = false) {
    const connected = await NetInfo.isConnected.fetch();

    if (!connected) {
      const settings = Array.from(
        realm
          .objects(Settings.schema.name)
          .filtered(`name CONTAINS[c] "Transaction"`)
      );
      const OfflineTransactions = settings[0].get('OfflineTransactions');

      if (!OfflineTransactions) {
        return AlertService.showAlert('Please connect to internet');
      }
    }
    this.beginPayment(skipInit)
      .then(next => {
        let pass = true;
        // if there is not data from begin payment, return
        if (!next) {
          return;
        }
        // check is there is a payment pending
        // if so, we prompt to continue or cancel
        if (next.previous_payment) {
          console.log(next.payment);
          this.setState({ next }, () => {
            this.setState({ alertdouble: true });
          });
          return; 
        } else {
          if (this.props.onClick) {
            this.props.onClick(() => {
              //alert(1)
              pass = false;
              setTimeout(() => {
                this.afterPayment(next);
              }, 200);
            });
          }
        }
        if (pass) this.afterPayment(next);
        // after process initiate or payment done,
        // navigate no payment screen or invoice
      })
      .catch(err => {
        // on error show an alert
        AlertService.showAlert(err.message, err.action);
      });
    return;
  }

  async buttonAction(item, order) {
    const isconnected = await NetInfo.isConnected.fetch();
    if (!isconnected && item.iconName != 'CashPayments') {
      return AlertService.showAlert('Please Connect to internet');
    } else {
      if (item.dropdown) {
        if (item.iconName == 'DigitalWalletPayments') {
          if (!isconnected) {
            return AlertService.showAlert('Please Connect to internet');
          } else {
            this.walletPosition.measureInWindow((x, y, width, height) => {
              //alert(1)
              this.setState({
                dimensionModal: {
                  posy: y,
                  posx: x,
                  width: width,
                  height: height,
                },
              });
            });
          }
        } else if (item.iconName == 'UpiPayments') {
          if (!isconnected) {
            return AlertService.showAlert('Please Connect to internet');
          } else {
            this.upiPosition.measureInWindow((x, y, width, height) => {
              this.setState({
                dimensionModal: {
                  posy: y,
                  posx: x,
                  width: width,
                  height: height,
                },
              });
            });
          }
        }

        this.showOptionsModal(item);
        return;
      }
      const user = realm.objectForPrimaryKey('User', 0);

      // for improve cash payment start
      const orderId = `currentOrder_${user.userId}`.toString();
      const realm_order = realm.objectForPrimaryKey('Order', orderId);

      if (this.props.currentAmount >= 1) {
        realm_order.addCustomItem({
          unitPrice: +this.props.currentAmount,
          calculatedPrice: +this.props.currentAmount,
        });
      }
      //alert(item.iconName)
      if (
        user.getPlan().planName === 'Free' ||
        item.iconName == 'EmiPayments' ||
        item.iconName == 'AadhaarPay' ||
        item.iconName == 'CardPayments'
      ) {
        if (!(item.iconName === 'Cheque' || item.iconName === 'CashPayments')) {
          //alert(1)
          this.setState({ modal_options: false }, () => {
            // AlertService.showAlert(
            this.setState({
              Alertmessage: `To activate ${item.iconName.replace(
                'Payments',
                ''
              )}, please contact our support team`,
              alertActive: true,
            });
          });
          return;
        }
      }

      

      if (!this.props.split) {
        let oId: string = this.props.orderId
          ? this.props.orderId
          : `currentOrder_${user.userId}`.toString();
        const realm_order = realm.objectForPrimaryKey('Order', oId);
        if (item.iconName === 'CashPayments') {
          //loading_service.showLoading();
          //this.setState({ loading: true });
          const settings = Array.from(
            realm
              .objects(Settings.schema.name)
              .filtered(`name CONTAINS[c] "Transaction"`)
          );
          const OfflineTransactions = settings[0].get('OfflineTransactions');
          const connected = await NetInfo.isConnected.fetch();
          if (!connected) {
            if (!OfflineTransactions) {
              return AlertService.showAlert('Please connect to internet');
            }
          }

          RealmPayment.create({ id: 'currentPayment', order: realm_order });

          const realm_payment = realm.objectForPrimaryKey(
            RealmPayment.schema.name,
            'currentPayment'
          );
          //loading_service.hideLoading()
          if (!isTablet) {
            //loading_service.hideLoading();
            this.setState({ loading: false }, () => {
              if (this.props.onClick) {
                this.props.onClick();
              }
              if (!+item.tendering) {
                realm_payment.pay();
                return NavigationService.goToInvoice('InvoiceCash');
              }
              this.props.setPayment(realm_payment);

              if (this.props.customFunc) {
                NavigationService.navigate(screenNames.PAYMENTS_CASH);
              }
            });
          }
          this.props.setPayment(realm_payment);

          // // alert(JSON.stringify(p));
          // return;
        }
      }
      //alert(item.iconName)
      //alert(1)

      this.setState({ method: item }, () => {
        if (this.props.customFunc) {
          //alert(this.props.setOrder)
          this.props.set_custom_order_pay(this.props.setOrder);
        }
        if (this.props.split) {
          this.payment = this.props.payment;
        } else {
          this.constructPayment(order);
        }
        if (this.showCustomFields && !this.payment.customFieldAdded) {
          //alert(1)
          this.setState({ loading: false }, () => {
            this.setState({ modal_options: false }, () => {
              return this.setState({ custom_fields: true });
            });
          });
        } else {
          // alert(2)

          this.setState({ loading: false }, this.pay);
          //;
        }
      });
    }
  }
  buttonActionDebouced = _.debounce(this.buttonAction.bind(this), 300);
  renderButtons = (data, walletOrUpi) => {
    const {
      products,
      totalDelivery,
      totalDiscount,
      type,
    } = this.props.cashData;
    let order = {};
    if (!this.props.order) {
      order = {
        products: products,
        deliveryCharges: totalDelivery,
        generalDiscount: totalDiscount,
        generalDiscountType: type,
      };
    } else {
      order = this.props.order;
    }
    console.log('DATAITEMS', data);
    return data
      .filter(item => {
        const split = item.iconName === 'Split';
        if (split) {
          if (this.props.split) {
            return false;
          }
        }
        return true;
      })
      .map((item, i) => {
        const margin =
          this.props.cashscreen && isTablet
            ? hp('1.7%')
            : isTablet
            ? hp('0.9%')
            : wp('1.8%');
        if (data.noShow) {
          return (
            <View
              key={`ìcon_${i}`}
              style={{
                alignItems: 'center',
                marginHorizontal: margin,
                marginLeft: i === 0 ? 0 : margin,
                marginRight: i === this.payments.length - 1 ? 0 : margin,
                backgroundColor: 'blue',
              }}
            >
              <View
                style={{
                  width: isTablet ? wp('10%') * 0.66 : wp('16%'),
                  height: 20,
                  backgroundColor: 'red',
                }}
              />
            </View>
          );
        } else {
          return (
            <View
              key={`ìcon_${i}`}
              style={[
                {
                  alignItems: 'center',
                  marginHorizontal: margin,
                  marginLeft: walletOrUpi ? 0 : i === 0 ? 0 : margin,
                  marginRight: walletOrUpi
                    ? 0
                    : i === this.payments.length - 1
                    ? 0
                    : margin,
                },
                walletOrUpi
                  ? {
                      width: isTablet ? wp('10%') : wp('20%'),
                    }
                  : {},
              ]}
              onLayout={x =>
                (this.payment_icons[item.iconName] = x.nativeEvent)
              }
              ref={x => {
                this.measures[item.iconName] = x;
                if (item.iconName == 'DigitalWalletPayments') {
                  this.walletPosition = x;
                  //alert(this.walletPosition)
                } else if (item.iconName == 'UpiPayments') {
                  this.upiPosition = x;
                }
              }}
            >
              <PaymentIcon
                ref={x => (this.disabledButtons[item.iconName] = x)}
                disabled={this.props.disabled()}
                main={true}
                size={isTablet ? wp('10%') * 0.66 : wp('16%')}
                container={true}
                iconName={item.iconName}
                loading={
                  this.disabledButtons[item.iconName]
                    ? this.disabledButtons[item.iconName].loading
                    : false
                }
                onPress={() => {
                  if (isTablet) {
                    if (!item.dropdown) {
                      // this.disabledButtons[item.iconName].loading = true;
                    }
                    this.buttonActionDebouced.call(this, item, order);
                  } else {
                    this.buttonAction(item, order);
                  }
                }}
              />
              <TextMontserrat
                style={{
                  fontWeight: '600',
                  fontSize: isTablet ? hp('2.2%') : wp('2.8%'),
                }}
              >
                {item.name}
              </TextMontserrat>
            </View>
          );
        }
      });
  };
  renderSubButtons = subButtons => {
    let columns = [];
    const ipr = 3;
    let newSubButton = Array.from(subButtons);
    for (let i = 0; i < Math.ceil(newSubButton.length / 3); i++) {
      columns.push(i);
    }

    if (columns.length > 1) {
      if (columns[1] < 3) {
        for (let i = 0; i < 3 - columns[1]; i++) {
          newSubButton.push({ noShow: true });
        }
      }
    }
    return columns.map(column => {
      return (
        <View
          style={{
            flexDirection: 'row',
            // flex: 1,
            // paddingVertical: 2,
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingVertical: hp('1%'),
            // backgroundColor: 'yellow'
          }}
          key={`column${column}`}
        >
          {this.renderButtons(
            newSubButton.slice(column * ipr, (column + 1) * ipr),
            true
          )}
        </View>
      );
    });
  };
  render() {
    const isLandscape = isTablet;
    //if (this.state.modalLayout != null) alert(this.state.modalLayout.width)
    const positionY =
      this.state.dimensionModal != null
        ? this.props.paytop
          ? this.state.dimensionModal.posy - this.state.totalHeight - hp('3%')
          : this.state.dimensionModal.posy +
            this.state.dimensionModal.height +
            hp('2%')
        : 0;
    const positionX =
      this.state.dimensionModal != null
        ? this.state.dimensionModal.posx +
            this.state.totalWidth / 2 +
            this.state.dimensionModal.width / 2 >
          wp(isTablet ? '65%' : '100%')
          ? wp(isTablet ? '65%' : '100%') - this.state.totalWidth - 5
          : this.state.dimensionModal.posx -
              this.state.totalWidth / 2 +
              this.state.dimensionModal.width / 2 <
            0
          ? 3
          : this.state.dimensionModal.posx -
            this.state.totalWidth / 2 +
            this.state.dimensionModal.width / 2
        : 0;
    return (
      <ScrollView
        keyboardShouldPersistTaps={'handled'}
        showsHorizontalScrollIndicator={false}
        horizontal={true}
        style={{ height: hp('7.3%'), width: '100%' }}
        contentContainerStyle={[
          styles.container,
          isLandscape ? { paddingHorizontal: 15 } : null,
          this.payments.length < (isTablet ? 7 : 5)
            ? { paddingHorizontal: 0 }
            : null,
        ]}
      >
        {this.payments.length < (isTablet ? 7 : 5) ? (
          <View
            style={{
              flexDirection: 'row',
              paddingHorizontal:
                wp(isTablet ? '2%' : '5%') *
                ((isTablet ? 7 : 5) - this.payments.length),
              width: wp(isTablet ? '65%' : '100%'),
              justifyContent:
                this.payments.length == 1 ? 'center' : 'space-around',
            }}
          >
            {this.renderButtons(this.payments, false)}
          </View>
        ) : (
          this.renderButtons(this.payments, false)
        )}
        <Modal
          onRequestClose={() => this.setState({ modal_options: false })}
          transparent={true}
          visible={this.state.modal_options && this.state.methods.length > 0}
        >
          <TouchableOpacity
            onPress={() => this.setState({ modal_options: false })}
          >
            <View style={{ width: '100%', height: '100%' }} />
          </TouchableOpacity>

          <View
            ref={x => (this.measures['buttonsBox'] = x)}
            style={[
              {
                // width: wp('35%'),
                borderRadius: 10,
                padding: 12,
                // justifyContent: 'center',
                // alignItems: 'space-between',
                backgroundColor: '#F0F0F0',
                // backgroundColor: 'red',
                position: 'absolute',
                elevation: 6,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.2,
                shadowRadius: 5,
                top: positionY,
                left: positionX,
              },
            ]}
          >
            {this.renderSubButtons(this.state.methods || [])}
            <Image
              style={{
                transform: [{ rotate: `${this.props.paytop ? 180 : 0}deg` }],
                top:
                  this.state.dimensionModal != null
                    ? this.state.dimensionModal.posy +
                      (this.props.paytop
                        ? -hp('2.4%')
                        : this.state.dimensionModal.height) -
                      hp('2%') -
                      positionY
                    : 0,
                left:
                  this.state.dimensionModal != null
                    ? this.state.dimensionModal.posx +
                      this.state.dimensionModal.width / 2.8 -
                      hp('3%') -
                      positionX
                    : 0,
                position: 'absolute',
                width: hp('6%'),
                tintColor: '#F1F1F1',
                height: hp('6%'),
                marginLeft: hp('1%'),
              }}
              resizeMode="stretch"
              source={require('../../assets/icons/triangle.png')}
            />
          </View>
        </Modal>
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
                width: isTablet ? '30%' : '80%',
                height: hp('29%'),
                elevation: 5,
                backgroundColor: 'white',
                borderRadius: hp('1.5%'),
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
        <Modal
          onRequestClose={() => this.setState({ custom_fields: false })}
          visible={this.state.custom_fields}
          transparent={true}
          animationType="fade"
        >
          <View style={cfs.backdrop} />
          <View style={cfs.container}>
            <View>
              <CardWithHeader
                headerTitle={'Custom Fields'}
                isLandscape={DeviceInfo.isTablet()}
                sizeHeaderLabel={
                  !DeviceInfo.isTablet() ? wp('4.5%') : hp('3.5%')
                }
                onPressCloseButton={() =>
                  this.setState({ custom_fields: false })
                }
                closeButton={true}
                customHeaderStyle={{
                  height: !DeviceInfo.isTablet() ? hp('6.9%') : hp('8.4%'),
                }}
                customCardStyle={{
                  width: !DeviceInfo.isTablet() ? wp('86.9%') : wp('45.8%'),
                }}
              >
                <View style={cfs.fields_container}>
                  {this.customFields.fields.map((field, i) => {
                    return (
                      <View key={`field_${i}`}>
                        <FloatingTextInput
                          label={field.fieldName}
                          value={field.fieldValue}
                          onChangeText={v => {
                            field.updateValue(v);
                            this.forceUpdate();
                          }}
                        />
                      </View>
                    );
                  })}
                </View>
                <View style={cfs.buttons_container}>
                  <View style={cfs.button_right}>
                    <ButtonGradientOutline
                      borderRadius={wp('5%')}
                      title="SKIP"
                      onPress={() => {
                        this.setState({ custom_fields: false }, () => {
                          this.payment.customFieldAdded = true;
                          setTimeout(() => this.pay(), 0);
                          //this.pay();
                        });
                      }}
                    />
                  </View>
                  <View style={cfs.button_left}>
                    <ButtonGradient
                      disabled={(() => {
                        return (
                          this.customFields.fields.filter(x => x.fieldValue)
                            .length < 1
                        );
                      })()}
                      borderRadius={wp('5%')}
                      title="CONFIRM"
                      onPress={() => {
                        this.payment.addCustomFields(this.customFields);
                        this.payment.customFieldAdded = true;
                      }}
                    />
                  </View>
                </View>
              </CardWithHeader>
            </View>
          </View>
        </Modal>
        {this.state.loadingchange ? <Loading /> : null}
        {this.state.alertActive && (
          <Alert
            textSize={1.5}
            fontWeight="600"
            message={[this.state.Alertmessage]}
            buttonTitle="CALL"
            closeIcon={true}
            onPress={() => {
              this.setState({ alertActive: false });

              Linking.openURL(`tel:+919810001234`);
            }}
            onPressCloseButton={() => this.setState({ alertActive: false })}
          />
        )}
        {this.state.alertdouble && (
          <AlertDoubleButtons
            positiveAction={() => {
              this.setState({ alertdouble: false }, () => {
                // this.constructPayment({
                //   products: [],
                //   deliveryCharges: 0,
                //   generalDiscount: 0,
                // }, true)
                const pod = this.state.next.order;
                realm.write(() => {
                  realm.create(
                    'Order',
                    {
                      id: 'pendingPayment',
                      deliveryCharges: pod.deliveryCharges,
                      generalDiscount: pod.generalDiscount,
                      totalDiscount: pod.totalDiscount,
                      customItems: pod.customItems,
                      generalDiscountType: pod.generalDiscountType,

                      // calculatedTax: { type: 'GeneralTax[]', default: [] },
                      // totalPrice: { type: 'double', default: 0 },
                      savedOrderId: pod.savedOrderId,
                      customer: pod.customer,
                    },
                    true
                  );
                });
                const pending_payment = realm.objectForPrimaryKey(
                  'Order',
                  'pendingPayment'
                );
                pending_payment.update();
                console.log({ pending_payment });
                this.payment.order = pending_payment;
                // this.payment.order = new OrderHelper();
                // this.payment.order.setConfigs(this.getConfigs())
                // this.payment.order.addCustomItems(next.order.customItems)
                // this.payment.order.update();
                this.payment.paymentResponse.setInitiate({
                  paymentDetails: {},
                  success: this.state.next.success,
                  response: this.state.next.payment,
                });
                this.state.next.transactions.forEach(tx => {
                  const transaction = new PaymentResponse();
                  transaction.setProcess({
                    success: 1,
                    response: tx,
                  });
                  this.payment.transactions.push(transaction);
                });

                this.payment.paymentCurrencyId = this.state.next.payment.paymentCurrencyId;
                this.payment.paymentTipAmount = this.state.next.payment.paymentTipAmount;
                this.payment.paymentAmount = this.payment.order.totalPrice;
                this.payment.paymentSubTotal = this.payment.order.subTotal;
                this.payment.paymentTotalDiscount = this.payment.order.totalDiscount;
                this.payment.paymentCustomerId = '';
                this.payment.created_at = +new Date() / 1000;
                this.payment.location = '0.0,0.0';
                this.payment.update();
                if (this.props.onClick) {
                  this.props.onClick();
                }
                //setTimeout(()=>{
                this.pay(true);
                //},2000)

                // console.log(next)
                console.log(this.payment);
              });
            }}
            negativeAction={() => {
              this.setState({ alertdouble: false }, () => {
                this.payment
                  .cancel(this.state.next.lastPaymentId, false)
                  .then(cancel => {
                    console.log({ cancel });
                    this.pay();
                  })
                  .catch(err => {
                    AlertService.showAlert(err.message, err.action);
                  });
              });
            }}
            visible={this.state.alertdouble}
            message={`Would you like to go back to the previous transaction?`}
            title={'Pending Payment'}
            titleConfirm="YES"
            titleCancel="NO"
            close={() => this.setState({ alertdouble: false })}
          />
        )}
      </ScrollView>
    );
  }
}

const cfs = EStyleSheet.create({
  backdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)' },
  container: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fields_container: {
    width: '100%',
    paddingHorizontal: wp('10%'),
    paddingBottom: wp('5%'),
    paddingTop: wp('2%'),
  },
  buttons_container: {
    flexDirection: 'row',
    paddingHorizontal: wp('6%'),
    paddingBottom: wp('4%'),
  },
  button_right: { flex: 1, paddingRight: wp('1.5%') },
  button_left: { flex: 1, paddingLeft: wp('1.5%') },
});

const styles = EStyleSheet.create({
  container: {
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  title: {
    color: colors.white,
    fontSize: 17,
    fontWeight: '700',
    letterSpacing: 2,
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
  cashData: state.cashData,
  payment: state.payment_data.payment,
});
const mapDispatchToProps = dispatch => ({
  clear_order: () => dispatch(cashActions.clear_data()),
  clear_customer: () => dispatch(cashActions.clear_customer()),
  setPayment: payment => dispatch(cashActions.setPayment(payment)),
  clearPayment: () => dispatch(clearPayment()),
  set_ntransactions: val => {
    return dispatch(cashActions.set_ntransactions(val));
  },
  set_custom_order: val => {
    return dispatch(cashActions.set_custom_order(val));
  },
  set_custom_order_pay: val => {
    return dispatch(cashActions.set_custom_order_pay(val));
  },
});
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ItemsContainer);
