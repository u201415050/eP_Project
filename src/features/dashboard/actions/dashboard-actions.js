import { dashboardConstants } from '../constants/actions';

export const dashboardActions = {
  set_dashboard_data
};

function set_dashboard_data(value) {
  return { type: dashboardConstants.SET_DASHBOARD_DATA, payload: value };
}
