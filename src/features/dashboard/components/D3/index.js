import React from 'react';
import {
  StyleSheet,
  View,
  SafeAreaView,
  Dimensions,
  Animated,
  TextInput,
  TouchableOpacity,
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
import { isTablet } from '../../../cash_register/constants/isLandscape';
import { formatNumberCommasDecimal } from 'api';
const isPortrait = () => {
  const dim = Dimensions.get('window');
  if (dim.height >= dim.width) {
    return true;
  } else {
    return false;
  }
};

const d3 = {
  shape,
};

const height = hp('30%'); //stylesPortrait.d3GraphicsContainer.height;//200;
const width = isTablet ? wp('50%') * 0.92 : wp('95%');
const verticalPadding = 5;
const cursorRadius = 10;
const labelWidth = 50;

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
  return Math.max(...numbers) < 1000 ? 1000 : Math.max(...numbers) + 10000;
};
const setMaxValueOnGraphic = value => {
  return value !== 0 ? value * 1.2 : 0; // returns 20% more to show on graphic
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
  /**var x = d3.scaleTime()
  .domain(d3.extent(getDateRange(this.props.data), function(d) { 
    return new Date(d.date); 
  }))
  .range([0, width]); */

  scaleX = scaleTime()
    .domain(getDateRange(this.props.data))
    .range([0, width])
    .nice();
  scaleY = scaleLinear()
    .domain([-100, setMaxValueOnGraphic(getMaxValue(this.props.data))])
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

  //cursor = React.createRef();

  //label = React.createRef();

  state = {
    x: new Animated.Value(0),
    active: -1,
  };

  render() {
    const { x } = this.state;
    const translateX = x.interpolate({
      inputRange: [0, this.lineLength],
      outputRange: [width - labelWidth, 0],
      extrapolate: 'clamp',
    });
    console.log('DATA SENDED:', this.props.data);
    return (
      <View style={stylesPortrait.container}>
        <View style={styles.container}>
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

          <View
            //scrollEnabled={false}
            //disabled={true}
            style={{
              width: this.lineLength * 2,
              position: 'absolute',
              left: 0,
              right: 0,
              top: 0,
              bottom: 0,
            }}
            //style={{width:'100%'}}
            //contentContainerStyle={{ width: this.lineLength * 2 }}

            horizontal
          />
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
              <View
                style={{
                  width: hp('3.6%'),
                  height: hp('3.6%'),
                  borderRadius: hp('3.6%'),
                  backgroundColor:
                    this.state.active == i
                      ? 'rgba(47,128,246,0.7)'
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
                      color: '#136EF1',
                      fontWeight: '600',
                      textAlign: 'center',
                      position: 'absolute',
                      width: isTablet ? hp('30%') : wp('40%'),
                      fontSize: hp('2.4%'),
                      top: -hp('3.5%'),
                      ...extraStyle,
                    }}
                  >
                    ₹
                    {formatNumberCommasDecimal(
                      parseFloat(this.props.data[i].y).toFixed(2)
                    )}
                  </TextMontserrat>
                ) : null}
                <TouchableOpacity
                  hitSlop={{
                    top: hp('2%'),
                    bottom: hp('2%'),
                    left: hp('2%'),
                    right: hp('2%'),
                  }}
                  activeOpacity={0.8}
                  onPress={() => this.setState({ active: i })}
                  style={{
                    width: hp('2%'),
                    height: hp('2%'),
                    backgroundColor: '#3083FF',
                    borderRadius: hp('2.2%'),
                    borderColor: '#F5F5F5',
                    borderWidth: hp('0.3%'),
                  }}
                />
              </View>
            );
          })}

          {
            <View
              style={{
                width: '100%',
                justifyContent: this.props.data.length<=1?"center":'space-between',
                flexDirection: 'row',
                position: 'absolute',
                top: isTablet ? -hp('7%') : -hp('3%'),
              }}
            >
              {this.props.data.map(d => {
                return (
                  <View style={{ alignItems: 'center' }}>
                    <TextMontserrat
                      style={stylesPortrait.datesTopAxis}
                    >{`${moment(d.x).format('DD/MM')}`}</TextMontserrat>
                  </View>
                );
              })}
            </View>
          }
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  root: {
    height: 250,
    paddingTop: 50,
    //backgroundColor:'#174285'
  },
  container: {
    height,
    width,
    //backgroundColor: 'green'
  },
  cursor: {
    width: cursorRadius * 1.7,
    height: cursorRadius * 1.7,
    borderRadius: cursorRadius,
    borderColor: '#fff',
    borderWidth: 2.5,
    backgroundColor: '#1566DF',
  },
  label: {
    position: 'absolute',
    top: 0,
    left: 0,
    //backgroundColor:'yellow',
    //width: 50
  },
});
