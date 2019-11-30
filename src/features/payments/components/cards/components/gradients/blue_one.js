import React, { Component } from 'react';
import { LinearGradient, Stop } from 'react-native-svg';
class BlueOne extends Component {
  render() {
    const { id, x1, y1, x2, y2 } = this.props;
    return (
      <LinearGradient
        id={id}
        x1={x1}
        y1={y1}
        x2={x2}
        y2={y2}
        gradientUnits="objectBoundingBox"
      >
        <Stop offset="0%" stopColor="#2679be" />
        <Stop offset="0.4%" stopColor="#2477bb" />
        <Stop offset="68%" stopColor="#0a568a" />
        <Stop offset="100%" stopColor="#004a77" />
      </LinearGradient>
    );
  }
}

export default BlueOne;
