import React, { Component } from 'react';
import {
  Text,
  TouchableOpacity,
  View,
  TextInput,
  Keyboard,
} from 'react-native';
import { Dropdown } from 'react-native-material-dropdown';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { isTablet } from '../../../../../../../../constants/isLandscape';
import IconMaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {
  discountStylesPortrait,
  discountStylesLandscape,
  selectPortrait,
  selectLandscape,
} from './styles';
import { TextMontserrat } from 'components';

export default class SelectorDiscount extends Component {
  constructor(props) {
    super(props);

    this.state = {
      discountSign: this.props.type || '%',
      discount:
        this.props.value !== '' && parseFloat(this.props.value) !== 0
          ? parseFloat(this.props.value)
          : '',
      totalDiscount: '0.00',

      opacityError: 0,
      colorError: '#174285',
      errorMessage: '',
      isFocused: false,

      keyboardActive: false,
      orientation: this.props.orientation,

      error: this.props.error,
    };

    this.changeDropdownDiscountArrow = this.changeDropdownDiscountArrow.bind(
      this
    );
  }
  clearModalDiscountInput = () => {
    this.setState({
      discount: '',
    });
  };

  hideErrorMessageDiscount = () => {
    this.setState({
      opacityError: 0,
      colorError: '#174285',
    });
  };

  changeKeyboardActive = () => {
    this.setState({
      keyboardActive: true,
    });
  };

  changeKeyboardInactive = () => {
    this.setState({
      keyboardActive: false,
    });
  };

  componentWillMount() {
    this.keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      this.changeKeyboardActive
    );
    this.keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      this.changeKeyboardInactive
    );

    const discount =
      this.props.value !== '' && parseFloat(this.props.value) !== 0
        ? parseFloat(this.props.value)
        : '';

    this.setState({ discount: discount });
  }

  handleTextChange = newText => {
    if (this.props.type === '%') {
      if (
        /^\d{1,2}(\.\d{1,2})?$/.test(newText) ||
        /^\d{1,2}\.?$/.test(newText) ||
        /^\d{1,2}$/.test(newText) ||
        newText == ''
      ) {
        this.setState(
          {
            discount: newText + '',
          },
          () => this.props.onSelection(this.props.type, this.state.discount)
        );
      }
    } else {
      if (
        /^\d{1,6}(\.\d{1,2})?$/.test(newText) ||
        /^\d{1,6}\.?$/.test(newText) ||
        /^\d{1,6}$/.test(newText) ||
        newText == ''
      ) {
        this.setState(
          {
            discount: newText + '',
          },
          () => this.props.onSelection(this.props.type, this.state.discount)
        );
      }
    }
  };

  componentWillUnmount() {
    this.keyboardDidShowListener.remove();
    this.keyboardDidHideListener.remove();
  }

  changeDropdownDiscountArrow() {
    return (
      <IconMaterialCommunityIcons
        size={25}
        name={'chevron-down'}
        color={this.state.orientation ? '#7f7f7f' : '#174285'}
      />
    );
  }

  render() {
    let dataDiscountNomination = [{ value: '%' }, { value: '₹' }];
    const { error } = this.props;

    return (
      <View
        ref={ref => {
          this.bottomSeparator = ref;
        }}
        style={
          this.state.orientation
            ? [
                discountStylesPortrait.textInputModal,
                {
                  width: this.props.width,
                  borderBottomColor: this.props.errors
                    ? '#e30000'
                    : this.state.colorError,
                },
              ]
            : [
                discountStylesLandscape.textInputModalLandscape,
                {
                  width: this.props.width,
                  borderBottomColor: this.props.errors
                    ? '#e30000'
                    : this.state.colorError,
                },
              ]
        }
      >
        <View
          style={{
            flexDirection: 'row',
            width: '100%',
            alignItems: 'flex-start',
          }}
        >
          <TextMontserrat
            style={
              this.state.orientation
                ? {
                    // fontSize: hp('1.7%'),
                    fontSize: wp('2.85%'),
                    fontWeight: '600',
                    color: error ? '#D0021B' : '#6B6B6B',
                    marginRight: wp('1%'),
                  }
                : {
                    fontSize: hp('2%'),
                    fontWeight: '600',
                    color: error ? '#D0021B' : '#6B6B6B',
                    marginRight: wp('1%'),
                  }
            }
          >
            Discount
          </TextMontserrat>
          {this.props.errors && (
            <IconMaterialCommunityIcons
              size={hp('1.95%')}
              name="alert-circle"
              color={'#e30000'}
            />
          )}
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'flex-end' }}>
          <View
            style={
              this.state.orientation
                ? { height: hp('4.5%'), justifyContent: 'flex-start' }
                : { height: hp('4.5%'), justifyContent: 'flex-start' }
            }
          >
            <Dropdown
              //box label
              boxLabelStyle={{
                fontSize: hp('2.1%'),
                color: this.props.errors ? '#e30000' : this.state.colorError,
                fontFamily: 'Montserrat-SemiBold',
              }}
              //keyActive?
              disabled={this.state.keyboardActive}
              textColor={this.state.colorError}
              style={{ fontFamily: 'Montserrat-Medium', fontWeight: '600' }}
              selectedItemColor="#222222"
              textAlign="center"
              value={this.props.type}
              dropdownPosition={this.state.orientation ? -3.11 : -3.1}
              dropdownMargins={{ min: 0, max: 0 }}
              dropdownOffset={
                this.state.orientation
                  ? { top: hp('0.85%'), left: 0 }
                  : { top: hp('0.7%'), left: 0 }
              }
              renderAccessory={null}
              inputContainerStyle={{ borderBottomColor: 'transparent' }}
              itemPadding={hp('0.38%')}
              itemCount={2}
              fontSize={this.state.orientation ? hp('2.32%') : hp('2.4%')}
              data={dataDiscountNomination}
              itemTextStyle={{
                textAlign: 'center',
                fontWeight: '500',
                fontSize: hp('2.32%'),
                position: 'absolute',
                alignSelf: 'center',
              }}
              containerStyle={
                this.state.orientation
                  ? selectPortrait.dropdownContainer
                  : selectLandscape.dropdownContainer
              }
              pickerStyle={
                this.state.orientation
                  ? selectPortrait.pickerStyle
                  : selectLandscape.pickerStyle
              }
              onChangeText={value => {
                this.props.onSelection(value, this.props.value);
              }}
            />
          </View>

          {/*  SEPARATOR BETWEEN BOTH INPUTS  */}
          {
            <View
              ref={ref => {
                this.inputsSeparator = ref;
              }}
              style={
                this.state.orientation
                  ? [
                      discountStylesPortrait.inputsSeparator,
                      {
                        backgroundColor: this.props.errors
                          ? '#e30000'
                          : this.state.colorError,
                      },
                    ]
                  : {
                      height: hp('4%'),
                      width: wp('0.2%'),
                      paddingTop: hp('0.5%'),
                      backgroundColor: this.props.errors
                        ? '#e30000'
                        : this.state.colorError,
                    }
              }
            />
          }

          <View width={this.state.orientation ? wp('56%') : wp('16%')}>
            <TextInput
              ref={ref => {
                this.discountInput = ref;
              }}
              maxLength={this.props.maxLength}
              // value={this.props.value}
              defaultValue={this.props.defaultValue}
              keyboardType={'numeric'}
              returnKeyType={'done'}
              underlineColorAndroid={'transparent'}
              onFocus={() => this.setState({ isFocused: true })}
              onBlur={() => this.setState({ isFocused: false })}
              height={isTablet ? hp('4%') : hp('6%')}
              style={
                this.state.orientation
                  ? [
                      discountStylesPortrait.discountModalDiscountInputPortrait,
                      {
                        color: this.props.errors
                          ? '#e30000'
                          : this.state.colorError,
                      },
                    ]
                  : [
                      discountStylesLandscape.discountModalDiscountInputLandscape,
                      {
                        color: this.props.errors
                          ? '#e30000'
                          : this.state.colorError,
                      },
                    ]
              }
              onChangeText={this.props.onChangeText}
            />
          </View>

          {/* CLEAR TEXT BUTTON */}
          {/*this.props.defaultValue > 0 &&*/ this.state.isFocused ? (
            <TouchableOpacity
              onPress={() => this.props.onTextClear()}
              style={
                this.state.orientation
                  ? discountStylesPortrait.clearTextButton
                  : discountStylesPortrait.clearTextButton
              }
            >
              <IconMaterialCommunityIcons
                name="close-circle"
                size={this.state.orientation ? hp('2.8%') : hp('2.8%')}
                color={'#6B6B6B'}
              />
            </TouchableOpacity>
          ) : null}
        </View>
      </View>
    );
  }
}
