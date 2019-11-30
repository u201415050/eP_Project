import { getTable, updateRow } from '../../../../../services/realm_service';
import { setSetting } from '../../../../../services/settings_service';
import EpaisaService from '../../../../../services/epaisa_service';
import { handleError } from '../../../../../factory/utils/handlerError';
import alert_service from '../../../../../services/alert_service';
export class SettingsHelper extends EpaisaService {
  configs = [];
  actions = [];
  realmData = {};
  unsuscribedAll = true;
  constructor(setting_name) {
    super();
    this.setting_name = setting_name;

    this.realmData = getTable('Settings').filtered(
      `name CONTAINS[c] "${this.setting_name}"`
    )[0];
    console.log({ JSON: JSON.parse(this.realmData.value) });
    this.configs = JSON.parse(this.realmData.value)
      .slice(0, 4)
      .map(item => {
        return {
          ...item,
          title: this.formatTitle(item.settingParamName),
          list: this.valueToList(item.value),
        };
      });
  }
  async save() {
    const value = this.valueToJson();
    updateRow(() => {
      this.realmData.value = value;
    });
    const promises = [];
    console.log('saved');
    for (const setting of JSON.parse(value)) {
      // const request = ;
      promises.push(
        setSetting(this.setting_name, {
          [setting.settingParamName]: setting.value,
        })
      );
    }
    try {
      const res = await Promise.all(promises);
      for (const response of res) {
        if (response.success === 0) {
          throw new Error(response.message);
        }
      }
    } catch (err) {
      const error = handleError(err.message);
      console.log(error);
      // alert_service.showAlert(error.message, error.action);
    }
  }

  updateAll(value) {
    this.emit('update_all', value);
    for (const action of this.actions) {
      action(!value);
    }
    this.emit('save');
  }

  formatTitle(title) {
    switch (title) {
      case 'TransactionNotification':
        return 'Transaction Notifications';
      case 'SummaryNotification':
        return 'Summary';
      case 'HeldTransactionsDailySummary':
        return 'Held Transactions';
      case 'EpaisaOffersNotification':
        return 'Epaisa Offers';
      case 'DailySales':
        return 'Daily Sales';
      case 'MonthlySales':
        return 'Monthly Sales';
      default:
        return title;
    }
  }
  valueToList(value) {
    const types = ['In - App', 'Email', 'SMS'];
    const arr = value.split('');
    return arr.map((x, i) => {
      const active = +x === 1 ? true : false;
      if (active) {
        this.unsuscribedAll = false;
      }
      const button = new SettingConfigButton(types[i], active, value => {
        this.emit('update', value);
        this.emit('save');
      });
      this.actions.push(v => button.toggle(v, true));
      return button;
    });
  }

  valueToJson() {
    const configs = [];
    for (const config of this.configs) {
      const { list, title, ...cleanedConfigs } = config;
      const value = list.map(x => +x.active).join('');
      configs.push({
        ...cleanedConfigs,
        value,
      });
    }
    return JSON.stringify(configs);
  }

  checkUnsuscribedAll() {
    let status = true;
    for (const row of this.configs) {
      for (const config of row.list) {
        if (config.active === true) {
          status = false;
          break;
        }
      }
    }
    return status;
  }
}

export class SettingConfigButton {
  constructor(type, active, update) {
    this.type = type;
    this.active = active;
    this.update = update;
  }
  toggle(value, noEmit) {
    this.active = value !== undefined ? value : !this.active;
    if (!noEmit) {
      this.update(this.active);
    }
  }
}
