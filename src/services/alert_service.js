let _alert;

function setTopLevelAlert(alertRef) {
  _alert = alertRef;
}

function showAlert(msg, action, buttonTitle, messageTitle, closeIcon) {
  const actDefault = () => null;
  action = action || actDefault;
  buttonTitle = buttonTitle || 'OK';
  messageTitle = messageTitle || null;
  closeIcon = closeIcon || false;
  _alert.show(msg, action, buttonTitle, messageTitle, closeIcon);
}

// add other navigation functions that you need and export them

export default {
  showAlert,
  setTopLevelAlert,
};
