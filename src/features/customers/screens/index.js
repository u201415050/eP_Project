import React, { Component, Fragment } from 'react';
import {
  View,
  Dimensions,
  ImageBackground,
  Modal,
  TouchableOpacity,
  AsyncStorage,
  SafeAreaView,
  NetInfo,
} from 'react-native';
import Header from '../components/header';
import TabNavigatorDetails from '../components/tab_navigator';
import PersonalInfo from '../components/personal_info';
import { connect } from 'react-redux';
import TransactionsInfo from '../components/transactions_info';
import { DateRangePicker } from 'components';
import * as portraitStyles from './styles/portrait';
import * as landscapeStyles from './styles/landscape';
// import { toTimestampFromPicker, formatDate } from 'api';
import * as UserServices from 'services/user_service';
import moment from 'moment';
import loading_service from '../../../services/loading_service';
import alert_service from '../../../services/alert_service';
import colors from '../../cash_register/styles/colors';
import { epaisaRequest } from '../../../services/epaisa_service';

const isPortrait = () => {
  const dim = Dimensions.get('window');
  if (dim.height >= dim.width) {
    return true;
  } else {
    return false;
  }
};

class PersonalDetails extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isPortrait: isPortrait(),
      auth_key: '',
      merchantId: '',
      customer: this.props.navigation.state.params.customer,
      customertoChange: this.props.navigation.state.params.customer,
      transactions: [], // this.props.navigation.state.params.transactions,
      navigateToPersonal: true,
      navigateToTransactions: false,
      dateRangeVisible: false,
      initialRange: [
        moment()
          .subtract(6, 'days')
          .format('YYYY/MM/DD'),
        moment().format('YYYY/MM/DD'),
      ],
      interval: [
        moment()
          .subtract(6, 'days')
          .format('YYYY/MM/DD'),
        moment().format('YYYY/MM/DD'),
      ],

      // for hiding and make the D3 update itself
      loading: false,

      tempDate: '',
      twoDays: false,

      isConnected: true,
    };
  }

  async UNSAFE_componentWillMount() {
    const connected = await NetInfo.isConnected.fetch();
    this.setState({ isConnected: connected });
  }
  componentWillUnmount() {
    this.props.navigation.state.params.updateData(null, true);
  }
  componentDidMount() {
    AsyncStorage.getItem('user').then(user => {
      user = JSON.parse(user);
      this.setState({
        auth_key: user.response.auth_key,
        merchantId: user.response.merchantId,
      });
    });

    startDate = moment().subtract(6, 'days');
    startDate = startDate.format('YYYY-MM-DD');
    this.setState({ initialRange: [startDate, moment().format('YYYY-MM-DD')] });

    this.showTransactionsDetails(
      {
        fromDate: moment()
          .subtract(6, 'days')
          .unix(),
        toDate: moment().unix(),
      },
      true
    );
  }

  changeViewPersonal = () => {
    this.setState({ navigateToPersonal: true, navigateToTransactions: false });
  };

  changeViewTransactions = () => {
    if (this.state.isConnected) {
      this.setState({
        navigateToTransactions: true,
        navigateToPersonal: false,
      });
    } else {
      alert_service.showAlert('This feature requires Internet connection');
    }
  };

  showDateRangePicker = value => {
    this.setState({ twoDays: false, dateRangeVisible: value });
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

  toTimestampFromPicker = strDate => {
    //yyyy-mm-dd
    myDate = strDate.split('-');
    var newDate = myDate[1] + '/' + myDate[2] + '/' + myDate[0]; //mm-dd-yyyy
    return Date.parse(newDate) / 1000;
  };

  showTransactionsDetails = async (value, pop) => {
    //loading_service.showLoading();
    this.setState({ loading: true });

    const toDateAdded =
      moment(new Date(value.toDate * 1000))
        .add(1, 'days')
        .valueOf() / 1000;

    const res = await epaisaRequest(
      {
        showSplited: true,
        fromDate: value.fromDate,
        toDate: toDateAdded,
        //value,
        customerId: this.props.navigation.state.params.customer.customerId,
        merchantId: this.props.user.merchantId,
      },
      '/transaction/list',
      'GET'
    );

    const from = moment(new Date(value.fromDate * 1000)).format('DD MMM. YYYY');
    const to = moment(new Date(value.toDate * 1000)).format('DD MMM. YYYY');
    // alert(JSON.stringify(res))

    if (res.list) {
      const transactionList = res.list;
      // console.log(transactionList);
      this.setState(
        { rangeSelected: from + ' - ' + to, transactions: transactionList },
        () => {
          loading_service.hideLoading();
          this.showDateRangePicker(false);
          this.setState({ loading: false });
          return this.state.transactions;
        }
      );
    } else {
      this.setState(
        { rangeSelected: from + ' - ' + to, transactions: [] },
        () => {
          // alert(JSON.stringify(this.state.transactions))
          loading_service.hideLoading();
          this.showDateRangePicker(false);
          this.setState({ loading: false });
          if (!pop) {
            alert_service.showAlert(res.message);
          }
          return this.state.transactions;
        }
      );
    }
  };

  render() {
    const styles = this.state.isPortrait
      ? portraitStyles.styles
      : landscapeStyles.styles;

    return (
      <Fragment>
        <SafeAreaView style={{ flex: 0, backgroundColor: colors.darkBlue }} />

        <SafeAreaView style={{ flex: 1, backgroundColor: colors.darkWhite }}>
          <View style={{ flex: 1 }}>
            <ImageBackground
              source={require('../assets/images/background/background_portrait.png')}
              style={{ flex: 1, backgroundColor: colors.darkWhite }}
              resizeMode={'cover'}
            >
              <View style={{ zIndex: 10 }}>
                <Header
                  label="DETAILS"
                  back={true}
                  navigation={this.props.navigation}
                  hideRight={true}
                  refreshParentView={() =>
                    this.props.navigation.state.params.refreshing(
                      this.state.customertoChange
                    )
                  }
                />
              </View>
              <TabNavigatorDetails
                onPressPersonal={this.changeViewPersonal}
                onPressTransactions={this.changeViewTransactions}
                isConnected={this.state.isConnected}
              />
              <View style={{ flex: 1 }}>
                {this.state.navigateToPersonal ? (
                  <PersonalInfo
                    changeCustomer={val =>
                      this.setState({ customertoChange: val, customer: val })
                    }
                    item={this.state.customer}
                  />
                ) : (
                  <TransactionsInfo
                    onLoading={this.state.loading}
                    items={this.state.transactions}
                    rangeSelected={this.state.initialRange}
                    datePicker={this.showDateRangePicker}
                  />
                )}
              </View>
            </ImageBackground>
            <Modal
              animationType={'fade'}
              presentationStyle={'overFullScreen'}
              transparent={true}
              visible={this.state.dateRangeVisible}
              onRequestClose={() => {
                this.showDateRangePicker(false);
              }}
            >
              <TouchableOpacity
                style={styles.datePicker}
                activeOpacity={1}
                onPressOut={() => {
                  this.setState({ twoDays: false });
                  this.showDateRangePicker(false);
                }}
              >
                <DateRangePicker
                  addOneDay={date => {
                    // alert(1)
                    this.setState({ tempDate: date.dateString });
                  }}
                  maxDate={moment().format('YYYY-MM-DD')}
                  initialRange={this.state.initialRange}
                  onSuccess={(s, e) => {
                    this.setState({ interval: [s, e], twoDays: true });
                  }}
                  onHandleOk={() => {
                    this.setState({
                      initialRange: this.state.twoDays
                        ? [
                            moment(this.state.interval[0], 'YYYY/MM/DD').format(
                              'YYYY-MM-DD'
                            ),
                            moment(this.state.interval[1], 'YYYY/MM/DD').format(
                              'YYYY-MM-DD'
                            ),
                          ]
                        : this.state.tempDate != '' &&
                          this.state.tempDate != null
                        ? [this.state.tempDate, this.state.tempDate]
                        : [
                            moment(this.state.interval[0], 'YYYY/MM/DD').format(
                              'YYYY-MM-DD'
                            ),
                            moment(this.state.interval[1], 'YYYY/MM/DD').format(
                              'YYYY-MM-DD'
                            ),
                          ],
                    });
                    this.setState({ dateRangeVisible: false });
                    let start = this.toTimestampFromPicker(
                      this.state.twoDays
                        ? moment(this.state.interval[0], 'YYYY/MM/DD').format(
                            'YYYY-MM-DD'
                          )
                        : this.state.tempDate != '' &&
                          this.state.tempDate != null
                        ? this.state.tempDate
                        : moment(this.state.interval[0], 'YYYY/MM/DD').format(
                            'YYYY-MM-DD'
                          )
                    );
                    let end = this.toTimestampFromPicker(
                      this.state.twoDays
                        ? moment(this.state.interval[1], 'YYYY/MM/DD').format(
                            'YYYY-MM-DD'
                          )
                        : this.state.tempDate != '' &&
                          this.state.tempDate != null
                        ? this.state.tempDate
                        : moment(this.state.interval[1], 'YYYY/MM/DD').format(
                            'YYYY-MM-DD'
                          )
                    );
                    this.showTransactionsDetails({
                      ['fromDate']: start,
                      ['toDate']: end,
                    });
                  }}
                  onHandleCancel={() =>
                    this.setState({ dateRangeVisible: false })
                  }
                  theme={{ markColor: '#174285', markTextColor: 'white' }}
                />
              </TouchableOpacity>
            </Modal>
          </View>
        </SafeAreaView>
      </Fragment>
    );
  }
}

const mapStateToProps = state => ({
  user: state.auth.user,
});

export default connect(mapStateToProps)(PersonalDetails);
