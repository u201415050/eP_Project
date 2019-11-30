import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { isTablet } from '../../../../../constants/isLandscape';
const OptionsContainer = ({
  openDiscount,
  openDelivery,
  customer,
  disableClear,
  disable,
  order,
  temporaly
}) => {
  const options = !isTablet
    ? [
        {
          source: require('../../../assets/Delivery.png'),
          onpress: openDelivery,
          bigger: false,
          disable: disable,
        },
        {
          source: require('../../../assets/Discount.png'),
          onpress: openDiscount,
          bigger: false,
          disable: disable,
        },
        {
          source: require('../../../assets/Clear.png'),
          onpress: () => {
            return order.removeCustomItems();
          },
          bigger: true,
          disable: disableClear,
        },
      ]
    : [
        {
          source: require('../../../assets/Delivery.png'),
          onpress: openDelivery,
          bigger: false,
          disable:  temporaly|| disable,
        },
        {
          source: require('../../../assets/Discount.png'),
          onpress: openDiscount,
          bigger: false,
          disable: temporaly||disable,
        },
        {
          source: require('../../../assets/Clear.png'),
          onpress: () => {
            return order.removeCustomItems();
          },
          bigger: true,
          disable: temporaly||disableClear,
        },
      ];
  return (
    <View style={styles.container}>
      <View style={styles.textContainer}>
        <Text style={styles.titlePoints}>
          {customer != null ? customer.rewardPoints || 0 : 0} Points
        </Text>
      </View>

      <View style={[styles.drawerRightTitleContainer]}>
        {options.map((item, i) => {
          return (
            <TouchableOpacity
              disabled={item.disable}
              key={i}
              onPress={item.onpress}
              style={item.disable ? { opacity: 0.6 } : null}
            >
              <Image
                source={item.source}
                style={[
                  styles.drawerRightIcon,
                  item.extraStyle,
                  // item.bigger
                  false
                    ? { width: hp('5.9%'), height: hp('5.9%') }
                    : null,
                ]}
              />
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

// define your styles
const styles = StyleSheet.create({
  container: {
    height: hp('13.6%'),
    width: '50%',
    backgroundColor: '#5D6770',
    flexDirection: 'column',
    alignItems: 'flex-end',
  },
  textContainer: {
    width: '100%',
    height: hp('5.8%'),
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
    paddingRight: hp('2.3%'),
  },
  drawerRightIcon: {
    width: hp('5.5%'),
    height: hp('5.5%'),
    resizeMode: 'contain',
    alignItems: 'flex-start',
  },
  drawerRightTitleContainer: {
    height: hp('7.8%'),
    flexDirection: 'row',
    width: isTablet?'80%':'100%',
    marginRight: hp('1.6%'),
    paddingLeft: hp('2%'),
    paddingTop: hp('0.8%'),
    justifyContent: 'space-between',
  },
  titlePoints: {
    fontSize: hp('2.7%'),
    fontFamily: 'Montserrat-Bold',
    color: 'white',
  },
});

export default OptionsContainer;
