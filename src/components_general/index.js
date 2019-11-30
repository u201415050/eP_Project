import DoubleBackground from './layout/double_background/double_background';
import BackHeader from './layout/BackHeader';
import { TextMontserrat, TouchableText } from './texts';
import { FloatingTextInput, PhoneInput } from './inputs';
import { Card, CardWithHeader } from './cards';
import {
  ButtonGradient,
  ButtonOutline,
  ButtonClose,
  ButtonGradientOutline,
} from './buttons';
import { PopUp } from './popups';
import { Loading } from './utilities/loading';
import { Alert } from './utilities/alert_message';
import Timer from './utilities/timer';
import Logo from './utilities/logo/logo';
import FingerprintModal from './popups/FingerprintModal/FingerprintModal';
import DateRangePicker from './utilities/calendar';
import ConfirmMessage from './utilities/confirm_message';
import Background from './background';
import Header from './header';
import SafeAreaView from './utilities/SafeAreaView';
import DeviceInfo from 'react-native-device-info';
const isTablet = DeviceInfo.isTablet();
export {
  DoubleBackground,
  TextMontserrat,
  TouchableText,
  ButtonGradient,
  ButtonOutline,
  BackHeader,
  Card,
  CardWithHeader,
  FloatingTextInput,
  PopUp,
  Loading,
  Alert,
  ButtonClose,
  ButtonGradientOutline,
  Timer,
  PhoneInput,
  Logo,
  FingerprintModal,
  DateRangePicker,
  ConfirmMessage,
  Background,
  Header,
  SafeAreaView,
  isTablet
};
