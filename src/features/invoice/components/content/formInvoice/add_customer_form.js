import React, { Component } from 'react';
import { View, TouchableOpacity, Text, TextInput } from 'react-native';
import { FloatingTextInput } from 'components';
import { PhoneInput } from 'components';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import * as _ from 'lodash';
import { isTablet } from '../../../../my_account/constants/isLandscape';
import { getTable } from '../../../../../services/realm_service';
class AddCustomerForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      UserMobileNumber: '',
      callingCode: '',
      countryCode: '',
      errors: {},
      selectionDefault: null,
      fetchedData: false,
    };
    if (!props.tran) {
      let finalize = _.get(
        this.props.payment,
        'paymentResponse.finalize',
        null
      );
      if (finalize) {
        finalize = this.props.payment.transactions[0].finalize;
      }

      if (finalize) {
        if (finalize.customer !== 'No customer assigned.') {
          this.state = {
            email: finalize.customer.email,
            errors: {},
            UserMobileNumber: finalize.customer.phoneNumber.split(' ')[1],
            callingCode: finalize.customer.phoneNumber
              .split(' ')[0]
              .replace('+', ''),
            countryCode: finalize.customer.countryCode,
          };
        }
      }
    }
  }

  _verifyPhoneNumberFormat(value) {
    var tempPhoneNumber = '';
    var tempCallingCode = '';
    var phoneNumber = UserMobileNumber;
    if (!phoneNumber.startsWith('+')) {
      tempCallingCode = phoneNumber.slice(0, phoneNumber.length - 10);
      tempPhoneNumber =
        tempCallingCode +
        ' ' +
        phoneNumber.slice(tempCallingCode.length, phoneNumber.length);
    } else {
      tempCallingCode = phoneNumber.split(' ')[0];
      tempPhoneNumber = phoneNumber.split(' ')[1];
    }
  }

  _checkEmail() {
    const { email } = this.state;
    if (email === '') {
      return this.setState({
        errors: {
          ...(this.state.errors || {}),
          email: ['Enter a valid e-mail address'],
        },
      });
    }
  }

  _checkMobile() {
    const { UserMobileNumber, CallingCode } = this.state;
    const regex = new RegExp(/^\d{10}$/);
    if (!regex.test(UserMobileNumber)) {
      return this.setState({
        errors: {
          ...(this.state.errors || {}),
          mobile: ['Enter a valid mobile number'],
        },
      });
    }
  }
  _textChange(key, value) {
    this.setState({ [key]: value });
    const errors = this.state.errors;
    errors[key] = [];
    this.setState(
      {
        errors,
      },
      () => {
        this._changeForm({
          ...this.state,
          ...{ [key]: value },
        });
      }
    );
  }

  _changeForm = payload => {
    if (this.props.onChangeForm) {
      const { errors, ...newPayload } = payload;
      this.formIsValid();

      this.props.onChangeForm(newPayload);
    }
  };

  formIsValid = () => {
    const errors = {};
    if (this.state.UserFirstName === '') {
      errors['UserFirstName'] = ['First name cannot be empty'];
    }

    if (this.state.UserLastName === '') {
      errors['UserLastName'] = ['Last name cannot be empty'];
    }
    if (this.state.Password === '') {
      errors['Password'] = ['Password name cannot be empty'];
    }
    if (this.state.UserMobileNumber === '') {
      errors['UserMobileNumber'] = ['Mobile number cannot be empty'];
    }
    this.setState(
      {
        errors: {
          ...(this.state.errors || {}),
          ...errors,
        },
      },
      () => {
        let valid = true;
        for (const key in this.state.errors) {
          if (errors.hasOwnProperty(key)) {
            const element = this.state.errors[key];
            if (element.length > 0) {
              valid = false;
            }
          }
        }
      }
    );
  };

  _changePhone = value => {
    const errors = this.state.errors;
    errors['mobile'] = [];
    this.setState(
      {
        CountryCode: value.alpha2Code,
        UserMobileNumber: value.phone,
        CallingCode: value.callingCode,
        errors,
      },
      () => {
        this._changeForm({
          ...this.state,
          CountryCode: value.alpha2Code,
          UserMobileNumber: value.phone,
        });
      }
    );
  };
  _onTextClear = () => {
    this.setState({ UserMobileNumber: '' }, () => {
      this._changeForm({
        ...this.state,
      });
    });
    /*const errors = this.state.errors;
    errors[key] = [];
    this.setState({
      errors,
    });*/
  };
  componentDidMount() {
    setTimeout(this.onContentSize, 1);
  }
  onContentSize = () => {
    this.setState(
      {
        selectionDefault: null, // { start: 0, end: 0 },
      },
      () =>
        this.setState({
          selectionDefault: null,
        })
    );
  };
  componentDidUpdate() {
    if (
      this.props.customerId != '' &&
      this.props.customerId != null &&
      !this.state.fetchedData
    ) {
      //alert(this.props.customerId)
      if (this.state.email == '') {
        try {
          setTimeout(() => {
            let customer = getTable('CustomerAPI').filtered(
              `customerId CONTAINS[c] "${this.props.customerId}"`
            );
            //alert(customer)
            if (customer.length > 0) {
              customer = customer[0];
              this.phoneField.selectJustCountryCodeByCode(customer.countryCode);
              this._textChange('email', customer.email);
              let number = customer.phoneNumber.split(' ');
              this._changePhone({
                alpha2Code: customer.countryCode,
                phone: number[1],
                callingCode: number[0].substr(1),
              });
              this.setState({ fetchedData: true });
            }
          }, 10);
        } catch (error) {
          console.log(error);
        }
        //alert(JSON.stringify(customer))
      }
    }
  }
  render() {
    const {
      email,
      errors,
      UserMobileNumber,
      callingCode,
      countryCode,
    } = this.state;

    return (
      <View style={styles.formContainer}>
        <View
          style={[
            {
              flex: 1,
              flexDirection: 'row',
              marginBottom: this.props.invoice ? 0 : hp('5%'),
            },
            !isTablet ? { height: hp('7%') } : { height: hp('9%') },
          ]}
        >
          <FloatingTextInput
            label={'E-mail'}
            value={email}
            onChangeText={val => this._textChange('email', val)}
            errors={email ? errors.email : [] || []}
            autoCapitalize={'none'}
            touched={true}
            onBlur={() => {
              this.onContentSize();
            }}
            labelSizeUp={!isTablet ? hp('1.5%') : hp('2%')}
            labelSizeDown={!isTablet ? hp('2%') : hp('2.3%')}
            labelPlacingUp={!isTablet ? 0 : hp('2%')}
            labelPlacingDown={!isTablet ? hp('3%') : hp('5%')}
            inputContainerStyle={
              !isTablet ? { height: hp('3%') } : { height: hp('7%') }
            }
            touched={true}
            inputStyle={
              !isTablet
                ? {
                    width: '90%',
                    fontSize: hp('2%'),
                    height: hp('5%'),
                    marginTop: hp('2%'),
                    paddingBottom: 0,
                  }
                : {
                    width: '90%',
                    fontSize: hp('2.5%'),
                    height: hp('5%'),
                    marginTop: hp('4%'),
                    paddingBottom: 0,
                  }
            }
            underlineStyle={
              !isTablet ? { height: hp('0.4%') } : { height: hp('0.4%') }
            }
            iconStyle={
              !isTablet
                ? { bottom: hp('0.1%'), zIndex: 0 }
                : { bottom: hp('0.1%'), zIndex: 0 }
            }
            iconSize={!isTablet ? hp('2.7%') : hp('3%')}
            selection={this.state.selectionDefault}
            onContentSizeChange={this.onContentSize}
          />
        </View>
        <View
          style={[
            {},
            styles.nameInputs,
            {
              flex: 1,
              marginTop: hp(isTablet ? '9%' : this.props.invoice ? '1%' : '3%'),
              marginBottom: hp(this.props.invoice ? '0%' : '7%'),
            },
            !isTablet ? { height: hp('8%') } : { height: hp('9%') },
          ]}
        >
          <PhoneInput
            ref={x => (this.phoneField = x)}
            personal={true}
            label={'Mobile Number'}
            value={UserMobileNumber}
            CallingCode={callingCode}
            CountryCode={countryCode}
            onTextClear={this._onTextClear.bind(this)}
            onChange={this._changePhone}
            errors={errors.mobile || []}
            labelSizeUp={!isTablet ? hp('1.5%') : hp('2%')}
            labelSizeDown={!isTablet ? hp('2%') : hp('2.3%')}
            labelPlacingUp={!isTablet ? 0 : hp('1.2%')}
            labelPlacingDown={!isTablet ? hp('3%') : hp('5%')}
            inputContainerStyle={
              !isTablet ? { height: hp('3%') } : { height: hp('7%') }
            }
            inputStyle={
              !isTablet
                ? {
                    flex: 1,
                    marginRight: !isTablet ? hp('3%') : hp('4%'),
                    fontSize: hp('2%'),
                    height: hp('5%'),
                    marginTop: hp('2%'),
                    paddingBottom: 0,
                    borderLeftWidth: 0,
                    marginLeft: -hp('0.2%'),
                  }
                : {
                    flex: 1,
                    marginRight: !isTablet ? hp('3%') : hp('4%'),
                    fontSize: hp('2.5%'),
                    marginLeft: -hp('0.2%'),
                    height: hp('5%'),
                    marginTop: hp('4%'),
                    paddingBottom: 0,
                    borderLeftWidth: 0,
                  }
            }
            iconStyle={
              !isTablet
                ? { bottom: hp('0.1%'), zIndex: 0 }
                : { bottom: hp('0.1%'), zIndex: 0 }
            }
            iconSize={!isTablet ? hp('2.7%') : hp('3%')}
            /*onTextClear={this._onTextClear.bind(this, 'mobile')}
            onChange={this._changePhone}
            onSubmitEditing={() => this._checkMobile()}
            onBlur={() => this._checkMobile()}
            errors={errors.mobile || []}*/
            restyleComp={true}
          />
        </View>
      </View>
    );
  }
}

const styles = {
  nameInputs: {
    flexDirection: 'row',
  },
  formContainer: {
    paddingHorizontal: hp('0%'),
    paddingVertical: hp('1%'),
  },
  textDiscountAddButtonPortrait: {
    fontFamily: 'Montserrat-SemiBold',
    color: 'white',
    fontSize: hp('1.95%'),
    letterSpacing: 1.33,
    textAlign: 'center',
  },
  touchableModalDiscountAdd: {
    width: '100%',
    height: hp('6.25%'),
    marginTop: hp('4%'),
    borderRadius: 50,
    marginBottom: hp('3%'),
    alignItems: 'center',
  },
};

export default AddCustomerForm;
