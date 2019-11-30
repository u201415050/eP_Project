import React, { Component } from 'react';
import { View, ImageBackground } from 'react-native';

class Background extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { color } = this.props;
    return (
      <View style={{ flex: 1 }}>
        <ImageBackground
          source={
            this.props.orientation == 'portrait'
              ? require('./assets/background_portrait.png')
              : require('./assets/background_landscape.png')
          }
          style={{ flex: 1, backgroundColor: color || null }}
          resizeMode={'cover'}
        >
          {this.props.children}
        </ImageBackground>
      </View>
    );
  }
}

export default Background;
