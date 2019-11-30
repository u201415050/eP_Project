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
  TextInput,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import colors from '../../styles/colors';
import EStyleSheet from 'react-native-extended-stylesheet';
import { isTablet } from '../../constants/isLandscape';
import { connect } from 'react-redux';
import Search from '../search/search';
import { SafeAreaView } from 'components';

class Header extends Component {
  state = {
    search: false,
    textSearch: '',
    fontSearch: '2.1%',
  };
  constructor(props) {
    super(props);
  }
  toggleLeftDrawer = () => {
    console.log('OPEN DRAWER');
    console.log(this.props.navigation);
    this.props.navigation.toggleLeftDrawer();
  };
  goBack = () => {
    console.log('GO BACK');
    console.log(this.props.navigation);
    this.props.navigation.goBack();
  };
  render() {
    const isLandscape = isTablet;
    const { label } = this.props;
    return (
      <SafeAreaView>
        <View style={styles.container}>
          {!this.props.isBack ? (
            <TouchableOpacity
              style={{
                height: '100%',
                justifyContent: 'center',
                paddingHorizontal: hp('2%'),
              }}
              onPress={this.toggleLeftDrawer}
            >
              <Image
                source={require('../../assets/img/sidelist.png')}
                style={{ width: hp('4%'), height: hp('3%') }}
              />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={{
                paddingLeft: hp('2.5%'),
                paddingRight: hp('4%'),
                height: '100%',
                justifyContent: 'center',
              }}
              onPress={this.goBack}
            >
              <Image
                source={require('../../assets/img/arrow_back.png')}
                style={{
                  tintColor: 'white',
                  width: hp('1.5%'),
                  height: hp('2.6%'),
                }}
                resizeMode="stretch"
              />
            </TouchableOpacity>
          )}
          <Text style={[styles.titleCentral]}>{label}</Text>
          {label == 'SETTINGS' ? (
            <TouchableOpacity
              onPress={() => {
                if (label == 'SETTINGS') {
                  //console.log(this.inputField.refs)
                  //this._mySearch.focus()
                  this.setState({ search: true }, () => {
                    this.inputField.focus();
                  });
                }
              }}
            >
              <View
                style={[
                  styles.iconItem,
                  {
                    paddingHorizontal: hp('2%'),
                  },
                ]}
              >
                <Image
                  source={require('../../assets/img/Shape.png')}
                  style={{
                    width: hp('2.5%'),
                    tintColor: colors.white,
                    height: hp('2.5%'),
                  }}
                />
              </View>
            </TouchableOpacity>
          ) : (
            <View style={{ paddingHorizontal: hp('2%') }}>
              <View style={{ width: hp('2.5%') }} />
            </View>
          )}
          {this.state.search ? (
            <View
              style={{
                width: '100%',
                height: '100%',
                position: 'absolute',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <View
                style={[styles.searchInput, isTablet ? { width: '98%' } : null]}
              >
                <TextInput
                  ref={ref => (this.inputField = ref)}
                  underlineColorAndroid="rgba(0,0,0,0)"
                  placeholder="Search Settings"
                  value={this.state.textSearch}
                  onBlur={() => {
                    this.setState({ search: false });
                  }}
                  //onFocus={()=>{this.setState({fontSearch:'2.2%'})}}
                  onChangeText={textSearch2 => {
                    if (/^[a-zA-Z ]+$/.test(textSearch2) || textSearch2 == '') {
                      this.setState({ textSearch: textSearch2 }, () => {
                        this.props.find(this.state.textSearch);
                        if (this.state.textSearch == '')
                          this.setState({ fontSearch: '2.1%' });
                        else this.setState({ fontSearch: '2.2%' });
                      });
                    }
                  }}
                  style={{
                    marginTop: 0,
                    marginLeft: hp('2.3%'),
                    paddingVertical: 0,
                    width: '80%',
                    fontFamily: 'Montserrat-Bold',
                    fontSize: hp(this.state.fontSearch),

                    color: 'rgba(0,0,0,0.6)',
                  }}
                />
                <TouchableOpacity
                  onPress={() => {
                    this.props.exit();
                    this.setState({ search: false, textSearch: '' });
                  }}
                  style={{
                    position: 'absolute',
                    right: hp('1%'),
                    height: '100%',
                    paddingHorizontal: hp('1%'),
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Image
                    source={require('../../assets/img/clear.png')}
                    style={{ width: hp('3%'), height: hp('3%') }}
                  />
                </TouchableOpacity>
              </View>
            </View>
          ) : null}
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
    backgroundColor: colors.darkBlue,
    elevation: 0,
    flexDirection: 'row',
  },
  searchInput: {
    width: '95%',
    backgroundColor: 'white',
    height: '55%',
    marginTop: hp('1%'),
    borderRadius: 7,
    justifyContent: 'center',
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
