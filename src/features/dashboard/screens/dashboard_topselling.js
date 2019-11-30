//import liraries
import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Header from '../components/header/header'
import colors from '../../modal_delivery/styles/colors';
// create a component
class DashboardTopSelling extends Component {
  render() {
    return (
      <View style={styles.container}>
        <Header navigation={this.props.navigation} label="DASHBOARD"/>
        <CompanySection/>
        <ScrollView keyboardShouldPersistTaps="always" style={{flex:1,width:'100%'}} contentContainerStyle={{alignItems:'center'}}>
          <Indicators/>
          <TotalSales/>
          <PaymentTypes/>
          <TopProducts/>
          <TransactionsGraphic/>
        </ScrollView>
      </View>
    );
  }
}

// define your styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: colors.darkWhite,
  },
});

//make this component available to the app
export default DashboardTopSelling;
