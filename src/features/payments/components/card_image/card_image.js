import React, { Component } from 'react';
import { View, Image, TouchableOpacity } from 'react-native';
import * as card_names from './image_names';
class CardImage extends Component {
  images = {
    [card_names.INSERT]: require('./assets/insert.png'),
    [card_names.VERIFYING]: require('./assets/verifying.png'),
    [card_names.SUCCESS]: require('./assets/success.png'),
    [card_names.ERROR]: require('./assets/error.png'),
    [card_names.TYPE_PIN]: require('./assets/type_pin.png'),
  };
  render() {
    const { onPress } = this.props;
    return (
      <TouchableOpacity activeOpacity={onPress ? 0.5 : 1} onPress={onPress}>
        <Image
          style={{
            width: +this.props.size || 200,
            height: +this.props.size+10|| 200,
          }}
          resizeMode="contain"
          source={this.images[this.props.imageName]}
        />
      </TouchableOpacity>
    );
  }
}

export default CardImage;
