import { cashConstants } from '../constants/actions';

export const cashActions = {
  sum_amount,
  sum_total,
  back_amount,
  clear_amount,
  change_option,
  add_discount,
  add_delivery,
  verify_customer,
  remove_delivery,
  remove_discount,
  edit_product,
  delete_product,
  add_customer,
  add_customer_name,
  edit_customer_name,
  get_customer_name,
  get_data,
  clear_data,
  clear_customer,
  set_items,
  set_cashreaders,
  select_cashreaders,
  set_printers,
  select_printers,
  set_cashdrawers,
  select_cashdrawers,
  set_wallet,
  set_user,
  set_products,
  set_ntransactions,
  set_custom_order,
  set_custom_order_pay,
  filter_customers,
  has_changes,
  set_personalconfig,
  set_notificationconfig,
  set_savedTransactions,
  setPayment,
  set_userpermi,
};

function add_customer_name(value) {
  return { type: cashConstants.ADD_CUSTOMER_NAME, payload: value };
}
function edit_customer_name(value) {
  return { type: cashConstants.EDIT_CUSTOMER_NAME, payload: value };
}
function get_customer_name(value) {
  return { type: cashConstants.GET_CUSTOMER_NAME, payload: value };
}

function sum_amount(value) {
  return { type: cashConstants.SUM_AMOUNT, payload: value };
}

function sum_total(amount) {
  return {
    type: cashConstants.SUM_TOTAL,
    payload: {
      amount,
    },
  };
}

function back_amount() {
  return { type: cashConstants.BACK_AMOUNT };
}

function clear_amount() {
  return { type: cashConstants.CLEAR_AMOUNT };
}

function change_option(value) {
  return { type: cashConstants.CHANGE_OPTION, payload: value };
}

function add_discount(value) {
  return { type: cashConstants.ADD_DISCOUNT, payload: value };
}

function add_delivery(value) {
  return { type: cashConstants.ADD_DELIVERY, payload: value };
}
function add_customer(value) {
  return { type: cashConstants.ADD_CUSTOMER, payload: value };
}
function verify_customer(value) {
  return { type: cashConstants.OTP_CUSTOMER_REQUEST, payload: value };
}
function remove_discount() {
  return { type: cashConstants.REMOVE_DISCOUNT };
}
function remove_delivery() {
  return { type: cashConstants.REMOVE_DELIVERY };
}

function edit_product(product) {
  return { type: cashConstants.EDIT_PRODUCT, payload: product };
}
function delete_product(product) {
  return { type: cashConstants.DELETE_PRODUCT, payload: product };
}

function get_data(data) {
  return { type: cashConstants.GET_DATA, payload: data };
}

function clear_data() {
  return { type: cashConstants.CLEAR_DATA };
}
function clear_customer() {
  return { type: cashConstants.CLEAR_CUSTOMER };
}
function set_items(data) {
  return { type: cashConstants.SET_ITEMS, payload: data };
}
function set_cashreaders(data) {
  return { type: cashConstants.SET_CASHREADERS, payload: data };
}
function select_cashreaders(data) {
  return { type: cashConstants.SELECT_CASHREADERS, payload: data };
}
function set_printers(data) {
  return { type: cashConstants.SET_PRINTERS, payload: data };
}
function select_printers(data) {
  return { type: cashConstants.SELECT_PRINTERS, payload: data };
}
function set_cashdrawers(data) {
  return { type: cashConstants.SET_CASHDRAWERS, payload: data };
}
function select_cashdrawers(data) {
  return { type: cashConstants.SELECT_CASHDRAWERS, payload: data };
}
function set_wallet(data) {
  return { type: cashConstants.SET_WALLET, payload: data };
}
function set_user(data) {
  return { type: cashConstants.SET_USER, payload: data };
}
function set_products(data) {
  return { type: cashConstants.SET_PRODUCTS, payload: data };
}
function set_ntransactions(data) {
  return { type: cashConstants.SET_NTRANSACTIONS, payload: data };
}
function set_custom_order(data) {
  return { type: cashConstants.SET_CUSTOM_ORDER, payload: data };
}
function set_custom_order_pay(data) {
  return { type: cashConstants.SET_CUSTOM_ORDER_PAY, payload: data };
}
function filter_customers(data) {
  return { type: cashConstants.FILTER_CUSTOMERS, payload: data };
}
function has_changes(data) {
  return { type: cashConstants.HAS_CHANGES, payload: data };
}
function set_personalconfig(data) {
  return { type: cashConstants.SET_PERSONALCONFIG, payload: data };
}
function set_notificationconfig(data) {
  return { type: cashConstants.SET_NOTIFICATIONCONFIG, payload: data };
}
function set_savedTransactions(data) {
  return { type: cashConstants.SET_SAVEDTRANSACTIONS, payload: data };
}
function setPayment(payment) {
  return { type: 'SET_PAYMENT', payload: { payment } };
}
function set_userpermi(value) {
  return { type: cashConstants.SET_USERPERMI, payload: value };
}
