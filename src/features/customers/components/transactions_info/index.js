import React, { Component } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  NetInfo,
} from 'react-native';
import { styles } from './styles/portrait';
import GraphicsChart from './components/graphics';
import TransactionList from './components/transaction_list';
import { formatNumberCommasDecimal, timeStampToDate } from 'api';
import moment from 'moment';
import { portraitStyles } from './styles/portrait';
import { landscapeStyles } from './styles/landscape';
import colors from '../../../my_account/styles/colors';
import { TextMontserrat } from 'components';
import { isPortrait } from 'api/functions';

class TransactionsInfo extends Component {
  constructor(props) {
    super(props);
  }

  state = {
    items: this.props.items,
    isConnected: true,
  };

  async UNSAFE_componentWillMount() {
    const connected = await NetInfo.isConnected.fetch();
    this.setState({ isConnected: connected });
  }

  parsingData = values => {
    console.log({ ce_values: values });
    return values.map(item => {
      let transactionTotal = 0;
      if (item.Transactions) {
        item.Transactions.map(obj => {
          if (obj.transactionStatusId == 8 || obj.transactionStatusId == 2) {
            transactionTotal += parseFloat(obj.transactionAmount);
          }
        });
        return {
          payment:
            item.Transactions.length > 1
              ? 'Split'
              : item.Transactions[0].transactionType,
          invoice: item.PaymentId,
          transactionTypeId: item.Transactions[0].transactionTypeId,
          total: formatNumberCommasDecimal(
            parseFloat(transactionTotal).toFixed(2)
          ),
          date: timeStampToDate(item.Transactions[0].created_at),
          // date: moment(item.created_at.toISOString().substring(0, item.created_at.toISOString().indexOf('T')),'YYYY-MM-DD')
        };
      }
    });
    //alert(JSON.stringify(elements))
  };

  parsingDataForGraphics = values => {
    return values.map(item => {
      let transactionTotal = 0;

      item.Transactions.map(obj => {
        if (obj.transactionStatusId == 8 || obj.transactionStatusId == 2) {
          transactionTotal += parseFloat(obj.transactionAmount);
        }
      });
      //alert(transactionTotal)
      return {
        x: new Date(moment.unix(item.Transactions[0].created_at)),
        y: parseFloat(transactionTotal),
      };
    });
  };

  calculatingTotal = values => {
    //console.log('PARSINGDATA', values)
    if (values)
      return values
        .map(item => parseFloat(item.transactionAmount))
        .reduce((a, b) => a + b, 0);
    else return 0;
  };

  render() {
    const styles = isPortrait() ? portraitStyles : landscapeStyles;

    return (
      <View style={{ flex: 1 }}>
        {this.state.isConnected ? (
          this.props.onLoading ? null : (
            <View style={{ flex: 1 }}>
              <GraphicsChart
                rangeSelected={this.props.rangeSelected}
                items={this.parsingDataForGraphics(this.props.items)}
                datePicker={this.props.datePicker}
                // totalSales={this.calculatingTotal(this.props.items)}
              />
              <TransactionList items={this.parsingData(this.props.items)} />
            </View>
          )
        ) : (
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <TextMontserrat style={styles.noConnectionLabel}>
              No Internet connection
            </TextMontserrat>
          </View>
        )}
      </View>
    );
  }
}

export default TransactionsInfo;
