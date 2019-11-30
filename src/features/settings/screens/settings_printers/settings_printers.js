import React, { Component } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Platform,
} from 'react-native';
import SettingButton from '../../components/setting_button/setting_button';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { isTablet } from '../../constants/isLandscape';
import Option from '../../components/content/options/option';
import colors from '../../styles/colors';
import Orientation from 'react-native-orientation-locker';
import Header from '../../components/header/header';
import { TextMontserrat } from 'components';
import CheckmarkBig from '../../../create_account/components/checkmark_big';
import Checkmark from '../../../create_account/components/checkmark';
import ButtonGradient from '../../components/buttonGradientColor/ButtonGradient';
import {
  InitBluetooth,
  ConnectDevice,
  DisconnectDevice,
} from '../../../../services/bluetooth_service';
import { connect } from 'react-redux';
import GestureRecognizer, {
  swipeDirections,
} from 'react-native-swipe-gestures';
import loading_service from '../../../../services/loading_service';
import { cashActions } from '../../../cash_register/actions';
import alert_service from '../../../../services/alert_service';
import { InitBluetoothIOS } from '../../../../services/bluetooth_ios_service';
//import mixpanel from '../../../../services/mixpanel';

class SettingsPrinters extends Component {
  static navigationOptions = ({ navigation }) => ({
    header: <Header isBack={true} label="PRINTER" navigation={navigation} />,
  });
  constructor(props) {
    super(props);
    //mixpanel.track('Printer Setting Screen');

    this.state = {
      printer: props.state.printer ? props.state.printer.selected : 0,
      listPrinters: [], //this.props.state.cashreader.list||[]
      listPaired: props.state.printer ? props.state.printer.list : [],
      listOrganized: [],
      loading: false,
      index: 0,
    };
  }
  onSwipeLeft(gestureState) {
    if (this.state.index + (isTablet ? 3 : 2) < this.state.listPaired.length) {
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
  selectDevice = val => {
    loading_service.showLoading();
    const { select_printers } = this.props;
    if (this.state.printer == 1 && val == 0) {
      select_printers(0);
      this.setState({ printer: 0, index: 0 });
      DisconnectDevice(this.state.listPaired[0]);
      //alert_service.showAlert('Device disconnected')
    } else {
      let element = this.state.listPaired;
      var a = element.splice(val, 1);

      element.unshift(a[0]);
      this.setState({ listPaired: element, printer: 1, index: 0 });
      //this.getElement();

      select_printers(1);
      this.myScroll.scrollTo({ x: 0, y: 0, animated: 'true' });
      //alert('Connected')

      ConnectDevice(
        this.state.listPaired[0],
        () => {},
        () => {
          select_printers(0);
          this.setState({ printer: 0, index: 0 });
        }
      );
    }
    loading_service.hideLoading();
  };
  getPrinters = () => {
    loading_service.showLoading();
    //if(Platform.OS=="ios"){
    InitBluetoothIOS(devices => {
      this.setState({
        listPrinters: devices,
      });

      loading_service.hideLoading();
      //alert(JSON.stringify(devices))
    });
  };
  componentWillMount() {
    !isTablet ? Orientation.lockToPortrait() : Orientation.lockToLandscape();
  }
  render() {
    //console.log(this.props)
    const config = {
      velocityThreshold: 0.3,
      directionalOffsetThreshold: 300,
      gestureIsClickThreshold: 1,
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
            Paired Printers
          </TextMontserrat>
          <TextMontserrat
            style={{
              fontSize: hp('1.65%'),
              fontWeight: '700',
              color: '#52565F',
              opacity: 0.9,
            }}
          >
            Enable paired printers to be used with ePaisa
          </TextMontserrat>
          <View style={{ width: '100%' }}>
            {this.state.listPaired.length > 0 ? (
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
                  {this.state.listPaired.map((item, i) => {
                    return (
                      <TouchableOpacity
                        disabled={true}
                        key={i}
                        activeOpacity={0.7}
                        onPress={() => {
                          this.selectDevice(i);
                        }}
                        style={[
                          null,
                          {
                            backgroundColor: 'white',
                            alignItems: 'center',
                            marginLeft: wp(isTablet ? '2.25' : '6%'),
                            elevation: 3,
                            borderRadius: 5,
                            width: isTablet ? wp('17%') : wp('35%'),
                            paddingVertical: hp('1.5%'),
                          },
                          this.state.printer == i + 1
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
                            marginBottom: hp('1%'),
                          }}
                        >
                          {'Cashier ' + (i + 1)}
                        </TextMontserrat>
                        <Image
                          source={require('../../assets/img/printer.png')}
                          style={{ height: hp('11.5%'), width: hp('11.5%') }}
                        />
                        <TextMontserrat
                          style={{
                            fontSize: hp('1.65%'),
                            fontWeight: '800',
                            width: '80%',
                            opacity: 0.8,
                            color: '#52565F',
                            marginTop: hp('0.5%'),
                            textAlign: 'center',
                          }}
                        >
                          {'Model: ' + (item.name ? item.name : item.id)}
                        </TextMontserrat>
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
                  source={require('../../assets/img/printerEmpty.png')}
                  style={{ width: (hp('12%') * 248) / 264, height: hp('12%') }}
                />
                <TextMontserrat
                  style={{
                    opacity: 0.85,
                    fontSize: hp('2.3%'),
                    color: '#888888',
                    fontWeight: '800',
                  }}
                >
                  No Printers Detected
                </TextMontserrat>
              </View>
            )}
            {this.state.index + (isTablet ? 3 : 2) <
            this.state.listPaired.length ? (
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
          Add New Printer
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
          Detect and pair new printers
        </TextMontserrat>
        <View style={{ width: '80%' }}>
          <ButtonGradient
            fontB={hp('1.8%')}
            heightB={true}
            onPress={this.getPrinters}
            firstColor={'#114B8C'}
            secondColor={'#0079AA'}
            title={'DETECT PRINTER'}
          />
        </View>
        <ScrollView style={{ width: '100%', flex: 1, marginTop: hp('2%') }}>
          {this.state.listPrinters.map((item, i) => {
            let isAdded =false;
              this.state.listPaired.map(e => {
               if(e.id === item.id){
                  isAdded=true
               }
              });
            return (
              <View
                style={{
                  width: '100%',
                  paddingHorizontal: wp('5%'),
                  paddingVertical: hp('2%'),
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <TextMontserrat
                  style={{
                    fontSize: hp('2.7%'),
                    fontWeight: '600',
                    color: '#52565F',
                    opacity: 0.8,
                  }}
                >
                  {item.name ? item.name : item.id}
                </TextMontserrat>
                <TouchableOpacity
                  onPress={() => {
                    let par;
                    if (isAdded) {
                      par = this.state.listPaired.filter(e => {
                        return e.id !== item.id;
                      });
                    } else {
                      par = this.state.listPaired;
                      //alert(JSON.stringify(item))
                      par.push(item);
                    }
                    const { set_printers } = this.props;
                    set_printers(par);
                    this.setState({ listPaired: par });
                  }}
                >
                  <TextMontserrat
                    style={{
                      fontSize: hp('2.4%'),
                      fontWeight: '700',
                      color: '#114B8C',
                    }}
                  >
                    {isAdded ? 'REMOVE' : 'ADD'}
                  </TextMontserrat>
                </TouchableOpacity>
              </View>
            ); 
          })}
        </ScrollView>
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
  set_printers: val => {
    return dispatch(cashActions.set_printers(val));
  },
  select_printers: val => {
    return dispatch(cashActions.select_printers(val));
  },
});
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SettingsPrinters);
