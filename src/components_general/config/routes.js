import SliderScreen from '../../screens/SliderScreen';
import MainView from '../../screens/MainView';
import CashScreen from '../../screens/CashScreen';
import SettingScreen from '../../screens/SettingsScreen';
import CardPaymentScreen from '../../screens/CardPaymentScreen';
import LoginScreen from '../../screens/LoginScreen';
import CreateAccountScreen from '../../screens/CreateAccountScreen';
import ForgotScreen from '../../screens/ForgotPassword';

const Routes = {
    Login: {
      screen: LoginScreen,
      navigationOptions: { tabBarVisible:false,header:null}
    },
    ForgotScreen: {
      screen: ForgotScreen,
      navigationOptions: { tabBarVisible:false,header:null}
    },
    CreateAccount: {
      screen: CreateAccountScreen,
      navigationOptions: { tabBarVisible:false,header:null}
    },
    Slider: {
      screen: SliderScreen,
      navigationOptions: { tabBarVisible:false,header:null}
    },
    Cash: {
      screen: CashScreen,
      navigationOptions: { tabBarVisible:false,header:null}
    },
    Settings: {
      screen: SettingScreen,
      navigationOptions: { tabBarVisible:false,header:null}
    },
    CardPayment: {
      screen: CardPaymentScreen,
      navigationOptions: { tabBarVisible:false,header:null}
    },

}

export default Routes;