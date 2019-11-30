import Realm from 'realm';
import Order from './realm_models/order';
import RealmSavedTransaction from './realm_models/realm_saved_transaction';
import { RealmTax, RealmTaxValue } from './realm_models/realm_tax';
import CustomItem from './realm_models/custom_item';
import Notification from './realm_models/notification';
import CardReader from './realm_models/card_reader';
import Settings from './realm_models/settings';
import RealmDeviceInfo from './realm_models/RealmDeviceInfo';
import RealmPayment from './realm_models/realm_payment';
import FingerprintUser from './realm_models/fingerprint_user';
import RealmTransaction, {
  RealmTransactionInitiate,
  RealmTransactionFinalize,
  RealmTransactionProcess,
} from './realm_models/realm_transaction';
import QueuedRequest from './realm_models/queued_request';
import User from './realm_models/user';
class Product {}
Product.schema = {
  name: 'Product',
  properties: {
    id: 'int',
    name: 'string',
    quant: 'int',
    unitPrice: 'string',
    total: 'string',
    discount: 'string',
    type: 'string',
    image: 'string',
    cess: 'string',
    vat: 'string',
    sgst: 'string',
    cgst: 'string',
    igst: 'string',
  },
};

class Extra {}
Extra.schema = {
  name: 'Extra',
  properties: {
    discount: 'string',
    delivery: 'string',
    option: 'string',
    type: 'string',
  },
};

class Customer {}
Customer.schema = {
  name: 'Customer',
  primaryKey: 'id',
  properties: {
    id: 'string?',
    customerId: 'int?',
    name: 'string',
    number: 'string',
  },
};

class CustomerAPI {
  static schema = {
    name: 'CustomerAPI',
    primaryKey: 'customerId',
    properties: {
      customerId: 'string',
      firstName: 'string',
      lastName: 'string',
      email: 'string',
      phoneNumber: 'string',
      password_hash: 'string?',
      otp: 'string?',
      dob: 'string?',
      address1: 'string?',
      address2: 'string?',
      created_at: 'string?',
      updated_at: 'string?',
      createdUserId: 'int?',
      updatedUserId: 'int?',
      status: 'int?',
      cityId: 'int?',
      stateName: 'string?',
      cityName: 'string?',
      stateId: 'int?',
      pincode: 'string?',
      countryCode: 'string',
      customerImage: 'string?',
      customerDetails: 'ParamsCustomer[]',
      sync: 'string?', // y -> yes - n -> no
    },
  };
}
class ParamsCustomer {
  static schema = {
    name: 'ParamsCustomer',
    properties: {
      paramName: 'string',
      paramValue: 'string',
    },
  };
}
class Location {
  static schema = {
    name: 'Location',
    properties: {
      speed: 'int?',
      heading: 'int?',
      accuracy: 'int?',
      longitude: 'float?',
      altitude: 'float?',
      latitude: 'float?',
    },
  };
}

class UserLogged {
  static schema = {
    name: 'UserLogged',
    properties: {
      userId: 'int',
    },
  };
}

class MerchantPlanDetails {
  static schema = {
    name: 'MerchantPlanDetails',
    properties: {
      planId: 'int?',
      planName: 'string?',
      startDate: 'string?',
      endDate: 'string?',
      price: 'string?',
    },
  };
}
class Merchant {
  static schema = {
    name: 'Merchant',
    properties: {
      id: 'int',
      merchantCompanyName: 'string?',
      cityName: 'string?',
      stateName: 'string?',
      planId: 'int?',
      planDetails: 'MerchantPlanDetails',
    },
  };

  static getPlanName(planId) {
    const plans = {
      1: 'Free',
      2: 'Shuruwat',
      3: 'Suvidha',
      4: 'Unnati',
      5: 'Munafa',
      6: 'Privileges',
      7: 'Merchant SDK',
      8: 'Sub Merchant SDK',
      9: 'Master Wallet Free',
      10: 'Development',
      11: 'Master Wallet 99',
      12: 'Complementary Plan',
      13: 'Payment Plan',
      14: 'POS Plan',
      15: 'POS Plus Plan',
    };
    return plans[planId];
  }
}

class UserSync {
  static schema = {
    name: 'UserSync',
    properties: {
      taxes: { type: 'bool', default: false },
      saved_transactions: { type: 'bool', default: false },
      transactions: { type: 'bool', default: false },
      transactionsCount: { type: 'int', default: 20 },
      transactionsLimit: { type: 'int', default: 20 },
    },
  };
}

class EditUser {
  static schema = {
    name: 'EditUser',
    primaryKey: 'id',
    properties: {
      id: 'int',
      username: { type: 'string', default: '' },
      userMobileNumber: { type: 'string', default: '' },
      userFirstName: { type: 'string', default: '' },
      userLastName: { type: 'string', default: '' },
      cityName: { type: 'string', default: '' },
      stateName: { type: 'string', default: '' },
      userAddress1: { type: 'string', default: '' },
      userAddress2: { type: 'string', default: '' },
      pincode: { type: 'string', default: '' },
      dateOfBirth: { type: 'string', default: '' },
      merchantCountryCode: { type: 'string', default: '' },
    },
  };
}
class EditBusiness {
  static schema = {
    name: 'EditBusiness',
    primaryKey: 'id',
    properties: {
      id: 'int',
      merchantCompanyName: { type: 'string', default: '' },
      businessTypeId: { type: 'int', default: 0 },
      merchantPANCode: { type: 'string', default: '' },
      merchantYearlyRevenue: { type: 'int', default: 0 },
      industryName: { type: 'string', default: '' },
      categoryName: { type: 'string', default: '' },
      industryId: { type: 'int', default: 0 },
      categoryId: { type: 'int', default: 0 },
    },
  };
}
class TransactionVoided {
  static schema = {
    name: 'TransactionVoided',
    primaryKey: 'paymentId',
    properties: {
      paymentId: 'int',
    },
  };
}

class CustomTax {
  static schema = {
    name: 'CustomTax',
    properties: {
      name: 'string',
      group: 'string',
      type: 'string',
      value: 'double',
      enteredValue: 'double',
    },
  };
}
class CustomItemTax {
  static schema = {
    name: 'CustomItemTax',
    primaryKey: 'taxId',
    properties: {
      taxId: 'string',
      id: 'int?',
      calculatedTaxValue: 'double',
      name: 'string',
      taxMode: 'string',
      taxServiceIncluded: { type: 'int?', default: 0 },
      taxType: 'string?',
      value: 'double',
    },
  };
}

class Payment {}
Payment.schema = {
  name: 'Payment',
  primaryKey: 'id',
  properties: {
    id: 'string',
    order: 'Order',
    synced: { type: 'bool', default: false },
    paymentCurrencyId: 'int',
    paymentAmount: 'double',
    paymentTipAmount: 'double',
    paymentSubTotal: 'double',
    paymentTotalDiscount: 'double',
    paymentCustomerId: 'string',
    created_at: 'int',
    location: 'string',
    tenderingChange: { type: 'double', default: 0 },
    // customFieldArray: 'any[]',
  },
};

class GeneralTax {
  static schema = {
    name: 'GeneralTax',
    properties: {
      taxId: 'string?',
      id: 'int?',
      calculatedTaxValue: 'double?',
      name: 'string?',
      taxMode: 'string?',
      taxServiceIncluded: { type: 'int', default: 0 },
      taxType: 'string?',
      value: 'double?',
      // completed: { type: 'bool', default: false },
      // parameters: { type: 'string', default: '' },
      // endpoint: 'string',
      // method: 'string',
      // created_at: 'date?',
      // attempts: { type: 'int', default: 0 },
      // errors: { type: 'string[]', default: [] },
      // key: { type: 'string', default: '' },
      // extra: { type: 'string', default: '' },
      // response: { type: 'string[]', default: [] },
    },
  };
}
class Tax {
  static schema = {
    name: 'Tax',
    properties: {
      id: 'int?',
      name: 'string',
      slabs: 'double[]',
      value: 'double[]',
      mode: 'string?',
      created_at: 'float?',
      updated_at: 'float?',
      status: 'int?',
    },
  };
}

class TransactionItem {
  static schema = {
    name: 'TransactionItem',
    primaryKey: 'transactionId',
    properties: {
      applicationId: 'int',
      created_at: 'float',
      merchantCompanyName: 'string',
      merchantId: 'int',
      name: 'string',
      paymentId: 'int',
      transactionAmount: 'string',
      transactionDetails: 'int[]',
      transactionId: 'int',
      transactionStatus: 'string',
      transactionStatusId: 'int',
      transactionType: 'string',
      transactionTypeId: 'int',
      userId: 'int',
    },
  };
}

class TransactionGrouped {
  static schema = {
    name: 'TransactionGrouped',
    primaryKey: 'PaymentId',
    properties: {
      Customer: { type: 'string', default: '' },
      PaymentId: 'int',
      Transactions: 'TransactionItem[]',
      split: 'string?',
      paymentStatusId: 'int?',
    },
  };
}

class PaymentGrouped {
  static schema = {
    name: 'PaymentGrouped',
    primaryKey: 'paymentId',
    properties: {
      created_at: 'int',
      deliveryCharges: 'float',
      merchantId: 'int',
      order: 'CustomOrderPayment',
      orderId: 'string',
      paymentAmount: 'float',
      paymentId: 'int',
      paymentStatusId: 'int',
      paymentSubTotal: 'float',
      paymentTipAmount: 'float',
      paymentTotalDiscount: 'float',
      serviceCharges: 'float',
      status: 'int',
      updated_at: 'int',
      user: 'string',
      userId: 'int',
    },
  };
}
class CustomOrderPayment {
  static schema = {
    name: 'CustomOrderPayment',
    properties: {
      calculatedDiscount: { type: 'float', default: 0 },
      customItems: 'CustomItemPayment[]',
      deliveryCharges: 'float',
      generalDiscount: 'float',
      generalDiscountType: { type: 'string', default: '%' },
      merchantId: 'int',
      orderId: 'string',
      status: 'int',
      subTotal: 'float',
      totalDiscount: 'float',
      totalPrice: { type: 'float', default: 0 },
      totalTax: { type: 'float', default: 0 },
      calculatedTax: 'TaxItem[]',
    },
  };
}
class TaxItem {
  static schema = {
    name: 'TaxItem',
    properties: {
      name: 'string',
      value: 'float',
      calculatedTaxValue: 'float',
    },
  };
}
class CustomItemPayment {
  static schema = {
    name: 'CustomItemPayment',
    properties: {
      discountEntered: 'double',
      discountType: { type: 'string', default: '%' },
      name: 'string',
      quantity: 'double',
      unitPrice: 'double',
      //tax: { type: 'CustomItemTax[]', default: [] },
      //taxes: { type: 'CustomTax[]', default: [] },
      basePrice: 'double',
      discount: 'double',
      calculatedPrice: 'double',
      calculatedDiscount: 'double',
    },
  };
}
class Industry {
  static schema = {
    name: 'Industry',
    primaryKey: 'industryId',
    properties: {
      industryId: 'int',
      industryName: 'string',
      IndustryType: 'Category[]',
    },
  };
}
class Category {
  static schema = {
    name: 'Category',
    primaryKey: 'industryId',
    properties: {
      industryId: 'int',
      industryName: 'string',
    },
  };
}
const version = 83;
const encryptionKey = new Int8Array(64);
const realm = new Realm({
  encryptionKey,
  schema: [
    Settings,
    Product,
    Extra,
    Payment,
    Order,
    CustomItem,
    Notification,
    User,
    Location,
    RealmDeviceInfo,
    CardReader,
    Customer,
    CustomTax,
    Merchant,
    MerchantPlanDetails,
    QueuedRequest,
    FingerprintUser,
    Tax,
    RealmPayment,
    CustomItemTax,
    TransactionItem,
    TransactionGrouped,
    UserSync,
    RealmSavedTransaction,
    PaymentGrouped,
    CustomOrderPayment,
    CustomItemPayment,
    UserLogged,
    RealmTaxValue,
    RealmTax,
    EditUser,
    EditBusiness,
    CustomerAPI,
    ParamsCustomer,
    TransactionVoided,
    GeneralTax,
    TaxItem,
    RealmTransaction,
    RealmTransactionInitiate,
    RealmTransactionFinalize,
    RealmTransactionProcess,
    Industry,
    Category,
  ],
  schemaVersion: version,
  migration: (oldRealm, newRealm) => {
    // only apply this change if upgrading to schemaVersion 1
    if (oldRealm.schemaVersion < version) {
      let oldObjects = oldRealm.objects('User');
      let newObjects = newRealm.objects('User');
      // loop through all objects and set the name property in the new schema
      for (let i = 0; i < oldObjects.length; i++) {
        if (!oldObjects[i].userId) {
          newObjects[i].userId = oldObjects[i].id;
        }
      }

      oldObjects = oldRealm.objects('CardReader');
      newObjects = newRealm.objects('CardReader');
      // loop through all objects and set the name property in the new schema
      for (let i = 0; i < oldObjects.length; i++) {
        if (!oldObjects[i].deviceId) {
          newObjects[i].deviceId = oldObjects[i].id;
        }
      }
    }
  },
});

export function createRow(name, data, update) {
  update = update || false;
  console.log({ name, data, update });

  realm.write(() => {
    realm.create(name, data, update);
  });
}
export function getCreateRow(name, data, update) {
  update = update || false;
  console.log({ name, data, update });

  realm.write(() => {
    realm.create(name, data, update);
  });
}

export function updateRow(updater) {
  realm.write(updater);
}

export function deleteTable(name) {
  realm.write(() => {
    let all = realm.objects(name);
    realm.delete(all);
  });
}

export function clearTable() {
  realm.write(() => {
    let extras = realm.objects('Extra');
    extras[0].discount = '0';
    extras[0].delivery = '0';
    extras[0].option = '0';
    extras[0].type = '%';
  });
}

export function setTable(data) {
  realm.write(() => {
    let extras = realm.objects('Extra');
    extras[0].discount = data.discount;
    extras[0].delivery = data.delivery;
    extras[0].option = data.option;
    extras[0].type = data.type;
  });
}
export function getTable(name) {
  // createRow('Settings', {
  //   id: 1,
  //   type: 'DEVICE',
  //   setting_name: 'PRINTER_ACTIVE',
  //   value: '1',
  // });
  return realm.objects(name);
}
export default realm;
