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
class TransactionsIcon extends Component {
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
          <G id="Asset_4" data-name="Asset 4" transform="translate(9 7)">
            <Ellipse
              id="Oval-2"
              data-name="Oval"
              cx="7.667"
              cy="7.589"
              rx="7.667"
              ry="7.589"
              transform="translate(5.419 6.621)"
              fill="#85d1f5"
            />
            <Path
              id="Path"
              d="M.766,0a2.29,2.29,0,0,1,2.3,2.278c0,2.153-1.8,2.278-3.068,2.278L2.872,8.1"
              transform="translate(9.525 9.238)"
              fill="none"
              stroke="#2557a4"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-miterlimit="10"
              stroke-width="1.21"
            />
            <Path
              id="Path-2"
              data-name="Path"
              d="M3.817.2H0"
              transform="translate(9.269 11.315)"
              fill="none"
              stroke="#2557a4"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-miterlimit="10"
              stroke-width="1.21"
            />
            <Ellipse
              id="Oval-3"
              data-name="Oval"
              cx="7.851"
              cy="7.77"
              rx="7.851"
              ry="7.77"
              transform="translate(3.182 4.734)"
              fill="none"
              stroke="#2557a4"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-miterlimit="10"
              stroke-width="1.21"
            />
            <Path
              id="Path-3"
              data-name="Path"
              d="M0,.2H3.817"
              transform="translate(9.269 9.036)"
              fill="none"
              stroke="#2557a4"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-miterlimit="10"
              stroke-width="1.21"
            />
            <Path
              id="Path-4"
              data-name="Path"
              d="M0,5.007A12.4,12.4,0,0,1,17.209,2.342"
              transform="translate(1.063 0.203)"
              fill="none"
              stroke="#2557a4"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-miterlimit="10"
              stroke-width="1.21"
            />
            <Path
              id="Path-5"
              data-name="Path"
              d="M3.259,0A34.732,34.732,0,0,1,0,3.363L5.056,4.742Z"
              transform="translate(16.769 0.923)"
              fill="none"
              stroke="#2557a4"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-miterlimit="10"
              stroke-width="1.21"
            />
            <Path
              id="Path-6"
              data-name="Path"
              d="M17.168,0A12.4,12.4,0,0,1,0,2.9"
              transform="translate(3.789 19.633)"
              fill="none"
              stroke="#2557a4"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-miterlimit="10"
              stroke-width="1.21"
            />
            <Path
              id="Path-7"
              data-name="Path"
              d="M1.833,4.718a35.229,35.229,0,0,1,3.227-3.4L0,0Z"
              transform="translate(0.204 19.452)"
              fill="none"
              stroke="#2557a4"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-miterlimit="10"
              stroke-width="1.21"
            />
          </G>
        </G>
      </Svg>
    );
  }
}

export default TransactionsIcon;
