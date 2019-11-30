import React, { Component } from 'react';
import { View, Text, Dimensions } from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { TextMontserrat } from 'components';
import ToggleIcon from './components/toggle_icon';
import realm from 'services/realm_service';

const isPortrait = () => {
  const dim = Dimensions.get('window');
  if (dim.height >= dim.width) {
    return true;
  } else {
    return false;
  }
};

class ToggleContainer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isPortrait: isPortrait(),
    };
  }

  render() {
    return (
      <View
        style={[
          {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: this.state.isPortrait ? hp('1.6%') : hp('2.5%'),
            marginBottom: this.state.isPortrait ? hp('1.5%') : hp('1.85%'),
            paddingHorizontal: wp('4.2%'),
          },
          this.state.isPortrait
            ? {}
            : {
                width: '100%',
                paddingLeft: wp('2.25%'),
                paddingRight: wp('1.25%'),
                justifyContent: 'space-between',
              },
        ]}
      >
        <View
          style={
            this.state.isPortrait
              ? {
                  flexDirection: 'row',
                  width: wp('31.95%'),
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }
              : {
                  flexDirection: 'row',
                  width: wp('12%'),
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginRight: wp('0%'),
                }
          }
        >
          <TextMontserrat
            style={
              this.state.isPortrait
                ? {
                    fontWeight: '700',
                    color: '#52565F',
                    fontSize: wp('3.65%'),
                  }
                : {
                    fontWeight: '700',
                    color: '#52565F',
                    fontSize: hp('2.35%'),
                  }
            }
          >
            Add GST
          </TextMontserrat>
          <ToggleIcon
            toggle={() => {
              if (!realm.isInTransaction) {
                realm.beginTransaction();
              }

              this.props.realmItem.toggleGst();
              this.props.update();

              // alert('Under development..');
            }}
            checked={this.props.realmItem.isGst()}
            style={{
              width: this.state.isPortrait ? wp('7.5%') : wp('3%'),
              height: hp('2.8%'),
              circleWidth: hp('2.45%'),
              circleHeight: hp('2.55%'),
            }}
          />
        </View>
        <View
          style={
            this.state.isPortrait
              ? {
                  flexDirection: 'row',
                  width: wp('31.95%'),
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }
              : {
                  flexDirection: 'row',
                  width: wp('12%'),
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }
          }
        >
          <TextMontserrat
            style={
              this.state.isPortrait
                ? {
                    fontWeight: '700',
                    color: '#52565F',
                    fontSize: wp('3.65%'),
                  }
                : {
                    fontWeight: '700',
                    color: '#52565F',
                    fontSize: hp('2.35%'),
                  }
            }
          >
            Add VAT
          </TextMontserrat>
          <ToggleIcon
            toggle={() => {
              if (!realm.isInTransaction) {
                realm.beginTransaction();
              }

              // this.forceUpdate();
              this.props.realmItem.toggleVat();
              this.props.update();
            }}
            checked={this.props.realmItem.isVat()}
            style={{
              width: this.state.isPortrait ? wp('7.5%') : wp('3%'),
              height: hp('2.8%'),
              circleWidth: hp('2.45%'),
              circleHeight: hp('2.5%'),
            }}
          />
        </View>
      </View>
    );
  }
}

export default ToggleContainer;
