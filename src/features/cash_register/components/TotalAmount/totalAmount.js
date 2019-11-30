import React, { Component } from 'react';
import { Text, TouchableOpacity, AsyncStorage } from 'react-native';
import colors from '../../styles/colors';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import EStyleSheet from 'react-native-extended-stylesheet';
import { formatNumberCommasDecimal } from 'api';
import realm, { getTable } from '../../../../services/realm_service';
import { epaisaRequest } from '../../../../services/epaisa_service';
export default class TotalAmount extends Component {
  render() {
    const { value } = this.props;
    return (
      <TouchableOpacity disabled={true} style={styles.container}>
        <Text style={styles.title}>TOTAL AMOUNT</Text>
        <Text style={styles.title}>
          ₹{formatNumberCommasDecimal(parseFloat(value).toFixed(2))}
        </Text>
      </TouchableOpacity>
    );
  }
}

const styles = EStyleSheet.create({
  container: {
    width: '100%',
    height: hp('4%'),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.slateGray,
    paddingHorizontal: 20,
    elevation: -3,
  },
  title: {
    color: colors.white,
    fontSize: 13,
    letterSpacing: 2,
    fontFamily: 'Montserrat-SemiBold',
  },
  '@media (min-width: 200) and (max-width: 400)': {
    // media queries
    title: {
      fontSize: 11,
      fontWeight: '500',
      letterSpacing: 1,
    },
    container: {
      paddingHorizontal: 14,
    },
  },
});
