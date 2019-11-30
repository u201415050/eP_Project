import { connect } from 'react-redux';
import ForgotPassword from '../forgot_password';
import { check_email, check_mobile } from './../actions';

const mapStateToProps = state => ({
  reset_password: state.reset_password,
});

const mapDispatchToProps = dispatch => ({
  check_email: email => {
    dispatch(check_email(email));
  },
  check_mobile: mobile => {
    dispatch(check_mobile(mobile));
  },
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ForgotPassword);
