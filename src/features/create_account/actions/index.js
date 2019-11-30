import { userConstants } from 'api/auth/constants';
import * as userService from '../../../services/user_service';
import { Alert } from 'react-native';
// import NavigationService from './../../../services/navigation';
// import { APP } from './../../../navigation/screen_names';

export function create_account(userData, handle) {
  return dispatch => {
    dispatch(requestRegister());

    userService
      .create_account(userData)
      .then(res => {
        const { success } = res;
        // alert(JSON.stringify(res))
        if (success) {
          // const {success, ...user} = res;
          //alert(JSON.stringify(userData))
          console.log(res);
          if (handle) handle();
          dispatch(
            successRegister({
              mobile_number: userData.UserMobileNumber,
              auth_key: res.auth_key ? res.auth_key : res.response.auth_key,
              email: res.username ? res.username : res.response.username,
              otpType: userData.otpType,
            })
          );
          // NavigationService.navigate(APP)
        } else {
          const { message } = res;
          if (res.hasOwnProperty('messageDetails')) {
            if (res.messageDetails.hasOwnProperty('userMobileNumber')) {
              dispatch(failureRegister(res.messageDetails.userMobileNumber));
            } else {
              dispatch(failureRegister(message));
            }
          } else {
            dispatch(failureRegister(message));
          }
        }
      })
      .catch(err => {
        console.log(err);
        dispatch(failureRegister('Network error, try again!'));
      });
  };

  function requestRegister() {
    return { type: userConstants.REGISTER_REQUEST };
  }
  function successRegister(payload) {
    return { type: userConstants.REGISTER_SUCCESS, payload };
  }
  function failureRegister(error) {
    return { type: userConstants.REGISTER_FAILURE, error };
  }
}

export const verify_otp = (auth_key, otp, type) => {
  const requestVerify = () => ({ type: userConstants.OTP_VERIFY_REQUEST });
  const successVerify = payload => ({
    type: userConstants.OTP_VERIFY_SUCCESS,
    payload,
  });
  const failureVerify = payload => ({
    type: userConstants.OTP_VERIFY_FAILURE,
    payload,
  });

  return dispatch => {
    dispatch(requestVerify());

    userService
      .verify_otp(auth_key, otp, type)
      .then(res => {
        if (res.success) {
          dispatch(
            successVerify({
              showAccountCreatedModal: true,
            })
          );
        } else {
          dispatch(failureVerify({ otp_invalid: true }));
        }
      })
      .catch(err => {
        console.log(err);
      });
  };
};

export const hide_success_modal = () => {
  const request = payload => ({
    type: userConstants.HIDE_ALERTS_REQUEST,
    payload,
  });
  return dispatch => {
    dispatch(
      request({
        showAccountCreatedModal: false,
        show_otp: false,
      })
    );
  };
};

export const resend_otp = (auth_key, type) => {
  const requestResend = () => ({
    type: userConstants.RESEND_REGISTER_OTP_REQUEST,
  });
  //   const successResend = payload => ({
  //     type: userConstants.RESEND_REGISTER_OTP_SUCCESS,
  //     payload,
  //   });
  //   const failureResend = payload => ({
  //     type: userConstants.RESEND_REGISTER_OTP_FAILURE,
  //     payload,
  //   });

  return dispatch => {
    dispatch(requestResend());

    userService
      .resend_register_otp(auth_key, type)
      .then(res => {})
      .catch(err => {
        console.log(err);
      });
  };
};
