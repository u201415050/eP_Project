import { sendRequest, encryptRequest, sendRequestGet } from '../services/server-api';

export function epaisaRequest(parameters, endpoint, auth_key, method, extra) {
  const returnEncrypt = encryptRequest(auth_key, parameters, extra);
  return sendRequest(returnEncrypt, endpoint, method);
}

export function getUserPersonal(auth_key) {
  //return sendRequestGet() epaisaRequest('','/user/profile',auth_key,'GET','')
}
