import React, { Component } from 'react';
import {
  View,
  ImageBackground,
  ScrollView,
  Dimensions,
  KeyboardAvoidingView,
  Alert,
  BackHandler,
} from 'react-native';
import PaymentsHeader from '../../components/header/header';
import TransactionDetails from './../../components/transaction_details/transaction_details';
import { ButtonGradient } from 'components';
import { connect } from 'react-redux';
import { isTablet } from '../../../cash_register/constants/isLandscape';
import EStyleSheet from 'react-native-extended-stylesheet';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { TextMontserrat } from 'components';
import FormUPI from './components/formUPI/formUPI';
import { formatNumberCommasDecimal } from 'api';
import { getLocalSettingRow } from '../../../../services/settings_service';
import { ButtonCamera } from '../../../cash_register/components/EditProduct/components/buttons';
import ImagePicker from 'react-native-image-picker';
import alert_service from '../../../../services/alert_service';
import moment from 'moment';
import { cashActions } from '../../../cash_register/actions';
import * as yup from 'yup';
import { cancelPendingTransactions } from 'api';
import { onPressBack } from '../../../../api/confirm';

//import mixpanel from '../../../../services/mixpanel';

const isPortrait = () => {
  const dim = Dimensions.get('window');
  if (dim.height >= dim.width) {
    return true;
  } else {
    return false;
  }
};

class PaymentsCheque extends Component {
  static navigationOptions = ({ navigation }) => ({
    header: isTablet ? null : (
      <PaymentsHeader navigation={navigation} title="CHEQUE" headerRight replaceBack={onPressBack} />
    ),
  });
  constructor(props) {
    super(props);
    //mixpanel.track('Cheque Payment');
    this.payment = this.props.payment;
  }

  state = {
    payCant: 0,
    imagePath: '',
    imageHeight: '',
    imageWidth: '',
    calendar: false,
    orientation: isPortrait(),
  };
  componentDidMount() {
    cancelPendingTransactions(this.payment);
    if (this.props.navigation) {
      this._willBlurSubscription = BackHandler.addEventListener(
        'hardwareBackPress',
        onPressBack.bind(this, this.props.payment, this.props.navigation, true)
      );
    }
  }
  CHEQUE_SQUEMA = yup.object().shape({
    chequeNumber: yup
      .string()
      .min(6)
      .required(),
    chequeBankName: yup.string().required(),
    chequeDate: yup
      .string()
      .test(
        'date-range',
        'Cheque date cannot be 3 month before or after the current date',
        value => {
          const chequedate = moment(value, 'D-MM-YYYY');
          const validFormat = chequedate.isValid();
          const format = 'YYYY-MM-DD';
          const validRange = moment(chequedate.format(format)).isBetween(
            moment()
              .subtract(3, 'months')
              .format(format),
            moment()
              .add(3, 'months')
              .format(format)
          );
          return validFormat && validRange;
        }
      )
      .required(),
  });

  async processPayment() {
    const data = this.state.cheque;
    this.payment
      .payStep('process', { data, next: this.props.next })
      .then(() => {})
      .catch(err => {
        console.log({ payment_err: err });
        alert_service.showAlert(err.message, err.action);
      });
  }

  openImagePicker = () => {
    const options = {
      title: 'Select your option',
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    };
    if (getLocalSettingRow('device', 'EnableCamera') == 0) {
      //this.setState({openCameraModal:!this.state.openCameraModal})
      ImagePicker.launchImageLibrary(options, response => {
        if (response.didCancel) {
          console.log('Canceled');
        } else if (response.error) {
          alert('Something went wrong with this option. Try again later.');
          console.log(response.error);
        } else if (response.customButton) {
          alert('Custom button tapped : ' + response.customButton);
        } else {
          this.setState({
            imagePath: response.uri,
            imageHeight: response.height,
            imageWidth: response.width,
          });
        }
      });
    } else {
      ImagePicker.showImagePicker(options, response => {
        if (response.didCancel) {
          console.log('Canceled');
        } else if (response.error) {
          alert('Something went wrong with this option. Try again later.');
          console.log(response.error);
        } else if (response.customButton) {
          alert('Custom button tapped : ' + response.customButton);
        } else {
          this.setState({
            imagePath: response.uri,
            imageHeight: response.height,
            imageWidth: response.width,
          });
        }
      });
    }
  };
  componentWillUnmount() {
    if (this._willBlurSubscription) {
      this._willBlurSubscription.remove();
    }
  }
  render() {
    return (
      <ImageBackground
        source={require('../../../../assets/images/bg/loadingBackground.png')}
        style={[
          {
            paddingHorizontal: isTablet ? 0 : 10,

            paddingBottom: 20,
            height: '100%',
          },
          isTablet ? { width: '93%' } : null,
        ]}
      >
        <KeyboardAvoidingView style={{}} behavior={isTablet?null:"position"}>
          <ScrollView
            keyboardDismissMode="on-drag"
            contentContainerStyle={{
              paddingTop: 20,
              paddingHorizontal: isTablet ? hp('0.1%') : null,
            }}
            keyboardShouldPersistTaps="always"
            showsVerticalScrollIndicator={false}
          >
            <TransactionDetails
              order={this.props.payment.order}
              data={this.props.state}
              manual={this.order != null}
            />
            <View
              style={[
                styles.containerBox,
                this.state.orientation
                  ? { height: hp('47.2%') }
                  : { height: hp('45%'), marginTop: hp('2%') },
              ]}
            >
              <View style={styles.bodyContainer}>
                <View
                  style={{
                    width: '88%',
                    marginTop: hp('2%'),
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}
                >
                  <ButtonCamera
                    containerStyle={{
                      width: hp('12%'),
                      height: hp('10%'),
                      borderRadius: 5,
                      borderWidth: 0.8,
                      borderColor: 'rgba(0,0,0,0.3)',
                    }}
                    imageSize={4}
                    onPress={this.openImagePicker}
                    imageSource={this.state.imagePath}
                    imageAtributes={{
                      height: this.state.imageHeight,
                      width: this.state.imageWidth,
                    }}
                  />
                  <TextMontserrat
                    style={{
                      marginLeft: hp('2%'),
                      color: '#174285',
                      fontSize: hp('1.6%'),
                      fontWeight: '700',
                      opacity: 0.85,
                    }}
                  >
                    Scan Cheque
                  </TextMontserrat>
                </View>
                <View style={{ width: '88%', marginBottom: hp('2%') }}>
                  <FormUPI
                    onChangeForm={async form => {
                      const cheque = {
                        chequeNumber: form.ChequeNumber,
                        chequeDate: moment(form.DateValue, 'D/MM/YYYY').format(
                          'D-MM-YYYY'
                        ),
                        chequeBankName: form.BankName,
                      };
                      this.CHEQUE_SQUEMA.validate(cheque)
                        .then(() => {
                          this.setState({ cheque, formIsValid: true });
                        })
                        .catch(() => {
                          this.setState({ cheque, formIsValid: false });
                        });
                    }}
                  />
                </View>
              </View>
            </View>
            <View style={{ height: hp('5%') }} />
          </ScrollView>
        </KeyboardAvoidingView>
        <View style={{ flex: 1 }}>
          <View
            style={{ width: '100%', position: 'absolute', bottom: hp('0%') }}
          >
            <ButtonGradient
              disabled={!this.state.formIsValid}
              heightB={true}
              onPress={this.processPayment.bind(this)}
              style={
                this.state.orientation
                  ? {}
                  : { width: '100%', height: hp('8%') }
              }
              labelSize={this.state.orientation ? null : hp('2.5%')}
              title={
                'PAY ₹' +
                formatNumberCommasDecimal(
                  parseFloat(this.payment.paymentAmount).toFixed(2)
                )
              }
            />
          </View>
        </View>
      </ImageBackground>
    );
  }
}
const styles = EStyleSheet.create({
  containerBox: {
    backgroundColor: 'white',
    borderWidth: 0.5,
    borderColor: '#ddd',
    borderRadius: 3,
    elevation: 3,
    marginTop: hp('1%'),
  },
  titleContainer: {
    width: '100%',
    borderBottomWidth: 1,
    borderColor: 'rgba(0,0,0,0.1)',
    flexDirection: 'row',
    alignItems: 'center',
  },
  bodyContainer: {
    width: '100%',
    alignItems: 'center',
  },
  containerOtpFields: {
    alignItems: 'center',
  },
  labelOtp: {
    textAlign: 'center',
    fontWeight: '700',
    marginBottom: hp('0.5%'),
    fontSize: hp('1.5%'),
    color: '#6B6B6B',
  },
});

const mapStateToProps = state => ({
  state: state.cashData,
  payment: state.payment_data.payment,
  order: state.payment_data.order,
});
const mapDispatchToProps = dispatch => ({
  clear_order: () => dispatch(cashActions.clear_data()),
  clear_customer: () => dispatch(cashActions.clear_customer()),
});
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PaymentsCheque);
