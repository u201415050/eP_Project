import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View,ScrollView,TouchableOpacity,Image, TouchableWithoutFeedback, Keyboard} from 'react-native';


import EStyleSheet from 'react-native-extended-stylesheet';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';

//import ItemsContainer from './itemsContainer'
import { TextMontserrat } from 'components';
import { isTablet } from '../../constants/isLandscape';
import colors from '../../styles/colors';
import ItemsContainerPayments from './itemsContainerPayments';
const pay=
isTablet?
[
  [ {id:2,label: 'Cash',source: require('../../assets/icons/cash.png')},
    {id:14,label: 'Card',source: require('../../assets/icons/card.png')},
    {id:27,label: 'UPI QR',source: require('../../assets/icons/upiqr.png')},
    {id:20,label: 'UPI',source: require('../../assets/icons/upi.png')},
    {id:21,label: 'Cheque',source: require('../../assets/icons/cheque.png')},
    {id:35,label: 'EMI',source: require('../../assets/icons/emi.png')},],
  [ {id:5,label: 'Citrus',source: require('../../assets/icons/citrus.png')},
    {id:8,label: 'Freecharge',source: require('../../assets/icons/freecharge.png')},
    {id:17,label: 'Mobikwik',source: require('../../assets/icons/mobikwik.png')},
    {id:9,label: 'OLA Money',source: require('../../assets/icons/olamoney.png')},
    {id:19,label: 'Pockets',source: require('../../assets/icons/pockets.png')},
    {id:25,label: 'mPesa',source: require('../../assets/icons/mpesa.png')},
    // {noDisplay:true},
    // {noDisplay:true},
    // {noDisplay:true},
    // {noDisplay:true}
  ]
]:
[
  [ {id:2,label: 'Cash',source: require('../../assets/icons/cash.png')},
    {id:14,label: 'Card',source: require('../../assets/icons/card.png')},
    {id:27,label: 'UPI QR',source: require('../../assets/icons/upiqr.png')},
    {id:20,label: 'UPI',source: require('../../assets/icons/upi.png')},
    {id:21,label: 'Cheque',source: require('../../assets/icons/cheque.png')},],
  [ {id:35,label: 'EMI',source: require('../../assets/icons/emi.png')},
    {id:5,label: 'Citrus',source: require('../../assets/icons/citrus.png')},
    {id:8,label: 'Freecharge',source: require('../../assets/icons/freecharge.png')},
    {id:17,label: 'Mobikwik',source: require('../../assets/icons/mobikwik.png')},
    {id:9,label: 'OLA Money',source: require('../../assets/icons/olamoney.png')},],
  [ {id:19,label: 'Pockets',source: require('../../assets/icons/pockets.png')},
    {id:25,label: 'mPesa',source: require('../../assets/icons/mpesa.png')},
    {noDisplay:true},
    {noDisplay:true},
    {noDisplay:true}]
]
export default class ItemsTransactions extends Component{
  constructor(props){
    super(props)
    this.state={
      listCategories:props.filter
    }
    this.updateData=()=>{
      props.addPayFilter(this.state.listCategories)
    }
  }
  toggleOption=(i,j)=>{
    let index = isTablet? i*6+j:i*5+j
    let newContain = this.state.listCategories
    newContain[index]=!newContain[index]
    this.setState({listCategories:newContain})
  }
  render() {
    const isLandscape = isTablet
    const {filter,addPayFilter} = this.props
    
    return (
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <View style={[styles.container, `../../../assets/icons/Deposited.png` ?{paddingHorizontal: 0}:null]}>
          <View style={{paddingLeft:wp(1.8)}}>
            <TextMontserrat style={styles.titleText}>PAYMENT METHODS</TextMontserrat>
            </View>
            <View style={[{width:'100%',alignItems:'center', paddingHorizontal:wp('0.1%')}, isTablet?{paddingHorizontal: 0, marginTop:hp('2%')}:null]}>
            {
              pay.map((item2,j)=>{
                return <View key={j} style={[styles.container2,item2.length<(isTablet?6:5)?{justifyContent:'flex-start'}:null]}>
                {
                item2.map((item,i)=>{
                  
                  return(
                    <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={()=>{
                      //alert((j*6)+i)
                      this.toggleOption(j,i)
                    }}
                    key={i} style={{alignItems:'center', flex: 1, justifyContent: 'center'}}>
                      
                      {item.noDisplay?null:<Image source={item.source}
                      style={{borderColor:this.state.listCategories[isTablet?j*6+i:j*5+i]?'#417505':'#dddd', borderRadius:wp(isTablet?'2.2%':'5.5%'), borderWidth:this.state.listCategories[isTablet?j*6+i:j*5+i]?3:0.75/*item.active&&*//*!item.noDisplay&&isTablet?*/, elevation:3,width:wp(isTablet?'4.4%':'11%'),height:wp(isTablet?'4.4%':'11%')}}
                  />    }
                      {item.noDisplay?null:<TextMontserrat
                      style={{fontSize: isTablet ? hp('1.7%') : wp('2.4%'), color:'rgba(0,0,0,0.6)', textAlign:'center',fontWeight:'900'}}
                      >{item.label}</TextMontserrat>}
                    </TouchableOpacity>
                  )
                })
              }</View>})}
          </View>
        </View>
      </TouchableWithoutFeedback>
    );
  }
}

const styles = EStyleSheet.create({
  container: {
    marginTop:hp('1%'),
    width: '100%',
    borderBottomWidth: 0.9,
    borderBottomColor: '#efefef',
    paddingBottom:10,
  },
  titleText:{
    color: colors.slateGray,
    fontSize: hp('1.8%'),
    fontWeight: '600',
    letterSpacing:1.2
  },
  container2: {
    width: '100%',
    flexDirection: 'row',
    height:isTablet ? hp('13%') : hp('10%'),
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
