import {
  sendRequest,
  sendRequestGet,
  sendRequestPut,
  encryptJson,
  addCustomer,
  verifyCustomer,
  encryptRequest,
  encryptTaxes,
  encryptGetFunction,
  encryptJsonRequest,
  encryptJsonCreateUser,
  encryptJsonCredentials,
  encryptForgotPassword,
  encryptOtpVerify,
  encryptResetPassword,
  encryptJsonVerifyPut,
  encryptFingerPrintLogin,
  encryptJsonGet,
} from './server-api';
import realm_service, {
  createRow,
  getTable,
} from '../../../services/realm_service';

export function login(email, password, extra) {
  const returnEncrypt = encryptJson(email, password, extra);
  return sendRequest(returnEncrypt, '/user/login');
}

export function getCustomers(authkey, merchantId) {
  const returnEncrypt = encryptGetFunction(authkey, merchantId);
  console.log('Encrypted Json', returnEncrypt);

  return sendRequestGet(returnEncrypt, '/customer');
}

export function getPersonalUser(authkey, merchantId) {
  const returnEncrypt = encryptGetFunction(authkey, merchantId);
  console.log('Encrypted Json', returnEncrypt);

  return sendRequestGet(returnEncrypt, '/user/profile');
}
export function getNotificationUser(authkey) {
  const returnEncrypt = encryptJsonGet(authkey, { settingId: 7 });
  console.log('Encrypted Json', returnEncrypt);

  return sendRequestGet(returnEncrypt, '/setting');
}
export function saveValuePersonal(authkey, json) {
  const returnEncrypt = encryptJsonGet(authkey, json);
  console.log('Encrypted Json', returnEncrypt);

  return sendRequestPut(returnEncrypt, '/user/profile');
}
export function sendOTP(authkey, json) {
  const returnEncrypt = encryptJsonGet(authkey, json);
  console.log('Encrypted Json', returnEncrypt);

  return sendRequest(returnEncrypt, '/user/verify');
}
export function sendOTPPut(authkey, json) {
  const returnEncrypt = encryptJsonGet(authkey, json);
  console.log('Encrypted Json', returnEncrypt);

  return sendRequestPut(returnEncrypt, '/user/verify');
}
export function getDashboard(authkey, json) {
  const returnEncrypt = encryptJsonGet(authkey, json);
  console.log('Encrypted Json', returnEncrypt);

  return sendRequestGet(returnEncrypt, '/reports/dashboard');
}
export function getSavedTransactions(authkey, merchantId) {
  const returnEncrypt = encryptGetFunction(authkey, merchantId);
  console.log('Encrypted Json', returnEncrypt);

  return sendRequestGet(returnEncrypt, '/savedtransactions/view');
}
export function voidSavedTransactions(authkey, json) {
  const returnEncrypt = encryptJsonGet(authkey, json);
  console.log('Encrypted Json', returnEncrypt);

  return sendRequest(returnEncrypt, '/savedtransactions/void');
}
export function getTransactions(authkey, json) {
  const returnEncrypt = encryptJsonGet(authkey, json);
  console.log('Encrypted Json', returnEncrypt);

  return sendRequestGet(returnEncrypt, '/transaction/list');
}
export function getUsers(authkey, json) {
  const returnEncrypt = encryptJsonGet(authkey, json);
  console.log('Encrypted Json', returnEncrypt);

  return sendRequestGet(returnEncrypt, '/userlist');
}
export function getTransactionDetail(authkey, json) {
  const returnEncrypt = encryptJsonGet(authkey, json);
  console.log('Encrypted Json', returnEncrypt);

  return sendRequestGet(returnEncrypt, '/payment/list');
}
export function getCardReaders(authkey, merchantId) {
  const returnEncrypt = encryptGetFunction(authkey, merchantId);
  console.log('Encrypted Json', returnEncrypt);

  return sendRequestGet(returnEncrypt, '/user/devices');
}
export function addCustomers(authkey, customer) {
  const returnEncrypt = addCustomer(authkey, customer);
  console.log('Encrypted Json', returnEncrypt);

  return sendRequest(returnEncrypt, '/customer/add');
}

// OTP CUSTOMER
export function verifyCustomerOtp(authkey, customerId, otp) {
  const returnEncrypt = verifyCustomer(authkey, customerId, otp);
  console.log('Encrypted Json verifyCustomerOtp', returnEncrypt);

  return sendRequest(returnEncrypt, '/customer/validate');
}

export function get_taxes(auth_key) {
  var returnEncrypt = encryptTaxes(auth_key);

  return sendRequestGet(returnEncrypt, '/slabtaxes');
}

export function create_account(userData) {
  var returnEncrypt = encryptJsonCreateUser(userData);

  return sendRequest(returnEncrypt, '/user/register');
}

export function check_email(email) {
  var returnEncrypt = encryptJsonCredentials(email, null);

  return sendRequest(returnEncrypt, '/user/check').then(({ response }) => {
    const { username } = response;

    return {
      exists: username.exists,
      errors: username.exists ? [] : [username.message],
    };
  });
}

export function check_mobile(mobile) {
  var returnEncrypt = encryptJsonCredentials(null, mobile);

  return sendRequest(returnEncrypt, '/user/check').then(({ response }) => {
    const { mobile } = response;
    return {
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

export function verify_otp(authKey, otp) {
  var returnEncrypt = encryptJsonVerifyPut(authKey, otp);
  var direction = '/user/verify';
  sendRequestPut(returnEncrypt, direction);
}

export function login_fingerprint(signature, userId) {
  var returnEncrypt = encryptFingerPrintLogin(signature, userId);
  return sendRequest(returnEncrypt, '/fingerprint/login');
}
