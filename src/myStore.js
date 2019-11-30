import appReducer from './reducers';
import { createStore, applyMiddleware } from 'redux';
import logger from 'redux-logger';
import thunk from 'redux-thunk';

// import { createReactNavigationReduxMiddleware } from 'react-navigation-redux-helpers';
// Note: createReactNavigationReduxMiddleware must be run before reduxifyNavigator
// const middleware = createReactNavigationReduxMiddleware(
//   "root",
//   state => state.nav,
// );

const store = createStore((state, action) => {
  if (action.type === 'RESET_APP') {
    state = undefined;
  }
  return appReducer(state, action);
}, applyMiddleware(thunk, logger));

export default store;
