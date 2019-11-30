import React, { Component } from 'react';
import { View, TouchableWithoutFeedback } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import EStyleSheet from 'react-native-extended-stylesheet';

export default class Checkmark extends Component {
  getStyles = () => {
    return EStyleSheet.create({
      container: {
        backgroundColor: this.props.checked
          ? 'rgb(50,150, 50)'
          : 'rgb(190,193, 204)',
        borderRadius: 50,
        width: this.getIconSize().size + 5,
        height: this.getIconSize().size + 5,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: '.5rem',
      },
    });
  };

  getIconSize = () => {
    return EStyleSheet.create({
      size: 14,
      '@media (min-width: 500)': {
        size: 20,
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
            color={checked ? 'rgb(255,255, 255)' : 'rgb(73,82,92)'}
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
