export function setUser() {
  return { type: 'SET_USER', payload: {} };
}
export function setSavedTransactions(savedTransactions) {
  return { type: 'SET_SAVED_TRANSACTIONS', payload: { savedTransactions } };
}
