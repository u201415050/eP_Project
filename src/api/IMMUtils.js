export default class IMMUtils {
  defaultDecimalPlaces = 2;
  isNumber(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
  }
  formatNumberWithCommas(x) {
    if (x) {
      return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    }
    return x;
  }

  convertCostStrToDecimal(costStr) {
    var decimalVal =
      this.convertCostStrToInteger(costStr) *
      Math.pow(10, -this.defaultDecimalPlaces);
    var res = parseFloat(decimalVal.toFixed(this.defaultDecimalPlaces));
    //console.log("convertCostStrToDecimal|costStr:" + costStr + "|decimalVal:" + decimalVal + "|res:" + res);
    return res;
  }

  fixToDefaultDecimalPlaces(amount) {
    return amount.toFixed(this.defaultDecimalPlaces);
  }

  // e.g.: if the amount has 2 decimal places and de amountLimit has 4 and the amount===amountLimit for 2 decimal places, then the amount must be equals to the amountLimit (with 4 decimal places)
  getAmountLimitIfNeeded(amount, amountLimit) {
    if (
      amount.toFixed(this.defaultDecimalPlaces) ===
      amountLimit.toFixed(this.defaultDecimalPlaces)
    ) {
      return amountLimit;
    }
    return amount;
  }

  ceilWithDecimalPlaces(amount) {
    return (
      Math.ceil(amount * Math.pow(10, this.defaultDecimalPlaces)) *
      Math.pow(10, -this.defaultDecimalPlaces)
    );
  }

  truncateWithDecimalPlaces(amount) {
    return (
      parseInt(amount * Math.pow(10, this.defaultDecimalPlaces)) *
      Math.pow(10, -this.defaultDecimalPlaces)
    );
    //return Math.trunc(amount * Math.pow(10, this.defaultDecimalPlaces)) * Math.pow(10, -this.defaultDecimalPlaces); // doesn't work in IE!!!
  }

  convertCostStrToInteger(costStr) {
    //console.log("BEGIN costStr:" + costStr);
    costStr = costStr + ''; // for safety purposes...
    var result = '';

    if (costStr) {
      for (var i = 0; i < costStr.length; i++) {
        if (this.isNumber(costStr[i])) {
          result += costStr[i];
        }
      }
      if (this.isNumber(result)) {
        var resultFloat = parseFloat(result);
        //console.log("END isNumber:true|result:" + result + "|resultFloat:" + resultFloat);
        return resultFloat;
      } else {
        //console.log("END isNumber:false|result:" + result);
        return 0;
      }
    }
    return 0;
  }

  getCurrencyISOcode(currency) {
    return currency.ISOcodeAlias && currency.ISOcodeAlias.length
      ? currency.ISOcodeAlias
      : currency.ISOcode;
  }

  formatAmountWithCode(amount, currency) {
    if (!currency) {
      return '';
    }
    var ISOsymbol = currency.ISOsymbol;
    var ISOcode = this.getCurrencyISOcode(currency);

    if (ISOcode) {
      if (
        ISOcode === 'BTC' ||
        ISOcode === 'BCH' ||
        ISOcode === 'LTC' ||
        ISOcode === 'ETH' ||
        ISOcode === 'ZEC' ||
        ISOcode === 'USDT' ||
        ISOcode === 'XRP' ||
        ISOcode === 'XMR' ||
        ISOcode === 'DOGE'
      ) {
        return ISOsymbol + ' ' + amount + ' ' + ISOcode;
      } else {
        return this.formatAmount2(amount, ISOsymbol) + ' ' + ISOcode;
      }
    } else {
      return this.formatAmount2(amount, ISOsymbol);
    }
  }
  formatAmountByLocale(amount, locale) {
    // Safari bug fix: money box without the possibility of typing zeros

    return amount.toLocaleString(locale);
  }
  formatAmount(amount, currencySymbol) {
    amount = this.formatAmountByLocale(amount);
    currencySymbol = currencySymbol ? currencySymbol : '';

    return currencySymbol + amount;
  }

  formatAmount2(amount, currencySymbol) {
    currencySymbol = currencySymbol ? currencySymbol : '';

    if (amount && this.isNumber(amount)) {
      var amountFixed = amount.toFixed(this.defaultDecimalPlaces);
      amountFixed = this.formatAmountByLocale(amountFixed);

      return currencySymbol + amountFixed;
    }
    //return currencySymbol + "0.00";
    return currencySymbol + '' + this.formatAmountByLocale(0);
  }

  formatCost(cost, currencySymbol) {
    var result = (cost / Math.pow(10, this.defaultDecimalPlaces)).toFixed(
      this.defaultDecimalPlaces
    );
    //result = result.replaceAll(",", ".");
    result = this.formatAmount(result, currencySymbol);
    return result;
  }

  costChanged(costStr, currencySymbol) {
    costStr = costStr + ''; // for safety purposes...
    //console.log("BEFORE costChanged|costStr:" + costStr);

    if (costStr) {
      //costStr = costStr.replaceAll(".", "").replaceAll(",", "").replace(currencySymbol, "");
      costStr = this.filterNumbers(costStr);
      var i = 0;

      while (!this.isNumber(costStr) && costStr.length > 0) {
        costStr = costStr.slice(0, -1);
        i++;
      }
      //var cost = costStr !== "" ? costStr.replaceAll(".", "").replaceAll(",", "") : 0;
      var cost = this.filterNumbers(costStr);
      costStr = this.formatCost(cost, currencySymbol);
    }
    //console.log("AFTER costChanged|costStr:" + costStr);
    return costStr;
  }
  formatAmountRemovingDecimalPlaces(amount) {
    return Math.ceil(amount * Math.pow(10, this.defaultDecimalPlaces));
  }

  enoughBalanceForAmount(actualAmount, balanceAmount) {
    return actualAmount <= this.convertCostStrToDecimal(balanceAmount);
  }

  convertFloatToString(cost) {
    return (cost + '').replaceAll(',', '.');
  }

  filterNumbers(costStr) {
    if (!costStr) return costStr;

    var res = '';
    for (var index in costStr) {
      if (this.isNumber(costStr[index])) {
        res += costStr[index];
      }
    }

    return res;
  }

  addNotExistingPropertiesToObject(objTarget, objToCopy) {
    for (var key in objToCopy) {
      if (!objTarget[key]) {
        objTarget[key] = objToCopy[key];
      }
    }
    return objTarget;
  }

  createGuid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = (Math.random() * 16) | 0,
        v = c === 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  }
}
