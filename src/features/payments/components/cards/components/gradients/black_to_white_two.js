import React, { Component } from 'react';
import { LinearGradient, Stop } from 'react-native-svg';
class BlackToWhiteTwo extends Component {
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
        <Stop offset="0%" stopColor="#fff" />
        <Stop offset="22%" stopColor="#ededed" />
        <Stop offset="66%" stopColor="#bebebe" />
        <Stop offset="96%" stopColor="#999" />
      </LinearGradient>
    );
  }
}

export default BlackToWhiteTwo;
