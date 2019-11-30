import React, { Component } from 'react';
import { Text, View, Image, TouchableOpacity } from 'react-native';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';

import EStyleSheet from 'react-native-extended-stylesheet';
import { connect } from 'react-redux';
import alert_service from '../../../../services/alert_service';
import { clearPayment } from '../../actions/payment_actions';
import colors from '../../../settings/styles/colors';
import DeviceInfo from 'react-native-device-info';
import { SafeAreaView } from 'components';
class Header extends Component {
  state = {};

  render() {
    const { title, navigation, headerRight } = this.props;
    return (
      <SafeAreaView>
        <View style={styles.container}>
          <View style={styles.left}>
            <TouchableOpacity
              onPress={() => {
                if (this.props.canGoBack) {
                  //alert(1);
                  this.props.can(this.props.payment);
                } else {
                  if (
                    this.props.replaceBack &&
                    this.props.payment.transactions
                  ) {
                    this.props.replaceBack(
                      this.props.payment || null,
                      this.props.navigation,
                      true
                    );
                  } else {
                    this.props.navigation.goBack();
                  }
                }
              }}
            >
              <View style={styles.buttonBox}>
                <Image
                  style={{
                    width: hp('1.5%'),
                    height: hp('2.6%'),
                  }}
                  resizeMode="stretch"
                  source={require('../../assets/icons/arrow_left.png')}
                />
              </View>
            </TouchableOpacity>
          </View>
          <View style={styles.center}>
            <Text style={styles.title}>{title}</Text>
          </View>
          {headerRight ? (
            <View style={styles.right}>
              <TouchableOpacity onPress={this.toggleOptions}>
                <View style={styles.buttonBox}>
                  <Image source={require('../../assets/img/MoreDot.png')} />
                </View>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={{ paddingHorizontal: hp('2%') }}>
              <View style={{ width: hp('2.5%') }} />
            </View>
          )}
        </View>
      </SafeAreaView>
    );
  }
}

const styles = EStyleSheet.create({
  container: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: hp('10%'),
    alignItems: 'center',
    backgroundColor: '#174285',
    elevation: 0,
  },
  title: {
    color: '#FFFFFF',
    fontSize: '1.6rem',
    letterSpacing: '.25rem',
    textAlign: 'center',
    fontFamily: 'Montserrat-Bold',
  },
  buttonBox: {
    width: hp('6%'),
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  right: {
    opacity: 0,
  },
});
const mapStateToProps = state => ({
  payment: state.payment_data.payment,
});
const mapActionsToProps = dispatch => ({
  clearPayment: () => dispatch(clearPayment()),
});
export default connect(
  mapStateToProps,
  mapActionsToProps
)(Header);
