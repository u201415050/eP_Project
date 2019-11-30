import * as userService from 'services/user_service';
import { AsyncStorage } from 'react-native';
import NavigationService from 'services/navigation';
import { CASH_REGISTER } from 'navigation/screen_names';
import { MAIN_MENU } from 'navigation/screen_names';

export const register_fingerprint = (user_id, token, auth_key) => {
  const requestRegister = () => ({ type: 'REQUEST_REGISTER_FINGERPRINT' });
  return dispatch => {
    dispatch(requestRegister());
    userService
      .register_fingerprint_token(user_id, token, auth_key)
      .then(res => {
        console.log(res);
        // NavigationService.navigate(CASH_REGISTER);
        NavigationService.navigate(MAIN_MENU);
        AsyncStorage.getItem('@UsersLogged:Fingerprint').then(item => {
          const users = JSON.parse(item);
          let exists;
          if (Array.isArray(users)) {
            exists = users.find(user => user === user_id);
          }
          AsyncStorage.setItem(
            `@UsersLogged:Fingerprint`,
            JSON.stringify(exists ? [...users, user_id] : [user_id])
          );
        });
      });
  };
};
