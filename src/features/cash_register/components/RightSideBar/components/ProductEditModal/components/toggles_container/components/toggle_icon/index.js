import React, { Component } from 'react';
import { TouchableOpacity } from 'react-native';
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
class ToggleIcon extends Component {
  render() {
    // const { width, height } = this.props;
    const newStyle = this.props.style;
    const width = newStyle.width;
    const height = newStyle.height;
    const circleWidth = newStyle.circleWidth;
    const circleHeight = newStyle.circleHeight;
    const toggleRadius = height / 2;
    const { checked } = this.props;
    return (
      <TouchableOpacity activeOpacity={1} onPress={this.props.toggle}>
        <Svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
          <Defs>
            <LinearGradient
              id="linear-gradient"
              x2="100%"
              y2="100%"
              gradientUnits="objectBoundingBox"
            >
              <Stop offset="0" stopColor="#174285" />
              <Stop offset="1" stopColor="#0079aa" />
            </LinearGradient>
          </Defs>
          <G
            id="Toggle_Off"
            data-name="Toggle / Off"
            transform="translate(0 0)"
          >
            <Rect
              id="Toggle_Off_background"
              data-name="Toggle / Off background"
              width={`${width}`}
              height={`${height}`}
              fill="rgba(0,0,0,0)"
            />
            <G id="Toggle_On" data-name="Toggle / On">
              <Rect
                id="Rectangle-2"
                data-name="Rectangle"
                width={`${width}`}
                height={`${height}`}
                rx={`${toggleRadius}`}
                fill="#d7dde1"
              />
              <G transform="matrix(1, 0, 0, 1, 0, -8.33)">
                <Rect
                  id="Rectangle-3"
                  data-name="Rectangle"
                  width={circleWidth}
                  height={circleHeight}
                  rx={`${toggleRadius}`}
                  transform={`translate(${checked ? width-circleWidth-1 : 2} 9)`}
                  fill={
                    checked ? 'url(#linear-gradient)' : 'rgba(255,255,255,1)'
                  }
                />
              </G>
            </G>
          </G>
        </Svg>
      </TouchableOpacity>
    );
  }
}

export default ToggleIcon;
