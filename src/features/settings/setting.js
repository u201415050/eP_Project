import React, { Component } from 'react';
import { Keyboard, View, StyleSheet, AsyncStorage, Text } from 'react-native';
import colors from './styles/colors';
import Orientation from 'react-native-orientation-locker';
import { connect } from 'react-redux';

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import Header from './components/header/header';
import Content from './components/content/content';
import { isTablet } from '../cash_register/constants/isLandscape';
const isPhone = !isTablet;
class SettingScreen extends Component {
  static navigationOptions = {
    header: null,
  };
  state = {};
  componentWillMount() {
    isPhone ? Orientation.lockToPortrait() : Orientation.lockToLandscape();
  }
  componentDidMount() {
    this.keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      this._keyboardDidShow
    );
    this.keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      this._keyboardDidHide
    );
  }

  componentWillUnmount() {
    this.keyboardDidShowListener.remove();
    this.keyboardDidHideListener.remove();
  }
  render() {
    return (
      <View style={styles.container}>
        <Header navigation={this.props.navigation} label="SETTINGS" />
        <Content />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    height: hp('100%'),
  },
});

const mapStateToProps = state => ({});

const mapDispatchToProps = dispatch => ({});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SettingScreen);
