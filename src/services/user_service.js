import {
  sendRequest,
  encryptJson,
  encryptJsonCreateUser,
  encryptJsonCredentials,
  encryptForgotPassword,
  encryptOtpVerify,
  encryptResetPassword,
  sendRequestPut,
  encryptJsonVerifyPut,
  encryptJsonVerifyPost,
  encryptMerchantFingerPrintToken,
  sendRequestGet,
  encryptRequest,
  encryptRequestEditCustomer,
  encryptRequestGet,
} from '../services/server-api';
import { AsyncStorage } from 'react-native';
import realm_service, { createRow } from '../services/realm_service';
export function login(email, password) {
  const returnEncrypt = encryptJson(email, password);
  return sendRequest(returnEncrypt, '/user/login');
}

export function customRequest(parameters, endpoint, auth_key, method) {
  const returnEncrypt = encryptRequest(auth_key, parameters);
  return sendRequest(returnEncrypt, endpoint, method);
}

export function create_account(userData) {
  userData.UserMobileNumber = `+${userData.CallingCode}${
    userData.UserMobileNumber
  }`;
  var returnEncrypt = encryptJsonCreateUser(userData);

  return sendRequest(returnEncrypt, '/user/register');
}

export function check_email(email) {
  var returnEncrypt = encryptJsonCredentials(email, null);

  return sendRequest(returnEncrypt, '/user/check').then(({ response }) => {
    const { username } = response;

    return {
      exists: username.exists,
      verified: username.verified || false,
      errors: username.exists
        ? []
        : [
            `${username.message
              .charAt(0)
              .toUpperCase()}${username.message.substr(1)}`,
          ],
    };
  });
}

export function check_email_improved(email) {
  var returnEncrypt = encryptJsonCredentials(email, null);

  return sendRequest(returnEncrypt, '/user/check');
}

export function check_mobile(mobile) {
  var returnEncrypt = encryptJsonCredentials(null, mobile);

  return sendRequest(returnEncrypt, '/user/check').then(({ response }) => {
    const { mobile, username } = response;
    //alert(JSON.stringify(response))
    return {
      verified: username ? username.verified : false,
      exists: mobile.exists,
      errors: mobile.exists ? [] : [mobile.message],
    };
  });
}

export function opt_send(value, key) {
  var returnEncrypt = encryptForgotPassword(JSON.stringify({ [key]: value }));

  return sendRequest(returnEncrypt, '/user/forgotpassword');
}

export function validate_otp(mobile, otp) {
  var returnEncrypt = encryptOtpVerify(mobile, otp);
  var direction = '/user/validateotp';

  return sendRequest(returnEncrypt, direction);
}

export function reset_password(mobile, otp, password, auth_key) {
  var returnEncrypt = encryptResetPassword(mobile, otp, password, auth_key);
  var direction = '/user/forgotpassword';

  return sendRequest(returnEncrypt, direction);
}

export function verify_otp(auth_key, otp, type) {
  var returnEncrypt = encryptJsonVerifyPut(auth_key, otp, type);
  var direction = '/user/verify';

  return sendRequestPut(returnEncrypt, direction);
}

export function resend_register_otp(auth_key, type) {
  var returnEncrypt = encryptJsonVerifyPost(auth_key, type);
  var direction = '/user/verify';

  return sendRequest(returnEncrypt, direction);
}

export function register_fingerprint_token(user_id, token, auth_key) {
  var returnEncrypt = encryptMerchantFingerPrintToken(user_id, token, auth_key);

  return sendRequest(returnEncrypt, '/fingerprint/register');
}

export function get_industries(auth_key) {
  var returnEncrypt = encryptRequest(auth_key, '');

  return sendRequestGet(returnEncrypt, '/masterdata/industries');
}

export function get_taxes(auth_key) {
  var returnEncrypt = encryptRequest(auth, '');

  return sendRequestGet(returnEncrypt, '/slabtaxes');
}
export function edit_customer(auth_key, customerId, params) {
  var returnEncrypt = encryptRequestEditCustomer(auth_key, customerId, params);

  return sendRequestPut(returnEncrypt, '/customer');
}

export function list_customers_by_merchant(auth_key, merchantId, offset) {
  var returnEncrypt = encryptRequestGet(auth_key, {
    ['otpIsNull']: true,
    ['merchantId']: merchantId,
    ['offset']: offset, // if it's 0, it brings from 0 to 29, and so next offset would be 30, so it'll bring from 30 to 59 and so on
  });

  return sendRequestGet(returnEncrypt, '/customer');
}

export function list_transactions_by_customer(auth_key, parameters) {
  // transactionStatus for Deposited and Approved
  var returnEncrypt = encryptRequestGet(auth_key, {
    ...parameters,
    transactionStatusId: [2, 8],
  });

  return sendRequestGet(returnEncrypt, '/transaction/list');
}
export function getReceipt(auth_key, parameters) {
  // transactionStatus for Deposited and Approved
  var returnEncrypt = encryptRequestGet(auth_key, {
    ...parameters,
    //transactionStatusId: [2, 8],
  });

  return sendRequestGet(returnEncrypt, '/receipt');
}
export function filter_customer_by(auth_key, filter) {
  var returnEncrypt = encryptRequest(
    auth_key,
    {
      ...filter,
      ['otpIsNull']: true,
    },
    ''
  );

  return sendRequestGet(returnEncrypt, '/customer');
}

export async function get_user_country() {
  try {
    const userLocation = await AsyncStorage.getItem('@PhoneLocation');

    if (JSON.parse(userLocation)) {
      return JSON.parse(userLocation);
    } else {
      const url =
        'http://api.ipstack.com/check?access_key=eae5590f3a37ea38fc1a863c3a7685e0&format=1';
      const res = await fetch(url);
      const json = await res.json();
      const data = {
        ...json,
        location: {
          ...json.location,
          country_flag: `https://www.countryflags.io/${json.country_code.toLowerCase()}/flat/64.png`,
        },
      };
      await AsyncStorage.setItem('@PhoneLocation', JSON.stringify(data));
      return json;
    }
  } catch (error) {
    return Promise.reject(error);
  }
}
export async function updateCardReader(element) {
  let arraycards = Array.from(element);

  for (let i = 0, len = arraycards.length; i < len; i++) {
    createRow('CardReader', arraycards[i], true);
  }
}

export function getActiveCardreaderRow() {
  let activedevices = realm_service
    .objects('CardReader')
    .filtered('deviceActive == 1');
  let arraycards = Array.from(activedevices);
  return arraycards;
}
