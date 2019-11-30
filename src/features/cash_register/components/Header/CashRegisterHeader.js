import React, { PureComponent } from 'react';
import { Text, View, Image, Dimensions, TouchableOpacity } from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import EStyleSheet from 'react-native-extended-stylesheet';
import PropTypes from 'prop-types';
import RealmSavedTransaction from '../../../../services/realm_models/realm_saved_transaction';
import Header from '../../../../components_general/layout/header/header';
const isPortrait = () => {
  const dim = Dimensions.get('window');
  if (dim.height >= dim.width) {
    return true;
  } else {
    return false;
  }
};
class CashRegisterHeader extends PureComponent {
  static propTypes = {
    navigation: PropTypes.any.isRequired,
    label: PropTypes.string.isRequired,
    savedTransactions: PropTypes.number.isRequired,
    cartItems: PropTypes.number.isRequired,
    isTablet: PropTypes.bool.isRequired,
    backgroundColor: PropTypes.string.isRequired,
    textColor: PropTypes.string.isRequired,
    renderLeftIcon: PropTypes.func.isRequired,
    renderRightIcon: PropTypes.func.isRequired,
  };

  render() {
    const {
      label,
      navigation,
      cartItems,
      savedTransactions,
      isTablet,
    } = this.props;

    return (
      <Header
        label={label}
        navigation={navigation}
        cartItems={cartItems}
        savedTransactions={savedTransactions}
        isTablet={isTablet}
        backgroundColor={'#174285'}
        textColor={'white'}
        renderLeftIcon={() => (
          <TouchableOpacity
            style={{
              height: '100%',
              width: isPortrait() ? wp('13%') : wp('7.5%'),
              justifyContent: 'center',
              alignItems: 'center',
            }}
            onPress={() => navigation.toggleLeftDrawer()}
          >
            <Image
              source={require('../../assets/img/sidelist.png')}
              style={{ width: hp('4%'), height: hp('4%') }}
              resizeMode={'contain'}
            />
          </TouchableOpacity>
        )}
        renderRightIcon={() => {
          return !isTablet ? (
            <View style={styles.iconRight}>
              <TouchableOpacity
                onPress={() => navigation.navigate('SavedTransactions')}
                style={[
                  styles.iconItem,
                  {
                    width: hp('4.3%'),
                    height: hp('4.3%'),
                    marginRight: wp('4.5%'),
                  },
                ]}
              >
                <Image
                  source={require('../../assets/icons/fill_xxhdi.png')}
                  style={{ width: hp('4.3%'), height: hp('4.3%') }}
                />
                <View
                  style={[
                    styles.stack,
                    {
                      width: hp('3.7%'),
                      height: hp('3.7%'),
                      left: 0,
                      top: 0,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.stackText,
                      { fontSize: hp('2.0%'), color: 'white' },
                    ]}
                  >
                    {savedTransactions}
                  </Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.iconItem,
                  {
                    width: hp('3.5%'),
                    height: hp('3.5%'),
                    marginRight: wp('2.5%'),
                  },
                ]}
                onPress={() => navigation.toggleRightDrawer()}
              >
                <Image
                  source={require('../../assets/icons/cart_xxhdi.png')}
                  style={[{ width: hp('3.5%'), height: hp('3.5%') }]}
                />
                <View style={styles.badge}>
                  <Text
                    style={{
                      ...styles.badgeText,
                      color: 'white',
                    }}
                  >
                    {cartItems}
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.iconRight}>
              <TouchableOpacity
                onPress={() => navigation.navigate('SavedTransactions')}
                style={[
                  styles.iconItem,
                  {
                    width: hp('9%'),
                    height: hp('4.5%'),
                  },
                ]}
              >
                <Image
                  source={require('../../assets/icons/fill_xxhdi.png')}
                  style={{ width: hp('4.5%'), height: hp('4.5%') }}
                />
                <View
                  style={[
                    styles.stack,
                    {
                      width: hp('3.4%'),
                      height: hp('3.4%'),
                      display: 'flex',
                      justifyContent: 'center',
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.stackText,
                      { fontSize: hp('2.3%'), color: 'white' },
                    ]}
                  >
                    {savedTransactions}
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          );
        }}
      />
    );
  }
}

const styles = EStyleSheet.create({
  container: {
    width: '100%',
    justifyContent: 'space-between',
    height: hp('10%'),
    alignItems: 'center',
    // paddingLeft: isPortrait() ? wp('3.5%') : wp('1%'),
    paddingRight: isPortrait() ? wp('2.5%') : wp('1%'),
    elevation: 10,
    zIndex: 10,
    flexDirection: 'row',
  },
  titleCentral: {
    fontSize: hp('2.4%'),
    letterSpacing: hp('0.1%'),
    fontFamily: 'Montserrat-Bold',
  },
  badge: {
    position: 'absolute',
    left: hp('3.5%') - hp('0.5') - hp('0.1'),
    bottom: hp('2.9%'),
    backgroundColor: '#666666',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
    paddingHorizontal: hp('0.5'),
  },
  badgeText: {
    fontSize: hp('1.3%'),
    fontFamily: 'Montserrat-Bold',
  },
  stack: {
    position: 'absolute',
    left: '27%',
    top: '5%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stackText: {
    fontSize: 13,
    fontFamily: 'Montserrat-Bold',
  },
  iconRight: {
    flexDirection: 'row',
    height: '100%',
    alignItems: 'center',
  },
  iconItem: {
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  marginExtra: {
    marginLeft: 12,
  },
  iconContainer: {
    flexDirection: 'row',
    height: '100%',
    justifyContent: 'space-between',
  },
});

export default CashRegisterHeader;
