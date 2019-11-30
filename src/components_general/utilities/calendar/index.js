import React, { Component } from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { Calendar, defaultStyle } from 'react-native-calendars';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { TextMontserrat } from '../../../features/modal_delivery/components/texts';
import { isTablet } from '../../../features/cash_register/constants/isLandscape';

const XDate = require('xdate');

type Props = {
  initialRange: React.PropTypes.array.isRequired,
  onSuccess: React.PropTypes.func.isRequired,
};
export default class DateRangePicker extends Component<Props> {
  state = { isFromDatePicked: false, isToDatePicked: false, markedDates: {} };

  componentDidMount() {
    this.setupInitialRange();
  }

  onDayPress = day => {
    if (
      !this.state.isFromDatePicked ||
      (this.state.isFromDatePicked && this.state.isToDatePicked)
    ) {
      this.setupStartMarker(day);
    } else if (!this.state.isToDatePicked) {
      let markedDates = { ...this.state.markedDates };
      let [mMarkedDates, range] = this.setupMarkedDates(
        this.state.fromDate,
        day.dateString,
        markedDates
      );
      if (range >= 0) {
        this.setState({
          isFromDatePicked: true,
          isToDatePicked: true,
          markedDates: mMarkedDates,
        });
        this.props.onSuccess(this.state.fromDate, day.dateString);
      } else {
        this.setupStartMarker(day);
      }
    }
  };
  setupStartMarker = day => {
    let markedDates = {
      [day.dateString]: {
        startingDay: true,
        color: this.props.theme.markColor,
        textColor: this.props.theme.markTextColor,
      },
    };
    this.setState({
      isFromDatePicked: true,
      isToDatePicked: false,
      fromDate: day.dateString,
      markedDates: markedDates,
    });
  };

  setupMarkedDates = (fromDate, toDate, markedDates) => {
    let mFromDate = new XDate(fromDate);
    let mToDate = new XDate(toDate);
    let range = mFromDate.diffDays(mToDate);
    if (range >= 0) {
      if (range == 0) {
        markedDates = {
          [toDate]: {
            color: this.props.theme.markColor,
            textColor: this.props.theme.markTextColor,
          },
        };
      } else {
        for (var i = 1; i <= range; i++) {
          let tempDate = mFromDate.addDays(1).toString('yyyy-MM-dd');
          if (i < range) {
            markedDates[tempDate] = {
              color: this.props.theme.markColor,
              textColor: this.props.theme.markTextColor,
            };
          } else {
            markedDates[tempDate] = {
              endingDay: true,
              color: this.props.theme.markColor,
              textColor: this.props.theme.markTextColor,
            };
          }
        }
      }
    }
    return [markedDates, range];
  };

  setupInitialRange = () => {
    if (!this.props.initialRange) return;
    let [fromDate, toDate] = this.props.initialRange;
    let markedDates = {
      [fromDate]: {
        startingDay: true,
        color: this.props.theme.markColor,
        textColor: this.props.theme.markTextColor,
      },
    };
    let [mMarkedDates, range] = this.setupMarkedDates(
      fromDate,
      toDate,
      markedDates
    );
    this.setState({ markedDates: mMarkedDates, fromDate: fromDate });
  };

  render() {
    const styles = isTablet ? styleLandscape : style;
    return (
      <View style={styles.container}>
        <Calendar
          {...this.props}
          markingType={'period'}
          current={this.state.fromDate}
          markedDates={this.state.markedDates}
          onDayPress={day => {
            this.props.addOneDay(day);
            this.onDayPress(day);
          }}
        />
        <View style={styles.footer}>
          <View style={styles.buttonsContainer}>
            <TouchableOpacity onPress={this.props.onHandleCancel}>
              <TextMontserrat style={styles.button}>CANCEL</TextMontserrat>
            </TouchableOpacity>
            <TouchableOpacity onPress={this.props.onHandleOk}>
              <TextMontserrat style={styles.button}>OK</TextMontserrat>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }
}
const style = StyleSheet.create({
  container: {
    width: wp('80%'),
  },
  footer: {
    backgroundColor: '#ffffff',
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
    width: '100%',
    height: hp('10%'),
  },
  buttonsContainer: {
    flexDirection: 'row',
    marginBottom: hp('3%'),
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: wp('5%'),
  },
  button: {
    fontSize: wp('4%'),
    color: '#174285',
    fontWeight: '600',
  },
});
const styleLandscape = StyleSheet.create({
  container: {
    width: wp('45%'),
  },
  footer: {
    backgroundColor: '#ffffff',
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
    width: '100%',
    height: hp('10%'),
  },
  buttonsContainer: {
    flexDirection: 'row',
    marginBottom: hp('2%'),
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: wp('2%'),
  },
  button: {
    fontSize: hp('3.4%'),
    color: '#174285',
    fontWeight: '600',
  },
});
DateRangePicker.defaultProps = {
  theme: { markColor: '#00adf5', markTextColor: '#ffffff' },
};
