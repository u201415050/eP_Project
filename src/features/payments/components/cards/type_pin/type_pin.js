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
class TypePin extends Component {
  render() {
    const { width, height } = this.props;
    return (
      <Svg
        width={width || '201.534'}
        height={height || '212.005'}
        viewBox={`0 0 ${width || '201.534'} ${height || '212.005'}`}
      >
        <Defs>
          <BlackToWhiteOne
            id="linear-gradient"
            x1="129.4%"
            y1="50%"
            x2="28.9%"
            y2="50%"
          />
          <BlueOne id="linear-gradient-2" x1="0%" y1="49%" x2="100%" y2="49%" />
          <BlackToWhiteTwo id="linear-gradient-3" y1="50%" x2="100%" y2="50%" />
        </Defs>
        <G id="Group_56" data-name="Group 56" transform="translate(0.773 0.53)">
          <Ellipse
            id="Oval"
            cx="99.934"
            cy="99.842"
            rx="99.934"
            ry="99.842"
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
            cy="60.158"
            rx="60.334"
            ry="60.158"
            transform="translate(38.749 39.639)"
            fill="#cff1ff"
          />
          <Ellipse
            id="Oval-3"
            data-name="Oval"
            cx="6.706"
            cy="6.686"
            rx="6.706"
            ry="6.686"
            transform="translate(37.364 163.315)"
            fill="#fff"
            opacity="0.73"
          />
          <Path
            id="Path"
            d="M14.682,4.391a1.369,1.369,0,0,0-1.751-.815l-2.986,1.1V1.347A1.349,1.349,0,0,0,8.593,0H6.742A1.349,1.349,0,0,0,5.391,1.347V4.674l-3-1.048a1.321,1.321,0,0,0-1.068,0,1.415,1.415,0,0,0-.7.815L.053,6.2A1.363,1.363,0,0,0,.92,7.867L4.14,8.931,2.055,11.609a1.3,1.3,0,0,0-.267,1.031,1.363,1.363,0,0,0,.534.9l1.568,1.131a1.4,1.4,0,0,0,.8.266h.217a1.334,1.334,0,0,0,.817-.565l1.935-2.761L9.594,14.37a1.354,1.354,0,0,0,1.918.316l1.551-1.131a1.33,1.33,0,0,0,.55-.9,1.427,1.427,0,0,0-.267-1.031L11.262,8.948l3.2-1.064a1.383,1.383,0,0,0,.8-.7,1.277,1.277,0,0,0,0-1.048Z"
            transform="translate(52.574 90.566)"
            fill="#bacde9"
          />
          <Path
            id="Path-2"
            data-name="Path"
            d="M14.749,4.391A1.369,1.369,0,0,0,13,3.576l-2.986,1.1V1.347A1.349,1.349,0,0,0,8.66,0H6.809A1.349,1.349,0,0,0,5.457,1.347V4.674l-3.069-1.1a1.321,1.321,0,0,0-1.068,0,1.415,1.415,0,0,0-.7.815L.053,6.154A1.363,1.363,0,0,0,.92,7.817L4.14,8.881,2.055,11.559a1.3,1.3,0,0,0-.267,1.031,1.363,1.363,0,0,0,.534.9L3.889,14.62a1.4,1.4,0,0,0,.8.266h.217a1.335,1.335,0,0,0,.884-.565l1.985-2.644L9.661,14.37a1.354,1.354,0,0,0,1.918.316l1.551-1.131a1.33,1.33,0,0,0,.55-.9,1.427,1.427,0,0,0-.267-1.031L11.329,8.948l3.2-1.064a1.383,1.383,0,0,0,.8-.7,1.277,1.277,0,0,0,0-1.048Z"
            transform="translate(72.207 90.566)"
            fill="#bacde9"
          />
          <Path
            id="Path-3"
            data-name="Path"
            d="M14.765,4.391A1.369,1.369,0,0,0,13.1,3.576l-2.986,1.1V1.347A1.349,1.349,0,0,0,8.76,0H6.809A1.349,1.349,0,0,0,5.457,1.347V4.674l-3.069-1.1a1.321,1.321,0,0,0-1.068,0,1.415,1.415,0,0,0-.7.815L.053,6.154A1.363,1.363,0,0,0,.92,7.817L4.14,8.881,2.055,11.559a1.3,1.3,0,0,0-.267,1.031,1.363,1.363,0,0,0,.534.9L3.889,14.62a1.4,1.4,0,0,0,.8.266h.217a1.335,1.335,0,0,0,.884-.565l1.935-2.761L9.661,14.37a1.354,1.354,0,0,0,1.918.316l1.551-1.131a1.33,1.33,0,0,0,.55-.9,1.427,1.427,0,0,0-.267-1.031L11.329,8.948l3.2-1.064a1.383,1.383,0,0,0,.8-.7,1.277,1.277,0,0,0,0-1.048Z"
            transform="translate(91.907 90.566)"
            fill="#bacde9"
          />
          <Rect
            id="Rectangle"
            width="11.66"
            height="5.455"
            rx="2.266"
            transform="translate(112.06 100.146)"
            fill="#bacde9"
          />
          <Path
            id="Path-4"
            data-name="Path"
            d="M7.473,7.019H92.878L79.033,0,0,4.374l.267.2A11.7,11.7,0,0,0,7.473,7.019Z"
            transform="translate(58.198 203.049)"
            opacity="0.55"
            fill="url(#linear-gradient)"
          />
          <Rect
            id="Rectangle-2"
            data-name="Rectangle"
            width="11.66"
            height="5.455"
            rx="2.266"
            transform="translate(129.508 100.146)"
            fill="#bacde9"
          />
          <Rect
            id="Rectangle-3"
            data-name="Rectangle"
            width="113.515"
            height="74.747"
            rx="8.78"
            transform="matrix(0.976, -0.217, 0.217, 0.976, 41.114, 138.509)"
            fill="url(#linear-gradient-2)"
          />
          <Path
            id="Rectangle-4"
            data-name="Rectangle"
            d="M0,0,114.464.071l.01,16.085L.01,16.085Z"
            transform="matrix(0.976, -0.217, 0.217, 0.976, 44.028, 156.086)"
            fill="url(#linear-gradient-3)"
          />
          <Path
            id="Rectangle-5"
            data-name="Rectangle"
            d="M0,0,41.129.026l0,3.709L0,3.709Z"
            transform="translate(112.984 179.014) rotate(-12.93)"
            fill="#bacde9"
          />
          <Path
            id="Rectangle-6"
            data-name="Rectangle"
            d="M0,0,23.633.015l0,3.709L0,3.709Z"
            transform="translate(131.445 181.243) rotate(-12.93)"
            fill="#bacde9"
          />
          <Ellipse
            id="Oval-4"
            data-name="Oval"
            cx="6.939"
            cy="6.919"
            rx="6.939"
            ry="6.919"
            transform="translate(63.269 185.419)"
            fill="#fff"
            opacity="0.73"
          />
          <Ellipse
            id="Oval-5"
            data-name="Oval"
            cx="6.939"
            cy="6.919"
            rx="6.939"
            ry="6.919"
            transform="translate(71.393 183.506)"
            fill="#fff"
            opacity="0.73"
          />
        </G>
      </Svg>
    );
  }
}

export default TypePin;
