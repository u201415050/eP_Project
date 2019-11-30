import React, { Component, Fragment } from 'react';
import {
  View,
  StyleSheet,
  AsyncStorage,
  Dimensions,
  Modal,
  TouchableOpacity,
  ActivityIndicator,
  Animated,
  NetInfo,
  Platform,
  BackHandler,
} from 'react-native';
import { connect } from 'react-redux';
import Header from './components/header';
import SearchInput from './components/search';
import CustomerList from './components/list';
import * as _ from 'lodash';
import ModalAdd from '../modal_customer/components/ModalAdd/modalAdd';
import { CUSTOMER_PERSONAL_DETAILS } from '../../navigation/screen_names';
import TabNavigatorDetails from './components/tab_navigator';
import PersonalInfo from './components/personal_info';
import TransactionsInfo from './components/transactions_info';
import moment from 'moment';
import loading_service from '../../services/loading_service';
import { BoxShadow } from 'react-native-shadow';
import { shadowStyles } from './styles/boxShadowStyle';
import { DateRangePicker } from 'components';
import alert_service from 'services/alert_service';
import colors from '../cash_register/styles/colors';
import { portraitStyles } from './styles/portrait';
import realm from 'services/realm_service';
import { TextMontserrat } from '../modal_customer/components/texts';
import { landscapeStyles } from './styles/landscape';
import { epaisaRequest } from '../../services/epaisa_service';
import { isTablet } from '../cash_register/constants/isLandscape';
import { Background, SafeAreaView } from 'components';

//import mixpanel from '../../services/mixpanel';

const isPortrait = () => {
  const dim = Dimensions.get('window');
  if (dim.height >= dim.width) {
    return true;
  } else {
    return false;
  }
};

class CustomerScreen extends Component {
  static navigationOptions = {
    header: null,
  };

  constructor(props) {
    super(props);
    this.customers = this.props.state.customers || [];
    const ceFiltered = this.filter('', this.customers);
    this.unfiltered = this.group(ceFiltered);
    const ceGrouped = [];
    //mixpanel.track('Customers Screen');

    this.state = {
      ceFiltered,
      ceGrouped,
      orientation: isPortrait(),
      addCustomer: false,
      user: {},
      auth_key: '',
      merchantId: 0,
      navigateToPersonal: true,
      navigateToTransactions: false,
      customersRawData: [],
      totalCustomers: 0,
      searching: false,
      bounceValue: new Animated.Value(portraitStyles.loadingContainer.height),
      filterCharacters: '',
      filteredCustomers: [],
      isConnected: true,

      //for landscape
      transactionListLandscape: [],
      dateRangeVisible: false,
      initialRange: [
        moment()
          .subtract(6, 'days')
          .format('YYYY-MM-DD'),
        moment().format('YYYY-MM-DD'),
      ],
      rangeSelected: [
        moment()
          .subtract(6, 'days')
          .format('YYYY-MM-DD'),
        moment().format('YYYY-MM-DD'),
      ],
      interval: [
        moment()
          .subtract(6, 'days')
          .format('YYYY-MM-DD'),
        moment().format('YYYY-MM-DD'),
      ],

      // for hiding and make the D3 update itself
      loading: false,

      // for showing placeholder when no users are registered
      noUsersRegistered: false,

      tempDate: '',
      twoDays: false,
    };

    this.filteringByAPICall = _.debounce(this.filteringByAPICall, 500);
  }

  async UNSAFE_componentWillMount() {
    const connected = await NetInfo.isConnected.fetch();
    this.setState({ isConnected: connected });
  }
  handleBackPress = () => {
    this.props.navigation.navigate('CashRegister');
    return true;
  };
  componentDidMount() {
    const user = realm.objectForPrimaryKey('User', 0);
    this.setState({ user });

    AsyncStorage.getItem('totalCustomers').then(v => {
      this.setState({ totalCustomers: +v });
    });

    this.getListFromAPI();

    BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackPress);
    // this.setState({ customersRawData: [] }, () => {
    //   this.setState({ gceGrouped: [] });
    // });
  }

  /*getInitialDateRange = () => {
    startDate = moment().subtract(7, 'days');
    startDate = startDate.format('YYYY-MM-DD');
    return [startDate, moment().format('YYYY-MM-DD')] ;
  }*/

  logout = () => {
    const user = realm.objectForPrimaryKey('User', 0);
    AsyncStorage.setItem(`@lastUserLogged`, '' + user.userId);
    user.signOut();
    return this.props.navigation.navigate('Auth');
  };

  getListFromAPI = async (offset, conection) => {
    // const user = realm.objectForPrimaryKey('User', 0);
    const user = this.props.user;

    console.log('CANTIDAD USER: ', this.state.customersRawData.length);
    const totalCustomers = await AsyncStorage.getItem('totalCustomers');
    console.log('CANTIDAD USER AsyncStorage: ', totalCustomers);
    //alert(this.state.customersRawData.length+' '+totalCustomers)
    if (
      this.state.customersRawData.length !== +totalCustomers ||
      conection != null
    ) {
      if (offset != undefined && offset != '') {
        var toValue = 0;
        /*Animated.spring(this.state.bounceValue, {
          toValue: toValue,
          velocity: 3,
          tension: 2,
          friction: 8,
        }).start();*/
      } else {
        //loading_service.showLoading();
      }
      let isConnected =
        conection != null ? conection : await NetInfo.isConnected.fetch();
      offset = offset ? this.state.customersRawData.length : 0;
      try {
        const { merchantId } = user;

        let res;
        if (isConnected) {
          res = await epaisaRequest(
            {
              merchantId,
              offset,
              otpIsNull: true,
            },
            '/customer',
            'GET'
          );
        } else {
          res = {
            success: 1,
            response: { Customer: Array.from(realm.objects('CustomerAPI')) },
          };
        }

        // await UserServices.list_customers_by_merchant(
        //   this.state.auth_key,
        //   this.state.merchantId,
        //   offset // <<-- offset
        // )
        //   .then(res => {
        console.log('LIST RESPONSE', res);

        if (res.success === 1) {
          this.setState({ noUsersRegistered: false });

          var customerListFromResponse = res.response.Customer.filter(item => {
            return item.status == 1;
          }).map(item => {
            return item.hasOwnProperty('sync') ? item : { ...item, sync: 'y' };
          });

          var customerListState =
            conection != null ? [] : this.state.customersRawData;

          if (customerListState.length === 0) {
            customerListState = customerListFromResponse;
          } else {
            customerListFromResponse.forEach(r => {
              var isPresent = customerListState
                .map(s => s.customerId)
                .includes(r.customerId);
              if (!isPresent) {
                customerListState.push(r);
              }
            });
          }

          this.setState(
            {
              //customersRawData: this.state.customersRawData.concat(res.response.Customer),
              customersRawData: customerListState,
            },
            () => {
              this.setState(
                {
                  ceGrouped: this.group(this.state.customersRawData),
                },
                () => {
                  if (isTablet) {
                    this.showCustomerDetailsLandscape(
                      this.state.ceGrouped[0].data[0]
                    );
                  }
                  var toValue = portraitStyles.loadingContainer.height;
                  Animated.spring(this.state.bounceValue, {
                    toValue: toValue,
                    velocity: 3,
                    tension: 2,
                    friction: 8,
                  }).start();

                  loading_service.hideLoading();
                }
              );
            }
          );
        } else {
          console.log('LIST RESPONSE ERROR', res);
          if (res.errorCode === '0.0.1') {
            loading_service.hideLoading();
            alert_service.showAlert(
              'Login has expired, please login again',
              () => this.logout()
            );
          } else if (res.errorCode === '2.16.404') {
            if (offset == '' || offset == 0) {
              this.setState({ noUsersRegistered: true });
              loading_service.hideLoading();
            } else {
              loading_service.hideLoading();
              alert_service.showAlert('Customer not found');
            }
            loading_service.hideLoading();
          } else {
            loading_service.hideLoading();
            //alert_service.showAlert('A problem occurred during this process');
          }
        }
        loading_service.hideLoading();
      } catch (error) {
        console.log(error);
        loading_service.hideLoading();
        //alert_service.showAlert('A problem occurred during this process');
      }
      // })
      // .catch(error => {
      //   this.setState({ noUsersRegistered: true });
      //   loading_service.hideLoading();
      //   alert_service.showAlert('A problem occurred during this process');
      //   console.log(error);
      // });
    }
  };

  getActualWeekInTimeStamp = () => {
    const actualDate = moment().format('MM-DD-YYYY');

    var lastWeek = moment()
      .subtract(6, 'days')
      .format('MM-DD-YYYY');

    return {
      ['fromDate']: +Date.parse(lastWeek) / 1000,
      ['toDate']: +Date.parse(actualDate) / 1000,
    };
  };

  toTimestampFromPicker = strDate => {
    //yyyy-mm-dd
    const myDate = strDate.split('-');
    var newDate = myDate[1] + '/' + myDate[2] + '/' + myDate[0]; //mm-dd-yyyy
    return Date.parse(newDate) / 1000;
  };

  getCustomersGrouped = customerListTemp => {
    const orderedCustomerList = customerListTemp.sort((a, b) =>
      a.firstName.localeCompare(b.firstName)
    );

    var index = 0;

    let data = orderedCustomerList.reduce((r, e) => {
      let group = e.firstName[0].toUpperCase();
      if (!r[group]) r[group] = { id: index++, title: group, data: [e] };
      else r[group].data.push(e);
      return r;
    }, {});

    let groupedList = Object.values(data);

    return groupedList;
  };

  filterBy = filtering => {
    if (filtering == '') {
      this.setState(
        { filtering: '', customerList: this.props.state.customers },
        () => console.log('FILETRING ERASED', this.state.customerList)
      );
    } else {
      const customersTemp = this.state.customerList;

      const newList = customersTemp.filter(customer =>
        customer.firstName
          .concat(' ', customer.lastName)
          .toLowerCase()
          .includes(filtering.toLowerCase())
      );

      this.setState({ customerList: newList }, () =>
        console.log('FILTERED', this.state.customerList)
      );
    }
  };

  filter(value, customer) {
    return customer.filter(x => {
      const s = value.replace(/[^A-Z0-9_ ]/gi, '');
      const str_search = `${x.firstName} ${x.lastName} ${x.phoneNumber.replace(
        / /gi,
        ''
      )}`;
      //console.log(str_search);
      const re = new RegExp(s, 'i');
      return str_search.search(re) !== -1;
    });
  }

  group(customers) {
    const data = customers
      .sort((a, b) => {
        if (a.firstName.toLowerCase() < b.firstName.toLowerCase()) {
          return -1;
        }
        if (a.firstName.toLowerCase() > b.firstName.toLowerCase()) {
          return 1;
        }
        // a debe ser igual b
        return 0;
      })
      .reduce((r, e) => {
        let title = e.firstName[0].toUpperCase();
        if (!r[title]) r[title] = { title, data: [e] };
        else r[title].data.push(e);
        return r;
      }, {});

    return Object.values(data);
  }

  _textChange = value => {
    // if (value === '') {
    //   alert('clean');
    // }
    if (value.length > 0) {
      this.setState(
        {
          filterCharacters: value,
          searching: true,
        },
        () => {
          this.filteringByAPICall(this.state.filterCharacters); // Immediately executes
        }
      );
    } else {
      this.setState({
        ceGrouped: this.unfiltered,
        searching: false,
      });
    }
    // this.setState(
    //   {
    //     filterCharacters: value,
    //   },
    //   () => {
    //     if (this.state.filterCharacters.length > 0) {
    //       this.setState(
    //         {
    //           searching: true,
    //         },
    //         () => {
    //           this.filteringByAPICall(this.state.filterCharacters); // Immediately executes
    //         }
    //       );
    //     } else {
    //       this.setState({
    //         ceGrouped: this.group(this.state.customersRawData),
    //         searching: false,
    //       });
    //     }
    //   }
    // );

    // PREVIOUS FILTERING FROM STATE
    // const ceFiltered = this.filter(value, this.customers);
    // const ceGrouped = this.group(ceFiltered);

    // this.setState({ filter: value, ceFiltered, ceGrouped }, () => {
    //   console.log({ a: this.state.ceFiltered, b: this.state.ceGrouped });
    // });
  };

  filteringByAPICall = async value => {
    let isConnected = await NetInfo.isConnected.fetch();

    const { merchantId } = this.state.user;

    if (isConnected) {
      const res = await epaisaRequest(
        {
          merchantId,
          filter: value,
          otpIsNull: true,
        },
        '/customer',
        'GET'
      );

      if (res.success === 1) {
        const customers = res.response.Customer.filter(item => {
          return item.status == 1;
        });
        console.log('filteringByAPICall', customers);

        this.setState(
          {
            ceGrouped: this.group(customers),
            customersRawData: res.response.Customer,
          },

          () => {
            this.setState({ searching: false });
          }
        );
      } else {
        console.log('LIST RESPONSE ERROR', res);
        if (res.errorCode === '0.0.1') {
          this.setState({ searching: false });
          alert_service.showAlert('Login has expired, please login again', () =>
            this.logout()
          );
        } else if (res.errorCode === '2.16.404') {
          this.setState({ searching: false });
          alert_service.showAlert('Customer not found');
        } else {
          this.setState({ searching: false });
          //alert_service.showAlert('A problem occurred during this process');
        }
      }
    } else {
      const customersDB = Array.from(realm.objects('CustomerAPI'));

      const customers = customersDB.filter(
        item =>
          item.firstName
            .toLowerCase()
            .concat(' ')
            .concat(item.lastName.toLowerCase())
            .includes(value.toLowerCase()) ||
          item.email.toLowerCase().includes(value.toLowerCase()) ||
          item.phoneNumber.includes(value)
      );

      if (customers.length > 0) {
        this.setState(
          {
            ceGrouped: this.group(customers),
            customersRawData: Array.from(realm.objects('CustomerAPI')),
          },
          () => {
            this.setState({ searching: false });
          }
        );
      } else {
        //if(value.length > 2) alert_service.showAlert('Customer not found');
        this.setState(
          {
            ceGrouped: this.group(customersDB),
            customersRawData: Array.from(realm.objects('CustomerAPI')),
          },
          () => {
            this.setState({ searching: false });
          }
        );
      }
    }
  };

  showCustomerDetails = async value => {
    let isConnected = await NetInfo.isConnected.fetch();

    // alert('showCustomerDetails called')
    //loading_service.showLoading();
    // console.log('CUSTOMER SELECTED', value);

    var tempPhoneNumber = '';
    var tempCallingCode = '';
    const phoneNumber = value.phoneNumber;
    if (!phoneNumber.startsWith('+')) {
      tempCallingCode = phoneNumber.slice(0, phoneNumber.length - 10);
      tempPhoneNumber =
        '+' +
        tempCallingCode +
        ' ' +
        phoneNumber.slice(tempCallingCode.length, phoneNumber.length);
    }

    const fromDate = this.getActualWeekInTimeStamp().fromDate;
    const toDate =
      moment(new Date(this.getActualWeekInTimeStamp().toDate * 1000))
        .add(1, 'days')
        .valueOf() / 1000;
    try {
      var res = {};
      if (isConnected) {
        res = await epaisaRequest(
          {
            showSplited: true,
            fromDate,
            toDate,
            customerId: value.customerId,
            merchantId: this.props.user.merchantId,
          },
          '/transaction/list',
          'GET'
        );
      }

      const transactionList = res.success // for offline validation
        ? res.success === 1
          ? res.list
          : [] // for empty list validation
        : [];

      // alert(JSON.stringify(res))

      this.props.navigation.navigate(CUSTOMER_PERSONAL_DETAILS, {
        customer:
          tempPhoneNumber == ''
            ? value
            : { ...value, phoneNumber: tempPhoneNumber },
        transactions: transactionList,
        updateData: this.getListFromAPI,
        refreshing: values => {
          //loading_service.showLoading();
          let changed = false;
          let newList = this.state.ceGrouped.map(item => {
            if (item.title == values.firstName[0].toUpperCase()) {
              let newArray = item.data.map(cust => {
                if (cust.customerId == values.customerId) {
                  changed = true;
                  console.log(value);
                  return values;

                  //alert(values.firstName);
                } else {
                  return cust;
                }
              });
              return { ...item, data: newArray };
            } else {
              return item;
            }
          });
          if (changed) {
            this.setState({ ceGrouped: newList }, () => {
              this;
            });
          }

          //this.setState({})
        },
      });

      loading_service.hideLoading();
    } catch (error) {
      loading_service.hideLoading();
      console.log(error);
    }
  };

  callListTransactions = async (value, temp) => {
    // alert('callListTransactions called')
    const user = realm.objectForPrimaryKey('User', 0);
    //loading_service.showLoading();
    this.setState({ loading: true });
    let fromDate = moment(temp[0], 'YYYY-MM-DD')
      .unix()
      .toString();
    let toDate = moment(temp[1], 'YYYY-MM-DD')
      .add(1, 'day')
      .unix()
      .toString();
    const toDateAdded = moment(new Date(value.toDate * 1000))
      .add(1, 'days')
      .unix()
      .toString();
    try {
      const res = await epaisaRequest(
        {
          showSplited: true,
          fromDate,
          toDate,
          customerId: this.state.selectedCustomer.customerId,
          merchantId: user.merchantId,
        },
        '/transaction/list',
        'GET'
      );
      const from = moment(new Date(value.fromDate * 1000)).format(
        'DD MMM. YYYY'
      );
      const to = moment(new Date(value.toDate * 1000)).format('DD MMM. YYYY');

      //alert(JSON.stringify(res))

      if (res.success === 1) {
        const transactionList = res.list;

        this.setState(
          { rangeSelected: from + ' - ' + to, transactions: transactionList },
          () => {
            loading_service.hideLoading();
            this.showDateRangePicker(false);
            this.setState({ loading: false });
            return this.state.transactions;
          }
        );

        this.setState({ transactionListLandscape: transactionList }, () =>
          loading_service.hideLoading()
        );
      } else {
        //alert(21)
        this.setState(
          { rangeSelected: from + ' - ' + to, transactions: [] },
          () => {
            loading_service.hideLoading();
            this.showDateRangePicker(false);
            this.setState({ loading: false });
            //alert_service.showAlert(res.message);
            return this.state.transactions;
          }
        );
      }
    } catch (error) {
      loading_service.hideLoading();
      console.log(error);
    }
  };

  showCustomerDetailsLandscape = async value => {
    this.setState({ selectedCustomer: value, loading: true });

    //loading_service.showLoading();

    const fromDate = this.getActualWeekInTimeStamp().fromDate;
    const toDate =
      moment(new Date(this.getActualWeekInTimeStamp().toDate * 1000))
        .add(1, 'days')
        .valueOf() / 1000;
    try {
      const res = await epaisaRequest(
        {
          showSplited: true,
          fromDate,
          toDate,
          customerId: value.customerId,
          merchantId: this.props.user.merchantId,
        },
        '/transaction/list',
        'GET'
      );

      console.log('RESULT TRANSACTIONS', res);
      const transactionList = res.success === 1 ? res.list : [];

      this.setState(
        { transactionListLandscape: transactionList, loading: false },
        () => loading_service.hideLoading()
      );

      // this.props.navigation.navigate(CUSTOMER_PERSONAL_DETAILS, {
      //   customer: value,
      //   transactions: transactionList,
      //   refreshing: this.getListFromAPI,
      // });

      // alert('tamaño lista: '+transactionList.length)
    } catch (error) {
      this.setState({ loading: false });
      loading_service.hideLoading();
      console.log(error);
    }
  };

  openModal = async () => {
    let isConnected = await NetInfo.isConnected.fetch();

    if (isConnected) {
      this.setState({ addCustomer: true });
    } else {
      alert_service.showAlert('This feature requires Internet connection');
    }
  };

  closeAddModal = () => {
    this.setState({ addCustomer: false });
  };

  changeViewPersonal = () => {
    this.setState({ navigateToPersonal: true, navigateToTransactions: false });
  };

  changeViewTransactions = () => {
    this.setState({
      navigateToTransactions: true,
      navigateToPersonal: false,
      initialRange: [
        moment()
          .subtract(6, 'days')
          .format('YYYY-MM-DD'),
        moment().format('YYYY-MM-DD'),
      ],
    });
  };
  changeUserData = val => {
    let newCeGroup = this.state.ceGrouped.map(item => {
      let newData = item.data.map(cust => {
        if (cust.customerId == val.customerId) {
          return val;
        } else {
          return cust;
        }
      });

      return { ...item, data: newData };
    });
    this.setState({ ceGrouped: newCeGroup });
    //alert(JSON.stringify(this.state.ceGrouped))
  };
  showDateRangePicker = value => {
    this.setState({ twoDays: false, dateRangeVisible: value });
  };

  renderLeftOptions = () => {
    return ['1', '2'];
  };

  renderRightOptions = () => {
    return ['3', '4'];
  };

  render() {
    return (
      <SafeAreaView fullscreen={true} bottomColor={colors.darkWhite}>
        <View style={styles.container}>
          {this.state.orientation ? (
            <View style={styles.container}>
              <Background orientation={'portrait'}>
                {/* <Header
                  label="CUSTOMERS"
                  orientation="portrait"
                  leftOptions={this.renderLeftOptions()}
                  rightOptions={this.renderRightOptions()}
                /> */}
                <Header
                  navigation={this.props.navigation}
                  label="CUSTOMERS"
                  showAddModal={this.openModal}
                />
                {this.state.noUsersRegistered ? (
                  <View
                    style={{
                      flex: 1,
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                  >
                    <TextMontserrat style={portraitStyles.noUsersLabel}>
                      No users registered
                    </TextMontserrat>
                  </View>
                ) : (
                  <View style={{ flex: 1 }}>
                    <SearchInput onChangeText={this._textChange} />
                    {this.state.searching ? (
                      <View style={portraitStyles.loadingSearching}>
                        <ActivityIndicator size={'large'} color={'#174285'} />
                      </View>
                    ) : (
                      // OR
                      <View style={{ flex: 1 }}>
                        <CustomerList
                          items={this.state.ceGrouped}
                          onSelectedItem={this.showCustomerDetails}
                          updateList={
                            this.state.filterCharacters !== ''
                              ? () => {}
                              : this.getListFromAPI.bind(this)
                          }
                          customerListSize={this.state.customersRawData.length}
                        />
                        {/*<Animated.View
                            style={[
                              portraitStyles.loadingContainer,
                              {
                                transform: [
                                  { translateY: this.state.bounceValue },
                                ],
                              },
                            ]}
                          >
                            <ActivityIndicator
                              size={'large'}
                              color={'#174285'}
                            />
                          </Animated.View>*/}
                      </View>
                    )}
                  </View>
                )}
              </Background>
            </View>
          ) : (
            //  ******** LANDSCAPE MODE ********
            <View style={[styles.container]}>
              <Background orientation={'landscape'}>
                {/* <Header
                    label="CUSTOMERS"
                    orientation="landscape"
                    leftOptions={this.renderLeftOptions()}
                    rightOptions={this.renderRightOptions()}
                  /> */}
                <Header
                  navigation={this.props.navigation}
                  label="CUSTOMERS"
                  showAddModal={this.openModal}
                />
                <View style={{ flex: 1 }}>
                  {this.state.noUsersRegistered ? (
                    <View
                      style={{
                        flex: 1,
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}
                    >
                      <TextMontserrat style={landscapeStyles.noUsersLabel}>
                        No users registered
                      </TextMontserrat>
                    </View>
                  ) : (
                    <View style={{ flex: 1, flexDirection: 'row' }}>
                      <View style={{ width: '37.5%', zIndex: 10 }}>
                        <BoxShadow setting={shadowStyles.landscape}>
                          <View style={{ flex: 1, backgroundColor: '#fff' }}>
                            <SearchInput onChangeText={this._textChange} />
                            {this.state.searching ? (
                              <View style={portraitStyles.loadingSearching}>
                                <ActivityIndicator
                                  size={'large'}
                                  color={'#174285'}
                                />
                              </View>
                            ) : (
                              // OR
                              <View style={{ flex: 1 }}>
                                <CustomerList
                                  onSelectedItem={
                                    this.showCustomerDetailsLandscape
                                  }
                                  updateList={
                                    this.state.filterCharacters !== ''
                                      ? () => {}
                                      : this.getListFromAPI.bind(this)
                                  }
                                  items={this.state.ceGrouped}
                                  customerListSize={
                                    this.state.customersRawData.length
                                  }
                                />
                                {/*<Animated.View
                                    style={[
                                      portraitStyles.loadingContainer,
                                      {
                                        transform: [
                                          {
                                            translateY: this.state.bounceValue,
                                          },
                                        ],
                                      },
                                      { width: '100%' },
                                    ]}
                                  >
                                    <ActivityIndicator
                                      size={'large'}
                                      color={'#174285'}
                                    />
                                  </Animated.View>*/}
                              </View>
                            )}
                          </View>
                        </BoxShadow>
                      </View>
                      {this.state.selectedCustomer ? (
                        <View style={{ flex: 1 }}>
                          <TabNavigatorDetails
                            onPressPersonal={this.changeViewPersonal}
                            onPressTransactions={this.changeViewTransactions}
                            isConnected={this.state.isConnected}
                          />
                          {this.state.navigateToPersonal ? (
                            this.state.loading ? null : (
                              <PersonalInfo
                                changeCustomer={val => this.changeUserData(val)}
                                item={this.state.selectedCustomer}
                              />
                            )
                          ) : this.state.loading ? null : (
                            <TransactionsInfo
                              items={this.state.transactionListLandscape}
                              rangeSelected={this.state.initialRange}
                              datePicker={this.showDateRangePicker}
                            />
                          )}
                        </View>
                      ) : null}
                    </View>
                  )}
                </View>
              </Background>
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
                  style={{
                    flex: 1,
                    backgroundColor: 'rgba(0,0,0,0.5)',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                  activeOpacity={1}
                  onPressOut={() => {
                    this.setState({ twoDays: false });
                    this.showDateRangePicker(false);
                  }}
                >
                  <DateRangePicker
                    //markedDates={this.state.initialRange}
                    addOneDay={date => {
                      this.setState({ tempDate: date.dateString });
                    }}
                    maxDate={moment().format('YYYY-MM-DD')}
                    initialRange={this.state.initialRange}
                    onSuccess={(s, e) => {
                      this.setState({ interval: [s, e], twoDays: true });
                      /*let start = this.toTimestampFromPicker(s)
                    let end = this.toTimestampFromPicker(e)
                    this.callListTransactions({
                      ['fromDate']: start, 
                      ['toDate']: end,
                    })*/
                    }}
                    onHandleOk={() => {
                      this.setState({
                        initialRange: this.state.twoDays
                          ? [
                              moment(
                                this.state.interval[0],
                                'YYYY/MM/DD'
                              ).format('YYYY-MM-DD'),
                              moment(
                                this.state.interval[1],
                                'YYYY/MM/DD'
                              ).format('YYYY-MM-DD'),
                            ]
                          : this.state.tempDate != '' &&
                            this.state.tempDate != null
                          ? [this.state.tempDate, this.state.tempDate]
                          : [
                              moment(
                                this.state.interval[0],
                                'YYYY/MM/DD'
                              ).format('YYYY-MM-DD'),
                              moment(
                                this.state.interval[1],
                                'YYYY/MM/DD'
                              ).format('YYYY-MM-DD'),
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
                      this.callListTransactions(
                        {
                          ['fromDate']: start,
                          ['toDate']: end,
                        },
                        this.state.interval
                      );
                    }}
                    onHandleCancel={() =>
                      this.setState({ dateRangeVisible: false })
                    }
                    theme={{ markColor: '#174285', markTextColor: 'white' }}
                  />
                </TouchableOpacity>
              </Modal>
            </View>
          )}
        </View>
        {this.state.addCustomer && (
          <Modal
            visible={true}
            transparent={true}
            animationType="fade"
            onRequestClose={this.closeAddModal}
          >
            <ModalAdd
              list_customers={() => {}}
              permiss={{ auth_key: this.state.auth_key }}
              // numberAdd={this.state.number}
              // values={newVal}
              verifyCustomer={() => {}}
              addCustomer={() => {}}
              closeModal={this.closeAddModal}
              onFinished={() => {
                //loading_service.showLoading();
                this.setState(
                  {
                    customersRawData: [],
                  },
                  () => {
                    this.setState({ gceGrouped: [] }, () => {
                      this.getListFromAPI();
                    });
                  }
                );
              }}
            />
          </Modal>
        )}
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flex: 1,
    backgroundColor: '#fff',
  },
});

const mapStateToProps = state => ({
  state: state.cashData,
  user: state.auth.user,
});

export default connect(mapStateToProps)(CustomerScreen);
