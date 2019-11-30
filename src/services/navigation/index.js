import { NavigationActions, StackActions } from 'react-navigation';
import { EventEmitter } from 'events';

let _navigator;

let navigationState = {};
class NavigationHistory extends EventEmitter {
  constructor() {
    super();
    this.lastScreen = 0;
    this.currentScreenName = '';
  }
  setLastScreen(screen) {
    this.lastScreen = screen;
  }
  setCurrentScreenName(screenName) {
    this.currentScreenName = screenName;
  }

  navigationListener(action) {
    if (action.type === 'Navigation/DRAWER_CLOSED') {
      this.emit('DRAWER_CLOSED');
    }
  }
}
const history = new NavigationHistory();
function setTopLevelNavigator(navigatorRef) {
  _navigator = navigatorRef;
}

function getActiveRouteName(navigationState) {
  if (!navigationState) {
    return null;
  }
  const route = navigationState.routes[navigationState.index];
  // dive into nested navigators
  if (route.routes) {
    return getActiveRouteName(route);
  }
  return route.routeName;
}

function navigate(routeName, params, i) {
  if (i) {
    i();
  }
  _navigator.dispatch(
    NavigationActions.navigate({
      routeName,
      params,
    })
  );
}

function dispatch(action) {
  _navigator.dispatch(action);
}

function setNavigationState(prevState, currentState, action) {
  // alert(JSON.stringify(DrawerActions.CLOSE_DRAWER));

  const currentScreen = getActiveRouteName(currentState);
  const prevScreen = getActiveRouteName(prevState);

  if (prevScreen !== currentScreen) {
    // the line below uses the Google Analytics tracker
    // change the tracker here to use other Mobile analytics SDK.
    history.setCurrentScreenName(currentScreen);
  }
}

function goToInvoice(routeName, params) {
  const resetAction = StackActions.reset({
    index: 1,
    actions: [
      NavigationActions.navigate({ routeName: 'CashRegister' }),
      NavigationActions.navigate({
        routeName,
        params,
      }),
    ],
  });
  return dispatch(resetAction);
}

function backToSplit() {
  const resetAction = StackActions.reset({
    index: 1,
    actions: [
      NavigationActions.navigate({ routeName: 'CashRegister' }),
      NavigationActions.navigate({
        routeName: 'PaymentsCheckout',
        params: { split: true },
      }),
    ],
  });
  return dispatch(resetAction);
}

function reset(routeName, params) {
  const resetAction = StackActions.reset({
    index: 0,
    actions: [NavigationActions.navigate({ routeName, params })],
  });
  return dispatch(resetAction);
}

function getNavigationState() {
  return navigationState;
}

// add other navigation functions that you need and export them

export default {
  setNavigationState,
  getNavigationState,
  navigate,
  goToInvoice,
  backToSplit,
  reset,
  history,
  setTopLevelNavigator,
};
