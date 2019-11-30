import loading_service from './loading_service';
import alert_service from './alert_service';
import {
  PermissionsAndroid,
  NativeModules,
  Platform,
  Alert,
} from 'react-native';
import { PrintExample } from './printer_service';
import {
  isTablet,
  UUID,
} from '../features/cash_register/constants/isLandscape';
import { getLocalSettingRow } from './settings_service';
import BluetoothSerial, {
  withSubscription,
} from 'react-native-bluetooth-serial-next';
import { Buffer } from 'buffer';
export async function InitBluetoothIOS(custom) {
  const [isEnabled, devices] = await Promise.all([
    BluetoothSerial.isEnabled(),
    BluetoothSerial.list(),
  ]);
  //alert(isEnabled)

  if (isEnabled) {
    custom(devices);
  } else {
    loading_service.hideLoading();
    alert_service.showAlert('Bluetooth is not activated');
  }
}
export async function getEnabled(handle) {
  const [isEnabled] = await Promise.all([BluetoothSerial.isEnabled()]);
  //alert(isEnabled)
  handle(isEnabled);
}
const width = 47;
//const width = 31;
function setCenter(str) {
  let extraleft = parseFloat((width - str.length) / 2).toFixed(0);
  let newStr = ' '.repeat(extraleft) + str;
  return newStr;
}
function setproducts(str1, str2) {
  let extraleft = width - str1.length - str2.length;
  let newStr = str1 + ' '.repeat(extraleft) + str2;
  return newStr;
}
function toDecimal(number, decimals) {
  decimals = decimals || 100;
  return (
    Math.round(
      number.toFixed(decimals.toString().length - 1) * decimals + Number.EPSILON
    ) / decimals
  );
}
export async function WriteDeviceIOS(object, device) {
  /*if(object.duplicated){
          BluetoothSerial.device(device.id).write(`${setCenter("Duplicated")}\n`);
        }*/

  console.log(object);
  let finalString = '';

  finalString =
    finalString +
    (object.companyName != '' ? setCenter(object.companyName) + '\n' : '');
  finalString =
    finalString +
    (setCenter(
      (object.address1.length > 15
        ? object.address1.substr(0, 15)
        : object.address1) +
        (object.address2.length > 15
          ? ' ' + object.address2.substr(0, 15)
          : ' ' + object.address2)
    ) +
      '\n');
  finalString =
    finalString +
    (setCenter(
      (object.city != '' ? object.city : '') +
        (object.city != '' && object.state != '' ? ' ' : '') +
        (object.state != '' ? object.state : '')
    ) +
      '\n');
  finalString = finalString + (setCenter(object.pincode) + '\n\n');
  finalString = finalString + `Date : ${object.date} ${object.time}\n`;
  finalString = finalString + `PID : ${object.paymentId}\n`;
  finalString =
    finalString +
    (setCenter(`${object.duplicated ? 'DUPLICATE' : ''} BILL`) + '\n');

  let subtotal = 0;
  for (let i = 0; i < object.products.length; i++) {
    totalTaxes = 0; //totalTaxes+object.products[i].totalTax
    subtotal =
      subtotal + object.products[i].unitPrice * object.products[i].quantity;
    subtotal =
      subtotal -
      (object.products[i].type == '%'
        ? object.products[i].calculatedDiscount
        : object.products[i].discount);
    // products =
    //   products +
    //   `${setproducts(
    //     object.products[i].quantity +(object.products[i].quantity<10?' ':'')+ ' ' + object.products[i].name,
    //     parseFloat(
    //       object.products[i].unitPrice * object.products[i].quantity
    //     ).toFixed(2)
    //   )}${
    //     object.products[i].discount > 0
    //       ? setproducts(
    //           `   Discount@${object.products[i].discount}${
    //             object.products[i].type
    //           }`,
    //           `-${
    //             object.products[i].type == '%'
    //               ? parseFloat(
    //                 object.products[i].calculatedDiscount
    //                 ).toFixed(2)
    //               : parseFloat(object.products[i].discount).toFixed(2)
    //           }`
    //         )
    //       : ''
    //   }`;
    finalString =
      finalString +
      (setproducts(
        object.products[i].quantity +
          (object.products[i].quantity < 10 ? ' ' : '') +
          ' ' +
          object.products[i].name,
        parseFloat(
          object.products[i].unitPrice * object.products[i].quantity
        ).toFixed(2)
      ) +
        '\n');
    if (object.products[i].discount > 0) {
      finalString =
        finalString +
        (setproducts(
          `   Discount@${object.products[i].discount}${
            object.products[i].type
          }`,
          `-${
            object.products[i].type == '%'
              ? parseFloat(object.products[i].calculatedDiscount).toFixed(2)
              : parseFloat(object.products[i].discount).toFixed(2)
          }`
        ) +
          '\n');
    }
  }
  //let calculatedDiscount=object.discountType=='%'?subtotal*object.discount/100:object.discount
  //let totalCalculated = subtotal+parseFloat(object.delivery)-calculatedDiscount+totalTaxes
  let taxFinal =
    parseFloat(subtotal) +
    (object.CESS != 0 ? object.CESS.taxvalue : 0) +
    (object.CGST != 0 ? object.CGST.taxvalue : 0) +
    (object.IGST != 0 ? object.IGST.taxvalue : 0) +
    (object.SGST != 0 ? object.SGST.taxvalue : 0) +
    (object.VAT != 0 ? object.VAT.taxvalue : 0);
  let finalPay =
    parseFloat(taxFinal) +
    (object.delivery > 0 ? object.delivery : 0) -
    (object.discount > 0 ? (object.discount * taxFinal) / 100 : 0);

  if (
    getLocalSettingRow('Transaction', 'RoundOff') == true ||
    getLocalSettingRow('Transaction', 'RoundOff') == 1
  ) {
    finalPay = parseInt(finalPay.toFixed(0));
  }

  // let str = `${
  //   setCenter(object.companyName)}\n${
  //   setCenter((object.address1.length>15?object.address1.substr(0,15):object.address1) + ' ' +(object.address2.length>15?object.address2.substr(0,15):object.address2))}\n${
  //     object.city!=null?setCenter(object.city + ' - ' + object.pincode):''}\n\nDate : ${
  //         object.date} ${object.time}\nPID : ${
  //           object.paymentId}\n${setCenter(`${object.duplicated?'DUPLICATE':''} BILL`)}\n\n${
  //             products}${'-'.repeat(width)}${
  //               setproducts('Sub Total', `${parseFloat(subtotal).toFixed(2)}`)}${
  //                 //object.discount > 0? setproducts(`Discount@${object.discount}${object.discountType}`,`-${parseFloat(calculatedDiscount).toFixed(2)}`): ''}${object.discount>0?'\n':''}${
  //                   //object.delivery > 0? setproducts('Delivery Charge', `${parseFloat(object.delivery).toFixed(2)}`): ''}${object.delivery>0?'\n':''}${
  //                     //totalTaxes > 0 ? setproducts('TAXES', `${parseFloat(totalTaxes).toFixed(2)}\n`) : ''}${
  //                        object.CESS.taxvalue != 0 ? setproducts('CESS', `${toDecimal(parseFloat(object.CESS.taxvalue),100).toFixed(2)}`) : ''}${
  //                        // object.CESS.taxvalue != 0 ?'\n':''}${
  //                          object.CGST.taxvalue != 0 ? setproducts('CGST', `${toDecimal(parseFloat(object.CGST.taxvalue),100).toFixed(2)}`) : ''}${
  //                          // object.CGST.taxvalue != 0 ?'\n':''}${
  //                            object.IGST.taxvalue != 0 ? setproducts('IGST', `${toDecimal(parseFloat(object.IGST.taxvalue),100).toFixed(2)}`) : ''}${
  //                            // object.IGST.taxvalue != 0 ?'\n':''}${
  //                              object.SGST.taxvalue != 0 ? setproducts('SGST', `${toDecimal(parseFloat(object.SGST.taxvalue),100).toFixed(2)}`) : ''}${
  //                              // object.SGST.taxvalue != 0 ?'\n':''}${
  //                               object.VAT.taxvalue != 0 ? setproducts('VAT', `${toDecimal(parseFloat(object.VAT.taxvalue),100).toFixed(2)}`) : ''}${
  //                                // object.VAT.taxvalue != 0 ?'\n':''}${
  //                               '-'.repeat(width)}${
  //                                 setproducts(`${object.discount > 0||object.delivery > 0?'Total Amount':'Total Payable'}`,`${
  //                                   object.discount > 0||object.delivery > 0?
  //                                   toDecimal(parseFloat(taxFinal),100).toFixed(2):
  //                                   getLocalSettingRow('Transaction', 'RoundOff') == true ||
  //                                   getLocalSettingRow('Transaction', 'RoundOff') == 1?
  //                                   parseInt(toDecimal(parseFloat(taxFinal),100).toFixed(0)).toFixed(2)
  //                                   :toDecimal(parseFloat(taxFinal),100).toFixed(2)

  //                                 }`)}${
  //                                   object.discount > 0||object.delivery > 0?
  //                                   '-'.repeat(width)+
  //                                   (object.discount > 0? setproducts(`Discount@${object.discount}${object.discountType}`,`-${parseFloat(object.discount*taxFinal/100).toFixed(2)}`): '')+
  //                                   /*(object.discount>0?'\n':'')+*/( object.delivery > 0? setproducts('Delivery Charge', `${parseFloat(object.delivery).toFixed(2)}`): '')+
  //                                   /*(object.delivery>0?'\n':'')+*/'-'.repeat(width)/*+'\n'*/+setproducts('Total Payable',`${toDecimal(parseFloat(finalPay),100).toFixed(2)}`)//+'\n'

  //                                 :''}${
  //                                   '-'.repeat(width)}Paid by:\n${
  //                                     setproducts(`${object.paymentType} Payment`,`${toDecimal(parseFloat(finalPay),100).toFixed(2)}`)}${
  //                                       '-'.repeat(width)}\nReturn Policy : We don't take returns. :)\n${
  //                                         setCenter('Thanks you for your business!')}\n${
  //                                           setCenter('Powered by ePaisa')}\n\n${'-'.repeat(width)}\n\r`;
  //alert(str)
  //
  //BluetoothSerial.device(device.id).write(str)

  finalString = finalString + ('-'.repeat(width) + '\n');
  finalString =
    finalString +
    (setproducts('Sub Total', `${parseFloat(subtotal).toFixed(2)}`) + '\n');
  finalString =
    finalString +
    (object.CESS.taxvalue != 0
      ? setproducts(
          'CESS',
          `${toDecimal(parseFloat(object.CESS.taxvalue), 100).toFixed(2)}`
        ) + '\n'
      : '');
  finalString =
    finalString +
    (object.CGST.taxvalue != 0
      ? setproducts(
          'CGST',
          `${toDecimal(parseFloat(object.CGST.taxvalue), 100).toFixed(2)}`
        ) + '\n'
      : '');
  finalString =
    finalString +
    (object.IGST.taxvalue != 0
      ? setproducts(
          'IGST',
          `${toDecimal(parseFloat(object.IGST.taxvalue), 100).toFixed(2)}`
        ) + '\n'
      : '');
  finalString =
    finalString +
    (object.SGST.taxvalue != 0
      ? setproducts(
          'SGST',
          `${toDecimal(parseFloat(object.SGST.taxvalue), 100).toFixed(2)}`
        ) + '\n'
      : '');
  finalString =
    finalString +
    (object.VAT.taxvalue != 0
      ? setproducts(
          'VAT',
          `${toDecimal(parseFloat(object.VAT.taxvalue), 100).toFixed(2)}`
        ) + '\n'
      : '');
  finalString = finalString + ('-'.repeat(width) + '\n');
  finalString =
    finalString +
    (setproducts(
      `${
        object.discount > 0 || object.delivery > 0
          ? 'Total Amount'
          : 'Total Payable'
      }`,
      `${
        object.discount > 0 || object.delivery > 0
          ? toDecimal(parseFloat(taxFinal), 100).toFixed(2)
          : getLocalSettingRow('Transaction', 'RoundOff') == true ||
            getLocalSettingRow('Transaction', 'RoundOff') == 1
          ? parseInt(toDecimal(parseFloat(taxFinal), 100).toFixed(0)).toFixed(2)
          : toDecimal(parseFloat(taxFinal), 100).toFixed(2)
      }`
    ) +
      '\n');
  if (object.discount > 0 || object.delivery > 0) {
    finalString = finalString + ('-'.repeat(width) + '\n');
    if (object.discount > 0) {
      if (object.discountType == '%') {
        finalString =
          finalString +
          (setproducts(
            `Discount@${object.discount}${object.discountType}`,
            `-${parseFloat((object.discount * taxFinal) / 100).toFixed(2)}`
          ) +
            '\n');
      } else {
        finalString =
          finalString +
          (setproducts(
            `Discount`,
            `-${parseFloat(object.discount).toFixed(2)}`
          ) +
            '\n');
      }
    }
    if (object.delivery > 0) {
      finalString =
        finalString +
        (setproducts(
          'Delivery Charge',
          `${parseFloat(object.delivery).toFixed(2)}`
        ) +
          '\n');
    }
  }
  finalString = finalString + ('-'.repeat(width) + '\n');

  finalString = finalString + 'Paid by:\n';
  object.listTrans.map(async trans => {
    finalString =
      finalString +
      (setproducts(
        `${trans.type} ${trans.type.indexOf('Payment') != -1 ? '' : 'Payment'}`,
        `${toDecimal(parseFloat(trans.amount), 100).toFixed(2)}`
      ) +
        '\n');
  }); //alert(`Paid by:\n${setproducts(`${object.listTrans[0].type} Payment`,`${toDecimal(parseFloat(trans.amount),100).toFixed(2)}`)+'\n'}`)
  // finalString=finalString+(setproducts(`${object.paymentType} Payment`,`${toDecimal(parseFloat(finalPay),100).toFixed(2)}`)+'\n');
  finalString = finalString + ('-'.repeat(width) + '\n');
  finalString =
    finalString + ("Return Policy : We don't take returns. :)" + '\n');
  finalString =
    finalString + (setCenter('Thanks you for your business!') + '\n');
  finalString = finalString + (setCenter('Powered by ePaisa') + '\n\n\n\n');

  await BluetoothSerial.write(finalString);
  console.log(finalString);
  console.log(
    object.companyName != '' ? setCenter(object.companyName) + '\n' : ''
  );
  console.log(
    setCenter(
      (object.address1.length > 15
        ? object.address1.substr(0, 15)
        : object.address1) +
        (object.address2.length > 15
          ? ' ' + object.address2.substr(0, 15)
          : ' ' + object.address2)
    ) + '\n'
  );
  console.log(
    setCenter(
      (object.city != '' ? object.city : '') +
        (object.city != '' && object.state != '' ? ' ' : '') +
        (object.state != '' ? object.state : '')
    ) + '\n'
  );
  console.log(setCenter(object.pincode) + '\n\n');
  console.log(`Date : ${object.date} ${object.time}\n`);
  console.log(`PID : ${object.paymentId}\n`);
  console.log(setCenter(`${object.duplicated ? 'DUPLICATE' : ''} BILL`) + '\n');

  subtotal = 0;
  for (let i = 0; i < object.products.length; i++) {
    totalTaxes = 0; //totalTaxes+object.products[i].totalTax
    subtotal =
      subtotal + object.products[i].unitPrice * object.products[i].quantity;
    subtotal =
      subtotal -
      (object.products[i].type == '%'
        ? object.products[i].calculatedDiscount
        : object.products[i].discount);

    console.log(
      setproducts(
        object.products[i].quantity +
          (object.products[i].quantity < 10 ? ' ' : '') +
          ' ' +
          object.products[i].name,
        parseFloat(
          object.products[i].unitPrice * object.products[i].quantity
        ).toFixed(2)
      ) + '\n'
    );
    if (object.products[i].discount > 0) {
      console.log(
        setproducts(
          `   Discount@${object.products[i].discount}${
            object.products[i].type
          }`,
          `-${
            object.products[i].type == '%'
              ? parseFloat(object.products[i].calculatedDiscount).toFixed(2)
              : parseFloat(object.products[i].discount).toFixed(2)
          }`
        ) + '\n'
      );
    }
  }

  console.log('-'.repeat(width) + '\n');
  console.log(
    setproducts('Sub Total', `${parseFloat(subtotal).toFixed(2)}`) + '\n'
  );
  console.log(
    object.CESS.taxvalue != 0
      ? setproducts(
          'CESS',
          `${toDecimal(parseFloat(object.CESS.taxvalue), 100).toFixed(2)}`
        ) + '\n'
      : ''
  );
  console.log(
    object.CGST.taxvalue != 0
      ? setproducts(
          'CGST',
          `${toDecimal(parseFloat(object.CGST.taxvalue), 100).toFixed(2)}`
        ) + '\n'
      : ''
  );
  console.log(
    object.IGST.taxvalue != 0
      ? setproducts(
          'IGST',
          `${toDecimal(parseFloat(object.IGST.taxvalue), 100).toFixed(2)}`
        ) + '\n'
      : ''
  );
  console.log(
    object.SGST.taxvalue != 0
      ? setproducts(
          'SGST',
          `${toDecimal(parseFloat(object.SGST.taxvalue), 100).toFixed(2)}`
        ) + '\n'
      : ''
  );
  console.log(
    object.VAT.taxvalue != 0
      ? setproducts(
          'VAT',
          `${toDecimal(parseFloat(object.VAT.taxvalue), 100).toFixed(2)}`
        ) + '\n'
      : ''
  );
  console.log('-'.repeat(width) + '\n');
  console.log(
    setproducts(
      `${
        object.discount > 0 || object.delivery > 0
          ? 'Total Amount'
          : 'Total Payable'
      }`,
      `${
        object.discount > 0 || object.delivery > 0
          ? toDecimal(parseFloat(taxFinal), 100).toFixed(2)
          : getLocalSettingRow('Transaction', 'RoundOff') == true ||
            getLocalSettingRow('Transaction', 'RoundOff') == 1
          ? parseInt(toDecimal(parseFloat(taxFinal), 100).toFixed(0)).toFixed(2)
          : toDecimal(parseFloat(taxFinal), 100).toFixed(2)
      }`
    ) + '\n'
  );
  if (object.discount > 0 || object.delivery > 0) {
    console.log('-'.repeat(width) + '\n');
    if (object.discount > 0) {
      if (object.discountType == '%') {
        console.log(
          setproducts(
            `Discount@${object.discount}${object.discountType}`,
            `-${parseFloat((object.discount * taxFinal) / 100).toFixed(2)}`
          ) + '\n'
        );
      } else {
        console.log(
          setproducts(
            `Discount`,
            `-${parseFloat(object.discount).toFixed(2)}`
          ) + '\n'
        );
      }
    }
    if (object.delivery > 0) {
      console.log(
        setproducts(
          'Delivery Charge',
          `${parseFloat(object.delivery).toFixed(2)}`
        ) + '\n'
      );
    }
  }
  console.log('-'.repeat(width) + '\n');

  console.log('Paid by:\n');
  object.listTrans.map(async trans => {
    console.log(
      setproducts(
        `${trans.type} ${trans.type.indexOf('Payment') != -1 ? '' : 'Payment'}`,
        `${toDecimal(parseFloat(trans.amount), 100).toFixed(2)}`
      ) + '\n'
    );
  }); //alert(`Paid by:\n${setproducts(`${object.listTrans[0].type} Payment`,`${toDecimal(parseFloat(trans.amount),100).toFixed(2)}`)+'\n'}`)
  // console.log(setproducts(`${object.paymentType} Payment`,`${toDecimal(parseFloat(finalPay),100).toFixed(2)}`)+'\n');
  console.log('-'.repeat(width) + '\n');
  console.log("Return Policy : We don't take returns. :)" + '\n');
  console.log(setCenter('Thanks you for your business!') + '\n');
  console.log(setCenter('Powered by ePaisa') + '\n\n\n\n');
}
export async function ConnectDeviceIOS(device, custom) {
  const connected = await BluetoothSerial.device(device.id).connect();

  if (connected) {
    custom();
  }
}
