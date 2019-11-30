import { dashboardConstants } from '../constants/actions';
const initialState = {
  dataDashboard:null,
};


const dashboardData = (state = initialState, action) => {
  switch (action.type) {
    case dashboardConstants.SET_DASHBOARD_DATA:
      return {
        ...state,
        dataDashboard:action.payload,
      };
    default:
      return state;
  }
};

export default dashboardData;
