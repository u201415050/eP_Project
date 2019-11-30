import realm from '../realm_service';

export default class Settings {
  static schema = {
    name: 'Settings',
    primaryKey: 'id',
    properties: {
      id: 'int',
      name: 'string',
      value: 'string',
      synced: { type: 'bool', default: true },
    },
  };
  static fixValue = value => {
    return value === 'True' || value === '1' || +value ? true : false;
  };
  updateValue(name, value) {
    const settings = JSON.parse(this.value);
    const others = settings.filter(x => x.settingParamName !== name);
    const update = settings.find(x => x.settingParamName === name);

    if (update) {
      const newSetting = { ...update };
      newSetting.value = value;

      realm.write(() => {
        this.value = JSON.stringify([...others, newSetting]);
        this.synced = false;
      });
    }
  }
  get(name) {
    const settings = JSON.parse(this.value);
    const settingData = settings.find(x => x.settingParamName === name);
    if (settingData) {
      return Settings.fixValue(settingData.value);
    }
    return null;
  }
  static getSettingCategory(name) {
    return realm
      .objects(Settings.schema.name)
      .filtered(`name CONTAINS[c] "${name}"`)[0];
  }
  setSynced(value) {
    realm.write(() => {
      this.synced = value;
    });
  }
  getDataForSync() {
    const data = JSON.parse(this.value).map(x => {
      return {
        [x.settingParamName]: x.value,
      };
    });
    let syncdata = {};
    for (const prop of data) {
      syncdata = { ...syncdata, ...prop };
    }
    return syncdata;
  }
}
