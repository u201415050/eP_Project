import {
  sendRequestGet,
  encryptJsonGet,
} from '../../login/services/server-api';

export function getDashboard(authkey, json) {
  const returnEncrypt = encryptJsonGet(authkey, json);
  // console.log('Encrypted Json', returnEncrypt);

  return sendRequestGet(returnEncrypt, '/reports/newdashboard');
}
