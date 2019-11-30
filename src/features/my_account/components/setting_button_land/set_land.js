import React, { Component } from 'react';
import { View, TouchableOpacity, StyleSheet, Image ,Text} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import colors from '../../styles/colors';
import { TextMontserrat } from 'components';
import ToggleIcon from '../icons/toggle_icon/toggle_icon';
import ArrowIcon from '../icons/arrow_icon/arrow_icon';
import { isTablet } from '../../constants/isLandscape';

class SettingLandscape extends Component {
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
            <Image source={require('../../assets/img/arrow.png')} style={{width:hp('1.3%'),height:hp('2.6%')}}/>
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
    const { size, type, renderIcon,active,child,backgroundColor,backgroundColorActive } = this.props;
    const heightBox = this.props.heightBox || hp('10%');
    return (
      <View>
      <TouchableOpacity
        activeOpacity={type !== 'touchable' ? 1 : 0.6}
        onPress={this.onPress}
        style={[styles.container, { height: heightBox },backgroundColor?{backgroundColor}:null, (active&&child==null)?{backgroundColor:backgroundColorActive||'#52565F'}:null]}
      >
        <View>
          <View style={{ width: size, height: size }}>{renderIcon()}</View>
        </View>
        <View>
          <TextMontserrat
            style={{
              color: '#52565F',
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

export default SettingLandscape;
