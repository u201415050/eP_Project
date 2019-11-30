import React, { Component } from 'react';
import { LinearGradient, Stop } from 'react-native-svg';
class BlackToWhiteOne extends Component {
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
        <Stop offset="0%" stopColor="#595959" stopOpacity="0" />
        <Stop offset="12%" stopColor="#4d4d4d" stopOpacity="0.12" />
        <Stop offset="28%" stopColor="#404040" stopOpacity="0.28" />
        <Stop offset="46%" stopColor="#333333" stopOpacity="0.46" />
        <Stop offset="65%" stopColor="#262626" stopOpacity="0.65" />
        <Stop offset="85%" stopColor="#1a1a1a" stopOpacity="0.85" />
        <Stop offset="100%" stopColor="#000000" stopOpacity="1" />
      </LinearGradient>
    );
  }
}

export default BlackToWhiteOne;
