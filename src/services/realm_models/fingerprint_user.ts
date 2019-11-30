import realm from '../realm_service';
interface FingerprintUserInterface {
  id: number;
  linked?: boolean;
  prompt?: boolean;
}
export default class FingerprintUser implements FingerprintUserInterface {
  id: number;
  rejected: boolean;

  static schema = {
    name: 'FingerprintUser',
    primaryKey: 'id',
    properties: {
      id: 'int',
      rejected: { type: 'bool', default: false },
      prompt: { type: 'bool', default: false },
      linked: { type: 'bool', default: false },
      lastLogin: 'date',
    },
  };

  static create(data: FingerprintUserInterface) {
    realm.write(() => {
      realm.create(FingerprintUser.schema.name, data, true);
    });
  }

  static getById(id: number): FingerprintUserInterface {
    return realm.objectForPrimaryKey(FingerprintUser.schema.name, id);
  }

  static getLastLogged(): FingerprintUserInterface {
    return realm
      .objects(FingerprintUser.schema.name)
      .sorted('lastLogin', true)[0];
  }

  static unLink(userId: number): void {
    realm.write(() => {
      Array.from(
        realm.objects(FingerprintUser.schema.name).filtered(`id != ${userId}`)
      ).forEach((item: FingerprintUserInterface) => {
        item.linked = false;
      });
    });
  }
}
