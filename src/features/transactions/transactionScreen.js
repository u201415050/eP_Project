import React, { Component, Fragment } from 'react';
import {
  View,
  StyleSheet,
  ImageBackground,
  Dimensions,
  TextInput,
  TouchableOpacity,
  Image,
  Modal,
  AsyncStorage,
  Platform,
  NetInfo,
} from 'react-native';
import * as _ from 'lodash';
//import SearchHeader from './components/Header/searchHeader'
import { DateRangePicker, SafeAreaView, Loading } from 'components';
import SavedTitle from './components/SavedTitle/SavedTitle';
import Transactions from './components/Transactions/Transactions';
import Orientation from 'react-native-orientation-locker';
import { connect } from 'react-redux';
import { isTablet } from './constants/isLandscape';
import colors from '../settings/styles/colors';
import Header from './components/Header/Header';
import { cashActions } from '../cash_register/actions';
import RightSideBar from '../cash_register/components/RightSideBar/rightSideBar';
import ModalDetails from './components/Modals/ModalCustomer/modalCustomer';
import loading_service from '../../services/loading_service';
import { getTransactions } from '../login/services/user_service';
import ModalLogout from '../cash_register/components/Modals/ModalLogout/modalLogout';
import moment from 'moment';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { epaisaRequest } from '../../services/epaisa_service';
import realm, { getTable } from '../../services/realm_service';
import alert_service from '../../services/alert_service';
import { syncTransactionsFromApi } from '../../sync/sync_tasks';
//import mixpanel from '../../services/mixpanel';
import * as screen_names from '../../navigation/screen_names';
import navigation from '../../services/navigation';
const paymentsId = [2, 14, 27, 20, 21, 35, 5, 8, 17, 9, 19, 25];
const transactionsId = [8, 3, 2, 4, 6, 10, 7, 5];

const cardsId = [22, 23, 24, 28, 29, 31, 32, 33, 35, 36, 37];

class TransactionsHistory extends Component {
  static navigationOptions = {
    header: null,
  };

  constructor(props) {
    super(props);
    //mixpanel.mp.track('Transaction History Screen');
    this.domConnection = NetInfo.isConnected;
    this.updateTransactionList = this.updateTransactionList.bind(this);
    //this.getText = this.getText.bind(this);
  }

  state = {
    initialRange: [
      moment()
        .subtract(7, 'days')
        .format('YYYY-MM-DD'),
      moment(
        moment()
          .add(1, 'day')
          .format('YYYY/MM/DD')
      )
        .subtract(1, 'second')
        .format('YYYY-MM-DD'),
    ],
    datepicker: false,
    modalOptions: false,
    modalActive: false,
    modalRight: false,
    modalTransaction: false,
    modalDiscount: false,
    modalDelivery: false,
    SearchHeader: false,
    modalSearch: false,
    modalDetails: false,
    modalInvalid: false,
    searchTerm: '',
    position: 0,
    coord: { x: 0, y: 0 },
    dataTransaction: null,
    active: false,
    limit: 0,
    transactions: [],
    transactionsTemp: [],
    count: 0,
    min: 0,
    max: 1000000,
    filterList: {
      state: false,
      list: [
        { min: 0, max: 1000000 },
        [false, false, false, false, false, false, false, false],
        [
          false,
          false,
          false,
          false,
          false,
          false,
          false,
          false,
          false,
          false,
          false,
          false,
        ],
        [],
      ],
    },
    actualTransactionDetail: null,
    employees: [],
    startDate: moment().subtract(1, 'week'),
    endDate: moment(
      moment()
        .add(1, 'day')
        .format('YYYY/MM/DD')
    ).subtract(1, 'second'),
    up: '',
    textSearch: '',
    fontSearch: '2',
    listUpdated: [],
    modalFilter: false,
    indexLoading: 0,
    getting: false,
    parameters: {
      showSplited: true,
      sort: {
        created_at: 3,
      },
      amountFrom: 0,
      amountTo: 1000000,
      fromDate: moment()
        .subtract(7, 'days')
        .unix()
        .toString(),
      toDate: moment(
        moment()
          .add(1, 'day')
          .format('YYYY/MM/DD')
      )
        .subtract(1, 'second')
        .unix()
        .toString(),
      // merchantId: this.props.state.userPermi.merchantId,
      merchantId: 0,
      limit: 20,
      offset: 0,
      mapCustomer: {},
    },
    user: {},
  };
  componentWillMount() {
    !isTablet ? Orientation.lockToPortrait() : Orientation.lockToLandscape();
  }

  isConnectedFunction(handle) {
    NetInfo.isConnected.fetch().then(res => {
      if (res) {
        handle();
      } else {
        alert_service.showAlert('Please connect to Internet');
      }
    });
  }

  async updateTransactionList(connected) {
    try {
      //let errorMessage = '';
      //const that = this;
      //alert(context)//.bind(this)
      if (connected) {
        this.handleUpdate();
        //navigation.navigate(screen_names.CASH_REGISTER);
      }
      //let userData = realm.objectForPrimaryKey('User', 0);
      //console.log("RAPHAELBRAVODEDO",context)
    } catch (error) {
      alert(error);
    }
  }

  async handleUpdate() {
    let errorMessage = '';
    let userData = realm.objectForPrimaryKey('User', 0);
    this.setState({
      transactions: [],
      listUpdated: [],
    });
    //loading_service.showLoading();
    errorMessage = await syncTransactionsFromApi(
      userData,
      () => {
        // alert('1  - '+JSON.stringify(userData))
        this.setState({ modalInvalid: true });
      },
      () => {
        loading_service.hideLoading();
        this.setState({
          transactions: Array.from(getTable('TransactionGrouped')).sort(
            function(a, b) {
              return (
                b.Transactions[0].created_at - a.Transactions[0].created_at
              );
            }
          ), //Object.entries(response.list) , //response.list,
          listUpdated: Array.from(getTable('TransactionGrouped')).sort(function(
            a,
            b
          ) {
            return b.Transactions[0].created_at - a.Transactions[0].created_at;
          }), //Object.entries(response.list) ,//response.list,
          count: userData.sync.transactionsCount,
          limit: userData.sync.transactionsLimit,
          indexLoading: 1,
        });
      }
    );

    if (errorMessage == 'No Transactions found with given details') {
      alert_service.showAlert(errorMessage);
    }
  }

  componentWillUnmount() {
    this.domConnection.removeEventListener(
      'connectionChange',
      this.updateTransactionList
    );
  }
  async componentDidMount() {
    //const savedUser = await AsyncStorage.getItem('user');
    let userData = realm.objectForPrimaryKey('User', 0);

    this.domConnection.addEventListener(
      'connectionChange',
      this.updateTransactionList
    );

    const isConnected = await NetInfo.isConnected.fetch();
    this.setState({
      user: userData,
      transactions: [],
    });
    // alert(JSON.stringify(this.state.user))
    //loading_service.showLoading();

    // });}else{

    let errorMessage = '';

    if (isConnected) {
      errorMessage = await syncTransactionsFromApi(
        userData,
        () => {
          // alert('1  - '+JSON.stringify(userData))
          this.setState({ modalInvalid: true });
        },
        () => {
          loading_service.hideLoading();
          //alert(this.state.user.sync.transactionsCount +' '+this.state.user.sync.transactionsLimit)
          console.log(
            'FRAOOOOO',
            Array.from(getTable('TransactionGrouped')).sort(function(a, b) {
              return (
                b.Transactions[0].created_at - a.Transactions[0].created_at
              );
            })
          );
          this.setState({
            transactions: Array.from(getTable('TransactionGrouped')).sort(
              function(a, b) {
                return b.PaymentId - a.PaymentId;
              }
            ), //Object.entries(response.list) , //response.list,
            listUpdated: Array.from(getTable('TransactionGrouped')).sort(
              function(a, b) {
                return b.PaymentId - a.PaymentId;
              }
            ), //Object.entries(response.list) ,//response.list,
            count: isConnected ? this.state.user.sync.transactionsCount : 20,

            limit: isConnected ? this.state.user.sync.transactionsLimit : 20,
            indexLoading: 1,
          });
        }
      );

      if (errorMessage == 'No Transactions found with given details') {
        alert_service.showAlert(errorMessage);
      }
    } else {
      loading_service.hideLoading();
      this.setState({
        transactions: Array.from(getTable('TransactionGrouped')).sort(function(
          a,
          b
        ) {
          return b.PaymentId - a.PaymentId;
        }), //Object.entries(response.list) , //response.list,
        listUpdated: Array.from(getTable('TransactionGrouped')).sort(function(
          a,
          b
        ) {
          return b.PaymentId - a.PaymentId;
        }), //Object.entries(response.list) ,//response.list,
        count: isConnected ? this.state.user.sync.transactionsCount : 20,
        limit: isConnected ? this.state.user.sync.transactionsLimit : 20,
        indexLoading: 1,
      });
    }
    loading_service.hideLoading();

    epaisaRequest(
      { merchantId: this.state.user.merchantId },
      '/userlist',
      'GET'
    ).then(response => {
      //alert(JSON.stringify(response))
      this.setState({ employees: response.response.Users });
    });

    //alert(Array.from(getTable('TransactionGrouped'))[0].Transactions.length)

    // }
  }
  loadMore = () => {
    if (this.state.count < this.state.transactions.length) {
      let ite = parseInt(this.state.count / 100);
      // const { userPermi } = this.props.state;
      const userPermi = this.state.user;
      for (let i = 0; i < ite; i++) {
        getTransactions(this.state.user.auth_key, {
          ...this.state.parameters,
          merchantId: this.state.user.merchantId,
        }).then(response => {
          this.setState({
            transactionsTemp: [
              ...this.state.transactionsTemp,
              ...response.list,
            ],
          });
        });
      }
    }
  };
  changeTransaction = transactionId => {
    let newTransaction = this.state.transactions.map(item => {
      if (item.transactionId == transactionId) {
        return { ...item, transactionStatus: 'Refunded' };
      } else {
        return item;
      }
    });
    this.setState(
      {
        transactions: newTransaction,
      },
      () => {
        this.handleLoadFilter();
      }
    );
    console.log(newTransaction);
  };
  refundOffline = paymentsId => {
    let TransactionToRefund = getTable('TransactionGrouped').filtered(
      `PaymentId=${paymentsId}`
    );

    realm.write(() => {
      TransactionToRefund[0].Transactions = Array.from(
        TransactionToRefund[0].Transactions
      ).map(item => {
        let newItem = item;
        newItem.transactionStatus = 'Refunded';
        newItem.transactionStatusId = 7;

        return newItem;
      });
    });

    //alert(JSON.stringify(TransactionToRefund[0]))
    this.setState({
      transactions: Array.from(getTable('TransactionGrouped')).sort(function(
        a,
        b
      ) {
        return b.PaymentId - a.PaymentId;
      }), //Object.entries(response.list) , //response.list,
      listUpdated: Array.from(getTable('TransactionGrouped')).sort(function(
        a,
        b
      ) {
        return b.PaymentId - a.PaymentId;
      }),
    });
  };
  openModalDetails = async val => {
    // const { userPermi } = this.props.state;
    const { userPermi } = this.state.user;
    const isConnected = await NetInfo.isConnected.fetch();
    // loading_service.showLoading();
    //1)
    if (isTablet) {
      this.right.changedjdjd();
    }
    //alert(this.right.refunded)
    if (isConnected) {
      //loading_service.hideLoading();
      //alert(val.paymentId)
      //try {
      epaisaRequest(
        {
          merchantId: this.state.user.merchantId,
          paymentId: [val.paymentId],
          include: ['orders', 'transactions'],
        },
        '/payment/list',
        'GET'
      )
        .then(response => {
          if (response.success == 0) {
            if (
              response.message ==
              'Your request was made with invalid credentials.'
            ) {
              //loading_service.hideLoading();
              this.setState({ modalInvalid: true });
              return false;
            } else {
              //loading_service.hideLoading();
              return false;
              // alert(response.message)
            }
          } else {
            //loading_service.hideLoading();
            //let newVal=_.cloneDeep(val)
            let configurated = { ...response.response[0], ...val };
            //console.log("valueSelected",val)
            //epaisaRequest({'1':configurated.paymentId, '2':1,'3':configurated.checksum},"/receipt","GET").then(response=>alert(JSON.stringify(response)))
            //try{getReceipt(configurated.checksum,configurated.paymentId).then(res=>{alert(JSON.stringify(res))})}catch(e){alert(e)}
            //alert(JSON.stringify(configurated))
            let last4Digits = '';
            if (cardsId.includes(configurated.transactionTypeId)) {
              configurated.transactions.map(tran => {
                if (tran.last4Digits) {
                  if (tran.last4Digits != '') {
                    last4Digits = tran.last4Digits;
                  }
                }
              });
            }
            let item = {
              customer: null,
              type: configurated.order.generalDiscountType,
              discount: configurated.order.generalDiscount,
              delivery: configurated.order.deliveryCharges,
              subtotal: configurated.order.subTotal,
              paymentId: configurated.paymentId,
              created_at: configurated.created_at,
              transactionType: configurated.transactionType,
              transactionTypeId: configurated.transactionTypeId,
              status: configurated.transactionStatus,
              date:
                moment.unix(configurated.created_at).format('DD/MM/YYYY') +
                ' at ' +
                moment.unix(configurated.created_at).format('hh:mm A'),
              total: configurated.paymentAmount,
              products: configurated.order.customItems,
              dateFormat: moment.unix(configurated.created_at),
              transactionId: configurated.transactionId,
              changeTransaction: this.changeTransaction,
            };
            //console.log("CESARMUJER",newVal)
            // let newConfig= _.cloneDeep(configurated)
            //loading_service.hideLoading();
            //setTimeout(()=>

            //console.log(configurated);
            this.setState(
              {
                actualTransactionDetail: { ...configurated, last4Digits },
                // modalDetails: !isTablet,
                dataTransaction: { ...item, last4Digits },
                active: isTablet,
              },
              () => {
                //loading_service.hideLoading();
                //alert(1)
              }
            );
            //),2000)

            //console.log(this.state.actualTransactionDetail);
          }
          return true;
        })
        .then(res => {
          //alert(res)
          if (res) {
            this.setState({ modalDetails: !isTablet });
          }
        })
        .catch(error => {
          //loading_service.hideLoading();
          //

          alert(JSON.stringify(error));
          //alert(JSON.stringify(error));
        });
      /*} catch (error) {
        loading_service.hideLoading();
        //alert(error);
      }*/
    } else {
      loading_service.hideLoading();

      let paymentItem = getTable('PaymentGrouped')
        .filtered(`paymentId= ${val.paymentId}`)
        .map(itemCustom => itemCustom)[0];
      //alert(JSON.stringify(paymentItem))

      if (paymentItem != null) {
        let configurated = { ...paymentItem, ...val };

        let item = {
          customer: null,
          type: configurated.order.generalDiscountType,
          discount: configurated.order.generalDiscount,
          delivery: configurated.order.deliveryCharges,
          subtotal: configurated.order.subTotal,
          paymentId: configurated.paymentId,
          created_at: configurated.created_at,
          transactionType: configurated.transactionType,
          transactionTypeId: configurated.transactionTypeId,
          status: configurated.transactionStatus,
          date:
            moment.unix(configurated.created_at).format('DD/MM/YY') +
            ' at ' +
            moment.unix(configurated.created_at).format('h:mm A'),
          total: configurated.paymentAmount,
          products: configurated.order.customItems,
          dateFormat: moment.unix(configurated.created_at),
          transactionId: configurated.transactionId,
          changeTransaction: this.changeTransaction,
        };
        this.setState(
          {
            actualTransactionDetail: configurated,
            modalDetails: !isTablet,
            dataTransaction: item,
            active: isTablet,
          },
          () => {
            loading_service.hideLoading();
          }
        );
        //this.right.setState({refunded:false})
      } else {
        loading_service.hideLoading();
        alert_service.showAlert('Please connect to Internet');
      }
    }
  };

  loadMoreData = () => {
    //alert(this.state.count + ">"+this.state.transactions.length)
    if (this.state.limit < this.state.count && !this.state.getting) {
      this.setState({ getting: true });
      // const { userPermi } = this.props.state;
      const { userPermi } = this.state.user;
      //alert(this.state.limit)
      epaisaRequest(
        {
          ...this.state.parameters,
          merchantId: this.state.user.merchantId,
          offset: this.state.limit,
        },
        '/transaction/list',
        'GET'
      ).then(response => {
        if (
          response.message == 'Your request was made with invalid credentials.'
        ) {
          loading_service.hideLoading();
          this.setState({ modalInvalid: true });
        } else {
          this.setState({
            limit: this.state.limit + response.limit,
            indexLoading: this.state.indexLoading + 1,
          });
          let newTransactions = [...this.state.transactions, ...response.list];
          this.setState({
            transactions: newTransactions,
          });
        }
        setTimeout(() => {
          this.setState({ getting: false });
        }, 1000);
      });
    }
  };
  handleLoadFilter = async () => {
    let isConnected = await NetInfo.isConnected.fetch();
    this.setState({ transactions: [] });
    // const { userPermi } = this.props.state;
    const { userPermi } = this.state.user;
    let parameters = {
      ...this.state.parameters,
      merchantId: this.state.user.merchantId,
    };
    if (isConnected) {
      //this.setState({ loading: true });
      //loading_service.showLoading();
    }
    parameters.amountFrom = this.state.filterList.list[0].min;
    parameters.amountTo =
      this.state.filterList.list[0].max == 0
        ? 0.00001
        : this.state.filterList.list[0].max;
    let paymentsSelected = this.state.filterList.list[2];
    let paymentsFilter = [];
    let transactionsSelected = this.state.filterList.list[1];
    let transactionsFilter = [];
    let usersSelected = this.state.filterList.list[3];
    if (paymentsSelected.includes(true)) {
      paymentsSelected.map((item, i) => {
        if (item) {
          if (i == 1) {
            // alert(cardsId)
            paymentsFilter = [...paymentsFilter, ...cardsId];
          } else {
            paymentsFilter.push(paymentsId[i]);
          }
        }
      });
      parameters.transactionTypeId = paymentsFilter;
    } else {
      delete parameters.transactionTypeId;
    }
    if (usersSelected.length > 0) {
      parameters.userId = usersSelected;
    } else {
      delete parameters.userId;
    }
    if (transactionsSelected.includes(true)) {
      transactionsSelected.map((item, i) => {
        if (item) {
          transactionsFilter.push(transactionsId[i]);
        }
      });
      parameters.transactionStatusId = transactionsFilter;
    } else {
      delete parameters.transactionStatusId;
    }
    //alert(JSON.stringify(parameters))
    //console.log(this.state.parameters)
    this.setState({ parameters });

    if (isConnected) {
      epaisaRequest(parameters, '/transaction/list', 'GET')
        .then(response => {
          if (
            response.message ==
            'Your request was made with invalid credentials.'
          ) {
            this.setState({ loading: false }, () => {
              this.setState({ modalInvalid: true });
            });
            //loading_service.hideLoading();
          } else {
            this.setState({ loading: false }, () => {
              this.setState({
                transactions: response.list,
                listUpdated: response.list,
                count: response.count,
                limit: response.limit,
                indexLoading: 1,
              });
            });
            //loading_service.hideLoading();
          }
          //setTimeout(()=>,1000)
        })
        .catch(error => {
          alert(error);
        });
    } else {
      //loading_service.hideLoading();
      this.setState({ loading: false });
      try {
        let {
          transactionStatusId,
          transactionTypeId,
          userId,
          sort,
          fromDate,
          toDate,
        } = parameters;
        let sorted = sort ? sort : null;
        let newList = Array.from(
          getTable('TransactionGrouped').filtered('Transactions.@size = 1')
        ).filter(
          item =>
            parseFloat(item.Transactions[0].transactionAmount) >=
              parameters.amountFrom &&
            parseFloat(item.Transactions[0].transactionAmount) <=
              parameters.amountTo &&
            item.Transactions[0].created_at >= fromDate &&
            item.Transactions[0].created_at <= toDate
        );
        if (transactionStatusId) {
          newList = newList.filter(item =>
            transactionStatusId.includes(
              item.Transactions[0].transactionStatusId
            )
          );
        }
        if (transactionTypeId) {
          newList = newList.filter(item =>
            transactionTypeId.includes(item.Transactions[0].transactionTypeId)
          );
        }
        if (userId) {
          newList = newList.filter(item =>
            userId.includes(item.Transactions[0].userId)
          );
        }
        //alert(transactionAmount)
        if (sorted) {
          if (sorted['tbl_transactions.transactionAmount'] == 3) {
            //alert(transactionAmount)
            newList = newList.sort(function(a, b) {
              return (
                b.Transactions[0].transactionAmount -
                a.Transactions[0].transactionAmount
              );
            });
          } else {
            newList = newList.sort(function(a, b) {
              return (
                a.Transactions[0].transactionAmount -
                b.Transactions[0].transactionAmount
              );
            });
          }
        } else {
          newList = newList.sort(function(a, b) {
            return b.PaymentId - a.PaymentId;
          });
        }
        this.setState({
          transactions: newList,
          listUpdated: newList,
        });
      } catch (error) {
        //alert(error);
      }
    }
  };

  modifyLimits = val => {
    let limits = this.state.filterList.list;
    limits[0] = val;
    this.setState({
      filterList: { ...this.state.filterList, list: limits },
    });
  };
  addStatusFilter = val => {
    let limits = this.state.filterList.list;
    limits[1] = val;
    console.log(val);
    this.setState({
      filterList: { ...this.state.filterList, list: limits },
    });
  };
  toggleFilters = val => {
    this.setState({
      filterList: { ...this.state.filterList, state: true },
    });
  };
  offFilters = val => {
    this.setState({
      filterList: { ...this.state.filterList, state: false },
    });
  };
  addPayFilter = val => {
    let limits = this.state.filterList.list;
    limits[2] = val;
    console.log(val);
    this.setState({
      filterList: { ...this.state.filterList, list: limits },
    });
  };
  addEmployeeFilter = val => {
    let limits = this.state.filterList.list;
    limits[3] = val;
    console.log(val);
    this.setState({
      filterList: { ...this.state.filterList, list: limits },
    });
  };
  getIfCard = name => {
    if (name.indexOf('ePaisa') != -1) {
      return 'Card Payment';
    } else {
      return name;
    }
    //if()
  };
  handleFilter = () => {
    const {
      transactions,
      filterList,
      initialRange,
      up,
      textSearch,
    } = this.state;
    const dateLimits = {
      start: moment(initialRange[0]),
      end: moment(initialRange[1]),
    };
    const filters = filterList;
    const data = transactions;
    let newEnd = moment(dateLimits.end.toDate());
    newEnd.add(1, 'day');

    const listData2 = data
      .filter((item, i) => {
        if (filters.state) {
          if (
            filters.list[0].min < parseFloat(item.transactionAmount) &&
            filters.list[0].max > parseFloat(item.transactionAmount) &&
            (filters.list[1].length == 0 ||
              filters.list[1].includes(item.transactionStatus)) &&
            (filters.list[2].length == 0 ||
              filters.list[2].includes(this.getIfCard(item.transactionType))) &&
            (filters.list[3].length == 0 ||
              filters.list[3].includes(item.userId)) &&
            (moment.unix(item.created_at).isAfter(dateLimits.start) &&
              newEnd.isAfter(moment.unix(item.created_at)))
          ) {
            if (
              textSearch == '' ||
              (textSearch != '' &&
                (item.paymentId.toString().indexOf(textSearch) != -1 ||
                  item.name.indexOf(textSearch) != -1))
            ) {
              return { ...item, key: i };
            }
          }
        } else {
          if (
            moment.unix(item.created_at).isAfter(dateLimits.start) &&
            newEnd.isAfter(moment.unix(item.created_at))
          ) {
            if (
              textSearch == '' ||
              (textSearch != '' &&
                (item.paymentId.toString().indexOf(textSearch) != -1 ||
                  item.name.indexOf(textSearch) != -1))
            ) {
              return { ...item, key: i };
            }
          }
        }

        //alert(dateLimits.start.toDate())
      })
      .sort(function(a, b) {
        b.created_at - a.created_at;
      });
    let listData =
      up == ''
        ? listData2
        : listData2.sort(function(a, b) {
            if (up == 'h') {
              return b.transactionAmount - a.transactionAmount;
            } else {
              return a.transactionAmount - b.transactionAmount;
            }
          });
    this.setState({ listUpdated: listData });
  };
  clear = () => {
    this.setState(
      {
        filterList: {
          state: false,
          list: [
            { min: 0, max: 1000000 },
            [false, false, false, false, false, false, false, false],
            [
              false,
              false,
              false,
              false,
              false,
              false,
              false,
              false,
              false,
              false,
              false,
              false,
            ],
            [],
          ],
        },
      },
      this.handleLoadFilter
    );
  };
  render() {
    const { dataTransaction } = this.state;
    return (
      <SafeAreaView fullscreen={true} bottomColor={colors.darkWhite}>
        <ImageBackground
          source={require('../../assets/images/bg/background_cart_p.png')}
          resizeMode={'cover'}
          style={{
            width: '100%',
            height: '100%',
            backgroundColor: colors.darkWhite,
          }}
        >
          <View
            style={[isTablet ? { flexDirection: 'row', height: '100%' } : null]}
          >
            <View
              style={{
                height: '100%',
                width: Dimensions.get('window').width * (isTablet ? 0.65 : 1),
              }}
            >
              <Header
                userData={this.state.user}
                limits={{ min: this.state.min, max: this.state.max }}
                setMin={val => this.setState({ min: val })}
                setMax={val => this.setState({ max: val })}
                addStatusFilter={this.addStatusFilter}
                toggleFilters={this.toggleFilters}
                handleFilter={this.handleLoadFilter}
                openFilterModal={() => this.setState({ modalFilter: true })}
                closeFilterModal={() => this.setState({ modalFilter: false })}
                clear={this.clear}
                addEmployeeFilter={this.addEmployeeFilter}
                filter={this.state.filterList.list}
                modifyLimits={this.modifyLimits}
                offFilters={this.offFilters}
                addPayFilter={this.addPayFilter}
                employees={this.state.employees}
                coord={this.state.coord}
                widthModal="50%"
                active={this.state.modalTransaction}
                closeModal={() => {
                  this.setState({ modalTransaction: false });
                }}
                openSearch={() => {
                  this.setState({ SearchHeader: true });
                }}
                openFilter={() => this.setState({ modalTransaction: true })}
                toggle={(posx, posy) => {
                  //alert('posx' + posx);
                  this.setState({ coord: { x: posx, y: posy } });
                }}
                navigation={this.props.navigation}
                label="TRANSACTIONS"
              />

              <SavedTitle
                handleFilter={this.handleLoadFilter}
                openDatePicker={() => this.setState({ datepicker: true })}
                sortby={val => {
                  this.setState(
                    {
                      parameters: {
                        ...this.state.parameters,
                        merchantId: this.state.user.merchantId,
                        sort: {
                          'tbl_payments.paymentAmount': val == 'h' ? 3 : 4,
                          'tbl_transactions.transactionAmount':
                            val == 'h' ? 3 : 4,
                        },
                      },
                    },
                    () => {
                      this.handleLoadFilter();
                    }
                  );
                }}
                setInitial={val => {
                  let newParameters = {
                    ...this.state.parameters,
                    merchantId: this.state.user.merchantId,
                  };
                  console.log(val);
                  newParameters.fromDate = moment(val[0], 'YYYY-MM-DD')
                    .unix()
                    .toString();
                  newParameters.toDate = moment(val[1], 'YYYY-MM-DD')
                    .add(1, 'day')
                    .unix()
                    .toString();
                  delete newParameters.sort;
                  console.log(newParameters);
                  this.setState({
                    initialRange: val,
                    parameters: newParameters,
                  });
                }}
                // initialRange={[moment().subtract(7, 'days'), moment()]}
                // start={[moment().subtract(7, 'days')]}
                // end={[moment()]}
                initialRange={this.state.initialRange}
                start={this.state.initialRange[0]}
                end={this.state.initialRange[1]}
                changeStart={(val, custom) => {
                  this.setState({ startDate: val, up: '' }, () => {
                    custom(val.toDate());
                  });
                }}
                changeEnd={val => {
                  this.setState({ endDate: val, up: '' });
                }}
              />

              <Transactions
                mapCustomer={this.state.mapCustomer}
                loadMore={this.loadMoreData}
                textSearch={this.state.textSearch}
                up={this.state.up}
                dateLimits={{
                  start: moment(this.state.initialRange[0]),
                  end: moment(this.state.initialRange[1]),
                }}
                filters={this.state.filterList}
                data={this.state.transactions || []}
                openDetails={val => {
                  if (isTablet) {
                    this.right.s;
                  }
                  this.openModalDetails(val);
                }}
              />
              {this.state.SearchHeader ? (
                <View
                  style={{
                    width: '100%',
                    elevation: 25,
                    zIndex: 25,
                    top: 0,
                    height: hp('10%'),
                    position: 'absolute',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <View
                    style={[
                      styles.searchInput,
                      isTablet ? { width: '98%' } : null,
                    ]}
                  >
                    <View
                      style={{
                        position: 'absolute',
                        left: wp('3%'),
                        height: '100%',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Image
                        source={require('./assets/img/Shape.png')}
                        style={[
                          {
                            tintColor: '#808080',
                            width: hp('2.5%'),
                            height: hp('2.5%'),
                          },
                        ]}
                      />
                    </View>
                    <TextInput
                      ref={ref => (this.inputField = ref)}
                      underlineColorAndroid="rgba(0,0,0,0)"
                      placeholder="Search by Payment ID/ Customer Name"
                      value={this.state.textSearch}
                      onBlur={() => {
                        this.setState({ SearchHeader: false });
                      }}
                      onChangeText={textSearch => {
                        this.setState({ textSearch });
                      }}
                      style={{
                        marginLeft: hp('2.7%') + wp('4%'),
                        paddingVertical: 0,
                        width: '75%',
                        height: '100%',
                        fontFamily: 'Montserrat-Bold',
                        fontSize: hp('2%'),
                        color: 'rgba(0,0,0,0.6)',
                      }}
                    />
                    <TouchableOpacity
                      onPress={() => {
                        this.setState({
                          SearchHeader: false,
                          textSearch: '',
                        });
                      }}
                      style={{
                        position: 'absolute',
                        right: hp('1%'),
                        height: '100%',
                        paddingHorizontal: hp('1%'),
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Image
                        source={require('./assets/img/clear.png')}
                        style={{ width: hp('3%'), height: hp('3%') }}
                      />
                    </TouchableOpacity>
                  </View>
                </View>
              ) : null}

              <ModalDetails
                refundOffline={this.refundOffline}
                changeTransaction={this.changeTransaction}
                auth_key={this.state.user.auth_key}
                data={this.state.actualTransactionDetail || null}
                widthModal="50%"
                active={this.state.modalDetails}
                closeModal={() => {
                  this.setState({ modalDetails: false });
                }}
                handleFilter={this.handleLoadFilter}
              />
            </View>
            <ModalLogout
              active={this.state.modalInvalid}
              closeModal={() => {
                this.setState({ modalInvalid: false });
              }}
            />
            {isTablet ? (
              <View style={{ flex: 1 }}>
                <View
                  style={{
                    elevation: 30,
                    position: 'absolute',
                    height: '100%',
                    width: '100%',
                    shadowOffset: { width: 5, height: 5 },
                    shadowColor: 'grey',
                    shadowOpacity: 0.5,
                    shadowRadius: 10,
                    backgroundColor: 'white',
                  }}
                />
                <View
                  style={{
                    elevation: 30,
                    position: 'absolute',
                    height: '100%',
                    width: '100%',
                    backgroundColor: 'white',
                  }}
                />
                <View
                  style={{
                    elevation: 30,
                    position: 'absolute',
                    height: '100%',
                    width: '100%',
                    backgroundColor: 'white',
                  }}
                />

                <RightSideBar
                  //tempCustomer={tempCustomer}
                  rightSideBarRef={x => (this.right = x)}
                  active={this.state.active}
                  temporaly={true}
                  allDataofTransaction={
                    this.state.actualTransactionDetail || null
                  }
                  tempCustomer={
                    this.state.actualTransactionDetail
                      ? {
                          name:
                            this.state.actualTransactionDetail.name ||
                            'No customer',
                          number:
                            this.state.actualTransactionDetail.number || '',
                        }
                      : null
                  }
                  handleFilter={this.handleLoadFilter}
                  typeTemp={dataTransaction ? dataTransaction.type : '%'}
                  productsTemp={dataTransaction ? dataTransaction.products : []}
                  changeTransaction={this.changeTransaction}
                  discount={dataTransaction ? dataTransaction.discount : '0'}
                  delivery={dataTransaction ? dataTransaction.delivery : '0'}
                  subtotal={dataTransaction ? dataTransaction.subtotal : '0'}
                  total={dataTransaction ? dataTransaction.total : '0'}
                />
              </View>
            ) : null}
          </View>
          {this.state.loading && <Loading />}
        </ImageBackground>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: '100%',
    alignItems: 'center',
    backgroundColor: colors.darkWhite,
  },
  searchInput: {
    width: '95%',
    backgroundColor: 'white',
    height: '70%',
    //marginTop: hp('1%'),
    borderRadius: 7,
    justifyContent: 'center',
  },
  containerLandscape: {
    flex: 1,
    height: '100%',
    flexDirection: 'row',
    backgroundColor: colors.darkWhite,
  },
  opacity: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: colors.opacityDin(0.5),
  },
  drawerRightContainer: {
    width: '100%',
    height: '100%',
    backgroundColor: 'red',
  },
  backgroundImage: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: 'red',
  },
});

const mapDispatchToProps = dispatch => ({
  sum_amo: val => {
    return dispatch(cashActions.sum_amount(val));
  },
  sum_tot: amount => {
    return dispatch(cashActions.sum_total(amount));
  },
  clear: () => {
    return dispatch(cashActions.clear_amount());
  },
  back: () => {
    return dispatch(cashActions.back_amount());
  },
  change: val => {
    return dispatch(cashActions.change_option(val));
  },
  discount: val => {
    return dispatch(cashActions.add_discount(val));
  },
  delivery: val => {
    return dispatch(cashActions.add_delivery(val));
  },
  addcustomer: val => {
    return dispatch(cashActions.add_customer(val));
  },
  remove_discount: () => {
    return dispatch(cashActions.remove_discount());
  },
  remove_delivery: () => {
    return dispatch(cashActions.remove_delivery());
  },
  list_customers: val => {
    return dispatch({ type: cashConstants.LIST_CUSTOMERS, payload: val });
  },
  clear_data: () => {
    return dispatch(cashActions.clear_data());
  },
  clear_customer: () => {
    return dispatch(cashActions.clear_customer());
  },
  set_items: val => {
    return dispatch(cashActions.set_items(val));
  },
  set_wallet: val => {
    return dispatch(cashActions.set_wallet(val));
  },
  set_products: val => {
    return dispatch(cashActions.set_products(val));
  },
});
const mapStateToProps = state => ({
  state: state.cashData,
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TransactionsHistory);
