import * as payment_names from '../features/settings/components/icons/payments/payment_names';
import * as _ from 'lodash';
import realm from './realm_service';
import { epaisaRequest } from './epaisa_service';
import { EventEmitter } from 'events';
export default class PaymentSettingsHelper extends EventEmitter {
  payment_categories_enabled = [];
  payment_types_enabled = [];
  payment_categories = {
    1: {
      id: 1,
      name: payment_names.CARD,
      label: 'Card',
      settings_section: {
        order: 1,
      },
      types: {
        22: {
          id: 22,
          name: payment_names.VISA,
        },
        23: {
          id: 23,
          name: payment_names.MASTERCARD,
        },
        24: {
          id: 24,
          name: payment_names.RUPAY,
        },
        25: {
          id: 25,
          name: payment_names.MAESTRO,
        },
        26: {
          id: 26,
          name: payment_names.DISCOVER,
        },
        27: {
          id: 27,
          name: payment_names.DINERS,
        },
      },
    },
    2: {
      id: 2,
      name: payment_names.CASH,
      label: 'Cash',
      settings_section: {
        order: 2,
      },
      tendering: (() => {
        const transaction_settings = this.getSetting('Transaction');
        const value = this.getSettingValue(transaction_settings);
        const index = value.findIndex(
          x => x.settingParamName === 'OneClickCashPayment'
        );
        return value[index].value;
      })(),
      types: {
        tendering: {
          id: 'tendering',
          name: payment_names.TENDERING,
          independent: true,
          disabled: () => {
            const transaction_settings = this.getSetting('Transaction');
            const value = this.getSettingValue(transaction_settings);
            const index = value.findIndex(
              x => x.settingParamName === 'OneClickCashPayment'
            );
            return !value[index].value;
          },
          onPress: (parent, current) => {
            const transaction_settings = this.getSetting('Transaction');
            const value = this.getSettingValue(transaction_settings);
            const index = value.findIndex(
              x => x.settingParamName === 'OneClickCashPayment'
            );
            value[index] = {
              ...value[index],
              value: !value[index].value,
            };

            realm.write(() => {
              transaction_settings[0].value = JSON.stringify(value);
            });
          },
        },
      },
    },
    3: {
      id: 3,
      name: payment_names.WALLETS,
      label: 'Wallet',
      dropdown: true,
      settings_section: {
        order: 4,
      },
      types: {
        1: {
          id: 1,
          name: payment_names.CITRUS,
        },
        2: {
          id: 2,
          name: payment_names.FREECHARGE,
        },
        11: {
          id: 11,
          name: payment_names.MOBIKWIK,
        },
        3: {
          id: 3,
          name: payment_names.OLA_MONEY,
        },
        13: {
          id: 13,
          name: payment_names.POCKETS,
        },
        12: {
          id: 12,
          name: payment_names.M_PESA,
        },
      },
    },
    4: {
      id: 4,
      settings_section: {
        order: 5,
      },
      name: payment_names.UPI_PAYMENTS,
      label: 'UPI',
      dropdown: true,
      types: {
        14: {
          id: 14,
          name: payment_names.UPI,
        },
        15: {
          id: 15,
          name: payment_names.UPI_QR,
        },
      },
    },
    5: {
      id: 5,
      name: payment_names.OTHERS,
      label: 'Others',
      hide: true,
      settings_section: {
        order: 5,
      },
      types: {
        21: {
          id: 21,
          name: payment_names.CHEQUE,
          label: 'Cheque',
        },
        16: {
          id: 16,
          name: payment_names.AADHAARPAY,
          label: 'Aadhaar',
        },
        6: {
          id: 6,
          name: payment_names.SPLIT,
          label: 'Split',
        },
      },
    },
    21: {
      id: 21,
      name: payment_names.CHEQUE,
      label: 'Cheque',
    },
    16: {
      id: 16,
      name: payment_names.AADHAARPAY,
      label: 'Aadhaar',
    },
    6: {
      id: 6,
      name: payment_names.SPLIT,
      label: 'Split',
    },
    7: {
      id: 7,
      name: payment_names.CASH_POS,
      label: 'Cash Pos',
      hide: true,
    },
    8: {
      id: 8,
      name: payment_names.EMI_PAYMENTS,
      label: 'EMI',
      settings_section: {
        order: 3,
      },
    },
  };
  constructor(cats_enabled, types_enabled) {
    super();
    if (cats_enabled) {
      this.payment_categories_enabled = cats_enabled;
    }
    if (types_enabled) {
      this.payment_types_enabled = types_enabled;
    }
    this.on('save', _.debounce(this.save, 2000));
  }

  save() {
    const categories = {
      ['PaymentCategoriesEnabled']: JSON.stringify(
        this.payment_categories_enabled
      ),
    };
    const types = {
      ['TransactionTypeEnabled']: JSON.stringify(this.payment_types_enabled),
    };
    return Promise.all([
      this.updateApi('Transaction', categories),
      this.updateApi('Transaction', types),
    ]).then(x => console.log(x));
  }
  getSetting(setting) {
    return realm.objects('Settings').filtered(`name CONTAINS[c] "${setting}"`);
  }
  getSettingValue(setting) {
    return JSON.parse(Array.from(setting)[0].value);
  }
  updateSetting(setting, newValue) {
    const transaction_settings = this.getSetting('Transaction');
    const value = this.getSettingValue(transaction_settings);
    const index = value.findIndex(x => x.settingParamName === setting);

    value[index] = {
      ...value[index],
      value: JSON.stringify(newValue),
    };
    realm.write(() => {
      transaction_settings[0].value = JSON.stringify(value);
      transaction_settings[0].synced = false;
      // alert(JSON.stringify(transaction_settings[0].synced));
    });
    this.emit('save');
  }
  setEnabledCategories(categories) {
    this.payment_categories_enabled = categories;
    this.updateSetting(
      'PaymentCategoriesEnabled',
      this.payment_categories_enabled
    );
  }
  setEnabledTypes(categories) {
    this.payment_types_enabled = categories;
    this.updateSetting('TransactionTypeEnabled', this.payment_types_enabled);
  }

  getEnabled(types_enabled, object) {
    let data = {};
    for (const key in object) {
      const enabled = types_enabled.find(x => x === object[key].id);
      data[key] = {
        ...object[key],
        enabled: enabled !== undefined,
      };
      if (object[key].types) {
        data[key].types = this.getEnabled(
          this.payment_types_enabled,
          object[key].types
        );
      }
    }
    return data;
  }

  getPaymentData() {
    const payments_data = this.getEnabled(
      this.payment_categories_enabled.concat(
        this.payment_types_enabled.filter(x => x === 21 || x === 16 || x === 6)
      ),
      this.payment_categories
    );

    return payments_data;
  }
  sortSettings = (a, b) => {
    if (a.settings_section.order > b.settings_section.order) {
      return 1;
    }
    if (a.settings_section.order < b.settings_section.order) {
      return -1;
    }
    // a must be equal to b
    return 0;
  };

  checkSiblings = (siblings, arr) => {
    for (const id of siblings) {
      if (arr.includes(id)) return true;
    }
    return false;
  };
  getSectionsForSettings(buttonSize) {
    const getTitle = name => name.split(/(?=[A-Z])/).join(' ');
    const payment_data = this.getPaymentData();
    return Object.values(this.payment_categories)
      .filter(x => x.settings_section)
      .sort(this.sortSettings)
      .map(section => {
        return {
          id: section.id,
          buttonSize,
          iconName: section.name,
          title: getTitle(section.name),
          buttons: Object.values(payment_data[`${section.id}`].types || {}).map(
            x => {
              return {
                disabled: (() => {
                  if (x.disabled) {
                    return (
                      x.disabled() || !payment_data[`${section.id}`].enabled
                    );
                  } else {
                    return !x.enabled || !payment_data[`${section.id}`].enabled;
                  }
                })(),
                iconName: x.name,
                label: x.name,
                index: 0,
                pIndex: 0,
                paymentName: getTitle(section.name),
                onPress: () => {
                  if (x.onPress) {
                    if (this.payment_categories_enabled.includes(section.id)) {
                      return x.onPress.call(this, section, x);
                    } else {
                      return;
                    }
                  }
                  if (x.id >= 22 && x.id <= 27) {
                    return;
                  }
                  const setCategories = new Set(
                    this.payment_categories_enabled
                  );

                  const setTypes = new Set(this.payment_types_enabled);
                  if (setTypes.has(x.id)) {
                    if (x.id >= 22 && x.id <= 27) {
                      for (let index = 22; index <= 27; index++) {
                        setTypes.delete(index);
                      }
                    }
                    setTypes.delete(x.id);
                    const siblings = Object.values(
                      payment_data[`${section.id}`].types || {}
                    ).map(({ id }) => id);
                    if (!this.checkSiblings(siblings, Array.from(setTypes))) {
                      setCategories.delete(section.id);
                    }
                  } else {
                    if (x.id >= 22 && x.id <= 27) {
                      for (let index = 22; index <= 27; index++) {
                        setTypes.add(index);
                      }
                    }
                    setTypes.add(x.id);
                    setCategories.add(section.id);
                  }
                  const newCats = Array.from(setCategories);
                  const newTypes = Array.from(setTypes);
                  this.setEnabledCategories(newCats);
                  this.setEnabledTypes(newTypes);
                },
                buttonSize,
              };
            }
          ),
          onPress: id => {
            const setCategories = new Set(this.payment_categories_enabled);

            const setTypes = new Set(this.payment_types_enabled);
            const categoryTypes = Object.values(
              payment_data[`${section.id}`].types || {}
            ).map(x => ({ id: x.id, independent: x.independent }));
            categoryTypes.forEach(x => {
              if (setCategories.has(id)) {
                setTypes.delete(x.id);
              } else {
                if (!x.independent) {
                  setTypes.add(x.id);
                }
              }
            });
            if (setCategories.has(id)) {
              setCategories.delete(id);
            } else {
              setCategories.add(id);
            }

            const newCats = Array.from(setCategories.values());
            const newTypes = Array.from(setTypes.values());
            this.setEnabledCategories(newCats);
            this.setEnabledTypes(newTypes);
          },
          disabled: !payment_data[`${section.id}`].enabled,
        };
      });
  }

  updateApi(settingName, settingoptionsparams) {
    const user = realm.objectForPrimaryKey('User', 0);
    const { userId, merchantId } = user;
    return epaisaRequest(
      {
        userId,
        merchantId,
        settingName,
        settingoptionsparams,
      },
      '/setting',
      'PUT'
    );
  }
}
