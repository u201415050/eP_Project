import React, { Component } from 'react';
import { Dimensions,View, Text, StyleSheet, ImageBackground,TouchableOpacity,Image} from 'react-native';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import Swipeout from 'react-native-swipeout';

class ModuleDiscounts extends Component {
    state={
        indexDelete: 0
    }
    render() {
        const {cgst,totalDiscount, subTotal,deliveryCharge, Total, subTotalContainer,removeDiscount,removeDelivery} = this.props
        
        const swipeBtns = [
            {
              component: (
                <Text style={styles.swipeBtns}>Delete</Text>
              ),
              backgroundColor: '#FFACB6',
              onPress: this.state.indexDelete==1? removeDiscount: this.state.indexDelete==2? removeDelivery : null
            },
          ];
        return (
            <View style={styles.container}>
            {
                subTotal>0?
                <View style={{width:'100%'}}>
                {
                    totalDiscount > 0 ?
                    <Swipeout 
                        right={swipeBtns}
                        autoClose={true}
                        backgroundColor={'transparent'}
                        buttonWidth={hp('11%')}
                        onOpen={()=>{this.setState({indexDelete: 1})}}
                        onClose={()=>{this.setState({indexDelete: 0})}}
                    >
                        <View style={subTotalContainer}>
                            <Text style={styles.subTextOrange}>Discount</Text>       
                            <Text style={[styles.subTextOrange,styles.textOrange]}>₹{parseFloat(totalDiscount).toFixed(2)}</Text>
                        </View>
                    </Swipeout> : null
                }
                {
                      deliveryCharge > 0 ? 
                        <Swipeout 
                          right={swipeBtns}
                          autoClose={true}
                          backgroundColor={'transparent'}
                          buttonWidth={hp('11%')}
                          onOpen={()=>{this.setState({indexDelete: 2})}}
                          onClose={()=>{this.setState({indexDelete: 0})}}
                        >
                          <View  style={subTotalContainer}>
                              <Text style={styles.subTextGray}>Delivery Charge</Text>       
                              <Text style={[styles.subTextGray,styles.subTextBlue]}>₹{parseFloat(deliveryCharge).toFixed(2)}</Text>
                          </View> 
                        </Swipeout> : null
                    }
                <View style={[subTotalContainer, {paddingTop:hp('0.1%')}]}>
                    <Text style={styles.subTextGray}>CGST@9%</Text>       
                    <Text style={[styles.subTextGray,styles.subTextBlue]}>₹{parseFloat(cgst).toFixed(2)}</Text>
                </View>
                </View>:null
            }
                <View  style={subTotalContainer}>
                    <Text style={styles.textDark2}>Total Amount</Text>       
                    <Text style={[styles.textDark2,styles.TextBlue2]}>₹{parseFloat(Total>0?Total:0).toFixed(2)}</Text>
                </View>
            </View>
                    
        );
    }
}

const styles = StyleSheet.create({
    
    container:{
        width:'100%',
        marginBottom: hp('0.80'),
    },
    swipeBtns:{
        fontFamily:'Montserrat-SemiBold', 
        fontSize:hp('2.09%'), 
        color:'#D0021B', 
        width:"100%", 
        height:'100%', 
        textAlign:'center', 
        textAlignVertical:'center'
    },
    subTextOrange:{
        fontSize:hp('2.2%'),
        color:'#FF6000',
        fontFamily: "Montserrat-Bold",
        paddingLeft: hp('2.1%'), 
    },
    textOrange:{
        paddingRight: hp('2.2%'), 
    },
    subTextGray:{
        fontSize:hp('2.2%'),
        color:'#47525D',
        fontFamily: "Montserrat-Bold",
        paddingLeft: hp('2.1%'), 
    },
    subTextBlue:{
        color:'#174285',
        paddingRight: hp('2.2%'), 
    },
    textDark2:{
        fontSize:hp('2.8%'),
        letterSpacing:wp('0.03%'),
        color:'#47525D',
        fontFamily: "Montserrat-Bold",
        paddingBottom: hp('1%'),
        paddingLeft: hp('2.1%'), 
      },
    TextBlue2:{
        color:'#174285',
        fontSize:hp('2.8%'),
        letterSpacing:wp('0.03%'),
        paddingRight: hp('2.2%'), 
      },
});

export default ModuleDiscounts;
