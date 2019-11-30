import { userConstants } from './../.././../api/auth/constants';

let initialState = {
  email: {
    errors: [],
  },
  mobile: {
    errors: [],
  },
};

const resetPass = (state = initialState, action) => {
  initialState = state;
  switch (action.type) {
    case userConstants.CHECK_EMAIL_REQUEST:
      return {
        ...state,
        loading: true,
      };

    case userConstants.CHECK_EMAIL_SUCCESS:
      return {
        ...state,
        ...action.payload,
        loading: false,
      };
    case userConstants.CHECK_EMAIL_FAILURE:
      return {
        ...state,
        ...action.payload,
        loading: false,
      };
    case userConstants.CHECK_MOBILE_REQUEST:
      return {
        ...state,
        loading: true,
      };
    case userConstants.CHECK_MOBILE_FAILURE:
      return {
        ...state,
        ...action.payload,
        loading: false,
      };
    case userConstants.OTP_MOBILE_REQUEST:
      return {
        ...state,
        loading: true,
        otp_invalid: false,
        otp_valid: false,
        auth_key: false,
      };
    case userConstants.OTP_MOBILE_SUCCESS:
      return {
        ...state,
        ...action.payload,
        loading: false,
      };
    case userConstants.OTP_MOBILE_FAILURE:
      return {
        ...state,
        ...action.payload,
        loading: false,
      };
    case userConstants.OTP_EMAIL_REQUEST:
      return {
        loading: true,
        ...state,
      };
    case userConstants.OTP_EMAIL_SUCCESS:
      return {
        ...state,
        ...action.payload,
        loading: false,
      };
    case userConstants.OTP_EMAIL_ALERT_DISMISS:
      return () => {
        const { alert, alertDismiss, ...newState } = state;
        return newState;
      };

    case userConstants.OTP_DISMISS_REQUEST:
      return () => {
        const { show_otp, ...newState } = state;
        return newState;
      };

    // OTP VALIDATION
    case userConstants.OTP_VALIDATION_REQUEST:
      return {
        ...state,
        loading: true,
      };
    case userConstants.OTP_VALIDATION_SUCCESS:
      return {
        ...state,
        ...action.payload,
        otp_invalid: false,
        otp_valid: true,
        loading: false,
      };
    case userConstants.OTP_VALIDATION_FAILURE:
      return {
        ...state,
        ...action.payload,
        otp_valid: false,
        loading: false,
      };
    case userConstants.OTP_MOBILE_CLEAN_ERROR:
      return {
        ...state,
        otp_invalid: false,
      };

    // RESET PASSWORD
    case userConstants.RESET_PASSWORD_REQUEST:
      return {
        ...state,
        loading: true,
      };
    case userConstants.RESET_PASSWORD_SUCCESS:
      return {
        ...state,
        ...action.payload,
        loading: false,
      };
    case userConstants.RESET_PASSWORD_FAILURE:
      return {
        ...state,
        ...action.payload,
        loading: false,
      };

    case userConstants.RESET_PASSWORD_ALERT_DISMISS:
      //let { alert, alertDismiss, ...newState } = state;
      return { ...state, alert: [], alertDismiss: () => null };
    case userConstants.RESET_PASSWORD_ALERT_DISMISS_SUCCESS:
      //let { alert, alertDismiss, ...newState } = state;
      return { ...state, show_otp: false, alert: [] };

    default:
      return state;
  }
};

export default resetPass;
