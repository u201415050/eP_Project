import realm, { getTable } from './src/services/realm_service';
import PaymentService from './src/factory/utils/PaymentService';
import Payment from './src/factory/payment';
import Order from './src/factory/order';
import { ToastAndroid, Platform } from 'react-native';
import { getLocalSettingRow } from './src/services/settings_service';
import { epaisaRequest } from './src/services/epaisa_service';
import {
  syncSavedTransactions,
  syncTransactionsFromApi,
  syncEditedUser,
  syncCustomersFromApi,
  VoidTransactions,
  unsyncCustomers,
  syncAllUnsynchedCustomers,
  syncSettings,
  syncIndustries,
} from './src/sync/sync_tasks';
import { RealmTax } from './src/services/realm_models/realm_tax';
import uuid from 'uuid/v1';
import BackgroundFetch from 'react-native-background-fetch';
import Notification from './src/services/realm_models/notification';
import moment from 'moment';
import QueuedRequest from './src/services/realm_models/queued_request';
import RealmPayment from './src/services/realm_models/realm_payment';
// const payment_service = new PaymentService();

// async function request(item) {
//   try {
//     const response = await payment_service.cashPaymentRequest([item.payment]);
//     return Promise.resolve({ response, local: item.local });
//   } catch (error) {
//     return Promise.resolve({ response: { success: false } });
//   }
// }
module.exports = async () => {
  // do stuff
  console.log('Headless JS task was fired!'); // eslint-disable-line no-console
  // alert('Headless JS task was fired!');

  const unpaid = Array.from(
    realm
      .objects(RealmPayment.schema.name)
      .filtered(`synced = false`)
      .filtered(`paying = false`)
      .filtered('id != "currentPayment"')
  );

  if (unpaid.length > 0) {
    const unpaid_requests = unpaid.map(payment => {
      return payment.getRequest();
    });
    unpaid.forEach(payment => {
      payment.setPaying(true);
    });
    epaisaRequest(unpaid_requests, '/payment/offlinetransactions', 'POST')
      .then(res => {
        if (!res.success) {
          realm.write(() => {
            unpaid.forEach(payment => {
              payment.synced = false;
              payment.paying = false;
            });
          });
        }
      })
      .catch(err => console.log(err));
    realm.write(() => {
      unpaid.forEach(payment => {
        payment.synced = true;
      });
    });
  }

  const user = realm.objectForPrimaryKey('User', 0);
  if (!user) {
    return;
  }
  syncEditedUser(user);

  const syncCustomers = await unsyncCustomers();
  // alert(JSON.stringify(syncCustomers))
  if (syncCustomers.length > 0) {
    // alert('on sync')
    syncAllUnsynchedCustomers(syncCustomers);
  } else {
    syncCustomersFromApi(user);
  }
  syncIndustries();
  VoidTransactions(user);
  const user_sync = user.sync;

  console.log({ REALMTAX: realm.objects('RealmTax') });

  if (!user_sync.taxes) {
    // const taxes = Array.from(realm.objects('Tax'));

    // SAVE TAXES
    epaisaRequest({}, '/slabtaxes', 'GET')
      .then(taxes => {
        console.log(JSON.stringify(taxes));

        // alert(JSON.stringify(taxes))
        if (taxes.success) {
          const newTaxes = RealmTax.formatTaxes(taxes.response);

          realm.write(() => {
            newTaxes.forEach(tax => {
              console.log('#TAX SAVED');
              realm.create('RealmTax', { id: uuid(), ...tax });
            });
            user_sync.taxes = true;
          });
        }
      })
      .catch(err => console.log(err));
    // if(Array.from(getTable('Tax')).length > 0){
    //   alert(JSON.stringify(Array.from(getTable('Tax'))))
    // }
  }
  if (!user_sync.saved_transactions) {
    await syncSavedTransactions(user);
  }
  const notificationsData = await epaisaRequest(
    '',
    '/notifications/list',
    'GET'
  );

  if (notificationsData.success) {
    const { response } = notificationsData;
    const notifications = response.Notifications;
    for (const notification of notifications) {
      Notification.create({
        ...notification,
        userId: user.userId,
        notificationId: +notification.notificationId,
        date: moment(
          `${notification.date} ${notification.time}`,
          'YYYY-MM-DD HH:mm:ss'
        ).toDate(),
      });
    }
  }
  // if (!user_sync.transactions) {
  await syncTransactionsFromApi(user);
  // }

  // UNUSED SYNC OFFLINE >>>>>
  // const items = getTable('Payment')
  //   .filtered(`synced = false`)
  //   .map(x => {
  //     return { item: JSON.parse(JSON.stringify(x)), local: x };
  //   })
  //   .map(({ item, local }) => {
  //     item.order.customItems = Object.values(item.order.customItems);
  //     return { item, local };
  //   })
  //   .map(({ item, local }) => {
  //     let configs = { roundOff: false };
  //     if (
  //       getLocalSettingRow('Transaction', 'RoundOff') == true ||
  //       getLocalSettingRow('Transaction', 'RoundOff') == 1
  //     ) {
  //       configs.roundOff = true;
  //     }
  //     const order = new Order(
  //       {
  //         generalDiscount: item.order.generalDiscount,
  //         generalDiscountType: item.order.generalDiscountType,
  //         deliveryCharges: item.order.deliveryCharges,
  //         products: [],
  //       },
  //       configs
  //     );
  //     order.addCustomItems(item.order.customItems);
  //     // order.customer = item.order.customer;
  //     const payment = new Payment(order);
  //     payment.paymentCustomerId = item.paymentCustomerId;
  //     return { payment, local };
  //   });
  // console.log({ pending_offline_payments: items });
  // if (items.length > 0 && Platform.OS === 'android') {
  //   ToastAndroid.showWithGravityAndOffset(
  //     'Syncing...',
  //     ToastAndroid.SHORT,
  //     ToastAndroid.BOTTOM,
  //     25,
  //     50
  //   );
  // }
  // const promises = [];
  // // return;

  // for (const item of items) {
  //   promises.push(request(item));
  // }
  // Promise.all(promises).then(items => {
  //   console.log({ items });
  //   for (let res of items) {
  //     if (res.response.success === 0 || res.response.success === false) {
  //       continue;
  //     }
  //     if (
  //       res.response.response[0].success === 0 ||
  //       res.response.response[0].success === false
  //     ) {
  //       continue;
  //     }
  //     realm.write(() => {
  //       res.local.synced = true;
  //     });
  //   }
  // });
  // <<<<<<<
  if (Platform.OS === 'ios') {
    BackgroundFetch.finish();
  }

  await syncSettings();
  ToastAndroid.showWithGravityAndOffset(
    'Synced',
    ToastAndroid.SHORT,
    ToastAndroid.BOTTOM,
    25,
    50
  );
};
