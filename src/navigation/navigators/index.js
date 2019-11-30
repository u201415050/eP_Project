import * as screenNames from '../screen_names';
import {
  createStackNavigator,
  createAppContainer,
  createSwitchNavigator,
  createDrawerNavigator,
  DrawerActions,
  NavigationActions,
  StackActions,
} from 'react-navigation';
import { Dimensions, Animated, Easing } from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { isTablet } from '../../features/modal_customer/constants/isLandscape';

// // SCREENS
import LoginContainer from '../../features/login/containers/loginContainer';
import CreateAccount from '../../features/create_account/containers/create_account_container';
import ForgotPassword from '../../features/forgot_password/containers/';
import AuthLoading from '../../features/auth_loading';
import CashRegister from '../../features/cash_register/cashScreen';
import Fingerprint from '../../features/fingerprint/fingerprint';
import AccountCreated from '../../features/account_created/account_created';
import SideBar from './../../features/left_sidebar/sideBar';
import RightSideBar from '../../features/cash_register/components/RightSideBar/rightSideBar';
import SavedTransactions from '../../features/saved_transactions/saved_transactions';
import SettingsList from '../../features/settings/screens/settings_list/settings_list';
import SettingsTransactions from '../../features/settings/screens/settings_transactions/settings_transactions';
import PaymentsCheckout from '../../features/payments/screens/checkout/checkout';
import PaymentsCash from '../../features/payments/screens/cash/cash';
import PaymentsCard from '../../features/payments/screens/card/card';
import PaymentsWallet from '../../features/payments/screens/wallet/wallet';
import PaymentsUpiQr from '../../features/payments/screens/upi_qr/upi_qr';
import PaymentsUpi from '../../features/payments/screens/upi/upi';
import PaymentsCheque from '../../features/payments/screens/cheque/cheque';
import Invoice from '../../features/invoice/invoice';
import InvoiceCash from '../../features/invoice/invoice_cash';
import SettingsHardware from '../../features/settings/screens/settings_hardware/settings_hardware';
import SettingsDevice from '../../features/settings/screens/settings_device/settings_device';
import SettingsPayments from '../../features/settings/screens/settings_payments/settings_payments';
import SettingsPrinter from '../../features/settings/screens/settings_printers/settings_printers';
import SettingsCardReaders from '../../features/settings/screens/settings_card_readers/settings_card_readers';
import TransactionsHistory from '../../features/transactions/transactionScreen';
import NotificationsHome from '../../features/notifications/screens/notifications_home/notifications_home';
import HelpHome from '../../features/help/screens/help_home/help_home';
import HelpSupport from '../../features/help/screens/help_support/help_support';
import SettingsCashDrawers from '../../features/settings/screens/settings_cash_drawers/settings_cash_drawers';
import CustomerList from '../../features/customers/index';
import PersonalDetails from '../../features/customers/screens/index';
import HelpLearnMore from '../../features/help/screens/help_learn_more/help_learn_more';
import MyAccountList from '../../features/my_account/screens/my_account_list/my_account_list';
import MyAccountPersonal from '../../features/my_account/screens/my_account_personal/my_account_personal';
import MyAccountBusiness from '../../features/my_account/screens/my_account_business/my_account_business';
import MyAccountNotifications from '../../features/my_account/screens/my_account_notifications/my_account_notifications';
import MyAccountReports from '../../features/my_account/screens/my_account_reports/my_account_reports';
import MyAccountPassword from '../../features/my_account/screens/my_account_password/my_account_password';
import HelpLiveChat from '../../features/help/screens/help_live_chat/help_live_chat';
import DashboardTopSelling from '../../features/dashboard/screens/dashboard_topselling';
import DashboardTotalSales from '../../features/dashboard/screens/dashboard_totalsales';
import MainMenu from '../../features/main_menu/index';

const sideTransition = {
  transitionSpec: {
    duration: 750,
    easing: Easing.out(Easing.poly(4)),
    timing: Animated.timing,
    useNativeDriver: true,
  },
  screenInterpolator: sceneProps => {
    const { layout, position, scene } = sceneProps;

    const thisSceneIndex = scene.index;
    const width = layout.initWidth;

    const translateX = position.interpolate({
      inputRange: [thisSceneIndex - 1, thisSceneIndex],
      outputRange: [width, 0],
    });

    return { transform: [{ translateX }] };
  },
};
const AuthStack = createStackNavigator(
  {
    [screenNames.LOGIN]: {
      screen: LoginContainer,
    },
    // [screenNames.MAIN_MENU]: {
    //   screen: MainMenu,
    //   navigationOptions: {
    //     header: null // Will hide header for this screen
    //   }
    // },
    [screenNames.CREATE_ACCOUNT]: {
      screen: CreateAccount,
    },
    [screenNames.FORGOT_PASSWORD]: {
      screen: ForgotPassword,
    },
    [screenNames.ACCOUNT_CREATED]: {
      screen: AccountCreated,
    },
    LearnMore: {
      screen: HelpLearnMore,
    },
  },
  {
    initialRouteName: screenNames.LOGIN,
    // initialRouteName: screenNames.MAIN_MENU,
  }
);
// const PaymentsStack = createStackNavigator({

// });
const AppStack = createStackNavigator(
  {
    [screenNames.CASH_REGISTER]: {
      screen: CashRegister,
    },
    [screenNames.FINGERPRINT]: {
      screen: Fingerprint,
    },
    [screenNames.MAIN_MENU]: {
      screen: MainMenu,
      navigationOptions: {
        header: null, // Will hide header for this screen
      },
    },
    [screenNames.SAVED_TRANSACTIONS]: {
      screen: SavedTransactions,
    },
    [screenNames.PAYMENTS_CHECKOUT]: {
      screen: PaymentsCheckout,
    },
    [screenNames.PAYMENTS_CASH]: {
      screen: PaymentsCash,
    },
    [screenNames.PAYMENTS_CARD]: {
      screen: PaymentsCard,
    },
    [screenNames.PAYMENTS_UPI_QR]: {
      screen: PaymentsUpiQr,
    },
    [screenNames.PAYMENTS_UPI]: {
      screen: PaymentsUpi,
    },
    [screenNames.PAYMENTS_CHEQUE]: {
      screen: PaymentsCheque,
    },
    [screenNames.PAYMENTS_WALLET]: {
      screen: PaymentsWallet,
    },
    [screenNames.INVOICE]: {
      screen: Invoice,
    },
    InvoiceCash: {
      screen: InvoiceCash,
    },
    [screenNames.TRANSACTIONS_HISTORY]: {
      screen: TransactionsHistory,
    },
    [screenNames.HELP_HOME]: {
      screen: HelpHome,
    },
    [screenNames.HELP_SUPPORT]: {
      screen: HelpSupport,
    },
    [screenNames.HELP_LEARN_MORE]: {
      screen: HelpLearnMore,
    },
    [screenNames.HELP_LIVE_CHAT]: {
      screen: HelpLiveChat,
    },
    [screenNames.NOTIFICATIONS_HOME]: {
      screen: NotificationsHome,
    },
  },
  {
    initialRouteName: screenNames.CASH_REGISTER,
    // initialRouteName: screenNames.HELP_LEARN_MORE,
  }
);

const CustomerStack = createStackNavigator(
  {
    [screenNames.CUSTOMER_LIST]: {
      screen: CustomerList,
    },
    [screenNames.CUSTOMER_PERSONAL_DETAILS]: {
      screen: PersonalDetails,
    },
  },
  {
    initialRouteName: screenNames.CUSTOMER_LIST,
    /* The header config from HomeScreen is now here */
    defaultNavigationOptions: {
      header: null,
    },
  }
);
const DashboardStack = createStackNavigator(
  {
    [screenNames.DASHBOARD_TOP_SELLING]: {
      screen: DashboardTopSelling,
    },
    [screenNames.DASHBOARD_TOTAL_SALES]: {
      screen: DashboardTotalSales,
    },
  },
  {
    initialRouteName: screenNames.DASHBOARD_TOTAL_SALES,
    /* The header config from HomeScreen is now here */
    defaultNavigationOptions: {
      header: null,
    },
  }
);

const MyAccountStack = createStackNavigator(
  {
    [screenNames.MY_ACCOUNT_LIST]: {
      screen: MyAccountList,
    },
    [screenNames.MY_ACCOUNT_PERSONAL]: {
      screen: MyAccountPersonal,
    },
    [screenNames.MY_ACCOUNT_BUSINESS]: {
      screen: MyAccountBusiness,
    },
    [screenNames.MY_ACCOUNT_NOTIFICATIONS]: {
      screen: MyAccountNotifications,
    },
    [screenNames.MY_ACCOUNT_REPORTS]: {
      screen: MyAccountReports,
    },
    [screenNames.MY_ACCOUNT_PASSWORD]: {
      screen: MyAccountPassword,
    },
  },
  {
    transitionConfig: () => {
      return sideTransition;
    },
    initialRouteName: screenNames.MY_ACCOUNT_LIST,
  }
);
const SettingsStack = createStackNavigator(
  {
    [screenNames.SETTINGS_LIST]: {
      screen: SettingsList,
    },
    [screenNames.SETTINGS_TRANSACTIONS]: {
      screen: SettingsTransactions,
    },
    [screenNames.SETTINGS_HARDWARE]: {
      screen: SettingsHardware,
    },
    [screenNames.SETTINGS_DEVICE]: {
      screen: SettingsDevice,
    },
    [screenNames.SETTINGS_PAYMENTS]: {
      screen: SettingsPayments,
    },
    [screenNames.SETTINGS_PRINTER]: {
      screen: SettingsPrinter,
    },
    [screenNames.SETTINGS_CARDREADER]: {
      screen: SettingsCardReaders,
    },
    [screenNames.SETTINGS_CASHDRAWER]: {
      screen: SettingsCashDrawers,
    },
  },
  {
    transitionConfig: () => {
      return sideTransition;
    },
    initialRouteName: screenNames.SETTINGS_LIST,
  }
);

const LeftDrawer = createDrawerNavigator(
  {
    AppNavigator: AppStack,
  },
  {
    useNativeAnimations: false,
    drawerPosition: 'left',
    contentComponent: SideBar,
    drawerWidth: isTablet ? wp('32%') : wp('75%'),
    getCustomActionCreators: (route, stateKey) => {
      return {
        toggleLeftDrawer: () => DrawerActions.toggleDrawer({ key: stateKey }),
        closeLeftDrawer: () => DrawerActions.closeDrawer({ key: stateKey }),
      };
    },
  }
);

const getLeftDrawer = stack => {
  return createDrawerNavigator(
    {
      AppNavigator: stack,
    },
    {
      useNativeAnimations: false,
      drawerPosition: 'left',
      contentComponent: SideBar,
      drawerWidth: isTablet ? wp('32%') : wp('75%'),
      getCustomActionCreators: (route, stateKey) => {
        return {
          toggleLeftDrawer: () => DrawerActions.toggleDrawer({ key: stateKey }),
          closeLeftDrawer: () => DrawerActions.closeDrawer({ key: stateKey }),
        };
      },
    }
  );
};

const RightDrawer = createDrawerNavigator(
  {
    LeftDrawer: LeftDrawer,
  },
  {
    useNativeAnimations: false,
    drawerPosition: 'right',
    contentComponent: isTablet ? null : RightSideBar,
    drawerWidth: Dimensions.get('window').width - 50,
    drawerLockMode: 'locked-closed',
    getCustomActionCreators: (route, stateKey) => {
      return {
        goToInvoice: (routeName, params) => {
          return StackActions.reset({
            index: 1,
            actions: [
              NavigationActions.navigate({ routeName: 'CashRegister' }),
              NavigationActions.navigate({
                routeName,
                params,
              }),
            ],
          });
        },
        toggleRightDrawer: () => DrawerActions.toggleDrawer({ key: stateKey }),
        closeRightDrawer: () => DrawerActions.closeDrawer({ key: stateKey }),
        isOpen: () => DrawerActions.dangerouslyGetParent(),
      };
    },
  }
);

const CashRegisterStack = createAppContainer(RightDrawer);

const AppNavigator = createSwitchNavigator(
  {
    [screenNames.AUTH_LOADING]: {
      screen: AuthLoading,
    },
    Auth: AuthStack,
    App: CashRegisterStack,
    Customer: getLeftDrawer(CustomerStack),
    Settings: getLeftDrawer(SettingsStack),
    MyAccount: getLeftDrawer(MyAccountStack),
    Dashboard: getLeftDrawer(DashboardStack),
  },
  {
    initialRouteName: screenNames.AUTH_LOADING,
    // initialRouteName: 'Settings',
  }
);

export default createAppContainer(AppNavigator);
