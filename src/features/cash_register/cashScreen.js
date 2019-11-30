import React, { Component, Fragment } from 'react';
import {
  View,
  StyleSheet,
  ImageBackground,
  Platform,
  Text,
  PermissionsAndroid,
} from 'react-native';
import TotalAmount from './components/TotalAmount/totalAmount';
import ItemsContainer from './components/ItemsContainer/itemsContainer';
import Calculator from './components/Calculator/Calculator';
import Footer from './components/Footer/footer';
import colors from './styles/colors';
import Orientation from 'react-native-orientation-locker';
import { connect } from 'react-redux';
import { cashActions } from './actions';
import RightSideBar from './components/RightSideBar/rightSideBar';
import ModalDiscount from '../modal_discount/modalDiscount';
import ModalDelivery from '../modal_delivery/modalDelivery';
import ModalOptions from './components/Modals/ModalOptions/modalOptions';
import { isTablet } from './constants/isLandscape';
import ModalCustomer from '../modal_customer/modalCustomer';
import { INVOICE } from '../../navigation/screen_names';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { cashConstants } from './constants/actions';
import ModalCash from './components/Modals/ModalCashPayment/modalCash';
import ModalInvoice from './components/Modals/ModalInvoice/modalInvoice';
import realm from '../../services/realm_service';
import RealmSavedTransaction from '../../services/realm_models/realm_saved_transaction';
import CashRegisterHeader from './components/Header/CashRegisterHeader';
import PropTypes from 'prop-types';
import PaymentHelper from '../../factory/payment_helper';
// import EpaisaPaymentButton from '../../components_general/buttons/EpaisaPaymentButton/EpaisaPaymentButton';
//import mixpanel from '../../services/mixpanel';
import { epaisaRequest } from '../../services/epaisa_service';
import alert_service from '../../services/alert_service';
import NavigationService from 'services/navigation';
import RealmPayment from '../../services/realm_models/realm_payment';
import Settings from '../../services/realm_models/settings';
import { SafeAreaView } from 'components';
import Sound from 'react-native-sound';

const isPhone = !isTablet;

class CashScreen extends Component {
  static navigationOptions = {
    header: null,
  };
  static propTypes = {
    navigation: PropTypes.any.required,
    order: PropTypes.any.required,
    payment: PropTypes.instanceOf(PaymentHelper).required,
    state: PropTypes.any.required,
  };

  state = {
    modalOptions: false,
    modalActive: false,
    modalRight: false,
    modalDiscount: false,
    modalDelivery: false,
    modalCustomer: false,
    modalPayment: false,
    modalInvoice: false,
    modalInvoiceCash: false,
    keyboard: false,
    paymentype: '',
    order: this.props.order,
    currentAmount: 0,
    user: realm.objectForPrimaryKey('User', 0),
  };

  componentDidMount() {
    epaisaRequest('', '/notifications/list', 'GET').then(res => {
      if (!res.success) {
        if (res.message === 'Your request was made with invalid credentials.') {
          const user = realm.objectForPrimaryKey('User', 0);
          alert_service.showAlert(
            'Login has expired, please login again',
            () => {
              user.signOut();
              NavigationService.navigate('Auth');
            }
          );
        }
      }
    });
    // const unpaid = Array.from(
    //   realm
    //     .objects(RealmPayment.schema.name)
    //     .filtered(`synced = false`)
    //     .filtered(`paying = false`)
    //     .filtered('id != "currentPayment"')
    // );
    // const unpaid_requests = unpaid.map(payment => {
    //   return payment.getRequest();
    // });
    // epaisaRequest(unpaid_requests, '/payment/offlinetransactions', 'POST')
    //   .then(unpaid_response => console.log({ unpaid_response }))
    //   .catch(unpaid_error => console.log({ unpaid_error }));
    // console.log({
    //   unpaid: unpaid.map(x => ({
    //     id: x.id,
    //     created_at: x.created_at,
    //     paymentAmount: x.paymentAmount,
    //   })),
    // });
    //mixpanel.mp.track('Main Screen');
    if (isPhone) {
      //alert(1);
      Orientation.lockToPortrait();
    } else {
      //alert(2);
      Orientation.lockToLandscape();
    }
    realm.addListener('change', () => {
      this.forceUpdate();
    });
    if (Platform.OS === 'android') {
      const permissions_needed = [
        PermissionsAndroid.PERMISSIONS.CAMERA,
        PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
      ];
      PermissionsAndroid.requestMultiple(permissions_needed)
        .then(results => {
          console.log(results);
          // alert(JSON.stringify(results));
        })
        .catch(err => console.log(err));
    }
  }
  componentDidUpdate() {
    if (this.props.payment && this.props.payment.on) {
      console.log('point10');
      this.props.payment.on('toggle_invoice', next => {
        console.log('point11', next);
        this.toggleModalInvoice(next);
      });
    }
  }
  componentWillUnmount() {
    realm.removeListener('change', () => {});
  }

  setContainerItems = data => {
    const { set_items } = this.props;
    set_items(data);
  };
  keyboard = false;

  // ACTIONS REDUX
  sumAmount = value => {
    const { sum_amo } = this.props;
    const { amount } = this.props.state;

    this.setState({
      modalOptions: false,
    });
  };
  sumTotal = amount => {
    const { sum_tot } = this.props;
    if (amount > 0) {
      sum_tot(amount);
    }
    this.setState({
      modalOptions: false,
    });
  };
  cleanTotal = () => {
    const { clear } = this.props;
    clear();
    this.setState({
      modalOptions: false,
    });
  };
  backAmount = () => {
    const { back } = this.props;
    back();
    this.setState({
      modalOptions: false,
    });
  };
  addDiscount = value => {
    const { discount } = this.props;
    discount(value);
    this.setState({
      modalDiscount: false,
    });
  };
  addDelivery = value => {
    const { delivery } = this.props;
    delivery(value);
    this.setState({
      modalDelivery: false,
    });
  };
  removeDiscount = () => {
    const { remove_discount } = this.props;
    remove_discount();
  };
  removeDelivery = () => {
    const { remove_delivery } = this.props;
    remove_delivery();
  };
  //MODALS AND DRAWERS
  closeControlPanel = () => {
    this._drawer.close();
    this.setState({
      modalOptions: false,
    });
  };
  openControlPanel = () => {
    this._drawer.open();
    this.setState({
      modalOptions: false,
    });
  };
  toggleRight = () => {
    this.setState({
      modalRight: !this.state.modalRight,
      modalOptions: false,
    });
  };
  toggleSideBar = () => {
    this.setState({
      modalActive: !this.state.modalActive,
      modalOptions: false,
    });
  };
  changeOption = value => {
    const { change } = this.props;
    change(value);
  };
  toggleModalOptions = () => {
    this.setState({
      modalOptions: !this.state.modalOptions,
    });
  };
  toggleModalDiscount = () => {
    this.setState({
      modalOptions: false,
      modalDiscount: !this.state.modalDiscount,
    });
  };
  toggleModalDelivery = () => {
    this.setState({
      modalOptions: false,
      modalDelivery: !this.state.modalDelivery,
    });
  };
  toggleModalCustomer = () => {
    this.setState({
      modalOptions: false,
      modalCustomer: !this.state.modalCustomer,
    });
  };
  toggleModalPayment = screen => {
    this.setState({
      modalPayment: !this.state.modalPayment,
      paymentype: screen,
    });
  };
  toggleModalPaymentScreen = (screen, show) => {
    this.setState(
      {
        modalPayment: show,
        paymentype: screen,
      },
      () => {
        console.log(this.state.paymentype, this.state.modalPayment);
      }
    );
  };
  toggleModalInvoice = next => {
    if (next.screen === INVOICE) {
      this.setState({
        next: next.extra || next,
        modalPayment: false,
        modalInvoice: !this.state.modalInvoice,
      });
    } else if (next.screen === 'InvoiceCash') {
      this.setState({
        next: next.extra || next,
        modalPayment: false,
        modalInvoice: !this.state.modalInvoice,
        modalInvoiceCash: !this.state.modalInvoice,
      });
    } else {
      this.setState({
        next: { ...next.extra, screen: INVOICE },
        modalPayment: true,
        paymentype: next.screen,
      });
    }
  };
  closeInvoice = next => {
    this.setState({
      modalPayment: false,
      modalInvoice: false,
      modalInvoiceCash: false,
    });
  };
  toggleUPIQR = () => {
    this.setState({
      paymentype: 'PaymentsUpiQR',
    });
  };

  addCustomer = customer => {
    this.props.order.addCustomer(customer);
    return;
  };

  verifyCustomer = val => {
    const { verify_customer } = this.props;
    verify_customer(val);
  };
  clearAmount;

  render() {
    const {
      amount,
      total_amount,
      products,
      totalDiscount,
      totalDelivery,
      type,
      customer,
      customers,
    } = this.props.state;
    const opa = this.state.modalActive || this.state.modalRight ? true : false;
    const { totalPrice } = this.state.order;
    const back = isTablet
      ? require('../../assets/images/bg/loadingBackgroundLandscape.png')
      : require('../../assets/images/bg/loadingBackground.png');
    return (
      <SafeAreaView fullscreen={true} bottom={true}>
        {/* <Text>
            CA: {typeof this.state.currentAmount} TP: {typeof totalPrice} SUM:{' '}
            {this.state.currentAmount + totalPrice}
          </Text> */}
        {isPhone ? (
          <View style={[styles.container, { height: '100%' }]}>
            <ImageBackground
              source={back}
              style={{ width: '100%', height: '100%' }}
              resizeMode={'cover'}
            >
              <CashRegisterHeader
                label={'CASH REGISTER'}
                navigation={this.props.navigation}
                cartItems={this.state.order.getItemsCount()}
                savedTransactions={
                  RealmSavedTransaction.getByUserId(this.state.user.userId)
                    .length
                }
                isTablet={isTablet}
              />

              <TotalAmount value={totalPrice} products={products} />
              <ItemsContainer
                setwallet={this.props.set_wallet}
                set_items={this.setContainerItems}
                currentAmount={this.state.currentAmount}
                disabled={() => this.state.currentAmount + totalPrice < 1}
                onClick={() => {
                  this.setState({ currentAmount: 0 });
                  this.clearAmount();
                }}
                total={totalPrice}
              />
              <Calculator
                clearAmount={x => {
                  this.clearAmount = x;
                }}
                amount={amount}
                sumAmount={this.sumAmount}
                sumTotal={this.sumTotal}
                cleanTotal={this.cleanTotal}
                backAmount={this.backAmount}
                order={this.props.order}
                onChange={amount => {
                  this.setState({ currentAmount: parseFloat(amount) });
                }}
              />
              <Footer
                customer={this.props.order.customer}
                toggleModal={this.toggleModalCustomer}
              />
              {opa ? <View style={styles.opacity} /> : null}
              {this.state.modalOptions ? (
                <ModalOptions
                  openDiscount={this.toggleModalDiscount}
                  openDelivery={this.toggleModalDelivery}
                />
              ) : null}
              <ModalDiscount
                widthModal="40%"
                active={this.state.modalDiscount}
                closeModal={this.toggleModalDiscount}
                addDiscount={this.addDiscount}
                total={totalPrice}
              />
              <ModalDelivery
                widthModal="40%"
                active={this.state.modalDelivery}
                closeModal={this.toggleModalDelivery}
                addDelivery={this.addDelivery}
              />

              <ModalCustomer
                widthModal="48%"
                active={this.state.modalCustomer}
                closeModal={this.toggleModalCustomer}
                addCustomer={this.addCustomer}
                customers={customers}
                verifyCustomer={this.verifyCustomer}
                logout={this.logout}
                list_customers={val => this.props.list_customers(val)}
              />
            </ImageBackground>
          </View>
        ) : (
          <View style={styles.containerLandscape}>
            <View style={[styles.container, { height: '100%', width: '65%' }]}>
              <ImageBackground
                source={back}
                style={{ width: '100%', height: '100%' }}
                resizeMode={'cover'}
              >
                <CashRegisterHeader
                  label={'CASH REGISTER'}
                  navigation={this.props.navigation}
                  cartItems={this.state.order.getItemsCount()}
                  savedTransactions={
                    RealmSavedTransaction.getByUserId(this.state.user.userId)
                      .length
                  }
                  isTablet={isTablet}
                />

                <ItemsContainer
                  disabled={() => this.state.currentAmount + totalPrice < 1}
                  toggleInvoice={this.toggleModalInvoice}
                  togglePayment={this.toggleModalPayment}
                  navigation={this.props.navigation}
                  setwallet={this.props.set_wallet}
                  total={totalPrice}
                  cashscreen={true}
                  currentAmount={this.state.currentAmount}
                  onClick={() => {
                    this.setState({ currentAmount: 0 });
                    this.clearAmount();
                  }}
                />
                <Calculator
                  clearAmount={x => (this.clearAmount = x)}
                  amount={amount}
                  sumAmount={this.sumAmount}
                  sumTotal={this.sumTotal}
                  cleanTotal={this.cleanTotal}
                  backAmount={this.backAmount}
                  order={this.props.order}
                  cancelTransaction={() => {
                    if (realm.isInTransaction) {
                      realm.cancelTransaction();
                    }
                  }}
                  onChange={amount => {
                    this.setState({ currentAmount: parseFloat(amount) });
                  }}
                />

                <ModalDiscount
                  isLandscape={true}
                  widthModal="50%"
                  active={this.state.modalDiscount}
                  closeModal={this.toggleModalDiscount}
                  addDiscount={this.addDiscount}
                  total={totalPrice}
                />
                <ModalDelivery
                  isLandscape={true}
                  widthModal="50%"
                  active={this.state.modalDelivery}
                  closeModal={this.toggleModalDelivery}
                  addDelivery={this.addDelivery}
                />

                <ModalCustomer
                  widthModal="60%"
                  active={this.state.modalCustomer}
                  closeModal={this.toggleModalCustomer}
                  addCustomer={this.addCustomer}
                  customers={customers}
                  verifyCustomer={this.verifyCustomer}
                  logout={this.logout}
                  list_customers={val => this.props.list_customers(val)}
                />
                <ModalCash
                  next={this.state.next}
                  isLandscape={true}
                  widthModal={isTablet ? '80%' : '69%'}
                  active={this.state.modalPayment}
                  closeModal={this.toggleModalPayment}
                  type={this.state.paymentype}
                  toggleInvoice={this.toggleModalInvoice}
                  toggleQR={this.toggleUPIQR}
                  toggleModalPaymentScreen={this.toggleModalPaymentScreen}
                />
                <ModalInvoice
                  next={this.state.next}
                  isLandscape={true}
                  widthModal="85%"
                  active={this.state.modalInvoice}
                  cash={this.state.modalInvoiceCash}
                  closeModal={this.closeInvoice}
                />
              </ImageBackground>
            </View>
            <View
              style={{
                position: 'absolute',
                right: 0,
                width: wp('35%'),
                height: '100%',
                elevation: 25,
                shadowOffset: { width: -7, height: 5 },
                shadowColor: 'rgba(0,0,0,0.5)',
                shadowOpacity: 0.5,
                shadowRadius: 10,
                backgroundColor: '#000',
              }}
            >
              <RightSideBar
                customer={customer}
                type={type}
                navigation={this.props.navigation}
                toggleModal={this.toggleModalCustomer}
                products={products}
                discount={totalDiscount}
                delivery={totalDelivery}
                subtotal={total_amount}
                actionClose={this.closeControlPanel}
                openDiscount={this.toggleModalDiscount}
                openDelivery={this.toggleModalDelivery}
                removeDiscount={this.removeDiscount}
                removeDelivery={this.removeDelivery}
                total={totalPrice}
              />
            </View>
            {opa ? <View style={styles.opacity} /> : null}
          </View>
        )}
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: colors.darkWhite,
  },
  containerLandscape: {
    flex: 1,
    height: '100%',
    flexDirection: 'row',
    backgroundColor: colors.darkWhite,
  },
  opacity: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: colors.opacityDin(0.5),
  },
  drawerRightContainer: {
    width: '100%',
    height: '100%',
    backgroundColor: 'red',
  },
  backgroundImage: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: 'red',
  },
  //TEST
});

const mapStateToProps = state => ({
  state: state.cashData,
  payment: state.payment_data.payment,
  order: state.payment_data.order,
});

const mapDispatchToProps = dispatch => ({
  sum_amo: val => {
    return dispatch(cashActions.sum_amount(val));
  },
  sum_tot: amount => {
    return dispatch(cashActions.sum_total(amount));
  },
  clear: () => {
    return dispatch(cashActions.clear_amount());
  },
  back: () => {
    return dispatch(cashActions.back_amount());
  },
  change: val => {
    return dispatch(cashActions.change_option(val));
  },
  discount: val => {
    return dispatch(cashActions.add_discount(val));
  },
  delivery: val => {
    return dispatch(cashActions.add_delivery(val));
  },
  addcustomer: val => {
    return dispatch(cashActions.add_customer(val));
  },
  verify_customer: val => {
    return dispatch(cashActions.verify_customer(val));
  },
  remove_discount: () => {
    return dispatch(cashActions.remove_discount());
  },
  remove_delivery: () => {
    return dispatch(cashActions.remove_delivery());
  },
  list_customers: val => {
    return dispatch({ type: cashConstants.LIST_CUSTOMERS, payload: val });
  },
  clear_data: () => {
    return dispatch(cashActions.clear_data());
  },
  clear_customer: () => {
    return dispatch(cashActions.clear_customer());
  },
  set_items: val => {
    return dispatch(cashActions.set_items(val));
  },
  set_wallet: val => {
    return dispatch(cashActions.set_wallet(val));
  },
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CashScreen);
