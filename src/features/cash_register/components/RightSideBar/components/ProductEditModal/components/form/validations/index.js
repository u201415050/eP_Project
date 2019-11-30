export function handleNumberTextChange(validate, newText, callback) {
  if (validate === 'quantity') {
    if (
      /^\d{1,3}(\.\d{1,3})?$/.test(newText) ||
      /^\d{1,3}\.?$/.test(newText) ||
      /^\d{1,3}$/.test(newText) ||
      newText == ''
    ) {
      callback();
    }
  } else if (validate === 'unitPrice') {
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



export function handleDiscountTextChange(validate, newText, callback) {
  if (validate === '%') {
    if (
      /^\d{1,2}(\.\d{1,2})?$/.test(newText) ||
      /^\d{1,2}\.?$/.test(newText) ||
      /^\d{1,2}$/.test(newText) ||
      newText == ''
    ) {
      callback();
    }
  } else {
    if (
      /^\d{1,6}(\.\d{1,2})?$/.test(newText) ||
      /^\d{1,6}\.?$/.test(newText) ||
      /^\d{1,6}$/.test(newText) ||
      newText == ''
    ) {
      callback();
    }
  }
};