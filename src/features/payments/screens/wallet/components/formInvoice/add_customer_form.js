import React, { Component } from 'react';
import { View, TouchableOpacity, Text, TextInput } from 'react-native';
import { FloatingTextInput } from 'components';
import { PhoneInput } from 'components';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import LinearGradient from 'react-native-linear-gradient';
import * as userService from '../../../../../../services/user_service';
class AddCustomerForm extends Component {
  state = {
    Username: '',
    Password: '',
    UserFirstName: '',
    UserLastName: '',
    UserMobileNumber: this.props.numberCustomer,
    CountryCode: '',
    Anniversary: '',
    otpType: 1,
    DateBirth: '',
    errors: {},
  };

  _checkEmail() {
    const { Username } = this.state;
    if (Username === '') {
      return this.setState({
        errors: {
          ...(this.state.errors || {}),
          Username: ['Enter a valid e-mail address'],
        },
      });
    }
  }

  _changePhone = value => {
    this.props.onChangeForm({
      UserMobileNumber: value.phone,
    });
    this.setState({
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
  render() {
    const {
      Username,
      Password,
      UserFirstName,
      UserLastName,
      Anniversary,
      DateBirth,
      errors,
      UserMobileNumber,
    } = this.state;
    return (
      <View style={styles.formContainer}>
        <View>
          <PhoneInput
            disabled={this.props.disabled}
            label={'Mobile Number'}
            onTextClear={this._onTextClear.bind(this, 'mobile')}
            onChange={this._changePhone}
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
