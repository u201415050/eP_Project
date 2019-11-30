import { userConstants } from 'api/auth/constants';
import loading_service from '../../../services/loading_service';
let initialState = {};

const authData = (state = initialState, action) => {
  initialState = state;
  switch (action.type) {
    case userConstants.REGISTER_REQUEST:
      return {
        //loading: true,
        ...action.payload,
      };
    case userConstants.REGISTER_SUCCESS:
      console.log('AQUIIIIII');
      //loading_service.hideLoading();
      return {
        ...state,
        ...action.payload,
        show_otp: true,
        loading: false,
        otp_valid: false,
        otp_invalid: false,
      };
    case userConstants.REGISTER_FAILURE:
      return {
        show_alert: true,
        errors: [action.error],
      };

    // VERIFY OTP
    case userConstants.OTP_VERIFY_REQUEST:
      return {
        ...state,
        ...action.payload,
        loading: true,
        show_otp: true,
      };
    case userConstants.OTP_VERIFY_SUCCESS:
      return {
        ...state,
        ...action.payload,
        show_otp: false,
        loading: false,
      };
    case userConstants.OTP_VERIFY_FAILURE:
      return {
        ...state,
        ...action.payload,
        show_otp: true,
        loading: false,
      };
    case userConstants.HIDE_ALERTS_REQUEST:
      return {
        ...state,
        ...action.payload,
        show_otp: false,
        loading: false,
        otp_valid: false,
        otp_invalid: false,
        show_alert: false,
      };
    default:
      return state;
  }
};

export default authData;
