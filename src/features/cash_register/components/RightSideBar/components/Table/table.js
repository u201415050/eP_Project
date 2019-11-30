import React, { Component } from 'react';
import { View, StyleSheet, KeyboardAvoidingView } from 'react-native';
import Headers from './components/headers';
import List from './components/list';
import AddItems from './components/addItems';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { isTablet } from '../../../../constants/isLandscape';

class Table extends Component {
  render() {
    const { products, actionClose, order, temporaly } = this.props;
    //alert(JSON.stringify(order.customItems))
    const customItems = temporaly
      ? order.customItems
      : Array.from(order.customItems.values());
    return (
      <View style={styles.container}>
        <Headers />
        {/* {order.customItems.length > 0 ? ( */}
        {customItems.length ? (
          <KeyboardAvoidingView
            style={{ flex: 1, width: '100%' }}
            behavior="height"
            keyboardVerticalOffset={isTablet ? hp('17%') : hp('20%')}
          >
            <List
              temporaly={temporaly}
              order={this.props.order}
              products={products}
              customItems={customItems}
            />
          </KeyboardAvoidingView>
        ) : temporaly ? null : (
          <AddItems temporaly={temporaly} actionClose={actionClose} />
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
  },
});

export default Table;
