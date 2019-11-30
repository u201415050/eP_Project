import alert_double_service from '../../../services/alert_double_service';
import loading_service from '../../../services/loading_service';

export default function onPressBack(payment, navigation, navigate) {
  if (!payment.transactions) {
    if (navigate) {
      return navigation.goBack();
    }
    return false;
  }

  if (payment.transactions.length > 0) {
    alert_double_service.showAlertDouble(
      'Confirm',
      'Are you sure you want to cancel this payment',
      () => {
        payment
          .cancel(this.payment.paymentResponse.getPaymentId())
          .then(() => {
            navigation.goBack();
          })
          .catch(() => {
            loading_service.hideLoading();
            alert(1);
            navigation.goBack();
          });
      }
    );
    return true;
  } else {
    if (navigate) {
      return navigation.goBack();
    }
    return false;
  }
}
