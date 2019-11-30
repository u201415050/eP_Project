import realm from '../realm_service';
import { epaisaRequest } from '../epaisa_service';
import * as _ from 'lodash';
export default class RealmSavedTransaction {
  static schema = {
    name: 'RealmSavedTransaction',
    primaryKey: 'localId',
    properties: {
      // required for request
      deliveryCharges: 'int',
      generalDiscount: 'int',
      generalDiscountType: 'string',
      subTotal: 'float',
      totalDiscount: 'int',
      totalPrice: 'double',
      customerName: 'string',
      customerNumber: 'string',
      products: 'string', // JSON STRING
      localId: 'string',
      // required local
      userId: 'int',
      synced: { type: 'bool', default: false },
      paid: { type: 'bool', default: false },
      // others
      orderId: 'string?',
      customerId: 'int?',
      applicationId: 'int?',
      created_at: 'int?',
      merchantId: 'int?',
      status: 'int?',
      updated_at: 'int?',
    },
  };
  async remove() {
    return RealmSavedTransaction.setPaid(this.localId);
  }

  getDataForHold() {
    const data = _.pick(this, [
      'deliveryCharges',
      'generalDiscount',
      'generalDiscountType',
      'subTotal',
      'totalDiscount',
      'totalPrice',
      'customerName',
      'customerNumber',
      'localId',
      'userId',
      'orderId',
    ]);
    return {
      ...data,
      products: JSON.parse(this.products),
    };
  }

  static getByUserId(id) {
    const transactions = realm
      .objects('RealmSavedTransaction')
      .filtered(`userId = "${id}"`)
      .filtered('paid = false')
      .sorted('updated_at', true);
    return transactions;
  }
  static async voidSavedTransactions(orderId) {
    const txvoid = await epaisaRequest(
      {
        orderId,
      },
      '/savedtransactions/void',
      'POST'
    );
    return txvoid.success;
  }
  static void(orderId) {
    return epaisaRequest(
      {
        orderId,
      },
      '/savedtransactions/void',
      'POST'
    );
  }
  static async setPaid(id) {
    // alert(id);
    const orderSaved = realm.objectForPrimaryKey('RealmSavedTransaction', id);
    if (!orderSaved) {
      return;
    }
    try {
      const res = await RealmSavedTransaction.void(orderSaved.orderId);
      if (
        res.success ||
        res.response == 'This Saved Transaction does not exist.'
      ) {
        return realm.write(() => {
          realm.delete(orderSaved);
        });
      }
      throw new Error('This Saved Transaction does not exist.');
    } catch (error) {
      console.log({ set_paid_error: error });
      return realm.write(() => {
        orderSaved.paid = true;
      });
    }
  }
}
