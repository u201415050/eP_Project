import React, { Component } from 'react';
import {
  View,
  Image,
  StyleSheet,
  TouchableOpacity,
  Animated,
} from 'react-native';
import { TextMontserrat } from 'components';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { isTablet } from '../../../../../my_account/constants/isLandscape';
export default class NotificationItem extends Component {
  state = {
    expanded: false,
    numberOfLines: 2,
  };
  _setMaxHeight(event) {
    this.setState({
      maxHeight: event.nativeEvent.layout.height,
    });
  }

  _setMinHeight(event) {
    // this.setState({
    //   minHeight: event.nativeEvent.layout.height,
    // });
  }
  toggle() {
    //Step 1
    this.setState({
      expanded: !this.state.expanded,
    });
  }
  render() {
    const readedStyle = this.props.data.readed ? { color: '#9B9B9B' } : {};
    return (
      <TouchableOpacity
        style={styles.notificationItem}
        activeOpacity={1}
        onPress={() => {
          this.props.onPress();
          this.toggle();
        }}
      >
        {!this.props.data.readed && <View style={styles.greenCircle} />}

        <Image
          onLayout={this._setMinHeight.bind(this)}
          resizeMode={'contain'}
          style={{ width: hp('9%'), height: hp('9%') }}
          source={require('./../assets/images/epaisa_icon.png')}
        />

        <View style={[styles.textContainer]}>
          <View style={styles.titleContainer}>
            <TextMontserrat style={{ ...styles.titleText, ...readedStyle }}>
              {this.props.data.title}
            </TextMontserrat>
          </View>
          <View style={styles.messageContainer}>
            <TextMontserrat
              style={styles.messageText}
              numberOfLines={this.state.expanded ? 100 : 2}
            >
              {this.props.data.message}
            </TextMontserrat>
          </View>
          <View style={styles.dateContainer}>
            <TextMontserrat style={styles.dateText}>
              {this.props.data.date}
            </TextMontserrat>
          </View>
        </View>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  notificationItem: {
    flexDirection: 'row',
    backgroundColor: 'white',
    paddingHorizontal: wp(isTablet ? '2%' : '3.7%'),
    paddingVertical: hp(isTablet ? '2%' : '3.7%'),
    marginBottom: hp('2%'),
    borderRadius: 4,
    elevation: 5,
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  iconContainer: {
    // width: wp('20%'),
    height: wp('20%'),
    flex: 1.2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textContainer: {
    flex: 4,
    paddingLeft: wp(isTablet ? '2%' : '4%'),
    height: '100%',
    overflow: 'hidden',
  },
  titleContainer: {},
  titleText: {
    color: '#174285',
    fontWeight: '700',
    fontSize: hp(!isTablet ? '2.2%' : '2.4%'),
    marginBottom: hp('0.5%'),
  },
  messageContainer: {
    marginBottom: hp('1.5%'),
  },
  messageText: {
    color: '#52565F',
    fontSize: hp(!isTablet ? '1.9%' : '2.2%'),
    backgroundColor: '#FFF',
    overflow: 'hidden',
  },
  dateText: {
    color: '#9B9B9B',
    fontSize: hp(!isTablet ? '1.9%' : '2.2%'),
    backgroundColor: 'white',
  },
  greenCircle: {
    position: 'absolute',
    right: -hp('0.3%'),
    top: -hp('0.3%'),
    width: hp('1.2%'),
    height: hp('1.2%'),
    backgroundColor: '#2ebd41',
    borderRadius: 10,
  },
});
