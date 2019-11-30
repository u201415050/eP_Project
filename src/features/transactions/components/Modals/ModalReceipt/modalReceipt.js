import React, { Component } from 'react';
import {
  StyleSheet,
  Modal,
  View,
  Image,
  Text,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import colors from '../../../../account_created/styles/colors';
import { CardWithHeader } from '../../../../cash_register/components/cards';

import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import { TextMontserrat, Loading, Alert } from 'components';

import AddCustomerForm from '../../../../invoice/components/content/formInvoice/add_customer_form';
import * as yup from 'yup';
import alert_service from '../../../../../services/alert_service';
import ButtonGradient from '../../../../invoice/components/buttons/buttonGradientColor/ButtonGradient';
import { isTablet } from '../../../constants/isLandscape';
import PaymentService from '../../../../../factory/utils/PaymentService';
import loading_service from '../../../../../services/loading_service';
const payment_service = new PaymentService();
class ModalReceipt extends Component {
  state = {
    form: {},
    formValid: false,
    loading: false,
    alert: false,
    message: '',
  };
  FORM_SQUEMA = yup.object().shape({
    email: yup.string().email(),
    mobile: yup
      .string()
      .nullable()
      .test('min', 'not valid mobile', value => {
        if (value.length === 0) return true;
        return value.length < 10 ? false : true;
      })
      .when('email', {
        is: true,
        then: yup
          .string()
          .nullable()
          .notRequired(),
        otherwise: yup
          .string()
          .max(10)
          .notRequired(),
      }),
  });
  sendReceipts() {
    const data = this.state.form;
    const { paymentId, auth_key } = this.props;
    JSON.stringify(data);
    if (JSON.stringify(data) != '{}') {
      if (Platform.OS === 'android') {
        loading_service.showLoading();
      } else {
        this.setState({ loading: true });
      }
      payment_service
        .sendReceipts({
          ...data,
          paymentId: paymentId,
        })
        .then(success => {
          console.log({ success });
          if (Platform.OS === 'android') {
            loading_service.hideLoading();
          } else {
            this.setState({ loading: false });
          }

          if (Platform.OS === 'android') {
            var messageSent = 'Receipt was successfully ';

            if (success.clearEmail && success.clearMobile) {
              messageSent = messageSent.concat('sent');
            } else if (success.clearEmail) {
              const mailAddress = success.message.replace('to', '').trim();
              messageSent = messageSent.concat(
                'emailed to the address ',
                mailAddress
              );
            } else if (success.clearMobile) {
              const phoneNumber = success.message.replace('to', '').trim();
              tempPhone = phoneNumber.substring(
                phoneNumber.length - 10,
                phoneNumber.length
              );
              formattedNumber =
                (phoneNumber.length > 10
                  ? phoneNumber.replace(tempPhone, ' ')
                  : '') + tempPhone;
              messageSent = messageSent.concat('sent to\n', formattedNumber);
            }

            alert_service.showAlert(
              messageSent,
              () => {},
              null,
              'Receipt Sent!'
            );
          } else {
            this.setState({
              alert: true,
              message: `Receipt sent ${success.message.trim()}`,
            });
          }
        })
        .catch(err => {
          if (Platform.OS === 'android') {
            alert_service.showAlert(err.message, err.action);
          } else {
            this.setState({ alert: false, message: err.message });
          }
        });
    }
  }
  render() {
    return (
      <Modal
        visible={this.props.active}
        transparent={true}
        animationType="fade"
        onRequestClose={() => {
          this.setState({ formValid: false, form: {} });
          this.props.closeModal();
        }}
      >
        <View style={styles.container}>
          <KeyboardAvoidingView
            behavior="padding"
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              flex: 1,
            }}
          >
            <CardWithHeader
              isLandscape={isTablet}
              sizeHeaderLabel={isTablet ? '3.5%' : '3%'}
              onPressCloseButton={() => {
                this.setState({ formValid: false, form: {} });
                this.props.closeModal();
              }}
              customBodyStyle={{
                alignItems: 'center',
                justifyContent: 'center',
              }}
              headerTitle="Send Receipt"
              closeButton={true}
              customCardStyle={{ width: isTablet ? hp('80%') : wp('95') }}
            >
              <View
                style={[
                  styles.containerForm,
                  isTablet ? { width: '100%' } : null,
                ]}
              >
                {isTablet ? (
                  <TextMontserrat
                    style={{
                      marginTop: hp('3%'),
                      color: '#52565F',
                      opacity: 0.9,
                      fontWeight: '700',
                      fontSize: hp('3.5%'),
                    }}
                  >
                    Receipt
                  </TextMontserrat>
                ) : null}
                <TextMontserrat
                  style={{
                    marginTop: hp('2%'),
                    color: '#52565F',
                    opacity: 0.9,
                    fontWeight: '900',
                    fontSize: isTablet ? hp('3%') : wp('3.8%'),
                    textAlign: 'center',
                  }}
                >
                  How do you want to send receipt to your customers?
                </TextMontserrat>
                <View style={{ width: '85%' }}>
                  <AddCustomerForm
                    tran={true}
                    onChangeForm={x => {
                      let mobile = null;
                      if (x.CallingCode && x.UserMobileNumber) {
                        mobile = `+${x.CallingCode}${x.UserMobileNumber}`;
                      }
                      const form = {
                        email: x.email,
                        mobile,
                      };
                      this.setState(
                        {
                          form,
                        },
                        () => {
                          this.FORM_SQUEMA.validate({
                            ...form,
                            mobile: x.UserMobileNumber || '',
                          })
                            .then(valid => {
                              if (!form.email && !form.mobile) {
                                console.log({ valid });
                                this.setState({ formValid: false });
                              } else {
                                this.setState({ formValid: true });
                              }
                            })
                            .catch(error => {
                              console.log({ error });
                              this.setState({ formValid: false });
                            });
                        }
                      );
                    }}
                  />
                </View>

                <View
                  style={{
                    width: '85%',
                    marginTop: isTablet ? hp('5%') : hp('2%'),
                  }}
                >
                  <ButtonGradient
                    disabled={!this.state.formValid}
                    onPress={this.sendReceipts.bind(this)}
                    labelSize={isTablet ? hp('2%') : hp('1.8%')}
                    heightB={hp('6.5%')}
                    firstColor={'#114B8C'}
                    secondColor={'#0079AA'}
                    title="SEND"
                  />
                </View>
                <TextMontserrat
                  style={{
                    width: '76%',
                    marginTop: isTablet ? hp('3%') : hp('1.3%'),
                    marginBottom: hp('0.7%'),
                    color: '#52565F',
                    opacity: 0.7,
                    fontWeight: '900',
                    fontSize: isTablet ? hp('2%') : wp('2.65%'),
                    textAlign: 'center',
                  }}
                >
                  Receipts delivered via ePaisa. See your receipt for privacy
                  policy and preferences.
                </TextMontserrat>
              </View>
            </CardWithHeader>
          </KeyboardAvoidingView>
          {this.state.loading ? <Loading /> : null}
          {this.state.alert ? (
            <Alert
              textSize={1.5}
              fontWeight="600"
              message={[this.state.message.trim()]}
              buttonTitle="OK"
              onPress={() => {
                this.setState({ alert: false });
              }}
            />
          ) : null}
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
    justifyContent: 'center',
    backgroundColor: colors.opacityDin(0.6),
  },
  containerForm: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    marginBottom: hp('1.7%'),
    borderRadius: 6,
  },
  wrapper: {
    width: '100%',
    alignItems: 'center',
  },
  description: {
    width: '100%',
    alignItems: 'center',
    paddingHorizontal: wp(isTablet ? '1%' : '4%'),
    marginTop: hp('1%'),
  },
  item: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginBottom: hp('0.8%'),
  },
  total: {
    width: '100%',
    flexDirection: 'row',
    paddingHorizontal: wp('5%'),
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: hp('2%'),
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: wp('4%'),
    paddingVertical: hp('1.5%'),
    width: '100%',
  },
  buttonsFot: {
    width: '32%',
    backgroundColor: '#D8D8D8',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: hp('1%'),
    elevation: 5,
    paddingVertical: hp('1.3%'),
  },
  btnText: {
    fontSize: hp('2.3%'),
    color: '#47525D',
    fontWeight: '800',
  },
});

export default ModalReceipt;
