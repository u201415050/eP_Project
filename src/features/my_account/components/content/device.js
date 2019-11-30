import React, { Component } from 'react';
import { View, Text, StyleSheet, Switch } from 'react-native';
import Option from './options/option';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import colors from '../../styles/colors';

class Device extends Component {
  state = {
    switch: false,
  };
  render() {
    const val = [
      { image: require('../../assets/img/sound.png'), label: 'Enable Sound' },
      { image: require('../../assets/img/camera.png'), label: 'Enable Camera' },
      {
        image: require('../../assets/img/fingerprint.png'),
        label: 'Enable Fingerprint',
      },
    ];
    return (
      <View style={styles.container}>
        {val.map((item, i) => {
          return <Option icon={item.image} key={i} label={item.label} />;
        })}
        <Switch
          thumbColor={this.state.switch ? '#174285' : 'white'}
          trackColor={{ false: '#D6DCE0', true: '#D6DCE0' }}
          value={this.state.switch}
          onValueChange={val => this.setState({ switch: val })}
        />
      </View>
    );
  }
}

// define your styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    width: '100%',
    paddingTop: hp('2.7%'),
    backgroundColor: colors.darkWhite,
  },
});

export default Device;
