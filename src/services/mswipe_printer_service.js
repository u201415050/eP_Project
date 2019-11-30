
import loading_service from './loading_service';
import alert_service from './alert_service';
import { getLocalSettingRow } from './settings_service';
import BluetoothSerial from "react-native-bluetooth-serial-next";
import MswipePrinter from '../custom_modules/mswipe_printer_module';
export async function printMswipe(object) {
        /*
        +-----------------------------------------+
        |               COMPANYNAME               |
        |             ADRRESS DETAILS             |
        |               CITYDETAILS               |
        |                 PINCODE                 |
        |                                         |
        |Date : DATETIME                          |
        |PID : PAYMENTID                          |
        |            (DUPLICATED) BILL            |
        |                                         |
        |                                         |
        |                                         |
        |                                         |
        |                                         |
        |                                         |
        |                                         |
        |                                         |
        |                                         |
        |                                         |
        |                                         |
        |                                         |
        |                                         |
        |                                         |
        +-----------------------------------------+
        */
        let companyName=object.companyName!=''?object.companyName:'';

        let addressDetails=(object.address1.length>15?
        object.address1.substr(0,15):
        object.address1)+(object.address2.length>15?
          ' '+object.address2.substr(0,15):
          ' '+object.address2);

        let cityDetails=(object.city!=''?
          object.city:'')+(object.city!=''&&object.state!=''?' ':'')+(object.state!=''?object.state:'')

        let pincode=(object.pincode!=''?object.pincode:'')

        let datetime=`Date : ${object.date} ${object.time}\n`

        let paymentId=`PID : ${object.paymentId}\n`

        let BILL=`${object.duplicated?'DUPLICATE ':''}BILL`
        console.log(object)

        try{MswipePrinter.startPrintingData(companyName,MswipePrinter.FontLattice_TWENTY_FOUR,
        true,MswipePrinter.ALIGN_CENTER,companyName!='')
        MswipePrinter.startPrintingData(addressDetails,MswipePrinter.FontLattice_TWENTY_FOUR,
        true,MswipePrinter.ALIGN_CENTER,addressDetails!='')
        MswipePrinter.startPrintingData(cityDetails,MswipePrinter.FontLattice_TWENTY_FOUR,
        true,MswipePrinter.ALIGN_CENTER,cityDetails!='')
        MswipePrinter.startPrintingData(pincode,MswipePrinter.FontLattice_TWENTY_FOUR,
        true,MswipePrinter.ALIGN_CENTER,pincode!='')
        MswipePrinter.newLine()
        MswipePrinter.startPrintingData(datetime,MswipePrinter.FontLattice_TWENTY_FOUR,
        true,MswipePrinter.ALIGN_LEFT,datetime!='')
        MswipePrinter.startPrintingData(paymentId,MswipePrinter.FontLattice_TWENTY_FOUR,
        true,MswipePrinter.ALIGN_LEFT,paymentId!='')
        MswipePrinter.startPrintingData(BILL,MswipePrinter.FontLattice_TWENTY_FOUR,
        true,MswipePrinter.ALIGN_CENTER,BILL!='')

        let subtotal=0
        for (let i = 0; i < object.products.length; i++) {
          totalTaxes=0
          subtotal=subtotal+object.products[i].unitPrice * object.products[i].quantity
          subtotal=subtotal-(object.products[i].type == '%'? object.products[i].calculatedDiscount: object.products[i].discount)
          let productDetail=object.products[i].quantity +(object.products[i].quantity<10?' ':'')+ ' ' + object.products[i].name;
          let productValue= parseFloat(
            object.products[i].unitPrice * object.products[i].quantity
          ).toFixed(2);

          MswipePrinter.startPrintingData(productDetail,MswipePrinter.FontLattice_TWENTY_FOUR,
            true,MswipePrinter.ALIGN_LEFT,false)
          MswipePrinter.startPrintingData(productValue,MswipePrinter.FontLattice_TWENTY_FOUR,
              true,MswipePrinter.ALIGN_RIGHT,true)

          let discountDetail=`   Discount@${object.products[i].discount}${
            object.products[i].type
          }`;
          let discountValue= `-${
            object.products[i].type == '%'
              ? parseFloat(
                object.products[i].calculatedDiscount
                ).toFixed(2)
              : parseFloat(object.products[i].discount).toFixed(2)
          }`;  

          MswipePrinter.startPrintingData(discountDetail,MswipePrinter.FontLattice_TWENTY_FOUR,
            true,MswipePrinter.ALIGN_LEFT,false)
          MswipePrinter.startPrintingData(discountValue,MswipePrinter.FontLattice_TWENTY_FOUR,
              true,MswipePrinter.ALIGN_RIGHT,true)
          }
        
        
        let taxFinal=(parseFloat(subtotal))+(object.CESS != 0?object.CESS.taxvalue:0)
        +(object.CGST != 0?object.CGST.taxvalue:0)
        +(object.IGST != 0?object.IGST.taxvalue:0)
        +(object.SGST != 0?object.SGST.taxvalue:0)
        +(object.VAT != 0?object.VAT.taxvalue:0)
        let finalPay=(parseFloat(taxFinal))+(object.delivery > 0?object.delivery:0)-(object.discount > 0?object.discount*taxFinal/100:0)

        if (
          getLocalSettingRow('Transaction', 'RoundOff') == true ||
          getLocalSettingRow('Transaction', 'RoundOff') == 1
        ) {
          finalPay = parseInt(finalPay.toFixed(0));
        }
      
      
      MswipePrinter.newLine()
      MswipePrinter.startPrintingData('Sub Total',MswipePrinter.FontLattice_TWENTY_FOUR,
        true,MswipePrinter.ALIGN_LEFT,false)
      MswipePrinter.startPrintingData(`${parseFloat(subtotal).toFixed(2)}`,MswipePrinter.FontLattice_TWENTY_FOUR,
          true,MswipePrinter.ALIGN_RIGHT,true)
      if(object.CESS.taxvalue != 0){
        MswipePrinter.startPrintingData('CESS',MswipePrinter.FontLattice_TWENTY_FOUR,
        true,MswipePrinter.ALIGN_LEFT,false)
        MswipePrinter.startPrintingData(`${toDecimal(parseFloat(object.CESS.taxvalue),100).toFixed(2)}`,MswipePrinter.FontLattice_TWENTY_FOUR,
          true,MswipePrinter.ALIGN_RIGHT,true)
      }
      if(object.CGST.taxvalue != 0){
        MswipePrinter.startPrintingData('CGST',MswipePrinter.FontLattice_TWENTY_FOUR,
        true,MswipePrinter.ALIGN_LEFT,false)
        MswipePrinter.startPrintingData(`${toDecimal(parseFloat(object.CGST.taxvalue),100).toFixed(2)}`,MswipePrinter.FontLattice_TWENTY_FOUR,
          true,MswipePrinter.ALIGN_RIGHT,true)
      }
      if(object.IGST.taxvalue != 0){
        MswipePrinter.startPrintingData('IGST',MswipePrinter.FontLattice_TWENTY_FOUR,
        true,MswipePrinter.ALIGN_LEFT,false)
        MswipePrinter.startPrintingData(`${toDecimal(parseFloat(object.IGST.taxvalue),100).toFixed(2)}`,MswipePrinter.FontLattice_TWENTY_FOUR,
          true,MswipePrinter.ALIGN_RIGHT,true)
      }
      if(object.SGST.taxvalue != 0){
        MswipePrinter.startPrintingData('SGST',MswipePrinter.FontLattice_TWENTY_FOUR,
        true,MswipePrinter.ALIGN_LEFT,false)
        MswipePrinter.startPrintingData(`${toDecimal(parseFloat(object.SGST.taxvalue),100).toFixed(2)}`,MswipePrinter.FontLattice_TWENTY_FOUR,
          true,MswipePrinter.ALIGN_RIGHT,true)
      }
      if(object.VAT.taxvalue != 0){
        MswipePrinter.startPrintingData('VAT',MswipePrinter.FontLattice_TWENTY_FOUR,
        true,MswipePrinter.ALIGN_LEFT,false)
        MswipePrinter.startPrintingData(`${toDecimal(parseFloat(object.VAT.taxvalue),100).toFixed(2)}`,MswipePrinter.FontLattice_TWENTY_FOUR,
          true,MswipePrinter.ALIGN_RIGHT,true)
      }
      MswipePrinter.newLine()

      MswipePrinter.startPrintingData(`${object.discount > 0||object.delivery > 0?'Total Amount':'Total Payable'}`,MswipePrinter.FontLattice_TWENTY_FOUR,
        true,MswipePrinter.ALIGN_LEFT,false)
      MswipePrinter.startPrintingData(`${
        object.discount > 0||object.delivery > 0?
        toDecimal(parseFloat(taxFinal),100).toFixed(2):
        getLocalSettingRow('Transaction', 'RoundOff') == true ||
        getLocalSettingRow('Transaction', 'RoundOff') == 1?
        parseInt(toDecimal(parseFloat(taxFinal),100).toFixed(0)).toFixed(2)
        :toDecimal(parseFloat(taxFinal),100).toFixed(2)
      }`,MswipePrinter.FontLattice_TWENTY_FOUR,
        true,MswipePrinter.ALIGN_RIGHT,true)

      if( object.discount > 0||object.delivery > 0){
        MswipePrinter.newLine()

        if(object.discount > 0){
          if(object.discountType=='%'){
            MswipePrinter.startPrintingData(`Discount@${object.discount}${object.discountType}`,MswipePrinter.FontLattice_TWENTY_FOUR,
            true,MswipePrinter.ALIGN_LEFT,false)
            MswipePrinter.startPrintingData(`-${parseFloat(object.discount*taxFinal/100).toFixed(2)}`,MswipePrinter.FontLattice_TWENTY_FOUR,
            true,MswipePrinter.ALIGN_RIGHT,true)
          }else{
            MswipePrinter.startPrintingData(`Discount`,MswipePrinter.FontLattice_TWENTY_FOUR,
            true,MswipePrinter.ALIGN_LEFT,false)
            MswipePrinter.startPrintingData(`-${parseFloat(object.discount).toFixed(2)}`,MswipePrinter.FontLattice_TWENTY_FOUR,
            true,MswipePrinter.ALIGN_RIGHT,true)
          }
        }
        if(object.delivery > 0){
          MswipePrinter.startPrintingData('Delivery Charge',MswipePrinter.FontLattice_TWENTY_FOUR,
          true,MswipePrinter.ALIGN_LEFT,false)
          MswipePrinter.startPrintingData(`${parseFloat(object.delivery).toFixed(2)}`,MswipePrinter.FontLattice_TWENTY_FOUR,
          true,MswipePrinter.ALIGN_RIGHT,true)
        }
      }
      MswipePrinter.newLine()
      MswipePrinter.startPrintingData('Paid by:',MswipePrinter.FontLattice_TWENTY_FOUR,
            true,MswipePrinter.ALIGN_LEFT,true)

      object.listTrans.map(async trans=> {
        MswipePrinter.startPrintingData(`${trans.type} ${trans.type.indexOf("Payment")!=-1?'':"Payment"}`,MswipePrinter.FontLattice_TWENTY_FOUR,
        true,MswipePrinter.ALIGN_LEFT,false)
        MswipePrinter.startPrintingData(`${toDecimal(parseFloat(trans.amount),100).toFixed(2)}`,MswipePrinter.FontLattice_TWENTY_FOUR,
        true,MswipePrinter.ALIGN_RIGHT,true)
      })      

      MswipePrinter.newLine()
      MswipePrinter.startPrintingData("Return Policy : We don't take returns. :)",MswipePrinter.FontLattice_TWENTY_FOUR,
      true,MswipePrinter.ALIGN_LEFT,true)
      MswipePrinter.startPrintingData('Thanks you for your business!',MswipePrinter.FontLattice_TWENTY_FOUR,
      true,MswipePrinter.ALIGN_CENTER,true)
      MswipePrinter.startPrintingData('Powered by ePaisa',MswipePrinter.FontLattice_TWENTY_FOUR,
      true,MswipePrinter.ALIGN_CENTER,true)
      MswipePrinter.newLine()
      MswipePrinter.newLine()
      MswipePrinter.newLine()
      MswipePrinter.newLine()
    
    }catch(e){
        
      console.log(e)

    }
}