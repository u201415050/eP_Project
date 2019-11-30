//import liraries
import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import { isTablet } from '../../../features/cash_register/constants/isLandscape';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { Calendar, defaultStyle } from 'react-native-calendars';
import moment from 'moment';
import { TextMontserrat } from 'components';
// create a component
class CalendarDate extends Component {
  render() {
    const {
      active,
      closeModal,
      minDate,
      maxDate,
      currentDate,
      dateSelected,
      onDayPress,
      handleCancel,
      handleOk,
    } = this.props;
    return (
      <Modal
        visible={active}
        onRequestClose={closeModal}
        animationType="fade"
        transparent={true}
      >
        <View style={styles.container}>
          <TouchableOpacity
            activeOpacity={1}
            onPress={closeModal}
            style={styles.backgroundClose}
          />
          <View style={{ width: isTablet ? wp('45%') : wp('80%') }}>
            <Calendar
              {...this.props}
              cheque={true}
              current={currentDate ? currentDate : null}
              minDate={minDate ? minDate.format('YYYY-MM-DD') : '1900-01-01'}
              maxDate={maxDate ? maxDate.format('YYYY-MM-DD') : '2020-05-10'}
              markedDates={{
                [dateSelected.format('YYYY-MM-DD')]: {
                  selected: true,
                  selectedColor: '#174285',
                },
              }}
              onDayPress={day => {
                onDayPress(moment(day.dateString, 'YYYY-MM-DD'));
              }}
            />
            <View style={styles.footer}>
              <View style={styles.buttonsContainer}>
                <TouchableOpacity onPress={handleCancel}>
                  <TextMontserrat style={styles.button}>CANCEL</TextMontserrat>
                </TouchableOpacity>
                <TouchableOpacity onPress={handleOk}>
                  <TextMontserrat style={styles.button}>OK</TextMontserrat>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </Modal>
    );
  }
}

// define your styles
const styles = StyleSheet.create({
  container: {
    width: '100%',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backgroundClose: {
    position: 'absolute',
    top: 0,
    left: 0,
    height: '100%',
    width: '100%',
    backgroundColor: 'rgba(0,0,0,0.6)',
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
    marginBottom: isTablet ? hp('2%') : hp('3%'),
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: isTablet ? wp('2%') : wp('5%'),
  },
  button: {
    fontSize: isTablet ? hp('3.4%') : wp('4%'),
    color: '#174285',
    fontWeight: '600',
  },
});

//make this component available to the app
export default CalendarDate;
