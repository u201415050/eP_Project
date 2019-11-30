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
class Verifiying extends Component {
  render() {
    const { width, height } = this.props;
    return (
      <Svg
        width={width || '200.556'}
        height={height || '200.555'}
        viewBox={`0 0 ${width || '200.556'} ${height || '200.555'}`}
      >
        <Defs>
          <LinearGradient
            id="linear-gradient"
            x1="0.002"
            y1="0.499"
            x2="1.002"
            y2="0.499"
            gradientUnits="objectBoundingBox"
          >
            <Stop offset="0" stopColor="#2679be" />
            <Stop offset="0.04" stopColor="#2477bb" />
            <Stop offset="0.68" stopColor="#0a568a" />
            <Stop offset="1" stopColor="#004a77" />
          </LinearGradient>
          <LinearGradient
            id="linear-gradient-2"
            x1="0.002"
            y1="0.496"
            x2="1.002"
            y2="0.496"
            gradientUnits="objectBoundingBox"
          >
            <Stop offset="0" stopColor="#fff" />
            <Stop offset="0.22" stopColor="#ededed" />
            <Stop offset="0.66" stopColor="#bebebe" />
            <Stop offset="0.96" stopColor="#999" />
          </LinearGradient>

          <LinearGradient
            id="linear-gradient-6"
            x1="-0.26"
            y1="0.5"
            x2="5.776"
            y2="0.5"
            gradientUnits="objectBoundingBox"
          >
            <Stop offset="0" stopColor="#cddbef" />
            <Stop offset="1" stopColor="#96b5d3" />
          </LinearGradient>
        </Defs>
        <G
          id="Group_23"
          data-name="Group 23"
          transform="translate(0.157 0.568)"
        >
          <Circle
            id="Oval"
            cx="99.45"
            cy="99.45"
            r="99.45"
            transform="translate(0.671 0.26)"
            fill="none"
            stroke="#a0a0a0"
            strokeMiterlimit="10"
            strokeWidth="1.656"
            strokeDasharray="1.672"
          />
          <Ellipse
            id="Oval-2"
            data-name="Oval"
            cx="59.968"
            cy="59.995"
            rx="59.968"
            ry="59.995"
            transform="translate(39.245 39.366)"
            fill="#cff1ff"
          />
          <Ellipse
            id="Oval-3"
            data-name="Oval"
            cx="6.665"
            cy="6.668"
            rx="6.665"
            ry="6.668"
            transform="translate(37.869 162.706)"
            fill="#fff"
            opacity="0.73"
          />
          <Path
            id="Path"
            d="M.837.829h0Z"
            transform="translate(152.591 105.631)"
            fill="none"
          />
          <Rect
            id="Rectangle"
            width="112.808"
            height="74.475"
            rx="8.727"
            transform="translate(44.202 60.929)"
            fill="url(#linear-gradient)"
          />
          <Rect
            id="Rectangle-2"
            data-name="Rectangle"
            width="113.786"
            height="16.04"
            transform="translate(43.224 78.693)"
            fill="url(#linear-gradient-2)"
          />
          <Rect
            id="Rectangle-3"
            data-name="Rectangle"
            width="40.885"
            height="3.699"
            transform="matrix(1, -0.007, 0.007, 1, 105.161, 115.869)"
            fill="#bacde9"
          />
          <Rect
            id="Rectangle-4"
            data-name="Rectangle"
            width="23.493"
            height="3.699"
            transform="matrix(1, -0.007, 0.007, 1, 122.611, 122.04)"
            fill="#bacde9"
          />
          <Ellipse
            id="Oval-4"
            data-name="Oval"
            cx="6.897"
            cy="6.9"
            rx="6.897"
            ry="6.9"
            transform="translate(53.885 112.713)"
            fill="#fff"
            opacity="0.73"
          />
          <Ellipse
            id="Oval-5"
            data-name="Oval"
            cx="6.897"
            cy="6.9"
            rx="6.897"
            ry="6.9"
            transform="translate(62.175 112.614)"
            fill="#fff"
            opacity="0.73"
          />
          <Path
            id="Path-2"
            data-name="Path"
            d="M60.6,18.843C53.436,9.007,45.3,2.7,32.413,0,6.433,4.23,5.305,23.885,0,40.688,2.454,49.694,9.384,56.877,18.055,61.72H47.318A79.453,79.453,0,0,0,63.7,37.752Z"
            transform="translate(94.936 80.866)"
            fill="url(#linear-gradient-3)"
          />
          <Path
            id="Path-3"
            data-name="Path"
            d="M0,4.213H20.061A79.125,79.125,0,0,0,6.1,0C4.012,1.344,1.956,2.77,0,4.213Z"
            transform="translate(121.281 80.866)"
            fill="url(#linear-gradient-4)"
          />
          <Path
            id="Path-4"
            data-name="Path"
            d="M2.039.3C1.293,1.957.613,3.765,0,5.54l49.739-.315V0Z"
            transform="translate(95.383 114.604)"
            fill="#bacde9"
          />
          <Rect
            id="Rectangle-5"
            data-name="Rectangle"
            width="33.209"
            height="5.225"
            transform="translate(111.919 123.681) rotate(-0.37)"
            fill="#bacde9"
          />
          <Path
            id="Path-5"
            data-name="Path"
            d="M0,9.056H37.785L25.118,0,0,9.056Z"
            transform="translate(109.244 80.883)"
            fill="url(#linear-gradient-5)"
          />
          <Path
            id="Path-6"
            data-name="Path"
            d="M51.043,8.229A30.3,30.3,0,1,0,10.871,53.561C18.879,34.353,32.805,17.1,51.043,8.229Z"
            transform="translate(98.125 84.265)"
            fill="#fff"
            opacity="0.14"
          />
          <Path
            id="Path-7"
            data-name="Path"
            d="M4.543,0,40.007,24.88a5.376,5.376,0,1,1-6.168,8.808L0,5.9"
            transform="translate(152.832 135.553)"
            fill="#bacde9"
          />
          <Ellipse
            id="Oval-6"
            data-name="Oval"
            cx="30.855"
            cy="30.868"
            rx="30.855"
            ry="30.868"
            transform="translate(97.108 82.658)"
            fill="none"
            stroke="#bacde9"
            strokeMiterlimit="10"
            strokeWidth="6.624"
          />
          <Ellipse
            id="Oval-7"
            data-name="Oval"
            cx="4.079"
            cy="4.08"
            rx="4.079"
            ry="4.08"
            transform="translate(114.284 46.747)"
            fill="url(#linear-gradient-6)"
          />
          <Ellipse
            id="Oval-8"
            data-name="Oval"
            cx="4.079"
            cy="4.08"
            rx="4.079"
            ry="4.08"
            transform="translate(128.626 46.747)"
            fill="url(#linear-gradient-7)"
          />
          <Ellipse
            id="Oval-9"
            data-name="Oval"
            cx="4.079"
            cy="4.08"
            rx="4.079"
            ry="4.08"
            transform="translate(142.95 46.747)"
            fill="url(#linear-gradient-8)"
          />
          <Ellipse
            id="Oval-10"
            data-name="Oval"
            cx="4.079"
            cy="4.08"
            rx="4.079"
            ry="4.08"
            transform="translate(44.02 140.33)"
            fill="url(#linear-gradient-9)"
          />
          <Ellipse
            id="Oval-11"
            data-name="Oval"
            cx="4.079"
            cy="4.08"
            rx="4.079"
            ry="4.08"
            transform="translate(58.361 140.33)"
            fill="url(#linear-gradient-10)"
          />
          <Ellipse
            id="Oval-12"
            data-name="Oval"
            cx="4.079"
            cy="4.08"
            rx="4.079"
            ry="4.08"
            transform="translate(74.344 140.33)"
            fill="url(#linear-gradient-11)"
          />
        </G>
      </Svg>
    );
  }
}

export default Verifiying;
