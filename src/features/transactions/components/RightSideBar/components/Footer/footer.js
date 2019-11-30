
import React, { Component } from 'react';
import { Dimensions,View, Text, StyleSheet, ImageBackground,TouchableOpacity,Image} from 'react-native';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import Button from './components/button';
import ModuleDiscounts from './components/moduleDiscounts';
import { isTablet } from '../../../../constants/isLandscape';

class Footer extends Component {
    render() {
        const {subtotal,products, discount, delivery, type,removeDiscount,removeDelivery} = this.props
        const isLandscape= isTablet
        let subTotalDiscount = subtotal
        products.map(item=>{
            if(item.type=="%"){
                subTotalDiscount=parseFloat(parseFloat(subTotalDiscount)-(parseFloat(item.discount/100)*parseFloat(item.total)))
            }else{
                subTotalDiscount=parseFloat(parseFloat(subTotalDiscount)-parseFloat(item.discount))
            }
        })
        let totalDiscount = type=="%"?(subTotalDiscount*parseFloat(discount)/100):parseFloat(discount)
        let CGST= subtotal*0.09
        let Total= parseFloat(subTotalDiscount)-parseFloat(totalDiscount)+parseFloat(delivery)+parseFloat(CGST)
        return (
            <View style={styles.container}>
                <View  style={[styles.subTotalContainer,{paddingTop:hp('0.9%')}]}>
                    <Text style={styles.textDark1}>Sub Total</Text>    
                    <Text style={styles.TextBlue1}>₹{parseFloat(subTotalDiscount).toFixed(2)}</Text>
                </View>
                <ModuleDiscounts cgst={CGST} subTotal={subtotal} totalDiscount={totalDiscount} Total={Total} deliveryCharge={delivery} subTotalContainer={styles.subTotalContainer} removeDiscount={removeDiscount} removeDelivery={removeDelivery}/>
                <View style={styles.buttonsContainer}>
                    <Button label="HOLD" backgroundColor="#D8D8D8" width={isLandscape?"100%":"30%"} color="#47525D"/>
                    {!isLandscape?<Button label={`PAY ₹${parseFloat(Total).toFixed(2)}`} backgroundColor="#09BA83" width={"68%"} color="white" />:null}
                </View>

            </View>
        );
    }
}

const styles = StyleSheet.create({
    
    container:{
        borderTopWidth:hp('0.2%'),
        borderColor:'#D0D0D0',
        width:'100%',
        flexDirection:'column',
        alignItems:'center',
        justifyContent:'space-between',
        
      },
      subTotalContainer:{
        width:'100%',
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'space-between',
      },
      textDark1:{
        fontSize:hp('2.4%'),
        color:'#47525D',
        fontFamily: "Montserrat-Bold",
        paddingLeft: hp('2.1%'), 
      },
      TextBlue1:{
        fontSize:hp('2.4%'),
        color:'#174285',
        fontFamily: "Montserrat-Bold",
        letterSpacing:wp('0.03%'),
        paddingRight: hp('2.2%'), 
      },
      buttonsContainer:{
          flexDirection:'row', 
          height:hp('6.75'), 
          width:'100%', 
          justifyContent:'space-between', 
          paddingLeft:hp('2.3%'), 
          paddingRight:hp('2.3%')
        }
});

export default Footer;
