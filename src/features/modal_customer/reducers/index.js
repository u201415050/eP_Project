import { customersConstants } from '../constants/actions';

const initialState = {
  filteredCustomers: [],
};

//dummy content
const customersData = (state = initialState, action) => {
  switch (action.type) {
    case customersConstants.FILTER_CUSTOMERS:
      return {
        ...state,
        filteredCustomers: action.payload
      };
    default:
      return state;
  }
};

export default customersData;