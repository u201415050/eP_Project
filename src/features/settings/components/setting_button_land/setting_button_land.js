import React, { Component } from 'react';
import { View, TouchableOpacity, StyleSheet, Image } from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import colors from '../../styles/colors';
import { TextMontserrat } from 'components';
import ToggleIcon from '../icons/toggle_icon/toggle_icon';
import ArrowIcon from '../icons/arrow_icon/arrow_icon';
import { isTablet } from '../../constants/isLandscape';
import SettingLandscape from './set_land'
class SettingButtonLandscape extends Component {
  onPress = () => {
    if (this.props.type !== 'touchable') {
      return false;
    }
    if (this.props.onPress) {
      this.props.onPress();
    }
  };
  state={
    active:-1
  }
  renderRight = () => {
    if (this.props.type === 'touchable') {
      return (
        <View style={{ marginRight: 15 }}>
          {
            isTablet?
            <Image source={require('../../assets/img/arrow.png')} style={{width:hp('1.3%'),height:hp('2.6%'),
            transform: [{ rotate: this.props.active && this.props.child!=null ? '90deg' : '0deg' }],}}
            />
            :
            <ArrowIcon color='black' size={true}/>
          }
        </View>
      );
    }
    if (this.props.type === 'toggle') {
      return (
        <ToggleIcon toggle={this.props.toggle} checked={this.props.checked} />
      );
    }
  };
  render() {
    const { size, type, renderIcon,active,child,backgroundColor,backgroundColorActive,activeChild,childPress } = this.props;
    const heightBox = this.props.heightBox || hp('10%');
    return (
      <View>
      <TouchableOpacity
        activeOpacity={type !== 'touchable' ? 1 : 0.6}
        onPress={this.onPress}
        style={[styles.container, { height: heightBox },backgroundColor?{backgroundColor}:null, (active&&child==null)?{backgroundColor:backgroundColorActive||'#52565F'}:null]}
      >
        <View style={{justifyContent:'center',alignItems:'center',}}>
          <View style={{ width: size, height: size,justifyContent:'center',alignItems:'center' }}>{renderIcon()}</View>
        </View>
        <View>
          <TextMontserrat
            style={{
              color: this.props.active && this.props.title != 'Hardware' ? '#FFF' : '#52565F',
              opacity: 0.9,
              marginLeft: this.props.noIcon ? hp('0%') : hp('2.5%'),
              fontWeight: '900',
              fontSize: this.props.fontText || hp('2.1%'),
            }}
          >
            {this.props.title}
          </TextMontserrat>
        </View>
        <View
          style={{
            flex: 1,
            alignItems: 'flex-end',
            justifyContent: 'flex-end',
            alignContent: 'flex-end',
            marginRight: 20,
          }}
        >
          {this.renderRight()}
        </View>
      </TouchableOpacity>
      <View>
      {
        child!=null&&active?
        child.map((item,i)=>{
          return (
            <SettingLandscape
              onPress={()=>childPress(i)}
              key={`${item.title}${i}`}
              renderIcon={() => (
                <Image
                  source={item.image}
                  style={{marginLeft:-1.3, width: hp('5.7%'), height: hp('5.7%') }}
                />
              )}
              type={item.type}
              size={45}
              heightBox={hp('9%')}
              title={item.label}
              backgroundColorActive='#52565F'
              backgroundColor='#E8E8E8'
              active={activeChild==i}
            />
          );
        })
        :null
      }
      </View>
      </View>
    );
  }
}

// define your styles
const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    width: '100%',
    borderBottomColor: 'rgba(0,0,0,0.6)',
    borderBottomWidth: 1,
    backgroundColor: colors.white,
    paddingLeft: hp('2.5%'),
  },
});

export default SettingButtonLandscape;
