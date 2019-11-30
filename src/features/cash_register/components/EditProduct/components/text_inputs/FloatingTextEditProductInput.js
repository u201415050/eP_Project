import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  StatusBar,
  TextInput,
  Animated,
  TouchableOpacity,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import IconMaterialIcons from 'react-native-vector-icons/MaterialIcons';
import DropdownMaterialIcons from 'react-native-vector-icons/Ionicons';
import { TextMontserrat } from 'components';
import { Dropdown } from 'react-native-material-dropdown';

class FloatingLabelInput extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isFocused: false,
      rupeeSign: '₹',
      orientation: this.props.orientation,
    };
  }

  componentWillMount() {
    this._animatedIsFocused = new Animated.Value(
      this.props.value === '' ? 0 : 1
    );
  }

  handleFocus = () => this.setState({ isFocused: true });
  handleBlur = () => this.setState({ isFocused: false });

  componentDidUpdate() {
    Animated.timing(this._animatedIsFocused, {
      toValue:
        this.state.isFocused || this.props.value !== '' || this.props.dropdown
          ? 1
          : 0,
      duration: 200,
    }).start();
  }

  render() {
    const { label, ...props } = this.props;
    const error = this.props.error || false;
    const labelStyle = {
      position: 'absolute',
      left: wp('1%'),
      fontFamily: 'Montserrat-Medium',
      top: this._animatedIsFocused.interpolate({
        inputRange: [0, 1],
        outputRange: [hp('3.2%'), 0], // on text input, above text input
      }),
      fontSize: this._animatedIsFocused.interpolate({
        inputRange: [0, 1],
        outputRange: [hp('2.1%'), hp('1.8%')], // on text input, above text input
      }),
      color: this._animatedIsFocused.interpolate({
        inputRange: [0, 1],
        outputRange: ['#6B6B6B', '#6B6B6B'], // on text input, above text input
      }),
    };

    const mainInputPortraitStyle = {
      height: hp('6.5%'),
      width: this.props.eraseOption ? '93.5%' : '100%',
      fontSize: hp('2.1%'),
      paddingLeft: hp('0.4%'),
      paddingTop: hp('2%'),
      paddingBottom: 0, //Platform.OS==="android"?0:-10,
      color: error ? '#D0021B' : '#174285',
      fontFamily: 'Montserrat-SemiBold',
    };

    const mainInputLandscapeStyle = {
      height: hp('6.5%'),
      width: this.props.eraseOption ? '88%' : '100%',
      fontSize: hp('2.1%'),
      paddingLeft: hp('0.4%'),
      paddingTop: hp('2%'),
      paddingBottom: 0,
      color: error ? '#D0021B' : '#174285',
      fontFamily: 'Montserrat-SemiBold',
      paddingLeft: this.props.rupeeSign ? 0 : wp('1%'),
    };

    const mainInputPortraitReStyle = {
      height: hp('6.5%'),
      width: this.props.eraseOption ? '75%' : '100%',
      fontSize: hp('2.1%'),
      paddingLeft: hp('0.4%'),
      paddingTop: hp('2%'),
      paddingBottom: 0,
      color: error ? '#D0021B' : '#174285',
      fontFamily: 'Montserrat-SemiBold',
    };

    const mainInputLandscapeReStyle = {
      height: hp('6.5%'),
      width: this.props.eraseOption ? '72%' : '100%',
      fontSize: hp('2.1%'),
      paddingTop: hp('2%'),
      paddingBottom: 0,
      color: error ? '#D0021B' : '#174285',
      fontFamily: 'Montserrat-SemiBold',
      paddingLeft: this.props.rupeeSign ? hp('0.4%') : wp('1%'),
    };

    const rupeePortrait = {
      height: hp('6.5%'),
      width: '12%',
      fontSize: hp('2.1%'),
      paddingTop: hp('2%'),
      paddingBottom: 0,
      paddingLeft: hp('0.4%'),
      color: error ? '#D0021B' : '#174285',
      fontFamily: 'Montserrat-SemiBold',
    };

    const rupeeLandscape = {
      height: hp('6.5%'),
      width: '15%',
      fontSize: hp('2.1%'),
      paddingTop: hp('2%'),
      paddingBottom: 0,
      color: error ? '#D0021B' : '#174285',
      fontFamily: 'Montserrat-SemiBold',
      paddingLeft: wp('1%'),
    };

    const clearButtonPortrait = {
      height: hp('5%'),
      width: '8%',
      position: 'absolute',
      right: 0,
      top: hp('2.8%'),
    };

    const clearButtonLandscape = {
      height: hp('5%'),
      width: '6.5%',
      position: 'absolute',
      right: 0,
      top: hp('2.8%'),
    };

    const clearButtonRePortrait = {
      height: hp('5.1%'),

      position: 'absolute',
      right: 0,
      top: hp('2.8%'),
    };

    const clearButtonReLandscape = {
      height: hp('5%'),

      position: 'absolute',
      right: 0,
      top: hp('2.8%'),
    };

    const restyleComponent = this.props.restyle;

    return (
      <View
        style={{
          width: wp('' + this.props.inputWidth),
          height: hp('' + this.props.inputHeight) /*backgroundColor:'#EDCFAC'*/,
        }}
      >
        <Animated.Text
          style={[labelStyle, error ? { color: '#D0021B' } : null]}
        >
          {label}
        </Animated.Text>
        <View style={{ flexDirection: 'row' }}>
          {this.props.rupeeSign && (
            <TextInput
              style={this.state.orientation ? rupeePortrait : rupeeLandscape}
              underlineColorAndroid="rgba(0,0,0,0)"
              value={this.props.value !== '' ? this.state.rupeeSign : ''}
              editable={false}
            />
          )}
          <TextInput
            {...props}
            style={[
              restyleComponent
                ? this.props.orientation
                  ? mainInputPortraitReStyle
                  : mainInputLandscapeReStyle
                : this.props.orientation
                ? mainInputPortraitStyle
                : mainInputLandscapeStyle,

              this.props.dropdown
                ? {
                    paddingLeft: this.props.orientation ? wp('1%') : wp('1.5%'),
                    width: this.props.newInputWidth,
                  }
                : {},
            ]}
            underlineColorAndroid="rgba(0,0,0,0)"
            autoCorrect={false}
            numberOfLines={1}
            autoCapitalize={this.props.autoCapitalizeInput}
            keyboardType={this.props.keyboard}
            maxLength={this.props.maxLength}
            onFocus={this.handleFocus}
            onBlur={this.handleBlur}
            blurOnSubmit
          />
          {/*this.state.isFocused && */ this.props.eraseOption &&
          this.props.value !== '' ? (
            <TouchableOpacity
              style={
                restyleComponent
                  ? this.state.orientation
                    ? clearButtonRePortrait
                    : clearButtonReLandscape
                  : this.state.orientation
                  ? clearButtonPortrait
                  : clearButtonLandscape
              }
              onPress={this.props.onPressAction}
            >
              <View>
                <IconMaterialIcons name="cancel" size={hp('2.8%')} />
              </View>
            </TouchableOpacity>
          ) : null}
        </View>
        <View
          style={{
            backgroundColor: error ? '#D0021B' : /* 6B6B6B */ '#174285',
            width: wp('' + this.props.inputWidth),
            height: hp('0.35%'),
          }}
        >
          <View
            style={{ backgroundColor: '#fff', width: wp('1%'), height: '100%' }}
          />
        </View>
      </View>
    );
  }
}

export default class FloatingTextEditProductInput extends Component {
  state = {
    value: `${this.props.value}`,
  };

  handleTextChange = newText => {
    if (this.props.validateQuantity) {
      if (
        /^\d{1,3}(\.\d{1,3})?$/.test(newText) ||
        /^\d{1,3}\.?$/.test(newText) ||
        /^\d{1,3}$/.test(newText) ||
        newText == ''
      ) {
        this.setState({ value: newText + '' });
      }
    } else if (this.props.validatePrice) {
      if (
        /^\d{1,6}(\.\d{1,2})?$/.test(newText) ||
        /^\d{1,6}\.?$/.test(newText) ||
        /^\d{1,6}$/.test(newText) ||
        newText == ''
      ) {
        this.setState({ value: newText + '' });
      }
    } else {
      this.setState({ value: newText + '' });
    }
  };

  eraseText = () => {
    this.setState({ value: '' });
  };

  render() {
    const dropdownHeight = hp(this.props.height);
    const dropdownWidth = wp(this.props.width) * 0.35;
    const pickerWidth = wp(this.props.width);
    const dropdown = this.props.dropdown;
    const data = [
      { value: 1 },
      { value: 2 },
      { value: 3 },
      { value: 4 },
      { value: 5 },
      { value: 6 },
      { value: 7 },
      { value: 8 },
      { value: 9 },
      { value: 10 },
    ];
    const stylePortraitDropdown = {
      containerHeight: '100%',
      containerWidth: dropdownWidth,
      descriptorTypeSize: wp('3.5%'),
      inputLeftPadding: this.props.orientation ? wp('2%') : wp('1%'),
      inputFontSize: wp('3.6%'),
      iconSize: hp('3%'),
    };

    return (
      <View>
        {/*<StatusBar hidden />*/}
        {dropdown ? (
          <View
            style={{
              height: dropdownHeight,
              width: '100%',
              flexDirection: 'row',
            }}
          >
            <FloatingLabelInput
              inputWidth={this.props.width}
              inputHeight={this.props.height}
              error={this.props.error}
              //label={(!this.state.isFocused && this.state.value !== '')  ? '' : this.props.labelText }
              label={this.props.labelText}
              value={this.state.value}
              maxLength={this.props.maximumLength}
              onChangeText={this.handleTextChange}
              keyboard={this.props.typeOfKeyboard}
              eraseOption={this.props.eraseOption}
              autoCapitalizeInput={this.props.autoCapitalizeText}
              rupeeSign={this.props.rupeeSign}
              orientation={this.props.orientation}
              onPressAction={this.eraseText}
              firstValue={this.props.firstValue}
              restyle={this.props.restyle}
              dropdown={dropdown}
              zIndex={1}
              newInputWidth={'60%'}
            />
            <Dropdown
              data={data}
              //value={this.props.value}
              boxLabelStyle={{
                fontSize: stylePortraitDropdown.inputFontSize,
                color: '#174285',
                fontFamily: 'Montserrat-SemiBold',
              }}
              textColor={'#174285'}
              style={{
                fontFamily: 'Montserrat-SemiBold',
              }}
              renderBase={() => (
                <DropdownMaterialIcons
                  color="#666"
                  style={{
                    width: stylePortraitDropdown.iconSize,
                    height: stylePortraitDropdown.iconSize,
                    position: 'absolute',
                    right: this.props.orientation ? wp('1.5%') : wp('0.75%'),
                    top: hp('-1.3%'),
                  }}
                  onPress={null}
                  name={'ios-arrow-down'}
                  size={stylePortraitDropdown.iconSize}
                />
              )}
              onChangeText={v => this.handleTextChange(v)}
              itemCount={3}
              containerStyle={{
                width: '100%',
                height: '100%',
                justifyContent: 'center',
                //paddingLeft: stylePortraitDropdown.inputLeftPadding,
                position: 'absolute',
                right: 0,
              }}
              pickerStyle={{
                width: pickerWidth,
                justifyContent: 'center',
                alignItems: 'center',
              }}
              //dropdownPosition={ dropdownPosition }
              dropdownMargins={{ min: 0, max: 0 }}
              //dropdownOffset={ dropdownOffset }
              dropdownOffset={
                this.state.orientation
                  ? { top: 0, right: 0 }
                  : { top: hp('6.5'), left: 0 }
              }
              dropdownPosition={0}
              itemTextStyle={{
                fontFamily: 'Montserrat-SemiBold',
                fontSize: stylePortraitDropdown.inputFontSize,
                textAlign: 'center',
                width: pickerWidth,
              }}
            />
          </View>
        ) : null}
        {!dropdown && (
          <FloatingLabelInput
            inputWidth={this.props.width}
            inputHeight={this.props.height}
            error={this.props.error}
            //label={(!this.state.isFocused && this.state.value !== '')  ? '' : this.props.labelText }
            label={this.props.labelText}
            value={this.state.value}
            maxLength={this.props.maximumLength}
            onChangeText={this.handleTextChange}
            keyboard={this.props.typeOfKeyboard}
            eraseOption={this.props.eraseOption}
            autoCapitalizeInput={this.props.autoCapitalizeText}
            rupeeSign={this.props.rupeeSign}
            orientation={this.props.orientation}
            onPressAction={this.eraseText}
            firstValue={this.props.firstValue}
            restyle={this.props.restyle}
          />
        )}
        {this.props.error && !dropdown ? (
          <TextMontserrat
            style={{
              color: '#D0021B',
              fontSize: hp('1.7%'),
              fontWeight: '600',
            }}
          >
            {' '}
            {this.props.emessage}
          </TextMontserrat>
        ) : null}
      </View>
    );
  }
}
