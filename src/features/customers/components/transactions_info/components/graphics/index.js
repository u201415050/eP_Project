import React, { Component } from 'react';
import { View, Image, Dimensions, TouchableOpacity } from 'react-native';
import { Card, TextMontserrat } from 'components';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import * as portraitStyles from './styles/portrait';
import * as landscapeStyles from './styles/landscape';
import { timeStampToDate, formatNumberCommasDecimal } from 'api';
import moment from 'moment';
import D3Transactions from './components/D3';
import * as _ from 'lodash';

const isPortrait = () => {
  const dim = Dimensions.get('window');
  if (dim.height >= dim.width) {
    return true;
  } else {
    return false;
  }
};

//send this array when no transactions are found
// const data = [
//   { x: new Date(2018, 3, 1), y: 0 },
//   { x: new Date(2018, 3, 2), y: 0 },
//   { x: new Date(2018, 3, 3), y: 0 },
//   { x: new Date(2018, 3, 4), y: 0 },
//   { x: new Date(2018, 3, 5), y: 0 },
//   { x: new Date(2018, 3, 6), y: 0 },
//   { x: new Date(2018, 3, 7), y: 0 },
// ]

//send this array when only one transaction is found
// const data = [
//   { x: new Date(2018, 3, 1), y: 0 },
//   { x: new Date(2018, 3, 2), y: 10 },
// ]

const data = [
  { x: new Date(2018, 3, 1), y: 100 },
  { x: new Date(2018, 3, 2), y: 50 },
  { x: new Date(2018, 3, 3), y: 200 },
  { x: new Date(2018, 3, 4), y: 150 },
  { x: new Date(2018, 3, 4), y: 150 },
  { x: new Date(2018, 3, 5), y: 250 },
  { x: new Date(2018, 3, 5), y: 100 },
  { x: new Date(2018, 3, 6), y: 200 },
  { x: new Date(2018, 3, 7), y: 120 },
  { x: new Date(2018, 3, 8), y: 180 },
  { x: new Date(2018, 3, 8), y: 120 },
  { x: new Date(2018, 3, 9), y: 100 },
  { x: new Date(2018, 3, 10), y: 150 },
];
//   { x: new Date(2018, 3, 7), y: 300 },
//   { x: new Date(2018, 3, 8), y: 300 },
//   { x: new Date(2018, 3, 9), y: 250 },
//   { x: new Date(2018, 3, 10), y: 150 },
//   { x: new Date(2018, 3, 11), y: 150 },
//   { x: new Date(2018, 3, 12), y: 250 },
//   { x: new Date(2018, 3, 13), y: 200 },
//   { x: new Date(2018, 3, 14), y: 300 },
//   { x: new Date(2018, 3, 15), y: 100 },
//   { x: new Date(2018, 3, 16), y: 50 },
//   { x: new Date(2018, 3, 17), y: 200 },
//   { x: new Date(2018, 3, 18), y: 150 },
//   { x: new Date(2018, 3, 19), y: 250 },
//   { x: new Date(2018, 3, 20), y: 200 },
//   { x: new Date(2018, 3, 21), y: 300 },
//   { x: new Date(2018, 3, 22), y: 200 },
//   { x: new Date(2018, 3, 23), y: 300 },
//   { x: new Date(2018, 3, 24), y: 100 },
//   { x: new Date(2018, 3, 25), y: 50 },
//   { x: new Date(2018, 3, 26), y: 200 },
//   { x: new Date(2018, 3, 27), y: 150 },
//   { x: new Date(2018, 3, 28), y: 250 },
//   { x: new Date(2018, 3, 29), y: 200 },
//   { x: new Date(2018, 3, 30), y: 300 },
// ];

class GraphicsChart extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isPortrait: isPortrait(),
      dateRange: '',
      dateFromTo: '',

      // D3 pagination
      groupNumber: 0,
      reloadGraphic: false,
    };
  }

  componentDidMount() {
    const lastWeek = this.getActualWeekInTimeStamp();

    if (this.props.rangeSelected === '') {
      this.setState({
        dateRange:
          timeStampToDate(lastWeek.fromDate) +
          ' - ' +
          timeStampToDate(lastWeek.toDate),
      });
    }
    // alert(JSON.stringify(this.props.items))
  }

  groupingItemsByDate = value => {
    console.log('RECEIVING RAW ARRAY', value)
    var range = this.props.rangeSelected;

    // var dateRounded = value.map(i => { return {x: new Date(moment(i.x).format('YYYY-MM-DD')), y: i.y} })
    // var dateRounded = value.map(i => { return {x: moment(i.x.toISOString().substring(0, i.x.toISOString().indexOf('T')),'YYYY-MM-DD').toDate(), y: i.y} })
    var dateRounded = value.map(i => {
      return { x: new Date(i.x.toLocaleDateString()), y: i.y };
    });
    
    console.log('dateRounded', dateRounded)

    var groupedArray = [];
    var newArray = _.groupBy(dateRounded, 'x');

    for (const prop in newArray) {
      var calculated = {
        x: new Date(prop),
        y: newArray[prop].map(item => item.y).reduce((sum, y) => sum + y),
      };
      groupedArray.push(calculated);
    }

    console.log('GROUPED ARRAY', groupedArray);

    return groupedArray.reverse();
    // return data;
  };

  handleItemResults = value => {
    if (value == undefined || value == null || value.length === 0) {
      // alert('called 1')
      const aDayBefore = new Date(moment(new Date()).subtract(1, 'days'));
      return [
        { x: aDayBefore, y: 0 },
        { x: new Date(moment(new Date())), y: 0 },
      ];
    } else if (value.length === 1) {
      // alert('called 2 '+ JSON.stringify(value))
      var rangeSelected = this.props.rangeSelected;
      const fromDate = this.props.rangeSelected[0];
      const toDate = this.props.rangeSelected[1];
      const newRange = [];

      if(fromDate == toDate){
        const newFromDate = moment(toDate,'YYYY-MM-DD').subtract(1, 'days').format('YYYY-MM-DD');
        rangeSelected = [newFromDate, toDate]
      }

      const item = value[0];
      const aDayBefore = new Date(moment(item.x).subtract(1, 'days'));
      return this.addTransactionlessDates(
        [{ x: aDayBefore, y: 0 }, item],
        rangeSelected
      );
    } else {
      // alert('called 3')
      console.log('PRINTING ITEMS');
      var rangeSelected = this.props.rangeSelected;
      const fromDate = this.props.rangeSelected[0];
      const toDate = this.props.rangeSelected[1];
      const newRange = [];

      if(fromDate == toDate){
        const newFromDate = moment(toDate,'YYYY-MM-DD').subtract(1, 'days').format('YYYY-MM-DD');
        rangeSelected = [newFromDate, toDate]
      }

      // alert(JSON.stringify({value}))

      return this.addTransactionlessDates(
        this.groupingItemsByDate(value),
        rangeSelected
      );
      // return this.groupingItemsByDate(value);
    }
  };

  addTransactionlessDates = (value, rangeDates) => {
    var groupedData = value;

    // var arrayRange = rangeDates;
    var arrayRange = [
      moment(rangeDates[0], 'YYYY-MM-DD'),
      moment(rangeDates[1], 'YYYY-MM-DD'),
    ]; // <---------------- THIS IS THE RANGE

    var fromDate = arrayRange[0];
    var toDate = arrayRange[1];
    var range = [];

    var diff = toDate.diff(fromDate, 'days');

    range.push(fromDate.toDate());

    for (var i = 0; i < diff; i++) {
      var lastDate = range[i];
      range.push(
        moment(lastDate)
          .add(1, 'days')
          .toDate()
      );
    }

    var daysRangeString = range.map(d => {
      return moment(d).format('DD-MM-YYYY');
    });

    var arrayDatesString = groupedData.map(d => {
      return { x: moment(d.x).format('DD-MM-YYYY'), y: d.y };
    });

    var arrayResults = [];

    for (var i = 0; i < daysRangeString.length; i++) {
      if (
        arrayDatesString
          .map(d => {
            return d.x;
          })
          .includes(daysRangeString[i])
      ) {
        var amount =
          groupedData[
            arrayDatesString
              .map(d => {
                return d.x;
              })
              .indexOf(daysRangeString[i])
          ].y;
        arrayResults.push({
          x: moment(daysRangeString[i], 'DD-MM-YYYY').toDate(),
          y: amount,
        });
      } else {
        arrayResults.push({
          x: moment(daysRangeString[i], 'DD-MM-YYYY').toDate(),
          y: 0,
        });
      }
    }

    // alert(JSON.stringify(arrayResults))
    return arrayResults;
  };

  getActualWeekInTimeStamp = () => {
    actualDate = moment().format('MM/DD/YYYY');

    var lastWeek = moment()
      .subtract(6, 'days')
      .format('MM/DD/YYYY');

    return {
      ['fromDate']: +Date.parse(lastWeek) / 1000,
      ['toDate']: +Date.parse(actualDate) / 1000,
    };
  };

  splitIntoWeeks = (array, numberOfDays) => {
    const grouped = [];
    const numberOfGroups = Math.ceil(array.length / numberOfDays)

    for(var i = 0; i < numberOfGroups; i++){
      const holder = grouped.length * numberOfDays; 
      const tempArray = array.slice(holder, holder + numberOfDays);
      grouped.push(tempArray);
    }

    return grouped[this.state.groupNumber].length > 1 ? 
            grouped[this.state.groupNumber] : 
            array.slice(array.length-2, array.length);
  };

  render() {
    const styles = this.state.isPortrait
      ? portraitStyles.styles
      : landscapeStyles.styles;

    return (
      <View style={styles.container}>
        <Card style={styles.cardContainer}>
          <View style={styles.calendarContainer}>
            <TouchableOpacity
              onPress={() => this.props.datePicker(true)}
              style={{
                flexDirection: 'row',
                height: '100%',
                alignItems: 'center',
              }}
            >
              <Image
                source={require('../../assets/images/icons/calendar_icon.png')}
                style={styles.calendarIcon}
                resizeMode={'contain'}
              />
              <TextMontserrat style={styles.dates}>
                {moment(this.props.rangeSelected[0], 'YYYY-MM-DD').format(
                  'DD MMM YYYY'
                ) +
                  ' - ' +
                  moment(this.props.rangeSelected[1], 'YYYY-MM-DD').format(
                    'DD MMM YYYY'
                  ) || this.state.dateRange}
              </TextMontserrat>
              <Ionicons
                color="#666"
                onPress={null}
                name={'ios-arrow-down'}
                size={styles.arrowDownSize.height}
              />
            </TouchableOpacity>
          </View>
          <View style={styles.graphicContainer}>
            {this.props.items.length === 0 ? (
              <TextMontserrat style={styles.noDataLabel}>
                No transactions available
              </TextMontserrat>
            ) : (
              this.state.reloadGraphic ?
              null :
              <D3Transactions 
                data={
                    this.handleItemResults(this.props.items).length <= 7 ? 
                    this.handleItemResults(this.props.items) : 
                    this.splitIntoWeeks(this.handleItemResults(this.props.items), 7)
                  }
                />
              // null
            )
            // <D3Transactions data={this.groupingItemsByDate(data)} />
            }
          </View>
          <View style={styles.totalContainer}>
            {
              (this.handleItemResults(this.props.items).length > 7 && this.state.groupNumber != 0) &&
              <TouchableOpacity
                style={styles.arrowLeftTouch}
                onPress={
                  ()=>{
                    this.setState({
                      reloadGraphic: true, 
                      groupNumber: this.state.groupNumber-1
                    }, () => this.setState({reloadGraphic: false}))
                  }
                }
              >
                <MaterialCommunityIcons
                  color="#30DA51"
                  style={styles.arrowLeft}
                  onPress={null}
                  name={'chevron-left'}
                  size={styles.arrowSidesSize.height}
                />
              </TouchableOpacity>
            }
            <View style={{justifyContent: 'center', alignItems: 'center'}}>
              <TextMontserrat style={styles.totalLabel}>
                Total Sales
              </TextMontserrat>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <MaterialCommunityIcons
                  color="#30DA51"
                  style={styles.arrowTotal}
                  onPress={null}
                  name={'arrow-up-bold'}
                  size={styles.arrowTotalSize.height}
                />
                {/* <TextMontserrat style={styles.totalText}>₹{formatNumberCommasDecimal(this.props.totalSales.toFixed(2)) || '0.00'}</TextMontserrat> */}
                <TextMontserrat style={styles.totalText}>
                  ₹
                  {formatNumberCommasDecimal(
                    this.handleItemResults(this.props.items)
                      .map(i => {
                        return i.y;
                      })
                      .reduce(
                        (accumulator, currentValue) => accumulator + currentValue
                      )
                      .toFixed(2)
                  ) + '' || '0.00'}
                </TextMontserrat>
              </View>
            </View>
            {
              (this.handleItemResults(this.props.items).length > 7 && this.state.groupNumber+1 != Math.ceil(this.handleItemResults(this.props.items).length / 7)) &&
              <TouchableOpacity
                style={styles.arrowRightTouch}
                onPress={
                  ()=>{
                    this.setState({
                      reloadGraphic: true, 
                      groupNumber: this.state.groupNumber+1
                    }, () => this.setState({reloadGraphic: false}))
                  }
                }
              >
                <MaterialCommunityIcons
                  color="#30DA51"
                  style={styles.arrowRight}
                  onPress={null}
                  name={'chevron-right'}
                  size={styles.arrowSidesSize.height}
                />
              </TouchableOpacity>
            }
          </View>
        </Card>
      </View>
    );
  }
}

export default GraphicsChart;
