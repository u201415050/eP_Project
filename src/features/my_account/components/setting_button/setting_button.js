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

class SettingButton extends Component {
  onPress = () => {
    if (this.props.type !== 'touchable') {
      return false;
    }
    if (this.props.onPress) {
      this.props.onPress();
    }
  };
  renderRight = () => {
    if (this.props.type === 'touchable') {
      return (
        <View style={{ marginRight: 15 }}>
          <ArrowIcon />
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
    const { size, type, renderIcon } = this.props;
    const heightBox = this.props.heightBox || hp('10%');
    return (
      <TouchableOpacity
        activeOpacity={type !== 'touchable' ? 1 : 0.6}
        onPress={this.onPress}
        style={[styles.container, { height: heightBox }]}
      >
        {
          this.props.image?
      <Image source={this.props.backgroundImage} resizeMode="cover" style={{width:wp('95%'),height:'100%',backgroundColor:'rgba(50,50,50,0.1)', position:'absolute', top:0}}>
       
      </Image>:null }
        {this.props.noIcon ? null : (
          <View style={{ justifyContent: 'center', alignItems: 'center' }}>
            <View
              style={{
                width: size,
                height: size,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {renderIcon()}
            </View>
          </View>
        )}
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
    );
  }
}

// define your styles
const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    width: '95%',
    marginBottom: hp('1.7%'),
    backgroundColor: 'white',
    elevation: 3,
    borderRadius: 4,
    paddingLeft: hp('2.5%'),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
});

export default SettingButton;
