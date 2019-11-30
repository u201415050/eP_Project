import React, { Component } from 'react';
import { View, StyleSheet, ScrollView, ImageBackground } from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import Form from './formInvoice/form';
import Details from './details/details';
import realm from '../../../../services/realm_service';
import { syncOneTransactionFromApi } from '../../../../sync/sync_tasks';
class Content extends Component {
  constructor(props) {
    super(props);
    this.payment = this.props.payment;
    console.log(this.payment);
  }
  state = {
    formShow: true,
  };
  async componentWillUnmount() {
    const user = realm.objectForPrimaryKey('User', 0);
    let payId = this.payment.paymentResponse.initiate.response.paymentId;
    try {
      syncOneTransactionFromApi(user, payId);
    } catch (error) {
      console.log(error);
    }
  }
  renderTransactionsDetails(closeModal) {
    return Array.from(this.payment.transactions) // for improve cash
      .filter(x => x.process.response.transactionStatusId === 2)
      .map((transaction, i) => {
        const { icon, title, items } = transaction.getPaymentDetails();
        return (
          <View style={{ width: '100%' }} key={'transaction_' + i}>
            <Details
              closeModal={closeModal}
              offline={this.props.offline}
              transaction={transaction}
              payment={this.payment}
              refund={transaction.canRefund() && !this.payment.split}
              last={true}
              split={this.split}
              total={transaction.process.response.transactionAmount}
              items={items}
              icon={icon}
              title={title}
            />
          </View>
        );
      });
  }
  render() {
    this.paymentAmount = this.props.paymentAmount;
    const { landscape,closeModal } = this.props;

    return (
      <View
        style={{
          width: '100%',
          height: '100%',
          borderBottomLeftRadius: 15,
          borderBottomRightRadius: 15,
        }}
      >
        {landscape ? (
          <ImageBackground
            source={require('../../assets/img/background_landscape.png')}
            style={{ flex: 1 }}
            imageStyle={{
              borderBottomLeftRadius: 15,
              borderBottomRightRadius: 15,
            }}
            resizeMode={'cover'}
          >
            <View
              style={[
                styles.container,
                { flexDirection: 'row', paddingTop: hp('1%') },
              ]}
            >
              <View
                style={{
                  width: this.props.visible ? '50%' : '100%',
                  paddingBottom: hp('2.5%'),
                  paddingTop: hp('1.5%'),
                  paddingLeft: wp('0.4%'),
                  paddingRight: wp('0.2%'),
                }}
              >
                <ScrollView
                  showsVerticalScrollIndicator={false}
                  contentContainerStyle={{
                    paddingLeft: wp('1%'),

                    paddingRight: wp(this.props.visible ? '0.4%' : '1%'),
                    alignItems: 'center',
                  }}
                >
                  <View style={{ height: hp('0.1%') }} />

                  {this.renderTransactionsDetails(closeModal)}

                  <View style={{ height: hp('4.5%') }} />
                </ScrollView>
              </View>
              {this.props.visible ? (
                <View
                  style={{
                    width: '50%',
                    paddingBottom: hp('2.4%'),
                    paddingTop: hp('1.5%'),
                    paddingLeft: wp('0.6%'),
                    paddingRight: wp('1.4%'),
                  }}
                >
                  <Form
                  customerId={this.payment.paymentCustomerId}
                    closeModal={this.props.closeModal}
                    // items={this.props.details.items}
                    offline={this.props.offline}
                    formRef={this.props.formRef}
                    toggleForm={this.props.toggleForm}
                    payment={this.props.payment}
                  />
                </View>
              ) : null}
            </View>
          </ImageBackground>
        ) : (
          <ScrollView
            keyboardShouldPersistTaps="always"
            showsVerticalScrollIndicator={false}
            style={styles.container}
            contentContainerStyle={{ alignItems: 'center' }}
          >
            {this.state.formShow ? (
              <Form
              customerId={this.payment.paymentCustomerId}
                offline={this.props.offline}
                formRef={this.props.formRef}
                unshowForm={() => {
                  this.setState({ formShow: false });
                }}
                payment={this.props.payment}
              />
            ) : null}
            {this.renderTransactionsDetails(closeModal)}
            <View style={{ height: hp('0.5%') }} />
            <View style={{ height: hp('4.5%') }} />
          </ScrollView>
        )}
      </View>
    );
  }
}

// define your styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    paddingTop: hp('2.7%'),
    // backgroundColor: colors.darkWhite,
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
  },
});

export default Content;
