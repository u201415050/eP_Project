window.CRISP_RUNTIME_CONFIG = {
  lock_maximized: true,
  lock_full_view: true,
};
window.CRISP_WEBSITE_ID = 'af0c6ade-a9f0-471f-9ff5-af209519a512';
window.$crisp = [];

function initialize(token) {
  alert(token);
  window.CRISP_TOKEN_ID = token;

  var _document = document;
  var _script = _document.createElement('script');

  _script.src = 'https://client.crisp.chat/l.js';
  _script.async = 1;
  _document.getElementsByTagName('head')[0].appendChild(_script);
}
