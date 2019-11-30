import React, { Component } from 'react';
import { View, Keyboard } from 'react-native';
import { Card } from 'components';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import ProductForm from './components/form';
import ButtonsContainer from './components/buttons_form';
import TaxesContainer from './components/taxes_container';
import ToggleContainer from './components/toggles_container';
import realm from '../../../../../../services/realm_service';
import CustomItemHelper from '../../../../../../factory/custom_item_helper';

class ProductEditModal extends Component {
  constructor(props) {
    super(props);
    const x = this.props.item;
    const item = new CustomItemHelper();
    item.quantity = x.quantity;
    item.name = x.name;
    item.unitPrice = x.unitPrice;
    item.discountEntered = +x.discountEntered;
    item.discountType = x.discountType;
    item.taxes = Array.from(x.taxes);
    item.mapTaxes(Array.from(realm.objects('Tax')));
    item.setTaxInfo();

    item.on('change', () => {
      this.forceUpdate();
    });

    this.state = {
      taxtType: '',
      showTaxesContainer: false,
      item,

      errorName: [],
      errorQuantity: [],
      errorUnitPrice: [],
      errorDiscount: false,
      errorVat: false,
    };
  }

  componentDidMount() {
    realm.beginTransaction();
  }

  componentWillUnmount() {
    if (realm.isInTransaction) {
      realm.cancelTransaction();
    }

    this.props.close(true);
  }
  getDataforUpdate(item) {
    const { id, ...data } = item;

    if (typeof data.unitPrice === 'string') {
      data.unitPrice = +data.unitPrice;
    }
    data.discountEntered = +data.discountEntered;

    data.quantity = +data.quantity;

    return data;
  }
  clearErrors = key => {
    if (key != 'errorDiscount') {
      this.setState({
        [key]: [],
      });
    } else {
      this.setState({
        [key]: false,
      });
    }
  };
  cleanTaxes = key => {
    this.setState({
      [key]: false,
    });
  };
  getErrors(field, val) {
    switch (field) {
      case 'name':
        return val == '' ? true : false;
      case 'unitPrice':
        return !+val ? true : false;
      case 'quantity':
        return !+val ? true : false;
      default:
        break;
    }
  }

  invalidName = () => {
    return this.props.item.name == '';
  };
  invalidQuantity = () => {
    return (
      this.props.item.quantity == 0 ||
      this.props.item.quantity == '' ||
      +this.props.item.quantity < 0.1 ||
      +this.props.item.quantity >= 1000
    );
  };
  invalidPrice = () => {
    return (
      this.props.item.unitPrice == 0 ||
      this.props.item.unitPrice == '' ||
      +this.props.item.unitPrice < 0.1 ||
      +this.props.item.unitPrice >= 1000000
    );
  };
  invalidDiscount = () => {
    if (
      this.props.item.discountType == '%' &&
      (this.props.item.discountEntered != '' ||
        this.props.item.discountEntered != 0)
    ) {
      return (
        this.props.item.discountEntered < 0.1 ||
        this.props.item.discountEntered > 100
      );
    } else if (
      this.props.item.discountType == '₹' &&
      (this.props.item.discountEntered != '' ||
        this.props.item.discountEntered != 0)
    ) {
      const subtotal = this.props.item.quantity * this.props.item.unitPrice;
      return (
        +this.props.item.discountEntered < 0.1 ||
        +this.props.item.discountEntered > subtotal
      );
    }
  };
  find_dimesions(layout){
    const {x, y, width, height} = layout;
    // alert('height: '+height)
    this.props.settingOffset(height);
  }

  render() {
    return (
      <View
        style={{
          width: '100%',
          paddingTop: hp('1.5%'),
          paddingBottom: hp('3%'),
          alignItems: 'center',
        }}
        onLayout={(event) => { this.find_dimesions(event.nativeEvent.layout) }}
      >
        <Card style={{ width: '94%', padding: 0 }}>
          <ProductForm
            ref={ref => (this.product_form = ref)}
            item={this.state.item}
            update={() => this.forceUpdate()}
            realmItem={this.props.item}
            errorName={this.state.errorName}
            errorQuantity={this.state.errorQuantity}
            errorUnitPrice={this.state.errorUnitPrice}
            errorDiscount={this.state.errorDiscount}
            clearErrors={this.clearErrors}
          />
          <ToggleContainer
            ref={ref => (this.toggle_form = ref)}
            item={this.state.item}
            realmItem={this.props.item}
            update={() => this.forceUpdate()}
          />
          {Boolean(this.props.item.isGst() || this.props.item.isVat()) && (
            <TaxesContainer
              realmItem={this.props.item}
              item={this.state.item}
              update={() => this.forceUpdate()}
              errorVat={this.state.errorVat}
              cleanTaxes={this.cleanTaxes}
            />
          )}
          <ButtonsContainer
            onSave={() => {
              if (
                this.invalidName() ||
                this.invalidQuantity() ||
                this.invalidPrice() ||
                this.invalidDiscount()
              ) {
                if (this.invalidName()) {
                  this.setState({ errorName: [''] });
                }
                if (this.invalidQuantity()) {
                  this.setState({ errorQuantity: [''] });
                }
                if (this.invalidPrice()) {
                  this.setState({ errorUnitPrice: [''] });
                }
                if (this.invalidDiscount()) {
                  this.setState({ errorDiscount: true });
                }
                return;
              }

              const taxes = Array.from(this.props.item.tax);
              if (taxes.length != 0) {
                const taxName = taxes[0].name;
                const taxValue = taxes[0].value;
                if (taxName == 'VAT') {
                  if (taxValue == 0 || taxValue == '') {
                    this.setState({ errorVat: true });
                    return;
                  }
                }
              }

              if (realm.isInTransaction) {
                realm.commitTransaction();
              }
              this.props.item.update();
              this.props.order.update();
              Keyboard.dismiss();

              this.props.close();
            }}
            onCancel={() => {
              this.setState({ showTaxesContainer: false });
              Keyboard.dismiss();
              this.props.close();
            }}
          />
        </Card>
      </View>
    );
  }
}

export default ProductEditModal;
