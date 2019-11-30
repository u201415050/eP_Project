import React, { Component } from 'react';
import { View, Text } from 'react-native';
import RadioButton from './components/radio_button';

class RadioButtonGroup extends Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  render() {
    return (
      <View
        style={{
          width: '100%',
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}
      >
        <RadioButton
          onPress={() => {
            // this.props.item.setGstType('intrastate');
            this.props.realmItem.setIntrastate();
            this.props.update();
          }}
          selected={!this.props.realmItem.isInterstate()}
          label={'Intrastate'}
        />
        <RadioButton
          onPress={() => {
            // this.props.item.setGstType('interstate');
            // this.props.item.addGstTax('interstate', 5);
            this.props.realmItem.setInterstate();
            this.props.update();
          }}
          selected={this.props.realmItem.isInterstate()}
          label={'Interstate'}
        />
      </View>
    );
  }
}

export default RadioButtonGroup;
