let _loading;

function setTopLevelLoading(loadingRef) {
  _loading = loadingRef;
}

function showLoading() {
  _loading.show();
}

function hideLoading() {
  _loading.hide();
}

// add other navigation functions that you need and export them

export default {
  showLoading,
  hideLoading,
  setTopLevelLoading,
};
