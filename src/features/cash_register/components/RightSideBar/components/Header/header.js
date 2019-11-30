//import liraries
import React, { Component } from 'react';
import { View, StyleSheet, TouchableWithoutFeedback, Keyboard } from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import UsernameContainer from './components/usernameContainer';
import OptionsContainer from './components/optionsContainer';
// create a component
class Header extends Component {
  render() {
    const {
      customer,
      actionClose,
      openDiscount,
      openDelivery,
      toggleModal,
      clearData,
      disable,
      disableClear,
      totalCustomers,
      temporaly,
      tempCustomer
    } = this.props;
    const customerNumber = 'Customer';

    return (
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <View style={styles.container}>
          <UsernameContainer
            temporaly={temporaly}
            toggleModal={toggleModal}
            customer={customer}
            customerNumber={customerNumber}
          />
          <OptionsContainer
            tempCustomer={tempCustomer}
            temporaly={temporaly}
            customer={customer}
            actionClose={actionClose}
            openDiscount={openDiscount}
            openDelivery={openDelivery}
            clearData={clearData}
            disable={disable}
            disableClear={disableClear}
            order={this.props.order}
          />
        </View>
      </TouchableWithoutFeedback>
    );
  }
}

// define your styles
const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: hp('13.6%'),
    flexDirection: 'row',
    borderBottomWidth: hp('0.15%'),
    elevation: hp('1.4%'),
    backgroundColor: '#5D6770',
  },
});

//make this component available to the app
export default Header;
