import realm from '../realm_service';

export default class Notification {
  static schema = {
    name: 'Notification',
    primaryKey: 'notificationId',
    properties: {
      title: 'string',
      body: 'string',
      date: 'date',
      notificationId: 'int',
      createdUserId: 'string?',
      created_at: 'string?',
      isScheduled: 'string?',
      receivers: 'string?',
      status: 'string?',
      time: 'string?',
      type: 'string?',
      updatedUserId: 'string?',
      updated_at: 'string?',
      userId: 'int',
      readed: { type: 'bool?', default: false },
    },
  };
  static create(data) {
    realm.write(() => {
      realm.create('Notification', data, true);
    });
  }
  read() {
    realm.write(() => {
      this.readed = true;
    });
  }
  static getById(id) {
    return realm.objects('Notification').filtered(`userId = "${id}"`);
  }
}
