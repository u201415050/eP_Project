import React, { Component } from 'react';
import {
  Text,
  View,
  Image,
  Dimensions,
  TouchableOpacity,
  Modal,
  Platform,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import EStyleSheet from 'react-native-extended-stylesheet';

import { connect } from 'react-redux';
import colors from '../../../modal_delivery/styles/colors';
import { isTablet } from '../../../fingerprint/constants/isLandscape';
import { TextMontserrat } from 'components';
const isPortrait = () => {
  const dim = Dimensions.get('window');
  if (dim.height >= dim.width) {
    return true;
  } else {
    return false;
  }
};
class Header extends Component {
  state = {
    showOptions: false,
    modalDiscount: false,
    modalDelivery: false,
  };

  toggleLeftDrawer = () => {
    this.props.navigation.toggleLeftDrawer();
  };
  render() {
    const { numberT, label, total } = this.props;

    return (
      <View style={styles.container}>
        <TextMontserrat
          style={{
            color: colors.white,
            fontSize: hp('2.4%'),
            letterSpacing: hp('0.1%'),
            fontWeight: '900',
          }}
        >
          {label}
        </TextMontserrat>

        <TouchableOpacity
          style={{
            position: 'absolute',
            height: '100%',
            left: !isTablet ? wp('3.5%') : wp('1%'),
            alignItems: 'center',
            justifyContent: 'center',
          }}
          onPress={this.toggleLeftDrawer}
        >
          <Image
            source={require('../../assets/img/sidelist.png')}
            style={{ width: hp('4%'), height: hp('3%') }}
          />
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = EStyleSheet.create({
  container: {
    width: '100%',
    justifyContent: 'center',
    height: hp('10%'),
    alignItems: 'center',
    backgroundColor:colors.darkBlue,
    elevation: 10,
    zIndex: 10,
  },
  iconLeft: {
    //position: 'absolute',
    height: '100%',
    //left: 20,
    color: colors.white,
    fontWeight: '700',
    justifyContent: 'center',
  },

  iconRight: {
    height: '100%',
    alignItems: 'center',
  },
  iconItem: {
    height: '100%',
    justifyContent: 'center',
    //marginHorizontal: hp('0.3%'),
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
  titleCentral: {
    color: colors.white,
    fontSize: hp('2.4%'),
    letterSpacing: hp('0.1%'),
    fontFamily: 'Montserrat-Bold',
  },
  '@media (min-width: 200) and (max-width: 400)': {
    // media queries
    badge: {},
  },
});
const mapStateToProps = state => ({});

const dispatchActionsToProps = dispatch => ({});
export default connect(
  mapStateToProps,
  dispatchActionsToProps
)(Header);
