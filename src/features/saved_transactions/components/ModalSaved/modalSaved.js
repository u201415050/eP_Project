import React, { Component } from 'react';
import { View, StyleSheet, Modal } from 'react-native';

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

import CardWithHeader from '../../../cash_register/components/cards/card_header';
import colors from '../../../invoice/styles/colors';
import { isTablet } from '../../constants/isLandscape';
import TransactionDetails from '../../../payments/components/transaction_details/transaction_details';
import ButtonGradient from '../../../payments/screens/card/components/transaction_details/components/buttonGradientColor/ButtonGradient';
import { TextMontserrat } from 'components';
import ItemsContainer from '../../../cash_register/components/ItemsContainer/itemsContainer';
import realm from '../../../../services/realm_service';
class ModalSaved extends Component {
  state = {
    optionsActive: false,
    optionSelected: 1,
    valueDiscount: 0,
    inputFocus: false,
    wrong: false,
    order:
      realm.objectForPrimaryKey('Order', 'selected_saved_transaction') || {},
  };

  render() {
    const { active, closeModal, addMore, customer } = this.props;

    return (
      <Modal
        visible={active}
        transparent={true}
        animationType="fade"
        onRequestClose={closeModal}
      >
        <View style={styles.container}>
          <CardWithHeader
            sizeHeaderLabel={isTablet ? '3.5%' : '3%'}
            customBodyStyle={{ alignItems: 'center', justifyContent: 'center' }}
            headerTitle="Customer Cart"
            closeButton={true}
            onPressCloseButton={closeModal}
            customHeaderStyle={{ height: hp('7%') }}
            customCardStyle={{ width: wp('95%') }}
          >
            <View style={styles.wrapper}>
              <TransactionDetails
                order={realm.objectForPrimaryKey(
                  'Order',
                  'selected_saved_transaction'
                )}
                data={{ products: [], date: new Date() }}
                custom={true}
                customer={
                  this.state.order.customer
                    ? this.state.order.customer.name
                    : ''
                }
              />
              <View style={{ width: '100%', marginTop: hp('2%') }}>
                <ButtonGradient
                  radius={true}
                  onPress={() => {
                    addMore();
                  }}
                  firstColor={'#114B8C'}
                  secondColor={'#0079AA'}
                  title="ADD MORE ITEMS"
                />
              </View>
              <TextMontserrat
                style={{
                  fontSize: hp('2.5%'),
                  fontWeight: '800',
                  color: 'black',
                  opacity: 0.65,
                  marginVertical: hp('2%'),
                }}
              >
                OR
              </TextMontserrat>
              <View style={{ width: '100%', height: hp('15.3%') }}>
                <ItemsContainer
                  paytop={true}
                  disabled={() => false}
                  setOrder={this.state.order.savedOrderId}
                  onClick={closeModal}
                  customerId={customer.id}
                  orderId={'selected_saved_transaction'}
                  customFunc={true}
                  navParams={{ saved: true }}
                />
              </View>
            </View>
          </CardWithHeader>
        </View>
      </Modal>
    );
  }
}

// define your styles
const styles = StyleSheet.create({
  container: {
    width: '100%',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.opacityDin(0.6),
  },
  wrapper: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingHorizontal: hp('1%'),
    backgroundColor: 'white',
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
    paddingVertical: hp('2%'),
  },
  rowForm: {
    width: '130%',
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: '#174285',
    borderBottomWidth: 2,
  },
  leftForm: {
    flexDirection: 'row',
    width: '30%',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  separation: {
    borderColor: '#174285',
    borderRightWidth: 2,
    height: '100%',
  },
  rightForm: {
    width: '70%',
    flexDirection: 'row',
    alignItems: 'center',
  },
  drop: {
    marginRight: hp('0.6%'),
  },
  select: {
    textAlign: 'center',
    fontSize: wp('4.4%'),
    marginLeft: 10,
    color: '#174285',
    fontFamily: 'Montserrat-SemiBold',
    marginBottom: 5,
  },
  icon: {
    position: 'absolute',
    right: 4,
  },
  textInput: {
    paddingVertical: 0,
    color: '#174285',
    paddingLeft: wp('6%'),
    fontSize: hp('2.8%'),
    width: '80%',
    marginBottom: 5,
    fontFamily: 'Montserrat-Bold',
  },
  textDiscountAddButtonPortrait: {
    fontFamily: 'Montserrat-SemiBold',
    color: 'white',
    fontSize: hp('1.95%'),
    letterSpacing: 1.33,
    textAlign: 'center',
  },
  touchableModalDiscountAdd: {
    width: '130%',
    height: hp('6.25%'),
    marginTop: hp('5%'),
    borderRadius: 50,
    marginBottom: hp('3%'),
    alignItems: 'center',
  },
  dropdown: {
    position: 'absolute',
    width: '30%',
    elevation: 20,
    top: 0,
    left: 0,
    borderLeftColor: colors.opacityDin(0.1),
    borderRightColor: colors.opacityDin(0.3),
    borderBottomColor: colors.opacityDin(0.3),
    borderWidth: 1,
  },
  option: {
    textAlign: 'center',
    fontSize: hp('2.5%'),
    paddingVertical: hp('1.1%'),
    backgroundColor: '#FAFAFA',
    fontFamily: 'Montserrat-ExtraBold',
  },
  messageWrong: {
    width: '100%',
    position: 'absolute',
    top: 2,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  messageWrongLabel: {
    fontSize: hp('1.5'),
    color: '#D0021B',
    flexWrap: 'wrap',
    fontFamily: 'Montserrat-SemiBold',
    textAlign: 'center',
    justifyContent: 'center',
    marginTop: hp('0.2%'),
  },
});

export default ModalSaved;
