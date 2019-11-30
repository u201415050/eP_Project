import { ToastAndroid, Platform } from 'react-native';
import alert_service from '../services/alert_service';
import { epaisaRequest } from '../services/epaisa_service';
import alert_double_service from '../services/alert_double_service';
import { isTablet } from '../features/cash_register/constants/isLandscape';
import * as _ from 'lodash';

export function onPressBack(
  payment,
  navigation,
  navigate,
  callback,
  cancelPayment
) {
  //alert(1)
  if (payment.processing) {
    return navigate;
  }
  let pass = true;
  if (payment.paymentResponse.process) {
    pass = false;
    alert_double_service.showAlertDouble(
      'Confirmation',
      'Do you want to cancel the payment?',
      //FIRST ACTION
      async () => {
        try {
          if (payment.split && !cancelPayment) {
            const cancel = await epaisaRequest(
              {
                transactionId:
                  payment.paymentResponse.process.response.transactionId,
              },
              '/payment/cancel/transaction',
              'POST'
            );
            console.log(cancel);
            if (!cancel.success) {
              throw new Error(cancel.message);
            }
          } else {
            const cancel = await payment.cancel(
              payment.paymentResponse.getPaymentId()
            );
            if (!cancel.success) {
              throw new Error(cancel.message);
            }
          }
          console.log('SHOWIT');
          alert_service.showAlert(
            'Payment Cancelled!',
            !isTablet
              ? () => {
                  if (_.get(navigation, 'state.params.checkout', false)) {
                    return navigation.goToInvoice('PaymentsCheckout');
                  } else if (_.get(navigation, 'state.params.saved', false)) {
                    return navigation.goToInvoice('SavedTransactions');
                  } else {
                    return navigation.goBack();
                  }
                }
              : callback
              ? callback
              : () => {}
          );
        } catch (error) {
          //alert(error)
          console.log(error);
          if (navigation) {
            if (_.get(navigation, 'state.params.checkout', false)) {
              return navigation.goToInvoice('PaymentsCheckout');
            } else if (_.get(navigation, 'state.params.saved', false)) {
              return navigation.goToInvoice('SavedTransactions');
            } else {
              return navigation.goBack();
            }
          } else {
            if (callback) callback();
          }
        }
      }
    );
  }

  if (navigation && pass) {
    if (this.payment.split) {
      this.payment.split = false;
    }
    if (_.get(navigation, 'state.params.checkout', false)) {
      return navigation.goToInvoice('PaymentsCheckout');
    } else if (_.get(navigation, 'state.params.saved', false)) {
      return navigation.goToInvoice('SavedTransactions');
    } else {
      return navigation.goBack();
    }
  } else {
    if (callback) callback();
  }
}
