export function handleAmountTextChange(newText, callback) {
  if (
    /^\d{1,6}(\.\d{1,2})?$/.test(newText) ||
    /^\d{1,6}\.?$/.test(newText) ||
    /^\d{1,6}$/.test(newText) ||
    newText == ''
  ) {
    callback();
  }
};