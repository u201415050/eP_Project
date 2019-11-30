import React, { Component } from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  TextInput,
  DatePickerAndroid,
  TimePickerAndroid,
  Image,
} from 'react-native';
import {
  FloatingTextInput,
  ButtonGradientOutline,
  ButtonGradient,
} from 'components';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { isTablet } from '../../../../../invoice/constants/isLandscape';
// import ButtonGradient from '../../../../../invoice/components/buttons/buttonGradientColor/ButtonGradient';
import moment from 'moment';
import CalendarDate from '../../../../../../components_general/utilities/calendarDate';

class FormUPI extends Component {
  state = {
    VirtualAddress: '',
    Remark: '',
    DateValue: moment(),
    Time: '',
    errors: {},
    now: true,
    dateSelected: moment(),
    calendar: false,
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
    if (this.state.VirtualAddress === '') {
      errors['VirtualAddress'] = ['Virtual Address cannot be empty'];
    }
    if (this.state.Remark === '') {
      errors['Remark'] = ['Remark cannot be empty'];
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
      let today = new Date();
      today.setDate(today.getDate() + 6);
      const { action, year, month, day } = await DatePickerAndroid.open({
        date: new Date(),
        minDate: new Date(),
        maxDate: today,
      });
      if (action !== DatePickerAndroid.dismissedAction) {
        this.setState({ DateValue: `${day}/${month + 1}/${year}` });

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
        is24Hour: false,
        // Will display '2 PM'
      });
      if (action !== TimePickerAndroid.dismissedAction) {
        this.setState({
          Time: `${hour > 12 ? hour - 12 : hour}:${
            minute < 10 ? 0 : ''
          }${minute} ${hour > 12 ? 'PM' : 'AM'}`,
        });

        this.timeInput._changeText(
          `${hour > 12 ? hour - 12 : hour}:${minute < 10 ? 0 : ''}${minute} ${
            hour >= 12 ? 'PM' : 'AM'
          }`
        );
      }
    } catch ({ code, message }) {
      console.warn('Cannot open time picker', message);
    }
  };
  collectNow(callback) {
    this.setState({ now: true }, () => {
      callback();
    });
  }
  renderCollectButtons() {
    const collectNowRef = this.props.onCollect;
    return (
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          width: '100%',
          justifyContent: 'space-between',
          marginTop: hp('4%'),
          marginBottom: hp('1%'),
        }}
      >
        <View style={{ width: isTablet ? '45%' : wp('40%') }}>
          {this.state.now ? (
            <ButtonGradient
              onPress={() => this.collectNow(collectNowRef)}
              labelSize={isTablet ? hp('2%') : wp('2.5%')}
              style={{ height: hp('6%'), width: '100%' }}
              firstColor={'#114B8C'}
              secondColor={'#0079AA'}
              title="COLLECT NOW"
              absolute={true}
            />
          ) : (
            <ButtonGradientOutline
              onPress={() => this.collectNow(collectNowRef)}
              labelSize={isTablet ? hp('2%') : wp('2.5%')}
              style={{ height: hp('6%'), width: '100%' }}
              firstColor={'#114B8C'}
              secondColor={'#0079AA'}
              title="COLLECT NOW"
              absolute={true}
            />
          )}
        </View>

        <View style={{ width: isTablet ? '45%' : wp('40%') }}>
          {this.state.now ? (
            <ButtonGradientOutline
              onPress={() => {
                this.setState({ now: false });
              }}
              labelSize={isTablet ? hp('2%') : wp('2.5%')}
              style={{ height: hp('6%'), width: '100%' }}
              firstColor={'#114B8C'}
              secondColor={'#0079AA'}
              title="COLLECT LATER"
              absolute={true}
            />
          ) : (
            <ButtonGradient
              onPress={() => {
                this.setState({ now: false });
              }}
              labelSize={isTablet ? hp('2%') : wp('2.5%')}
              style={{ height: hp('6%'), width: '100%' }}
              firstColor={'#114B8C'}
              secondColor={'#0079AA'}
              title="COLLECT LATER"
              absolute={true}
            />
          )}
        </View>
      </View>
    );
  }
  render() {
    const {
      VirtualAddress,
      DateValue,
      Remark,
      Time,
      UserLastName,
      Anniversary,
      DateBirth,
      errors,
      UserMobileNumber,
    } = this.state;
    return (
      <View style={styles.formContainer}>
        <View style={{ marginBottom: hp('2%') }}>
          <FloatingTextInput
            label={'Virtual Address'}
            value={VirtualAddress}
            onChangeText={val => this._textChange('VirtualAddress', val)}
            // onSubmitEditing={this._checkEmail}
            // onBlur={this._checkEmail}
            errors={VirtualAddress ? errors.VirtualAddress : [] || []}
            autoCapitalize={'none'}
            labelSizeUp={!isTablet ? hp('1.8%') : hp('2.2%')}
            labelSizeDown={!isTablet ? hp('2.1%') : hp('2.7%')}
            labelPlacingUp={0}
            labelPlacingDown={!isTablet ? hp('4%') : hp('5%')}
            inputContainerStyle={
              !isTablet ? { height: hp('8%') } : { height: hp('9.1%') }
            }
            inputStyle={
              !isTablet
                ? {
                    fontSize: hp('2.1%'),
                    height: hp('5%'),
                    marginTop: hp('3%'),
                    paddingBottom: 0,
                  }
                : {
                    fontSize: hp('2.7%'),
                    height: hp('6.9%'),
                    marginTop: hp('3%'),
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
            iconSize={!isTablet ? hp('3%') : hp('3.8%')}
          />
        </View>
        <View>
          <FloatingTextInput
            label={'Remark'}
            value={Remark}
            onChangeText={val => this._textChange('Remark', val)}
            errors={errors.Remark || []}
            autoCapitalize={'none'}
            labelSizeUp={!isTablet ? hp('1.8%') : hp('2.2%')}
            labelSizeDown={!isTablet ? hp('2.1%') : hp('2.7%')}
            labelPlacingUp={0}
            labelPlacingDown={!isTablet ? hp('4%') : hp('5%')}
            inputContainerStyle={
              !isTablet ? { height: hp('8%') } : { height: hp('9.1%') }
            }
            inputStyle={
              !isTablet
                ? {
                    fontSize: hp('2.1%'),
                    height: hp('5%'),
                    marginTop: hp('3%'),
                    paddingBottom: 0,
                  }
                : {
                    fontSize: hp('2.7%'),
                    height: hp('6.9%'),
                    marginTop: hp('3%'),
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
            iconSize={!isTablet ? hp('3%') : hp('3.8%')}
          />
        </View>
        {this.renderCollectButtons()}
        {!this.state.now ? (
          <View style={{ marginBottom: hp('2%') }}>
            <FloatingTextInput
              disabled={true}
              label={'Date'}
              value={DateValue.format('DD-MM-YYYY')}
              autoCapitalize={'none'}
              ref={input => {
                this.dateInput = input;
              }}
              nocancel={true}
              labelSizeUp={!isTablet ? hp('1.8%') : hp('2.2%')}
              labelSizeDown={!isTablet ? hp('2.1%') : hp('2.7%')}
              labelPlacingUp={0}
              labelPlacingDown={!isTablet ? hp('4%') : hp('5%')}
              inputContainerStyle={
                !isTablet ? { height: hp('8%') } : { height: hp('9.1%') }
              }
              inputStyle={
                !isTablet
                  ? {
                      fontSize: hp('2.1%'),
                      height: hp('5%'),
                      marginTop: hp('3%'),
                      paddingBottom: 0,
                    }
                  : {
                      fontSize: hp('2.7%'),
                      height: hp('6.9%'),
                      marginTop: hp('3%'),
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
              iconSize={!isTablet ? hp('3%') : hp('3.8%')}
            />
            <TouchableOpacity
              style={{
                position: 'absolute',
                right: hp('1.6%'),
                bottom: hp('1.5%'),
              }}
              onPress={() => this.setState({ calendar: true })}
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
        ) : null}
        {!this.state.now ? (
          <View>
            <FloatingTextInput
              disabled={true}
              label={'Time'}
              value={Time}
              autoCapitalize={'none'}
              ref={input => {
                this.timeInput = input;
              }}
              nocancel={true}
              labelSizeUp={!isTablet ? hp('1.8%') : hp('2.2%')}
              labelSizeDown={!isTablet ? hp('2.1%') : hp('2.7%')}
              labelPlacingUp={0}
              labelPlacingDown={!isTablet ? hp('4%') : hp('5%')}
              inputContainerStyle={
                !isTablet ? { height: hp('8%') } : { height: hp('9.1%') }
              }
              inputStyle={
                !isTablet
                  ? {
                      fontSize: hp('2.1%'),
                      height: hp('5%'),
                      marginTop: hp('3%'),
                      paddingBottom: 0,
                    }
                  : {
                      fontSize: hp('2.7%'),
                      height: hp('6.9%'),
                      marginTop: hp('3%'),
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
              iconSize={!isTablet ? hp('3%') : hp('3.8%')}
            />
            <TouchableOpacity
              style={{
                position: 'absolute',
                right: hp('1.6%'),
                bottom: hp('1.5%'),
              }}
              onPress={() => this.setTime()}
            >
              <Image
                style={{
                  tintColor: '#174285',
                  height: hp('3%'),
                  width: hp('3%'),
                }}
                source={require('../../../../assets/icons/transactions.png')}
              />
            </TouchableOpacity>
          </View>
        ) : null}
        <CalendarDate
          active={this.state.calendar}
          closeModal={() => this.setState({ calendar: false })}
          minDate={moment()}
          maxDate={moment().add(6, 'days')}
          currentDate={this.state.DateValue.format('YYYY-MM-DD')}
          dateSelected={this.state.dateSelected}
          onDayPress={date => this.setState({ dateSelected: date })}
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

export default FormUPI;
