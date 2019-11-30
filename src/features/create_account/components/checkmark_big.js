import React, { Component } from 'react';
import { View, TouchableWithoutFeedback } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import EStyleSheet from 'react-native-extended-stylesheet';

export default class CheckmarkBig extends Component {
  getStyles = () => {
    return EStyleSheet.create({
      container: {
        backgroundColor: this.props.checked ? '#CFF1E8' : 'rgb(190,193, 204)',
        borderRadius: 50,
        width: this.props.size,
        height: this.props.size,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: '.5rem',
      },
    });
  };

  getIconSize = () => {
    return EStyleSheet.create({
      size: 16,
      '@media (min-width: 500)': {
        size: 21,
      },
    });
  };
  render() {
    const { container } = this.getStyles();
    const { checked, onPress } = this.props;
    const size = this.getIconSize().size;
    return (
      <TouchableWithoutFeedback onPress={onPress}>
        <View style={container}>
          <Icon
            color={checked ? '#09BA83' : 'rgb(73,82,92)'}
            size={size}
            name="check"
            style={{
              width: size,
              height: size,
            }}
          />
        </View>
      </TouchableWithoutFeedback>
    );
  }
}
