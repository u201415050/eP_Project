import {ADD_PRODUCT_TO_CART} from '../constants/action_types';
import {LIST_PRODUCTS} from '../constants/action_types';
import {EDIT_PRODUCT} from '../constants/action_types';
//import {DELETE_PRODUCT} from '../constants/action_types';

export function addProductAction(product) {
    return {type: ADD_PRODUCT_TO_CART,
            payload: product
            }
}

export function listProductsAction() {
    return { type: LIST_PRODUCTS }
}

export function editProductAction(product){
    return { 
        type: EDIT_PRODUCT,
        payload: product
    }
}

/*export function deleteProductAction(product){
    return { 
        type: DELETE_PRODUCT,
        payload: product
    }
}*/