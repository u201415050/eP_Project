//import liraries
import React, { Component } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity } from 'react-native';
import ButtonGradient from '../../../payments/screens/cash/components/transaction_details/components/buttonGradientColor/ButtonGradient';
import { TextMontserrat } from 'components';
import { isTablet } from '../../../cash_register/constants/isLandscape';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

// create a component
class ModalSure extends Component {
  render() {
    const { active, closeModal, handleYes, handleNo } = this.props;
    return (
      <Modal
        visible={active}
        onRequestClose={closeModal}
        animationType="fade"
        transparent={true}
      >
        <View style={styles.container}>
          <View style={styles.wrapper}>
            <TextMontserrat style={styles.textMessage}>
              Are you sure
            </TextMontserrat>
            <TextMontserrat style={styles.textMessage}>
              you want to delete ?
            </TextMontserrat>
            <View style={styles.buttonsContainer}>
              <View style={styles.button}>
                <ButtonGradient
                  onPress={handleYes}
                  heightB={true}
                  radius={hp('2%')}
                  firstColor={'#114B8C'}
                  secondColor={'#0079AA'}
                  title={'YES'}
                />
              </View>
              <View style={styles.button}>
                <ButtonGradient
                  onPress={handleNo}
                  heightB={true}
                  radius={hp('2%')}
                  firstColor={'#114B8C'}
                  secondColor={'#0079AA'}
                  title={'NO'}
                />
              </View>
            </View>
          </View>
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
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
  },
  wrapper: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: hp('1%'),
    width: isTablet ? '40%' : '80%',
    paddingVertical: hp('4%'),
    backgroundColor: 'white',
    elevation: 6,
  },
  textMessage: {
    color: 'rgba(0,0,0,0.7)',
    fontSize: isTablet ? hp('3.5%') : wp('4.8%'),
    fontWeight: '600',
  },
  buttonsContainer: {
    flexDirection: 'row',
    marginTop: hp('3%'),
    width: '80%',
    justifyContent: 'space-between',
  },
  button: {
    width: '48%',
  },
});

//make this component available to the app
export default ModalSure;
