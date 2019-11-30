import React, { Component } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { isTablet } from '../../constants/isLandscape';
import colors from '../../styles/colors';
import Orientation from 'react-native-orientation-locker';
import Header from '../../components/header/header';
import { TextMontserrat, Loading } from 'components';
import ButtonGradient from '../../components/buttonGradientColor/ButtonGradient';
import { connect } from 'react-redux';
import { cashActions } from '../../../cash_register/actions';
import GestureRecognizer, {
  swipeDirections,
} from 'react-native-swipe-gestures';
import realm from '../../../../services/realm_service';
//import mixpanel from '../../../../services/mixpanel';
import CardReader from '../../../../services/realm_models/card_reader';
import loading_service from '../../../../services/loading_service';
import alert_service from '../../../../services/alert_service';
class SettingsCardReaders extends Component {
  static navigationOptions = ({ navigation }) => ({
    header: (
      <Header isBack={true} label="CARD READER" navigation={navigation} />
    ),
  });

  constructor(props) {
    super(props);
    //mixpanel.track('Card Reader Setting Screen');

    this.state = {
      // cardReaderSelected: realm.objectForPrimaryKey('CardReader', 0) || {},
      cardReaders: [], // this.getCardReaders(),
      listOrganized: [],
      loading: false,
      index: 0,
    };
  }
  onSwipeLeft(gestureState) {
    if (this.state.index + (isTablet ? 3 : 2) < this.state.cardReaders.length) {
      this.myScroll.scrollTo({
        x: wp(isTablet ? '19.25%' : '41%') * (this.state.index + 1),
        y: 0,
        animated: true,
      });
      this.setState({ index: this.state.index + 1 });
    }
  }

  onSwipeRight(gestureState) {
    if (this.state.index > 0) {
      this.myScroll.scrollTo({
        x: wp(isTablet ? '19.25%' : '41%') * (this.state.index - 1),
        y: 0,
        animated: true,
      });
      this.setState({ index: this.state.index - 1 });
    }
  }
  onSwipe(gestureName, gestureState) {
    const { SWIPE_UP, SWIPE_DOWN, SWIPE_LEFT, SWIPE_RIGHT } = swipeDirections;
    this.setState({ gestureName: gestureName });
    switch (gestureName) {
      case SWIPE_LEFT:
        this.setState({ backgroundColor: 'blue' });
        break;
      case SWIPE_RIGHT:
        this.setState({ backgroundColor: 'yellow' });
        break;
    }
  }

  componentWillMount() {
    !isTablet ? Orientation.lockToPortrait() : Orientation.lockToLandscape();
  }
  componentDidMount() {
    const user = realm.objectForPrimaryKey('User', 0);
    const { merchantId } = user;
    const cardReaders = CardReader.get().filtered(
      `merchantId = "${merchantId}"`
    );
    console.log({ cardReaders });
    this.setState({
      cardReaders,
      cardReaderSelected: realm.objectForPrimaryKey('CardReader', 0),
    });
  }
  render() {
    const val = [
      { label: 'Enable Offline Transactions' },
      { label: 'Enable Round-off' },
    ];
    var list = [];
    //console.log(this.props)
    const config = {
      velocityThreshold: 0.3,
      directionalOffsetThreshold: 300,
      gestureIsClickThreshold: 100,
    };
    const bgImage = !isTablet
      ? require('../../../../assets/images/bg/loadingBackground.png')
      : require('../../../../assets/images/bg/loadingBackgroundLandscape.png');
    return (
      <View style={styles.container}>
        <Image
          style={{
            position: 'absolute',
            width: '100%',
            height: hp('100%'),
            top: 0,
            left: 0,
            bottom: 0,
            right: 0,
          }}
          resizeMode={!isTablet ? 'stretch' : 'cover'}
          source={bgImage}
        />
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            width: '100%',
            borderBottomColor: 'rgba(0,0,0,0.1)',
            borderBottomWidth: 1,
            paddingBottom: hp('2%'),
          }}
        >
          <TextMontserrat
            style={{
              fontSize: hp('2.4%'),
              fontWeight: '900',
              color: '#174285',
              marginBottom: hp('0.2%'),
            }}
          >
            Assigned Card Readers
          </TextMontserrat>
          <View style={{ width: '100%' }}>
            {this.state.cardReaders.length > 0 ? (
              <ScrollView
                keyboardShouldPersistTaps="always"
                scrollEnabled={false}
                ref={ref => (this.myScroll = ref)}
                showsHorizontalScrollIndicator={false}
                horizontal={true}
                contentContainerStyle={{
                  paddingBottom: hp('1%'),
                  paddingTop: hp('4%'),
                }}
              >
                <View
                  style={{ width: wp(isTablet ? '2.25%' : '6%'), height: 20 }}
                />
                <GestureRecognizer
                  onSwipeLeft={state => this.onSwipeLeft(state)}
                  onSwipeRight={state => this.onSwipeRight(state)}
                  config={config}
                  style={{
                    flexDirection: 'row',
                    paddingVertical: hp('0.2%'),
                    paddingRight: hp('0.2%'),
                  }}
                >
                  {this.state.cardReaders.map((item, i) => {
                    return (
                      <TouchableOpacity
                        key={i}
                        activeOpacity={0.9}
                        onPress={() => {
                          //alert(1)
                          item.select();
                          if (!this.state.cardReaderSelected) {
                            this.setState({
                              cardReaderSelected: realm.objectForPrimaryKey(
                                'CardReader',
                                0
                              ),
                            });
                          }
                          this.forceUpdate();
                        }}
                        style={[
                          {
                            backgroundColor: 'white',
                            alignItems: 'center',
                            marginLeft: wp(isTablet ? '2.25' : '6%'),
                            elevation: 3,
                            borderRadius: 5,
                            width: isTablet ? wp('17%') : wp('35%'),
                            paddingVertical: hp('1.5%'),
                          },
                          (this.state.cardReaderSelected || {})
                            .deviceSerialNumber === item.deviceSerialNumber
                            ? { backgroundColor: '#BDC1CD' }
                            : null,
                        ]}
                      >
                        <TextMontserrat
                          style={{
                            fontSize: hp('1.6%'),
                            fontWeight: '900',
                            color: '#52565F',
                            opacity: 0.8,
                            textAlign:'center',
                            marginBottom: hp('1%'),
                          }}
                        >
                          {
                            item.deviceSerialNumber}
                        </TextMontserrat>
                        <Image
                          source={require('../../assets/img/card.png')}
                          style={{ height: hp('11.5%'), width: hp('11.5%') }}
                        />
                        <View
                          style={{
                            justifyContent: 'center',
                            alignItems: 'center',
                            width: '100%',
                          }}
                        >
                          <TextMontserrat
                            style={{
                              fontSize: hp('1.65%'),
                              fontWeight: '800',
                              opacity: 0.8,
                              color: '#52565F',
                              marginTop: hp('0.5%'),
                              textAlign: 'center',
                              width: '93%',
                            }}
                          >
                            {item.deviceManufacturerName +
                              ' - ' +
                              item.deviceTypeName /*.substr(0,20)+((item.deviceManufacturerName+' - '+item.deviceTypeName).length>7?'..':'')*/}
                          </TextMontserrat>
                        </View>
                      </TouchableOpacity>
                    );
                  })}
                </GestureRecognizer>
                <View
                  style={{ width: wp(isTablet ? '4.75%' : '12%'), height: 20 }}
                />
              </ScrollView>
            ) : (
              <View
                style={{
                  marginBottom: hp('1.5%'),
                  paddingBottom: hp('1%'),
                  paddingTop: hp('4%'),
                  width: '100%',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Image
                  source={require('../../assets/img/cardEmpty.png')}
                  style={{ width: (hp('12%') * 208) / 304, height: hp('12%') }}
                />
                <TextMontserrat
                  style={{
                    opacity: 0.85,
                    fontSize: hp('2.3%'),
                    color: '#888888',
                    fontWeight: '800',
                  }}
                >
                  No Card Readers Detected
                </TextMontserrat>
              </View>
            )}
            {this.state.index + (isTablet ? 3 : 2) <
            this.state.cardReaders.length ? (
              <TouchableOpacity
                onPress={() => {
                  this.myScroll.scrollTo({
                    x: wp(isTablet ? '19.25%' : '41%') * (this.state.index + 1),
                    y: 0,
                    animated: true,
                  });
                  this.setState({ index: this.state.index + 1 });
                }}
                activeOpacity={0.9}
                style={{
                  borderTopLeftRadius: 6,
                  borderBottomLeftRadius: 6,
                  position: 'absolute',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: wp(isTablet ? '2.5%' : '7%'),
                  height: '100%',
                  paddingBottom: hp('1%'),
                  paddingTop: hp('4%'),
                  right: 0,
                }}
              >
                <View
                  style={{
                    position: 'absolute',
                    paddingBottom: hp('1%'),
                    paddingTop: hp('4%'),
                    top: hp('4%'),
                    backgroundColor: '#B6B6B6',
                    height: '100%',
                    width: '100%',
                    borderTopLeftRadius: 6,
                    borderBottomLeftRadius: 6,
                  }}
                />
                <Image
                  resizeMode="stretch"
                  style={{
                    width: wp(isTablet ? '1.15%' : '2.3%'),
                    height: wp(isTablet ? '1.85%' : '3.7%'),
                  }}
                  source={require('../../assets/img/arrow.png')}
                />
              </TouchableOpacity>
            ) : null}
            {this.state.index > 0 ? (
              <TouchableOpacity
                onPress={() => {
                  this.myScroll.scrollTo({
                    x: wp(isTablet ? '19.25%' : '41%') * (this.state.index - 1),
                    y: 0,
                    animated: true,
                  });
                  this.setState({ index: this.state.index - 1 });
                }}
                activeOpacity={0.9}
                style={{
                  borderTopRightRadius: 6,
                  borderBottomRightRadius: 6,
                  position: 'absolute',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: wp(isTablet ? '2.5%' : '7%'),
                  height: '100%',
                  paddingBottom: hp('1%'),
                  paddingTop: hp('4%'),
                  left: 0,
                }}
              >
                <View
                  style={{
                    position: 'absolute',
                    top: hp('4%'),
                    paddingBottom: hp('1%'),
                    paddingTop: hp('4%'),
                    backgroundColor: '#B6B6B6',
                    height: '100%',
                    width: '100%',
                    borderTopRightRadius: 6,
                    borderBottomRightRadius: 6,
                  }}
                />
                <Image
                  resizeMode="stretch"
                  style={{
                    width: wp(isTablet ? '1.15%' : '2.3%'),
                    height: wp(isTablet ? '1.85%' : '3.7%'),
                  }}
                  source={require('../../assets/img/arrow_back.png')}
                />
              </TouchableOpacity>
            ) : null}
          </View>
        </View>
        <TextMontserrat
          style={{
            fontSize: hp('2.4%'),
            fontWeight: '900',
            color: '#174285',
            marginTop: hp('2%'),
            marginBottom: hp('0.2%'),
          }}
        >
          Add New Card Reader
        </TextMontserrat>
        <TextMontserrat
          style={{
            fontSize: hp('1.65%'),
            fontWeight: '700',
            color: '#52565F',
            opacity: 0.9,
            marginBottom: hp('2%'),
          }}
        >
          Detect new card readers
        </TextMontserrat>
        <View style={{ width: '80%' }}>
          <ButtonGradient
            fontB={hp('1.8%')}
            heightB={true}
            onPress={() => {
              // this.setState({
              //   cardReaders: this.getCardReaders(),
              // });
              const user = realm.objectForPrimaryKey('User', 0);
              const { merchantId, userId } = user;
              loading_service.showLoading();
              CardReader.fetch(merchantId)
                .then(() => {
                  loading_service.hideLoading();
                  // this.forceUpdate();
                })
                .catch(err => {
                  // this.forceUpdate();
                  loading_service.hideLoading();
                  alert_service.showAlert(err.message, () => null);
                });
            }}
            firstColor={'#114B8C'}
            secondColor={'#0079AA'}
            title={'DETECT CARD READER'}
          />
        </View>

        {this.state.loading ? <Loading /> : null}
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    height: '100%',
    width: '100%',
    paddingTop: hp('2.7%'),
    backgroundColor: colors.darkWhite,
  },
});
const mapStateToProps = state => ({
  state: state.cashData,
});
const mapDispatchToProps = dispatch => ({
  set_cashreaders: val => {
    return dispatch(cashActions.set_cashreaders(val));
  },
  select_cashreaders: val => {
    return dispatch(cashActions.select_cashreaders(val));
  },
});
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SettingsCardReaders);
