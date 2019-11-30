import React, { Component } from 'react';
import { View, ImageBackground, Image } from 'react-native';
import { TextMontserrat } from 'components';
import EStyleSheet from 'react-native-extended-stylesheet';
class CircleButton extends Component {
  ButtonBG = require('../../../../assets/icons/payment_bg.png');
  Buttons = {
    card: {
      icon: require('../../../../assets/icons/Cardd.png'),
      title: 'Card',
    },
    cash: {
      icon: require('../../../../assets/icons/Cashh.png'),
      title: 'Cash',
    },
    wallet: {
      icon: require('../../../../assets/icons/Wallets.png'),
      title: 'Wallet',
    },
    upi: {
      icon: require('../../../../assets/icons/Upi_icon.png'),
      title: 'UPI',
    },
    check: {
      icon: require('../../../../assets/icons/Cheque.png'),
      title: 'Check',
    },
  };
  render() {
    return (
      <View style={[styles.circleContainer, this.props.style]}>
        <ImageBackground
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            width: 65,
            height: 65,
          }}
          source={this.ButtonBG}
        >
          <Image source={this.Buttons[this.props.button].icon} />
        </ImageBackground>
        <TextMontserrat style={styles.circleText}>
          {this.Buttons[this.props.button].title}
        </TextMontserrat>
      </View>
    );
  }
}

const TEXT_COLOR = '#47525D';
const styles = EStyleSheet.create({
  circleContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  circleText: {
    fontSize: '1.1rem',
    color: TEXT_COLOR,
    fontWeight: '600',
  },
});
export default CircleButton;
