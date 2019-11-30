import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View,ScrollView,Image,TouchableOpacity} from 'react-native';
import colors from '../../styles/colors';
import EStyleSheet from 'react-native-extended-stylesheet';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import { isTablet } from '../../constants/isLandscape';
import { TextMontserrat } from '../../../cash_register/components/EditProduct/components/texts';


export default class ItemsContainerPayments extends Component{
  state={
    pay:[
      {
        label: 'Cash',
        source: require('../../assets/icons/cash.png'),
        active:this.props.filter.includes('Cash')
      },
      {
        label: 'Card',
        source: require('../../assets/icons/card.png'),
        active:this.props.filter.includes('Card'),
        type:'Payment',
      },
      {
        label: 'UPI QR',
        source: require('../../assets/icons/upiqr.png'),
        active:this.props.filter.includes('UPI QR Payment'),
        type:'Payment',
        custom: true
      },
      {
        label: 'UPI',
        source: require('../../assets/icons/upi.png'),
        active:this.props.filter.includes('UPI Payment'),
        type:'Payment',
      },
      {
        label: 'Cheque',
        source: require('../../assets/icons/cheque.png'),
        active:this.props.filter.includes('Cheque Payment'),
        type:'Payment',
      },
      {
        label: 'EMI',
        source: require('../../assets/icons/emi.png'),
        active:this.props.filter.includes('EMI Payment'),
        type:'Payment',
      },
      {
        label: 'Citrus',
        source: require('../../assets/icons/citrus.png'),
        active:this.props.filter.includes('Citrus Wallet'),
        type:'Wallet',
        custom: true
      },
      {
        label: 'Freecharge',
        source: require('../../assets/icons/freecharge.png'),
        active:this.props.filter.includes('Freecharge Wallet'),
        type:'Wallet',
        custom: true
      },
      {
        label: 'Mobikwik',
        source: require('../../assets/icons/mobikwik.png'),
        active:this.props.filter.includes('Mobikwik Wallet'),
        type:'Wallet',
        custom: true
      },
      {
        label: 'OLA Money',
        source: require('../../assets/icons/olamoney.png'),
        active:this.props.filter.includes('OLA Money Wallet'),
        type:'Wallet',
        custom: true
      },
      {
        label: 'Pockets',
        source: require('../../assets/icons/pockets.png'),
        active:this.props.filter.includes('Pockets Wallet'),
        type:'Wallet',
        custom: true
      },
      {
        label: 'mPesa',
        source: require('../../assets/icons/mpesa.png'),
        type:'Wallet',
        active:this.props.filter.includes('mPesa Wallet'),
        custom: true
      },
    ],
    listCategories:this.props.filter
  }
  
  toggleBut=(index)=>{
    let indic;
    let element =this.state.pay.map((item,i)=>{
      if(index!=i){
        return item;
      }else{
        indic=!item.active
        return {...item, active:!item.active}
      }
    })

    this.setState({pay:element})
    //let list = 
      if(indic){
        let newLabel=this.state.pay[index].label
        let type=newLabel!='Cash'?' '+this.state.pay[index].type:''
        
        //newLabel=this.state.pay[index].label=='Cash'?this.state.pay[index].label:(this.state.pay[index].label+' '+this.state.pay[index].label.type)
        
        this.setState({listCategories:[...this.state.listCategories,newLabel+type]})
      }else{
        let place = this.state.listCategories.indexOf(this.state.pay[index].label)
        let newArray = this.state.listCategories
        newArray.splice(place,1)
        this.setState({listCategories:newArray})
      }
    
  }
  componentWillUnmount(){
    this.props.addPayFilter(this.state.listCategories)
  }

  render() {
    const isLandscape= isTablet
    let index =-1
    let columns = []
    const {pay} =this.state
    pay.map((item,i)=>{
      if(i%(isTablet?8:6)==0) {
        columns.push([])
        index++;
      }
      columns[index].push(item)
    })
    let itemExtra={
      noDisplay:true
    }
    let max =(isTablet?8-columns[index].length:6-columns[index].length)
    for(let i=0;i<max;i++){
      columns[index].push(itemExtra)
    }
    
    return (
      <View style={[{width:'100%',alignItems:'center', paddingHorizontal:wp('0.1%')}, isLandscape?{paddingHorizontal: 0}:null]}>
        
        
          {
            columns.map((item2,j)=>{
              return <View key={j} style={[styles.container,item2.length<(isTablet?8:6)?{justifyContent:'flex-start'}:null]}>
              {
              item2.map((item,i)=>{
                
                return(
                  <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={()=>{
                    this.toggleBut((j*6)+i)
                  }}
                  key={i} style={{alignItems:'center',width:isTablet?'12%':'16%', justifyContent: 'center'}}>
                    {
                      item.active&&!item.noDisplay?
                    <View style={ {top:-wp(isTablet?'0.36%':'0.7%'),left:wp(isTablet?'0.36%':'1%'),backgroundColor:'#417505',position:'absolute', elevation:1, borderRadius: wp(isTablet?'4.72%':item.custom?'12.1%':'11.6%') , alignItems: 'center', width: wp(isTablet?'4.72%':item.custom?'12.1%':'11.5%'),height:wp(isTablet?'4.72%':item.custom?'12.1%':'11.5%')}}/>
                    :null}
                    {item.noDisplay?null:<Image source={item.source}
                    style={{elevation:2,width:wp(isTablet?'4.4%':'11%'),height:wp(isTablet?'4.4%':'11%')}}
                />    }
                    {item.noDisplay?null:<TextMontserrat
                    style={{fontSize:hp('1.1%'),color:'rgba(0,0,0,0.6)', textAlign:'center',fontWeight:'900'}}
                    >{item.label}</TextMontserrat>}
                  </TouchableOpacity>
                )
              })
            }</View>})}
        </View>
    );
  }
}

const styles = EStyleSheet.create({
  container: {
    width: '100%',
    flexDirection: 'row',
    height:hp('10%'),
    justifyContent:'space-between',
    alignItems:'center',
  },
  title:{
    color: colors.white,
    fontSize: 17,
    fontWeight: '700',
    letterSpacing: 2
  }
});
