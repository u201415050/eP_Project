// import realm from '../realm_service';
// import { epaisaRequest } from '../epaisa_service';
// import * as _ from 'lodash';
export class RealmTaxValue {
  static schema = {
    name: 'RealmTaxValue',
    properties: {
      slabTaxId: 'int',
      slabs: 'double',
      taxValue: 'double',
      taxMode: 'string',
      // value: 'int',
      // mode: 'string',
    },
  };
}
export class RealmTax {
  static schema = {
    name: 'RealmTax',
    primaryKey: 'id',
    properties: {
      id: 'string',
      countryAlpha2Code: 'string',
      countryId: 'int',
      name: 'string',
      // values: 'string',
      values: 'RealmTaxValue[]',
    },
  };

  static formatTaxes(data) {
    const countryAlpha2Code = data.country;
    const countryId = data.countryId;
    const taxes = data.taxes;

    const newTaxes = taxes.map(x => {
      const values = x.detail
        .map(y => {
          return {
            slabTaxId: y.slabTaxId,
            slabs: y.slabs,
            taxValue: y.taxValue,
            taxMode: y.taxMode,
            // value: y.slabs,
            // mode: y.taxMode,
          };
        })
        .sort((a, b) => {
          if (a.slabs < b.slabs) return -1;
          if (a.slabs > b.slabs) return 1;
          return 0;
        });
      return {
        countryAlpha2Code,
        countryId,
        name: x.name,
        values,
      };
    });
    return newTaxes;
  }
}
