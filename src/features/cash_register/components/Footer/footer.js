import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
} from 'react-native';
import colors from '../../styles/colors';
import EStyleSheet from 'react-native-extended-stylesheet';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { TextMontserrat } from '../../../modal_delivery/components/texts';
export default class Footer extends Component {
  render() {
    const { toggleModal, customer } = this.props;
    if (customer) {
      return (
        <TouchableOpacity style={styles.container} onPress={toggleModal}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              width: '100%',
              paddingHorizontal: hp('1%'),
            }}
          >
            <View>
              <TextMontserrat
                style={{
                  fontWeight: '800',
                  fontSize: hp('2%'),
                  color: '#FFFFFF',
                  letterSpacing: 2,
                }}
              >
                {customer.name.substr(0,20)}{customer.name.length>20?'...':''}
              </TextMontserrat>
              {customer.number != '' ? (
                <TextMontserrat
                  style={{
                    fontWeight: '600',
                    fontSize: hp('1.8%'),
                    color: '#FFFFFF',
                  }}
                >
                  {customer.number}
                </TextMontserrat>
              ) : null}
            </View>
            <View>
              <TextMontserrat
                style={{
                  fontWeight: '700',
                  fontSize: hp('2.5%'),
                  color: '#FFFFFF',
                }}
              >
                {customer != null ? customer.rewardPoints || 0 : 0} Points
              </TextMontserrat>
            </View>
          </View>
        </TouchableOpacity>
      );
    } else {
      return (
        <TouchableOpacity style={styles.container} onPress={toggleModal}>
          <Image
            source={require('../../assets/img/Group.png')}
            style={styles.img}
          />
          <Text style={styles.title}> ADD CUSTOMER</Text>
        </TouchableOpacity>
      );
    }
  }
}

const styles = EStyleSheet.create({
  container: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.darkGray,
    paddingHorizontal: 10,
    flex: 1,
  },
  title: {
    color: colors.white,
    fontSize: hp('2.1'),
    letterSpacing: 2,
    fontFamily: 'Montserrat-Bold',
  },
  img: {
    height: hp('3.2%'),
    width: hp('3.2%'),
  },
});
