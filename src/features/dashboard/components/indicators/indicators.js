import React, { Component } from 'react';
import {
  Text,
  View,
  Image,
  Dimensions,
  TouchableOpacity,
  Modal,
  StyleSheet,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { formatNumberCommasDecimal } from 'api';
import { connect } from 'react-redux';
import colors from '../../../modal_delivery/styles/colors';
import { isTablet } from '../../../fingerprint/constants/isLandscape';
import { TextMontserrat } from 'components';
import moment from 'moment';
import { DateRangePicker } from 'components';
class Indicators extends Component {
  state = {
    showOptions: false,
    modalDiscount: false,
    modalDelivery: false,
    datepicker: false,
    interval: [
      this.props.rangeDate.from.format('YYYY-MM-DD'),
      this.props.rangeDate.to.format('YYYY-MM-DD'),
    ],
    tempDate: '',
    twoDates: false,
  };

  render() {
    const {
      grossSales,
      rangeDate,
      changeRangeDate,
      averageSales,
      nSales,
    } = this.props;
    return (
      <View style={styles.container}>
        <TouchableOpacity
          onPress={() => {
            this.setState({ datepicker: true, twoDates: false });
          }}
        >
          <TextMontserrat
            style={{
              ...styles.bolTextCompany,
              fontWeight: '500',
              fontSize: isTablet ? hp('2.4%') : hp('2.7%'),
              marginTop: isTablet ? hp('1%') : hp('2%'),
            }}
          >
            {rangeDate.from.format('MMM D, YYYY')} -{' '}
            {rangeDate.to.format('MMM D, YYYY')}
          </TextMontserrat>
        </TouchableOpacity>
        <View style={styles.indicators}>
          <View>
            <TextMontserrat style={styles.bolTextCompany}>
              ₹{formatNumberCommasDecimal(parseFloat(grossSales).toFixed(2))}
            </TextMontserrat>
            <TextMontserrat style={styles.bolValues}>
              Gross Sales
            </TextMontserrat>
          </View>
          <View style={{ alignItems: 'center' }}>
            <TextMontserrat style={styles.bolTextCompany}>
              {nSales}
            </TextMontserrat>
            <TextMontserrat style={styles.bolValues}>Sales</TextMontserrat>
          </View>
          <View style={{ alignItems: 'flex-end' }}>
            <TextMontserrat style={styles.bolTextCompany}>
              ₹{formatNumberCommasDecimal(parseFloat(averageSales).toFixed(2))}
            </TextMontserrat>
            <TextMontserrat style={styles.bolValues}>
              Average Sales
            </TextMontserrat>
          </View>
        </View>
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
              initialRange={[
                rangeDate.from.format('YYYY-MM-DD'),
                rangeDate.to.format('YYYY-MM-DD'),
              ]}
              addOneDay={date => {
                this.setState({ tempDate: date.dateString });
              }}
              maxDate={moment().format('YYYY-MM-DD')}
              onSuccess={(s, e) => {
                this.setState({ twoDates: true, interval: [s, e] });
              }}
              onHandleOk={() => {
                // try {
                if (this.state.twoDates) {
                  changeRangeDate(
                    moment(this.state.interval[0], 'YYYY-MM-DD'),
                    moment(this.state.interval[1], 'YYYY-MM-DD')
                  );
                } else {
                  if (this.state.tempDate) {
                    changeRangeDate(
                      moment(this.state.tempDate, 'YYYY-MM-DD'),
                      moment(this.state.tempDate, 'YYYY-MM-DD')
                    );
                  } else {
                    changeRangeDate(
                      moment(this.state.interval[0], 'YYYY-MM-DD'),
                      moment(this.state.interval[1], 'YYYY-MM-DD')
                    );
                  }
                }

                this.setState({ datepicker: false });
                // } catch (error) {
                // alert(error)
                //}
              }}
              onHandleCancel={() => {
                this.setState({ datepicker: false });
              }}
              theme={{ markColor: '#174285', markTextColor: 'white' }}
            />
          </View>
        </Modal>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.darkWhite,
    paddingBottom: hp('1%'),
  },
  bolTextCompany: {
    fontSize: isTablet ? hp('2.4%') : wp('5%'),
    fontWeight: '800',
    color: '#455A64',
  },
  bolValues: {
    fontSize: isTablet ? hp('1.7%') : wp('3.5%'),
    fontWeight: '500',
    color: '#737A92',
  },
  indicators: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: isTablet ? hp('0.3%') : hp('2%'),
    paddingHorizontal: wp('3%'),
  },
});
const mapStateToProps = state => ({});

const dispatchActionsToProps = dispatch => ({});
export default connect(
  mapStateToProps,
  dispatchActionsToProps
)(Indicators);
