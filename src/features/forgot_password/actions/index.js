import { userConstants } from 'api/auth/constants';
import * as userService from '../../../services/user_service';
import NavigationService from './../../../services/navigation';
import { LOGIN } from './../../../navigation/screen_names';
import alert_service from 'services/alert_service';

export function check_email(email) {
  return async dispatch => {
    dispatch(request());
    const res = {
      email: {},
    };
    try {
      res.email = await userService.check_email(email);

      if (res.email.exists) {
        dispatch(sendOpt(res));
        userService.opt_send(email, 'email').then(res => {
          if (res.success) {
            dispatch(
              sendOptSuccess({
                alert: [
                  'Check your registered email with',
                  'instructions to reset your password',
                ],
                dismissAlert: () => {
                  dispatch(dismissAlert());
                  NavigationService.navigate(LOGIN);
                },
              })
            );
          }
        });
      } else {
        console.log('me', res);
        dispatch(failureCheck(res));
      }
    } catch (err) {
      res.email.errors = ['Network error, try again!'];
      dispatch(failureCheck(res));
    }
  };

  function request() {
    return { type: userConstants.CHECK_EMAIL_REQUEST };
  }

  function failureCheck(payload) {
    return { type: userConstants.CHECK_EMAIL_FAILURE, payload };
  }
  function sendOpt(payload) {
    return { type: userConstants.OTP_EMAIL_REQUEST, payload };
  }
  function sendOptSuccess(payload) {
    return { type: userConstants.OTP_EMAIL_SUCCESS, payload };
  }
  function dismissAlert() {
    return { type: userConstants.OTP_EMAIL_ALERT_DISMISS };
  }
}

export function check_mobile(mobile) {
  return async dispatch => {
    dispatch(request());
    const res = {
      mobile: {},
    };
    try {
      res.mobile = await userService.check_mobile(mobile);
      console.log(res);
      if (res.mobile.exists) {
        dispatch(sendOpt(res));
        userService.opt_send(mobile, 'mobile').then(res => {
          console.log(res);
          if (res.success) {
            dispatch(sendOptSuccess({ mobile_number: mobile, show_otp: true }));
          } else {
            dispatch(sendOptFailure(res));
            dispatch(
              failureCheck({
                mobile: { errors: ['Enter a valid mobile number'] },
              })
            );
            // alert_service.showAlert(res.message);
          }
        });
      } else {
        dispatch(failureCheck(res));
      }
    } catch (err) {
      res.mobile.errors = ['Network error, try again!'];
      dispatch(failureCheck(res));
    }
  };

  function request() {
    return { type: userConstants.CHECK_MOBILE_REQUEST };
  }
  function failureCheck(payload) {
    return { type: userConstants.CHECK_MOBILE_FAILURE, payload };
  }
  function sendOpt(payload) {
    return { type: userConstants.OTP_MOBILE_REQUEST, payload };
  }
  function sendOptSuccess(payload) {
    return { type: userConstants.OTP_MOBILE_SUCCESS, payload };
  }
  function sendOptFailure(payload) {
    return { type: userConstants.OTP_MOBILE_FAILURE, payload };
  }
}
