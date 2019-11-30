import Realm from 'realm';
import realm from '../realm_service';
import * as _ from 'lodash';
import uuid from 'uuid/v1';
export default class CustomItem extends Realm.Object {
  static schema = {
    name: 'CustomItem',
    primaryKey: 'id',
    properties: {
      id: 'string',
      discountValue: { type: 'double', default: 0 },
      discountEntered: 'double',
      discountType: 'string',
      name: 'string',
      quantity: 'double',
      unitPrice: 'double',
      tax: { type: 'CustomItemTax[]', default: [] },
      taxes: { type: 'CustomTax[]', default: [] },
      basePrice: 'double',
      discount: 'double',
      calculatedPrice: 'double',
      calculatedDiscount: 'double',
    },
  };
  isGst() {
    return (
      Array.from(
        this.tax.filtered(`name = "CGST" OR name = "SGST" OR name = "IGST"`)
      ).length > 0
    );
  }
  isVat() {
    return Array.from(this.tax.filtered(`name = "VAT"`)).length > 0;
  }
  isInterstate() {
    return Array.from(this.tax.filtered(`name = "IGST"`)).length > 0;
  }
  toggleGst() {
    if (!this.isGst()) {
      const gstTaxes = Array.from(
        realm.objects('RealmTax').filtered(`name = "CGST" OR name = "SGST"`)
      ).map(tx => {
        const realm = Array.from(tx.values);
        const value = realm.slice(0)[0];

        return {
          id: value.slabTaxId,
          taxId: uuid(),
          calculatedTaxValue:
            ((this.quantity * this.unitPrice - this.calculatedDiscount) *
              +value.taxValue) /
            100,
          name: tx.name,
          taxMode: value.taxMode,
          taxType: 'Exclusive',
          value: value.taxValue,
        };
      });
      this.tax = [...gstTaxes];
    } else {
      this.tax = [];
    }
  }
  addSgstAndCgst(v) {
    const oldTaxes = Array.from(
      this.tax.filtered(`name != "CGST" AND name != "SGST"`)
    );
    const newTaxes = Array.from(
      realm.objects('RealmTax').filtered(`name = "CGST" OR name = "SGST"`)
    ).map(tx => {
      // const value = Array.from(tx.values)[0];
      const value = Array.from(tx.values).find(x => x.taxValue === +v / 2);
      // const value = data.slice(0)[0];
      return {
        id: value.slabTaxId,
        taxId: uuid(),
        calculatedTaxValue:
          ((this.quantity * this.unitPrice - this.calculatedDiscount) *
            (+v / 2)) /
          100,
        name: tx.name,
        taxMode: value.taxMode,
        taxType: 'Exclusive',
        value: +v / 2,
      };
    });
    this.tax = [...oldTaxes, ...newTaxes];
  }
  setInterstate() {
    const oldTaxes = Array.from(
      this.tax.filtered(`name != "CGST" AND name != "SGST"`)
    );
    const igst = Array.from(
      realm.objects('RealmTax').filtered(`name = "IGST"`)
    ).map(tx => {
      const value = Array.from(tx.values)[0];
      return {
        id: value.slabTaxId,
        taxId: uuid(),
        calculatedTaxValue:
          ((this.quantity * this.unitPrice - this.calculatedDiscount) *
            +value.taxValue) /
          100,
        name: tx.name,
        taxMode: value.taxMode,
        taxType: 'Exclusive',
        value: value.taxValue,
      };
    });
    this.tax = [...oldTaxes, ...igst];
  }
  setIntrastate() {
    const gstTaxes = Array.from(this.tax.filtered(`name != "IGST"`));

    const igst = Array.from(
      realm.objects('RealmTax').filtered(`name = "CGST" OR name = "SGST"`)
    ).map(tx => {
      const value = Array.from(tx.values)[0];
      return {
        id: value.slabTaxId,
        taxId: uuid(),
        calculatedTaxValue:
          ((this.quantity * this.unitPrice - this.calculatedDiscount) *
            +value.taxValue) /
          100,
        name: tx.name,
        taxMode: value.taxMode,
        taxType: 'Exclusive',
        value: value.taxValue,
      };
    });
    this.tax = [...gstTaxes, ...igst];
  }

  toggleVat() {
    if (!this.isVat()) {
      const gstTaxes = Array.from(
        realm.objects('RealmTax').filtered(`name = "VAT"`)
      ).map(tx => {
        const value = Array.from(tx.values)[0];
        return {
          id: value.slabTaxId,
          taxId: uuid(),
          calculatedTaxValue: value.taxValue,
          name: tx.name,
          taxMode: value.taxMode,
          taxType: 'Exclusive',
          value: value.taxValue,
        };
      });
      this.tax = [...gstTaxes];
    } else {
      this.tax = [];
    }
  }
  getTaxValues(name) {
    const tax = Array.from(
      realm.objects('RealmTax').filtered(`name = "${name}"`)
    )[0];
    const values = Array.from(tax.values).map(v => ({
      value: v.slabs,
    }));
    return values;
  }
  getSelectedTaxValue(name) {
    const tx = Array.from(this.tax.filtered(`name = "${name}"`))[0];
    if (!tx) return 0;
    return tx.value;
  }
  addIgst(v) {
    const oldTaxes = Array.from(this.tax.filtered(`name != "IGST"`));
    const igst = Array.from(
      realm.objects('RealmTax').filtered(`name = "IGST"`)
    ).map(tx => {
      const value = Array.from(tx.values.filtered(`slabs = ${v}`))[0];
      return {
        id: value.slabTaxId,
        taxId: uuid(),
        calculatedTaxValue:
          ((this.quantity * this.unitPrice - this.calculatedDiscount) * +v) /
          100,
        name: tx.name,
        taxMode: value.taxMode,
        taxType: 'Exclusive',
        value: +v,
      };
    });

    this.tax = [...oldTaxes, ...igst];
  }
  addCess(v) {
    const gstTaxes = Array.from(this.tax.filtered(`name != "CESS"`));

    const cess = Array.from(
      realm.objects('RealmTax').filtered(`name = "CESS"`)
    ).map(tx => {
      const value = Array.from(tx.values)[0];
      return {
        id: value.slabTaxId,
        taxId: uuid(),
        calculatedTaxValue:
          ((this.quantity * this.unitPrice - this.calculatedDiscount) * +v) /
          100,
        name: tx.name,
        taxMode: value.taxMode,
        taxType: 'Exclusive',
        value: +v,
      };
    });

    this.tax = [...gstTaxes, ...cess];
  }
  addVat(v) {
    const gstTaxes = Array.from(this.tax.filtered(`name != "VAT"`));

    const vat = Array.from(
      realm.objects('RealmTax').filtered(`name = "VAT"`)
    ).map(tx => {
      const value = Array.from(tx.values)[0];
      return {
        id: value.slabTaxId,
        taxId: uuid(),
        calculatedTaxValue:
          ((this.quantity * this.unitPrice - this.calculatedDiscount) * +v) /
          100,
        name: tx.name,
        taxMode: value.taxMode,
        taxType: 'Exclusive',
        value: +v,
      };
    });

    this.tax = [...gstTaxes, ...vat];
  }
  removeTax(taxes) {
    let filterStr = ``;
    taxes.forEach((x, i) => {
      filterStr =
        filterStr + `name != "${x}" ${i !== taxes.length - 1 ? 'AND ' : ''}`;
    });
    this.tax = Array.from(this.tax.filtered(filterStr));
  }
  changeQuantity(v) {
    realm.write(() => {
      this.quantity = v;
      // alert(JSON.stringify(this));
    });
  }
  update(item) {
    // alert(JSON.stringify(item.taxes));
    // const txs = Array.from(realm.objects('Tax')); // SLAB TAXES
    realm.write(() => {
      for (const key in item) {
        this[key] = item[key];
        console.log('KEY-VALUE', { key: item[key] });
      }
      this.calculatedPrice = this.quantity * this.unitPrice;
      if (this.discountType === '%') {
        const discount = (this.calculatedPrice * this.discountEntered) / 100;

        this.discountValue = this.calculatedDiscount = discount;
        this.calculatedPrice = this.calculatedPrice - discount; //+ this.totalTax;
      } else {
        this.discountValue = this.calculatedDiscount = this.discountEntered;
        this.calculatedPrice = this.calculatedPrice - this.discountEntered; //+ this.totalTax
      }
      Array.from(this.tax).forEach(tax => {
        tax.calculatedTaxValue =
          ((this.quantity * this.unitPrice - this.calculatedDiscount) *
            +tax.value) /
          100;
      });
    });
  }
  getRequest() {
    const data = _.pick(this, [
      'discountEntered',
      'discountType',
      'discountValue',
      'name',
      'quantity',
      'unitPrice',
      'tax',
      'basePrice',
      'discount',
      'calculatedPrice',
      'calculatedDiscount',
    ]);
    if (data.discountType === '%') {
      data.basePrice = (data.unitPrice * data.discountEntered) / 100;
      data.calculatedDiscount = data.discountValue =
        data.unitPrice - data.basePrice;

      data.calculatedPrice =
        data.unitPrice * data.quantity - data.calculatedDiscount;
      data.discount = data.basePrice;
    } else {
      data.basePrice = data.discountEntered / data.quantity;
      data.calculatedDiscount = data.discountValue =
        data.unitPrice - data.basePrice;
      data.calculatedPrice =
        data.unitPrice * data.quantity - data.calculatedDiscount;
      data.discount = data.discountEntered;
    }
    return {
      ...data,
      tax: Array.from(data.tax),
    };
  }
  getProperties() {
    const properties = _.pick(this, [
      'discountEntered',
      'discountType',
      'name',
      'quantity',
      'unitPrice',
      'tax',
      'basePrice',
      'discount',
      'calculatedPrice',
      'calculatedDiscount',
    ]);
    return {
      discountEntered: properties.discountEntered,
      discountType: properties.discountType,
      name: properties.name,
      quantity: properties.quantity,
      unitPrice: properties.unitPrice.toFixed(2),
      tax: properties.tax,
      basePrice: properties.basePrice,
      discount: properties.discount,
      calculatedPrice: properties.calculatedPrice,
      calculatedDiscount: properties.calculatedPrice,
    };
  }

  deleteItem() {
    if (realm.isInTransaction) {
      realm.cancelTransaction();
    }
    realm.write(() => {
      realm.delete(this);
    });
  }
}
