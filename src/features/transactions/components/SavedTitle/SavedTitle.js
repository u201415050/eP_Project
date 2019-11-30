import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  Modal,
  DatePickerAndroid,
} from 'react-native';

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import EStyleSheet from 'react-native-extended-stylesheet';
//import CalendarIcon from 'react-native-vector-icons/FontAwesome';
//import Arrow from 'react-native-vector-icons/FontAwesome';
//import Calendar from 'react-native-calendar-select';
import { TextMontserrat, DateRangePicker } from 'components';
import colors from '../../../saved_transactions/styles/colors';
import { isTablet } from '../../../cash_register/constants/isLandscape';
import moment from 'moment';

export default class SavedTitle extends Component {
  constructor(props) {
    super(props);
    this.state = {
      startDate: moment(`2017-01-01`),
      endDate: moment(),
      modal: false,
      datepicker: false,
      interval: [
        moment()
          .subtract(1, 'week')
          .format('YYYY-MM-DD'),
        moment().format('YYYY-MM-DD'),
      ],
      tempDate: '',
      twoDates: false,
    };
  }
  // when confirm button is clicked, an object is conveyed to outer component
  // contains following property:
  // startDate [Date Object], endDate [Date Object]
  // startMoment [Moment Object], endMoment [Moment Object]
  setStartDate = async () => {
    try {
      const { action, year, month, day } = await DatePickerAndroid.open({
        date: this.props.start.toDate(),
        minDate: new Date(2017, 0, 1),
        maxDate: moment().toDate(),
      });
      if (action !== DatePickerAndroid.dismissedAction) {
        this.props.changeStart(
          moment(
            `${year}-${month + 1 < 10 ? '0' : ''}${month + 1}-${
              day + 1 < 10 ? '0' : ''
            }${day}`
          ),
          val => {
            this.setEndDate(val);
          }
        );
      }
    } catch ({ code, message }) {
      console.warn('Cannot open date picker', message);
    }
  };
  setEndDate = async date => {
    try {
      const { action, year, month, day } = await DatePickerAndroid.open({
        date: this.props.end.toDate(),
        minDate: date,
        maxDate: moment().toDate(),
      });
      if (action !== DatePickerAndroid.dismissedAction) {
        //var monthTemp = month + 1;
        this.props.changeEnd(
          moment(
            `${year}-${month + 1 < 10 ? '0' : ''}${month + 1}-${
              day + 1 < 10 ? '0' : ''
            }${day}`
          )
        );
      }
    } catch ({ code, message }) {
      console.warn('Cannot open date picker', message);
    }
  };
  render() {
    return (
      <View style={styles.container}>
        <TouchableOpacity
          style={styles.left}
          onPress={() => {
            this.setState({ datepicker: true, twoDates: false });
          }}
        >
          <View style={styles.left_inside}>
            <Image
              source={require('../../assets/img/calendar.png')}
              style={{
                height: hp('3%'),
                width: hp('3%'),
                tintColor: '#174285',
              }}
            />
            <TextMontserrat style={styles.date}>
              {this.props.start != null
                ? moment(this.props.start).format('DD MMM YYYY')
                : 'no date'}{' '}
              -{' '}
              {this.props.end != null
                ? moment(this.props.end).format('DD MMM YYYY')
                : 'no date'}
            </TextMontserrat>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.right}
          onPress={() => {
            this.setState({ modal: true });
          }}
        >
          <TextMontserrat style={styles.sort}>Sort By </TextMontserrat>
        </TouchableOpacity>
        <Modal
          visible={this.state.datepicker}
          transparent={true}
          animationType="fade"
          onRequestClose={() => this.setState({ datepicker: false })}
        >
          <View
            style={{
              width: '100%',
              height: '100%',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'rgba(0,0,0,0.6)',
            }}
          >
            <TouchableOpacity
              onPress={() => this.setState({ datepicker: false })}
              style={{
                width: '100%',
                height: '100%',
                position: 'absolute',
                top: 0,
              }}
            />
            <DateRangePicker
              addOneDay={date => {
                this.setState({ tempDate: date.dateString });
              }}
              maxDate={moment().format('YYYY-MM-DD')}
              initialRange={this.props.initialRange}
              onSuccess={(s, e) => {
                this.setState({ twoDates: true, interval: [moment(s,'YYYY/MM/DD').format('YYYY-MM-DD'), moment(e,'YYYY/MM/DD').format('YYYY-MM-DD')] });
              }}
              onHandleOk={() => {
                //alert(this.state.interval)
                this.props.setInitial(
                  !this.state.twoDates
                    ? this.state.tempDate == ''
                      ? this.state.interval
                      : [this.state.tempDate, this.state.tempDate]
                    : this.state.interval
                );
                this.setState({ datepicker: false, tempDate: '' }, () => {
                  this.props.handleFilter();
                });
              }}
              onHandleCancel={() => this.setState({ datepicker: false })}
              theme={{ markColor: '#174285', markTextColor: 'white' }}
            />
          </View>
        </Modal>
        <Modal
          visible={this.state.modal}
          transparent={true}
          animationType="fade"
          onRequestClose={() => {
            this.setState({ modal: false });
          }}
        >
          <View style={{ width: '100%', height: '100%' }}>
            <TouchableOpacity
              onPress={() => {
                this.setState({ modal: false });
              }}
              style={{ position: 'absolute', width: '100%', height: '100%' }}
            />
            <View
              style={{
                backgroundColor: 'red',
                position: 'absolute',
                top: (Platform.OS === 'android' ? 0 : 20) + hp('15.5%'),
                right: isTablet ? wp('35.08%') : 0,
              }}
            >
              <View
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  borderColor: 'rgba(0,0,0,0.1)',
                  backgroundColor: 'white',
                  width: '100%',
                  height: '100%',
                  elevation: 3,
                }}
              />
              <View
                style={{
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 1 },
                  shadowOpacity: 0.2,
                  shadowRadius: 2,
                  elevation: 7,
                  borderColor: 'rgba(0,0,0,0.1)',
                  paddingHorizontal: hp('3%'),
                  paddingBottom: hp('1%'),
                  paddingTop: hp('0.5%'),
                  backgroundColor: 'white',
                  justifyContent: 'space-around',
                }}
              >
                <TouchableOpacity
                  onPress={() => {
                    this.props.sortby('h');
                    this.setState({ modal: false });
                  }}
                >
                  <TextMontserrat
                    style={{
                      paddingVertical: hp('1%'),
                      fontSize: isTablet ? hp('3%') : hp('2.5%'),
                      fontWeight: '800',
                      color: '#888888',
                    }}
                  >
                    High to Low
                  </TextMontserrat>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    this.props.sortby('l');
                    this.setState({ modal: false });
                  }}
                >
                  <TextMontserrat
                    style={{
                      fontSize: isTablet ? hp('3%') : hp('2.5%'),
                      fontWeight: '800',
                      color: '#888888',
                    }}
                  >
                    Low to High
                  </TextMontserrat>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    );
  }
}

const styles = EStyleSheet.create({
  container: {
    width: '100%',
    height: hp('5.5%'),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'white',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  left: {
    alignItems: 'flex-start',
    justifyContent: 'center',
    width: isTablet ? '79%' : '70%',
    paddingHorizontal: isTablet ? wp('2%') : wp('6%'),
  },
  left_inside: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    width: isTablet ? '60%' : '100%',
  },
  right: {
    width: isTablet ? '21%' : '30%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: isTablet ? wp('2.5%') : wp('4%'),
    borderLeftWidth: 2,
    borderColor: '#ddd',
    height: '100%',
  },
  date: {
    color: colors.darkBlue,
    fontSize: hp('1.8%'),
    fontWeight: 'bold',
    letterSpacing: -0.3,
    marginLeft: wp('3%'),
  },
  sort: {
    fontSize: hp('2.1%'),
    fontWeight: '700',
    color: '#888888',
  },
});