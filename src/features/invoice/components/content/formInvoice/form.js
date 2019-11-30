import React, { Component } from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  Image,
  TextInput,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import colors from '../../../styles/colors';
import { TextMontserrat, Alert, Loading } from 'components';
import AddCustomerForm from './add_customer_form';
import ButtonGradient from '../../buttons/buttonGradientColor/ButtonGradient';
import { isTablet } from '../../../../left_sidebar/constants/isLandscape';
import * as yup from 'yup';
import alert_service from '../../../../../services/alert_service';
import alert_double_service from 'services/alert_double_service';
import ModalPrinter from '../../../../modal_printers/modal_printers';
import loading_service from '../../../../../services/loading_service';
import PaymentService from '../../../../../factory/utils/PaymentService';
import { epaisaRequest } from '../../../../../services/epaisa_service';
const cardsId = [22, 23, 24, 28, 29, 31, 32, 33, 35, 36, 37];
class Form extends Component {
  state = {
    form: {},
    //this.props.payment.paymentResponse.getCustomerId()
    formValid: /*?*/ false, //: true,
    printerModal: false,
    isMswipe: false,
  };

  componentDidMount() {
    console.log({ mydata: this.props.payment });
    const finalize = this.props.payment.paymentResponse
      ? this.props.payment.paymentResponse.finalize
      : this.props.payment.transactions[0].finalize; // for improve cash
    if (finalize) {
      const customer = finalize.customer;

      if (typeof customer === 'object') {
        this.setForm(
          {
            email: customer.email,
            mobile: customer.phoneNumber,
          },
          customer.phoneNumber
            .split('')
            .reverse()
            .slice(0, 10)
            .reverse()
            .join('')
        );
      }
    }
  }

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

  setForm(form, mobile) {
    this.setState(
      {
        form,
      },
      async () => {
        const formValid = await this.FORM_SQUEMA.isValid({
          ...form,
          mobile: mobile || '',
        });
        // alert(JSON.stringify({ form, mobile }));
        if (formValid) {
          if (!form.email && !form.mobile) {
            return this.setState({ formValid: false });
          } else {
            return this.setState({ formValid: true });
          }
        }
        return this.setState({ formValid: false });
      }
    );
  }

  sendReceipts() {
    const data = this.state.form;
    Keyboard.dismiss();
    // return;
    // console.log(this.props);
    if (this.props.offline) {
      return alert_service.showAlert(
        'You need to be connected to internet to send receipts'
      );
    }
    const paymentId = this.props.payment.paymentResponse
      ? this.props.payment.paymentResponse.getPaymentId()
      : this.props.payment.getPaymentId();

    //loading_service.showLoading();
    this.setState({ loading: true });
    PaymentService.sendPaymentReceipts({
      ...data,
      paymentId,
    })
      // this.props.payment
      //   .sendReceipts()
      .then(success => {
        console.log({ success });

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
              ? '+' + phoneNumber.replace(tempPhone, ' ')
              : '') + tempPhone;
          messageSent = messageSent.concat('sent to\n', formattedNumber);
        }

        // alert_service.showAlert(messageSent);
        this.setState({ loading: false }, () => {
          this.setState({
            alertMessage: messageSent,
            alertActive: true,
            alertTitle: 'Receipt Sent!',
          });
        });
        //alert_service.showAlert(messageSent, () => {}, null, 'Receipt Sent!');
      })
      .catch(err => {
        this.setState({ loading: false }, () => {
          this.setState({
            alertMessage: err.message,
            alertActive: true,
            alertTitle: null,
          });
        });
      });
  }
  render() {
    return (
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <View
          style={[
            styles.container,
            isTablet ? { width: '100%', height: '100%' } : null,
          ]}
        >
          {isTablet ? (
            <TextMontserrat
              style={{
                marginTop: hp('0%'),
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
              paddingHorizontal: hp('2%'),
              color: '#52565F',
              opacity: 0.9,
              fontWeight: '900',
              fontSize: hp('1.9%'),
              textAlign: 'center',
            }}
          >
            How do you want to send receipt to your customers?
          </TextMontserrat>
          <View style={{ width: '85%' }}>
            <AddCustomerForm
              customerId={this.props.customerId}
              invoice={true}
              payment={this.props.payment}
              onChangeForm={x => {
                let mobile = null;
                if (x.CallingCode && x.UserMobileNumber) {
                  mobile = `${x.CallingCode}${x.UserMobileNumber}`;
                }
                const form = {
                  email: x.email,
                  mobile,
                };
                this.setForm(form, x.UserMobileNumber);
              }}
            />
          </View>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              width: '85%',
              justifyContent: 'space-between',
              marginTop: hp(isTablet ? '13%' : '2%'),
            }}
          >
            <TouchableOpacity
              onPress={() => {
                if (isTablet) {
                  this.props.closeModal();
                } else this.props.unshowForm();
              }}
              style={{
                elevation: 8,

                backgroundColor: 'white',
                width: isTablet ? '45%' : wp('38%'),
                borderColor: '#D0021B',
                borderWidth: 1,
                borderRadius: hp('6%'),
                flexDirection: 'row',
                height: hp('6.5%'),
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Image
                style={{
                  // marginLeft: isTablet ? -hp('1.2%') : -wp('2.5%'),
                  marginRight: isTablet ? hp('0.5%') : wp('0.5%'),
                  marginTop: hp('0.3%'),
                  height: hp('3.6%'),
                  width: hp('3.6%'),
                  // backgroundColor: 'green'
                }}
                source={require('../../../assets/img/null_2.png')}
              />
              <TextMontserrat
                style={{
                  fontSize: isTablet ? hp('2%') : wp('2.9%'),
                  textAlign: 'center',
                  color: '#D0021B',
                  letterSpacing: isTablet ? wp('0.05%') : wp('0.25%'),
                  fontWeight: '700',
                  // backgroundColor: 'yellow'
                }}
              >
                NO THANKS
              </TextMontserrat>
            </TouchableOpacity>
            {isTablet ? (
              <View style={{ width: '45%' }}>
                <ButtonGradient
                  disabled={
                    !this.state.formValid &&
                    (this.state.email != '' || this.state.UserMobileNumber)
                  }
                  onPress={this.sendReceipts.bind(this)}
                  labelSize={isTablet ? hp('2%') : hp('1.8%')}
                  heightB={hp('6.5%')}
                  style={{ width: '100%' }}
                  firstColor={'#114B8C'}
                  secondColor={'#0079AA'}
                  title="SEND"
                />
              </View>
            ) : (
              <ButtonGradient
                disabled={!this.state.formValid}
                onPress={this.sendReceipts.bind(this)}
                heightB={hp('6.5%')}
                style={{ width: wp('38%') }}
                firstColor={'#114B8C'}
                secondColor={'#0079AA'}
                title="SEND"
              />
            )}
          </View>
          <View style={{ width: '85%', marginTop: hp('2%') }}>
            <ButtonGradient
              disabled={
                this.state.printerModal ||
                (this.props.payment.paymentResponse
                  ? false
                  : this.props.payment.transactions[0].finalize == null)
              }
              onPress={() => {
                this.setState({ printerModal: true });
              }}
              labelSize={isTablet ? hp('2%') : hp('1.8%')}
              heightB={hp('6.5%')}
              firstColor={'#114B8C'}
              secondColor={'#0079AA'}
              title="PRINT"
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
              fontSize: isTablet ? hp('1.7%') : wp('2.65%'),
              textAlign: 'center',
            }}
          >
            Digital receipts delivered by ePaisa. See your digital receipt for
            privacy policy.
          </TextMontserrat>

          <ModalPrinter
            payment={this.props.payment}
            items={this.props.items}
            active={this.state.printerModal}
            closeModal={() => this.setState({ printerModal: false })}
          />
          {this.state.loading && <Loading />}
          {this.state.alertActive ? (
            <Alert
              textSize={1.5}
              fontWeight="600"
              message={[this.state.alertMessage]}
              buttonTitle="OK"
              messageTitle={this.state.alertTitle}
              onPress={() => {
                this.setState({ alertActive: false });
              }}
            />
          ) : null}
        </View>
      </TouchableWithoutFeedback>
    );
  }
}

// define your styles
const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    width: wp('96%'),
    marginBottom: hp('1.7%'),
    backgroundColor: colors.white,
    elevation: 4,
    shadowOffset: { width: 1, height: 1 },
    shadowColor: 'grey',
    shadowOpacity: 0.5,
    shadowRadius: 3,
    borderRadius: 6,
  },
});

export default Form;
