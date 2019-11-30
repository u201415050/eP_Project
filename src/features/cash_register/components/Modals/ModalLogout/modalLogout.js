import React, { Component } from 'react';
import {
  StyleSheet,
  ImageBackground,
  Dimensions,
  View,
  AsyncStorage,
  Modal,
  TouchableOpacity,
} from 'react-native';

import { connect } from 'react-redux';
import { cashActions } from '../../../actions/cash-actions';
import realm from 'services/realm_service';
import NavigationService from '../../../../../services/navigation/index';
import * as screen_names from '../../../../../navigation/screen_names';
import LinearGradient from 'react-native-linear-gradient';
import { TextMontserrat } from 'components';

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import colors from '../../../../saved_transactions/styles/colors';
import { isTablet } from '../../../../modal_customer/constants/isLandscape';
class ModalLogout extends Component {
  logout = async () => {
    let user = realm.objectForPrimaryKey('User', 0);
    user.signOut();
    NavigationService.navigate(screen_names.AUTH);
  };
  render() {
    const { active, closeModal } = this.props;

    return (
      <Modal
        visible={active}
        onRequestClose={closeModal}
        transparent={true}
        animationType="fade"
      >
        <View
          style={[
            styles.container,
            { justifyContent: 'center', alignItems: 'center', height: '100%' },
          ]}
        >
          <View
            style={{
              width: isTablet ? '25%' : '80%',
              height: hp('23%'),
              elevation: 5,
              backgroundColor: 'white',
              borderRadius: 6,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <TextMontserrat
              style={{
                textAlign: 'center',
                fontWeight: '600',
                fontSize: hp(isTablet ? '2.8' : '2.6%'),
              }}
            >
              Login has expired,
            </TextMontserrat>
            <TextMontserrat
              style={{
                textAlign: 'center',
                fontWeight: '600',
                fontSize: hp(isTablet ? '2.8' : '2.6%'),
              }}
            >
              please login again.
            </TextMontserrat>
            <TouchableOpacity
              onPress={this.logout}
              style={{
                borderRadius: 50,
                elevation: 9,
                backgroundColor: 'white',
                marginTop: hp('3%'),
                width: '70%',
                height: hp('6%'),
              }}
            >
              <LinearGradient
                colors={['#174285', '#0079AA']}
                start={{ x: 0, y: 1 }}
                end={{ x: 1, y: 1 }}
                style={{
                  borderRadius: 50,
                  alignItems: 'center',
                  width: '100%',
                }}
              >
                <View
                  style={{
                    width: '100%',
                    height: '100%',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <TextMontserrat style={styles.textDiscountAddButtonPortrait}>
                    OK
                  </TextMontserrat>
                </View>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  }
}

const mapDispatchToProps = dispatch => ({
  clear_data: () => {
    return dispatch(cashActions.clear_data());
  },
  clear_customer: () => {
    return dispatch(cashActions.clear_customer());
  },
});
const mapStateToProps = state => ({
  state: state.cashData,
});
const styles = StyleSheet.create({
  container: {
    width: '100%',
    backgroundColor: colors.opacityDin(0.6),
  },
  wrapper: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: hp(isTablet ? '4.0%' : '2.0%'),
    marginBottom: hp(isTablet ? '5.0%' : '4.0%'),
  },
  textDiscountAddButtonPortrait: {
    color: 'white',
    fontSize: hp('1.95%'),
    letterSpacing: 1.33,
    textAlign: 'center',
    fontWeight: '600',
  },
});
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ModalLogout);
