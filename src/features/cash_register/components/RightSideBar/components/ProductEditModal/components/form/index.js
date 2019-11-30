import React, { Component } from 'react';
import { View, Text, Dimensions, Platform } from 'react-native';
import { FloatingTextInput } from 'components';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { SelectorDiscount } from './components/selectors';
import { ButtonCamera } from '../buttons';
import DropdownMaterialIcons from 'react-native-vector-icons/Ionicons';
import { Dropdown } from 'react-native-material-dropdown';
import ImagePicker from 'react-native-image-picker';
import { getLocalSettingRow } from '../../../../../../../../services/settings_service';
import IMMUtils from '../../../../../../../../api/IMMUtils';
import MaskedInput from '../../../../../../../payments/screens/checkout/components/pay_amount/MaskedInput';
import {
  handleNumberTextChange,
  handleDiscountTextChange,
} from './validations';
import realm from '../../../../../../../../services/realm_service';
import { cleanStr } from '../../../../../../../../api';
const isPortrait = () => {
  const dim = Dimensions.get('window');
  if (dim.height >= dim.width) {
    return true;
  } else {
    return false;
  }
};

class ProductForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isPortrait: isPortrait(),
      item: this.props.item,
    };
    this.imutil = new IMMUtils();
  }
  // componentDidMount() {
  //   this.setState({ item });
  // }
  getUnitPrice(n) {
    const parse = parseFloat(n);
    if (isNaN(n)) {
      return '';
    }
    const realValue = this.imutil.convertCostStrToDecimal(value);
    // const withoutCommas = `${n}`.split(',').join('');
    // const r = this.imutil.formatAmountRemovingDecimalPlaces(withoutCommas);
    // const c = this.imutil.costChanged(r);
    // return c;
  }
  formatZero(val) {
    if (val === 0) {
      return '';
    } else {
      return val;
    }
  }
  openImagePicker() {
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
        } else if (response.error) {
          alert('Something went wrong with this option. Try again later.');
          console.log(response.error);
        } else if (response.customButton) {
          // alert('Custom button tapped : ' + response.customButton);
        } else {
          // this.setState({
          //   imagePath: response.uri,
          //   imageHeight: response.height,
          //   imageWidth: response.width,
          // });
        }
      });
    } else {
      ImagePicker.showImagePicker(options, response => {
        if (response.didCancel) {
        } else if (response.error) {
          alert('Something went wrong with this option. Try again later.');
          console.log(response.error);
        } else if (response.customButton) {
          // alert('Custom button tapped : ' + response.customButton);
        } else {
          // this.setState({
          //   imagePath: response.uri,
          //   imageHeight: response.height,
          //   imageWidth: response.width,
          // });
        }
      });
    }
  }

  _handleDiscountSelector = (typeValue, discountValue) => {
    if (!realm.isInTransaction) {
      realm.beginTransaction();
    }

    // if (discountValue) {
    //   this.props.realmItem.discountEntered = +discountValue;
    // }
    if (typeValue) {
      this.props.realmItem.discountType = typeValue;
      this.props.update();
    }
    //this.props.realmItem.discountEntered = 0;
    this.props.clearErrors('errorDiscount');
    this.props.update();
  };

  changeItemProperty(name, value) {
    const item = { ...this.state.item, [name]: value };
    let newValue = item.unitPrice;
    // newValue = this.imutil.costChanged(newValue);
    if (newValue > 999999.99) {
      newValue = 999999.99;
    }
    // newValue = this.imutil.formatNumberWithCommas(newValue);
    // alert(JSON.stringify(vals));
    item.unitPrice = newValue;
    this.setState({
      item: {
        ...item,
        unitPrice: item.unitPrice,
      },
    });
  }

  getErrors(field) {
    switch (field) {
      case 'name':
        return this.state.item[field] == ''
          ? ['Product Name cannot be empty']
          : [];
      case 'unitPrice':
        return !+this.state.item[field] ? ['Invalid Price'] : [];
      case 'quantity':
        return !+this.state.item[field] ? ['Invalid Quantity'] : [];
      default:
        break;
    }
  }
  changeItemDiscount(v) {
    this.props.item.changeDiscount(v);
    this.setState({ item: { ...this.state.item, discountEntered: v } });
  }
  changeItemDiscountType(v) {
    this.props.item.changeDiscountType(v);
    this.setState({ item: { ...this.state.item, discountType: v } });
  }
  render() {
    const data = [
      { value: 1 },
      { value: 2 },
      { value: 3 },
      { value: 4 },
      { value: 5 },
      { value: 6 },
      { value: 7 },
      { value: 8 },
      { value: 9 },
      { value: 10 },
    ];

    return (
      <View
        style={
          this.state.isPortrait
            ? {
                width: '100%',
                paddingHorizontal: wp('4.2%'),
                paddingTop: hp('1.25%'),
              }
            : {
                width: '100%',
                paddingHorizontal: wp('1.75%'),
                paddingTop: hp('1.25%'),
              }
        }
      >
        <View
          style={{
            flexDirection: 'row',
            width: '100%',
            alignItems: 'flex-end',
          }}
        >
          <ButtonCamera
            namePhoto={this.state.item.name || ''}
            style={
              this.state.isPortrait
                ? {
                    width: wp('22%'),
                    height: hp('10.5%'),
                    borderRadius: hp('1%'),
                    borderWidth: hp('0.1%'),
                    borderColor: '#979797',
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginRight: wp('2.7%'),
                  }
                : {
                    width: wp('9%'),
                    height: hp('10.5%'),
                    borderRadius: hp('1%'),
                    borderWidth: hp('0.1%'),
                    borderColor: '#979797',
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginRight: wp('1.4%'),
                  }
            }
            onPress={() => {
              // alert('click');
            }}
          />
          <FloatingTextInput
            inputRef={input => (this.inputName = input)}
            defaultValue={this.props.realmItem.name}
            // onChangeText={this.props.item.changeName.bind(this.props.item)}
            onChangeText={v => {
              if (!realm.isInTransaction) {
                realm.beginTransaction();
              }
              const name = cleanStr(v);
              this.props.realmItem.name = name;
              this.props.clearErrors('errorName');
            }}
            onTextClear={() => {
              this.props.realmItem.name = '';
              this.props.update();
            }}
            label={'Product Name'}
            returnKeyType={'done'}
            setFocused={true}
            labelSizeUp={this.state.isPortrait ? wp('2.85%') : hp('2%')}
            labelSizeDown={this.state.isPortrait ? hp('2%') : hp('2.3%')}
            labelPlacingUp={this.state.isPortrait ? 0 : hp('2%')}
            labelPlacingDown={this.state.isPortrait ? hp('3%') : hp('5%')}
            inputContainerStyle={{ flex: 1 }}
            touched={true}
            errors={this.props.errorName}
            editProdutText={true}
            keyboardType={
              Platform.OS === 'android' ? 'email-address' : 'ascii-capable'
            }
            inputStyle={
              this.state.isPortrait
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
              this.state.isPortrait
                ? { height: hp('0.4%') }
                : { height: hp('0.4%') }
            }
            iconStyle={
              this.state.isPortrait
                ? { bottom: hp('0.1%'), zIndex: 0 }
                : { bottom: hp('0.1%'), zIndex: 0 }
            }
            iconSize={this.state.isPortrait ? hp('2.7%') : hp('3%')}
          />
        </View>
        <View
          style={{
            flexDirection: 'row',
          }}
        >
          <View
            style={{
              flexDirection: 'row',
              width: this.state.isPortrait ? wp('22%') : wp('9%'),
              marginRight: this.state.isPortrait ? wp('2.7%') : wp('1.4%'),
            }}
          >
            <FloatingTextInput
              defaultValue={`${this.formatZero(this.props.realmItem.quantity)}`}
              // onChangeText={this.props.item.changeQuantity.bind(
              //   this.props.item
              // )}
              onChangeText={v => {
                if (!realm.isInTransaction) {
                  realm.beginTransaction();
                }
                this.props.realmItem.quantity = +v;
                this.props.clearErrors('errorQuantity');
              }}
              validateQuantity={true}
              label={'Quantity'}
              setFocused={true}
              keyboardType={'numeric'}
              returnKeyType={'done'}
              errors={this.props.errorQuantity}
              editProdutText={true}
              labelSizeUp={this.state.isPortrait ? wp('2.85%') : hp('2%')}
              labelSizeDown={this.state.isPortrait ? hp('2%') : hp('2.3%')}
              labelPlacingUp={this.state.isPortrait ? 0 : hp('2%')}
              labelPlacingDown={this.state.isPortrait ? hp('3%') : hp('5%')}
              // inputContainerStyle={{backgroundColor: 'red'}}
              touched={true}
              nocancel={true}
              inputStyle={
                this.state.isPortrait
                  ? {
                      fontSize: hp('2%'),
                      height: hp('5%'),
                      marginTop: hp('2%'),
                      paddingBottom: 0,
                      textAlign: 'center',
                    }
                  : {
                      fontSize: hp('2.5%'),
                      height: hp('5%'),
                      marginTop: hp('4%'),
                      paddingBottom: 0,
                      textAlign: 'center',
                    }
              }
              underlineStyle={
                this.state.isPortrait
                  ? { height: hp('0.4%') }
                  : { height: hp('0.4%') }
              }
              iconStyle={
                this.state.isPortrait
                  ? { bottom: hp('0.1%'), zIndex: 0 }
                  : { bottom: hp('0.1%'), zIndex: 0 }
              }
              iconSize={this.state.isPortrait ? hp('2.7%') : hp('3%')}
            />
            <Dropdown
              data={data}
              value={`${this.props.realmItem.quantity}`}
              // value={`${this.props.realmItem.quantity}`}
              boxLabelStyle={{
                fontSize: 10,
                color: '#174285',
                fontFamily: 'Montserrat-SemiBold',
              }}
              textColor={'#174285'}
              style={{
                fontFamily: 'Montserrat-SemiBold',
              }}
              renderBase={() => (
                <DropdownMaterialIcons
                  color="#666"
                  style={{
                    height: hp('2.4%'),
                    position: 'absolute',
                    right: this.state.isPortrait ? wp('1.5%') : wp('0.75%'),
                    // backgroundColor: 'yellow',
                    // width: hp('2%'),
                    top: this.state.isPortrait ? hp('-0.75%') : hp('0%'),
                  }}
                  onPress={null}
                  name={'ios-arrow-down'}
                  size={hp('3%')}
                />
              )}
              // onChangeText={this.props.item.changeQuantity.bind(
              //   this.props.item
              // )}
              onChangeText={v => {
                if (!realm.isInTransaction) {
                  realm.beginTransaction();
                }
                this.props.realmItem.quantity = +v;
                this.props.update();
                this.props.clearErrors('errorQuantity');
              }}
              itemCount={3}
              containerStyle={{
                width: this.state.isPortrait ? wp('9%') : wp('2.75%'),
                height: '100%',
                justifyContent: 'center',
                //paddingLeft: stylePortraitDropdown.inputLeftPadding,
                position: 'absolute',
                right: 0,
                // backgroundColor:'green',
                zIndex: 10,
              }}
              pickerStyle={
                this.state.isPortrait
                  ? {
                      width: wp('22%'),
                      justifyContent: 'center',
                      alignItems: 'center',
                    }
                  : {
                      width: wp('9%'),
                      justifyContent: 'center',
                      alignItems: 'center',
                    }
              }
              //dropdownPosition={ dropdownPosition }
              dropdownMargins={{ min: 0, max: 0 }}
              //dropdownOffset={ dropdownOffset }
              dropdownOffset={
                this.state.isPortrait
                  ? { top: hp('10%'), left: -wp('13%') }
                  : { top: hp('11%'), left: -wp('6.2%') }
              }
              dropdownPosition={0}
              itemTextStyle={
                this.state.isPortrait
                  ? {
                      fontFamily: 'Montserrat-SemiBold',
                      fontSize: wp('3%'),
                      textAlign: 'center',
                      width: wp('22%'),
                    }
                  : {
                      fontFamily: 'Montserrat-SemiBold',
                      fontSize: hp('5%'),
                      textAlign: 'center',
                      width: wp('9%'),
                    }
              }
            />
          </View>
          <FloatingTextInput
            defaultValue={
              // ''.concat(this.state.item.unitPrice).includes('.') ?
              // `${this.state.item.unitPrice.toFixed(2)}` :
              `${this.formatZero(this.props.realmItem.unitPrice)}`
            }
            // onChangeText={this.props.item.changePrice.bind(this.props.item)}
            onChangeText={v => {
              if (!realm.isInTransaction) {
                realm.beginTransaction();
              }
              this.props.realmItem.unitPrice = +v;
              this.props.clearErrors('errorUnitPrice');
            }}
            onTextClear={() => {
              this.props.realmItem.unitPrice = 0;
              this.props.update();
            }}
            errors={this.props.errorUnitPrice}
            keyboardType={'numeric'}
            label={'Price (₹)'}
            returnKeyType={'done'}
            validatePrice={true}
            setFocused={true}
            editProdutText={true}
            labelSizeUp={this.state.isPortrait ? wp('2.85%') : hp('2%')}
            labelSizeDown={this.state.isPortrait ? hp('2%') : hp('2.3%')}
            labelPlacingUp={this.state.isPortrait ? 0 : hp('2%')}
            labelPlacingDown={this.state.isPortrait ? hp('3%') : hp('5%')}
            inputContainerStyle={{ flex: 1 }}
            touched={true}
            inputStyle={
              this.state.isPortrait
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
              this.state.isPortrait
                ? { height: hp('0.4%') }
                : { height: hp('0.4%') }
            }
            iconStyle={
              this.state.isPortrait
                ? { bottom: hp('0.1%'), zIndex: 0 }
                : { bottom: hp('0.1%'), zIndex: 0 }
            }
            iconSize={this.state.isPortrait ? hp('2.7%') : hp('3%')}
            maxLength={9}
          />
        </View>
        <View
          style={{
            marginTop: this.state.isPortrait ? hp('0.75%') : hp('1.85%'),
          }}
        >
          <SelectorDiscount
            errors={this.props.errorDiscount}
            width={'100%'}
            orientation={this.state.isPortrait}
            defaultValue={`${this.formatZero(
              this.props.realmItem.discountEntered
            )}`}
            type={this.props.realmItem.discountType}
            onSelection={this._handleDiscountSelector.bind(this)}
            onTextClear={() => {
              this.props.realmItem.discountEntered = 0;
              this.props.realmItem.discountType = '%';
              this.props.clearErrors('errorDiscount');
              this.props.update();
            }}
            // maxLength={5}
            onChangeText={v => {
              if (!realm.isInTransaction) {
                realm.beginTransaction();
              }
              const regEx =
                this.props.realmItem.discountType == '%'
                  ? /^\d{1,3}(\.\d{1,2})?$/
                  : /^\d{1,6}(\.\d{1,2})?$/;
              // // const rex = new RegExp(
              // //   /^\d{1,6}(\.\d{1,2})?$/
              // // );
              if (regEx.test(v) || v == '') {
                this.props.realmItem.discountEntered = +v;
              }
              this.props.clearErrors('errorDiscount');
            }}
            ref={discount => {
              this.discount = discount;
            }}
          />
        </View>
      </View>
    );
  }
}

export default ProductForm;
