import React, { Component } from 'react';
import { Dimensions,View, Text, StyleSheet, ImageBackground,TouchableOpacity,Image,Keyboard} from 'react-native';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';

class ProductDetail extends React.Component{

  
    render() {
  
      const { id, name, quant, total,discount,type} = this.props.item
      return(
      <View>
        <TouchableOpacity>
          <View>
            <View style={styles.container}>
                <Text style={[styles.textProductDefault, styles.TextGrayProductIndex]}>{id}.</Text>     
                <Text style={[styles.textProductDefault, styles.TextGrayProduct]} numberOfLines={3}>{name}</Text>
                <Text style={[styles.textProductDefault, styles.TextGray]}>{quant}</Text>    
                <Text style={[styles.textProductDefault, styles.TextBlueProduct]} numberOfLines={1}>₹{total}</Text> 
            </View>
            { discount > 0 ?
            <View style={styles.container}>
                <Text style={[styles.textProductDefault, styles.TextGrayProductIndex]}></Text>     
                <Text style={styles.productDetailDiscountLabel}>̶— Discount {type=="%"? `@ ${parseFloat(discount)}%`:null}</Text>
                <Text style={[styles.textProductDefault, styles.TextGray]}></Text>    
                <Text style={styles.productDetailDiscountValue}>₹{type=="%"? parseFloat(total*discount/100).toFixed(2):parseFloat(discount).toFixed(2)}</Text>
            </View>: null
            }
          </View>
        </TouchableOpacity>
      </View>
      )
    }
  }
  const styles = StyleSheet.create({
    container:{
        width:'100%',
        flexDirection:'row',
        alignItems:'center', 
        justifyContent: 'flex-start',
    },
    textProductDefault:{
        color:'#555555',
        fontFamily: "Montserrat-Medium", 
        fontSize:hp('2.1%'),
    },
    TextGrayProductIndex:{
        textAlign:'center',
        width:'15%',
    },
    TextGrayProduct:{
        width:'38%',
        textAlign:'left'
    },
    TextGray:{
        width:'15%',
        textAlign:'center',
    },
    productAmount: {
        width:'32%',
        flexDirection:'row',
        justifyContent:'flex-end'
    },
    TextBlueProduct:{
        color:'#174285',
        width:'32%',
        textAlign:'right',
        fontFamily: "Montserrat-SemiBold",
        paddingRight:hp('2.3%')
    },
    productDetailDiscountContainer:{
        flexDirection:'row', 
        justifyContent:'flex-end', 
        width:'100%', 
        paddingRight:wp('4.4%')
      },
    productDetailDiscountLabel:{  
        color:'#FD853D', 
        fontFamily:'Montserrat-SemiBold', 
        fontSize:hp('1.9%'), 
        width:'38%',
        textAlign:'left'
    },
    productDetailDiscountValue:{
        color:'#FD853D',
        width:'32%',
        textAlign:'right',
        fontFamily: "Montserrat-SemiBold",
        fontSize:hp('1.9%'),
        paddingRight:hp('2.3%')
      },
});
  export default ProductDetail;