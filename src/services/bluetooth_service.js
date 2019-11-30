import loading_service from './loading_service';
import alert_service from './alert_service';
import { PermissionsAndroid, NativeModules, Platform } from 'react-native';
import { PrintExample } from './printer_service';
import {
  isTablet,
  UUID,
} from '../features/cash_register/constants/isLandscape';
import { getLocalSettingRow } from './settings_service';
var config = {
  uuid: '00001101-0000-1000-8000-00805F9B34FB',
  deviceName: 'ePaisa Payments',
  bufferSize: 1024,
  characterDelimiter: '\n',
};
async function requestLocationPermission() {
  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      {
        title: 'ePaisa Location Permission',
        message:
          'ePaisa needs access to your location ' +
          'so you can connect with all devices.',
        buttonNeutral: 'Ask Me Later',
        buttonNegative: 'Cancel',
        buttonPositive: 'OK',
      }
    );
  } catch (err) {
    console.warn(err);
  }
}

export async function InitBluetooth(custom) {
  var isEnabled = false;
  try {
    if (Platform.OS == 'android') {
      isEnabled = await BluetoothStatus.state();
    }
  } catch (error) {
    console.error(error);
  }

  if (isEnabled && Platform.OS == 'android') {
    requestLocationPermission();
    EasyBluetooth.init(config)
      .then(async function() {
        console.log('config done!');
        EasyBluetooth.startScan()
          .then(function(devices) {
            console.log('all devices found:');
            console.log(devices);
            custom(devices);
          })
          .catch(function(ex) {
            console.warn(ex);
            custom([]);
            alert('No devices detected!');
          });
      })
      .catch(function(ex) {
        custom([]);
        alert('Bluetooth error! Make sure your Bluetooth is on.');
      });
  } else {
    loading_service.hideLoading();
    alert_service.showAlert('Bluetooth is not activated');
  }
}
export function ConnectDevice(device, custom, error, toPrint) {
  if (Platform.OS == 'android') {
    EasyBluetooth.connect(device)
      .then(() => {
        console.log(device);

        if (!toPrint) alert_service.showAlert('Device is connected!');
        custom();
      })
      .catch(ex => {
        console.log(ex);
        if (!toPrint) alert_service.showAlert('Device no able to connect!');
        custom();
        error();
      });
  }
}
export function DisconnectDevice(device, no) {
  if (Platform.OS == 'android') {
    EasyBluetooth.disconnect()
      .then(() => {
        console.log(device);
        if (no) {
        } else alert_service.showAlert('Device disconnected!');
      })
      .catch(ex => {
        console.log(ex);
        if (no) {
        } else alert_service.showAlert('Device no able to disconnect!');
      });
  }
}
function spaces(number) {
  let string = '';
  for (let i = 0; i < number; i++) {
    string.concat('\xa0');
  }
  return string;
}
function hex_to_ascii(str1) {
  var hex = str1.toString();
  var str = '';
  for (var n = 0; n < hex.length; n += 2) {
    str += String.fromCharCode(parseInt(hex.substr(n, 2), 16));
  }
  return str;
}
const width = 48; //32
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
export function toastTest() {
  const a = NativeModules.ImageConverterService.convertImage('asdsad');
  console.log(a);
}

export function Write(object, device) {
  //PrintExample()
  if (object.duplicated && Platform.OS == 'android') {
    EasyBluetooth.writeln(`${setCenter('Duplicated')}\n`);
  }
  let products = '';
  let totalTaxes = 0;
  let subtotal = 0;
  for (let i = 0; i < object.products.length; i++) {
    totalTaxes = totalTaxes + object.products[i].totalTax;
    subtotal =
      subtotal + object.products[i].unitPrice * object.products[i].quantity;
    subtotal =
      subtotal -
      (object.products[i].type == '%'
        ? object.products[i].calculatedDiscount
        : object.products[i].discount);
    products =
      products +
      `${setproducts(
        object.products[i].quantity +
          (object.products[i].quantity < 10 ? ' ' : '') +
          ' ' +
          object.products[i].name,
        parseFloat(
          object.products[i].unitPrice * object.products[i].quantity
        ).toFixed(2)
      )}${
        object.products[i].discount > 0
          ? setproducts(
              `   Discount@${object.products[i].discount}${
                object.products[i].type
              }`,
              `-${
                object.products[i].type == '%'
                  ? parseFloat(object.products[i].calculatedDiscount).toFixed(2)
                  : parseFloat(object.products[i].discount).toFixed(2)
              }`
            ) + `\n`
          : ''
      }`;
  }
  let calculatedDiscount =
    object.discountType == '%'
      ? (subtotal * object.discount) / 100
      : object.discount;
  let totalCalculated =
    subtotal + parseFloat(object.delivery) - calculatedDiscount + totalTaxes;
  let str = `${setCenter(object.companyName)}\n${setCenter(
    (object.address1.length > 15
      ? object.address1.substr(0, 15)
      : object.address1) +
      ' ' +
      (object.address2.length > 15
        ? object.address2.substr(0, 15)
        : object.address2)
  )}\n${
    object.city != null && object.state != null
      ? setCenter(object.city + ' ' + object.state)
      : ''
  }${object.city != null && object.state != null ? '\n' : ''}${setCenter(
    object.pincode
  )}\n\nDate : ${object.date} ${object.time}\nPID : ${
    object.paymentId
  }\n${setCenter('BILL')}\n\n${products}${'.'.repeat(width)}\n${setproducts(
    'Sub Total',
    `${parseFloat(subtotal).toFixed(2)}`
  )}\n${
    object.discount > 0
      ? setproducts(
          `Discount@${object.discount}${object.discountType}`,
          `-${parseFloat(calculatedDiscount).toFixed(2)}`
        )
      : ''
  }${object.discount > 0 ? '\n' : ''}${
    object.delivery > 0
      ? setproducts(
          'Delivery Charge',
          `${parseFloat(object.delivery).toFixed(2)}`
        )
      : ''
  }${object.delivery > 0 ? '\n' : ''}${
    totalTaxes > 0
      ? setproducts('TAXES', `${parseFloat(totalTaxes).toFixed(2)}\n`)
      : ''
  }${
    // object.CESS > 0 ? setproducts('CESS', `${object.CESS}\n`) : ''}${
    //   object.CGST > 0 ? setproducts('CGST', `${object.CGST}\n`) : ''}${
    //     object.IGST > 0 ? setproducts('IGST', `${object.IGST}\n`) : ''}${
    //       object.SGST > 0 ? setproducts('SGST', `${object.SGST}\n`) : ''}${
    '.'.repeat(width)
  }\n${setproducts(
    'Total',
    `${parseFloat(totalCalculated).toFixed(2)}`
  )}\n${'.'.repeat(width)}\n\nPaid by:\n${setproducts(
    `${object.paymentType} Payment`,
    `${parseFloat(totalCalculated).toFixed(2)}`
  )}\n${'.'.repeat(
    width
  )}\nReturn Policy : We don't take returns. :)\n${setCenter(
    'Thanks you for your business!'
  )}\n${setCenter('Powered by ePaisa')}\n\n${'.'.repeat(width)}\n\r`;
  //alert(str)
  //EasyBluetooth.write
  //PrintExample()

  //  EasyBluetooth.printImage(getLocalSettingRow("Receipt","business_logo"), (response)=>{

  //     var intArray = JSON.parse(response)
  //    //const newBuffer = new Buffer(intArray)
  //   EasyBluetooth.writeIntArray(intArray).then(()=>{
  if (Platform.OS == 'android') {
    EasyBluetooth.writeln(str)
      .then(() => {
        //alert("Printing...")
        DisconnectDevice(device, true);
      })
      .catch(ex => {
        console.warn(ex);
        DisconnectDevice(device, true);
      });
  }
  //    })
  //  })
}
