export function handleDiscountTextChange(validate, newText, callback) {
  if (validate === 1) {
    if (
      /^\d{1,2}(\.\d{1,2})?$/.test(newText) ||
      /^\d{1,2}\.?$/.test(newText) ||
      /^\d{1,2}$/.test(newText) ||
      newText=="100"||
      newText == ''
    ) {
      callback();
    }
  } else if (validate === 2) {
    if (
      /^\d{1,6}(\.\d{1,2})?$/.test(newText) ||
      /^\d{1,6}\.?$/.test(newText) ||
      /^\d{1,6}$/.test(newText) ||
      newText == ''
    ) {
      callback();
    }
  } else {
    callback();
  }
};