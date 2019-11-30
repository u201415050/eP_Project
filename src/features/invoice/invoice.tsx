import React, { Component } from 'react';
import { View, StyleSheet, BackHandler } from 'react-native';
import loading_service from '../../services/loading_service';
import Orientation from 'react-native-orientation-locker';
import { isTablet } from './constants/isLandscape';
import * as screen_names from '../../navigation/screen_names'
import { cashActions } from '../cash_register/actions';
import {
  clearPayment,
  setPayment,
} from '../payments/actions/payment_actions.js';
import { connect } from 'react-redux';
import Header from './components/header/header';
import Content from './components/content/content';
import {
  PaymentType,
  PaymentDetailsEpType,
} from '../../interfaces/payment_interfaces';
import { NavigationScreenProp } from 'react-navigation';
class InvoiceScreen extends Component<Props> {
  static navigationOptions = ({ navigation }: any) => ({
    header: isTablet ? null : (
      <Header navigation={navigation} label="INVOICE" />
    ),
  });
  payment: PaymentType;
  transactionResponse: PaymentDetailsEpType;
  constructor(props: Props) {
    super(props);
    this.payment = this.props.payment;
  }
  form = null;
  componentWillMount() {
    !isTablet ? Orientation.lockToPortrait() : Orientation.lockToLandscape();
  }
  componentDidMount() {
    this.backHandlerListener = BackHandler.addEventListener(
      'hardwareBackPress',
      () => {
        this.props.navigation.navigate(screen_names.CASH_REGISTER);
        return true;
      }
    );
    loading_service.hideLoading();
    // alert(JSON.stringify(this.payment.paymentResponse.tenderingChange))
  }
  componentWillUnmount() {
    this.props.setPayment({});
    if (this.backHandlerListener) {
      this.backHandlerListener.remove();
    }
    //this.props.clear_payment();
  }
  render() {
    const visible = this.props.visible;
    const toggleForm = this.props.toggleFormVisible || (() => { });
    const { closeModal } = this.props
    return (
      <View style={styles.container}>
        <Content
          closeModal={isTablet ? closeModal : () => { }}
          payment={this.payment}
          formRef={(form: any) => (this.form = form)}
          visible={visible}
          toggleForm={toggleForm}
          landscape={isTablet}
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
)(InvoiceScreen);
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
