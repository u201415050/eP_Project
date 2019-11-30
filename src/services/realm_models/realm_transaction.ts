import * as _ from 'lodash';
import moment from 'moment';

export interface RealmTransactionInterface {
  success: number;
  offline?: boolean;
  initiate: RealmTransactionInitiateInterface;
  process?: RealmTransactionProcessInterface;
  finalize?: RealmTransactionFinalizeInterface;
}
export interface RealmTransactionInitiateInterface {
  merchantId?: number;
  userId?: number;
  paymentCurrencyId?: number;
  paymentAmount?: number;
  paymentTipAmount?: number;
  paymentSubTotal?: number;
  paymentTotalDiscount?: number;
  paymentCustomerId?: string;
  paymentStatusId?: number;
  status?: number;
  applicationId?: number;
  created_at?: number;
  updated_at?: number;
  createdUserId?: number;
  updatedUserId?: number;
  checksum?: string;
  paymentId?: number;
}
export interface RealmTransactionProcessInterface {
  applicationId?: number;
  checksum?: string;
  created_at?: number;
  createdUserId?: number;
  merchantId?: number;
  paymentId?: number;
  transactionTypeId?: number;
  transactionStatusId?: number;
  transactionCurrencyId?: number;
  transactionAmount?: number;
  status?: number;
  transactionId?: number;
  updated_at?: number;
  userId?: number;
}
export interface RealmTransactionFinalizeInterface {
  paymentId: number;
  merchantId: number;
  userId: number;
  paymentStatusId: number;
  paymentCurrencyId: number;
  paymentAmount: string;
  paymentTipAmount: string;
  paymentSubTotal: string;
  paymentTotalDiscount: string;
  paymentCustomerId?: string | null;
  checksum: string;
  created_at: number;
  updated_at: number;
  createdUserId: number;
  updatedUserId: number;
  status: number;
  applicationId: number;
}
export default class RealmTransaction implements RealmTransactionInterface {
  success: number;
  offline: boolean;
  initiate: RealmTransactionInitiateInterface;
  process: RealmTransactionProcessInterface;
  finalize: RealmTransactionFinalizeInterface;

  static schema = {
    name: 'RealmTransaction',
    properties: {
      success: 'int',
      offline: 'bool?',
      initiate: 'RealmTransactionInitiate',
      process: 'RealmTransactionProcess?',
      finalize: 'RealmTransactionFinalize?',
    },
  };

  getReceiptHeaderInfo() {
    const type = this.process.transactionTypeId;
    switch (type) {
      case 2:
        return {
          type,
          title: 'Cash Payment',
          icon: 'CashPayments',
        };
      case 14:
        return {
          type,
          title: 'Card Payment',
          icon: 'CardPayments',
        };
      case 5:
      case 6:
      case 7:
      case 8:
      case 9:
      case 15:
      case 16:
      case 17:
      case 18:
      case 19:
      case 25:
      case 26:
        return {
          type,
          title: 'Wallet Payment',
          icon: 'DigitalWalletPayments',
        };
      case 21:
        return {
          type,
          title: 'Cheque Payment',
          icon: 'Cheque',
        };
      case 20:
      case 27:
        return {
          type,
          title: 'Upi Payment',
          icon: 'UpiPayments',
        };
      case 22:
      case 24:
      case 36:
        return {
          type,
          title: 'Card Payment',
          icon: 'CardPayments',
        };
      default:
        break;
    }
  }

  getDetails() {
    const created_at = moment.unix(this.initiate.created_at);
    return [
      {
        name: 'Payment ID',
        value: this.process.paymentId || '',
      },
      {
        name: 'Transaction ID',
        value: this.process.transactionId || '',
      },
      {
        name: 'Date',
        value: created_at.format('DD MMM YYYY'),
      },
      {
        name: 'Time',
        value: created_at.format('HH:mm A'),
      },
    ];
  }
}

export class RealmTransactionInitiate
  implements RealmTransactionInitiateInterface {
  merchantId: number;
  userId: number;
  paymentCurrencyId: number;
  paymentAmount: number;
  paymentTipAmount: number;
  paymentSubTotal: number;
  paymentTotalDiscount: number;
  paymentCustomerId: string;
  paymentStatusId: number;
  status: number;
  applicationId: number;
  created_at: number;
  updated_at: number;
  createdUserId: number;
  updatedUserId: number;
  checksum: string;
  paymentId: number;

  static schema = {
    name: 'RealmTransactionInitiate',
    properties: {
      merchantId: 'int?',
      userId: 'int?',
      paymentCurrencyId: 'int?',
      paymentAmount: 'double?',
      paymentTipAmount: 'double?',
      paymentSubTotal: 'double?',
      paymentTotalDiscount: 'double?',
      paymentCustomerId: 'string?',
      paymentStatusId: 'int?',
      status: 'int?',
      applicationId: 'int?',
      created_at: 'double?',
      updated_at: 'double?',
      createdUserId: 'int?',
      updatedUserId: 'int?',
      checksum: 'string?',
      paymentId: 'int?',
    },
  };
}

export class RealmTransactionProcess
  implements RealmTransactionProcessInterface {
  applicationId: number;
  checksum: string;
  created_at: number;
  createdUserId: number;
  merchantId: number;
  paymentId: number;
  transactionTypeId: number;
  transactionStatusId: number;
  transactionCurrencyId: number;
  transactionAmount: number;
  status: number;
  transactionId: number;
  updated_at: number;
  userId: number;

  static schema = {
    name: 'RealmTransactionProcess',
    properties: {
      applicationId: 'int?',
      checksum: 'string?',
      created_at: 'double?',
      createdUserId: 'int?',
      merchantId: 'int?',
      paymentId: 'int?',
      transactionTypeId: 'int?',
      transactionStatusId: 'int?',
      transactionCurrencyId: 'int?',
      transactionAmount: 'double?',
      status: 'int?',
      transactionId: 'int?',
      updated_at: 'double?',
      userId: 'int?',
    },
  };
}

export class RealmTransactionFinalize
  implements RealmTransactionFinalizeInterface {
  paymentId: number;
  merchantId: number;
  userId: number;
  paymentStatusId: number;
  paymentCurrencyId: number;
  paymentAmount: string;
  paymentTipAmount: string;
  paymentSubTotal: string;
  paymentTotalDiscount: string;
  paymentCustomerId: string;
  checksum: string;
  created_at: number;
  updated_at: number;
  createdUserId: number;
  updatedUserId: number;
  status: number;
  applicationId: number;

  static schema = {
    name: 'RealmTransactionFinalize',
    properties: {
      paymentId: 'int',
      merchantId: 'int',
      userId: 'int',
      paymentStatusId: 'int',
      paymentCurrencyId: 'int',
      paymentAmount: 'string',
      paymentTipAmount: 'string',
      paymentSubTotal: 'string',
      paymentTotalDiscount: 'string',
      paymentCustomerId: 'int?',
      checksum: 'string',
      created_at: 'double',
      updated_at: 'double',
      createdUserId: 'int',
      updatedUserId: 'int',
      status: 'int',
      applicationId: 'int',
    },
  };
}
