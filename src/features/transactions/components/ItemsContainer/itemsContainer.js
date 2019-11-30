import React, { Component } from 'react';
import { View } from 'react-native';
import Item from './Item/item';
import colors from '../../styles/colors';
import { Categories, CategoriesLarge } from '../../constants/categories';
import EStyleSheet from 'react-native-extended-stylesheet';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { isTablet } from '../../constants/isLandscape';

export default class ItemsContainer extends Component {
  render() {
    const isLandscape = isTablet;
    return (
      <View
        style={[
          styles.container,
          isLandscape ? { paddingHorizontal: 15 } : null,
        ]}
      >
        {isLandscape
          ? CategoriesLarge.map((item, i) => {
              return <Item key={i} item={item} />;
            })
          : Categories.map((item, i) => {
              return <Item key={i} item={item} />;
            })}
      </View>
    );
  }
}

const styles = EStyleSheet.create({
  container: {
    width: '100%',
    height: hp('14%'),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  title: {
    color: colors.white,
    fontSize: 17,
    fontWeight: '700',
    letterSpacing: 2,
  },
});
