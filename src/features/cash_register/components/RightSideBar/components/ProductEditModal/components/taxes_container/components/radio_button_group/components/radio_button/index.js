import React, { Component } from 'react';
import { View, Text, TouchableOpacity, Dimensions } from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { TextMontserrat } from 'components';

const isPortrait = () => {
  const dim = Dimensions.get('window');
  if (dim.height >= dim.width) {
    return true;
  } else {
    return false;
  }
};

class RadioButton extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isPortrait: isPortrait(),
    };
  }

  render() {
    return (
      <TouchableOpacity
        style={{
          width: '35%',
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
        activeOpacity={0.8}
        onPress={this.props.onPress}
      >
        <View
          style={{
            height: hp('3%'),
            width: hp('3%'),
            backgroundColor: '#fff',
            borderWidth: hp('0.2%'),
            borderRadius: 30,
            borderColor: this.props.selected ? '#174285' : '#6B6B6B',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          {this.props.selected && (
            <View
              style={{
                height: hp('1.75%'),
                width: hp('1.75%'),
                backgroundColor: '#174285',
                borderRadius: 30,
              }}
            />
          )}
        </View>
        <TextMontserrat
          style={{
            color: this.props.selected ? '#174285' : '#6B6B6B',
            fontSize: this.state.isPortrait ? wp('3.4%') : hp('2.2%'),
            fontWeight: '600',
          }}
        >
          {this.props.label}
        </TextMontserrat>
      </TouchableOpacity>
    );
  }
}

export default RadioButton;
