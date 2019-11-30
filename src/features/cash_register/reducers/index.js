import { cashConstants } from '../constants/actions';
import realm_service, { createRow } from '../../../services/realm_service';
import { AsyncStorage } from 'react-native';
import Order from '../../../factory/order';
import { updateCardReader } from '../../../services/user_service';
import OrderHelper from '../../../factory/order_helper';
import { getLocalSettingRow } from '../../../services/settings_service';
import CustomItemHelper from '../../../factory/custom_item_helper';

const initialState = {
  order: new Order({
    products: [],
    deliveryCharges: 0,
    generalDiscount: 0,
    generalDiscountType: 0,
  }),
  total_amount: (0).toFixed(2),
  amount: (0).toFixed(2),
  products: [],
  type: '%',
  totalDiscount: (0).toFixed(2),
  totalDelivery: (0).toFixed(2),
  sideOption: '0',
  customer: null,
  customers: [],
  itemsActive: [],
  cashreader: { list: [], selected: 0 },
  cashdrawer: { list: [], selected: 0 },
  printer: { list: [], selected: 0 },
  wallet: null,
  user: null,
  orderIdCustom: '',
  savedTransactions: [],
  orderIdCustomPay: '',
  hasChanges: false,
  personalConfig: null,
  notificationConfig: null,
};

//dummy content
const cashData = (state = initialState, action) => {
  switch (action.type) {
    case cashConstants.SUM_AMOUNT:
      return {
        ...state,
        amount: parseFloat(state.amount * 10 + action.payload / 100).toFixed(2),
      };

    case cashConstants.SUM_TOTAL:
      let amount = action.payload.amount;

      var index =
        state.products.length > 0
          ? state.products[state.products.length - 1].id + 1
          : 1;

      /*console.log('REDUX INDEX')
      console.log(index)
      console.log(state.products.length > 0)*/

      let item = {
        id: index, //state.products.length + 1,
        name: 'Custom product ' + index, //(state.products.length + 1),
        quant: 1,
        unitPrice: amount + '',
        total: amount + '',
        discount: '0',
        type: '%',
        image: '',
        sgst: (0).toFixed(2),
        cgst: (0).toFixed(2),
        igst: (0).toFixed(2),
        cess: 0 + '',
        vat: 0 + '',
      };
      createRow('Product', item);

      return amount != 0
        ? {
            ...state,
            total_amount: (
              parseFloat(state.total_amount) + parseFloat(amount)
            ).toFixed(2),
            hasChanges: true,
            // products: [
            //   ...state.products,
            //   {
            //     id: index, //state.products.length + 1,
            //     name: 'Custom product ' + index, //(state.products.length + 1),
            //     quant: 1,
            //     unitPrice: amount,
            //     total: amount,
            //     discount: (0).toFixed(2),
            //     type: '%',
            //     image: '',
            //     sgst: 0,
            //     cgst: 0,
            //     igst: 0,
            //     cess: 0,
            //     vat: 0,
            //   },
            // ],
            amount: (0).toFixed(2),
          }
        : { ...state };

    case cashConstants.BACK_AMOUNT:
      return {
        ...state,
        amount: (Math.floor(state.amount * 10) / 100).toFixed(2),
      };

    case cashConstants.CLEAR_AMOUNT:
      return { ...state, amount: (0).toFixed(2) };

    case cashConstants.CHANGE_OPTION:
      return { ...state, sideOption: action.payload };

    case cashConstants.ADD_DISCOUNT:
      /*db.transaction((tx)=>{
        tx.executeSql( `UPDATE 'extras' SET discount=${action.payload.discount},type='${action.payload.type}';`)
      });*/
      let extrarray = realm_service.objects('Extra');
      if (extrarray.length == 0) {
        realm_service.write(() => {
          realm_service.create('Extra', {
            discount: action.payload.discount + '',
            delivery: '0',
            option: '0',
            type: action.payload.type + '',
          });
        });
      } else {
        realm_service.write(() => {
          extrarray[0].discount = action.payload.discount + '';
          extrarray[0].type = action.payload.type + '';
        });
      }
      return {
        ...state,
        hasChanges: true,
        totalDiscount: parseFloat(action.payload.discount),
        type: action.payload.type,
      };

    case cashConstants.ADD_DELIVERY:
      let extrarray2 = realm_service.objects('Extra');
      if (extrarray2.length == 0) {
        realm_service.write(() => {
          realm_service.create('Extra', {
            discount: '0',
            delivery: action.payload + '',
            option: '0',
            type: '%',
          });
        });
      } else {
        realm_service.write(() => {
          extrarray2[0].delivery = action.payload + '';
        });
      }
      return {
        ...state,
        hasChanges: true,
        totalDelivery: parseFloat(action.payload),
      };

    case cashConstants.REMOVE_DISCOUNT:
      let extrarray3 = realm_service.objects('Extra');
      realm_service.write(() => {
        extrarray3[0].discount = '0';
        extrarray3[0].type = '%';
      });
      return { ...state, hasChanges: true, totalDiscount: parseFloat(0) };

    case cashConstants.REMOVE_DELIVERY:
      let extrarray4 = realm_service.objects('Extra');
      realm_service.write(() => {
        extrarray4[0].delivery = '0';
      });
      return { ...state, hasChanges: true, totalDelivery: parseFloat(0) };

    case cashConstants.ADD_CUSTOMER:
      createRow(
        'Customer',
        {
          id: 0,
          customerId: action.payload.customerId,
          name: action.payload.name,
          number: action.payload.number,
        },
        true
      );
      return { ...state, hasChanges: true, customer: action.payload };

    case cashConstants.OTP_CUSTOMER_REQUEST:
      createRow(
        'Customer',
        { id: 0, name: action.payload.name, number: action.payload.number },
        true
      );
      return { ...state, customer: action.payload };

    // case cashConstants.EDIT_PRODUCT:
    //   let newTotal = 0;
    //   let newProducts = state.products.map(itemPro =>
    //     itemPro.id === action.payload.id ? action.payload : itemPro
    //   );
    //   let newProductsRealPrice = newProducts.map(itemPro => {
    //     //itemPro.total = itemPro.quant * (itemPro.unitPrice);
    //     // alert(itemPro.total)
    //     newTotal += itemPro.total;
    //     return itemPro;
    //   });
    //   let item2 = {
    //     id: action.payload.id,
    //     name: action.payload.name,
    //     quant: action.payload.quant,
    //     unitPrice: action.payload.unitPrice + '',
    //     total: action.payload.total + '',
    //     discount: action.payload.discount + '',
    //     type: action.payload.type,
    //     image: action.payload.image,
    //     sgst: action.payload.sgst.toFixed(2),
    //     cgst: action.payload.cgst.toFixed(2),
    //     igst: action.payload.igst.toFixed(2),
    //     cess: action.payload.cess + '',
    //     vat: action.payload.vat + '',
    //   };
    //   let allproducts = realm_service.objects('Product');
    //   let updateP = allproducts.filtered(`id = ${action.payload.id}`);
    //   let toUpdate = updateP[0];
    //   realm_service.write(() => {
    //     toUpdate.name = item2.name;
    //     toUpdate.quant = parseInt(item2.quant);
    //     toUpdate.unitPrice = item2.unitPrice.toString();
    //     toUpdate.total = item2.total.toString();
    //     toUpdate.discount = item2.discount.toString();
    //     toUpdate.type = item2.type;
    //     toUpdate.image = item2.image;
    //     toUpdate.sgst = item2.sgst.toString();
    //     toUpdate.cgst = item2.cgst.toString();
    //     toUpdate.igst = item2.igst.toString();
    //     toUpdate.cess = item2.cess.toString();
    //     toUpdate.vat = item2.vat.toString();
    //   });
    //   /*db.transaction((tx)=>{
    //     tx.executeSql( `UPDATE 'products' SET name='${action.payload.name}',quant=${action.payload.quant},unitPrice=${action.payload.unitPrice},total=${action.payload.total},discount=${action.payload.discount},type='${action.payload.type}',image='${action.payload.image}'
    //                     WHERE id=${action.payload.id};`)
    //   });*/
    //   return {
    //     ...state,
    //     hasChanges: true,
    //     products: newProductsRealPrice,
    //     total_amount: newTotal,
    //   };

    // case cashConstants.DELETE_PRODUCT:
    //   let updatedProducts = state.products.filter(
    //     itemPro => itemPro.id !== action.payload.id
    //   );
    //   return {
    //     ...state,
    //     hasChanges: true,
    //     products: updatedProducts,
    //   };

    // case cashConstants.GET_DATA:
    //   let products5 = realm_service.objects('Product');
    //   let extras;
    //   let extrarrayGet = realm_service.objects('Extra');
    //   if (extrarrayGet.length == 0) {
    //     realm_service.write(() => {
    //       realm_service.create('Extra', {
    //         discount: '0',
    //         delivery: '0',
    //         option: '0',
    //         type: '%',
    //       });
    //     });
    //     extrarrayGet = realm_service.objects('Extra');
    //     extras = extrarrayGet;
    //   } else {
    //     extras = extrarrayGet;
    //   }

    //   let newArray = [];
    //   for (let i = 0; i < products5.length; i++) {
    //     newArray.push(products5[i]);
    //   }

    //   return {
    //     ...state,
    //     products: newArray,
    //     type: extras[0].type,
    //     totalDiscount: parseFloat(extras[0].discount),
    //     totalDelivery: parseFloat(extras[0].delivery),
    //     sideOption: '0',
    //   };

    case cashConstants.LIST_CUSTOMERS:
      AsyncStorage.setItem('totalCustomers', action.payload.totalCustomers);
      return {
        ...state,
        customers: action.payload.customers,
        userPermi: action.payload.userdata,
        totalCustomers: action.payload.totalCustomers,
      };
    case cashConstants.SET_USERPERMI:
      return {
        ...state,
        userPermi: action.payload,
      };
    case cashConstants.CLEAR_CUSTOMER:
      createRow('Customer', { id: 0, name: '', number: '' }, true);
      return {
        ...state,
        hasChanges: false,
        customer: null,
      };

    case cashConstants.CLEAR_DATA:
      //console.log('CLEANING DATA');
      AsyncStorage.setItem('orderPay', '');
      AsyncStorage.setItem('order', '');

      return {
        ...state,

        hasChanges: false,
        total_amount: (0).toFixed(2),
        amount: (0).toFixed(2),
        products: [],
        type: '%',
        totalDiscount: (0).toFixed(2),
        totalDelivery: (0).toFixed(2),
        sideOption: '0',
        orderIdCustom: '',
        orderIdCustomPay: '',
      };

    case cashConstants.SET_ITEMS:
      return {
        ...state,
        itemsActive: action.payload,
      };

    case cashConstants.SET_CASHREADERS:
      return {
        ...state,
        cashreader: action.payload,
      };

    case cashConstants.SELECT_CASHREADERS:
      let element = state.cashreader;
      element.selected = action.payload;
      let arraycards = Object.values(element);
      updateCardReader(arraycards[0]);
      return {
        ...state,
        cashreader: element,
      };
    case cashConstants.SET_PRINTERS:
      let element4 = state.printer;
      element4.list = action.payload;
      return {
        ...state,
        printer: element4,
      };

    case cashConstants.SELECT_PRINTERS:
      let element2 = state.printer;
      element2.selected = action.payload;
      return {
        ...state,
        printer: element2,
      };
    case cashConstants.SET_CASHDRAWERS:
      let element5 = state.cashdrawer;
      element5.selected = action.payload;
      return {
        ...state,
        cashdrawer: element5,
      };

    case cashConstants.SELECT_CASHDRAWERS:
      let element3 = state.cashdrawer;
      element3.selected = action.payload;
      return {
        ...state,
        cashdrawer: element3,
      };

    case cashConstants.SET_WALLET:
      return {
        ...state,
        wallet: action.payload,
      };

    case cashConstants.SET_USER:
      return {
        ...state,
        user: action.payload,
      };

    // case cashConstants.SET_PRODUCTS:
    //   let isIn = false;
    //   let indexOfCustomer = 0;
    //   for (let i = 0; i < state.customers.length; i++) {
    //     if (
    //       state.customers[i].firstName + ' ' + state.customers[i].lastName ==
    //       action.payload.customer.name
    //     ) {
    //       isIn = true;
    //       indexOfCustomer = i;
    //     }
    //   }
    //   createRow(
    //     'Customer',
    //     {
    //       id: 0,
    //       name: action.payload.customer.name,
    //       number: action.payload.customer.number,
    //     },
    //     true
    //   );
    //   return {
    //     ...state,
    //     products: action.payload.data,
    //     type: action.payload.extras.type,
    //     totalDiscount: action.payload.extras.discount,
    //     totalDelivery: action.payload.extras.delivery,
    //     sideOption: '0',
    //     customer: isIn
    //       ? {
    //           name:
    //             state.customers[indexOfCustomer].firstName +
    //             ' ' +
    //             state.customers[indexOfCustomer].lastName,
    //           number: state.customers[indexOfCustomer].phoneNumber,
    //           points:
    //             state.customers[indexOfCustomer].rewardPoints == null
    //               ? 0
    //               : state.customers[indexOfCustomer].rewardPoints,
    //         }
    //       : {
    //           name: action.payload.customer.name,
    //           number: action.payload.customer.number,
    //           points: 0,
    //         },
    //   };

    case cashConstants.SET_NTRANSACTIONS:
      let newUser = state.user;
      newUser.savedTransactions = action.payload;
      AsyncStorage.setItem('user', JSON.stringify(newUser));
      return {
        ...state,
        user: newUser,
      };

    case cashConstants.ADD_CUSTOMER_NAME:
      return {
        ...state,
        customerName: action.payload,
      };

    case cashConstants.EDIT_CUSTOMER_NAME:
      return {
        ...state,
        customerName: action.payload,
      };
    case cashConstants.SET_CUSTOM_ORDER:
      AsyncStorage.setItem('order', action.payload);

      return {
        ...state,
        orderIdCustom: action.payload,
      };
    case cashConstants.SET_CUSTOM_ORDER_PAY:
      AsyncStorage.setItem('orderPay', action.payload);
      //alert(action.payload)
      return {
        ...state,
        orderIdCustomPay: action.payload,
      };
    case cashConstants.FILTER_CUSTOMERS:
      return {
        ...state,
        filteredCustomers: action.payload,
      };
    case cashConstants.HAS_CHANGES:
      return {
        ...state,
        hasChanges: action.payload,
      };
    case cashConstants.SET_PERSONALCONFIG:
      return {
        ...state,
        personalConfig: action.payload,
      };
    case cashConstants.SET_NOTIFICATIONCONFIG:
      return {
        ...state,
        notificationConfig: action.payload,
      };
    case cashConstants.SET_SAVEDTRANSACTIONS:
      return {
        ...state,
        savedTransactions: action.payload,
      };
    case 'SET_PAYMENT':
      return {
        ...state,
        payment: action.payload.payment,
      };
    default:
      return state;
  }
};

export default cashData;
