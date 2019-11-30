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
class CashPosIcon extends Component {
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
          <ClipPath id="clip-path">
            <Path
              id="Rectangle"
              d="M1.03,0H12.2a1.03,1.03,0,0,1,1.03,1.03V4.1a0,0,0,0,1,0,0H0a0,0,0,0,1,0,0V1.03A1.03,1.03,0,0,1,1.03,0Z"
              transform="translate(4.2 0.057) rotate(90)"
              fill="none"
              stroke="#0354bc"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-miterlimit="10"
              stroke-width="0.776"
            />
          </ClipPath>
        </Defs>
        <G id="Cashatpos" transform="translate(-0.142 -0.159)">
          <G id="qqq">
            <Circle
              id="Oval"
              cx="19.655"
              cy="19.655"
              r="19.655"
              transform="translate(0.142 0.159)"
              fill="url(#linear-gradient)"
            />
          </G>
          <G id="cash2poss" transform="translate(12.364 10.909)">
            <Ellipse
              id="Oval-2"
              data-name="Oval"
              cx="0.928"
              cy="0.904"
              rx="0.928"
              ry="0.904"
              transform="translate(0.944 12.161)"
              fill="#83d0f5"
            />
            <G id="Group" transform="translate(11.733 2.338)">
              <Path
                id="Rectangle-2"
                data-name="Rectangle"
                d="M1.03,0H12.2a1.03,1.03,0,0,1,1.03,1.03V4.1a0,0,0,0,1,0,0H0a0,0,0,0,1,0,0V1.03A1.03,1.03,0,0,1,1.03,0Z"
                transform="translate(4.2 0.057) rotate(90)"
                fill="none"
                stroke="#0354bc"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-miterlimit="10"
                stroke-width="0.776"
              />
              <G id="Group-2" data-name="Group" clip-path="url(#clip-path)">
                <Path
                  id="Path"
                  d="M1.979,0A1.956,1.956,0,0,1,0,1.93V.657A.646.646,0,0,1,.2.193.681.681,0,0,1,.672,0Z"
                  transform="translate(-3.509 -0.26)"
                  fill="#83d0f5"
                />
                <Path
                  id="Path-2"
                  data-name="Path"
                  d="M1.979,1.93a2.006,2.006,0,0,1-1.4-.565A1.9,1.9,0,0,1,0,0H1.307a.681.681,0,0,1,.476.193.646.646,0,0,1,.2.465Z"
                  transform="translate(2.088 -0.475)"
                  fill="#83d0f5"
                />
                <Path
                  id="Path-3"
                  data-name="Path"
                  d="M0,1.93A1.956,1.956,0,0,1,1.979,0V1.273a.646.646,0,0,1-.2.465.681.681,0,0,1-.476.193Z"
                  transform="translate(2.088 10.727)"
                  fill="#83d0f5"
                />
                <Path
                  id="Path-4"
                  data-name="Path"
                  d="M.008,0A1.956,1.956,0,0,1,1.981,1.93H.675A.681.681,0,0,1,.2,1.739.646.646,0,0,1,0,1.275Z"
                  transform="translate(-3.848 11.626)"
                  fill="#83d0f5"
                />
                <Rect
                  id="Rectangle-3"
                  data-name="Rectangle"
                  width="13.234"
                  height="8.096"
                  rx="1.03"
                  transform="translate(4.067 -0.073) rotate(90)"
                  stroke-width="0.776"
                  stroke="#0354bc"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-miterlimit="10"
                  fill="none"
                />
                <Path
                  id="Path-5"
                  data-name="Path"
                  d="M2.432,2.371A2.4,2.4,0,0,1,0,0"
                  transform="translate(1.635 -0.075)"
                  fill="none"
                  stroke="#0354bc"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-miterlimit="10"
                  stroke-width="0.776"
                />
                <Path
                  id="Path-6"
                  data-name="Path"
                  d="M2.432,0A2.4,2.4,0,0,0,0,2.369"
                  transform="translate(1.635 10.79)"
                  fill="none"
                  stroke="#0354bc"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-miterlimit="10"
                  stroke-width="0.776"
                />
                <Ellipse
                  id="Oval-3"
                  data-name="Oval"
                  cx="2.36"
                  cy="2.299"
                  rx="2.36"
                  ry="2.299"
                  transform="translate(-2.848 4.805)"
                  fill="#83d0f5"
                />
                <Path
                  id="Path-7"
                  data-name="Path"
                  d="M0,0A2.4,2.4,0,0,1,2.432,2.369"
                  transform="translate(-3.853 10.79)"
                  fill="none"
                  stroke="#0354bc"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-miterlimit="10"
                  stroke-width="0.776"
                />
                <Path
                  id="Path-8"
                  data-name="Path"
                  d="M0,2.371a2.465,2.465,0,0,0,1.721-.695A2.338,2.338,0,0,0,2.432,0"
                  transform="translate(-3.853 -0.075)"
                  fill="none"
                  stroke="#0354bc"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-miterlimit="10"
                  stroke-width="0.776"
                />
                <Ellipse
                  id="Oval-4"
                  data-name="Oval"
                  cx="2.419"
                  cy="2.356"
                  rx="2.419"
                  ry="2.356"
                  transform="translate(-2.376 4.132)"
                  fill="none"
                  stroke="#0354bc"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-miterlimit="10"
                  stroke-width="0.776"
                />
              </G>
            </G>
            <Rect
              id="Rectangle-4"
              data-name="Rectangle"
              width="11.4"
              height="17.94"
              rx="1.441"
              transform="translate(0.133 0.13)"
              stroke-width="0.776"
              stroke="#0354bc"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-miterlimit="10"
              fill="none"
            />
            <Rect
              id="Rectangle-5"
              data-name="Rectangle"
              width="1.888"
              height="1.839"
              rx="0.916"
              transform="translate(3.355 10.761) rotate(-180)"
              stroke-width="0.776"
              stroke="#0354bc"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-miterlimit="10"
              fill="none"
            />
            <Rect
              id="Rectangle-6"
              data-name="Rectangle"
              width="1.888"
              height="1.839"
              rx="0.916"
              transform="translate(6.725 10.761) rotate(-180)"
              stroke-width="0.776"
              stroke="#0354bc"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-miterlimit="10"
              fill="none"
            />
            <Rect
              id="Rectangle-7"
              data-name="Rectangle"
              width="1.888"
              height="1.839"
              rx="0.916"
              transform="translate(10.096 10.761) rotate(180)"
              stroke-width="0.776"
              stroke="#0354bc"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-miterlimit="10"
              fill="none"
            />
            <Rect
              id="Rectangle-8"
              data-name="Rectangle"
              width="1.888"
              height="4.216"
              transform="translate(9.048 12.623)"
              fill="#83d0f5"
            />
            <Rect
              id="Rectangle-9"
              data-name="Rectangle"
              width="1.888"
              height="1.839"
              rx="0.916"
              transform="translate(3.459 13.681) rotate(-180)"
              stroke-width="0.776"
              stroke="#0354bc"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-miterlimit="10"
              fill="none"
            />
            <Rect
              id="Rectangle-10"
              data-name="Rectangle"
              width="1.888"
              height="1.839"
              rx="0.916"
              transform="translate(6.827 13.681) rotate(-180)"
              stroke-width="0.776"
              stroke="#0354bc"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-miterlimit="10"
              fill="none"
            />
            <Rect
              id="Rectangle-11"
              data-name="Rectangle"
              width="1.888"
              height="1.839"
              rx="0.916"
              transform="translate(3.459 16.642) rotate(-180)"
              stroke-width="0.776"
              stroke="#0354bc"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-miterlimit="10"
              fill="none"
            />
            <Rect
              id="Rectangle-12"
              data-name="Rectangle"
              width="1.888"
              height="1.839"
              rx="0.916"
              transform="translate(6.827 16.642) rotate(-180)"
              stroke-width="0.776"
              stroke="#0354bc"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-miterlimit="10"
              fill="none"
            />
            <Rect
              id="Rectangle-13"
              data-name="Rectangle"
              width="1.888"
              height="4.779"
              rx="0.305"
              transform="translate(10.197 16.639) rotate(180)"
              stroke-width="0.776"
              stroke="#0354bc"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-miterlimit="10"
              fill="none"
            />
            <Rect
              id="Rectangle-14"
              data-name="Rectangle"
              width="7.28"
              height="3.979"
              transform="translate(2.515 2.421)"
              fill="#83d0f5"
            />
            <Rect
              id="Rectangle-15"
              data-name="Rectangle"
              width="7.923"
              height="5.226"
              transform="translate(1.872 2.078)"
              stroke-width="0.776"
              stroke="#0354bc"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-miterlimit="10"
              fill="none"
            />
          </G>
        </G>
      </Svg>
    );
  }
}

export default CashPosIcon;
