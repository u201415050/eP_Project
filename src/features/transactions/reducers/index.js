import { cashConstants } from "../constants/actions";
const initialState = {total_amount:(0).toFixed(2),amount:(0).toFixed(2), products:[],type:'%', totalDiscount: (0).toFixed(2), totalDelivery:(0).toFixed(2) ,sideOption: '0'};

//dummy content
const cashData = (state = initialState, action) => {
  
  switch (action.type) {
    case cashConstants.SUM_AMOUNT:
      return {
        ...state,
        amount: ((state.amount*10)+(action.payload/100)).toFixed(2),
        };
    case cashConstants.SUM_TOTAL:
      return {...state,
        total_amount:(parseFloat(state.total_amount)+parseFloat(state.amount)).toFixed(2), 
        products: [...state.products,{
          id:(state.products.length+1),
          name: "Custom product "+(state.products.length+1),
          quant: 1,
          total: state.amount,
          discount: (0).toFixed(2),
          type: "%"
        }] ,
        amount:(0).toFixed(2),};
    case cashConstants.BACK_AMOUNT:
      return {...state,amount: (Math.floor(state.amount*10)/100).toFixed(2) };
    case cashConstants.CLEAR_AMOUNT:
      return {...state,amount: (0).toFixed(2) };
    case cashConstants.CHANGE_OPTION:
      return {...state,sideOption: action.payload };
    case cashConstants.ADD_DISCOUNT:
      return {...state,totalDiscount: parseFloat(action.payload.discount), type: action.payload.type };
    case cashConstants.ADD_DELIVERY:
      return {...state,totalDelivery: parseFloat(action.payload)};
    case cashConstants.REMOVE_DISCOUNT:
      return {...state,totalDiscount: parseFloat(0)};
    case cashConstants.REMOVE_DELIVERY:
      return {...state,totalDelivery: parseFloat(0)};
    default:
        return state
  }
};

export default cashData;
