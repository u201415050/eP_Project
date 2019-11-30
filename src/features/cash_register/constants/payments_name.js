import * as payment_names from '../../settings/components/icons/payments/payment_names'
import * as screen_names from '../../../navigation/screen_names'
export const screenNamesGet = {
  [payment_names.CARD]: screen_names.PAYMENTS_CARD,
  [payment_names.CASH]: screen_names.PAYMENTS_CASH,
  [payment_names.WALLETS]: screen_names.PAYMENTS_WALLET,
  [payment_names.CHEQUE]: screen_names.PAYMENTS_CHEQUE,
  [payment_names.UPI_PAYMENTS+payment_names.UPI]: screen_names.PAYMENTS_UPI,
  [payment_names.UPI_PAYMENTS+payment_names.UPI_QR]: screen_names.PAYMENTS_UPI_QR,
  [screen_names.INVOICE]: screen_names.INVOICE,
};