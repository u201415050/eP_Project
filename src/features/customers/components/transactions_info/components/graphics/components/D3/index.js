import React from 'react';
import {
  StyleSheet,
  View,
  SafeAreaView,
  Dimensions,
  Animated,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { TextMontserrat } from 'components';
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
import * as path from 'svg-path-properties';
import * as shape from 'd3-shape';
import { scaleTime, scaleLinear, scaleQuantile } from 'd3-scale';
import moment from 'moment';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { stylesPortrait } from './styles/portrait';
import { stylesLandscape } from './styles/landscape';
import { formatNumberCommasDecimal } from 'api';
import { isTablet } from '../../../../../../../cash_register/constants/isLandscape';

const styles = !isTablet ? stylesPortrait : stylesLandscape;

const d3 = {
  shape,
};

const height = styles.d3GraphicsContainer.height; //200;
const width = !isTablet
  ? styles.d3GraphicsContainer.width * 0.94
  : styles.d3GraphicsContainer.width * 0.96;

// const data = [
//   { x: new Date(2018, 2, 19), y: 100 },
//   { x: new Date(2018, 2, 20), y: 50 },
//   { x: new Date(2018, 2, 21), y: 200 },
//   { x: new Date(2018, 2, 22), y: 150 },
//   { x: new Date(2018, 2, 23), y: 250 },
//   { x: new Date(2018, 2, 24), y: 200 },
//   { x: new Date(2018, 2, 25), y: 300 },
// ];

const getDateRange = value => {
  const first = value[0];
  const last = value[value.length - 1];
  return [first.x, last.x];
};

const getMaxValue = value => {
  const numbers = value.map(v => v.y);
  return Math.max(...numbers);
};
const setMaxValueOnGraphic = value => {
  return value !== 0 ? value * 1.4 : 0; // returns 20% more to show on graphics
};

const getRangeOrdered = value => {
  return value
    .map(v => parseFloat(v.y))
    .sort((a, b) => {
      return a - b;
    })
    .filter((v, i, a) => a.indexOf(v) === i);
};
export default class App extends React.Component {
  scaleX = scaleTime()
    .domain(getDateRange(this.props.data))
    .range([0, width])
    .nice();
  scaleY = scaleLinear()
    .domain([0, setMaxValueOnGraphic(getMaxValue(this.props.data))])
    .range([height, 0]);
  scaleLabel = scaleQuantile()
    .domain([0, setMaxValueOnGraphic(getMaxValue(this.props.data))])
    .range(getRangeOrdered(this.props.data));

  line = d3.shape
    .line()
    .x(d => this.scaleX(d.x))
    .y(d => this.scaleY(d.y))
    .curve(d3.shape.curveMonotoneX)(this.props.data);
  properties = path.svgPathProperties(this.line);
  lineLength = this.properties.getTotalLength();

  cursor = React.createRef();

  label = React.createRef();

  state = {
    x: new Animated.Value(0),
    active: -1,
  };

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.d3GraphicsContainer}>
          <Svg {...{ width, height }}>
            <Defs>
              <LinearGradient x1="50%" y1="0%" x2="50%" y2="100%" id="gradient">
                <Stop
                  stopColor={this.props.gradient || '#76A5EE'}
                  offset="0%"
                />
                <Stop stopColor="#EFF2F6" offset="100%" />
              </LinearGradient>
            </Defs>
            <Path
              d={this.line}
              fill="transparent"
              stroke={this.props.lineColor || '#174285'}
              strokeWidth={4}
            />
            <Path
              d={`${this.line} L ${width} ${height} L 0 ${height}`}
              fill="url(#gradient)"
            />
          </Svg>
          {this.props.data.map((item, i) => {
            const extraStyle =
              i == 0
                ? { left: isTablet ? -hp('3%') : wp('3%') }
                : i == this.props.data.length - 1
                ? {
                    [isTablet ? 'right' : 'right']: isTablet
                      ? -hp('5%')
                      : -wp('1%'),
                  }
                : null;
            return (
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => this.setState({ active: i })}
                style={{
                  width: hp('3.6%'),
                  height: hp('3.6%'),
                  borderRadius: hp('3.6%'),
                  backgroundColor:
                    this.state.active == i
                      ? 'rgba(23, 66, 133, 0.5)'
                      : 'rgba(0,0,0,0)',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'absolute',
                  top: this.scaleY(this.props.data[i].y) - hp('1.8%'),
                  left: this.scaleX(this.props.data[i].x) - hp('1.8%'),
                }}
              >
                {this.state.active == i ? (
                  <TextMontserrat
                    style={{
                      color: '#174285',
                      fontWeight: '600',
                      textAlign: 'center',
                      position: 'absolute',
                      width: isTablet ? hp('30%') : wp('40%'),
                      fontSize: hp('2.0%'),
                      top: -hp('3%'),
                      ...extraStyle,
                    }}
                  >
                    ₹
                    {formatNumberCommasDecimal(
                      parseFloat(this.props.data[i].y).toFixed(2)
                    )}
                  </TextMontserrat>
                ) : null}
                <View style={styles.cursor} />
              </TouchableOpacity>
            );
          })}

          {
            <View style={styles.datesContainer}>
              {this.props.data.map(d => {
                return (
                  <TextMontserrat style={styles.datesTopAxis}>
                    {`${moment(d.x)
                      .startOf('day')
                      .format('DD/MM')}`}
                  </TextMontserrat>
                );
              })}
            </View>
          }
        </View>
      </View>
    );
  }
}
