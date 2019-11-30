import React, { Component } from 'react';
import {
  Text,
  View,
  FlatList,
  Image,
  TouchableOpacity,
  ScrollView,
  TextInput,
  VirtualizedList,
} from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import { TextMontserrat } from 'components';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import moment from 'moment';
import Data from '../data';
import { isTablet } from '../../../../settings/constants/isLandscape';
import ItemTransaction from './itemTransaction';
const cardsId = [22, 23, 24, 28, 29, 31, 32, 33, 35, 36, 37];
const transactionsId = [8, 3, 2, 4, 6, 10, 7, 5];
const paymentsStatus = {
  "8": 5, 
  "3":2, 
  "2":4, 
  "4": 3, 
  "6":6, 
  "10":8, 
  "7":7, 
  "5":10
};
export default class Result extends Component {
  constructor() {
    super();

    this.state = {
      transactions: [],
    };
  }

  render() {
    let { sSearchBar } = styles;
    const {
      openDetails,
      listData2,
      filters,
      dateLimits,
      up,
      textSearch,
      mapCustomer,
    } = this.props;
    //console.log(listData2);
    const status= filters.list[1]
    const listStatus= status.map((item,i)=>{return item?paymentsStatus[`${transactionsId[i]}`]:'x'}).filter(item=>item!='x')
    //alert(listStatus)
    const listData =
      textSearch != '' && textSearch != ' '
        ? listData2.filter((item2, i) => {
            console.log(item2);
            let item = item2.Transactions[0];
            //if(i==0)alert(mapCustomer[item2.CustomerId].indexOf(textSearch));
            //if(item2.CustomerId!=null) alert(1);
            if (item.paymentId.toString().indexOf(textSearch) != -1) {
              return { ...item2, key: i };
            } else if (item2.Customer != null) {
              //console.log(mapCustomer[item2.CustomerId])
              //alert(item2.CustomerId)
              if (
                item2.Customer.toUpperCase().indexOf(
                  textSearch.toUpperCase()
                ) != -1
              ) {
                return { ...item2, key: i };
              }
            } //(item2.CustomerId!=null?'mapCustomer[item2.CustomerId].toUpperCase()':'').indexOf(textSearch.toUpperCase()) != -1)
          })
        : listData2.map((item2, i) => {
            return { ...item2, key: i };
          });
    return (
      <FlatList
        onEndReached={this.props.loadMore}
        onEndReachedThreshold={0.5}
        style={styles.container}
        ref={ref => {
          this.flatListRef = ref;
        }}
        data={listData}
        contentContainerStyle={{
          paddingHorizontal: isTablet ? wp('1.5%') : wp('1%'),
        }}
        initialNumToRender={7}
        renderItem={({ item, index }) => {
          let show = true;
          //console.log(item)
          let itemCard = null;
          let isCard = item.split == '1'; //item.Transactions.length > 1;
          if (item.split == '1') {
            let splitElement = {
              paymentId: item.PaymentId,
              transactionType: 'Split',
              transactionStatusId: item.paymentStatusId == 10
              ? 8
              : item.paymentStatusId == 2
              ? 4
              : item.paymentStatusId == 13
              ? 7
              : item.Transactions[0].transactionStatusId,
              transactionStatus:
                item.paymentStatusId == 10
                  ? 'Cancelled'
                  : item.paymentStatusId == 2
                  ? 'Pending'
                  : item.paymentStatusId == 13
                  ? 'Refunded'
                  : item.Transactions[0].transactionStatus,
              transactionAmount: 0,
              transactionsList: item.Transactions,
              created_at: item.Transactions[0].created_at,
            };
            let day = moment.unix(splitElement.created_at);
            let totalAmount = 0;
            let iter = 0;
            item.Transactions.map((itemSplit, i) => {
              if (!cardsId.includes(itemSplit.transactionTypeId)) {
                isCard = false;
              }
              if (
                itemSplit.transactionStatus != 'Failed' &&
                itemSplit.transactionStatus != 'Cancelled'
              ) {
                iter = iter + 1;
                itemCard = itemSplit;
                totalAmount =
                  totalAmount + parseFloat(itemSplit.transactionAmount);
              } else {
                if (i == item.Transactions.length - 1 && itemCard == null) {
                  itemCard = itemSplit;
                  if (totalAmount == 0) {
                    totalAmount =
                      totalAmount + parseFloat(itemSplit.transactionAmount);
                  }
                }
                //isCard = true;
              }
            });
            if(!(listStatus.length==0||listStatus.includes(splitElement.transactionStatusId))){
              show=false
            }
            if ((!isCard || item.split == '1') && show) {
              let indexOf = splitElement.paymentId
                .toString()
                .indexOf(textSearch);
              //alert(totalAmount)
              splitElement.transactionAmount = totalAmount;
              console.log(splitElement)
              return (
                <ItemTransaction
                  customerData={{ name: item.Customer, number: '' }}
                  key={index}
                  openDetails={openDetails}
                  item={splitElement}
                  index={index}
                  length={listData.length}
                  textSearch={textSearch}
                  day={day}
                  indexOf={indexOf}
                />
              );
            }
          }
          if (
           ((isCard && itemCard != null) ||
            item.Transactions.length == 1 ||
            item.split == '0')
            && show
          ) {
            let item2 = isCard
              ? itemCard
              : {
                  ...item.Transactions[0],
                  transactionStatusId: item.paymentStatusId == 10
                  ? 5
                  : item.Transactions[0].transactionStatusId,
                  transactionStatus:
                    item.paymentStatusId == 10
                      ? 'Cancelled'
                      : item.Transactions[0].transactionStatus,
                };

            let day = moment.unix(item2.created_at);
            let indexOf = item2.paymentId.toString().indexOf(textSearch);
            //if(item.Customer!=''){
            //alert(JSON.stringify(item.Customer))
            //}
            //if(listStatus.length==0||listStatus.includes(item2.transactionStatusId)){
            return (
              <ItemTransaction
                key={index}
                openDetails={openDetails}
                customerData={{ name: item.Customer, number: '' }}
                item={item2}
                index={index}
                length={listData.length}
                textSearch={textSearch}
                day={day}
                indexOf={indexOf}
              />
            );//}
          }
        }}
      />
    );
  }
}

const styles = EStyleSheet.create({
  container: {
    width: '100%',
    flex: 1,
  },
  item: {
    color: '#52565F',
    fontSize: hp('2.2%'),
    fontWeight: '800',
  },
  date: {
    fontSize: hp('1.5%'),
    letterSpacing: hp('0.1%'),
    fontWeight: '700',
    color: '#888888',
    marginTop: hp('0.5%'),
    marginLeft: isTablet ? wp('1%') : wp('3%'),
  },
  inv: {
    fontSize: hp('1.6%'),
    fontWeight: '700',
    color: '#888888',
  },
  high: {
    fontSize: hp('1.6%'),
    fontWeight: '700',
    color: '#888888',
    backgroundColor: '#5AC8FA',
  },
  price: {
    color: '#8FC742',
    fontSize: hp('2.1%'),
    fontWeight: '700',
    marginBottom: hp('0.5%'),
    letterSpacing: 1,
  },

  card: {
    paddingVertical: hp('1.4%'),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'white',
    borderWidth: 0.2,
    borderRadius: 2,
    paddingHorizontal: isTablet ? wp('2%') : wp('4%'),
    borderColor: '#ddd',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 4,
    marginTop: hp('1.5%'),
  },
  inone: {
    paddingLeft: hp('0.5%'),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  inFour: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginBottom: hp('0.4%'),
  },
  inthree: {
    alignItems: 'flex-end',
    justifyContent: 'center',
    marginBottom: hp('0.4%'),
  },
  inin: {
    paddingRight: hp('1.8%'),
  },
  img: {
    width: hp('7%'),
    height: hp('7%'),
  },
});
