import alert_double_service from '../../../services/alert_double_service';

export default (currentState, action) => {
  alert_double_service.showAlertDouble(
    'Confirm',
    `Are you sure you want to ${
      currentState ? 'disable' : 'enable'
    } this setting?`,
    action
  );
};
