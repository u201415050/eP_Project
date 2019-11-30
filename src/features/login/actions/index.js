import { userConstants } from '../api/auth/constants';
import { AsyncStorage, Platform } from 'react-native';
import * as userService from '../services/user_service';
import * as settings_service from 'services/settings_service';
import NavigationService from '../../../services/navigation';
import { FINGERPRINT, MAIN_MENU } from './../api/screen_names';
import notifications_service from '../../../services/notifications_service';
import realm, { createRow, getTable } from '../../../services/realm_service';
import RCTRealtime from '../../../services/RCTRealtime';
import { setOrder } from '../../payments/actions/payment_actions';
import * as _ from 'lodash';
import { LOGIN } from '../../../navigation/screen_names';
import { setUser } from '../../auth/actions/auth_actions';
import { epaisaRequest } from '../../../services/epaisa_service';
import { cashConstants } from '../../cash_register/constants/actions';
import loading_service from '../../../services/loading_service';
import SyncAdapter from 'react-native-sync-adapter';
import BackgroundTask from '../../../../sync';
import CardReader from '../../../services/realm_models/card_reader';
import RealmDeviceInfo from '../../../services/realm_models/RealmDeviceInfo';
import uuid from 'uuid/v4';
import biometrics from '../../../services/biometrics';
import FingerprintUser from '../../../services/realm_models/fingerprint_user';
import DeviceInfo from 'react-native-device-info';
import { Alert } from '../components_general/alert_message';
export function login(
  email,
  password,
  signature,
  handle,
  close,
  showalert,
  changeStatus
) {
  //alert(JSON.stringify(close));
  return dispatch => {
    //loading_service.showLoading();
    dispatch(request({ email }));

    loginUser(email, password, signature)
      .then(async res => {
        const { success } = res;
        console.log('DEAQUISACA', res);
        if (success) {
          const { success, ...user } = res;
          // alert(JSON.stringify(res.merchant));
          if (
            res.response.unVerifiedUserMobileNumber == 0 ||
            res.response.unVerifiedUsername == 0
          ) {
            if (changeStatus) {
              changeStatus('success');
            }
            //alert(JSON.stringify(res))
            const userData = _.pick(res.response, [
              'id',
              'merchantId',
              'storeLocationId',
              'pubsubToken',
              'auth_key',
              'username',
              'userFirstName',
              'userMobileNumber',
              'userLastName',
              'userImage',
              'roleId',
              'userAddress1',
              'userAddress2',
              'storeAddress',
              'storeAddress2',
              'stateName',
              'cityName',
              'pincode',
            ]);
            const mainUser = {
              ...userData,
              roleId: userData.roleId,
              userId: userData.id,
              savedTransactions: res.savedTransactions,
              authenticated: true,
              merchant: {
                id: userData.merchantId,
                merchantCompanyName: res.merchant.merchantCompanyName,
                cityName: res.merchant.cityName,
                stateName: res.merchant.stateName,
                planId: res.merchant.planId,
                planDetails: {
                  planId: res.merchant.planId,
                  // planName: res.merchant.planDetails.planName,
                  // startDate: res.merchant.planDetails.startDate,
                  // endDate: res.merchant.planDetails.endDate,
                  // price: res.merchant.planDetails.price,
                },
              },
              sync: {
                taxes: false,
                saved_transactions: false,
              },
              //companyName:res.companyName
            };
            createRow(
              'User',
              {
                ...mainUser,
                ...(res.companyName ? { companyName: user.companyName } : {}),
              },
              true
            );
            createRow(
              'User',
              {
                ...mainUser,
                id: 0,
                ...(res.companyName ? { companyName: user.companyName } : {}),
              },
              true
            );
            const fingerprint_user = FingerprintUser.getById(userData.id);

            FingerprintUser.create({
              id: userData.id,
              lastLogin: new Date(),
              rejected: _.get(fingerprint_user, 'rejected', false),
              linked: _.get(fingerprint_user, 'linked', false),
              prompt: _.get(fingerprint_user, 'prompt', false),
            });
            const realmUser = realm.objectForPrimaryKey('User', 0);

            dispatch(setOrder());
            dispatch(setUser());
            epaisaRequest({}, '/user/profile', 'GET')
              .then(res => {
                if (res.success) {
                  const merchant = res.response.merchant;
                  realm.write(() => {
                    realmUser.merchant.planDetails = merchant.planDetails;
                  });
                }
              })
              .catch(err => console.log(err));
            notifications_service.init(res.response.id);
            try {
              RCTRealtime.init();
            } catch (error) {}
            const params = {
              storeLocationId: realmUser.storeLocationId,
              merchantId: realmUser.merchantId,
              userId: realmUser.userId,
              params: [
                {
                  field: 'Sale',
                  group: 'Invoice',
                  gstDetailId: 0,
                  isSystemDetails: 1,
                  paramDisplayName: 'Prefix',
                  paramName: 'saleInvoiceNumberFormat',
                  paramValue: `INV${realmUser.storeLocationId}`,
                },
                {
                  field: 'Sale',
                  group: 'Invoice',
                  gstDetailId: 0,
                  isSystemDetails: 1,
                  paramDisplayName: 'Serial Number',
                  paramName: 'saleInvoiceNumberStart',
                  paramValue: '000001',
                },
              ],
            };

            // epaisaRequest(
            //   {
            //     merchantId: userData.merchantId,
            //   },
            //   '/user/profile',
            //   'GET'
            // ).then(({ response }) => {
            //   console.log(response)
            //   dispatch({
            //     type: cashConstants.SET_PERSONALCONFIG,
            //     payload: response,
            //   });
            // });
            dispatch({
              type: cashConstants.SET_PERSONALCONFIG,
              payload: { user: res.response, merchant: res.merchant },
            });
            epaisaRequest(
              {
                merchantId: realmUser.merchantId,
                otpIsNull: true,
              },
              '/customer',
              'GET'
            ).then(customers => {
              if (!customers.success) {
                throw new Error(customers.message);
              }
              realm.write(() => {
                realmUser.totalCustomers = +customers.response.Total;
              });

              /* dispatch({
              type: cashConstants.SET_USER,
              payload: user,
            });*/
              dispatch({
                type: cashConstants.LIST_CUSTOMERS,
                payload: {
                  customers:
                    customers.success == 1 ? customers.response.Customer : [],
                  totalCustomers: customers.response.Total,
                  userdata: {
                    auth_key: res.response.auth_key,
                    merchantId: res.response.merchantId,
                  },
                },
              });
            });

            await AsyncStorage.setItem(`LiveChatToken`, uuid());
            // const token = await AsyncStorage.getItem(`LiveChatToken`)
            // alert(''+token)

            await settings_service.setLocalSettings();
            const settings = Array.from(
              realm.objects('Settings').filtered(`name = "Invoice Settings"`)
            );
            const invoiceSetting = settings[0];
            console.log({ invoiceSetting });
            if (invoiceSetting) {
              const value = Boolean(
                +invoiceSetting.get('is_InvoiceSettingEnabled')
              );
              if (!value) {
                epaisaRequest(params, '/merchant/invoice/settings', 'POST')
                  .then(({ success }) => {
                    if (success) {
                      invoiceSetting.updateValue(
                        'is_InvoiceSettingEnabled',
                        '1'
                      );
                      console.log({ invoiceSetting });
                    }
                  })
                  .catch(error => {
                    console.log(error);
                  });
              }
            }

            CardReader.fetch(realmUser.merchantId);
            notifications_service.fetch(true);

            if (Platform.OS === 'android') {
              SyncAdapter.syncImmediately({
                syncInterval: 12 * 60 * 60,
                syncFlexTime: 0.5 * 60 * 60,
              });
            } else {
              BackgroundTask();
            }
            close(() => {});
            const fingerprint_current = FingerprintUser.getById(userData.id);
            if (
              DeviceInfo.getModel()
                .toUpperCase()
                .indexOf('X') == -1 &&
              !fingerprint_current.prompt
            ) {
              return NavigationService.navigate(FINGERPRINT, {
                fromScreen: LOGIN,
              });
            } else {
              return NavigationService.navigate(MAIN_MENU);
            }
          } else {
            const userData = _.pick(res.response, ['auth_key']);
            userService
              .sendOTP(userData.auth_key, {
                type: res.response.unVerifiedUsername == 1 ? 1 : 2,
              })
              .then(res => {
                console.log('RESVERIFY:', res);
                let value = res.message.split(': ');
                if (handle) handle(userData.auth_key, value[1]);
              });
            //dispatch(failureLogin('Please verify your account.'));

            //return
          }
        } else {
          close(() => {
            const { message } = res;
            if (message.includes('validIMEI'))
              showalert('Your password has expired.');
            //dispatch(failureLogin('Your password has expired.'));
            else {
              if (changeStatus) {
                changeStatus('failed');
              }
              showalert(message);
              //dispatch(failureLogin(message));
            }
          });
        }
      })
      .catch(err => {
        close(() => {
          showalert(err);
          //dispatch(failureLogin(err))
        });
      });
  };

  function request(user) {
    return { type: userConstants.LOGIN_REQUEST, user };
  }
  function successLogin(user) {
    return { type: userConstants.LOGIN_SUCCESS, user };
  }
  function failureLogin(error) {
    return { type: userConstants.LOGIN_FAILURE, error };
  }

  function loginUser(email, password, fingerprint) {
    if (fingerprint) {
      const { signature, userId } = fingerprint;
      return userService.login_fingerprint(signature, userId);
    } else {
      if (email === '' || password === '') {
        return Promise.reject('Email and password cannot be empty!');
      }
      const emailReg = new RegExp(
        /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
      console.log(emailReg.test(email));
      if (!emailReg.test(email)) {
        return Promise.reject('Enter a valid email!');
      }
      // return epaisaRequest({ email, password }, '/user/login', 'POST');
      let extra = realm.objectForPrimaryKey(RealmDeviceInfo.schema.name, 0);
      extra = extra || {};
      return userService.login(email, password, {
        version: extra.version,
        imei: extra.imei,
        os: extra.os,
        device: extra.device,
        location: extra.location,
      });
    }
  }
}
export function failureAlertHide() {
  return { type: userConstants.HIDE_FAILURE_MESSAGE };
}
