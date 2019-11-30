
const paymentsIcon = {
  Cash: require('../assets/paymenticons/cash.png'),
  Card: require('../assets/paymenticons/card.png'),
  Cheque: require('../assets/paymenticons/cheque.png'),
  UPI: require('../assets/paymenticons/upi.png'),
  UPIQR: require('../assets/paymenticons/upiqr.png'),
  EMI: require('../assets/paymenticons/emi.png'),
  Mobikwik: require('../assets/paymenticons/mobikwik.png'),
  Freecharge: require('../assets/paymenticons/freecharge.png'),
  Citrus: require('../assets/paymenticons/citrus.png'),
  mPesa: require('../assets/paymenticons/mpesa.png'),
  olaMoney: require('../assets/paymenticons/olamoney.png'),
  Pockets: require('../assets/paymenticons/pockets.png'),
  Wallet: require('../assets/paymenticons/wallet.png'),
}
export function getIcon(name){
  if(name.toUpperCase().indexOf('CASH')!=-1){
    return paymentsIcon.Cash
  }else if(name.toUpperCase().indexOf('EPAISA')!=-1){
    return paymentsIcon.Card
  }else if(name.toUpperCase().indexOf('CHEQUE')!=-1){
    return paymentsIcon.Cheque
  }else if(name.toUpperCase().indexOf('UPI')!=-1){
    if(name.toUpperCase().indexOf('QR')!=-1){
      return paymentsIcon.UPIQR
    }else{
      return paymentsIcon.UPI
    }
  }else if(name.toUpperCase().indexOf('EMI')!=-1){
    return paymentsIcon.EMI
  }else if(name.toUpperCase().indexOf('MOBIKWIK')!=-1){
    return paymentsIcon.Mobikwik
  }else if(name.toUpperCase().indexOf('FREECHARGE')!=-1){
    return paymentsIcon.Freecharge
  }else if(name.toUpperCase().indexOf('POCKETS')!=-1){
    return paymentsIcon.Pockets
  }else if(name.toUpperCase().indexOf('OLA')!=-1){
    return paymentsIcon.olaMoney
  }else if(name.toUpperCase().indexOf('CITRUS')!=-1){
    return paymentsIcon.Citrus
  }else if(name.toUpperCase().indexOf('MPESA')!=-1){
    return paymentsIcon.mPesa
  }else if(name.toUpperCase().indexOf('WALLET')!=-1){
    return paymentsIcon.Wallet
  }else {
    return paymentsIcon.Card
  }
}
