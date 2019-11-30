import React, { Component, Fragment } from 'react';
import {
  ImageBackground,
  Dimensions,
  View,
  Modal,
  NetInfo,
  Platform,
} from 'react-native';
import Header from '../cash_register/components/Header/CashRegisterHeader';
import SavedTitle from './components/SavedTitle/SavedTitle';
import Transactions from './components/Transactions/Transactions';
import { isTablet } from '../cash_register/constants/isLandscape';
import { connect } from 'react-redux';
import RightSideBar from '../cash_register/components/RightSideBar/rightSideBar';
import { getLocalSettingRow } from '../../services/settings_service';
import { cashActions } from '../cash_register/actions';
import ModalSaved from './components/ModalSaved/modalSaved';
import loading_service from '../../services/loading_service';
import realm, { createRow, getTable } from '../../services/realm_service';
import NavigationService from '../../services/navigation/index';
import * as screen_names from '../../navigation/screen_names';
import { TextMontserrat, SafeAreaView, Loading } from 'components';
import colors from '../modal_discount/styles/colors';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import ModalLogout from '../cash_register/components/Modals/ModalLogout/modalLogout';
import ButtonGradient from '../payments/screens/cash/components/transaction_details/components/buttonGradientColor/ButtonGradient';
import ModalAddHold from '../modal_customer/components/ModalAdd/modalAddHold';
import ModalCustomer from '../modal_customer/modalCustomer';
import ModalSure from './components/ModalSure/modalSure';
import { setSavedTransactions } from '../auth/actions/auth_actions';
import { epaisaRequest } from '../../services/epaisa_service';
import { setOrder } from '../payments/actions/payment_actions';
import * as _ from 'lodash';
import { handleError } from '../../factory/utils/handlerError';
import alert_service from '../../services/alert_service';
import Order from '../../services/realm_models/order';
import RealmSavedTransaction from '../../services/realm_models/realm_saved_transaction';
import { syncSavedTransactions } from '../../sync/sync_tasks';
//import mixpanel from '../../services/mixpanel';
class SavedTransactions extends Component {
  static navigationOptions = {
    header: null,
  };
  state = {
    modal: false,
    subTotal: 0,
    saved: [],
    dataProducts: [],
    totalProducts: 0,
    modalInvalid: false,
    totalDiscount: 0,
    totalDelivery: 0,
    typeDiscount: '%',
    orderId: 0,
    customer: '',
    askModal: false,
    modalCustomer: false,
    fromHoldTap: false,
    modalHold: false,
    date: 111,
    orderToDelete: '',
    modalSure: false,
    reload: false,
    order: this.props.order,
    user: realm.objectForPrimaryKey('User', 0),
  };

  async componentDidMount() {
    const connected = await NetInfo.isConnected.fetch();

    //mixpanel.track('Saved Transactions Screen');

    this.savedTransactions = RealmSavedTransaction.getByUserId(
      this.state.user.userId
    );
    try {
      this.updateElements();
    } catch (error) {
      //alert(error)
    }
    console.log(Array.from(this.savedTransactions));
    this.savedTransactions.addListener(this.listener);
    // this.update();
    // this.setState({ saved: this.savedTransactions });

    if (connected) {
      syncSavedTransactions(this.state.user);
      await this.getSavedTransactions();
    }
  }
  updateElements = () => {
    this.savedTransactions.map(item => {
      let customer = getTable('CustomerAPI').filtered(
        `phoneNumber CONTAINS[c] "${item.customerNumber}"`
      );
      console.log('ONE', customer);
      if (customer.length > 0) {
        createRow(
          'RealmSavedTransaction',
          {
            ...item,
            customerId: parseInt(customer[0].customerId),
          },
          true
        );
      }
    });
  };
  componentWillUnmount() {
    this.setState({ modal: false });
    this.savedTransactions.removeListener(this.listener);
    // this.savedTransactions.removeListener('change', () => {});
  }
  listener = (items, changes) => {
    console.log({ saved_item: items });

    const data = items.map(x => {
      if (x.localId === this.props.order.savedOrderId) {
        return { ...x, opacity: true };
      } else {
        return x;
      }
    });
    this.setState({ saved: data });
  };
  savedTransactions;
  async getSavedTransactions() {
    try {
      // loading_service.showLoading();

      const response = await epaisaRequest(
        { merchantId: this.state.user.merchantId },
        '/savedtransactions/view',
        'GET'
      );
      if (!response.success) {
        throw new Error(response.message);
      }
      console.log({
        response: response.response.map(x => ({
          totalPrice: x.totalPrice,
          orderId: x.orderId,
          userId: x.userId,
        })),
      });
      return;
      loading_service.hideLoading();
      this.state.user.updateSavedTransactions(response.response.length);
      const responseFiltered = response.response.map(x => {
        console.log({ SAVED: x.orderId, ORDER: this.props.order.savedOrderId });
        if (x.orderId === this.props.order.savedOrderId) {
          return { ...x, opacity: true };
        } else {
          return x;
        }
      });
      // this.state.user.updateSavedTransactions(responseFiltered.length);
      this.setState({ saved: responseFiltered });
    } catch (error) {
      this.setState({ loading: false }, () => {
        const errorRes = handleError(error.message);
        alert_service.showAlert(errorRes.message, errorRes.action);
      });
    }
  }
  setCustomOrder = val => {
    this.props.set_custom_order(val);
  };
  capitalizeFirstLetter = string => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  addMoreItems = () => {
    const order = realm.objectForPrimaryKey(
      'Order',
      'selected_saved_transaction'
    );
    this.props.setOrder(order);
    this.setState({ askModal: false, modal: false }, () =>
      setTimeout(() => {
        NavigationService.navigate(screen_names.CASH_REGISTER);
      }, 0)
    );
  };

  cleanOpenModal = () => {
    this.setState({ askModal: false, modal: false });
    this.props.order.removeCustomItems();
  };

  toUpperLoweCase = str => {
    let names = str.split(' ');
    names = names.map(item => {
      return item.toLowerCase();
    });

    return (
      this.capitalizeFirstLetter(names[0]) +
      ' ' +
      this.capitalizeFirstLetter(names[1])
    );
  };
  async saveCart() {
    const orderId = `currentOrder_${this.props.user.userId}`.toString();
    const order = realm.objectForPrimaryKey('Order', orderId);

    if (!order.customer) {
      this.setState({ modalCustomer: true, fromHoldTap: true });
      return false;
    } else {
      if (order.savedOrderId) {
        this.setState({ loading: true }, async () => {
          try {
            const response = await Order.voidSavedTransactions(
              order.savedOrderId
            );
            this.setState({ loading: false }, () => {
              if (!response.success) {
                //throw new Error(response.message);
              }
            });
          } catch (error) {
            // alert_service.showAlert(errorHandle.message, errorHandle.action);
            this.setState({ loading: false });
          }
        });
      }

      this.setState({ loading: true }, () => {
        order.hold(!order.savedOrderId);
        this.cleanOpenModal();

        this.setState({ loading: false }, () => {
          if (isTablet) {
            this.addMoreItems();
          }
        });
      });
      return true;
    }
  }
  beforeOpen = () => {
    let listSaved = this.state.saved.map(item => {
      let newItem = item;
      if (newItem.opacity) {
        delete newItem.opacity;
      }
      return newItem;
    });
    this.setState({ saved: listSaved });
  };
  openCheck = (val, pass) => {
    const askModal = this.props.order.customItems.length > 0 && !val;

    this.setState({
      askModal,
      modal: !pass && !isTablet,
    });
    if (!isTablet && (!askModal || pass)) {
      //this.addMoreItems();
    }
  };
  openCheckTwo = (val, pass) => {
    const askModal = this.props.order.customItems.length > 0 && !val;

    this.setState({
      askModal,
      modal: !(askModal || isTablet),
    });
    if (isTablet && (!askModal || pass)) {
      this.addMoreItems();
    }
  };
  render() {
    const {
      total_amount,
      products,
      totalDiscount,
      totalDelivery,
      type,
      customer,
      customers,
    } = this.props.state;
    console.log(this.state.saved);
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
    let FinalDiscount =
      type == '%'
        ? (subTotalDiscount * parseFloat(totalDiscount)) / 100
        : parseFloat(totalDiscount);
    let Total =
      parseFloat(subTotalDiscount) -
      parseFloat(FinalDiscount) +
      parseFloat(totalDelivery); //+
    //parseFloat(CGST);
    // console.log(getLocalSettingRow('Transaction','RoundOff'))
    if (
      getLocalSettingRow('Transaction', 'RoundOff') == true ||
      getLocalSettingRow('Transaction', 'RoundOff') == 1
    ) {
      Total = parseInt(Total.toFixed(0));
    }
    //const opa = this.state.modalActive || this.state.modalRight ? true : false;
    //console.log(this.state.dataProducts)
    const back = isTablet
      ? require('../../assets/images/bg/loadingBackgroundLandscape.png')
      : require('../../assets/images/bg/loadingBackground.png');
    return (
      <SafeAreaView fullscreen={true} bottomColor={colors.darkWhite}>
        <ImageBackground
          source={back}
          style={{
            flex: 1,
            backgroundColor: colors.darkWhite,
          }}
        >
          <View
            style={[isTablet ? { flexDirection: 'row', height: '100%' } : null]}
          >
            <View
              style={{
                height: '100%',
                width: Dimensions.get('window').width * (isTablet ? 0.65 : 1),
              }}
            >
              <Header
                label={`CASH REGISTER`}
                navigation={this.props.navigation}
                cartItems={this.state.order.getItemsCount()}
                savedTransactions={
                  RealmSavedTransaction.getByUserId(this.state.user.userId)
                    .length
                }
                isTablet={isTablet}
              />
              <SavedTitle />

              <Transactions
                openTransaction={this.toggleModalTransaction}
                voidTransaction={orderId => {
                  this.setState({ orderToDelete: orderId, modalSure: true });
                }}
                removeItem={order => {
                  // alert(JSON.stringify(this.state.saved[0].orderId));
                  /*const saved = this.state.saved.filter(order => {
                    return order.orderId !== orderId;
                  });
                  this.setState(
                    {
                      saved,
                    },
                    () => {*/
                  this.setState({
                    orderToDelete: order,
                    modalSure: true,
                  });
                  //}
                  //);
                }}
                openDetails={this.openCheckTwo}
                data={this.state.saved}
              />

              <ModalSaved
                orderId={this.state.orderId}
                subTotalDiscount={this.state.subTotal}
                FinalDiscount={this.state.totalDiscount}
                totalDelivery={this.state.totalDelivery}
                discountType={this.state.typeDiscount}
                CGST={0}
                date={this.state.date}
                Total={this.state.totalProducts}
                products={this.state.dataProducts}
                active={this.state.modal}
                customer={this.state.customer}
                addMore={() => {
                  this.addMoreItems();
                }}
                closeModal={callback =>
                  this.setState({ modal: false }, () => {
                    if ((typeof callback).toString() == 'function') {
                      callback();
                    }
                  })
                }
              />
              <Modal
                visible={this.state.askModal}
                onRequestClose={() => {
                  this.setState({ askModal: false });
                }}
                animationType="fade"
                transparent={true}
              >
                <View
                  style={{
                    width: '100%',
                    flex: 1,
                    alignItems: 'center',
                    backgroundColor: 'rgba(0,0,0,0.6)',
                    justifyContent: 'center',
                  }}
                >
                  <View
                    style={{
                      justifyContent: 'center',
                      alignItems: 'center',
                      borderRadius: hp('1%'),
                      width: isTablet ? '40%' : '80%',
                      paddingVertical: hp('4%'),
                      backgroundColor: 'white',
                      elevation: 6,
                    }}
                  >
                    <TextMontserrat
                      style={{
                        color: 'rgba(0,0,0,0.7)',

                        fontSize: isTablet ? hp('3.5') : wp('4.8%'),
                        fontWeight: '600',
                      }}
                    >
                      Do you want to save
                    </TextMontserrat>
                    <TextMontserrat
                      style={{
                        color: 'rgba(0,0,0,0.7)',
                        fontSize: isTablet ? hp('3.5%') : wp('4.8%'),
                        fontWeight: '600',
                      }}
                    >
                      the changes in the cart?
                    </TextMontserrat>
                    <View
                      style={{
                        flexDirection: 'row',
                        marginTop: hp('3%'),
                        width: '80%',
                        justifyContent: 'space-between',
                      }}
                    >
                      <View style={{ width: '48%' }}>
                        <ButtonGradient
                          onPress={() => {
                            this.setState({ askModal: false }, async () => {
                              let pass = await this.saveCart();
                              //alert(pass);
                              this.openCheck(true, !pass);
                            });
                          }}
                          heightB={true}
                          radius={hp('2%')}
                          firstColor={'#114B8C'}
                          secondColor={'#0079AA'}
                          title={'YES'}
                        />
                      </View>
                      <View style={{ width: '48%' }}>
                        <ButtonGradient
                          onPress={() => {
                            if (isTablet) {
                              this.addMoreItems();
                            } else {
                              this.cleanOpenModal();
                              this.openCheck();
                            }
                          }}
                          heightB={true}
                          radius={hp('2%')}
                          firstColor={'#114B8C'}
                          secondColor={'#0079AA'}
                          title={'NO'}
                        />
                      </View>
                    </View>
                  </View>
                </View>
              </Modal>
            </View>
            <ModalAddHold
              addCustomer={val => {
                this.props.addcustomer(val);
                this.holdAction();
                //setTimeout(()=>,1000);
              }}
              holdAction={this.onHoldPress}
              active={this.state.modalHold}
              closeModal={() => this.setState({ modalHold: false })}
            />
            <ModalCustomer
              widthModal="48%"
              active={this.state.modalCustomer}
              closeModal={() => {
                this.setState({ modalCustomer: false });
              }}
              customers={customers}
              holdWithCustomer={async customer => {
                this.setState({ loading: true }, async () => {
                  const order = this.props.order;
                  order.addCustomer(customer);
                  try {
                    await this.saveCart();

                    this.setState({ loading: false }, () => {
                      this.beforeOpen();
                      this.openCheck();
                      if (isTablet) {
                        this.addMoreItems();
                      }
                    });
                  } catch (error) {
                    this.setState({ loading: false }, () => {
                      alert_service.showAlert(error);
                    });
                  }
                });
              }}
              addCustomer={customer => {
                this.props.order.addCustomer(customer);
              }}
              logout={this.logout}
              list_customers={val => this.props.list_customers(val)}
              fromHoldTap={this.state.fromHoldTap}
              actionFromHold={customer => alert(JSON.stringify(customer))}
            />
            <ModalSure
              active={this.state.modalSure}
              closeModal={() => {
                this.setState({ modalSure: false });
              }}
              handleYes={() => {
                /* this.handleVoid(this.state.orderToDelete); */
                const saved = this.state.saved.filter(order => {
                  return order.localId !== this.state.orderToDelete;
                });
                this.setState({
                  saved,
                });
                RealmSavedTransaction.setPaid(this.state.orderToDelete);
                //this.state.orderToDelete.remove();
                this.setState({ orderToDelete: '', modalSure: false });
              }}
              handleNo={() => {
                this.setState({ orderToDelete: '', modalSure: false });
              }}
            />
            {isTablet ? (
              <View style={{ flex: 1 }}>
                <View
                  style={{
                    elevation: 30,
                    position: 'absolute',
                    height: '100%',
                    width: '100%',
                    shadowOffset: { width: 5, height: 5 },
                    shadowColor: 'grey',
                    shadowOpacity: 0.5,
                    shadowRadius: 10,
                    backgroundColor: 'white',
                  }}
                />
                <View
                  style={{
                    elevation: 30,
                    position: 'absolute',
                    height: '100%',
                    width: '100%',
                    backgroundColor: 'white',
                  }}
                />
                <View
                  style={{
                    elevation: 30,
                    position: 'absolute',
                    height: '100%',
                    width: '100%',
                    backgroundColor: 'white',
                    shadowOffset: { width: -7, height: 5 },
                    shadowColor: 'rgba(0,0,0,0.5)',
                    shadowOpacity: 0.5,
                    shadowRadius: 10,
                  }}
                />
                <RightSideBar
                  customer={customer}
                  type={type}
                  toggleModal={this.toggleModalCustomer}
                  products={[]}
                  discount={totalDiscount}
                  delivery={totalDelivery}
                  subtotal={total_amount}
                  actionClose={this.closeControlPanel}
                  openDiscount={this.toggleModalDiscount}
                  openDelivery={this.toggleModalDelivery}
                  removeDiscount={this.removeDiscount}
                  removeDelivery={this.removeDelivery}
                  total={Total}
                />
              </View>
            ) : null}
            <ModalLogout
              active={this.state.modalInvalid}
              closeModal={() => {
                this.setState({ modalInvalid: false });
              }}
            />
          </View>
          {this.state.loading && <Loading />}
        </ImageBackground>
      </SafeAreaView>
    );
  }
}

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
  set_products: val => {
    return dispatch(cashActions.set_products(val));
  },
  set_ntransactions: val => {
    return dispatch(cashActions.set_ntransactions(val));
  },
  set_custom_order: val => {
    return dispatch(cashActions.set_custom_order(val));
  },
  has_changes: val => {
    return dispatch(cashActions.has_changes(val));
  },
  setSavedTransactions: val => {
    return dispatch(setSavedTransactions(val));
  },
  setOrder: order => dispatch(setOrder(order)),
});
const mapStateToProps = state => ({
  state: state.cashData,
  user: state.auth.user,
  order: state.payment_data.order,
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SavedTransactions);
