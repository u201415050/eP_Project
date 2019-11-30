import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  ImageBackground,
} from 'react-native';
import Result from './Result/result';
import NumberButton from './Buttons/NumberButtons/numberButtons';
import HighButtonV from './Buttons/HighButton/HighButtonV';
import HighButtonH from './Buttons/HighButton/HighButtonH';
import colors from '../../styles/colors';
import EStyleSheet from 'react-native-extended-stylesheet';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { isTablet } from '../../constants/isLandscape';
export default class Calculator extends Component {
  render() {
    const { amount, sumAmount, sumTotal, cleanTotal, backAmount } = this.props;
    const isLandscape = isTablet;
    return (
      <View
        style={[
          styles.container,
          isLandscape
            ? { paddingHorizontal: 10, flex: 0, flexGrow: 1, flexWrap: 'wrap' }
            : null,
        ]}
      >
        <Result amount={amount} />
        <View style={styles.calcontainer}>
          <View style={styles.calcolumn}>
            <View style={styles.numpad}>
              <NumberButton
                number="1"
                type="number"
                handleSum={() => sumAmount(1)}
              />
              <NumberButton
                number="2"
                type="number"
                handleSum={() => sumAmount(2)}
              />
              <NumberButton
                number="3"
                type="number"
                handleSum={() => sumAmount(3)}
              />
            </View>
            <View style={styles.numpad}>
              <NumberButton
                number="4"
                type="number"
                handleSum={() => sumAmount(4)}
              />
              <NumberButton
                number="5"
                type="number"
                handleSum={() => sumAmount(5)}
              />
              <NumberButton
                number="6"
                type="number"
                handleSum={() => sumAmount(6)}
              />
            </View>
            <View style={styles.numpad}>
              <NumberButton
                number="7"
                type="number"
                handleSum={() => sumAmount(7)}
              />
              <NumberButton
                number="8"
                type="number"
                handleSum={() => sumAmount(8)}
              />
              <NumberButton
                number="9"
                type="number"
                handleSum={() => sumAmount(9)}
              />
            </View>
            <View style={styles.numpad}>
              <View style={{ flex: 1 }}>
                <NumberButton
                  number="C"
                  textcolor={colors.darkRed}
                  handleSum={cleanTotal}
                />
              </View>
              <View style={{ flex: 2 }}>
                <HighButtonH
                  number="0"
                  type="number"
                  actionButton={() => sumAmount(0)}
                />
              </View>
            </View>
          </View>
          <View style={styles.calcolumn2}>
            <View style={styles.numpad2}>
              <HighButtonV
                type="icon"
                icon={require('../../assets/img/arrow.png')}
                actionButton={backAmount}
              />
            </View>
            <View style={styles.numpad2}>
              <HighButtonV
                type="label"
                label="+"
                color={colors.darkSlateBlue}
                actionButton={sumTotal}
              />
            </View>
          </View>
        </View>
      </View>
    );
  }
}

const styles = EStyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center',
    paddingHorizontal: 5,
    height: hp('68%') - hp('6%'),
  },
  calcontainer: {
    paddingVertical: 3,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    flex: 1,
  },
  calcolumn: {
    width: '75%',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
  calcolumn2: {
    width: '25%',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
  numpad: {
    flexDirection: 'row',
    alignItems: 'stretch',
    justifyContent: 'center',
    height: '25%',
  },
  numpad2: {
    alignItems: 'stretch',
    justifyContent: 'center',
    width: '100%',
    height: '50%',
  },
  title: {
    color: colors.white,
    fontSize: 17,
    fontWeight: '700',
    letterSpacing: 2,
  },
});
