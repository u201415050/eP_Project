import React, { Component } from 'react';
import { View } from 'react-native';
import Result from './Result/result';
import EStyleSheet from 'react-native-extended-stylesheet';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { isTablet } from '../../constants/isLandscape';
import * as _ from 'lodash';
export default class Transactions extends Component {
  render() {
    const isLandscape = isTablet;
    let { openTransaction, data, voidTransaction } = this.props;

    return (
      <View
        style={[
          styles.container,
          isLandscape
            ? { paddingHorizontal: isTablet ? wp('2%') : wp('2%'), flex: 1 }
            : null,
        ]}
      >
        <Result
          voidTransaction={voidTransaction}
          data={data || []}
          removeItem={this.props.removeItem}
          openDetails={this.props.openDetails}
          openTransaction={openTransaction}
        />
      </View>
    );
  }
}

const styles = EStyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center',
    //paddingHorizontal: isTablet?wp('10%'):wp('2%'),
    flex: 1,
  },
});
