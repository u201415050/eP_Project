import { connect } from 'react-redux';
import CreateAccount from '../create_account';
import {
  create_account,
  resend_otp,
  verify_otp,
  hide_success_modal,
} from './../actions';

const mapStateToProps = ({ register }) => ({
  register,
});

const mapDispatchToProps = dispatch => ({
  create_account: (userData, handle) => {
    dispatch(create_account(userData, handle));
  },
  verify_otp: (auth_key, otp, type) =>
    dispatch(verify_otp(auth_key, otp, type)),
  resend_otp: (auth_key, type) => dispatch(resend_otp(auth_key, type)),
  hide_success_modal: () => dispatch(hide_success_modal()),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CreateAccount);
