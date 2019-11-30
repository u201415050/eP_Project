import Order, { OrderInterface } from './order';
import realm from './../realm_service';
import * as _ from 'lodash';
import { epaisaRequest } from '../epaisa_service';
import { RealmTransactionInterface } from './realm_transaction';
import AudioPlayer from 'react-native-audioplayer';
import { getLocalSettingRow } from '../settings_service';
import { NetInfo } from 'react-native';
import User from './user';
import RealmSavedTransaction from './realm_saved_transaction';
import uuid from 'uuid/v1';
export interface RealmPaymentInterface {
  id: string;
  order: OrderInterface;
  paymentCurrencyId?: number;
  paymentTipAmount?: number;
  created_at?: number;
  location?: string;
  customFieldArray?: any[];
  transactions?: any[];
  paymentAmount?: number;
  paymentSubTotal?: number;
  paymentTotalDiscount?: number;
  split?: boolean;
  paymentCustomerId?: string;
  tenderingChange?: number;
  synced?: boolean;
  savedId?: string;
  paying?: boolean;
  getRequest(): any;
  setSynced(val: boolean): void;
  setPaying(val: boolean): void;
}

export default class RealmPayment implements RealmPaymentInterface {
  id: string;
  order: OrderInterface;
  paymentCurrencyId: number;
  paymentTipAmount: number;
  created_at: number;
  location: string;
  customFieldArray: any[];
  transactions: RealmTransactionInterface[];
  paymentAmount: number;
  paymentSubTotal: number;
  paymentTotalDiscount: number;
  split: boolean;
  paymentCustomerId: string;
  tenderingChange: number;
  synced: boolean;
  savedId: string;
  paying: boolean;
  static schema = {
    name: 'RealmPayment',
    primaryKey: 'id',
    properties: {
      id: 'string',
      order: 'Order?',
      split: { type: 'bool', default: false },
      paymentCurrencyId: { type: 'int', default: 25 },
      paymentTipAmount: { type: 'int', default: 0 },
      location: { type: 'string', default: '0.0,0.0' },
      created_at: { type: 'int', default: +new Date() / 1000 },
      customFieldArray: { type: 'string[]', default: [] },
      transactions: { type: 'RealmTransaction[]', default: [] },
      paymentAmount: { type: 'double', default: 0 },
      paymentSubTotal: { type: 'double', default: 0 },
      paymentTotalDiscount: { type: 'double', default: 0 },
      tenderingChange: { type: 'double', default: 0 },
      paymentCustomerId: { type: 'int', optional: true },
      synced: { type: 'bool', default: false },
      savedId: 'string?',
      paying: { type: 'bool', default: false },
    },
  };
  getPaymentId() {
    if (!this.transactions[0]) {
      return null;
    }
    return this.transactions[0].initiate.paymentId;
  }
  static create(data: RealmPaymentInterface) {
    // alert(JSON.stringify(data));
    const { id, order } = data;
    const payment = {
      id,
      paymentAmount: parseFloat(order.totalPrice.toFixed(2)),
      paymentSubTotal: parseFloat(order.subTotal.toFixed(2)),
      paymentTotalDiscount: order.totalDiscount,
      created_at: +new Date() / 1000,
      paymentCurrencyId: 25,
      transactions: [],
      paymentCustomerId: order.getCustomer() || null,
    };
    realm.write(() => {
      const newOrder = realm.create(Order.schema.name, {
        ...order,
        id: uuid(),
      });

      realm.create(this.schema.name, { ...payment, order: newOrder }, true);
    });
  }

  static get(id: string): RealmPaymentInterface {
    return realm.objectForPrimaryKey(this.schema.name, id);
  }

  setChange(val: any) {
    realm.write(() => {
      this.tenderingChange = val;
    });
  }
  static resetCurrent() {
    const payment = realm.objectForPrimaryKey(
      RealmPayment.schema.name,
      'currentPayment'
    );
    realm.write(() => {
      payment.order = null;
      payment.split = false;
      payment.paymentCurrencyId = 25;
      payment.paymentTipAmount = 0;
      payment.location = '0.0;0.0';
      payment.created_at = +new Date() / 1000;
      payment.customFieldArray = [];
      payment.transactions = [];
      payment.paymentAmount = 0;
      payment.paymentSubTotal = 0;
      payment.paymentTotalDiscount = 0;
      payment.paymentCustomerId = null;
      payment.tenderingChange = 0;
    });
  }
  getRequest() {
    const payment_data = _.pick(this, [
      'paymentCurrencyId',
      'paymentAmount',
      'paymentTipAmount',
      'paymentSubTotal',
      'paymentTotalDiscount',
      'created_at',
      'location',
    ]);
    if (this.id !== 'currentPayment') {
      payment_data.localId = this.id;
    }
    const order = this.order.getRequest();
    const customFieldArray = Array.from(this.customFieldArray);
    return {
      ...payment_data,
      order,
      customFieldArray,
      paymentCustomerId: `${_.get(order, 'customer.customerId', '')}`,
    };
  }

  async pay() {
    const currentOrder = Order.getById(User.getCurrentOrder());
    try {
      const transaction_temp: RealmTransactionInterface = {
        success: 1,
        offline: true,
        initiate: {
          created_at: this.created_at,
        },
        process: {
          transactionTypeId: 2,
          transactionStatusId: 2,
          transactionAmount: this.paymentAmount,
        },
      };
      realm.write(() => {
        this.transactions = [transaction_temp];
      });
      if (
        getLocalSettingRow('Device', 'EnableSound') === '1' ||
        getLocalSettingRow('Device', 'EnableSound') == true
      ) {
        AudioPlayer.play('payment_success.mp3');
      }
      const connected = await NetInfo.isConnected.fetch();
      if (!connected) {
        throw new Error('Not connected');
      }
      const savedOrderId = this.order.savedOrderId;
      currentOrder.removeCustomItems();

      const request = await epaisaRequest(
        [this.getRequest()],
        '/payment/offlinetransactions',
        'POST'
      );
      const { success, response } = request;
      if (!success) {
        throw new Error(request.message);
      }

      const initiate = response[0].initiate.response;
      const process = response[0].process.response;
      const finalize = response[0].finalize.response;
      const transaction: RealmTransactionInterface = {
        success,
        initiate,
        process,
        finalize,
      };

      realm.write(() => {
        this.transactions = [transaction];
      });

      if (savedOrderId) {
        RealmSavedTransaction.setPaid(savedOrderId);
      }

      // alert(JSON.stringify(this.transactions));
    } catch (error) {
      if (error.message == 'Not connected') {
        const id = uuid();
        realm.write(() => {
          this.savedId = id;
          realm.create(RealmPayment.schema.name, {
            ...this,
            id,
          });
        });

        if (this.order.savedOrderId) {
          RealmSavedTransaction.setPaid(this.order.savedOrderId);
        }
        currentOrder.removeCustomItems();
      }
      console.log({ cash_payment_error: error });
    }
  }
  setSynced(val: boolean) {
    realm.write(() => {
      this.synced = val;
    });
  }
  setPaying(val: boolean) {
    realm.write(() => {
      this.paying = val;
    });
  }
  static async payWithCash(id: string): Promise<RealmPaymentInterface | false> {
    try {
      const payment = RealmPayment.get(id);
      if (payment.synced) {
        return payment;
      }
      if (payment.paying) {
        return payment;
      }
      payment.setPaying(true);
      const request = await epaisaRequest(
        [payment.getRequest()],
        '/payment/offlinetransactions',
        'POST'
      );
      const { success, response } = request;
      if (success) {
        const initiate = response[0].initiate.response;
        const process = response[0].process.response;
        const finalize = response[0].finalize.response;
        const transaction: RealmTransactionInterface = {
          success,
          initiate,
          process,
          finalize,
        };

        realm.write(() => {
          payment.transactions = [transaction];
          payment.paying = false;
          payment.synced = true;
        });
        // payment.setSynced(true);
        return payment;
      }
      return false;
    } catch (error) {
      console.log({ error });
    }
  }
}
