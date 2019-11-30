import { customersConstants } from '../constants/actions';

export const cashActions = {
  filter_customers,
};

function filter_customers(data){
  return { type: cashConstants.FILTER_CUSTOMERS, payload: data };
}