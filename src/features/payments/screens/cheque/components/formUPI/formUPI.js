import React, { Component } from 'react';
import {
  View,
  TouchableOpacity,
  DatePickerAndroid,
  TimePickerAndroid,
  Image,
  Dimensions,
} from 'react-native';
import { FloatingTextInput } from 'components';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { isTablet } from '../../../../../invoice/constants/isLandscape';
import moment from 'moment';
import { styleLandscape, style } from './styles/styles';
import CalendarDate from '../../../../../../components_general/utilities/calendarDate';

const isPortrait = () => {
  const dim = Dimensions.get('window');
  if (dim.height >= dim.width) {
    return true;
  } else {
    return false;
  }
};

class FormUPI extends Component {
  state = {
    ChequeNumber: '',
    BankName: '',
    DateValue: moment(),
    Time: '',
    errors: {},
    calendar: false,
    dateSelected: moment(),
    orientation: isPortrait(),
  };

  _checkEmail = () => {
    const { VirtualAddress } = this.state;
    let allow =
      VirtualAddress.indexOf('@') > 0 &&
      VirtualAddress.indexOf('@') < VirtualAddress.length - 1 &&
      (VirtualAddress.indexOf('.') > 0 &&
        VirtualAddress.indexOf('.') < VirtualAddress.length - 1 &&
        VirtualAddress.indexOf('.') > VirtualAddress.indexOf('@'));

    if (VirtualAddress === '' || !allow) {
      return this.setState({
        errors: {
          ...(this.state.errors || {}),
          VirtualAddress: ['Enter a valid virtual address'],
        },
      });
    }
  };

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
      // this.formIsValid();

      this.props.onChangeForm(newPayload);
    }
  };

  formIsValid = () => {
    const errors = {};
    if (this.state.ChequeNumber === '') {
      errors['ChequeNumber'] = ['Cheque Number cannot be empty'];
    }
    if (this.state.BankName === '') {
      errors['BankName'] = ['Bank Name cannot be empty'];
    }
    if (this.state.DateValue === '') {
      errors['Date'] = ['Date name cannot be empty'];
    }
    if (this.state.Time === '') {
      errors['Time'] = ['Time number cannot be empty'];
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
        console.log(errors);
        this.props.isValid(valid);
      }
    );
  };

  _changePhone = value => {
    const errors = this.state.errors;
    errors['mobile'] = [];
    this.setState({
      CountryCode: value.alpha2Code,
      UserMobileNumber: value.phone,
      CallingCode: value.callingCode,
      errors,
    });
    this._changeForm({
      ...this.state,
      CountryCode: value.alpha2Code,
      UserMobileNumber: value.phone,
    });
  };
  _onTextClear(key) {
    const errors = this.state.errors;
    errors[key] = [];
    this.setState({
      errors,
    });
  }
  setDate = async () => {
    try {
      const { action, year, month, day } = await DatePickerAndroid.open({
        date: new Date(),
        minDate: moment()
          .subtract(3, 'month')
          .add(1, 'day')
          .toDate(),
        maxDate: moment()
          .add(3, 'month')
          .subtract(1, 'day')
          .toDate(),
      });
      if (action !== DatePickerAndroid.dismissedAction) {
        this.setState({ DateValue: `${day}/${month + 1}/${year}` }, () => {
          this._changeForm(this.state);
        });

        this.dateInput._changeText(`${day}/${month + 1}/${year}`);
      }
    } catch ({ code, message }) {
      console.warn('Cannot open date picker', message);
    }
  };
  setTime = async () => {
    try {
      const { action, hour, minute } = await TimePickerAndroid.open({
        hour: 14,
        minute: 0,
        is24Hour: false, // Will display '2 PM'
      });
      if (action !== TimePickerAndroid.dismissedAction) {
        this.setState({ Time: `${hour}:${minute}` });

        this.timeInput._changeText(`${hour}:${minute < 10 ? 0 : ''}${minute}`);
      }
    } catch ({ code, message }) {
      console.warn('Cannot open time picker', message);
    }
  };

  render() {
    const {
      ChequeNumber,
      DateValue,
      BankName,
      Time,
      UserLastName,
      Anniversary,
      DateBirth,
      errors,
      UserMobileNumber,
      orientation,
    } = this.state;
    const styleCalendar = isTablet ? styleLandscape : style;
    return (
      <View
        style={[
          styles.formContainer,
          orientation ? { height: hp('33%') } : { height: hp('30%') },
        ]}
      >
        <View style={{ flex: 1 }}>
          <FloatingTextInput
            label={'Cheque Number'}
            value={ChequeNumber}
            onChangeText={val => this._textChange('ChequeNumber', val)}
            onSubmitEditing={() => {}}
            onBlur={() => {}}
            onlyNumbers={true}
            keyboardType={'number-pad'}
            returnKeyType={'done'}
            errors={errors.ChequeNumber || []}
            autoCapitalize={'none'}
            labelSizeUp={orientation ? hp('1.5%') : hp('2%')}
            labelSizeDown={orientation ? hp('2%') : hp('2.3%')}
            labelPlacingUp={orientation ? 0 : hp('2%')}
            labelPlacingDown={orientation ? hp('3%') : hp('5%')}
            inputContainerStyle={
              orientation ? { height: hp('3%') } : { height: hp('7%') }
            }
            inputStyle={
              orientation
                ? {
                    fontSize: hp('2%'),
                    height: hp('5%'),
                    marginTop: hp('2%'),
                    paddingBottom: 0,
                  }
                : {
                    fontSize: hp('2.5%'),
                    height: hp('5%'),
                    marginTop: hp('4%'),
                    paddingBottom: 0,
                  }
            }
            underlineStyle={
              orientation ? { height: hp('0.4%') } : { height: hp('0.4%') }
            }
            iconStyle={
              orientation
                ? { bottom: hp('0.1%'), zIndex: 0 }
                : { bottom: hp('0.1%'), zIndex: 0 }
            }
            iconSize={orientation ? hp('2.7%') : hp('3%')}
          />
        </View>
        <View style={{ flex: 1 }}>
          <FloatingTextInput
            label={'Bank Name'}
            value={BankName}
            onChangeText={val => this._textChange('BankName', val)}
            errors={errors.BankName || []}
            autoCapitalize={'none'}
            labelSizeUp={orientation ? hp('1.5%') : hp('2%')}
            labelSizeDown={orientation ? hp('2%') : hp('2.3%')}
            labelPlacingUp={orientation ? 0 : hp('2%')}
            labelPlacingDown={orientation ? hp('3%') : hp('5%')}
            inputContainerStyle={
              orientation ? { height: hp('3%') } : { height: hp('7%') }
            }
            inputStyle={
              orientation
                ? {
                    fontSize: hp('2%'),
                    height: hp('5%'),
                    marginTop: hp('2%'),
                    paddingBottom: 0,
                  }
                : {
                    fontSize: hp('2.5%'),
                    height: hp('5%'),
                    marginTop: hp('4%'),
                    paddingBottom: 0,
                  }
            }
            underlineStyle={
              orientation ? { height: hp('0.4%') } : { height: hp('0.4%') }
            }
            iconStyle={
              orientation
                ? { bottom: hp('0.1%'), zIndex: 0 }
                : { bottom: hp('0.1%'), zIndex: 0 }
            }
            iconSize={orientation ? hp('2.7%') : hp('3%')}
          />
        </View>
        <View style={{ flex: 1 }}>
          <FloatingTextInput
            disabled={true}
            label={'Date'}
            value={DateValue.format('DD-MM-YYYY')}
            autoCapitalize={'none'}
            ref={input => {
              this.dateInput = input;
            }}
            nocancel={true}
            labelSizeUp={orientation ? hp('1.5%') : hp('2%')}
            labelSizeDown={orientation ? hp('2%') : hp('2.3%')}
            labelPlacingUp={orientation ? 0 : hp('2%')}
            labelPlacingDown={orientation ? hp('3%') : hp('5%')}
            inputContainerStyle={
              orientation ? { height: hp('3%') } : { height: hp('7%') }
            }
            inputStyle={
              orientation
                ? {
                    fontSize: hp('2%'),
                    height: hp('5%'),
                    marginTop: hp('2%'),
                    paddingBottom: 0,
                  }
                : {
                    fontSize: hp('2.5%'),
                    height: hp('5%'),
                    marginTop: hp('4%'),
                    paddingBottom: 0,
                  }
            }
            underlineStyle={
              orientation ? { height: hp('0.4%') } : { height: hp('0.4%') }
            }
            iconStyle={
              this.state.orientation
                ? { bottom: hp('0.1%'), zIndex: 0 }
                : { bottom: hp('0.1%'), zIndex: 0 }
            }
            iconSize={this.state.orientation ? hp('3%') : hp('3.8%')}
          />
          <TouchableOpacity
            style={{
              position: 'absolute',
              right: orientation ? wp('2%') : wp('0.75%'),
              bottom: orientation ? hp('4.75%') : hp('2%'),
            }}
            onPress={() => this.setState({ calendar: true })} //this.setDate()}
          >
            <Image
              style={{
                tintColor: '#174285',
                height: hp('2.9%'),
                width: hp('2.9%'),
              }}
              source={require('../../../../../modal_customer/assets/icons/calendar.png')}
            />
          </TouchableOpacity>
        </View>
        <CalendarDate
          active={this.state.calendar}
          closeModal={() => this.setState({ calendar: false })}
          minDate={moment()
            .subtract(3, 'month')
            .add(1, 'day')}
          maxDate={moment()
            .add(3, 'month')
            .subtract(1, 'day')}
          currentDate={this.state.DateValue.format('YYYY-MM-DD')}
          dateSelected={this.state.dateSelected}
          onDayPress={date =>
            this.setState({ DateValue: moment(date), dateSelected: date })
          }
          handleCancel={() => {
            this.setState(
              {
                calendar: false,
                DateValue:
                  this.state.DateValue != ''
                    ? this.state.DateValue
                    : moment().format('DD-MM-YYYY'),
                dateSelected:
                  this.state.DateValue != ''
                    ? moment(this.state.DateValue, 'DD-MM-YYYY')
                    : moment(),
              },
              () => {
                this._changeForm(this.state);
                this.dateInput._changeText(
                  this.state.dateSelected.format('DD-MM-YYYY')
                );
              }
            );
          }}
          handleOk={() => {
            this.setState(
              {
                calendar: false,
                DateValue: this.state.dateSelected,
              },
              () => {
                this._changeForm(this.state);
                this.dateInput._changeText(
                  this.state.dateSelected.format('DD-MM-YYYY')
                );
              }
            );
          }}
        />
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
    // paddingVertical: hp('1%'),
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

export default FormUPI;