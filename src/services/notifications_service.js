import EpaisaService from './epaisa_service';
import moment from 'moment';
import realm from './realm_service';
import OneSignal from 'react-native-onesignal';
import { Platform } from 'react-native';
import Notification from './realm_models/notification';
export default new class NotificationService extends EpaisaService {
  notificationsCount = 0;
  constructor() {
    super();
    this.fetch();
    this.emit('ready');
    this.lastId = 0;
  }
  getUser() {
    return realm.objectForPrimaryKey('User', 0);
  }
  async fetch(reset) {
    // try {
    //   const res = await this.epaisaRequest('', '/notifications/list', 'GET');
    //   console.log({ noti: res });
    //   if (!res.success) {
    //     throw new Error(res.message);
    //   }
    //   this.notificationsCount = +res.response.total;
    //   this.save(res.response.Notifications);
    // } catch (error) {
    //   // const err = handleError(error.message);
    //   // alert_service.showAlert(err.message, err.action);
    // }
  }

  async save(notifications) {
    try {
      if (!this.getUser()) {
        throw new Error('User is not logged in');
      }
      notifications = notifications.map(x => {
        if (this.lastId < +x.notificationId) {
          this.lastId = +x.notificationId;
        }
        return {
          ...x,
          userId: this.getUser().userId,
          date: x.time
            ? moment(x.date + '' + x.time, 'YYYY-MM-DD hh:mm:ss').toDate()
            : x.date,
        };
      });
      // this.saveNotifications(notifications);
      realm.write(() => {
        notifications.forEach(item => {
          realm.create('Notification', item, true);
        });
      });
      return this.update();
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async list(query) {
    return this.listNotifications(query);
  }

  update() {
    // if (!this.getUser()) {
    //   throw new Error('User is not logged in');
    // }
    // const results = this.listNotifications(
    //   `userId = ${this.getUser().userId} AND readed = false`
    // );
    // this.emit('update_notifications', {
    //   total: results.length,
    // });
  }
  onReceived(notification) {
    console.log('Notification received: ', notification);
    if (this.getUser()) {
      Notification.create({
        title: notification.payload.title,
        body: notification.payload.body,
        date: moment(
          `${notification.payload.additionalData.date} ${
            notification.payload.additionalData.time
          }`,
          'YYYY-MM-DD HH:mm:ss'
        ).toDate(),
        notificationId: notification.payload.additionalData.notificationId,
        userId: this.getUser().userId,
      });
    }

    // this.pushNotification({
    //   ,
    // });
  }

  onOpened(openResult) {
    console.log('Message: ', openResult.notification.payload.body);
    console.log('Data: ', openResult.notification.payload.additionalData);
    console.log('isActive: ', openResult.notification.isAppInFocus);
    console.log('openResult: ', openResult);
  }

  onIds(device) {
    console.log('Device info: ', device);
  }

  init(id) {
    const user = realm.objectForPrimaryKey('User', id);
    if (!user) {
      return;
    }
    if (Platform.OS === 'android') {
      OneSignal.addEventListener('received', this.onReceived.bind(this));
      OneSignal.addEventListener('opened', this.onOpened.bind(this));
      OneSignal.addEventListener('ids', this.onIds.bind(this));
    }
    // OneSignal.init('6499c98c-dce1-4b9d-bee5-d62f729d7c70'); //--> Carlos E Carrillo
    const tags = {
      userId: `${user.userId}`,
      merchantId: `${user.merchantId}`,
      storeLocationId: `${user.storeLocationId}`,
      epaisa_react_test: `true`,
    };
    // eslint-disable-next-line no-undef
    if (__DEV__) {
      tags.epaisa_react_dev = `true`;
    }
    console.log(tags);
    if (Platform.OS === 'android') {
      OneSignal.sendTags(tags);
      OneSignal.setEmail(user.username);
    }
  }

  async pushNotification(notification) {
    this.notificationsCount++;
    // this.update({ total: this.notificationsCount, notifications: [] });
    this.lastId++;
    this.update();
    const data = [
      {
        ...notification,
        notificationId: `${this.lastId}`,
      },
    ];
    return this.save(data);
  }
}();
