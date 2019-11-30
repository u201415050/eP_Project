import React, { Component } from 'react';
import { View } from 'react-native';
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
import { formatNumberCommasDecimal } from 'api';
export default class Calculator extends Component {
  constructor(props) {
    super(props);
  }
  state = {
    amount: '0.00',
  };
  componentDidMount() {
    if (this.props.clearAmount) {
      this.props.clearAmount(this.handle_clear);
    }
  }

  handle_number = value => {
    const amount = parseFloat(this.state.amount * 10 + value / 100).toFixed(2);
    if (amount <= 999999.99) {
      this.setState({ amount }, () => {
        if (this.props.onChange) {
          this.props.onChange(amount);
        }
      });
    }
  };
  handle_backspace = () => {
    const amount = (Math.floor(this.state.amount * 10) / 100).toFixed(2);
    this.setState({ amount }, () => {
      if (this.props.onChange) {
        this.props.onChange(amount);
      }
    });
  };

  handle_clear = () => {
    const amount = (0).toFixed(2);
    this.setState({ amount }, () => {
      if (this.props.onChange) {
        this.props.onChange(amount);
      }
    });
  };

  renderButton(n, handler) {
    return (
      <NumberButton number={n} type="number" handleSum={() => handler(n)} />
    );
  }

  render() {
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
        <Result amount={formatNumberCommasDecimal(parseFloat(this.state.amount).toFixed(2))}/>
        <View style={styles.calcontainer}>
          <View style={styles.calcolumn}>
            <View style={styles.numpad}>
              {[1, 2, 3].map(n => this.renderButton(n, this.handle_number))}
            </View>
            <View style={styles.numpad}>
              {[4, 5, 6].map(n => this.renderButton(n, this.handle_number))}
            </View>
            <View style={styles.numpad}>
              {[7, 8, 9].map(n => this.renderButton(n, this.handle_number))}
            </View>
            <View style={styles.numpad}>
              <View style={{ flex: 1 }}>
                <NumberButton
                  number="C"
                  textcolor={colors.darkRed}
                  handleSum={this.handle_clear}
                />
              </View>
              <View style={{ flex: 2 }}>
                <HighButtonH
                  number="0"
                  type="number"
                  actionButton={() => this.handle_number(0)}
                />
              </View>
            </View>
          </View>
          <View style={styles.calcolumn2}>
            <View style={styles.numpad2}>
              <HighButtonV
                type="icon"
                icon={require('../../assets/img/arrow.png')}
                actionButton={this.handle_backspace}
              />
            </View>
            <View style={styles.numpad2}>
              <HighButtonV
                type="label"
                label="+"
                color={colors.darkSlateBlue}
                actionButton={() => {
                  if (this.props.cancelTransaction) {
                    this.props.cancelTransaction();
                  }

                  this.props.order.addCustomItem({
                    unitPrice: +this.state.amount,
                    calculatedPrice: +this.state.amount,
                  });
                  // sumTotal(this.state.amount);
                  this.handle_clear();
                }}
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
    height: hp('68%') - hp('10%'),
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
