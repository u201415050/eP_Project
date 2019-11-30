import { EventEmitter } from 'events';
import realm from '../realm_service';
interface UserInterface {
  id: number;
  userId: number;
  merchantId?: number;
  storeLocationId?: number;
  pubsubToken?: string;
  auth_key?: string;
  savedTransactions: number;
  authenticated: boolean;
  totalCustomers: number;
  merchant?: any;
  userImage?: string;
  sync?: any;
  cityName?: string;
  pincode?: string;
  roleId?: number;
  roleName?: string;
  storeAddress?: string;
  storeAddress2?: string;
  userAddress1?: string;
  userAddress2?: string;
  userFirstName?: string;
  userLastName?: string;
  userMobileNumber?: string;
  username?: string;
  companyName?: string;
}

export default class User extends EventEmitter implements UserInterface {
  id: number;
  userId: number;
  merchantId: number;
  storeLocationId: number;
  pubsubToken: string;
  auth_key: string;
  savedTransactions: number;
  authenticated: boolean;
  totalCustomers: number;
  merchant: any;
  userImage: string;
  sync: any;
  cityName: string;
  pincode: string;
  roleId: number;
  roleName: string;
  storeAddress: string;
  storeAddress2: string;
  userAddress1: string;
  userAddress2: string;
  userFirstName: string;
  userLastName: string;
  userMobileNumber: string;
  username: string;
  companyName: string;

  static schema = {
    name: 'User',
    primaryKey: 'id',
    properties: {
      id: 'int',
      userId: 'int',
      merchantId: 'int?',
      storeLocationId: 'int?',
      pubsubToken: 'string?',
      auth_key: 'string?',
      savedTransactions: { type: 'int', default: 0 },
      authenticated: { type: 'bool', default: false },
      totalCustomers: { type: 'int', default: 0 },
      merchant: 'Merchant?',
      userImage: 'string?',
      sync: 'UserSync?',
      // auth_key_creationtime: 'int?',
      // cityId: 'int?',
      cityName: 'string?',
      // countryCode: 'string?',
      // created_at: 'int?',
      // dateOfBirth: 'string?',
      // fingerprint: 'string?',
      // firebaseToken: 'string?',
      // inactivated_at: 'string?',
      // loginAttempt: 'int?',
      // merchantId: 'int?',
      pincode: 'string?',
      // pubsubToken: 'string?',
      roleId: 'int?',
      roleName: 'string?',
      // rolePlan: 'string?',
      // stateId: 'int?',
      stateName: 'string?',
      // status: 'int?',
      storeAddress: 'string?',
      storeAddress2: 'string?',
      // storeCaption: 'string?',
      // storeCityName: 'string?',
      // storeLocationId: 'int',
      // storePincode: 'string?',
      // storeStateName: 'string?',
      // twofactor: 'string?',
      // unVerifiedUserMobileNumber: 'int?',
      // unVerifiedUsername: 'int?',
      // updated_at: 'int?',
      userAddress1: 'string?',
      userAddress2: 'string?',
      // userAppVersion: 'string?',
      userFirstName: 'string?',
      // userIMEI: 'string?',
      // userImage: 'string?',
      userLastName: 'string?',
      // userMiddleName: 'string?',
      userMobileNumber: 'string?',
      // userPanNumber: 'string?',
      // userRole: 'string?',
      username: 'string?',
      companyName: 'string?',
    },
  };

  getPlan() {
    return this.merchant.planDetails;
  }

  updateSavedTransactions(value) {
    realm.write(() => {
      this.savedTransactions = value;
    });
  }
  incrementSavedTransactions() {
    realm.write(() => {
      this.savedTransactions = this.savedTransactions + 1;
    });
  }

  decrementSavedTransactions() {
    realm.write(() => {
      this.savedTransactions = this.savedTransactions - 1;
    });
  }

  signOut() {
    realm.write(() => {
      this.authenticated = false;
      this.companyName = null;
      let allTransactItems = realm.objects('TransactionItem');
      realm.delete(allTransactItems);
      let allTransactGroup = realm.objects('TransactionGrouped');
      realm.delete(allTransactGroup);
      let allCustomItem = realm.objects('CustomItemPayment');
      realm.delete(allCustomItem);
      let allCustomOrder = realm.objects('CustomOrderPayment');
      realm.delete(allCustomOrder);
      let allPaymet = realm.objects('PaymentGrouped');
      realm.delete(allPaymet);
      let allTaxes = realm.objects('RealmTax');
      realm.delete(allTaxes);
      let allCust = realm.objects('CustomerAPI');
      realm.delete(allCust);
    });
  }

  static getCurrentOrder() {
    const user: UserInterface = realm.objectForPrimaryKey(User.schema.name, 0);
    return `currentOrder_${user.userId}`.toString();
  }

  static getCurrentUser(): UserInterface {
    return realm.objectForPrimaryKey(User.schema.name, 0);
  }
}
