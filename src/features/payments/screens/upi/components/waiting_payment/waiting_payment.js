import React, { Component } from 'react';
import { View, Image } from 'react-native';
import { TextMontserrat } from 'components';
export default class WaitingPayment extends Component {
  render() {
    return (
      <View
        style={{
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <View
          style={{
            marginTop: 25,
            marginBottom: 15,
          }}
        >
          <TextMontserrat
            style={{
              fontWeight: '700',
              fontSize: 18,
              color: '#174285',
              textAlign: 'center',
              letterSpacing: 1.33,
            }}
          >
            WAITING FOR CONFIRMATION
          </TextMontserrat>
        </View>
        <Image
          style={{
            height: this.props.size || 200,
            width: this.props.size || 200,
          }}
          source={require('../assets/upi_waiting.png')}
        />
      </View>
    );
  }
}
