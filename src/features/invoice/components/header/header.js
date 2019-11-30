import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  Image,
  Dimensions,
  TouchableOpacity,
  Modal,
} from 'react-native';
import NavigationService from 'services/navigation';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import colors from '../../styles/colors';
import EStyleSheet from 'react-native-extended-stylesheet';
import { isTablet } from '../../constants/isLandscape';
import { connect } from 'react-redux';
import Icon from 'react-native-vector-icons/FontAwesome';
import { SafeAreaView } from 'components';
class Header extends Component {
  state = {};
  toggleLeftDrawer = () => {
    this.props.navigation.goBack();
  };

  render() {
    const isLandscape = isTablet;
    const { label } = this.props;
    return (
      <SafeAreaView color="#43C141">
        <View style={styles.container}>
          <View style={styles.buttonBox} />
          <View>
            <Text style={[styles.titleCentral]}>{label}</Text>
          </View>
          <TouchableOpacity
            style={styles.buttonBox}
            onPress={() => {
              NavigationService.navigate('CashRegister');
            }}
          >
            <Image source={require('../../assets/img/close.png')} />
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }
}

const styles = EStyleSheet.create({
  container: {
    width: '100%',
    justifyContent: 'space-between',
    height: hp('10%'),
    alignItems: 'center',
    backgroundColor: '#43C141',
    // paddingHorizontal: 22,
    elevation: 1,
    flexDirection: 'row',
  },
  buttonBox: {
    height: hp('10%'),
    width: hp('10%'),
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconLeft: {
    position: 'absolute',
    height: '100%',
    left: 20,
    color: colors.white,
    fontSize: 17,
    fontWeight: '700',
    justifyContent: 'center',
  },
  badge: {
    position: 'absolute',
    left: hp('3%'),
    bottom: hp('3%'),
    backgroundColor: colors.gray,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
    paddingHorizontal: hp('0.5'),
  },
  badgeText: {
    color: colors.white,
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
    color: colors.white,
    fontSize: 13,
    fontFamily: 'Montserrat-Bold',
  },
  iconRight: {
    flexDirection: 'row',
    position: 'absolute',
    height: '100%',
    right: 0,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  iconItem: {
    height: '100%',
    justifyContent: 'center',
    marginHorizontal: hp('0.3%'),
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
    textAlign: 'center',
    fontFamily: 'Montserrat-Bold',
  },
});
const mapStateToProps = state => ({});

const dispatchActionsToProps = dispatch => ({});
export default connect(
  mapStateToProps,
  dispatchActionsToProps
)(Header);
