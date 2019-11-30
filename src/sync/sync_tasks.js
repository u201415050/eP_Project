import realm, {
  getCreateRow,
  getTable,
  createRow,
  deleteTable,
} from '../services/realm_service';
import { epaisaRequest } from '../services/epaisa_service';
import moment from 'moment';
import * as _ from 'lodash';
import { NetInfo } from 'react-native';
import RealmSavedTransaction from '../services/realm_models/realm_saved_transaction';
import alert_service from '../services/alert_service';
import loading_service from '../services/loading_service';

const formatDate = strDate => {
  return strDate
    .split('/')
    .reverse()
    .join('-');
};

export async function syncUnsynced() {
  const unsynced = Array.from(
    realm.objects('RealmSavedTransaction').filtered(`synced = false`)
  );
  console.log({ unsynced });
  // alert(JSON.stringify(unsynced));
  for (const tx of unsynced) {
    const data_request = tx.getDataForHold();
    //alert(JSON.stringify(data_request));
    console.log({ tx_edit_request: data_request });
    if (tx.orderId) {
      const tx_edit = await epaisaRequest(
        { jsonData: data_request },
        '/savedtransactions/edit',
        'PUT'
      );
      console.log({ tx_edit });
      if (tx_edit.success) {
        realm.write(() => {
          tx.synced = true;
          tx.updated_at = +new Date() / 1000;
        });
      }
      return;
      // await RealmSavedTransaction.voidSavedTransactions(tx.orderId);
    }
    try {
      const tx_res = await epaisaRequest(
        data_request,
        '/savedtransactions/hold',
        'POST'
      );
      if (tx_res.success) {
        realm.write(() => {
          tx.synced = true;
          tx.orderId = tx_res.orderId;
          tx.updated_at = +new Date() / 1000;
        });
      }
    } catch (error) {}
  }
  const paids = Array.from(
    realm.objects('RealmSavedTransaction').filtered(`paid = true`)
  );

  for (const paid of paids) {
    await RealmSavedTransaction.setPaid(paid.orderId);
  }
}
export async function syncFromApi(user) {
  // return;
  try {
    const saved_transactions = await epaisaRequest(
      { merchantId: user.merchantId },
      '/savedtransactions/view',
      'GET'
    );
    if (saved_transactions.success) {
      const data_for_realm = saved_transactions.response
        .filter(x => x.localId && x.userId)
        .map((tx, i) => {
          //if(i===0) alert(JSON.stringify(user))
          console.log('ESTESAVED', tx);
          return {
            ...tx,
            synced: true,
            userId: user.userId,
            // orderId: tx.orderId,
            products: JSON.stringify(tx.products),
          };
        });

      realm.write(() => {
        data_for_realm.forEach(tx => {
          realm.create('RealmSavedTransaction', tx, true);
          console.log(tx);
        });
      });
      const backendLocalIds = data_for_realm.map(x => x.localId);
      Array.from(realm.objects(RealmSavedTransaction.schema.name)).forEach(
        saved => {
          const localId = saved.localId;
          if (!backendLocalIds.find(x => x === localId)) {
            realm.write(() => {
              RealmSavedTransaction.setPaid(localId);
            });
          }
        }
      );
      console.log({
        DATADATADATA: Array.from(
          realm.objects(RealmSavedTransaction.schema.name)
        ),
        // DATADATADATA: ,
      });
    }
  } catch (error) {
    console.log({ error_sync_saved: error });
  }
}
export async function syncSavedTransactions(user) {
  await syncUnsynced();
  await syncFromApi(user);
}
export async function syncEditedUser(user) {
  try {
    let isConnected = await NetInfo.isConnected.fetch();
    if (isConnected) {
      let syncDataUser = realm.objects('EditUser');
      let syncDataBusiness = realm.objects('EditBusiness');
      if (syncDataUser.length != 0) {
        let itemEdit = Array.from(syncDataUser)[0];
        delete itemEdit.id;

        epaisaRequest(itemEdit, '/user/profile', 'PUT');

        realm.write(() => {
          realm.delete(syncDataUser);
        });
      }
      if (syncDataBusiness.length != 0) {
        let itemEdit = Array.from(syncDataBusiness)[0];
        //alert("here"+JSON.stringify(itemEdit))
        delete itemEdit.id;
        //itemEdit.industryId=itemEdit.industryId==0?null:itemEdit.industryId
        //itemEdit.categoryId=itemEdit.industryId==0?null:itemEdit.categoryId
        //delete itemEdit.categoryId
        epaisaRequest(
          {
            ...itemEdit,
            industryId: itemEdit.industryId == 0 ? null : itemEdit.industryId,
            categoryId: itemEdit.industryId == 0 ? null : itemEdit.categoryId,
          },
          '/user/profile',
          'PUT'
        )
          .then(res => {} /*alert(JSON.stringify(res))*/)
          .catch(error => alert(error));

        realm.write(() => {
          realm.delete(syncDataBusiness);
        });
      }
    }
  } catch (error) {
    alert(error);
  }
}
export async function VoidTransactions(user) {
  try {
    let allTransactions = realm.objects('TransactionVoided');

    //alert(allTransactions.length)
    let parameters;
    let res;
    for (let i = 0; i < allTransactions.length; i++) {
      parameters = {
        paymentId: allTransactions[i].paymentId,
        requireVerifiedSetting: false,
      };
      res = await epaisaRequest(parameters, '/payment/void', 'POST');
      //alert(JSON.stringify(res))
    }
    realm.write(() => {
      realm.delete(allTransactions);
    });

    //alert(allTransactions.length)
  } catch (e) {
    alert(e);
  }
}
export async function syncTransactionsFromApi(user, handle, loadData) {
  try {
    let allTransactions = realm.objects('TransactionGrouped');
    //let TransactionItem = realm.objects('TransactionItem')
    //
    /*realm.write(() => {
      realm.delete(allTransactions);
    });*/
    const transactions = await epaisaRequest(
      {
        showSplited: true,
        amountFrom: 0,
        amountTo: 1000000,
        fromDate: moment()
          .subtract(7, 'days')
          .unix()
          .toString(),
        toDate: moment(
          moment()
            .add(1, 'day')
            .format('YYYY/MM/DD')
        )
          .subtract(1, 'second')
          .toString(),
        merchantId: user.merchantId,
        limit: 20,
        offset: 0,
      },
      '/transaction/list',
      'GET'
    );
    //loading_service.hideLoading()
    if (transactions.success == 1) {
      let paymentsId = [];
      transactions.list.map((item, i) => {
        //if(i==0) alert(JSON.stringify(item))
        paymentsId.push(item.PaymentId);

        getCreateRow(
          'TransactionGrouped',
          {
            ...item,
            Customer: item.Customer ? item.Customer : '',
            split: item.split != null ? item.split : '-1',
          },
          true,
          item.list
        );
      });
      if (loadData) {
        // alert(1)
        loadData();
      }
      realm.write(() => {
        const sync = user.sync;
        user.sync = {
          ...(sync || {}),
          transactionsCount: transactions.count,
          transactionsLimit: transactions.limit,
        };
      });
      epaisaRequest(
        {
          merchantId: user.merchantId,
          paymentId: paymentsId,
          include: ['orders'],
        },
        '/payment/list',
        'GET'
      ).then(responsePaym => {
        // alert(JSON.stringify(responsePaym))
        responsePaym.response.map((item2, j) => {
          // if(j==0)alert(JSON.stringify(item2.order))
          try {
            getCreateRow('PaymentGrouped', item2, true);
          } catch (error) {
            // alert(error);
          }
        });
      });
    } else {
      if (transactions.errorCode == '2.2.7') {
        return transactions.message;
      } else {
        if (handle) {
          handle();
        }
      }
    }
  } catch (error) {
    alert(error);
  }
}
export async function GetOneTransaction(user, paymentId) {
  try {
    const transactions = await epaisaRequest(
      {
        showSplited: true,
        merchantId: user.merchantId,
        paymentId: paymentId,
      },
      '/transaction/list',
      'GET'
    );
    //loading_service.hideLoading()
    return transactions;
  } catch (error) {
    alert(error);
  }
}

export async function syncCustomersFromApi(user) {
  try {
    let allCustomers = realm.objects('CustomerAPI');

    //let TransactionItem = realm.objects('TransactionItem')
    //
    realm.write(() => {
      realm.delete(allCustomers);
    });
    let listCustomers = [];
    let offset = 0;
    let total = 0;

    const customers = await epaisaRequest(
      {
        merchantId: user.merchantId,
        //offset,
        otpIsNull: true,
      },
      '/customer',
      'GET'
    );
    if (customers.success) {
      total = user.totalCustomers;
      offset = customers.response.Customer.length;
      listCustomers = customers.response.Customer.filter(item => {
        return item.status == 1;
      });
      // alert((offset<total))
      while (offset < total) {
        let customerres = await epaisaRequest(
          {
            merchantId: user.merchantId,
            offset,
            otpIsNull: true,
          },
          '/customer',
          'GET'
        );
        if (customerres.success) {
          offset = offset + customerres.response.Customer.length;
          listCustomers = [...listCustomers, ...customerres.response.Customer];
        }
      }
    }
    // alert(JSON.stringify(listCustomers))
    listCustomers.map(item => {
      let elementToSend = {
        ...item,
        cityId: item.cityId != null ? item.cityId : 0,
        stateId: item.stateId != null ? item.stateId : 0,
        dob: item.dob != null ? item.dob : '',
        password_hash: item.password_hash != null ? item.password_hash : '',
        updated_at: item.updated_at != null ? item.updated_at : '',
        createdUserId: item.createdUserId != null ? item.createdUserId : 0,
        updatedUserId: item.updatedUserId != null ? item.updatedUserId : 0,
        stateName: item.stateName != null ? item.stateName : '',
        cityName: item.cityName != null ? item.cityName : '',
        customerImage: item.customerImage != null ? item.customerImage : '',
        otp: item.otp != null ? item.otp : '',
        status: 1,
        pincode: item.pincode.toString(),
        countryCode: item.countryCode ? item.countryCode.toString() : '',
        sync: 'y',
      };
      try {
        getCreateRow('CustomerAPI', elementToSend, true);
      } catch (error) {
        alert(error);
      }
    });
    /*if (customers.success) {
      let paymentsId = [];
      transactions.list.map((item, i) => {
        paymentsId.push(item.PaymentId);

        getCreateRow(
          'TransactionGrouped',
          { ...item, Customer: '' },
          true,
          item.list
        );
      });
      realm.write(() => {
        const sync = user.sync;
        user.sync = {
          ...sync,
          transactionsCount: transactions.count,
          transactionsLimit: transactions.limit,
        };
      });
      epaisaRequest(
        {
          merchantId: user.merchantId,
          paymentId: paymentsId,
          include: ['orders'],
        },
        '/payment/list',
        'GET'
      ).then(responsePaym => {
        // alert(JSON.stringify(responsePaym))
        responsePaym.response.map((item2, j) => {
          // if(j==0)alert(JSON.stringify(item2.order))
          try {
            getCreateRow('PaymentGrouped', item2, true);
          } catch (error) {
            // alert(error);
          }
        });
      });
    }*/
  } catch (error) {
    //alert(error);
  }
}
export async function syncOneTransactionFromApi(user, paymentId) {
  try {
    const transactions = await epaisaRequest(
      {
        showSplited: true,
        merchantId: user.merchantId,
        paymentId: paymentId,
      },
      '/transaction/list',
      'GET'
    );
    if (transactions.success) {
      //alert(JSON.stringify(transactions.list[0]))
      let item = transactions.list[0];
      getCreateRow(
        'TransactionGrouped',
        { ...item, Customer: item.Customer != null ? item.Customer : '' },
        true,
        item.list
      );
      epaisaRequest(
        {
          merchantId: user.merchantId,
          paymentId: [paymentId],
          include: ['orders'],
        },
        '/payment/list',
        'GET'
      ).then(responsePaym => {
        // alert(JSON.stringify(responsePaym))
        //responsePaym.response.map((item2, j) => {
        // if(j==0)alert(JSON.stringify(item2))
        try {
          let item2 = responsePaym.response[0];
          getCreateRow('PaymentGrouped', item2, true);
        } catch (error) {
          // alert(error);
        }
        //});
      });
      realm.write(() => {
        const sync = user.sync;
        user.sync = {
          ...sync,
          transactionsCount: sync.transactionsCount + item.Transactions.length,
          transactionsLimit: sync.transactionsLimit + item.Transactions.length,
        };
      });
    } else {
      //alert(JSON.stringify(transactions))
    }
  } catch (error) {
    //alert(error);
  }
}
export async function refundTransaction(paymentId) {
  try {
    let listTrans = getTable('TransactionGrouped').filtered(
      `PaymentId = ${paymentId}`
    );
    realm.write(() => {
      listTrans.Transactions.map(item => {
        item.transactionStatus = 'Refunded';
        item.transactionStatusId = 7;
      });
    });
  } catch (error) {
    //alert(error);
  }
}

export async function unsyncCustomers() {
  const unsyncCustomers = realm.objects('CustomerAPI').filtered("sync = 'n'");
  // alert(JSON.stringify(unsyncCustomers))
  return Array.from(unsyncCustomers);
}
export async function syncIndustries() {
  const response = await epaisaRequest({}, '/masterdata/industries', 'GET');
  if (response.success == 1) {
    deleteTable('Industry');
    const industries = response.response.Industry;
    industries.map(ind => {
      createRow('Industry', ind, true);
    });
    let list = getTable('Industry');
    //alert(JSON.stringify(list[1]));
  }
}
export async function syncAllUnsynchedCustomers(value) {
  for (var i = 0; i < value.length; i++) {
    let jsonToSend = {
      customerId: value[i].customerId,
      email: value[i].email,
      phoneNumber: value[i].phoneNumber,
      address1: value[i].address1,
      firstName: value[i].firstName,
      lastName: value[i].lastName,
      dob: formatDate(value[i].dob),
      customerDetails: value[i].customerDetails,
    };

    const response = await epaisaRequest(jsonToSend, '/customer', 'PUT');
    // alert(JSON.stringify(response))

    const updt = realm.objectForPrimaryKey('CustomerAPI', value[i].customerId);
    realm.write(() => {
      updt.sync = 'y';
    });
  }
}

export async function syncSettings() {
  const user = realm.objectForPrimaryKey('User', 0);
  const { userId, merchantId } = user;
  const unsynced = Array.from(
    realm.objects('Settings').filtered('synced = false')
  );
  for (const setting of unsynced) {
    try {
      const request = await epaisaRequest(
        {
          userId,
          merchantId,
          settingName: setting.name,
          settingoptionsparams: setting.getDataForSync(),
        },
        '/setting',
        'PUT'
      );
      if (request.success) {
        setting.setSynced(true);
      }
    } catch (error) {
      console.log(error);
    }
  }
}
