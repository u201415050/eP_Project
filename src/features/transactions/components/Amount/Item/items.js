import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, ImageBackground,Image,TextInput} from 'react-native';

import EStyleSheet from 'react-native-extended-stylesheet';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import { TextMontserrat } from "components";
import MultiSlider from '@ptomasroos/react-native-multi-slider';
import colors from '../../../../modal_delivery/styles/colors';
import { isTablet } from '../../../../modal_customer/constants/isLandscape';
export default class Items extends Component{
  state = {
    sliderOneChanging: false,
    sliderOneValue: [5],
    multiSliderValue: [this.props.filter.min, this.props.filter.max],
  };

  sliderOneValuesChangeStart = () => {
    this.setState({
      sliderOneChanging: true,
    });
  };

  sliderOneValuesChange = values => {
    let newValues = [0];
    newValues[0] = values[0];
    this.setState({
      sliderOneValue: newValues,
    });
    
  };

  sliderOneValuesChangeFinish = () => {
    this.setState({
      sliderOneChanging: false,
    });
  };

  multiSliderValuesChange = values => {
    this.setState({
      multiSliderValue: values,
    });
    //this.props.modifyLimits({min:values[0], max:values[1]})
  };
  render() {
    const{source,label, item} = this.props
    return (
      
      <View style={styles.container}>
        
       <View style={styles.title} > 
        <TextMontserrat style={styles.titleText}>AMOUNT</TextMontserrat>
        </View>
       <View style={{alignItems:'center'}}>
          <MultiSlider
            values={[
              this.state.multiSliderValue[0],
              this.state.multiSliderValue[1],
            ]}
            sliderLength={isTablet?wp('45%'):wp('82%')}
            onValuesChange={this.multiSliderValuesChange}
            onValuesChangeFinish={()=>{this.props.modifyLimits({min:this.state.multiSliderValue[0], max:this.state.multiSliderValue[1]})}}
            min={0}
            max={1000000}
            step={1}
            unselectedStyle={{
              backgroundColor: '#d6d4d4',
            }}
            selectedStyle={{
              backgroundColor: '#174285',
            }}
            trackStyle={{
            height: hp(0.3),
          }}
          touchDimensions={{
            height: 40,
            width: 40,
            borderRadius: 20,
            slipDisplacement: 40,
          }}
          markerStyle={{ height:hp('3.3%'), width: hp('3.3%'), borderRadius: 20,backgroundColor:'white', borderWidth: hp(0.38), borderColor: '#174285'}}
          allowOverlap
            snapped
        />
          </View>
           
           <View style={styles.sliderOne}>
            <View style={{width:'30%',alignItems:'center', justifyContent:'center'}}>
           <Image source={require('./Input.png')} style={{width: wp(isTablet?'10%': '28%'),position:'absolute',justifyContent:'center'}} /> 
           
            <TextInput 
            keyboardType="numeric" 
            returnKeyType={'done'}
            style={styles.text} 
            onChangeText={(val)=>{
              this.setState({
                multiSliderValue:[
                  parseFloat(
                    val.length<2?
                    0:val[val.length-1]=='.'?val.substr(1)+'0':val.substr(1)),
                  
                  this.state.multiSliderValue[1]]})}}
            onBlur={()=>{
              if(this.state.multiSliderValue[0]<this.state.multiSliderValue[1]){
                this.props.modifyLimits({min:this.state.multiSliderValue[0], max:this.state.multiSliderValue[1]})
              }else{
                this.setState({multiSliderValue:[this.state.multiSliderValue[1]-1,this.state.multiSliderValue[1]]})
                this.props.modifyLimits({min:this.state.multiSliderValue[1]-1, max:this.state.multiSliderValue[1]})
              } 
              this.props.modifyLimits({min:this.state.multiSliderValue[0], max:this.state.multiSliderValue[1]})
            }}
            onSubmitEditing={()=>{
              if(this.state.multiSliderValue[0]<this.state.multiSliderValue[1]){
                this.props.modifyLimits({min:this.state.multiSliderValue[0], max:this.state.multiSliderValue[1]})
              }else{
                this.setState({multiSliderValue:[this.state.multiSliderValue[1]-1,this.state.multiSliderValue[1]]})
                this.props.modifyLimits({min:this.state.multiSliderValue[1]-1, max:this.state.multiSliderValue[1]})
              } 
              this.props.modifyLimits({min:this.state.multiSliderValue[0], max:this.state.multiSliderValue[1]})
            }}
            value={`₹${this.state.multiSliderValue[0]}`}/>
            </View>
            
            <View style={{width:'30%',alignItems:'center', justifyContent:'center'}}>
           <Image source={require('./Input.png')} style={{width: wp(isTablet?'10%': '28%'),position:'absolute',justifyContent:'center'}} /> 
           
            <TextInput 
            keyboardType="numeric" 
            style={styles.text} 
            returnKeyType={'done'}
            onChangeText={(val)=>{this.setState({multiSliderValue:[this.state.multiSliderValue[0],parseFloat(val.length>10?1000000:val.length<2?0:val[val.length-1]=='.'?val.substr(1)+'0':val.substr(1))]})}}
            onSubmitEditing={()=>{if(this.state.multiSliderValue[1]>this.state.multiSliderValue[0]){
              this.props.modifyLimits({min:this.state.multiSliderValue[0], max:this.state.multiSliderValue[1]})
            }else{
              this.setState({multiSliderValue:[this.state.multiSliderValue[0],this.state.multiSliderValue[0]+1]})
              this.props.modifyLimits({min:this.state.multiSliderValue[0], max:this.state.multiSliderValue[0]+1})
            } }} 
            onBlur={()=>{if(this.state.multiSliderValue[1]>this.state.multiSliderValue[0]){
              this.props.modifyLimits({min:this.state.multiSliderValue[0], max:this.state.multiSliderValue[1]})
            }else{
              this.setState({multiSliderValue:[this.state.multiSliderValue[0],this.state.multiSliderValue[0]+1]})
              this.props.modifyLimits({min:this.state.multiSliderValue[0], max:this.state.multiSliderValue[0]+1})
            } }}
            value={`₹${this.state.multiSliderValue[1]}`}/>
            </View>
          </View>
      </View>
    );
  }
}

const styles = EStyleSheet.create({
  container: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    width:'100%',
    borderBottomWidth: 0.9,
    borderBottomColor: '#efefef',
    
  },
  title:{
    paddingTop:hp('1.1%'),
    paddingLeft:wp('1.8%')
    
  },
  titleText:{
    color: colors.slateGray,
    fontSize: hp('1.8%'),
    fontWeight: '600',
    letterSpacing:1.2
  },
  sliders: {
    width: 0,
  },
  text: {
    fontFamily:'Montserrat-Regular',
    color:'rgba(0,0,0,0.7)',
    paddingVertical: 0,
    fontSize:isTablet?hp('2.4%'):wp('3.6%'),
    width:'100%',
    textAlign:'center',
    fontWeight: '900',
  },
  sliderOne: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal:isTablet?wp('2%') :wp(3),
    paddingBottom:hp(2),
  },
  
});
