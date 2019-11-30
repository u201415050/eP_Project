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
import BlackToWhiteOne from '../components/gradients/black_to_white_one';
import BlackToWhiteTwo from '../components/gradients/black_to_white_two';
import BlueOne from '../components/gradients/blue_one';
class InsertCard extends Component {
  render() {
    const { width, height } = this.props;
    return (
      <Svg
        width={width || '201.534'}
        height={height || '201.316'}
        viewBox={`0 0 ${width || '201.534'} ${height || '201.316'}`}
      >
        <Defs>
          <BlueOne id="linear-gradient" x1="0%" y1="49%" x2="100%" y2="49%" />
          <BlackToWhiteTwo
            id="linear-gradient-2"
            x1="0%"
            y1="49.7%"
            x2="100%"
            y2="49.7%"
          />
          <BlackToWhiteOne
            id="linear-gradient-3"
            x1="50%"
            y1="71%"
            x2="50%"
            y2="0%"
          />
          {/* <LinearGradient
            id="linear-gradient-3"
            x1="50%"
            y1="71%"
            x2="50%"
            y2="0%"
            gradientUnits="objectBoundingBox"
          >
            <Stop offset="0%" stopColor="#595959" stopOpacity="0" />
            <Stop offset="12%" stopColor="#4d4d4d" stopOpacity="0.12" />
            <Stop offset="28%" stopColor="#404040" stopOpacity="0.28" />
            <Stop offset="46%" stopColor="#333333" stopOpacity="0.46" />
            <Stop offset="65%" stopColor="#262626" stopOpacity="0.65" />
            <Stop offset="85%" stopColor="#1a1a1a" stopOpacity="0.85" />
            <Stop offset="100%" stopColor="#000000" stopOpacity="1" />
          </LinearGradient> */}
        </Defs>
        <G id="Group_22" data-name="Group 22" transform="translate(0.773 0.53)">
          <Ellipse
            id="Oval"
            cx="99.934"
            cy="99.825"
            rx="99.934"
            ry="99.825"
            transform="translate(0.06 0.303)"
            fill="none"
            stroke="#a0a0a0"
            strokeMiterlimit="10"
            strokeWidth="1.666"
            strokeDasharray="1.683"
          />
          <Ellipse
            id="Oval-2"
            data-name="Oval"
            cx="60.334"
            cy="60.148"
            rx="60.334"
            ry="60.148"
            transform="translate(38.749 39.632)"
            fill="#cff1ff"
          />
          <Ellipse
            id="Oval-3"
            data-name="Oval"
            cx="6.706"
            cy="6.685"
            rx="6.706"
            ry="6.685"
            transform="translate(37.364 163.287)"
            fill="#fff"
            opacity="0.73"
          />
          <Rect
            id="Rectangle"
            width="113.495"
            height="74.665"
            rx="8.78"
            transform="translate(43.736 61.25)"
            fill="url(#linear-gradient)"
          />
          <Rect
            id="Rectangle-2"
            data-name="Rectangle"
            width="114.48"
            height="16.08"
            transform="translate(42.769 79.043)"
            fill="url(#linear-gradient-2)"
          />
          <Rect
            id="Rectangle-3"
            data-name="Rectangle"
            width="41.135"
            height="3.709"
            transform="matrix(1, -0.007, 0.007, 1, 105.088, 116.327)"
            fill="#bacde9"
          />
          <Rect
            id="Rectangle-4"
            data-name="Rectangle"
            width="23.637"
            height="3.709"
            transform="matrix(1, -0.007, 0.007, 1, 122.627, 122.497)"
            fill="#bacde9"
          />
          <Ellipse
            id="Oval-4"
            data-name="Oval"
            cx="6.939"
            cy="6.918"
            rx="6.939"
            ry="6.918"
            transform="translate(53.478 113.166)"
            fill="#fff"
            opacity="0.73"
          />
          <Ellipse
            id="Oval-5"
            data-name="Oval"
            cx="6.939"
            cy="6.918"
            rx="6.939"
            ry="6.918"
            transform="translate(61.818 113.067)"
            fill="#fff"
            opacity="0.73"
          />
          <Path
            id="Path"
            d="M0,0H49.959C68.574,0,83.67,14.6,83.67,32.61H0Z"
            transform="translate(29.174 125.688)"
            fill="#bacde9"
          />
          <Path
            id="Path-2"
            data-name="Path"
            d="M51.71,6.652,4.17,8.315A4.157,4.157,0,1,1,4.17,0L51.71,1.663c2.3,0,4.17.2,4.17,2.494S54.012,6.652,51.71,6.652Z"
            transform="translate(113.178 65.723)"
            fill="#bacde9"
          />
          <Path
            id="Path-3"
            data-name="Path"
            d="M49.248,6.311,4.21,7.874a3.942,3.942,0,1,1,0-7.866L49.248,1.571c2.185,0,3.953.2,3.953,2.361S51.4,6.311,49.248,6.311Z"
            transform="translate(30.735 90.725)"
            fill="#bacde9"
          />
          <Path
            id="Path-4"
            data-name="Path"
            d="M32.129,4.024,3.055,5.039a2.546,2.546,0,1,1,0-4.989L32.129,1.064c1.4,0,2.552.116,2.552,1.513S33.481,4.024,32.129,4.024Z"
            transform="translate(138.246 100.146)"
            fill="#bacde9"
          />
          <Path
            id="Path-5"
            data-name="Path"
            d="M0,0H47.106C64.654,0,78.9,13.769,78.9,30.747H0Z"
            transform="translate(45.387 108.244)"
            opacity="0.55"
            fill="url(#linear-gradient-3)"
          />
        </G>
      </Svg>
    );
  }
}

export default InsertCard;
