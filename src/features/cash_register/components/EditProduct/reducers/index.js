import { ADD_PRODUCT_TO_CART } from '../constants/action_types';
import { EDIT_PRODUCT } from '../constants/action_types';
import { LIST_PRODUCTS } from '../constants/action_types';
import { DELETE_PRODUCT } from '../constants/action_types';

let initialState = {
  totalSale: 0.0,
  products: [],
};

function productsReducer(state = initialState, action) {
  initialState = state;

  switch (action.type) {
    case ADD_PRODUCT_TO_CART:
      var totalSale = (
        parseFloat(state.total_amount) + parseFloat(state.amount)
      ).toFixed(2);

      var newId = state.products.length;
      let product = {
        id: newId,
        name: 'Custom product ' + (newId + 1),
        quantity: 1,
        unitPrice: action.payload.amount,
        discountType: '%',
        discountAmount: (0).toFixed(2),
        image: '',
        subtotal: action.payload.amount,
      };

      return {
        ...state,
        total_amount: totalSale,
        products: state.products.concat(product),
      };

    case EDIT_PRODUCT:
      return {
        ...state,
        products: state.products.map(product =>
          product.id === action.payload.id ? action.payload : product
        ),
      };

    case LIST_PRODUCTS:
      return {
        ...state,
      };

    case DELETE_PRODUCT:
      return {
        ...state,
        products: state.products.filter(
          product => product.id !== action.payload.id
        ),
      };

    default:
      return state;
  }
}

export default productsReducer;
