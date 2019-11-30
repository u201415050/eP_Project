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
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
class PaymentsIcon extends Component {
  render() {
    const { width, height } = this.props;
    return (
      <Svg
        style={{ elevation: 3, borderRadius: 50 }}
        width={hp('6%')}
        height={hp('6%')}
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
          id="Cash_Copy_2"
          data-name="Cash Copy 2"
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
            id="Asset_9"
            data-name="Asset 9"
            transform="translate(8.571 10.714)"
          >
            <Rect
              id="Rectangle"
              width="17.892"
              height="2.729"
              transform="translate(1.255 1.375)"
              fill="#85d1f5"
            />
            <Path
              id="Path"
              d="M0,0A2.708,2.708,0,0,1,2.687,2.729H.928a.9.9,0,0,1-.648-.271A.932.932,0,0,1,.014,1.8Z"
              transform="translate(3.393 14.35)"
              fill="#85d1f5"
            />
            <Path
              id="Path-2"
              data-name="Path"
              d="M2.687,0A2.75,2.75,0,0,1,1.9,1.929a2.666,2.666,0,0,1-1.9.8V.925A.918.918,0,0,1,.911,0Z"
              transform="translate(3.087 6.639)"
              fill="#85d1f5"
            />
            <Path
              id="Path-3"
              data-name="Path"
              d="M2.687,2.729A2.708,2.708,0,0,1,0,0H1.758a.918.918,0,0,1,.911.925Z"
              transform="translate(18.687 6.639)"
              fill="#85d1f5"
            />
            <Path
              id="Path-4"
              data-name="Path"
              d="M0,2.729A2.708,2.708,0,0,1,2.687,0V1.786a.932.932,0,0,1-.266.656.9.9,0,0,1-.645.272Z"
              transform="translate(19.938 14.804)"
              fill="#85d1f5"
            />
            <Rect
              id="Rectangle-2"
              data-name="Rectangle"
              width="18.43"
              height="11.154"
              rx="1.415"
              transform="translate(3.643 6.639)"
              stroke-width="1.067"
              stroke="#2557a4"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-miterlimit="10"
              fill="none"
            />
            <Path
              id="Path-5"
              data-name="Path"
              d="M3.3,0a3.377,3.377,0,0,1-.962,2.376A3.273,3.273,0,0,1,0,3.361"
              transform="translate(3.643 6.639)"
              fill="none"
              stroke="#2557a4"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-miterlimit="10"
              stroke-width="1.067"
            />
            <Path
              id="Path-6"
              data-name="Path"
              d="M0,0A3.377,3.377,0,0,0,.962,2.376,3.273,3.273,0,0,0,3.3,3.361"
              transform="translate(18.774 6.639)"
              fill="none"
              stroke="#2557a4"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-miterlimit="10"
              stroke-width="1.067"
            />
            <Ellipse
              id="Oval-2"
              data-name="Oval"
              cx="3.204"
              cy="3.254"
              rx="3.204"
              ry="3.254"
              transform="translate(10.437 9.661)"
              fill="#85d1f5"
            />
            <Path
              id="Path-7"
              data-name="Path"
              d="M0,3.35A3.325,3.325,0,0,1,3.3,0"
              transform="translate(18.775 14.2)"
              fill="none"
              stroke="#2557a4"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-miterlimit="10"
              stroke-width="1.067"
            />
            <Path
              id="Path-8"
              data-name="Path"
              d="M3.3,3.35A3.377,3.377,0,0,0,2.332.981,3.273,3.273,0,0,0,0,0"
              transform="translate(3.643 14.2)"
              fill="none"
              stroke="#2557a4"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-miterlimit="10"
              stroke-width="1.067"
            />
            <Path
              id="Path-9"
              data-name="Path"
              d="M.32,0a.968.968,0,0,1,.96.975C1.28,1.9.531,1.95,0,1.95L1.21,3.471"
              transform="translate(12.153 10.786)"
              fill="none"
              stroke="#2557a4"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-miterlimit="10"
              stroke-width="0.711"
            />
            <Path
              id="Path-10"
              data-name="Path"
              d="M1.6.179H0"
              transform="translate(12.044 10.607)"
              fill="none"
              stroke="#2557a4"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-miterlimit="10"
              stroke-width="0.711"
            />
            <Path
              id="Path-11"
              data-name="Path"
              d="M1.6.179H0"
              transform="translate(12.044 11.582)"
              fill="none"
              stroke="#2557a4"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-miterlimit="10"
              stroke-width="0.711"
            />
            <Ellipse
              id="Oval-3"
              data-name="Oval"
              cx="3.281"
              cy="3.332"
              rx="3.281"
              ry="3.332"
              transform="translate(9.502 8.85)"
              fill="none"
              stroke="#2557a4"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeMiterlimit="10"
              strokeWidth="1.067"
            />
            <Rect
              id="Rectangle-3"
              data-name="Rectangle"
              width="18.142"
              height="2.379"
              transform="translate(0.176 2.329)"
              stroke-width="1.067"
              stroke="#2557a4"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-miterlimit="10"
              fill="none"
            />
            <Path
              id="Path-12"
              data-name="Path"
              d="M3.316,11.868H1.582A1.6,1.6,0,0,1,0,10.254V1.607A1.6,1.6,0,0,1,1.582,0h14.97a1.6,1.6,0,0,1,1.589,1.607V6.461"
              transform="translate(0.176 0.179)"
              fill="none"
              stroke="#2557a4"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-miterlimit="10"
              stroke-width="1.067"
            />
          </G>
        </G>
      </Svg>
    );
  }
}

export default PaymentsIcon;
