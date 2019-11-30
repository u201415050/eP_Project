import React, { Component } from 'react';
import {
  Text,
  View,
  Image,
  Dimensions,
  TouchableOpacity,
  Modal,
  StyleSheet,
  Linking
} from 'react-native';
import call from 'react-native-phone-call';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import alert_service from '../../../../services/alert_service';
import { connect } from 'react-redux';
import colors from '../../../modal_delivery/styles/colors';
import { isTablet } from '../../../fingerprint/constants/isLandscape';
import { TextMontserrat } from 'components';
import realm from '../../../../services/realm_service';

class CompanySection extends Component {
  render() {
    const plans = [
      'Free',
      'Shuruwat',
      'Suvidha',
      'Unnati',
      'Munafa',
      'Privileges',
      'Merchant SDK',
      'Sub Merchant SDK',
      'Master Wallet Free',
      'Development',
      'Master Wallet 99',
      'Complementary',
      'Payment',
      'POS',
      'POS Plus'
    ];
    const { merchant, config } = this.props;

    return (
      <View
        style={[
          styles.container,
          isTablet ? { flex: 1 } : { height: hp('11%') },
        ]}
      >
        <View
          style={[
            styles.section,
            {
              width: '60%',
              flexDirection: 'row',
              justifyContent: 'flex-start',
              paddingRight:hp('1%')
            },
          ]}
        >
          {config != null ? (
            <Image
              source={{
                uri:
                  config.merchantCompanyImage != null
                    ? config.merchantCompanyImage.indexOf('png') != -1
                      ? config.merchantCompanyImage.substr(
                          0,
                          config.merchantCompanyImage.indexOf('png') + 4
                        )
                      : config.merchantCompanyImage
                    : '',
              }}
              style={[
                {
                  borderRadius: hp('4%'),
                  width: hp('8%'),
                  height: hp('8%'),
                  marginHorizontal: hp('1.5%'),
                },
                config.merchantCompanyImage == null
                  ? { backgroundColor: 'gray' }
                  : null,
              ]}
            />
          ) : null}
          <View
            style={{
              flex: 1,
              height: '100%',
              justifyContent: 'space-around',
              paddingVertical: hp('1.9%'),
            }}
          >
            <TextMontserrat
              numberOfLines={2}
              style={{
                ...styles.bolTextCompany,
                fontSize:
                  merchant.merchantCompanyName.length > 10
                    ? isTablet
                      ? hp('2.3%')
                      : wp('3.5%')
                    : isTablet
                    ? hp('2.6%')
                    : wp('4%'),
              }}
            >
              {merchant.merchantCompanyName||"No merchant"}
            </TextMontserrat>
            <TextMontserrat
              style={{
                ...styles.bolTextCompany,
                fontWeight: '600',
                fontSize:
                  plans[merchant.planId - 1].length > 10
                    ? isTablet
                      ? hp('2.3%')
                      : wp('3.5%')
                    : isTablet
                    ? hp('2.6%')
                    : wp('4%'),
              }}
            >
             {`${plans[merchant.planId-1]} Plan`}
            </TextMontserrat>
          </View>
        </View>
        <TouchableOpacity
          onPress={()=>{
            let userData = realm.objectForPrimaryKey('User', 0);
            
            alert_service.showAlert(`Hey ${userData.userFirstName}, would you like to know\nmore about Point of sale by ePaisa?\nWe are just a call away!`,()=>{
              
              Linking.openURL(`tel:+919810001234`)
            },'CALL',null,true)
            
          }}
          style={[
            styles.section,
            {
              width: '40%',
              flexDirection: 'row',
              justifyContent: 'flex-start',
            },
          ]}
        >
          <View
            style={{
              flex: 1,
              alignItems: 'flex-end',
              paddingRight: isTablet ? hp('2%') : wp('4%'),
              justifyContent: 'center',
            }}
          >
            <Image
              source={require('../../assets/img/star.png')}
              style={{
                tintColor: '#616161',
                width: hp('3.4%'),
                height: hp('3.4%'),
              }}
            />
          </View>
          <View
            style={{
              height: '100%',
              justifyContent: 'space-around',
              paddingVertical: hp('2.5%'),
              paddingRight: wp('2%'),
            }}
          >
            <TextMontserrat style={styles.bolTextCompany}>
              Upgrade to
            </TextMontserrat>
            <TextMontserrat style={styles.bolTextCompany}>
              Point of Sale
            </TextMontserrat>
          </View>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomColor: '#979797',
    borderBottomWidth: isTablet ? 0 : 1,
  },
  section: {
    justifyContent: 'center',
    height: '100%',
    alignItems: 'center',
  },
  bolTextCompany: {
    fontSize: isTablet ? hp('2.3%') : wp('4%'),
    fontWeight: '800',
    color: '#455A64',
  },
});
const mapStateToProps = state => ({
  config:
    state.cashData.personalConfig != null
      ? state.cashData.personalConfig.merchant
      : null,
});

const dispatchActionsToProps = dispatch => ({});
export default connect(
  mapStateToProps,
  dispatchActionsToProps
)(CompanySection);
