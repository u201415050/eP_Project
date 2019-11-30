import realm from '../../../services/realm_service';
const user = realm.objectForPrimaryKey('User', 0);
const initialState = {
  user: user || {},
  authenticated: !!user,
};
console.log({ initialState });
//dummy content
const user_reducers = (state = initialState, action) => {
  switch (action.type) {
    case 'SET_USER':
      return {
        ...state,
        user: realm.objectForPrimaryKey('User', 0),
      };
    case 'SET_SAVED_TRANSACTIONS':
      state.user.updateSavedTransactions(action.payload.savedTransactions);
      return {
        ...state,
        ...action.payload,
      };
    default:
      return state;
  }
};

export default user_reducers;
