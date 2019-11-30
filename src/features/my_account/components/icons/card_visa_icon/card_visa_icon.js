import React, { Component } from 'react';
import { View, Image } from 'react-native';
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
  Symbol,
  Defs,
  LinearGradient,
  RadialGradient,
  Stop,
  ClipPath,
  Pattern,
  Mask,
} from 'react-native-svg';
class CardVisaIcon extends Component {
  render() {
    const { size } = this.props;

    return (
      <View
        style={{
          width: size || 60,
          height: size || 60,
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Svg
          style={{ position: 'absolute' }}
          width="100%"
          height="100%"
          viewBox="0 0 39.199 39.199"
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
            id="Card_Copy_6"
            data-name="Card Copy 6"
            transform="translate(-0.142 -0.158)"
          >
            <G id="qqq">
              <Circle
                id="Oval"
                cx="19.599"
                cy="19.599"
                r="19.599"
                transform="translate(0.142 0.158)"
                fill="url(#linear-gradient)"
              />
            </G>
          </G>
        </Svg>
        <Image
          style={{ width: '75%', height: '75%' }}
          resizeMode="contain"
          source={require(`./../assets/cards/visa.png`)}
        />
      </View>
    );
  }
}

export default CardVisaIcon;
