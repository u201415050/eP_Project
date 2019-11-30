import React, { Component } from 'react';
import {
  StyleSheet,
  Modal,
  Text,
  ScrollView,
  View,
  TouchableOpacity,
  TouchableWithoutFeedback, 
  Keyboard,
  KeyboardAvoidingView,
} from 'react-native';
import colors from '../../styles/colors';
import { CardWithHeader } from '../cards';
import { TextMontserrat } from 'components';
import { isTablet } from '../../constants/isLandscape';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import AddCustomerForm from './components/add_customer_form';
import LinearGradient from 'react-native-linear-gradient';

class ModalAdd extends Component {
  state = {
    modalInvalid: false,
  };
  toggleInvalidModal = () => {
    this.setState({
      modalInvalid: !this.state.modalInvalid,
    });
    
  };
  
  render() {
    const {
      closeModal,
      widthModal,
      permiss,
      list_customers,
      logout,
      verifyCustomer,
      onFinished,
      fetched
    } = this.props;
    const isLandscape = isTablet;

    return (
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View
        style={[
          styles.container,
          { alignItems: 'center', justifyContent: 'center' },
        ]}
      >
        <View
          style={{
            width: '100%',
            height: hp('100%'),
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
        <KeyboardAvoidingView  keyboardVerticalOffset={-hp('30%')} enabled style={{width: '100%',
            height:hp('100%'), alignItems:'center', justifyContent:'center'}} behavior="padding">
          <CardWithHeader
            isLandscape={isLandscape}
            sizeHeaderLabel={!isLandscape ? wp('4.5%') : hp('3.5%')}
            onPressCloseButton={closeModal}
            customBodyStyle={{ alignItems: 'center', justifyContent: 'center' }}
            headerTitle="Add Customer"
            closeButton={true}
            customHeaderStyle={{
              height: !isLandscape ? hp('6.9%') : hp('8.4%'),
            }}
            customCardStyle={{
              width: !isLandscape ? wp('86.9%') : wp('45.8%'),
              height: !isLandscape ? hp('67%') : hp('83.8%'),
            }}
          >
            <AddCustomerForm
              fetched={fetched}
              toggleLogout={this.toggleInvalidModal}
              list_customers={list_customers}
              permiss={permiss}
              numberCustomer={this.props.numberAdd}
              addCustomer={cust => {
                this.props.addCustomer(cust);
                closeModal();
              }}
              verifyCustomer={verifyCustomer}
              closeFormFromOtp={closeModal}
              onFinished={onFinished}
            />
          </CardWithHeader>
          </KeyboardAvoidingView>
        </View>
        <Modal
          visible={this.state.modalInvalid}
          onRequestClose={this.toggleInvalidModal}
          transparent={true}
          animationType="fade"
        >
          <View
            style={[
              styles.container,
              {
                justifyContent: 'center',
                alignItems: 'center',
                height: '100%',
              },
            ]}
          >
            <View
              style={{
                width: isTablet ? '25%' : '80%',
                height: hp('23%'),
                elevation: 5,
                backgroundColor: 'white',
                borderRadius: 6,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <TextMontserrat
                style={{
                  fontWeight: '600',
                  textAlign: 'center',
                  fontSize: hp('2.6%'),
                }}
              >
                Your account has expired!
              </TextMontserrat>
              <TextMontserrat
                style={{
                  fontWeight: '600',
                  textAlign: 'center',
                  fontSize: hp('2.6%'),
                }}
              >
                Please log in.
              </TextMontserrat>
              <TouchableOpacity
                onPress={logout}
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
      </View>
      </TouchableWithoutFeedback>
    );
  }
}

// define your styles
const styles = StyleSheet.create({
  container: {
    width: '100%',
    backgroundColor: colors.opacityDin(0.6),
  },
  wrapper: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: hp('2.0%'),
    marginBottom: hp('4.0%'),
  },
  textDiscountAddButtonPortrait: {
    color: 'white',
    fontSize: hp('1.95%'),
    letterSpacing: 1.33,
    textAlign: 'center',
    fontWeight: '600',
  },
});

export default ModalAdd;
