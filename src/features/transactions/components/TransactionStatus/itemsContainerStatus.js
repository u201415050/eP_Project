import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View,ScrollView,TouchableOpacity} from 'react-native';
//import Items from './Item/items'

//import { Colors, CategoriesLarge } from '../../constants/categories';
import EStyleSheet from 'react-native-extended-stylesheet';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import { isTablet } from '../../constants/isLandscape';
import LinearGradient from 'react-native-linear-gradient';
import colors from '../../../settings/styles/colors';
import {TextMontserrat} from 'components'

export default class ItemsTransactionStatus extends Component{
  state={
      status : [
        {
          label: 'Deposited',
          firstColor: '#FFFFFF',
          secondColor:'#2D8586',
          active:this.props.filter.includes('Deposited')
        },
        {
          label: 'Settled',
          firstColor: '#FFFFFF',
          secondColor:'#04A754',
          active:this.props.filter.includes('Settled')
        },
        {
          label: 'Approved',
          firstColor: '#FFFFFF',
          secondColor:'#8FC742',
          active:this.props.filter.includes('Approved')
        },
        {
          label: 'Pending',
          firstColor: '#FFFFFF',
          secondColor:'#EADF00',
          active:this.props.filter.includes('Pending')
        },
        {
          label: 'Failed',
          firstColor: '#FFFFFF',
          secondColor:'#FF0000',
          active:this.props.filter.includes('Failed')
        },
        {
          label: 'Volded',
          firstColor: '#FFFFFF',
          secondColor:'#640563',
          active:this.props.filter.includes('Volded')
        },
        {
          label: 'Refunded',
          firstColor: '#FFFFFF',
          secondColor:'#EB6BAA',
          active:this.props.filter.includes('Refunded')
        },
        {
          label: 'Cancelled',
          firstColor: '#FFFFFF',
          secondColor:'#FF3D00',
          active:this.props.filter.includes('Cancelled')
        },
      ],
      listCategories:this.props.filter
    }
  
  toggleBut=(index)=>{
    let indic;
    let element= this.state.pay
    let configIndex=(index*6)+index2
    indic=!this.state.pay[configIndex].active
    element[configIndex]={...this.state.pay[configIndex], active:indic}
    this.columns[index][index2]= element[configIndex]
    this.setState({pay:element})
    
    this.setState({status:element},()=>{
      if(this.state.status[index].active){
        this.setState({listCategories:[...this.state.listCategories,this.state.status[index].label]})
      }else{
        let place = this.state.listCategories.indexOf(this.state.status[index].label)
        let newArray = this.state.listCategories
        newArray.splice(place,1)
        this.setState({listCategories:newArray})
        //this.props.addStatusFilter(newArray)
      }
    })
    //let list = 
    
    
  }
  componentWillUnmount(){
    this.props.addStatusFilter(this.state.listCategories)
  }

  render() {
    const isLandscape= isTablet
    let index =-1
    let columns = []
    this.state.status.map((item,i)=>{
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
    //alert(columns[1].length)
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
                    <View style={ {top:-wp(isTablet?'0.36%':'0.9%'),backgroundColor:'#417505',position:'absolute', elevation:1, borderRadius: wp(isTablet?'4.72%':'11.8%') , alignItems: 'center', width: wp(isTablet?'4.72%':'11.8%'),height:wp(isTablet?'4.72%':'11.8%')}}/>
                    :null}
                    {item.noDisplay?null:<View style={ {top:0,position:'absolute',backgroundColor:'white', elevation:2, borderRadius: wp(isTablet?'4%':'10%') , alignItems: 'center', width: wp(isTablet?'4%':'10%'),height:wp(isTablet?'4%':'10%')}}/>
                    }{item.noDisplay?null:<LinearGradient 
                        colors={[item.firstColor, item.secondColor]} 
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={[{ borderRadius: wp('10%'), marginBottom:hp('0.5%'), alignItems: 'center', width: wp(isTablet?'4%':'10%'),height:wp(isTablet?'4%':'10%'),
                    elevation: 3 }]}/>     } 
                    {item.noDisplay?null:<TextMontserrat
                    style={{fontSize:hp('1.2%'),color:'rgba(0,0,0,0.6)', textAlign:'center',fontWeight:'900'}}
                    >{item.label}</TextMontserrat>}
                  </TouchableOpacity>
                )
              })
            }
          </View>})}
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
