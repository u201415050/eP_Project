import React, { Component } from 'react';
import { TextInput } from 'react-native';
import IMMUtils from 'api/IMMUtils';
export default class MaskedInput extends Component {
  constructor(props) {
    super(props);
    this.imutil = new IMMUtils();
  }
  state = {
    value: this.props.value ? this.props.value : '',
    realValue: '',
  };
  componentDidMount() {
    this._onChangeText(
      this.props.currencySymbol +
        this.imutil.costChanged(this.props.defaultValue.toFixed(2))
    );
  }

  _onChangeText(value) {
    value = value.split(this.props.currencySymbol).join('');

    const realValue = this.imutil.convertCostStrToDecimal(value);

    // alert(`${realValue} - ${this.props.maxAmount}`);
    // alert(realValue);
    if (realValue > this.props.maxAmount) return;
    if (value != '') {
      // alert(realValue + ' - ' + this.props.maxAmount);

      if (this.props.maskType == 'money') {
        // value = value.replace(/\D/g, '');
        // value =
        //   this.props.currencySymbol +
        //   value.replace(
        //     /(\d)(?=(\d{3})+(?:\.\d+)?$)/g,
        //     '$1' + this.props.currencySeparator
        //   );
        // value = this.imutil.convertCostStrToInteger(realValue);

        value = this.imutil.costChanged(value);
        value = this.imutil.formatNumberWithCommas(value);
      }

      if (this.props.maskType == 'phone') {
        if (value.length < 15) {
          value = value.replace(/\D/g, '');
          value = value.replace(/^(\d\d)(\d)/g, '($1) $2');
          value = value.replace(/(\d{4})(\d)/, '$1-$2');
        } else if (value.length == 15) {
          value = value.replace(/\D/g, '');
          value = value.replace(/^(\d\d)(\d)/g, '($1) $2');
          value = value.replace(/(\d{5})(\d)/, '$1-$2');
        } else {
          value = value.substring(0, value.length - 1);
        }
      }
      if (this.props.onChangeValue) {
        this.props.onChangeValue(realValue);
      }
    }

    this.setState({ value: value, realValue });
  }

  render() {
    return (
      <TextInput
        keyboardType={'number-pad'}
        returnKeyType={'done'}
        {...this.props}
        value={this.state.value}
        onChangeText={value => this._onChangeText(value)}
      />
    );
  }
}
