import React, { Component } from 'react';
import { View, Text, ScrollView } from 'react-native';
import TransactionItem from './components/item';

class TransactionList extends Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  renderItems = items => {
    return items.map(item => {
      if(item.total!='0.00'){
      return <TransactionItem payment={item} />;
      }else{
        return null
      }
    });
  };

  render() {
    const items = this.props.items;
    const rendering = this.renderItems(items);
    // alert(JSON.stringify(items))

    return (
      <ScrollView
        contentContainerStyle={{ width: '100%', alignItems: 'center' }}
        scrollEnabled={true}
        keyboardShouldPersistTaps={'handled'}
      >
        {rendering}
      </ScrollView>
    );
  }
}

export default TransactionList;
