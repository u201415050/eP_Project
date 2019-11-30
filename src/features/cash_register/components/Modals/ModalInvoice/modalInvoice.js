import React, { Component } from 'react';
import { KeyboardAvoidingView, Modal, StyleSheet, View } from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import CardWithHeader from '../../cards/card_header';
import colors from '../../../styles/colors';
import Invoice from '../../../../invoice/invoice';
import InvoiceCash from '../../../../invoice/invoice_cash';

class ModalInvoice extends Component {
  state = {
    formVisible: true,
  };

  componentDidMount() {
    this.setState({ formVisible: true });
  }

  render() {
    const { active, closeModal, widthModal, isLandscape } = this.props;

    return (
      <Modal
        visible={active}
        transparent={true}
        animationType="fade"
        onRequestClose={closeModal}
      >
        <View style={styles.container}>
          <KeyboardAvoidingView
            keyboardVerticalOffset={-hp('40%')}
            style={{ height: '100%', width: '100%' }}
            contentContainerStyle={{
              alignItems: 'center',
              justifyContent: 'center',
            }}
            behavior="position"
          >
            <CardWithHeader
              customHeaderStyle={{ paddingVertical: hp('2%') }}
              backHeader="#43C141"
              colorTitle="#FFFFFF"
              isLandscape={isLandscape}
              sizeHeaderLabel={isLandscape ? '3.5%' : '3%'}
              customBodyStyle={{
                alignItems: 'center',
                justifyContent: 'center',
                borderBottomLeftRadius: 15,
                borderBottomRightRadius: 15,
              }}
              headerTitle="Invoice"
              closeButton={true}
              onPressCloseButton={closeModal}
              customCardStyle={{
                marginTop: hp('5.3%'),
                width: wp(this.state.formVisible ? widthModal : '50%'),
                height: hp('70%'),
              }}
            >
              <View style={styles.wrapper}>
                {!this.props.cash ? (
                  <Invoice
                    closeModal={closeModal}
                    next={this.props.next}
                    visible={this.state.formVisible}
                    toggleFormVisible={() => {}}
                  />
                ) : (
                  <InvoiceCash
                    closeModal={closeModal}
                    next={this.props.next}
                    visible={this.state.formVisible}
                    toggleFormVisible={() => {}}
                  />
                )}
              </View>
            </CardWithHeader>
          </KeyboardAvoidingView>
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
    justifyContent: 'flex-start',
    backgroundColor: colors.opacityDin(0.6),
  },
  wrapper: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
  },
  rowForm: {
    width: '130%',
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: '#174285',
    borderBottomWidth: 2,
  },
  leftForm: {
    flexDirection: 'row',
    width: '30%',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  separation: {
    borderColor: '#174285',
    borderRightWidth: 2,
    height: '100%',
  },
  rightForm: {
    width: '70%',
    flexDirection: 'row',
    alignItems: 'center',
  },
  drop: {
    marginRight: hp('0.6%'),
  },
  select: {
    textAlign: 'center',
    fontSize: wp('4.4%'),
    marginLeft: 10,
    color: '#174285',
    fontFamily: 'Montserrat-SemiBold',
    marginBottom: 5,
  },
  icon: {
    position: 'absolute',
    right: 4,
  },
  textInput: {
    paddingVertical: 0,
    color: '#174285',
    paddingLeft: wp('6%'),
    fontSize: hp('2.8%'),
    width: '80%',
    marginBottom: 5,
    fontFamily: 'Montserrat-Bold',
  },
  textDiscountAddButtonPortrait: {
    fontFamily: 'Montserrat-SemiBold',
    color: 'white',
    fontSize: hp('1.95%'),
    letterSpacing: 1.33,
    textAlign: 'center',
  },
  touchableModalDiscountAdd: {
    width: '130%',
    height: hp('6.25%'),
    marginTop: hp('5%'),
    borderRadius: 50,
    marginBottom: hp('3%'),
    alignItems: 'center',
  },
  dropdown: {
    position: 'absolute',
    width: '30%',
    elevation: 20,
    top: 0,
    left: 0,
    borderLeftColor: colors.opacityDin(0.1),
    borderRightColor: colors.opacityDin(0.3),
    borderBottomColor: colors.opacityDin(0.3),
    borderWidth: 1,
  },
  option: {
    textAlign: 'center',
    fontSize: hp('2.5%'),
    paddingVertical: hp('1.1%'),
    backgroundColor: '#FAFAFA',
    fontFamily: 'Montserrat-ExtraBold',
  },
  messageWrong: {
    width: '100%',
    position: 'absolute',
    top: 2,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  messageWrongLabel: {
    fontSize: hp('1.5'),
    color: '#D0021B',
    flexWrap: 'wrap',
    fontFamily: 'Montserrat-SemiBold',
    textAlign: 'center',
    justifyContent: 'center',
    marginTop: hp('0.2%'),
  },
});

export default ModalInvoice;
