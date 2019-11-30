/**
 * Description. Request API
 * @method sendRequest()
 * @return {JSON}
 */
import CryptoJS from 'crypto-js';
import StringBuilder from 'string-builder';

/**
 * Description. Request API
 * @method sendRequest() Send post request to api
 * @return {JSON} Obtain Json from api
 */
const env = require('../env/credentials');

const url = env.default.server;

const CLIENT_ID = env.default.clientId;
const sourceId = env.default.sourceId;

/* async function translateText(language,text){
    var url = 'https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl='+language+'&dt=t&q='+encodeURI(text);
    let response =  await fetch(url);   
    let responseJson = await response.json();
    let translation = await responseJson[0][0][0];
    console.log(responseJson[0][0][0]);
    console.log("gg",translation);
    return "gg";
    
  } */
function encryptRequest(authKey, parameters, extra) {
  extra = extra || '';
  console.log('EXTRADATA', extra);
  console.log('JSON', parameters);
  const jsonParameters =
    parameters === '' ? '' : '####' + JSON.stringify(parameters);
  var string = authKey + extra + jsonParameters;
  console.log(string);
  console.log('JSON encryptRequest', encryptString(string));
  return encryptString(string);
}

function encryptRequestEditCustomer(authKey, customerId, parameters) {
  const jsonParameters = '####' + JSON.stringify(parameters);

  var string = authKey + jsonParameters;
  console.log(string);
  console.log('JSON encryptRequest', encryptString(string));
  return encryptString(string);
}

function encryptRequestGet(authKey, parameters) {
  const jsonParameters = '####' + JSON.stringify(parameters);

  var string = authKey + jsonParameters;
  console.log('PARAMETERS GET', string);
  console.log('JSON encryptRequest', encryptString(string));
  return encryptString(string);
}

async function sendRequestGet(encryptedParam, direction) {
  console.log('BASE URI: ', url + direction);
  let response = await fetch(
    url +
      direction +
      '?requestParams=' +
      encodeURIComponent(encryptedParam) +
      '&clientId=' +
      CLIENT_ID,
    {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    }
  );
  let responseJson = await response.json();
  console.log('responseJson: ', responseJson);
  return responseJson;
}
async function getReceipt(checksum, paymentId) {
  //console.log('BASE URI: ', url + direction);
  try{
    let parameters={checksum, paymentId,ReceiptType:1}
  return fetch(
    url +
      '/php/post.php?endpoint=receipt&requestData='+JSON.stringify(parameters),
    {
      method:"GET",
      headers: {
        Accept: 'application/json',
        'Content-Type': 'text/plain',
      },
      credentials:"include"
    }
  ).then(res=>{return res.json()});
  //let responseJson = await response.json();
  //alert('responseJson: '+JSON.stringify(responseJson));
  //return responseJson;
}catch(err){alert(err)}
}
/*function encryptGetFunction(authKey, letters) {
  var settingString = authKey + '####{"filter":' + letters + '}';
  console.log('encryptString(settingString)', encryptString(settingString));
  return encryptString(settingString);
}*/

async function sendRequest(encryptedParam, direction, method) {
  method = method || 'POST';
  //console.log("Paramsgg",encryptedParam);
  console.log('BASE URI: ', url + direction);
  console.log('sendRequest ENCRYPARAM: ', encryptedParam);
  let request = {
    method: method,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      clientId: CLIENT_ID,
      requestParams: encryptedParam,
    }),
  };
  let response = await fetch(url + direction, request);
  console.log(response);
  let responseJson = await response.json();
  console.log(encryptedParam);
  console.log("RESPONSE of "+direction,responseJson);
  return responseJson;
}

async function sendRequestPut(encryptedParam, direction) {
  console.log('BASE URI: ', url + direction);
  let response = await fetch(url + direction, {
    method: 'PUT',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      clientId: CLIENT_ID,
      requestParams: encryptedParam,
    }),
  });
  console.log("### response: ",response);
  let responseJson = await response.json();
  // alert(JSON.stringify(responseJson))
  return responseJson;
}

function encryptChangePassword(authKey) {
  var verifyString =
    autKey +
    '####{"currentPassword":"Test@1234","newPassword":"Test@123456789" }';
  return encryptString(verifyString);
}

function encryptGetFunction(authKey, merchantId) {
  var settingString = authKey + '####{"merchantId":' + merchantId + '}';
  console.log('encryptString(settingString)', encryptString(settingString));
  return encryptString(settingString);
}

function encryptJsonCreateUser(userData) {
  let string = new StringBuilder();
  // let userData = {
  //     Username: email,
  //     Password: password,
  //     UserFirstName: firstName,
  //     UserLastName: lastName,
  //     UserMobileNumber: mobile,
  //     registeredReferralCode: referral,
  //     CountryCode: countryCode,
  //     otpType: 1,
  //     BusinessName: company,
  // };

  string.append(JSON.stringify(userData));

  console.log('### JSON PARAM', string.toString());

  return encryptString(string.toString());
}

function encryptPaymentsInitiate(authkey, amount) {
  let string = new StringBuilder();
  let requestObject = {
    paymentCurrencyId: 25,
    paymentAmount: parseFloat(amount),
    paymentTipAmount: 0,
    paymentSubTotal: 0,
    paymentTotalDiscount: 0,
    paymentCustomerId: '',
    location: '19.0636695,72.8338119',
    created_at: '',
    customerId: 3902,
    customFieldArray: "{'fieldName':'Doctor Id','fieldValue':'76543'}",
  };

  string.append(JSON.stringify(requestObject));
  return encryptString(authkey + '####' + string.toString());
}

function encryptPaymentsProcess() {
  let string = new StringBuilder();
  let requestObject = {
    paymentId: 14674,
    transactionTypeId: 2,
    transactionCurrencyId: 25,
    transactionAmount: 50,
  };

  string.append(JSON.stringify(requestObject));
  return encryptString(
    'BRgngTWt4hUFRTK6wW_RI5UOR_IJ01_7kizs0hON-rL4d8kGyHjx2HD-tnfQVfOO####' +
      string.toString()
  );
}

function encryptDevices(authKey) {
  let string = new StringBuilder();
  let requestObject = {
    merchantId: 3882,
    userId: 3902,
  };

  string.append(JSON.stringify(requestObject));
  return encryptString(authKey + '####' + string.toString());
}

function encryptMerchantUserId(userId, merchantId, authKey) {
  let string = new StringBuilder();
  let requestObject = {
    merchantId: merchantId,
    userId: userId,
  };
  string.append(JSON.stringify(requestObject));
  console.log(JSON.stringify(requestObject)); //####
  return encryptString(authKey + '####' + string.toString());
}

function encryptMerchantFingerPrintToken(userId, fingerPrintToken, authKey) {
  let string = new StringBuilder();
  let requestObject = {
    userId: userId,
    fingerprint: fingerPrintToken,
  };
  string.append(JSON.stringify(requestObject));
  console.log(JSON.stringify(requestObject)); //####
  return encryptString(authKey + '####' + string.toString());
}

function encryptFingerPrintLogin(fingerPrintToken) {
  let string = new StringBuilder();
  let requestObject = {
    fingerprint: fingerPrintToken,
  };
  string.append(JSON.stringify(requestObject));
  console.log(JSON.stringify(requestObject)); //####
  return encryptString(string.toString());
}

function encryptJsonCredentials(email, mobile) {
  let string = new StringBuilder();
  let requestObject = {};
  requestObject['username'] = email;
  requestObject['mobile'] = mobile;
  string.append(JSON.stringify(requestObject));
  console.log('JSON REQUEST', requestObject);
  return encryptString(string.toString());
}

function encryptOtpVerify(mobile, otp) {
  let string = new StringBuilder();
  let requestObject = {};
  requestObject['0'] = mobile;
  requestObject['1'] = otp;
  requestObject['2'] = 7;
  requestObject['outside'] = true;
  string.append(JSON.stringify(requestObject));
  console.log('JSON REQUEST', requestObject);
  return encryptString(string.toString());
}

function encryptResetPassword(mobile, otp, newpassword, token) {
  let string = new StringBuilder();
  let requestObject = {};
  requestObject['mobile'] = mobile;
  requestObject['otp'] = otp;
  requestObject['newpassword'] = newpassword;
  requestObject['token'] = token;
  string.append(JSON.stringify(requestObject));
  console.log('JSON REQUEST', requestObject);
  return encryptString(string.toString());
}

/**
 * @function encryptJson() Encrypts JSON using ecryptString method
 * @return {String} Returns encrypted JSON
 */
function encryptJson(username, password) {
  let string = new StringBuilder();
  let requestObject = {};
  requestObject['username'] = username;
  requestObject['password'] = password;
  requestObject['sourceId'] = sourceId;
  requestObject['extra'] = ['merchant', 'store', 'permissions'];
  string.append(JSON.stringify(requestObject));
  console.log(JSON.stringify(requestObject)); //####
  return encryptString(string.toString());
}

function encryptJsonRequest(request) {
  let string = new StringBuilder();

  string.append(JSON.stringify(request));

  return encryptString(string.toString);
}

/**
 * @function encryptString() TripleDES encrypt
 * @return {String} Returns encrypted String
 */
function encryptString(stringToEncrypt) {
  let rkEncryptionKey = CryptoJS.enc.Utf8.parse(env.default.clientSecret);
  let rkEncryptionIv = CryptoJS.enc.Utf8.parse(
    env.default.clientId.slice(0, 8)
  );
  var encrypted = CryptoJS.TripleDES.encrypt(stringToEncrypt, rkEncryptionKey, {
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
    iv: rkEncryptionIv,
  });
  return encrypted.ciphertext.toString(CryptoJS.enc.Base64);
}

function encryptForgotPassword(string) {
  //string = '{"email":"jorge.seminario@poslabs.com"}' o '{"mobile":"7894561231"}'
  var settingString = string;
  return encryptString(settingString);
}

function encryptJsonVerifyPut(authKey, otpValue, type) {
  var verifyString =
    authKey + '####{"type":' + type + ', "otpValue":' + otpValue + '}';
  return encryptString(verifyString);
}

function encryptJsonVerifyPost(authKey, type) {
  var verifyString = authKey + '####{"type":' + type + '}';
  return encryptString(verifyString);
}

function decodeString(strignToDecode) {
  let rkEncryptionKey = CryptoJS.enc.Utf8.parse('TKIC0UYnhYbCNRdZVR5xu4nZ');
  let rkEncryptionIv = CryptoJS.enc.Utf8.parse('VyBqmaWH');
  var decrypted = CryptoJS.TripleDES.decrypt(strignToDecode, rkEncryptionKey, {
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
    iv: rkEncryptionIv,
  });
  //var decrypted = CryptoJS.TripleDES.decrypt({strignToDecode: CryptoJS.enc.Base64.parse(strignToDecode) },rkEncryptionKey,{mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7, iv: rkEncryptionIv} );
  return decrypted.toString(CryptoJS.enc.Utf8);
}

export { sendRequest };
export { sendRequestPut };
export { sendRequestGet };
export { encryptJson };
export { encryptJsonCredentials };
export { encryptJsonCreateUser };
export { encryptDevices };
export { encryptPaymentsInitiate };
export { encryptPaymentsProcess };
export { encryptJsonVerifyPut };
export { encryptJsonVerifyPost };
export { encryptChangePassword };
export { encryptGetFunction };
export { encryptForgotPassword };
export { encryptJsonRequest };
export { encryptOtpVerify };
export { encryptResetPassword };
export { encryptMerchantUserId };
export { encryptMerchantFingerPrintToken };
export { encryptFingerPrintLogin };
export { encryptRequest };
export { encryptRequestEditCustomer };
export { encryptRequestGet };
export { getReceipt };
