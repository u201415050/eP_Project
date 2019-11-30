import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';

import ModalMessage from './components/Modal/modalMessage';
import { openOverlay } from 'react-native-blur-overlay';
class AccountCreated extends Component {
  static navigationOptions = {
    header: null,
  };
  state = {
    modalActive: true,
  };
  toggleModalMessage = () => {
    this.setState({
      modalActive: !this.state.modalActive,
    });
  };
  render() {
    return (
      // <BlurOverlay
      //   radius={60}
      //   downsampling={4}
      //   brightness={-50}
      //   onPress={() => {
      //     closeOverlay();
      //   }}
      //   customStyles={{ alignItems: 'center', justifyContent: 'center' }}
      //   blurStyle="dark"
      // >
      <ModalMessage
        onButtonClick={this.props.onButtonClick}
        active={this.state.modalActive}
        toggleModal={this.toggleModalMessage}
      />
      // </BlurOverlay>
    );
  }
}

export default AccountCreated;
