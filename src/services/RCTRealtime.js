import realtime from '../../RCTRealtimeMessagingIOS';
import { EventEmitter } from 'events';
import realm from './realm_service';
// const RCTRealtimeMessaging = new realtime();

export default new class RCTRealtime extends EventEmitter {
  subscriptions = [];
  constructor() {
    super();
    this.RCTRealtimeMessaging = new realtime();
  }
  unsubscribeAll() {
    for (const item of this.subscriptions) {
      console.log('RCTR Unsubscribing form ' + item);
      this.RCTRealtimeMessaging.RTIsSubscribed(item, result => {
        console.log('RCTR', { result });
        if (result == true) {
          console.log('RCTR channel ' + item + ' is subscribed');
          this.RCTRealtimeMessaging.RTUnsubscribe(item);
        } else {
          console.log('RCTR channel ' + item + ' is not subscribed');
        }
      });
      // this.RCTRealtimeMessaging.RTUnsubscribe(item);
    }
    this.subscriptions = [];
    this.RCTRealtimeMessaging.RTDisconnect();
  }
  async init() {
    const user = realm.objectForPrimaryKey('User', 0);
    if (!user) {
      return;
    }
    const { pubsubToken, storeLocationId } = user;

    if (!user.authenticated) {
      this.RCTRealtimeMessaging.RTUnsubscribe('store_' + storeLocationId);
      return;
    }
    // alert(JSON.stringify({ pubsubToken, storeLocationId }));

    this.RCTRealtimeMessaging.RTConnect({
      appKey: 'Eup1GT',
      token: pubsubToken,
      connectionMetadata: 'AndroidApp',
      clusterUrl: 'http://ortc-developers.realtime.co/server/2.1',
    });
    /*this.RCTRealtimeMessaging.RTConnect({
      appKey: 'boYH7H',
      token: '3afxcv4ymzzsfmovdon22kmh',
      connectionMetadata: 'AndroidApp',
      clusterUrl: 'http://ortc-developers.realtime.co/server/2.1',
    });*/
    this.RCTRealtimeMessaging.RTEventListener('onConnected', () => {
      console.log('RCTR connected');
      this.RCTRealtimeMessaging.RTSubscribe('store_' + storeLocationId, true);
      // this.RCTRealtimeMessaging.RTSubscribe('myChannel', true);
    });

    this.RCTRealtimeMessaging.RTEventListener(
      'onSubscribed',
      subscribedEvent => {
        console.log('RCTR Subscribed channel: ' + subscribedEvent.channel);
        this.subscriptions.push(subscribedEvent.channel);
      }
    );

    this.RCTRealtimeMessaging.RTEventListener('onException', error => {
      console.log('RCTR Exception: ', { error });
    });

    this.RCTRealtimeMessaging.RTEventListener(
      'onMessage',
      ({ sender, channel, message }) => {
        try {
          console.log({ RCT: message });
          const messageObj = JSON.parse(message);
          return this.handleMessage(JSON.parse(messageObj.c));
        } catch (error) {
          console.log({ RCT_ERROR: error });
          return;
        }
      }
    );
  }

  handleMessage(content) {
    if (!content.result) {
      return;
    }
    const response = content.result.response;

    if (response.transactionTypeId == '20') {
      this.emit('onMessageEvent', {
        type: 'UPI',
        transactionStatusId: response.transactionStatusId,
        transactionId: response.transactionId,
      });
    }
    if (response.transactionTypeId == '27') {
      this.emit('onMessageEvent', {
        type: 'UPI_QR',
        transactionStatusId: response.transactionStatusId,
        transactionId: response.transactionId,
      });
    }
  }
}();
