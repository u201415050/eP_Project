export function setOrder(order) {
  return { type: 'SET_ORDER', payload: { order } };
}
export function setPayment(payment) {
  return { type: 'SET_PAYMENT', payload: { payment } };
}
export function clearPayment() {
  return { type: 'CLEAR_PAYMENT', payload: {} };
}
