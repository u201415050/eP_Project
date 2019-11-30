import React, { Component } from 'react';
import Svg, { G, Path } from 'react-native-svg';
class ArrowIcon extends Component {
  render() {
    return (
      <Svg width="8.886" height="15.863" viewBox="0 0 8.886 15.863">
        <G id="arrow" transform="translate(8.943 15.932) rotate(180)">
          <Path
            id="Shape"
            d="M7.886,15.7a.6.6,0,0,0,.829,0,.544.544,0,0,0,0-.793L1.429,7.932,8.714.957a.544.544,0,0,0,0-.793.6.6,0,0,0-.829,0L.171,7.535a.544.544,0,0,0,0,.793L7.886,15.7Z"
            transform="translate(0.057 0.068)"
            fill="#aab2b7"
          />
        </G>
      </Svg>
    );
  }
}

export default ArrowIcon;
