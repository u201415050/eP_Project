//import liraries
import React, { Component, Fragment } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  BackHandler,
  Platform,
} from 'react-native';
import NavigationService from '../../../services/navigation/index';
import Header from '../components/header/header';
import colors from '../../modal_delivery/styles/colors';
import CompanySection from '../components/companySection/companySection';
import { SafeAreaView, TextMontserrat } from 'components';
import { connect } from 'react-redux';
import Indicators from '../components/indicators/indicators';
import TotalSales from '../components/totalSales/totalSales';
import PaymentTypes from '../components/paymentTypes/paymentTypes';
import TopProducts from '../components/topProducts/topProducts';
import TransactionsGraphic from '../components/transactionsGraphic/transactionsGraphic';
import { getDashboard } from '../services/dashboard_services';
// create a component
import { dashboardActions } from '../actions';
import loading_service from '../../../services/loading_service';
import moment from 'moment';
import { isTablet } from '../../cash_register/constants/isLandscape';
import ModalLogout from '../../cash_register/components/Modals/ModalLogout/modalLogout';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import * as screen_names from '../../../navigation/screen_names';
import { epaisaRequest } from '../../../services/epaisa_service';
import realm from '../../../services/realm_service';
import alert_service from '../../../services/alert_service';
import { Background } from 'components';

class DashboardTotalSales extends Component {
  state = {
    grossSales: 0,
    fromDate: moment().subtract(6, 'days'),
    endDate: moment(),
    payments: [],
    modalInvalid: false,
    totalSales: 0,
    nSales: 0,
    averageSales: 0,
    show: false,
    arrayDates: [
      { x: new Date(2018, 3, 1), y: 100 },
      { x: new Date(2018, 3, 2), y: 0 },
      { x: new Date(2018, 3, 3), y: 200 },
      { x: new Date(2018, 3, 4), y: 150 },
      { x: new Date(2018, 3, 5), y: 10.1 },
    ],
  };
  componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', () => {
      this.props.navigation.navigate(screen_names.CASH_REGISTER);
      return true;
    });
    this.getData(this.state.fromDate, this.state.endDate);
  }
  getData(fromDate, endDate) {
    try {
      let userData = realm.objectForPrimaryKey('User', 0);
      this.setState({ user: userData });
      const { userId, merchantId } = userData;
      //loading_service.showLoading();
      this.setState({ show: false });
      //alert("END:"+endDate+" Start:"+fromDate)
      epaisaRequest(
        {
          fromDate: fromDate.format('YYYY-MM-DD'),
          endDate: endDate.format('YYYY-MM-DD'),
          merchantId,
          userId,
        },
        '/reports/newdashboard',
        'GET'
      )
        .then(response => {
          //alert(response)
          if (
            response.message ==
            'Your request was made with invalid credentials.'
          ) {
            loading_service.hideLoading();
            this.setState({ modalInvalid: true });
          } else {
            const { set_dashboard_data } = this.props;

            set_dashboard_data(response.response);
            //console.log("AQUI",JSON.stringify(response.response.TopPayments))
            let listPayments = response.response.TopPayments;
            let listTransactions = response.response.Transactions;
            let totalSales = 0;
            let nSales = 0;
            let averageSales = 0;
            let arrayDates = [];
            listTransactions.map((item, i) => {
              totalSales += parseFloat(item.total);
              nSales += parseInt(
                /*item.numberPayments*/ item.numberTransactions
              );
              averageSales += parseFloat(item.averageAmount);
              arrayDates.push({
                x: moment(item.dateTransactions, 'YYYY-MM-DD').toDate(),
                y: parseFloat(item.total),
              });
            });
            //console.log(arrayDates)
            this.setState(
              {
                fromDate,
                endDate,
                payments: listPayments,
                totalSales,
                nSales,
                averageSales,
                arrayDates,
              },
              () => {
                this.setState({ show: arrayDates.length > 0 });
              }
            );
            loading_service.hideLoading();
          }
        })
        .catch(error => {
          alert_service.showAlert(error, () =>
            NavigationService.navigate(screen_names.CASH_REGISTER)
          );
          loading_service.hideLoading();
        });
    } catch (error) {
      alert_service.showAlert(error, () =>
        NavigationService.navigate(screen_names.CASH_REGISTER)
      );
      loading_service.hideLoading();
    }
  }
  changeRangeDate = (fromDate, endDate) => {
    this.setState({
      fromDate,
      endDate,
    });
    this.getData(fromDate, endDate);
  };
  render() {
    const { dataDashboard } = this.props.state;
    const { merchant } = this.props;
    //const totalgrosssale = dataDashboard!=null?dataDashboard.weeksale.totalgrosssale:0
    const {
      payments,
      totalSales,
      arrayDates,
      nSales,
      averageSales,
    } = this.state;
    return (
      <SafeAreaView fullscreen={true} bottomColor={colors.darkWhite}>
        <Background color={colors.darkWhite}>
          <View style={styles.container}>
            <Header navigation={this.props.navigation} label="DASHBOARD" />
            {isTablet ? (
              <View
                style={{
                  flexDirection: 'row',
                  width: '100%',
                  borderBottomColor: '#979797',
                  borderBottomWidth: 1,
                }}
              >
                <View
                  style={{
                    width: '50%',
                    borderRightColor: '#979797',
                    borderRightWidth: 1,
                  }}
                >
                  <CompanySection merchant={merchant} />
                </View>
                <View style={{ width: '50%' }}>
                  <Indicators
                    averageSales={averageSales}
                    nSales={nSales}
                    changeRangeDate={this.changeRangeDate}
                    rangeDate={{
                      from: this.state.fromDate,
                      to: this.state.endDate,
                    }}
                    grossSales={totalSales}
                  />
                </View>
              </View>
            ) : (
              <CompanySection merchant={merchant} />
            )}
            {isTablet ? (
              <View style={{ flex: 1, width: '100%' }}>
                <View
                  style={{
                    flexDirection: 'row',
                    height: '100%',
                    width: '100%',
                  }}
                >
                  <View
                    style={{
                      width: '50%',
                      height: '100%',
                      alignItems: 'center',
                      paddingVertical: hp('3%'),
                      justifyContent: 'space-between',
                    }}
                  >
                    <TotalSales
                      totalSales={totalSales}
                      rangeDate={{
                        from: this.state.fromDate,
                        to: this.state.endDate,
                      }}
                    />
                    <PaymentTypes grossSales={totalSales} payments={payments} />
                  </View>
                  <View
                    style={{
                      width: '50%',
                      height: '100%',
                      paddingVertical: hp('3%'),
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <TransactionsGraphic
                      show={this.state.show}
                      totalSales={totalSales}
                      data={arrayDates}
                      rangeDate={{
                        from: this.state.fromDate,
                        to: this.state.endDate,
                      }}
                    />
                  </View>
                </View>
              </View>
            ) : (
              <ScrollView
                keyboardShouldPersistTaps="always"
                style={{ flex: 1, width: '100%' }}
                contentContainerStyle={{
                  alignItems: 'center',
                  paddingBottom: hp('2%'),
                }}
              >
                {isTablet ? null : (
                  <Indicators
                    averageSales={averageSales}
                    nSales={nSales}
                    changeRangeDate={this.changeRangeDate}
                    rangeDate={{
                      from: this.state.fromDate,
                      to: this.state.endDate,
                    }}
                    grossSales={totalSales}
                  />
                )}

                {isTablet ? null : (
                  <TotalSales
                    totalSales={totalSales}
                    rangeDate={{
                      from: this.state.fromDate,
                      to: this.state.endDate,
                    }}
                  />
                )}
                {isTablet ? null : (
                  <PaymentTypes grossSales={totalSales} payments={payments} />
                )}
                {isTablet ? null : (
                  <TransactionsGraphic
                    show={this.state.show}
                    totalSales={totalSales}
                    data={arrayDates}
                    rangeDate={{
                      from: this.state.fromDate,
                      to: this.state.endDate,
                    }}
                  />
                )}
              </ScrollView>
            )}

            <ModalLogout
              active={this.state.modalInvalid}
              closeModal={() => {
                this.setState({ modalInvalid: false });
              }}
            />
          </View>
        </Background>
      </SafeAreaView>
    );
  }
}

// define your styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    // backgroundColor: colors.darkWhite,
  },
});
const mapStateToProps = state => ({
  state: state.dashboard,
  merchant:
    state.cashData.personalConfig != null
      ? state.cashData.personalConfig.merchant
      : null,
  user: state.auth.user,
});

const mapDispatchToProps = dispatch => ({
  set_dashboard_data: val => {
    return dispatch(dashboardActions.set_dashboard_data(val));
  },
});

//make this component available to the app
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DashboardTotalSales);
