const password_validations = [
  {
    name: '8 Characters',
    validateInput: val => {
      return val.length > 7;
    },
  },
  {
    name: '1 Number',
    validateInput: val => {
      return /\d/.test(val);
    },
  },
  {
    name: '1 Special Character',
    validateInput: val => {
      return /\W+/.test(val);
    },
  },
];
export default password_validations;
