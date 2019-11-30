import React, { Component, Fragment } from 'react';
import {
  Keyboard,
  Dimensions,
  View,
  StyleSheet,
  AsyncStorage,
  SafeAreaView,
  ImageBackground,
  TouchableWithoutFeedback,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import Header from './components/Header/header';
import BackgroundImage from './components/BackgroundImage/backgroundImage';
import Table from './components/Table/table';
import Footer from './components/Footer/footer';
import { connect } from 'react-redux';
import ModalDiscount from '../../../modal_discount/modalDiscount';
import ModalDelivery from '../../../modal_delivery/modalDelivery';
import ModalCustomer from '../../../modal_customer/modalCustomer';
import { cashActions } from '../../actions';
import { isTablet } from '../../constants/isLandscape';
import { PAYMENTS_CHECKOUT } from 'navigation/screen_names';

import { cashConstants } from '../../constants/actions';
import { CASH_REGISTER } from '../../../../navigation/screen_names';

import realm from '../../../../services/realm_service';
// import Order from '../../../../factory/order';
import { transactionRequest } from '../../../../factory/utils/TransactionService';
import loading_service from '../../../../services/loading_service';
import ModalAddHold from '../../../modal_customer/components/ModalAdd/modalAddHold';

import { voidSavedTransactions } from '../../../login/services/user_service';
import { setPayment } from '../../../payments/actions/payment_actions';
import { setSavedTransactions } from '../../../auth/actions/auth_actions';
import alert_service from '../../../../services/alert_service';
import Order from '../../../../services/realm_models/order';
import { handleError } from '../../../../factory/utils/handlerError';
import colors from '../../../invoice/styles/colors';

// create a component

const isPortrait = () => {
  const dim = Dimensions.get('window');
  if (dim.height >= dim.width) {
    return true;
  } else {
    return false;
  }
};

class RightSideBar extends Component {
  constructor(props) {
    super(props);
    if (this.props.rightSideBarRef) this.props.rightSideBarRef(this);
  }
  state = {
    modalDiscount: false,
    modalDelivery: false,
    modalCustomer: false,
    modalHold: false,
    fromHoldTap: false,
    TotalFixed: 0,
    orientation: isPortrait(),
    totalCustomers: 0,
    taxesGroup: this.props.order.calculateTaxes().taxesGroup,
    order: this.props.order,
    calcs: this.props.order.calculateTaxes(),
    user: realm.objectForPrimaryKey('User', 0),
    refunded: false,
  };
  componentDidMount() {
    AsyncStorage.getItem('totalCustomers').then(v => {
      this.setState({ totalCustomers: +v });
    });

    realm.addListener('change', () => {
      setTimeout(() => {
        this.setState({
          taxesGroup: this.props.order.calculateTaxes().taxesGroup,
        });
      }, 0);
    });
  }

  _keyboardDidShow() {
    keyboard = true;
  }

  _keyboardDidHide() {
    keyboard = false;
  }
  closeDrawer = () => {
    this.props.navigation.toggleRightDrawer();
  };
  closeRightDrawer = () => {
    this.props.navigation.closeRightDrawer();
    this.props.navigation.navigate(CASH_REGISTER);
  };
  toggleModalDiscount = () => {
    this.setState({
      modalDiscount: !this.state.modalDiscount,
    });
  };

  toggleModalDelivery = () => {
    this.setState({
      modalDelivery: !this.state.modalDelivery,
    });
  };

  onPayPress = () => {
    new Promise((resolve, reject) => {
      this.props.setPayment({});
      this.props.navigation.closeRightDrawer();
      resolve(true);
    }).then(res => {
      if (res)
        setTimeout(
          () => this.props.navigation.navigate(PAYMENTS_CHECKOUT),
          100
        );
    });
  };
  capitalizeFirstLetter = string => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };
  toUpperLoweCase = str => {
    let names = str.split(' ');
    names = names.map(item => {
      return item.toLowerCase();
    });
    /*let newName= str.map(item=>{
      return(item[0].toUpperCase+item)
    })*/

    return (
      this.capitalizeFirstLetter(names[0]) +
      ' ' +
      this.capitalizeFirstLetter(names[1])
    );
  };
  changedjdjd = () => {
    this.setState({ refunded: false });
  };
  saveTransactionAction = () => {};
  onHoldPress = async val => {
    const customer = this.props.order.customer;
    // alert(JSON.stringify(currentOrder.customer));
    // return;
    if (!customer) {
      //this.setState({modalHold:true})
      this.setState({
        modalCustomer: true,
        fromHoldTap: true,
        TotalFixed: val,
      });
      // if (!isTablet) this.closeRightDrawer();
    } else {
      this.setState({ modalHold: false });
      // loading_service.showLoading();
      // if (this.props.order.savedOrderId) {
      //   // loading_service.showLoading();
      //   try {
      //     // const orderSaved = realm.objectForPrimaryKey(
      //     //   'RealmSavedTransaction',
      //     //   this.props.order.savedOrderId
      //     // );
      //     // const response = await Order.voidSavedTransactions(
      //     //   orderSaved.orderId
      //     // );
      //     // if (!response.success) {
      //     //   throw new Error(response.message);
      //     // }
      //     // loading_service.hideLoading();
      //   } catch (error) {
      //     const errorHandle = handleError(error.message);
      //     console.log(error);
      //     if (errorHandle.message != '') {
      //       alert_service.showAlert(errorHandle.message, errorHandle.action);
      //     }
      //     loading_service.hideLoading();
      //   }
      // }
      // loading_service.hideLoading();
      this.props.order.hold(!this.props.order.savedOrderId);
      this.props.order.removeCustomItems();
      if (!isTablet) this.closeRightDrawer();
    }
  };
  toggleModalCustomer = () => {
    this.setState({
      modalCustomer: !this.state.modalCustomer,
      fromHoldTap: false,
    });
  };
  logout = async () => {
    try {
      await AsyncStorage.removeItem('user', error => {
        if (error) {
          throw new Error(error);
        }
      });
      this.props.clear_data();
      this.props.clear_customer();
      // let realm = new Realm({ schema: [Product, Extra] });
      realm.write(() => {
        let allProducts = realm.objects('Product');
        realm.delete(allProducts);
        let extras = realm.objects('Extra');
        extras[0].discount = '0';
        extras[0].delivery = '0';
        extras[0].option = '0';
        extras[0].type = '%';
      });
      this.props.navigation.navigate('Auth');
    } catch (error) {
      console.log(error);
    }
  };

  _closeModalCustomer = () => {
    this.setState({ modalHold: false });
  };

  render() {
    const {
      customers,
      products,
      total_amount,
      totalDiscount,
      totalDelivery,
      type,
      productsTemp,
      handleFilter,
      tempCustomer,
    } = this.props;
    const isLandscape = isTablet;
    const width = isLandscape ? '100%' : null;
    const customer = tempCustomer || this.state.order.customer;
    const content = (
      <View style={[styles.drawerRightContainer, { width }]}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
          <ImageBackground
            source={
              require('./assets/background_cart_portrait_L.png')
              // this.state.orientation
              //   ? require('../../../../assets/images/bg/background_cart_p.png')
              // : require('../../../../assets/images/bg/background_cart_l.png')
            }
            style={{ flex: 1 }}
            resizeMode={'cover'}
          >
            {/* <BackgroundImage
            //source={require('./assets/side_nav_portrait_faded.png')}
            source={
              this.state.orientation
                ? require('../../../../assets/images/bg/background_cart_p.png')
                : require('../../../../assets/images/bg/background_cart_l.png')
            }
          /> */}
            <Header
              tempCustomer={tempCustomer}
              toggleModal={this.toggleModalCustomer}
              customer={customer}
              totalCustomers={this.state.user.totalCustomers}
              actionClose={this.closeDrawer}
              openDiscount={this.toggleModalDiscount}
              openDelivery={this.toggleModalDelivery}
              openCustomer={this.toggleModalCustomer}
              temporaly={this.props.temporaly}
              clearData={() => {
                this.props.clear_data();
                this.props.clear_customer();
              }}
              disableClear={
                this.state.order.customItems.length == 0 && customer == null
              }
              disable={!(this.state.order.totalPrice >= 1)}
              order={this.state.order}
            />
            <Table
              temporaly={this.props.temporaly}
              products={this.props.temporaly ? productsTemp : products}
              actionClose={this.closeRightDrawer}
              order={
                this.props.temporaly
                  ? { customItems: productsTemp }
                  : this.state.order
              }
            />
            <Footer
              refunded={this.state.refunded}
              changeRefund={val => {
                this.setState({ refunded: val });
              }}
              changeTransaction={this.props.changeTransaction}
              allDataofTransaction={this.props.allDataofTransaction}
              active={this.props.active}
              products={products}
              discount={totalDiscount}
              delivery={totalDelivery}
              subtotal={total_amount}
              type={type}
              handleFilter={handleFilter}
              temporaly={this.props.temporaly}
              removeDiscount={this.props.removeDiscount}
              removeDelivery={this.props.removeDelivery}
              onPayPress={this.onPayPress}
              onHoldPress={this.onHoldPress}
              order={this.state.order}
              taxesGroup={this.state.taxesGroup}
            />
          </ImageBackground>
        </TouchableWithoutFeedback>
        {/*<ModalAddHold
          addCustomer={val => {
            this.props.addcustomer(val);
            this.onHoldPress(this.state.TotalFixed);
            //setTimeout(()=>,1000);
          }}
          holdAction={this.onHoldPress}
          active={this.state.modalHold}
          closeModal={this._closeModalCustomer}
        />*/}
        <ModalDiscount
          widthModal={isTablet ? '46%' : '40%'}
          active={this.state.modalDiscount}
          closeModal={this.toggleModalDiscount}
          order={this.state.order}
          total={this.state.order.subTotal}
        />
        <ModalDelivery
          widthModal={isTablet ? '46%' : '40%'}
          active={this.state.modalDelivery}
          closeModal={this.toggleModalDelivery}
          order={this.state.order}
        />
        <ModalCustomer
          widthModal="48%"
          active={this.state.modalCustomer}
          closeModal={this.toggleModalCustomer}
          holdWithCustomer={async customer => {
            //loading_service.showLoading();
            const order = this.props.order;
            order.addCustomer(customer);
            try {
              await order.hold();
              if (!isTablet) {
                this.props.navigation.toggleRightDrawer();
              }
              order.removeCustomItems();
              //loading_service.hideLoading();
            } catch (error) {
              //loading_service.hideLoading();
              alert_service.showAlert('Error while holding transaction');
            }
          }}
          addCustomer={customer => {
            this.props.order.addCustomer(customer);
          }}
          customers={customers}
          logout={this.logout}
          list_customers={val => this.props.list_customers(val)}
          fromHoldTap={this.state.fromHoldTap}
          actionFromHold={() => this.onHoldPress(this.state.TotalFixed)}
        />
      </View>
    );
    return isTablet ? (
      content
    ) : (
      <Fragment>
        <SafeAreaView style={{ flex: 0, backgroundColor: '#5D6770' }} />

        <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
          {content}
        </SafeAreaView>
      </Fragment>
    );
  }
}

// define your styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#2c3e50',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 12,
    },
    shadowOpacity: 0.58,
    shadowRadius: 16.0,

    elevation: 20,
  },
  shadowBox: {
    height: '100%',
    width: '100%',
    backgroundColor: '#000000',
    flexDirection: 'column',
    position: 'absolute',
    top: 0,
    left: -9,
    borderRadius: hp('1.4%'),
    opacity: 0.1,
  },
  drawerRightContainer: {
    flexDirection: 'column',
    //height: '100%',
    //height: Dimensions.get('window').height - StatusBar.height,
    //height:hp('100%'),
    elevation: 31,
    flex: 1,
    justifyContent: 'center',
    //backgroundColor: '#5D6770',
    backgroundColor: '#fff',
  },
});

//make this component available to the app
const mapStateToProps = state => ({
  ...state.cashData,
  order: state.payment_data.order,
  user: state.auth.user,
});
const dispatchActionsToProps = dispatch => ({
  discount: val => {
    return dispatch(cashActions.add_discount(val));
  },
  delivery: val => {
    return dispatch(cashActions.add_delivery(val));
  },
  removeDelivery: () => {
    return dispatch(cashActions.remove_delivery());
  },
  removeDiscount: () => {
    return dispatch(cashActions.remove_discount());
  },
  addcustomer: val => {
    return dispatch(cashActions.add_customer(val));
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
  setSavedTransactions: val => {
    return dispatch(setSavedTransactions(val));
  },
  setPayment: payment => {
    return dispatch(setPayment(payment));
  },
});
export default connect(
  mapStateToProps,
  dispatchActionsToProps
)(RightSideBar);
