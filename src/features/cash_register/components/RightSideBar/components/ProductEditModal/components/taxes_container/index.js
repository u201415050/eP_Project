import React, { Component } from 'react';
import { View, Dimensions, Text } from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import RadioButtonGroup from './components/radio_button_group';
import TaxInput from './components/tax_input';
import { styles as portraitStyles } from './styles/portrait';
import { styles as landscapeStyles } from './styles/landscape';
import realm from '../../../../../../../../services/realm_service';

const isPortrait = () => {
  const dim = Dimensions.get('window');
  if (dim.height >= dim.width) {
    return true;
  } else {
    return false;
  }
};
class TaxesContainer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isPortrait: isPortrait(),
      type: 'intrastate',
    };
    // this.taxes = Array.from(realm.objects('Tax'));
    this.taxes = Array.from(realm.objects('RealmTax'));
    // this.taxes.values = JSON.parse(this.taxes.values)
    // alert(
    //   JSON.stringify(
    //     // this.taxes
    //     this.getTax('CGST').values//.map(x => ({ value: x.value }))
    //   )
    // );
    // console.log({ TAXES_X: this.getTaxValues('IGST') });
  }
  getTax(name) {
    const tax = this.taxes.find(x => x.name === name);
    return {
      ...tax,
      values: Array.from(JSON.parse(tax.values)),
    };
  }
  getTaxValues(name) {
    const tax = this.taxes.find(x => x.name === name);
    if (tax) {
      return Array.from(tax.slabs).map(value => ({ value }));
    }
    return [];
  }
  formatZero(val) {
    if (val === 0) {
      return '';
    } else {
      return val;
    }
  }
  validate = (newText, callback) => {
    if (
      /^\d{1,2}(\.\d{1,2})?$/.test(newText) ||
      /^\d{1,2}\.?$/.test(newText) ||
      /^\d{1,2}$/.test(newText) ||
      newText == ''
    ) {
      callback();
    }
  };
  changeTax(name, value, item) {
    const tax = item.tax;
    const filter = tax.filter(x => x.name !== name);

    item.tax = [
      ...filter,
      {
        calculatedTaxValue: 0,
        id: 0,
        name: name,
        taxServiceIncluded: 0,
        taxType: 'Exclusive',
        value: value,
        taxMode: '%', // CHANGE FOR VALUE IN OBJECT
      },
    ];
    // alert(JSON.stringify(item.tax));
  }
  render() {
    const styles = this.state.isPortrait ? portraitStyles : landscapeStyles;

    return (
      <View
        style={{
          width: '100%',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: '#EEEEEE',
          borderTopColor: '#A4A4A4',
          borderTopWidth: hp('0.35'),
          borderLeftColor: '#BDBDBD',
          borderLeftWidth: this.state.isPortrait ? wp('0.4') : wp('0.2'),
          borderRightColor: '#BDBDBD',
          borderRightWidth: this.state.isPortrait ? wp('0.4') : wp('0.2'),
          borderBottomColor: '#DEDCDC',
          borderBottomWidth: hp('0.15'),
          paddingHorizontal: this.state.isPortrait ? wp('4.2%') : wp('1.6%'),
          marginBottom: hp('1.5%'),
          paddingTop: hp('1.75%'),
          paddingBottom: hp('1.6%'),
        }}
      >
        {// this.props.taxType == 'GST'?
        this.props.realmItem.isGst() ? (
          <View style={{ width: '100%' }}>
            <RadioButtonGroup
              realmItem={this.props.realmItem}
              item={this.props.item}
              update={this.props.update}
            />
            <View
              style={[
                { marginTop: hp('1.2%'), marginBottom: hp('0.75%') },
                { width: '100%' },
              ]}
            >
              {/* <Text>{this.props.item.getTaxValue('GST')}</Text> */}
              {!this.props.realmItem.isInterstate() && (
                <TaxInput
                  label={'SGST & CGST'}
                  value={this.props.realmItem.getSelectedTaxValue('SGST') * 2}
                  onChangeText={v => {
                    this.props.realmItem.addSgstAndCgst(v);
                  }}
                  style={styles.dropdown}
                  input={'dropdown'}
                  items={this.props.realmItem.getTaxValues('SGST')}
                  dropdownOffset={
                    this.state.isPortrait
                      ? { top: hp('6.5'), left: 0 }
                      : { top: hp('6.5'), left: 0 }
                  }
                  dropdownPosition={0}
                />
              )}
              {this.props.realmItem.isInterstate() && (
                <TaxInput
                  label={'IGST'}
                  value={this.props.realmItem.getSelectedTaxValue('IGST')}
                  onChangeText={v => this.props.realmItem.addIgst(v)}
                  style={styles.dropdown}
                  input={'dropdown'}
                  items={this.props.realmItem.getTaxValues('IGST')}
                  dropdownOffset={
                    this.state.isPortrait
                      ? { top: hp('6.5'), left: 0 }
                      : { top: hp('6.5'), left: 0 }
                  }
                  dropdownPosition={0}
                />
              )}
            </View>
            <View>
              <TaxInput
                inputRef={input => {
                  this.cessInput = input;
                }}
                value={
                  // this.getTax('CESS')
                  // ? `${this.formatZero(
                  //     this.getTax('CESS', this.props.item.taxes).enteredValue
                  //   )}`
                  // : ''
                  `${this.formatZero(
                    this.props.realmItem.getSelectedTaxValue('CESS') || 0
                  )}`
                }
                onChangeText={v => {
                  // this.validate(v, () => this.props.item.addCessTax(+v));
                  // this.changeTax('CESS', v, this.props.item);
                  if (v === '') {
                    this.props.realmItem.removeTax(['CESS']);
                  }
                  const rex = new RegExp(
                    /^99.9$|^[0-9]{1,2}$|^[0-9]{1,2}\.[0-9]{1,3}$/
                  );
                  if (rex.test(v)) {
                    this.props.realmItem.addCess(v);
                  }
                }}
                actionButton={() => {
                  this.props.realmItem.removeTax(['CESS']);
                  // this.props.item.removeTax('CESS');
                  // this.forceUpdate();
                  // this.props.item.addCessTax(0);
                }}
                label={'CESS'}
                style={styles.textInput}
                maximumLength={5}
                input={'textInput'}
                error={this.state.errorTaxCess}
              />
            </View>
          </View>
        ) : (
          <View style={{ width: '100%' }}>
            <TaxInput
              inputRef={input => {
                this.vatInput = input;
              }}
              defaultValue={`${this.formatZero(
                this.props.realmItem.getSelectedTaxValue('VAT') || 0
              )}`}
              onChangeText={v => {
                // this.validate(v, () =>
                //   this.props.item.addVatTax(this.props.item.taxInfo.type, +v)
                // );
                // if (v === '') {
                //   this.props.realmItem.removeTax(['VAT']);
                // }
                const rex = new RegExp(
                  /^99.9$|^[0-9]{1,2}$|^[0-9]{1,2}\.[0-9]{1,3}$/
                );
                if (rex.test(v) || v == '') {
                  this.props.realmItem.addVat(v);
                }
                this.props.cleanTaxes('errorVat');
              }}
              actionButton={() => {
                this.props.realmItem.removeTax(['VAT']);
              }}
              label={'VAT'}
              style={styles.textInput}
              maximumLength={5}
              input={'textInput'}
              error={this.props.errorVat}
            />
          </View>
        )}
      </View>
    );
  }
}

export default TaxesContainer;
