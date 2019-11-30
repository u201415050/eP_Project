import { EventEmitter } from 'events';
import realm from '../realm_service';
import { epaisaRequest } from '../epaisa_service';
import * as _ from 'lodash';
import uuid from 'uuid/v1';
import { syncUnsynced } from '../../sync/sync_tasks';
export interface OrderInterface {
  id: string;
  deliveryCharges: number;
  generalDiscount: number;
  totalDiscount: number;
  customItems: any[];
  generalDiscountType: string;
  roundOffAmount: number;
  salesreturnstatus: number;
  serviceCharges: number;
  totalTax: number;
  subTotal: number;
  subTotalWithTaxes: number;
  calculatedDiscount: number;
  calculatedTax: any[];
  totalPrice: number;
  savedOrderId: string;
  customer: any;
  getRequest: () => any;
  removeCustomItems: (callbacks?: any[]) => void;
  getCustomer: () => number | null;
}
export default class Order extends EventEmitter implements OrderInterface {
  id: string;
  deliveryCharges: number;
  generalDiscount: number;
  totalDiscount: number;
  customItems: any[];
  generalDiscountType: string;
  roundOffAmount: number;
  salesreturnstatus: number;
  serviceCharges: number;
  totalTax: number;
  subTotal: number;
  subTotalWithTaxes: number;
  calculatedDiscount: number;
  calculatedTax: any[];
  totalPrice: number;
  savedOrderId: string;
  customer: any;
  static schema = {
    name: 'Order',
    primaryKey: 'id',
    properties: {
      id: 'string',
      deliveryCharges: 'double',
      generalDiscount: 'double',
      totalDiscount: 'double',
      customItems: { type: 'CustomItem[]', default: [] },
      generalDiscountType: 'string',
      roundOffAmount: { type: 'double', default: 0 },
      salesreturnstatus: { type: 'double', default: 0 },
      serviceCharges: { type: 'double', default: 0 },
      totalTax: { type: 'double', default: 0 },
      subTotal: { type: 'double', default: 0 },
      subTotalWithTaxes: { type: 'double', default: 0 },
      calculatedDiscount: { type: 'double', default: 0 },
      calculatedTax: { type: 'GeneralTax[]', default: [] },
      totalPrice: { type: 'double', default: 0 },
      savedOrderId: 'string?',
      customer: 'Customer?',
    },
  };

  getCustomer() {
    if (!this.customer) {
      return null;
    }
    return this.customer.customerId;
  }

  addCustomItem(item) {
    if (!+item.unitPrice) return;
    realm.write(() => {
      const customItem = {
        id: uuid(),
        discountEntered: 0,
        discountType: '%',
        name: 'Custom Product',
        quantity: 1,
        unitPrice: 0,
        basePrice: 0,
        discount: 0,
        calculatedPrice: 0,
        calculatedDiscount: 0,
      };
      this.customItems.push({ ...customItem, ...item });
    });
    this.update();
  }

  getItemsCount() {
    return this.customItems.length;
  }

  addCustomer(data) {
    const customer = {
      ...data,
      customerId: data.customerId ? parseInt(data.customerId) : null,
      id: uuid(),
    };
    realm.write(() => {
      this.customer = customer;
    });
  }

  updateGeneralDiscount(value, type) {
    realm.write(() => {
      this.generalDiscount = +value;
      this.generalDiscountType = type;
    });
    this.update();
    if (!+value) {
      this.emit('order_update');
    }
  }

  updateDeliveryCharges(value) {
    realm.write(() => {
      this.deliveryCharges = +value;
    });
    this.update();
    if (!+value) {
      this.emit('order_update');
    }
  }

  update() {
    realm.write(() => {
      if (!this.customItems.length) {
        this.deliveryCharges = 0;
        this.generalDiscountType = '%';
        this.generalDiscount = 0;
        this.customer = null;
        this.savedOrderId = null;
      }
      this.subTotal = 0;
      this.totalDiscount = 0;
      this.totalTax = 0;

      const values = this.customItems.values();
      let customItems = [];
      for (
        let nextValue = values.next();
        nextValue.done !== true;
        nextValue = values.next()
      ) {
        this.totalDiscount =
          this.totalDiscount +
          this.toDecimal(nextValue.value.calculatedDiscount);
        this.subTotal =
          this.subTotal + this.toDecimal(nextValue.value.calculatedPrice, 100);
        // this.totalTax = this.totalTax; // + nextValue.value.totalTax;
        this.totalTax =
          this.totalTax +
          nextValue.value.tax.reduce(
            (acc, c) => acc + this.toDecimal(c.calculatedTaxValue, 100),
            0
          );
        customItems = [...customItems, ...nextValue.value.tax];
        // alert(JSON.stringify(nextValue.value.tax));
      }
      this.calculatedTax = this.getGeneralTaxes(customItems);

      this.totalPrice = this.subTotal; // + this.toDecimal(this.deliveryCharges);
      this.subTotalWithTaxes = this.totalPrice + this.totalTax; // - this.totalDiscount;

      if (this.generalDiscountType === '%') {
        this.totalDiscount =
          (this.subTotalWithTaxes * this.generalDiscount) / 100;
        console.log({ des: this.totalDiscount });
      } else {
        this.totalDiscount = this.generalDiscount;
      }
      this.totalPrice =
        this.totalPrice +
        this.totalTax -
        this.totalDiscount +
        this.deliveryCharges;

      console.log({ ORDER_CALCULATED_TAX: this.calculatedTax });
      const configs = this.updateConfigs();
      if (configs) {
        if (configs.roundOff) {
          this.totalDiscount = Math.round(this.totalDiscount);
          const totalRounded = Math.round(this.totalPrice);
          this.roundOffAmount = +Math.fround(
            Math.abs(totalRounded - this.totalPrice)
          ).toFixed(2);

          this.totalPrice = totalRounded;
        }
      }
    });
  }
  getGeneralTaxes(taxes) {
    const newTaxes = _.groupBy(taxes, 'id');
    const newData = Object.values(newTaxes).map(group => {
      return group.reduce(
        (acc, current) => {
          return {
            ...current,
            calculatedTaxValue:
              current.calculatedTaxValue + acc.calculatedTaxValue,
          };
        },
        { calculatedTaxValue: 0 }
      );
    });
    return newData;
  }
  updateConfigs() {
    const configsJSON = Array.from(
      realm.objects('Settings').filtered('name CONTAINS[c] "Transaction"')
    );
    if (!configsJSON[0]) {
      return {};
    }
    const roundOff = +JSON.parse(configsJSON[0].value).find(
      x => x.settingParamName === 'RoundOff'
    ).value;
    const configs = {
      roundOff,
    };
    return configs;
  }
  removeCustomItems(callbacks) {
    if (realm.isInTransaction) {
      realm.cancelTransaction();
    }
    callbacks = callbacks || [];
    realm.write(() => {
      this.customItems = [];
      callbacks.forEach(x => x());
    });
    this.update();
  }
  toDecimal(number, decimals) {
    decimals = decimals || 100;
    return (
      Math.round(
        number.toFixed(decimals.toString().length - 1) * decimals +
          Number.EPSILON
      ) / decimals
    );
  }
  calculateTaxes() {
    const totals = Array.from(this.customItems).reduce(
      (acc, c) => {
        // console.log(c.taxes);
        return {
          subtotal: acc.subtotal + c.calculatedPrice,
          taxes: [...acc.taxes, ...Array.from(c.tax)],
          total: acc.total + c.calculatedPrice,
        };
      },
      {
        subtotal: 0,
        taxes: [],
        total: 0,
      }
    );
    totals.taxesGroup = totals.taxes.reduce((acc, c) => {
      if (!acc[c.name]) {
        acc[c.name] = {
          group: c.name,
          value: this.toDecimal(c.calculatedTaxValue, 100),
        };
      } else {
        acc[c.name].value =
          acc[c.name].value + this.toDecimal(c.calculatedTaxValue, 100);
      }
      return acc;
    }, {});
    totals.total =
      totals.total +
      Object.values(totals.taxesGroup).reduce((acc, c) => {
        return acc + c.value;
      }, 0);
    console.log({ totals_totals: totals });
    return totals;
  }

  async hold() {
    const user = realm.objectForPrimaryKey('User', 0);
    const data = {
      generalDiscount: this.generalDiscount,
      generalDiscountType: this.generalDiscountType,
      deliveryCharges: this.deliveryCharges,
      totalPrice: this.totalPrice,
      subTotal: this.subTotal,
      totalDiscount: this.totalDiscount,
      customerName: this.customer.name,
      customerNumber: this.customer.number,
      customerId: this.customer.customerId,
      userId: user.userId,
      products: JSON.stringify(
        Array.from(this.customItems).map(x => ({
          ...x,
          productId: x.id,
          variants: '',
          tax: Array.from(x.tax),
          taxes: Array.from(x.taxes),
        }))
      ),
      localId: this.savedOrderId || uuid(),
      created_at: +new Date() / 1000,
      updated_at: +new Date() / 1000,
      synced: false,
    };
    //alert(JSON.stringify(data));
    realm.write(() => {
      realm.create('RealmSavedTransaction', data, true);
    });
    await syncUnsynced();
    // try {
    //   const res = await epaisaRequest(data, '/savedtransactions/hold', 'POST');

    //   if (!res.success) {
    //     throw new Error('Transaction not saved');
    //   }
    //   const user = realm.objectForPrimaryKey('User', 0);
    //   if (increment) {
    //     user.incrementSavedTransactions();
    //   }
    //   return Promise.resolve();
    // } catch (error) {
    //   // alert(JSON.stringify({ error }));
    //   alert(JSON.stringify(error));
    //   return Promise.reject(error);
    // }
  }

  getRequest() {
    const orderData = _.pick(this, [
      'deliveryCharges',
      'generalDiscount',
      'totalDiscount',
      'customItems',
      'generalDiscountType',
      'roundOffAmount',
      'salesreturnstatus',
      'serviceCharges',
      'totalTax',
      'subTotal',
      'calculatedDiscount',
      'totalPrice',
      'calculatedTax',
      'customer',
    ]);
    const customItems = this.customItems.map(x => x.getRequest());
    return {
      ...orderData,
      calculatedTax: Array.from(orderData.calculatedTax),
      customItems,
    };
  }

  static voidSavedTransactions(orderId) {
    return epaisaRequest(
      {
        orderId,
      },
      '/savedtransactions/void',
      'POST'
    );
  }

  static getById(id: string): OrderInterface {
    return realm.objectForPrimaryKey(this.schema.name, id);
  }
}
