import realm from '../../../services/realm_service';

const initialState = {
  order: generateOrder(),
};
// console.log(realm.objects('Settings').length);
//dummy content
const payment_reducers = (state = initialState, action) => {
  let order;
  switch (action.type) {
    case 'RESET_APP':
      return initialState;
    case 'SET_PAYMENT':
      return {
        ...state,
        payment: action.payload.payment,
      };
    case 'SET_ORDER':
      if (action.payload.order) {
        order = action.payload.order;
      }
      return {
        ...state,
        order: generateOrder(order),
      };
    case 'CLEAR_PAYMENT':
      return {
        ...state,
        payment: {},
      };
    default:
      return state;
  }
};

export default payment_reducers;

function generateOrder(origin) {
  const user = realm.objectForPrimaryKey('User', 0);
  if (!user) {
    return {};
  }
  const orderId = `currentOrder_${user.userId}`.toString();
  let order = realm.objectForPrimaryKey('Order', orderId);
  if (!order || origin) {
    realm.write(() => {
      let data;
      if (origin) {
        data = {
          id: orderId,
          deliveryCharges: origin.deliveryCharges,
          generalDiscount: origin.generalDiscount,
          totalDiscount: origin.totalDiscount,
          customItems: origin.customItems,
          generalDiscountType: origin.generalDiscountType,
          roundOffAmount: origin.roundOffAmount,
          salesreturnstatus: origin.salesreturnstatus,
          serviceCharges: origin.serviceCharges,
          totalTax: origin.totalTax,
          subTotal: origin.subTotal,
          savedOrderId: origin.savedOrderId,
          calculatedDiscount: origin.calculatedDiscount,
          totalPrice: origin.totalPrice,
        };
        if (origin.customer) {
          data.customer = origin.customer;
        }
      } else {
        data = {
          id: orderId,
          deliveryCharges: 0,
          generalDiscount: 0,
          totalDiscount: 0,
          customItems: [],
          generalDiscountType: '%',
          roundOffAmount: 0,
          salesreturnstatus: 0,
          serviceCharges: 0,
          totalTax: 0,
          subTotal: 0,
          calculatedDiscount: 0,
          totalPrice: 0,
        };
      }
      order = realm.create('Order', data, true);
    });
  }
  if (!origin) {
    order.update();
  }
  return order;
}
