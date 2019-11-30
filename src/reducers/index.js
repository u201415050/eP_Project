import { combineReducers } from 'redux';
import login from '../features/login/reducers';
import register from '../features/create_account/reducers';
import cashData from '../features/cash_register/reducers';
import reset_password from '../features/forgot_password/reducers';
import payment_data from '../features/payments/reducers/payment_reducers';
import dashboard from '../features/dashboard/reducers';
import auth from '../features/auth/reducers/auth_reducer';
//import productsReducer from "../features/cash_register/components/EditProduct/reducers";
export default combineReducers({
  login,
  register,
  cashData,
  reset_password,
  payment_data,
  dashboard,
  auth,
  //productsReducer
});
