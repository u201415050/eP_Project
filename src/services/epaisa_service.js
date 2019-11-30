import {
  sendRequest,
  encryptRequest,
  sendRequestGet,
  sendRequestPut,
} from '../services/server-api';
import { AsyncStorage } from 'react-native';
import { EventEmitter } from 'events';
import realm, {
  createRow,
  getTable,
  deleteTable,
} from '../services/realm_service';
import alert_service from './alert_service';
import NavigationService from 'services/navigation';

export async function epaisaRequest(parameters, endpoint, method, extra) {
  try {
    const auth_key = realm.objectForPrimaryKey('User', 0).auth_key;
    if (method === 'GET') {
      const returnEncrypt = encryptRequest(auth_key, parameters, extra);
      const response = sendRequestGet(returnEncrypt, endpoint);
      if (
        response.message === 'Your request was made with invalid credentials.'
      ) {
        throw new Error('Your request was made with invalid credentials.');
      }
      console.log('RESPONSE '+endpoint, response)
      return response;
    }
    if (method === 'PUT') {
      const returnEncrypt = encryptRequest(auth_key, parameters, extra);
      const response = sendRequestPut(returnEncrypt, endpoint);
      if (
        response.message === 'Your request was made with invalid credentials.'
      ) {
        throw new Error('Your request was made with invalid credentials.');
      }
      console.log('RESPONSE '+endpoint, response)
      return response;
    }
    const returnEncrypt = encryptRequest(auth_key, parameters, extra);
    const response = sendRequest(returnEncrypt, endpoint, method);
    console.log('RESPONSE '+endpoint, response)
    return response;
  } catch (error) {
    if (error.message === 'Your request was made with invalid credentials.') {
      return alert_service.showAlert('Login has expired!', () => {
        NavigationService.reset('Auth');
      });
    }
  }
}

export default class EpaisaService extends EventEmitter {
  authKey = '';
  username = '';
  constructor() {
    super();
    this.epaisaRequest = epaisaRequest;
  }

  async getUsername(reset) {
    if (this.username === '' || reset) {
      const user = JSON.parse(await AsyncStorage.getItem('user'));

      this.username = user.response.username;
      return this.username;
    } else {
      return this.username;
    }
  }

  saveNotifications(notifications) {
    for (const item of notifications) {
      createRow('Notification', item, true);
      console.log({ item });
    }
  }

  listNotifications(query) {
    return getTable('Notification').filtered(query);
  }

  deleteNotifications() {
    return deleteTable('Notification');
  }

  async passwordChange(currentPassword, newPassword) {
    this.emit('request');
    const auth_key = realm.objectForPrimaryKey('User', 0).auth_key;
    const res = await epaisaRequest(
      { auth_key, currentPassword, newPassword },
      '/user/changepassword',
      'PUT'
    );
    this.emit('done');
    if (res.success === 0) {
      throw new Error(res.message);
    }
    return {
      success: true,
      response: res.response,
    };
  }
}
