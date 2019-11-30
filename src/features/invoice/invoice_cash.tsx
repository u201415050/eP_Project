import React, { Component } from 'react';
import { View, StyleSheet, NetInfo, Text } from 'react-native';
import loading_service from '../../services/loading_service';
import Orientation from 'react-native-orientation-locker';
import { isTablet } from './constants/isLandscape';

import { cashActions } from '../cash_register/actions';
import {
  clearPayment,
  setPayment,
} from '../payments/actions/payment_actions.js';
import { connect } from 'react-redux';
import Header from './components/header/header';
import Content from './components/content/content_cash';
import {
  PaymentType,
  PaymentDetailsEpType,
} from '../../interfaces/payment_interfaces';
import { NavigationScreenProp } from 'react-navigation';
import RealmPayment, {
  RealmPaymentInterface,
} from '../../services/realm_models/realm_payment';
import { epaisaRequest } from '../../services/epaisa_service';
import realm from '../../services/realm_service';
import { RealmTransactionInterface } from '../../services/realm_models/realm_transaction';
class InvoiceScreenCash extends Component<Props> {
  payment: RealmPaymentInterface;
  transactionResponse: PaymentDetailsEpType;
  static navigationOptions = ({ navigation }: any) => ({
    header: isTablet ? null : (
      <Header navigation={navigation} label="INVOICE" />
    ),
  });

  constructor(props: Props) {
    super(props);
    // this.payment = this.props.payment; // commented for improve cash

    // for improve cash start
    this.payment = RealmPayment.get('currentPayment');
    // alert(JSON.stringify(this.payment));
    this.state = {
      printerDisable: true,
      customerId: null,
    };
  }
  componentWillMount() {
    !isTablet ? Orientation.lockToPortrait() : Orientation.lockToLandscape();
  }
  realm_payments = realm.objects(RealmPayment.schema.name);
  _netInfoListener = NetInfo.isConnected;
  componentDidMount() {
    const listener = this._listener.bind(this);
    loading_service.hideLoading();
    this.realm_payments.addListener(listener);
    // const netListener = .bind(this);
    this._netInfoListener.addEventListener(
      'connectionChange',
      this._netListener
    );
    // alert(JSON.stringify(this.payment.paymentResponse.tenderingChange))
  }

  componentWillUnmount() {
    RealmPayment.resetCurrent();
    this.realm_payments.removeAllListeners();

    this._netInfoListener.removeEventListener(
      'connectionChange',
      this._netListener
    );
    //this.props.clear_payment();
  }
  _netListener = async (isConnected: boolean) => {
    if (isConnected && this.payment.savedId) {
      alert(this.payment.savedId);
      const unpaid: RealmPaymentInterface[] = Array.from(
        realm
          .objects(RealmPayment.schema.name)
          .filtered(`synced = false`)
          .filtered(`paying = false`)
          .filtered('id != "currentPayment"')
      );
      const unpaid_requests = unpaid.map(payment => {
        return payment.getRequest();
      });
      unpaid.forEach(payment => {
        payment.setPaying(true);
      });
      const res = await epaisaRequest(
        unpaid_requests,
        '/payment/offlinetransactions',
        'POST'
      );
      const success = res.success;
      if (!success) {
        realm.write(() => {
          unpaid.forEach(payment => {
            payment.synced = false;
            payment.paying = false;
          });
        });
      } else {
        realm.write(() => {
          unpaid.forEach(payment => {
            payment.synced = true;
            payment.paying = false;
          });
        });
        const resData = res.response.reverse()[0];
        const initiate = resData.initiate.response;
        const process = resData.process.response;
        const finalize = resData.finalize.response;
        const transaction: RealmTransactionInterface = {
          success,
          initiate,
          process,
          finalize,
        };
        realm.write(() => {
          this.payment.transactions = [transaction];
        });
        // if (current[0]) {
        //   this.payment = current[0];
        // alert(JSON.stringify(this.payment));
        this.forceUpdate();
        // }
      }
    }
  };
  _listener(collection, changes) {
    try {
      if (this.payment.transactions[0].finalize != null) {
        this.setState({
          customerId: this.payment.transactions[0].finalize.paymentCustomerId,
        });
        //alert(JSON.stringify(this.payment))
      }
    } catch (error) {}
    this.forceUpdate();
  }

  form = null;
  render() {
    const visible = this.props.visible;
    const toggleForm = this.props.toggleFormVisible || (() => {});

    return (
      <View style={styles.container}>
        <Content
          printerDisable={this.state.printerDisable}
          closeModal={this.props.closeModal}
          payment={this.payment}
          formRef={(form: any) => (this.form = form)}
          visible={visible}
          toggleForm={toggleForm}
          landscape={isTablet}
          customerId={this.state.customerId}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    width: '100%',
    height: '100%',
  },
});

const mapStateToProps = state => ({
  state: state.cashData,
  payment: state.payment_data.payment,
  order: state.payment_data.order,
});

const mapDispatchToProps = dispatch => ({
  set_ntransactions: val => {
    return dispatch(cashActions.set_ntransactions(val));
  },
  set_custom_order: val => {
    return dispatch(cashActions.set_custom_order(val));
  },
  set_custom_order_pay: val => {
    return dispatch(cashActions.set_custom_order_pay(val));
  },
  clear_payment: () => dispatch(clearPayment()),
  setPayment: () => dispatch(setPayment()),
});
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(InvoiceScreenCash);
export interface Props {
  visible: true;
  payment: PaymentType;
  navigation: NavigationScreenProp<any>;
  toggleFormVisible: any;
  next: {
    payment: PaymentType;
    title: string;
    icon: string;
    void: boolean;
  };
}
