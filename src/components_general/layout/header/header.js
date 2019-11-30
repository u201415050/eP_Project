import React, { PureComponent } from 'react';
import { Text, View, Dimensions } from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import EStyleSheet from 'react-native-extended-stylesheet';
import PropTypes from 'prop-types';
const isPortrait = () => {
  const dim = Dimensions.get('window');
  if (dim.height >= dim.width) {
    return true;
  } else {
    return false;
  }
};
class Header extends PureComponent {
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

  toggleRightDrawer = () => {
    this.props.navigation.toggleRightDrawer();
  };
  toggleLeftDrawer = () => {
    this.props.navigation.toggleLeftDrawer();
  };

  render() {
    const {
      label,
      renderRightIcon,
      isTablet,
      textColor,
      renderLeftIcon,
    } = this.props;
    console.log('HEADER RENDERED LOGS');
    return (
      <View>
        <View
          style={{
            ...styles.container,
            backgroundColor: this.props.backgroundColor || '#174285',
          }}
        >
          {renderLeftIcon()}
          <Text
            style={[
              { ...styles.titleCentral, color: textColor },
              isTablet
                ? { 
                  fontSize: hp('2.4%'),
                  letterSpacing: hp('0.1%'), 
                }
                : {
                    textAlign: 'right',
                    paddingRight: wp('10%'),
                    flex: 1,
                    fontSize: wp('4%'),
                  },
            ]}
          >
            {label}
          </Text>

          {renderRightIcon()}
        </View>
      </View>
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
});

export default Header;
