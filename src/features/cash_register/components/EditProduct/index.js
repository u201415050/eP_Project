import React, { Component } from 'react';
import {
  View,
  KeyboardAvoidingView,
  Switch,
  Dimensions,
  AsyncStorage,
} from 'react-native';
import { Card } from '../cards';
import { FloatingTextEditProductInput } from './components/text_inputs/index';
import {
  ButtonGradient,
  ButtonOutline,
  ButtonCamera,
} from './components/buttons';
import { SelectorDiscount } from './components/selectors/index';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';

//REDUX IMPLEMENTATION
import { connect } from 'react-redux';
import { editProductAction } from './actions';

import { cashActions } from '../../actions';
import TextMontserrat from '../../../forgot_password/components/texts/textMontserrat';

import ToggleIcon from '../toggle_icon/toggle_icon';
import { RadioGroup, RadioButton } from 'react-native-flexi-radio-button';
import TaxInput from './components/taxes_inputs/index';

import { BorderShadow } from 'react-native-shadow';
import CustomItemHelper from '../../../../factory/custom_item_helper';

const isPortrait = () => {
  const dim = Dimensions.get('window');
  if (dim.height >= dim.width) {
    return true;
  } else {
    return false;
  }
};

class EditProduct extends Component {
  constructor(props) {
    super(props);
    const item = this.props.item;
    this.tempItem = new CustomItemHelper();
    this.tempItem.quantity = item.quantity;
    this.tempItem.unitPrice = item.unitPrice;
    this.tempItem.name = item.name;
    this.tempItem.discountEntered = item.discountEntered;
    this.state.tempItem = this.tempItem;
  }

  state = {
    orientation: isPortrait(),

    rupeeSign: '₹',
    name: '',
    quantity: '',
    price: '',
    discount: '',
    discountType: '%',
    image: '',

    tempName: '',
    tempQuantity: '',
    tempDiscount: '',
    tempImage: '',

    products: [],
    //error vars
    ename: false,
    equantity: false,
    eprice: false,
    ediscount: false,
    allow: false,
    emessage: { name: '', quantity: '', price: '', discount: '' },
    marginBottom: 0,

    selectedRadioButton: 0,
    gst: false,
    vat: false,
    gstUpdateHeight: 0, // when product is brought from saved transactions
    vatUpdateHeight: 0, // when product is brought from saved transactions
    taxContainerHeight: 0,
    intStateTax: 'SGST & CGST',
    cess: 0,

    taxes: [],
    dropdownTaxesItems: [],

    // intTaxPercentage: this.props.item.cgst !== '' && parseFloat(this.props.item.cgst) !== 0 ? parseInt(this.props.item.cgst*2) : 5,
    // cessPercentage: this.props.item.cess !== '' && parseFloat(this.props.item.cess) !== 0 ? parseInt(this.props.item.cess) : 0,
    // vatPercentage: this.props.item.vat !== '' && parseFloat(this.props.item.vat) !== 0 ? parseFloat(this.props.item.vat) : 0,

    intTaxPercentage: '',
    cessPercentage: '',
    vatPercentage: '',

    errorTaxCess: false,
    errorTaxVat: false,
  };

  onSelectRadio(index, value) {
    this.setState({
      intStateTax: value,
    });
  }

  setCgstAsItems = () => {
    this.setState({
      selectedRadioButton: 0,
      dropdownTaxesItems: this.state.taxes
        .filter(function(item) {
          return item.taxName === 'CGST';
        })
        .map(function(item) {
          return item.slabs;
        })[0],
    });
  };

  setIgstAsItems = () => {
    this.setState({
      selectedRadioButton: 1,
      dropdownTaxesItems: this.state.taxes
        .filter(function(item) {
          return item.taxName === 'IGST';
        })
        .map(function(item) {
          return item.slabs;
        })[0],
    });
  };

  componentDidMount() {
    AsyncStorage.getItem('taxes').then(res => {
      const taxesParsed = JSON.parse(res);
      this.setState({
        taxes: taxesParsed,
        dropdownTaxesItems: taxesParsed[0]['slabs'],
      });
    });

    const product = this.props.item;
    console.log('EDIT PRODUCT', product);

    this.setState({
      name: this.props.item.name,
      quantity: this.props.item.quantity,
      price: this.props.item.unitPrice,
      discount:
        parseFloat(product.discount).toFixed(2) != '0.00' &&
        product.discount != ''
          ? product.discount
          : '',
      discountType: product.type || '%',
    });

    // if (
    //   (product.igst != '' && parseFloat(product.igst) !== 0) ||
    //   (product.cgst != '' && parseFloat(product.cgst) !== 0) ||
    //   (product.sgst != '' && parseFloat(product.sgst) !== 0) ||
    //   (product.cess != '' && parseFloat(product.cess) !== 0)
    // ) {
    //   if (product.cgst !== '' || parseFloat(product.cgst) !== 0) {
    //     this.setCgstAsItems();
    //     this.setState({
    //       gst: true,
    //       vat: false,
    //       selectedRadioButton: 0,
    //       taxContainerHeight: hp('24.4%'),
    //       intTaxPercentage:
    //         product.cgst !== '' && parseFloat(product.cgst) !== 0
    //           ? parseInt(product.cgst * 2)
    //           : 5,
    //       cessPercentage:
    //         product.cess !== '' && parseFloat(product.cess) !== 0
    //           ? parseFloat(product.cess)
    //           : 0,
    //       vatPercentage: 0,
    //       intStateTax: 'SGST & CGST',
    //       gstUpdateHeight: hp('24.4%'),
    //     });
    //   } else {
    //     this.setIgstAsItems();
    //     this.setState({
    //       gst: true,
    //       vat: false,
    //       selectedRadioButton: 1,
    //       taxContainerHeight: hp('24.4%'),
    //       intTaxPercentage:
    //         product.igst !== '' && parseFloat(product.igst) !== 0
    //           ? parseInt(product.igst)
    //           : 5,
    //       cessPercentage:
    //         product.cess !== '' && parseFloat(product.cess) !== 0
    //           ? parseFloat(product.cess)
    //           : 0,
    //       vatPercentage: 0,
    //       intStateTax: 'IGST',
    //       gstUpdateHeight: hp('24.4%'),
    //     });
    //   }
    // } else if (product.vat !== '' && parseFloat(product.vat) !== 0) {
    //   this.setState({
    //     gst: false,
    //     vat: true,
    //     taxContainerHeight: hp('10.4%'),
    //     intTaxPercentage: 0,
    //     cessPercentage: 0,
    //     vatPercentage:
    //       product.vat !== '' && parseFloat(product.vat) !== 0
    //         ? parseFloat(product.vat)
    //         : 0,
    //     vatUpdateHeight: hp('10.4%'),
    //   });
    // }

    // if (this.state.tempItem.gstType === 'GST') {
    //   this.props.addingHeight(hp('23%'));
    // } else if (this.state.tempItem.gstType === 'VAT') {
    //   this.props.addingHeight(hp('10.25%'));
    // }
    console.log('FIRST STATE EDIT PRODUCT', this.state);
  }

  componentDidUpdate() {
    console.log('DIDUPDATE EDIT PRODUCT', this.state);
  }

  _handleDiscountSelector = (typeValue, discountValue) => {
    this.tempItem.discountType = typeValue;
    this.tempItem.discountEntered = +discountValue;
    this.setState({ tempItem: this.tempItem });
  };

  _handleTaxText = (key, value) => {
    this.setState({ key: value });
  };

  render() {
    const {
      containerStyle,
      contentWidth,
      cameraButtonContainer,
      buttonIconSize,
      cameraButtonAction,
      productNameInputSize,
      quantityInputSize,
      priceInputSize,
      discountSelectorSize,
      cancelButtonStyle,
      cancelButtonAction,
      saveButtonStyle,
      saveButtonAction,
      imageSource,
      imageAtributes,
    } = this.props;

    const orientation = this.state.orientation;

    const saveButtonTextStyle = {
      fontWeight: '700',
      fontSize: hp('1.85%'),
      color: '#fff',
      letterSpacing: wp('0.25%'),
    };
    const cancelButtonTextStyle = {
      fontWeight: '700',
      fontSize: hp('1.85%'),
      color: '#b30000',
      letterSpacing: wp('0.25%'),
    };

    ejemplo = () => {
      alert(
        this.name.state.value +
          ' - ' +
          this.quantity.state.value +
          ' - ' +
          this.price.state.value +
          ' - ' +
          this.state.discountType +
          ' - ' +
          this.state.discount
      );
    };

    setProduct = () => {
      this.setState({
        emessage: { name: '', quantity: '', price: '', discount: '' },
        marginBottom: 0,
      });

      if (
        this.name.state.value === '' ||
        (this.quantity.state.value === '' ||
          parseFloat(this.quantity.state.value) <= 0) ||
        (this.price.state.value === '' ||
          parseFloat(this.price.state.value) <= 0) ||
        parseFloat(this.price.state.value) *
          parseFloat(this.quantity.state.value) >
          999999.99 ||
        ((parseFloat(this.state.discount) >= 100 &&
          this.state.discountType === '%') ||
          parseFloat(this.state.discount) <= 0) ||
        (this.state.discountType != '%' &&
          parseFloat(this.state.discount) >
            parseFloat(this.quantity.state.value) *
              parseFloat(this.price.state.value)) ||
        // imageSource === '' ||
        (this.state.cessPercentage != '' &&
          (parseFloat(this.state.cessPercentage) > 99.9 ||
            parseFloat(this.state.cessPercentage) < 0 ||
            isNaN(parseFloat(this.state.cessPercentage)))) ||
        (this.state.vat && this.state.vatPercentage == '') ||
        (this.state.vatPercentage != '' &&
          (parseFloat(this.state.vatPercentage) > 99.9 ||
            parseFloat(this.state.vatPercentage) < 0 ||
            isNaN(parseFloat(this.state.vatPercentage))))
      ) {
        console.log('FOR NAME', this.name.state.value === '');
        console.log(
          'FOR QUANTITY',
          this.quantity.state.value === '' ||
            parseFloat(this.quantity.state.value) <= 0
        );
        console.log(
          'FOR PRICE',
          this.price.state.value === '' ||
            parseFloat(this.price.state.value) <= 0
        );
        console.log(
          'FOR VALUE TOTAL',
          parseFloat(this.price.state.value) *
            parseFloat(this.quantity.state.value) >
            999999.99
        );
        console.log(
          'FOR DISCOUNT %',
          (parseFloat(this.state.discount) >= 100 &&
            this.state.discountType === '%') ||
            parseFloat(this.state.discount) <= 0
        );
        console.log(
          'FOR DISCOUNT MONEY',
          this.state.discountType != '%' &&
            parseFloat(this.state.discount) >
              parseFloat(this.quantity.state.value) *
                parseFloat(this.price.state.value)
        );
        console.log(
          'FOR CESSPERCENTAGE',
          this.state.cessPercentage != '' &&
            (parseFloat(this.state.cessPercentage) > 99.9 ||
              parseFloat(this.state.cessPercentage) < 0 ||
              isNaN(parseFloat(this.state.cessPercentage)))
        );
        console.log(
          'FOR VAT ACTIVE',
          this.state.vat && this.state.vatPercentage == ''
        );
        console.log(
          'FOR VATPERCENTAGE',
          this.state.vatPercentage != '' &&
            (parseFloat(this.state.vatPercentage) > 99.9 ||
              parseFloat(this.state.vatPercentage) < 0 ||
              isNaN(parseFloat(this.state.vatPercentage)))
        );

        if (this.name.state.value === '') {
          console.log('FALSE ON NAME');
          let val = this.state.emessage;
          val.name = 'Enter a valid name';
          this.setState({ ename: true, emessage: val });
        } else {
          this.setState({ ename: false });
        }
        if (
          this.quantity.state.value === '' ||
          parseFloat(this.quantity.state.value) <= 0
        ) {
          console.log('FALSE ON quantity');
          let val = this.state.emessage;
          val.quantity = 'Enter a valid quantity';
          let val2 = this.state.marginBottom + 1;
          this.setState({ equantity: true, emessage: val });
          this.setState({ marginBottom: val2 });
        } else {
          this.setState({ equantity: false });
        }

        // PRICE *****************************************
        if (
          this.price.state.value === '' ||
          parseFloat(this.price.state.value) <= 0
        ) {
          console.log('FALSE ON price');
          let val = this.state.emessage;
          val.price = 'Enter a valid price';
          let val2 = this.state.marginBottom + 1;
          this.setState({ eprice: true, emessage: val, marginBottom: val2 });
        } else {
          this.setState({ eprice: false });
        }

        // DISCOUNT *****************************************
        if (this.state.discountType === '%') {
          if (
            parseFloat(this.state.discount) >= 100 ||
            parseFloat(this.state.discount) <= 0
          ) {
            console.log('FALSE ON discount %');
            let val = this.state.emessage;
            val.discount = 'Enter a valid discount';
            this.setState({ ediscount: true, emessage: val });
          } else {
            this.setState({ ediscount: false });
          }
        } else {
          if (
            parseFloat(this.state.discount) >
              parseFloat(this.quantity.state.value) *
                parseFloat(this.price.state.value) ||
            parseFloat(this.state.discount) <= 0
          ) {
            console.log('FALSE ON discount rupee');
            let val = this.state.emessage;
            val.discount = 'Enter a valid discount';
            this.setState({ ediscount: true, emessage: val });
          } else {
            this.setState({ ediscount: false });
          }
        }

        // PRICE *****************************************
        if (
          parseFloat(this.price.state.value) *
            parseFloat(this.quantity.state.value) >
          999999.99
        ) {
          console.log('FALSE ON price');
          let val = this.state.emessage;
          val.price = 'Enter a valid price';
          val.quantity = 'Enter a valid quantity';
          this.setState({ eprice: true, equantity: true, emessage: val });
        }

        // CESS *****************************************
        if (
          (parseFloat(this.state.cessPercentage) > 99.9 ||
            parseFloat(this.state.cessPercentage) < 0 ||
            isNaN(parseFloat(this.state.cessPercentage))) &&
          this.state.cessPercentage !== ''
        ) {
          console.log('FALSE ON cess');
          this.setState({ errorTaxCess: true });
        } else this.setState({ errorTaxCess: false });

        // VAT PERCENTAGE *****************************************
        if (
          this.state.vat &&
          (this.state.vatPercentage == '' ||
            parseFloat(this.state.vatPercentage) > 99.9 ||
            parseFloat(this.state.vatPercentage) < 0 ||
            isNaN(parseFloat(this.state.vatPercentage)))
        ) {
          console.log('FALSE ON vat');
          this.setState({ errorTaxVat: true });
        } else this.setState({ errorTaxVat: false });

        //alert('NOT VALID')

        return;
      }

      this.setState({
        ename: false,
        equantity: false,
        eprice: false,
        ediscount: false,
      });

      const subtotalAmount = this.price.state.value * this.quantity.state.value;
      const discountType = this.state.discountType;
      const discountPercentage =
        this.state.discount !== ''
          ? parseFloat(this.state.discount).toFixed(2)
          : 0;
      const discountAmount =
        discountType === '%'
          ? (subtotalAmount * discountPercentage) / 100
          : discountPercentage;

      const cessAmount =
        this.state.cessPercentage && this.state.gst
          ? //? (parseFloat(this.state.cessPercentage) * this.price.state.value) /
            (parseFloat(this.state.cessPercentage) *
              (subtotalAmount - discountAmount)) /
            100
          : 0;
      const vatAmount =
        this.state.vatPercentage && this.state.vat
          ? //? (parseFloat(this.state.vatPercentage) * this.price.state.value) /
            (parseFloat(this.state.vatPercentage) *
              (subtotalAmount - discountAmount)) /
            100
          : 0;
      const sgstAmount =
        this.state.intStateTax === 'SGST & CGST' && this.state.gst
          ? //? (parseFloat(this.state.intTaxPercentage) * this.price.state.value) /
            (parseFloat(this.state.intTaxPercentage) *
              (subtotalAmount - discountAmount)) /
            100 /
            2
          : 0;
      const cgstAmount =
        this.state.intStateTax === 'SGST & CGST' && this.state.gst
          ? //? (parseFloat(this.state.intTaxPercentage) * this.price.state.value) /
            (parseFloat(this.state.intTaxPercentage) *
              (subtotalAmount - discountAmount)) /
            100 /
            2
          : 0;
      const igstAmount =
        this.state.intStateTax !== 'SGST & CGST' && this.state.gst
          ? //? (parseFloat(this.state.intTaxPercentage) * this.price.state.value) /
            (parseFloat(this.state.intTaxPercentage) *
              (subtotalAmount - discountAmount)) /
            100
          : 0;

      let product = {
        ...this.props.item,
        name: this.name.state.value,
        quantity: this.quantity.state.value,
        unitPrice: parseFloat(this.price.state.value).toFixed(2),
        type: this.state.discountType,
        discount:
          this.state.discount !== ''
            ? parseFloat(this.state.discount).toFixed(2)
            : 0,
        total: parseFloat(
          parseFloat(this.quantity.state.value).toFixed(2) *
            parseFloat(this.price.state.value).toFixed(2) -
            discountAmount +
            cessAmount +
            igstAmount +
            cgstAmount +
            sgstAmount +
            vatAmount
        ).toFixed(2),
        image: imageSource ? imageSource : '',
        // AQUI EMPIEZA EL EDIT****************************************************************************************
        cess:
          this.state.cessPercentage && this.state.gst
            ? this.state.cessPercentage
            : 0,
        sgst:
          this.state.intStateTax === 'SGST & CGST' && this.state.gst
            ? parseFloat(this.state.intTaxPercentage) / 2
            : 0,
        cgst:
          this.state.intStateTax === 'SGST & CGST' && this.state.gst
            ? parseFloat(this.state.intTaxPercentage) / 2
            : 0,
        igst:
          this.state.intStateTax !== 'SGST & CGST' && this.state.gst
            ? parseFloat(this.state.intTaxPercentage)
            : 0,
        vat:
          this.state.vatPercentage && this.state.vat
            ? this.state.vatPercentage
            : 0,
      };

      const { edit_product } = this.props;
      edit_product(product);

      saveEditingState();
      const { closeModal } = this.props;
      closeModal();
    };

    saveEditingState = () => {
      this.setState({
        name: this.name.state.value,
        quantity: this.quantity.state.value,
        price: this.price.state.value,
        discount: this.state.discount,
        type: this.state.discountType,
        image: imageSource,
        intTaxPercentage: this.state.intTaxPercentage,
        cessPercentage:
          this.state.cessPercentage !== '' ? this.state.cessPercentage : 0,
        vatPercentage:
          this.state.vatPercentage !== '' ? this.state.vatPercentage : 0,
        gst: this.state.gst,
        vat: this.state.vat,
      });
    };

    const { addMargin } = this.props;
    const isDetailVisible = this.props.isDetailVisible;

    var vatTaxConst = this.props.item.vat;

    return (
      <Card
        style={[
          containerStyle,
          {
            height:
              hp('42%') +
              this.state.taxContainerHeight +
              this.state.marginBottom * hp('2%'),
          },
        ]}
      >
        <View
          style={{
            width: '100%',
            height: '100%',
            borderRadius: 10,
            alignItems: 'center',
          }}
        >
          <View style={contentWidth}>
            <View
              style={{
                height: hp('10.4%'),
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'flex-end',
                backgroundColor: '#fff',
              }}
            >
              <View style={cameraButtonContainer}>
                <ButtonCamera
                  containerStyle={{
                    width: '100%',
                    height: '100%',
                    borderRadius: 5,
                  }}
                  imageSize={buttonIconSize}
                  onPress={cameraButtonAction}
                  imageSource={imageSource}
                  imageAtributes={imageAtributes}
                />
              </View>
              <FloatingTextEditProductInput
                maximumLength={20}
                width={productNameInputSize.width}
                height={productNameInputSize.height}
                error={this.state.ename}
                labelText={'Product Name'}
                value={this.props.item.name}
                eraseOption={false}
                autoCapitalizeText={'words'}
                orientation={orientation}
                ref={name => {
                  this.name = name;
                }}
                onChangeText={v => {
                  this.tempItem.name = v;
                }}
                emessage={this.state.emessage.name}
              />
            </View>
            <View
              style={{ flexDirection: 'row', justifyContent: 'space-between' }}
            >
              <FloatingTextEditProductInput
                maximumLength={3}
                dropdown={true}
                onDropdownChange={this.tempItem.changeQuantity.bind(
                  this.tempItem
                )}
                width={quantityInputSize.width}
                height={quantityInputSize.height}
                error={this.state.equantity}
                labelText={'Quantity'}
                typeOfKeyboard={'numeric'}
                value={this.props.item.quantity}
                eraseOption={false}
                autoCapitalizeText={'words'}
                orientation={orientation}
                ref={quantity => {
                  this.quantity = quantity;
                }}
                emessage={this.state.emessage.quantity}
                validateQuantity={true}
                //maximumLength={3}
                //firstValue={this.state.quantity}
              />
              <FloatingTextEditProductInput
                //maximumLength={9}
                restyle={true}
                width={priceInputSize.width}
                height={priceInputSize.height}
                error={this.state.eprice}
                labelText={'Price (₹)'}
                value={this.props.item.unitPrice}
                typeOfKeyboard={'numeric'}
                eraseOption={true}
                autoCapitalizeText={'words'}
                orientation={orientation}
                rupeeSign={true}
                ref={price => {
                  this.price = price;
                }}
                onChangeText={v => {
                  this.tempItem.unitPrice = +v;
                }}
                emessage={this.state.emessage.price}
                validatePrice={true}
              />
            </View>
            <View
              style={{
                width: wp(discountSelectorSize.width + '%'),
                height: hp(discountSelectorSize.height + '%'),
                paddingLeft: wp('1%'),
              }}
            >
              <SelectorDiscount
                // maximumLength={this.props.item.type=='%'?5:9}
                error={this.state.ediscount}
                width={discountSelectorSize.width}
                orientation={orientation}
                defaultValue={`${this.state.tempItem.discountEntered}`}
                type={'%'}
                onSelection={this._handleDiscountSelector.bind(this)}
                ref={discount => {
                  this.discount = discount;
                }}
              />
              {this.state.emessage.discount != '' ? (
                <TextMontserrat
                  style={{
                    color: '#D0021B',
                    fontSize: hp('1.7%'),
                    fontWeight: '600',
                  }}
                >
                  {' '}
                  {this.state.emessage.discount}
                </TextMontserrat>
              ) : null}
            </View>
          </View>
          <View
            style={[
              {
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
                marginTop: this.state.orientation ? hp('1.6%') : hp('2.5%'),
                marginBottom: this.state.orientation ? hp('1.5%') : hp('1.85%'),
              },
              this.state.orientation
                ? {}
                : {
                    width: '100%',
                    paddingLeft: wp('2.25%'),
                    paddingRight: wp('1.25%'),
                    justifyContent: 'space-between',
                  },
            ]}
          >
            <View
              style={
                this.state.orientation
                  ? {
                      flexDirection: 'row',
                      width: wp('31.95%'),
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginRight: wp('5.6%'),
                    }
                  : {
                      flexDirection: 'row',
                      width: wp('12%'),
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginRight: wp('0%'),
                    }
              }
            >
              <TextMontserrat
                style={
                  this.state.orientation
                    ? {
                        fontWeight: '700',
                        color: '#52565F',
                        fontSize: wp('3.65%'),
                      }
                    : {
                        fontWeight: '700',
                        color: '#52565F',
                        fontSize: hp('2.35%'),
                      }
                }
              >
                Add GST
              </TextMontserrat>
              <ToggleIcon
                toggle={() => {
                  const gstType = this.tempItem.gstType;
                  this.tempItem.gstType = gstType === 'GST' ? null : 'GST';
                  this.setState({
                    tempItem: this.tempItem,
                    gst: !this.state.gst,
                    vat: false,
                    taxContainerHeight: !this.state.gst ? hp('24.4%') : 0,
                    intTaxPercentage: !this.state.gst ? 5 : 0,
                    cessPercentage: 0,
                    vatPercentage: 0,
                  });
                  this.props.addingHeight(!this.state.gst ? hp('24.4%') : 0);
                  this.props.addingHeightFromSaved(0);
                }}
                checked={this.state.tempItem.gstType === 'GST'}
                style={{
                  width: this.state.orientation ? wp('7.5%') : wp('3%'),
                  height: hp('2.8%'),
                  circleWidth: hp('2.45%'),
                  circleHeight: hp('2.5%'),
                }}
              />
            </View>
            <View
              style={
                this.state.orientation
                  ? {
                      flexDirection: 'row',
                      width: wp('31.95%'),
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }
                  : {
                      flexDirection: 'row',
                      width: wp('12%'),
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }
              }
            >
              <TextMontserrat
                style={
                  this.state.orientation
                    ? {
                        fontWeight: '700',
                        color: '#52565F',
                        fontSize: wp('3.65%'),
                      }
                    : {
                        fontWeight: '700',
                        color: '#52565F',
                        fontSize: hp('2.35%'),
                      }
                }
              >
                Add VAT
              </TextMontserrat>
              <ToggleIcon
                toggle={() => {
                  const gstType = this.tempItem.gstType;
                  this.tempItem.gstType = gstType === 'VAT' ? null : 'VAT';
                  this.setState({
                    tempItem: this.tempItem,
                    vat: !this.state.vat,
                    gst: false,
                    taxContainerHeight: !this.state.vat ? hp('10.4%') : 0,
                    intTaxPercentage: 0,
                    cessPercentage: 0,
                    vatPercentage: 0,
                  });
                  this.props.addingHeight(!this.state.vat ? hp('10.4%') : 0);
                  this.props.addingHeightFromSaved(0);
                }}
                checked={this.state.tempItem.gstType === 'VAT'}
                style={{
                  width: this.state.orientation ? wp('7.5%') : wp('3%'),
                  height: hp('2.8%'),
                  circleWidth: hp('2.45%'),
                  circleHeight: hp('2.5%'),
                }}
              />
            </View>
          </View>

          <View
            style={{
              height: this.state.taxContainerHeight,
              width: this.state.orientation ? '100%' : null,
              backgroundColor: '#EEEEEE',
              borderTopColor:
                this.state.gst || this.state.vat ? '#A4A4A4' : '#fff',
              borderTopWidth: this.state.gst || this.state.vat ? hp('0.35') : 0,
              borderLeftColor:
                this.state.gst || this.state.vat ? '#BDBDBD' : '#fff',
              borderLeftWidth:
                this.state.gst || this.state.vat
                  ? this.state.orientation
                    ? wp('0.4')
                    : wp('0.2')
                  : 0,
              borderRightColor:
                this.state.gst || this.state.vat ? '#BDBDBD' : '#fff',
              borderRightWidth:
                this.state.gst || this.state.vat
                  ? this.state.orientation
                    ? wp('0.4')
                    : wp('0.2')
                  : 0,
              borderBottomColor:
                this.state.gst || this.state.vat ? '#DEDCDC' : '#fff',
              borderBottomWidth:
                this.state.gst || this.state.vat ? hp('0.15') : 0,
              BorderShadow: this.state.gst || this.state.vat ? 10 : 0,
            }}
          >
            <View
              style={{
                width: '100%',
                height: '100%',
                paddingLeft: this.state.orientation ? wp('5.5%') : wp('6.5'),
                paddingRight: wp('6%'),
              }}
            >
              {this.state.tempItem.gstType === 'GST' && (
                <View>
                  <View>
                    <RadioGroup
                      size={this.state.orientation ? wp('4.1%') : hp('3.2%')}
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-around',
                      }}
                      thickness={2}
                      selectedIndex={this.state.selectedRadioButton}
                      // selectedIndex={0}
                      // selectedIndex={parseFloat(this.props.item.cgst) !== 0 ? 0 : parseFloat(this.props.item.igst) !== 0 ? 1 : 0} // IF CGST SELECT 0, ELSE IF IGST SELECT 1, ELSE SELECT 0
                      color="#6B6B6B"
                      activeColor="#174285"
                      onSelect={(index, value) => {
                        this.onSelectRadio(index, value);
                        if (index === 0) this.setCgstAsItems();
                        else this.setIgstAsItems();
                      }}
                    >
                      <RadioButton
                        value={'SGST & CGST'}
                        style={{ alignItems: 'center' }}
                      >
                        <TextMontserrat
                          style={
                            this.state.orientation
                              ? {
                                  fontWeight:
                                    this.state.intStateTax === 'SGST & CGST'
                                      ? '600'
                                      : '500',
                                  color:
                                    this.state.intStateTax === 'SGST & CGST'
                                      ? '#174285'
                                      : '#52565F',
                                  fontSize: wp('3.65%'),
                                  marginLeft: wp('1.5%'),
                                }
                              : {
                                  fontWeight:
                                    this.state.intStateTax === 'SGST & CGST'
                                      ? '600'
                                      : '500',
                                  color:
                                    this.state.intStateTax === 'SGST & CGST'
                                      ? '#174285'
                                      : '#52565F',
                                  fontSize: hp('2.35%'),
                                  marginLeft: wp('1%'),
                                }
                          }
                        >
                          Intrastate
                        </TextMontserrat>
                      </RadioButton>

                      <RadioButton value={'IGST'}>
                        <TextMontserrat
                          style={
                            this.state.orientation
                              ? {
                                  fontWeight:
                                    this.state.intStateTax !== 'SGST & CGST'
                                      ? '600'
                                      : '500',
                                  color:
                                    this.state.intStateTax !== 'SGST & CGST'
                                      ? '#174285'
                                      : '#52565F',
                                  fontSize: wp('3.65%'),
                                  marginLeft: wp('1.5%'),
                                }
                              : {
                                  fontWeight:
                                    this.state.intStateTax !== 'SGST & CGST'
                                      ? '600'
                                      : '500',
                                  color:
                                    this.state.intStateTax !== 'SGST & CGST'
                                      ? '#174285'
                                      : '#52565F',
                                  fontSize: hp('2.35%'),
                                  marginLeft: wp('1%'),
                                }
                          }
                        >
                          Interstate
                        </TextMontserrat>
                      </RadioButton>
                    </RadioGroup>
                  </View>
                  <View
                    style={[
                      { marginBottom: hp('0.75%') },
                      this.state.orientation ? {} : { paddingLeft: wp('0.7%') },
                    ]}
                  >
                    <TaxInput
                      value={
                        parseInt(this.props.item.cgst * 2) ||
                        parseInt(this.props.item.igst) ||
                        5
                      }
                      // value={this.state.intTaxPercentage}
                      onChangeText={v => {
                        this.tempItem.addGstTax('intrastate', +v);
                        this.tempItem.update();
                      }}
                      label={this.state.intStateTax}
                      style={
                        this.state.orientation
                          ? {
                              containerHeight: hp('7.48%'),
                              containerWidth: wp('70%'),
                              borderBottom: hp('0.35%'),
                              labelSize: wp('3.1%'),
                              descriptorTypeSize: wp('3.5%'),
                              separatorWidth: wp('0.4%'),
                              inputWidth: wp('50.35%'),
                              inputLeftPadding: wp('5.1%'),
                              inputFontSize: wp('3.6%'),
                              textIconPaddingBottom: hp('0.7%'),
                              iconSize: hp('3%'),
                            }
                          : {
                              containerHeight: hp('7.48%'),
                              containerWidth: wp('27.2%'),
                              borderBottom: hp('0.35%'),
                              labelSize: hp('2%'),
                              descriptorTypeSize: hp('2%'),
                              separatorWidth: wp('0.1%'),
                              inputWidth: wp('19.55%'),
                              inputLeftPadding: wp('2%'),
                              inputFontSize: hp('2%'),
                              textIconPaddingBottom: hp('0.7%'),
                            }
                      }
                      input={'dropdown'}
                      items={this.state.dropdownTaxesItems}
                      dropdownOffset={
                        this.state.orientation
                          ? { top: hp('6.5'), left: 0 }
                          : { top: hp('6.5'), left: 0 }
                      }
                      dropdownPosition={0}
                    />
                  </View>
                  <View
                    style={
                      this.state.orientation ? {} : { paddingLeft: wp('0.7%') }
                    }
                  >
                    <TaxInput
                      // value={this.state.cessPercentage}
                      inputRef={input => {
                        this.cessInput = input;
                      }}
                      value={
                        this.props.item.cess != '0' ? this.props.item.cess : ''
                      }
                      onChangeText={v => {
                        this.tempItem.addGstTax('CESS', +v);
                        this.tempItem.update();
                        // this.setState({
                        //   tempItem: this.tempItem,
                        //   // cessPercentage: v,
                        //   // errorTaxCess: false,
                        //   // errorTaxVat: false,
                        // });
                      }}
                      label={'CESS'}
                      style={
                        this.state.orientation
                          ? {
                              containerHeight: hp('7.48%'),
                              containerWidth: wp('70%'),
                              borderBottom: hp('0.35%'),
                              labelSize: wp('3.1%'),
                              descriptorTypeSize: wp('3.5%'),
                              separatorWidth: wp('0.4%'),
                              inputWidth: wp('38.5%'),
                              inputLeftPadding: wp('4.2%'),
                              inputFontSize: wp('3.6%'),
                              iconSize: hp('3%'),
                              textIconPaddingBottom: hp('0.7%'),
                              iconMarginRight: wp('1%'),
                              errorStyle: {
                                fontSize: wp('2.6%'),
                                fontWeight: '600',
                                color: 'red',
                              },
                            }
                          : {
                              containerHeight: hp('7.48%'),
                              containerWidth: wp('27.2%'),
                              borderBottom: hp('0.35%'),
                              labelSize: hp('2%'),
                              descriptorTypeSize: hp('2%'),
                              separatorWidth: wp('0.1%'),
                              inputWidth: wp('14%'),
                              inputLeftPadding: wp('2%'),
                              inputFontSize: hp('2%'),
                              iconSize: hp('3%'),
                              textIconPaddingBottom: hp('0.7%'),
                              iconMarginRight: wp('0%'),
                              errorStyle: {
                                fontSize: hp('1.6%'),
                                fontWeight: '600',
                                color: 'red',
                              },
                            }
                      }
                      maximumLength={5}
                      input={'textInput'}
                      error={this.state.errorTaxCess}
                    />
                  </View>
                </View>
              )}
              {this.state.tempItem.gstType === 'VAT' && (
                <View>
                  <View
                    style={[
                      { height: '100%' },
                      this.state.orientation ? {} : { paddingLeft: wp('0.7%') },
                    ]}
                  >
                    <TaxInput
                      // value={this.state.vatPercentage}
                      inputRef={input => {
                        this.vatInput = input;
                      }}
                      value={
                        this.props.item.vat != '0' ? this.props.item.vat : ''
                      }
                      onChangeText={v => {
                        this.tempItem.addVatTax('VAT', +v);
                        this.tempItem.update();
                        this.setState({
                          vatPercentage: v,
                          errorTaxCess: false,
                          errorTaxVat: false,
                        });
                      }}
                      maximumLength={5}
                      label={'VAT'}
                      style={
                        this.state.orientation
                          ? {
                              containerHeight: hp('7.48%'),
                              containerWidth: wp('70%'),
                              borderBottom: hp('0.35%'),
                              labelSize: wp('3.1%'),
                              descriptorTypeSize: wp('3.5%'),
                              separatorWidth: wp('0.4%'),
                              inputWidth: wp('38.5%'),
                              inputLeftPadding: wp('4.2%'),
                              inputFontSize: wp('3.6%'),
                              iconSize: hp('3%'),
                              textIconPaddingBottom: hp('0.65%'),
                              iconMarginRight: wp('1%'),
                              errorStyle: {
                                fontSize: wp('2.6%'),
                                fontWeight: '600',
                                color: 'red',
                              },
                            }
                          : {
                              containerHeight: hp('7.48%'),
                              containerWidth: wp('27.2%'),
                              borderBottom: hp('0.35%'),
                              labelSize: hp('2%'),
                              descriptorTypeSize: hp('2%'),
                              separatorWidth: wp('0.1%'),
                              inputWidth: wp('15.2%'),
                              inputLeftPadding: wp('2%'),
                              inputFontSize: hp('2%'),
                              iconSize: hp('3%'),
                              textIconPaddingBottom: hp('0.7%'),
                              iconMarginRight: wp('0%'),
                              errorStyle: {
                                fontSize: hp('1.6%'),
                                fontWeight: '600',
                                color: 'red',
                              },
                            }
                      }
                      input={'textInput'}
                      error={this.state.errorTaxVat}
                    />
                  </View>
                </View>
              )}
            </View>
          </View>
          <View
            style={{
              width: '100%',
              height: hp('6.5%'),
              marginTop: hp('0.6%'),
              flexDirection: 'row',
              justifyContent: 'space-evenly',
            }}
          >
            <ButtonOutline
              title={'CANCEL'}
              buttonCustomStyle={cancelButtonStyle}
              buttonTextStyle={cancelButtonTextStyle}
              onPress={() => {
                const product = this.props.item;
                console.log('ON CANCEL', product);
                this.setState({
                  emessage: { name: '', quantity: '', price: '', discount: '' },
                  ename: false,
                  equantity: false,
                  eprice: false,
                  ediscount: false,
                  marginBottom: 0,
                  discount:
                    parseFloat(product.discount).toFixed(2) != '0.00' &&
                    product.discount != ''
                      ? product.discount
                      : '',
                  discountType: product.type || '%',
                  gst:
                    (product.cgst != '' && parseFloat(product.cgst) !== 0) ||
                    (product.igst != '' && parseFloat(product.igst) !== 0)
                      ? true
                      : false,
                  vat:
                    product.vat != '' && parseFloat(product.vat) !== 0
                      ? true
                      : false,
                  taxContainerHeight:
                    (product.cgst != '' && parseFloat(product.cgst) !== 0) ||
                    (product.igst != '' && parseFloat(product.igst) !== 0)
                      ? hp('24.4%')
                      : product.vat != '' && parseFloat(product.vat) !== 0
                      ? hp('10.4')
                      : 0,
                });
                this.name.handleTextChange(product.name);
                this.quantity.handleTextChange(product.quant);
                this.price.handleTextChange(product.unitPrice);
                this.props.addingHeight(
                  (product.cgst != '' && parseFloat(product.cgst) !== 0) ||
                    (product.igst != '' && parseFloat(product.igst) !== 0)
                    ? hp('24.4%')
                    : product.vat != '' && parseFloat(product.vat) !== 0
                    ? hp('10.4')
                    : 0
                );
                cancelButtonAction();
              }}
            />
            <ButtonGradient
              title={'SAVE'}
              linearGradientStyle={saveButtonStyle}
              buttonTextStyle={saveButtonTextStyle}
              onPress={() => {
                const { item } = this.props;
                item.update.call(item, this.tempItem.getData());
                setProduct();
                let mad = 0;
                if (this.state.emessage.quantity != '') mad = mad + 1;
                if (this.state.emessage.price != '') mad = mad + 1;
                this.props.addMargin(mad * hp('2%'));
                // alert(this.state.cessPercentage)
              }}
            />
          </View>
        </View>
      </Card>
    );
  }
}

const mapStateToProps = state => {
  return {
    products: state.cashData.product,
  };
};

const mapDispatchToProps = dispatch => ({
  edit_product: product => {
    dispatch(cashActions.edit_product(product));
  },
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(EditProduct);
//export default EditProduct;
