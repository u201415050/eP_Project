import realm, { createRow } from '../realm_service';
import Realm from 'realm';
import { epaisaRequest } from '../epaisa_service';

export default class CardReader extends Realm.Object {
  static schema = {
    name: 'CardReader',
    primaryKey: 'id',
    properties: {
      id: 'int',
      deviceId: 'int',
      merchantId: 'int',
      userId: 'int',
      tid: { type: 'string', optional: true },
      mid: { type: 'string', optional: true },
      username: 'string',
      appKey: { type: 'string', optional: true },
      password: 'string',
      appId: { type: 'string', optional: true },
      hid: { type: 'string', optional: true },
      saltKey: { type: 'string', optional: true },
      deviceSerialNumber: 'string',
      deviceTypeName: 'string',
      deviceProcessorId: 'int',
      mosambeeMerchantId: { type: 'string', optional: true },
      deviceManufacturerName: 'string',
      deviceTypeId: 'int',
      deviceActive: { type: 'int', default: 0 },
      deviceManufacturerId: 'int',
      processorName: 'string',
      user: 'string',
    },
  };

  select() {
    realm.write(() => {
      realm.create(CardReader.schema.name, { ...this, id: 0 }, true);
    });
  }

  static get() {
    return realm.objects(CardReader.schema.name).filtered(`id != 0`);
  }

  static async fetch(merchantId) {
    try {
      const devices = await epaisaRequest(
        { merchantId },
        '/user/devices',
        'GET'
      );
      if (!devices.success) {
        throw new Error(devices.message || 'Error fetching card readers');
      }
      const card_readers = devices.response.cardReaders;
      for (const card_reader of card_readers) {
        CardReader.create(card_reader);
      }
      const selected = Array.from(
        realm
          .objects(CardReader.schema.name)
          .filtered(`merchantId = "${merchantId}" AND id = 0`)
      )[0];
      if (!selected) {
        realm
          .objects(CardReader.schema.name)
          .filtered(`merchantId = "${merchantId}"`)[0]
          .select();
        // realm.write(() => {
        //   realm.create('CardReader', { ...card_readers[0], id: 0 }, true);
        // });
      }
    } catch (error) {
      console.log({ SETTINGS_ERROR: error });
    }
  }

  static create(cardReader) {
    //alert(JSON.stringify(cardReader))
    const data = {
      id: cardReader.deviceId,
      deviceId: cardReader.deviceId,
      userId: cardReader.userId,
      merchantId: cardReader.merchantId,
      deviceProcessorId: cardReader.deviceProcessorId,

      deviceSerialNumber: cardReader.deviceSerialNumber,
      mosambeeMerchantId: cardReader.mosambeeMerchantId||'',
      deviceTypeId: cardReader.deviceTypeId,
      deviceTypeName: cardReader.deviceTypeName,
      appId: cardReader.appId||'',

      hid: cardReader.hid||'',
      saltKey: cardReader.saltKey||'',
      deviceManufacturerName: cardReader.deviceManufacturerName,
      tid: cardReader.tid,
      mid: cardReader.mid,

      username: cardReader.username,
      password: cardReader.password,
      appKey: cardReader.appKey||'',
      deviceManufacturerId: cardReader.deviceManufacturerId,
      processorName: cardReader.processorName,
      user: cardReader.user,
      deviceActive: 0,
    };
    //alert(JSON.stringify(data))
    try {
      
      createRow('CardReader',data,true)
      /*realm.write(() => {
        realm.create(CardReader.schema.name, data, true);
      });*/
    } catch (error) {
      //alert(JSON.stringify(data))
      //alert("ESTE"+JSON.stringify(error));
    }
  }
}
