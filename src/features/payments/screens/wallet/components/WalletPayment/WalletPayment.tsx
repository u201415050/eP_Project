import React, { useState } from 'react';
import {
  TextMontserrat,
  EpaisaGradientButton,
  EpaisaCircleButton,
  EpaisaSimpleInput,
  EpaisaPhoneInput,
  EpaisaOtpInputs,
} from 'epaisa-components';
import { View, Image } from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import * as yup from 'yup';
import { Formik, FormikActions } from 'formik';
interface IFormValue {
  countryCode: string;
  mobileNumber: string;
}
interface IWalletPayment {
  isTablet: boolean;
  onSubmit(values: IFormValue, actions: FormikActions<IFormValue>): void;
  submitButtonLabel: string;
  title: string;
  paymentIcon: string;
  otpFields: string[];
  showOtpForm: boolean;
  validateOtp(otp: number): Promise<boolean>;
}

let otp_inputs = null;

const WalletPayment = (props: IWalletPayment) => {
  const {
    isTablet,
    onSubmit,
    submitButtonLabel,
    title,
    paymentIcon,
    otpFields,
    validateOtp,
    showOtpForm,
  } = props;
  const errorColor = '#D0021B';
  const inputHeight = isTablet ? hp('5.5') : hp('5');
  const [otpError, setOtpError] = useState(false);
  const [otpNumber, setOtpNumber] = useState(0);
  return (
    <Formik
      initialValues={{
        countryCode: '93',
        mobileNumber: '',
      }}
      onSubmit={(values, actions) => {
        if (onSubmit) {
          onSubmit(values, actions);
        }
      }}
      validationSchema={yup.object().shape({
        countryCode: yup.string().required(),
        mobileNumber: yup
          .string()
          .min(9)
          .max(10)
          .required(),
      })}
    >
      {({
        values,
        errors,
        touched,
        isValid,
        handleSubmit,
        setFieldValue,
        setFieldTouched,
      }) => (
          <View
            style={{
              // backgroundColor: 'red',
              flex: 1,
              justifyContent: 'space-between',
            }}
          >
            <View style={styles.containerBox}>
              <View style={styles.titleContainer}>
                <View
                  style={{
                    marginLeft: hp('1%'),
                    marginTop: hp('1%'),
                    marginBottom: hp('1%'),
                    marginRight: hp('1.5%'),
                  }}
                >
                  <EpaisaCircleButton size={hp('6.5%')} iconName={paymentIcon} />
                </View>

                <TextMontserrat
                  weight={'500'}
                  style={{
                    color: '#5D6770',
                    fontSize: hp('2.8%'),
                  }}
                >
                  {title}
                </TextMontserrat>
              </View>
              <View
                style={{
                  width: '100%',
                  paddingHorizontal: hp('3%'),
                  paddingVertical: hp('3%'),
                }}
              >
                <View
                  style={{
                    flexDirection: 'row',
                    marginTop: 16,
                  }}
                >
                  <View style={{ width: '25%' }}>
                    <EpaisaPhoneInput
                      isTablet={isTablet}
                      defaultCountry={{
                        alpha2Code: 'IN',
                        callingCodes: ['91'],
                        name: 'India',
                      }}
                      disabled={true}
                      // onChangeCountry={country => {
                      //   setFieldValue('countryCode', country.callingCodes[0]);
                      // }}
                      fontSize={isTablet ? hp('3') : wp('4.0')}
                      textColor={
                        errors.countryCode && touched.countryCode
                          ? errorColor
                          : '#174285'
                      }
                      height={inputHeight}
                    />
                    {/* <EpaisaSimpleInput
                  onIconClick={() => {
                    if (values.firstName) {
                      setFieldValue('countryCode', '');
                    }
                  }}
                  height={inputHeight}
                  textColor={
                    errors.countryCode && touched.countryCode
                      ? errorColor
                      : '#174285'
                  }
                  value={values.firstName}
                  onChangeText={(val: string) => {
                    setFieldValue('countryCode', val);
                    setFieldTouched('countryCode', true);
                  }}
                  style={{
                    fontSize: isTablet ? hp('3') : wp('4.5'),
                    fontWeight: 'bold',
                  }}
                /> */}
                  </View>

                  <View style={{ width: '75%' }}>
                    <EpaisaSimpleInput
                      maxLength={10}
                      keyboardType="numeric"
                      onIconClick={() => {
                        if (values.lastName) {
                          setFieldValue('mobileNumber', '');
                        }
                      }}
                      height={inputHeight}
                      textColor={
                        errors.mobileNumber && touched.mobileNumber
                          ? errorColor
                          : '#174285'
                      }
                      value={values.mobileNumber}
                      onChangeText={(val: string) => {
                        setFieldValue('mobileNumber', val);
                        setFieldTouched('mobileNumber', true);
                      }}
                      style={{
                        fontSize: isTablet ? hp('3') : wp('4.5'),
                        fontWeight: 'bold',
                        borderLeftColor:
                          errors.mobileNumber && touched.mobileNumber
                            ? errorColor
                            : '#174285',
                        borderLeftWidth: 2,
                        paddingLeft: isTablet ? hp('2') : hp('1'),
                      }}
                    />
                  </View>
                </View>
              </View>
            </View>
            <View
              style={{
                width: '100%',
                flex: 0.8,
                flexGrow: 1,
              }}
            >
              {showOtpForm && (
                <View
                  style={{
                    ...styles.containerBox,
                    marginTop: hp('3'),
                    padding: hp('3'),
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <View>
                    <TextMontserrat
                      weight={'500'}
                      style={{ fontSize: hp('2.2') }}
                    >
                      Insert OTP
                  </TextMontserrat>
                  </View>
                  <View style={{ marginVertical: hp('2') }}>
                    <EpaisaOtpInputs
                      cleanErrors={() => setOtpError(false)}
                      borderColors={otpError ? 'red' : '#174285'}
                      ref={input => (otp_inputs = input)}
                      invalid={otpError}
                      data={otpFields}
                      onChangeText={otp => {
                        setOtpNumber(otp);
                      }}
                      onComplete={async otp => {
                        console.log('complete Add customer fields otp');
                        if (!(await validateOtp(otp))) {
                          setOtpError(true);
                        }
                        // alert(JSON.stringify(otp));
                        // this.props.otpValid(
                        //   this.state.auth_key,
                        //   this.props.customerId,
                        //   otp
                        // );
                      }}
                    />
                  </View>
                  <View style={{ width: '60%', height: hp('6.5') }}>
                    <EpaisaGradientButton
                      disabled={
                        (otpNumber || 0).toString().length < otpFields.length
                      }
                      radius={50}
                      fontSize={hp('2')}
                      height={hp('6')}
                      onPress={async () => {
                        if (!(await validateOtp(otpNumber))) {
                          setOtpError(true);
                        }
                      }}
                      title={'CONFIRM'}
                    />
                  </View>
                </View>
              )}
            </View>
            <View
              style={{
                flex: 0.2,
                flexShrink: 1,
              }}
            >
              {!showOtpForm && (
                <EpaisaGradientButton
                  disabled={!isValid}
                  radius={50}
                  fontSize={hp('2')}
                  height={hp('6')}
                  onPress={handleSubmit}
                  title={submitButtonLabel}
                />
              )}
            </View>
          </View>
        )}
    </Formik>
  );
};

export default WalletPayment;
const styles = {
  containerBox: {
    backgroundColor: 'white',
    borderWidth: 0.1,
    borderColor: '#5D6770',
    borderRadius: 3,
    elevation: 2,
  },
  titleContainer: {
    width: '100%',
    borderBottomWidth: 1,
    borderColor: '#EBEBEB',
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
};
