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
class DeviceIcon extends Component {
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
        <G id="Cash" transform="translate(-0.142 -0.158)">
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
            id="Asset_1"
            data-name="Asset 1"
            transform="translate(12.857 9.286)"
          >
            <Ellipse
              id="Oval-2"
              data-name="Oval"
              cx="1.075"
              cy="1.068"
              rx="1.075"
              ry="1.068"
              transform="translate(4.941 17.855)"
              fill="#85d1f5"
            />
            <Rect
              id="Rectangle"
              width="13.22"
              height="21.214"
              rx="1.925"
              strokeWidth="1.037"
              transform="translate(0.174 0.173)"
              stroke="#2557a4"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeMiterlimit="10"
              fill="none"
            />
            <Rect
              id="Rectangle-2"
              data-name="Rectangle"
              width="2.189"
              height="2.174"
              rx="1.085"
              transform="translate(7.858 19.656) rotate(180)"
              strokeWidth="1.037"
              stroke="#2557a4"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeMiterlimit="10"
              fill="none"
            />
            <Rect
              id="Rectangle-3"
              data-name="Rectangle"
              width="8.442"
              height="9.626"
              transform="translate(3.282 4.189)"
              fill="#85d1f5"
            />
            <Rect
              id="Rectangle-4"
              data-name="Rectangle"
              width="9.187"
              height="11.454"
              transform="translate(2.189 3.857)"
              strokeWidth="1.037"
              stroke="#2557a4"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeMiterlimit="10"
              fill="none"
            />
            <Path
              id="Path"
              d="M0,.173H4.74"
              transform="translate(4.451 1.901)"
              fill="none"
              stroke="#2557a4"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeMiterlimit="10"
              strokeWidth="1.037"
            />
          </G>
        </G>
      </Svg>
    );
  }
}

export default DeviceIcon;
