import React, { Component } from 'react';
import { View } from 'react-native';
import Svg, {
  Circle,
  Ellipse,
  G,
  Text,
  TSpan,
  TextPath,
  Path,
  Polygon,
  Polyline,
  Line,
  Rect,
  Use,
  Image,
  Symbol,
  Defs,
  LinearGradient,
  RadialGradient,
  Stop,
  ClipPath,
  Pattern,
  Mask,
} from 'react-native-svg';
class HardwareIcon extends Component {
  render() {
    const { width, height } = this.props;
    return (
      <Svg
        style={{ elevation: 3, borderRadius: 50 }}
        width="100%"
        height="100%"
        viewBox="0 0 39.042 39.042"
      >
        <Defs>
          <LinearGradient
            id="linear-gradient"
            x1="55%"
            y1="94%"
            x2="46%"
            y2="23%"
            gradientUnits="objectBoundingBox"
          >
            <Stop offset="0" stopColor="#b7cbd2" />
            <Stop offset="1" stopColor="#fff" />
          </LinearGradient>
        </Defs>
        <G
          id="Cash_Copy_3"
          data-name="Cash Copy 3"
          transform="translate(-0.142 -0.158)"
        >
          <G id="qqq">
            <Circle
              id="Oval"
              cx="19.521"
              cy="19.521"
              r="19.521"
              transform="translate(0.141 0.158)"
              fill="url(#linear-gradient)"
            />
          </G>
          <G
            id="Asset_10"
            data-name="Asset 10"
            transform="translate(12.143 9.286)"
          >
            <Path
              id="Path"
              d="M3.071,0l.946,1.885,2.121.3L4.6,3.653l.362,2.069-1.9-.978-1.9.978.362-2.069L0,2.186l2.121-.3L3.071,0Z"
              transform="translate(5.78 3.348)"
              fill="#85d1f5"
            />
            <Ellipse
              id="Oval-2"
              data-name="Oval"
              cx="6.248"
              cy="6.124"
              rx="6.248"
              ry="6.124"
              transform="translate(1.575 0.167)"
              fill="none"
              stroke="#2557a4"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-miterlimit="10"
              stroke-width="1.004"
            />
            <Path
              id="Path-2"
              data-name="Path"
              d="M7.751,1.785l-2.941,8.8L2.873,8.307,0,9.244,3.088,0"
              transform="translate(0.171 10.661)"
              fill="none"
              stroke="#2557a4"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-miterlimit="10"
              stroke-width="1.004"
            />
            <Path
              id="Rectangle"
              d="M0,.8A.787.787,0,0,1,.781.018L3.122,0a.787.787,0,0,1,.793.793L3.909.819a.783.783,0,0,1-.775.781L.793,1.618A.787.787,0,0,1,0,.825Z"
              transform="translate(11.503 18.172) rotate(-114.93)"
              fill="#85d1f5"
            />
            <Path
              id="Path-3"
              data-name="Path"
              d="M4.6,0,7.854,9.037l-2.883-.9L3.064,10.443,0,2.662"
              transform="translate(7.621 10.801)"
              fill="none"
              stroke="#2557a4"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-miterlimit="10"
              stroke-width="1.004"
            />
            <Path
              id="Path-4"
              data-name="Path"
              d="M3.071,0l.95,1.885,2.121.3L4.6,3.653,4.97,5.722l-1.9-.978-1.9.978.362-2.069L0,2.186l2.125-.3L3.071,0Z"
              transform="translate(4.752 3.348)"
              fill="none"
              stroke="#2557a4"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-miterlimit="10"
              stroke-width="1.004"
            />
            <Path
              id="Path-5"
              data-name="Path"
              d="M.734,0,0,1.848"
              transform="translate(4.728 12.238)"
              fill="none"
              stroke="#2557a4"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-miterlimit="10"
              stroke-width="1.004"
            />
            <Path
              id="Path-6"
              data-name="Path"
              d="M0,0,.857,2.407"
              transform="translate(10.908 14.605)"
              fill="none"
              stroke="#2557a4"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-miterlimit="10"
              stroke-width="1.004"
            />
          </G>
        </G>
      </Svg>
    );
  }
}

export default HardwareIcon;
