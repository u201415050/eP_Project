import React, { Component } from 'react';
import {
  Dimensions,
  View,
  Text,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
  TouchableHighlight,
  TouchableWithoutFeedback,
  Image,
  Modal,
  Keyboard,
  TextInput,
  ScrollView,
  BackHandler,
  Platform,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import LinearGradient from 'react-native-linear-gradient';
import DeviceInfo from 'react-native-device-info';
//import ItemsContainer from '../../../../cash_register/components/ItemsContainer/itemsContainer'
import PaymentMethods from '../../PaymentMethods/itemsTransactions';
import TransactionStatus from '../../TransactionStatus/transactionStatus';
import Amount from '../../Amount/itemsTransactions';
import Employee from '../../Employee/listEmployee';

import { TextMontserrat } from 'components';
import colors from '../../../../account_created/styles/colors';
import { CardWithHeader } from '../../../../cash_register/components/cards';
import { moderateScale } from '../../../../modal_delivery/constants/util/scaling';
import { isTablet } from '../../../../modal_customer/constants/isLandscape';
import loading_service from '../../../../../services/loading_service';

class ModalTransaction extends Component {
  state = {
    optionsActive: false,
    optionSelected: 1,
    valueDiscount: 0,
    inputFocus: false,
    wrong: false,
  };
  render() {
    const {
      userData,
      filter,
      active,
      closeModal,
      isLandscape,
      modifyLimits,
      coord,
      toggleFilters,
      offFilters,
      addPayFilter,
      addEmployeeFilter,
    } = this.props;
    const model =
      DeviceInfo.getModel()
        .toUpperCase()
        .indexOf('X') != -1;

    return (
      <Modal visible={active} transparent={true} onRequestClose={closeModal}>
        <View style={styles.container}>
          <TouchableOpacity
            onPress={closeModal}
            style={{ width: '100%', height: '100%' }}
          />
          <TouchableOpacity
            onPress={closeModal}
            style={{
              position: 'absolute',
              top: coord.y - hp('1%'),
              left: coord.x - hp('1%'),
              padding: hp('1%'),
              backgroundColor: 'white',
              borderRadius: hp('2.5%'),
            }}
          >
            <Image
              source={require('../../../assets/img/setti.png')}
              style={{
                width: hp('2.5%'),
                height: hp('2.5%'),
                tintColor: 'black',
              }}
            />
          </TouchableOpacity>
          <Image
            source={require('../../../assets/img/triangle.png')}
            resizeMode="stretch"
            style={{
              position: 'absolute',
              top: coord.y + hp('3.2%'),
              left: coord.x - hp('0.75%'),
              width: hp('4%'),
              height:
                (Platform.OS === 'ios' ? (model ? 60 : 40) : 0) +
                hp('9%') -
                (coord.y + hp('2%')),
            }}
          />
          <CardWithHeader
            noheader={true}
            isLandscape={isLandscape}
            sizeHeaderLabel={isLandscape ? '3.5%' : '3%'}
            customBodyStyle={{ alignItems: 'center', justifyContent: 'center' }}
            //headerTitle="AMOUNT"
            closeButton={true}
            onPressCloseButton={closeModal}
            // customCardHeaderText={{fontSize: hp('2%'), color: "#47525d", marginRight:hp('35%'),letterSpacing: 1.2,fontWeight:'600'}}
            customCardHeader={{ borderColor: 'white' }}
            customCardStyle={{
              position: 'absolute',
              marginLeft: isTablet ? coord.x - wp('42.8%') : 0,
              width: isTablet ? wp('55%') : wp('96%'),
              height: hp('80%'),
              marginTop:
                Platform.OS === 'ios'
                  ? hp('7%') + coord.y
                  : hp('9%') + hp('2%'),
            }}
          >
            <View style={styles.wrapper}>
              <TouchableWithoutFeedback
                onPress={Keyboard.dismiss}
                accessible={false}
              >
                <ScrollView
                  keyboardShouldPersistTaps="always"
                  showsVerticalScrollIndicator={false}
                  style={{ width: '100%', height: '100%' }}
                  contentContainerStyle={{ alignItems: 'center' }}
                >
                  <Amount filter={filter[0]} modifyLimits={modifyLimits} />
                  <PaymentMethods
                    ref={x => (this.paymentsMethods = x)}
                    filter={filter[2]}
                    addPayFilter={addPayFilter}
                  />
                  <TransactionStatus
                    ref={x => (this.statusList = x)}
                    filter={filter[1]}
                    addStatusFilter={this.props.addStatusFilter}
                  />
                  <Employee
                    userData={userData}
                    ref={x => (this.employeesList = x)}
                    employees={this.props.employees}
                    addEmployeeFilter={addEmployeeFilter}
                    filter={filter[3]}
                  />

                  <View style={styles.RowButtons}>
                    <TouchableOpacity
                      onPress={() => {
                        offFilters();
                        closeModal();
                      }}
                      style={styles.touchableModalTransactionAdd}
                    >
                      <LinearGradient
                        colors={['white', 'white']}
                        start={{ x: 0, y: 1 }}
                        end={{ x: 1, y: 1 }}
                        style={{
                          borderColor: '#0079AA',
                          borderWidth: 1.2,
                          borderRadius: 10,
                          alignItems: 'center',
                          width: '100%',
                          elevation: 2,
                          zIndex: -1,
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
                          <Text style={styles.textClearButton}>CLEAR</Text>
                        </View>
                      </LinearGradient>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => {
                        this.paymentsMethods.updateData();
                        this.statusList.updateData();
                        this.employeesList.updateData();
                        //toggleFilters()
                        closeModal();
                        //loading_service.showLoading();
                        setTimeout(() => {
                          this.props.handleFilter();
                          //loading_service.hideLoading()
                        }, 1000);
                      }}
                      style={styles.touchableModalTransactionAdd}
                    >
                      <LinearGradient
                        colors={['#174285', '#0079AA']}
                        start={{ x: 0, y: 1 }}
                        end={{ x: 1, y: 1 }}
                        style={{
                          borderRadius: 10,
                          alignItems: 'center',
                          width: '100%',
                          elevation: 2,
                          zIndex: -1,
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
                          <Text style={styles.textApplyButton}>APPLY</Text>
                        </View>
                      </LinearGradient>
                    </TouchableOpacity>
                  </View>
                  <View style={{ height: hp('1%') }} />
                </ScrollView>
              </TouchableWithoutFeedback>
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
    height: '100%',
    alignItems: 'center',
    justifyContent: 'flex-start',
    backgroundColor: colors.opacityDin(0.6),
    elevation: 2,
  },
  wrapper: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: hp('1.5%'),
    marginTop: hp('2%'),
  },
  RowButtons: {
    width: '100%',
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  textApplyButton: {
    fontFamily: 'Montserrat-SemiBold',
    color: 'white',
    fontSize: hp('1.95%'),
    letterSpacing: 1.33,
    textAlign: 'center',
  },
  textClearButton: {
    fontFamily: 'Montserrat-SemiBold',
    color: '#174285',
    fontSize: hp('1.95%'),
    letterSpacing: 1.33,
    textAlign: 'center',
  },
  touchableModalTransactionAdd: {
    width: '45%',
    height: hp('6.25%'),
    marginTop: hp('2%'),
    borderRadius: 50,
    marginBottom: hp('1%'),
    alignItems: 'center',
  },
});

const styless = StyleSheet.create({
  container: {
    width: '100%',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.opacityDin(0.6),
  },
  wrapper: {
    width: '90%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: hp('6%'),
    marginTop: hp('2%'),
  },
  card: {
    borderWidth: 0.2,
    borderRadius: 2,
    borderColor: '#ddd',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.7,
    shadowRadius: 2,
    elevation: 2,
    alignItems: 'center',
    width: '100%',
    marginHorizontal: 100,
  },
  inner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 20,
    paddingRight: 18.48,
    paddingBottom: 10,
  },
  innerTwo: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 10,
    marginHorizontal: 20,
  },
  img: {
    width: 20,
    height: 20,
  },
  inin: {
    marginRight: 26,
  },
  foot: {
    marginRight: hp('23%'),
    fontWeight: '600',
    fontSize: 16,
  },
  foot2: {
    color: '#174285',
    fontWeight: '600',
    fontSize: 16,
    textAlign: 'right',
  },
  foot3: {
    fontWeight: '800',
    fontSize: 18,
  },
  foot3d: {
    color: '#174285',
    fontWeight: '800',
    fontSize: 18,
    textAlign: 'right',
  },
  footd: {
    color: '#FF6000',
    fontWeight: '600',
    fontSize: 15,
  },
  foot2d: {
    color: '#FF6000',
    fontWeight: '600',
    fontSize: 15,
    textAlign: 'right',
  },
  badge: {
    position: 'absolute',
    right: -hp('0.6%'),
    top: -hp('0.6%'),
    backgroundColor: 'gray',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
    paddingHorizontal: hp('0.5'),
  },
  badgeText: {
    color: 'white',
    fontSize: 9,
    fontWeight: '600',
  },
  item: {
    color: '#52565F',
    fontSize: 15,
    fontWeight: '600',
    paddingRight: 100,
  },
  inone: {
    paddingLeft: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  date: {
    fontSize: 13,
    height: 20,
    fontWeight: '600',
    color: '#888888',

    textAlign: 'right',
  },
  textDiscountAddButtonPortrait: {
    fontFamily: 'Montserrat-SemiBold',
    color: 'white',
    fontSize: hp('1.95%'),
    letterSpacing: 1.33,
    textAlign: 'center',
  },
  touchableModalTransactionAdd: {
    width: '130%',
    height: hp('6.25%'),
    marginTop: hp('2%'),
    borderRadius: 50,
    marginBottom: hp('1%'),
    alignItems: 'center',
  },
  content: {
    flexDirection: 'row',
    height: hp('3.95%'),
    alignItems: 'center',
    justifyContent: 'flex-start',
    borderBottomWidth: 1,
    borderTopWidth: 1,
    borderColor: '#ddd',
  },
  contentList: {
    flexDirection: 'row',
    height: hp('3.95%'),
    alignItems: 'center',
    justifyContent: 'flex-start',
    borderColor: '#ddd',
  },
  contentDiscount: {
    flexDirection: 'row',
    height: hp('3.95%'),
    alignItems: 'center',
    justifyContent: 'flex-start',
    borderColor: '#ddd',
    marginTop: 0,
    paddingTop: 0,
  },
  defaultHeader: {
    fontFamily: 'Montserrat-Bold',
    fontSize: hp('2%'),
    color: '#555555',
  },
  defaultContent: {
    fontSize: hp('2%'),
    color: '#555555',
  },
  discount: {
    fontSize: hp('1.8%'),
    color: '#FF6000',
  },
  table: {
    borderBottomWidth: 1,
    borderColor: '#ddd',
    width: '98%',
    backgroundColor: 'white',
  },
  orText: {
    alignItems: 'center',
    fontSize: hp('2.8%'),
    color: '#47525D',
    fontWeight: '800',
  },
});
export default ModalTransaction;
