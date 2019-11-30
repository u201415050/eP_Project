import React, {Component} from 'react';
import { View, Dimensions } from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { ButtonGradient, ButtonOutline } from '../buttons';

const isPortrait = () => {
  const dim = Dimensions.get('window');
  if (dim.height >= dim.width) {
    return true;
  } else {
    return false;
  }
};

class ButtonsContainer extends Component {
  constructor(props) {
    super(props)
    
    this.state={
      isPortrait: isPortrait(),
    }
  }
  
  render() {
    return (
      <View style={{
        width:'100%', 
        flexDirection: 'row', 
        justifyContent: 'space-around',
        // paddingHorizontal: this.state.isPortrait ? wp('4.2%') : wp('2.75%'),
        paddingBottom: hp('1.75%')
        }}
      >
        <ButtonOutline
          title={'CANCEL'}
          buttonCustomStyle={
            this.state.isPortrait ?
            {
              width:wp('33.3%'), 
              height:hp('5.45%'), 
              backgroundColor:'#fff', 
              borderWidth:hp('0.25%'), 
              borderColor:'#b30000', 
              borderRadius:wp('4%'), 
              justifyContent:'center', 
              alignItems:'center',
              elevation:hp('0.5%'),
            }
            :
            {
              width:wp('11%'), 
              height:hp('5.45%'), 
              backgroundColor:'#fff', 
              borderWidth:hp('0.25%'), 
              borderColor:'#b30000', 
              borderRadius:hp('4%'), 
              justifyContent:'center', 
              alignItems:'center',
              elevation:hp('0.5%'),
            }
          }
          buttonTextStyle={
            {
              fontWeight: '700',
              fontSize: this.state.isPortrait ? wp('3%') : hp('2%'),
              color: '#b30000',
              letterSpacing: this.state.isPortrait ? wp('0.25%') : wp('0.15%'),
            }
          }
          onPress={() => {
            this.props.onCancel()
          }}
        />
        <ButtonGradient 
          title={'SAVE'}
          linearGradientStyle={
            this.state.isPortrait ? 
            {
              width:wp('33.3%'), 
              height:hp('5.45%'),  
              borderRadius:wp('4%'), 
              justifyContent:'center', 
              alignItems:'center',
              elevation:hp('0.5%'),
            }
            :
            {
              width:wp('11%'), 
              height:hp('5.45%'),  
              borderRadius:wp('4%'), 
              justifyContent:'center', 
              alignItems:'center',
              elevation:hp('0.5%'),
            }
          }
          buttonTextStyle={
            {
              fontWeight: '700',
              fontSize: this.state.isPortrait ? wp('3%') : hp('2%'),
              color: '#fff',
              letterSpacing: this.state.isPortrait ? wp('0.25%') : wp('0.15%'),
            }
          }
          onPress={() => {
            this.props.onSave()
          }}
        />
      </View>
    )
  }
}

export default ButtonsContainer;