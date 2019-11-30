import React, { Component } from 'react';
import { View } from 'react-native';
import DeviceInfo from 'react-native-device-info';
export default class SafeAreaView extends Component {
  render() {
    const { color, fullscreen, bottom, bottomColor,disabled } = this.props;
    const bottomAvailable =
      DeviceInfo.getModel()
        .toUpperCase()
        .indexOf('X') != -1;
    return (
      <View
        style={{
          paddingTop:disabled?12:
          bottomAvailable
              ? 44
              : 24,
          backgroundColor: color || '#174285',
          ...(fullscreen ? { height: '100%' } : {}),
        }}
      >
        <View style={{ flex: 1 }}>{this.props.children}</View>

        {!disabled && bottomAvailable && fullscreen && (bottom || bottomColor) ? (
          <View
            style={{
              backgroundColor: bottomColor || 'rgb(30,30,30)',
              height: 34,
            }}
          />
        ) : null}
      </View>
    );
  }
}
