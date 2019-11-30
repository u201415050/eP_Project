let _alert;

function setTopLevelAlertDouble(alertRef) {
  _alert = alertRef;
}

function showAlertDouble(title, message, firstAction, secondAction,titleConfirm, titleCancel) {
  _alert.show(title, message, firstAction, secondAction,titleConfirm, titleCancel);
}
function hideDoubleAlert() {
  _alert.hide();
}
// add other navigation functions that you need and export them

export default {
  showAlertDouble,
  setTopLevelAlertDouble,
  hideDoubleAlert,
};
