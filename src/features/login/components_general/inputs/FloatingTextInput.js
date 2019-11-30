import React, { Component } from "react";
import { View, TextInput, Text, Animated, Platform, Dimensions } from "react-native";
import { Colors } from "api";
import IconMaterialIcons from 'react-native-vector-icons/MaterialIcons';
import IconMaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {TextMontserrat} from "components";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp
} from "react-native-responsive-screen";
import normalize from "./../utilities/helpers/normalizeText";
import EStyleSheet from 'react-native-extended-stylesheet';

const isPortrait = () => {
  const dim = Dimensions.get('window');
  if (dim.height >= dim.width) {
    return true;
  } else {
    return false;
  }
};

class FloatingTextInput extends Component {

  state = {
    isFocused: false,
    value: this.props.value ? `${this.props.value}` : "",
    secureTextEntry: this.props.secureTextEntry,
    isPassword: this.props.secureTextEntry,
    errors: this.props.errors || [],
    validate: this.props.validate,
    handleEyeIcon: false,
    tempValue: '',
    selection: null,
    selectionDefault: null,
    changeSelection:false,
    orientation: isPortrait()
  };
  onSelectionChange = event => {
    const selection = event.nativeEvent.selection;
    if(this.state.changeSelection){
      this.setState({
        selectionDefault: {start:selection.start>this.state.value.length?this.state.value.length:selection.start, end:selection.end>this.state.value.length?this.state.value.length:selection.end}
      },()=>{
      this.setState({
        changeSelection:true
      })
    });
    //alert(selection.start+'-'+selection.end)
    }else{
      this.setState({
        changeSelection:true,
      })
      
    }
    
  };
  componentWillMount() {
    this._animatedIsFocusedAndEmpty = new Animated.Value(
      this.state.value === "" ? 0 : 1
    );
    this._animatedIsFocused = new Animated.Value(0);
    // if(this.props.focus === true) {
    //   this.setState({isFocused: true})
    // }
  }

  componentDidUpdate() {
    Animated.timing(this._animatedIsFocusedAndEmpty, {
      toValue: this.state.isFocused || this.state.value !== "" || this.props.focus ? 1 : 0,
      duration: 200
    }).start();

    Animated.timing(this._animatedIsFocused, {
      toValue: this.state.isFocused ? 1 : 0,
      duration: 100
    }).start();
  }

  iconPressHandler = () => {
    if (this.state.isPassword) {
      this.setState({changeSelection:false})
      this.setState({
        secureTextEntry: !this.state.secureTextEntry,
        tempValue: this.state.value,
        value: '',
      }, ()=>{this.setState({value: this.state.tempValue})});
      return;
    }
    this.setState({ value: "", selection: null });
  };

  handleFocus = () => {
    this.setState({ isFocused: true,selectionDefault:null, selection: {start: this.state.value.length, end: this.state.value.length} }, ()=>{this.setState({selection: null})})
    if(this.props.onFocus){
      this.props.onFocus()
    }
  };

  handleBlur = () => {
    this.setState({ isFocused: false, selection: {start: 0, end: 0} });
    if(this.props.onBlur){
      this.props.onBlur()
    }
  };

  renderValidation = () => {
    const {validate: {title, validations}} = this.props;
    const textStyle = {
      fontWeight: '600',
      fontSize: hp('1.8%'),
      color: '#6b6b6b'
    }

    return (
      <View style={{flexDirection: 'row'}}>
        <TextMontserrat style={textStyle}>{title} - </TextMontserrat>
        <View>
          {validations.map((validation, i) => {
            const passed = validation.validateInput(this.state.value);
            const statusColor = passed ? '#00c38a' : '#787878';
            return (
              <View key={`validation_${i}`} style={{flexDirection: 'row', alignItems: 'center', left: 3}}>
                <IconMaterialCommunityIcons name='check-circle' color={statusColor}/>
                <TextMontserrat style={{...textStyle, color: statusColor}}> {validation.name}</TextMontserrat>
              </View>
            )
          })}

        </View>
      </View>
    )
  }

  renderIcon = () => {
    if (this.state.isPassword) {
      const icon = this.state.secureTextEntry ? "eye-off" : "eye";
      return (
        <IconMaterialCommunityIcons
          style={[styles.iconStyle, this.props.iconStyle]}
          name={icon}
          size={24}
          color="#666"
          onPress={this.iconPressHandler}
        />
      );
    } else {
      if (this.state.isFocused) {
        return (
          <IconMaterialIcons
            style={styles.iconStyle}
            name={"cancel"}
            size={24}
            color="#666"
            onPress={this.iconPressHandler}
          />
        );
      }
    }
  };

  _changeText = v => {
    const { decimals } = this.props;
    if (decimals) {
      //   v = v.toFixed(decimals);
    }
    this.setState({ value: v, selection: {start: v.length, end: v.length}},()=>{this.setState({selection: null})});
    if(this.props.onChangeText){
      this.props.onChangeText(v);

    }
  };

  _hasError = () => {
    if(this.props.errors) {
      return this.props.errors.length > 0;
    }
    return false
  }

  showFlag = () => {
    if(this.props.focus) {
      return true
    }

    if(this.state.value !== '') {
      return true
    }


    if(this.props.children && this.state.isFocused){
      return true
    }

    return false;
  }

  render() {

    const leftPadding = this.props.lineLeft ? 10 : 0;
    const paddingLeftFlags = this.props.children ? 10: 0;
    const { isFocused, value, secureTextEntry } = this.state;
    const { label, underline, inputStyle, keyboardType, returnKeyType, onSubmitEditing, refTo, 
      autoCapitalize, } = this.props;

    const inputActiveColor = this._hasError() ? Colors.danger : Colors.primary;
    const inputInActiveColor = this._hasError() ? Colors.danger : "#6b6b6b";
    const ExtendedStyles = {
      labelDown: {
        fontSize: this.state.orientation ? hp('2.1%') : hp('3%')
      },
      labelUp: {
        fontSize: this.state.orientation ? hp('1.8%') : hp('2.5%')
      },
      labelOptionalDown: {
        fontSize: this.state.orientation ? hp('1.8%') : hp('2.7%')
      },
      labelOptionalUp: {
        fontSize: this.state.orientation ? hp('1.5%') : hp('2.5%')
      },
      underline: {
        height: this.state.orientation ? hp('0.4%') : hp('0.4%')
      },
      textInput: {
        fontSize: this.state.orientation ? hp('2.1%') : hp('3%')
      },
      errorText: {
        fontSize: this.state.orientation ? hp('1.8%') : hp('2.7%')
      },
    }

    const textInputStyle = {
      fontSize: ExtendedStyles.textInput.fontSize,
      color: isFocused ? inputActiveColor : inputInActiveColor,
      height: this.state.orientation ? hp('6%') : hp('7%'),
      marginTop: this.props.margin || 20,
      fontFamily: "Montserrat-SemiBold",
      width: "80%",
      paddingBottom: this.state.orientation ? hp('0.5%') : hp('1%'),
    };

    const leftOffset = Platform.OS === 'ios' ? 0 : 0;
    
    const labelStyle = {
      position: "absolute",
      fontFamily: 'Montserrat-SemiBold',
      left: leftOffset + leftPadding,
      top: this._animatedIsFocusedAndEmpty.interpolate({
        inputRange: [0, 1],
        outputRange: this.state.orientation ? [34, 10] : [28, 0]
      }),
      fontSize: this._animatedIsFocusedAndEmpty.interpolate({
        inputRange: [0, 1],
        outputRange: [ExtendedStyles.labelDown.fontSize, ExtendedStyles.labelUp.fontSize]
      }),
      color: "#6b6b6b",
      ...this.props.labelStyle
    };
    optionalLabelStyle = {
      fontSize: this._animatedIsFocusedAndEmpty.interpolate({
        inputRange: [0, 1],
        outputRange: [ExtendedStyles.labelOptionalDown.fontSize, ExtendedStyles.labelOptionalUp.fontSize]
      })
    };
    const underlineStyle = {
      left: leftOffset,
      backgroundColor: this._animatedIsFocused.interpolate({
        inputRange: [0, 1],
        outputRange: ['#eee', inputActiveColor]
      }),
      height: ExtendedStyles.underline.height,
      width: "100%",
      marginBottom: 3
    };

    renderUnderline = () => {
      if (underline != false) {
        return <Animated.View style={underlineStyle} />;
      }
    };

    renderErrors = (color, offset, fontSize) => {
      if(!this.props.errors) return false;
      return this.props.errors.map((error, i) => {
        return (<TextMontserrat key={`err_${i}`} style={{
          fontWeight: '600',
          color: color,
          left: offset,
          fontSize: fontSize
        }}>{error}</TextMontserrat>)
      })
    }

    return (
      <View style={{width: '100%', height:this.state.orientation ? hp('8%') : hp('10%')}}>
        <Animated.Text style={labelStyle}>
          {label}{" "}{this._hasError() && <IconMaterialCommunityIcons size={18} name="alert-circle" color={inputActiveColor}/>}
          <Animated.Text style={optionalLabelStyle}>
            {this.props.labelOptional ? this.props.labelOptional : ""}
          </Animated.Text>
        </Animated.Text>
        <View style={{flexDirection: "row"}}>
          {this.renderIcon()}
          {this.props.lineLeft && <View style={{
            width: 1, 
            height: 35, 
            backgroundColor: this.state.isFocused ? inputActiveColor : '#eee',
            position: "absolute",
            bottom: 0
            }}/>}
          {this.showFlag() && <View style={{
            alignSelf: "flex-end",
            marginBottom: 8
            }}>
            {this.props.children}
          </View>}
          <TextInput
            ref={input => {
              this.input=input
              if (this.props.inputRef) {
                this.props.inputRef(input);
              }
            }}
            style={[textInputStyle, inputStyle, {
              paddingLeft: leftPadding + paddingLeftFlags,
              marginLeft: paddingLeftFlags,
              borderLeftWidth: this.props.phone && this.showFlag() ? 2 : 0,
              borderColor: this.state.isFocused ? inputActiveColor : '#eee',            
              fontWeight: 'normal',
              }]}
            onFocus={this.handleFocus}
            onBlur={this.handleBlur}
            value={value}
            autoCorrect={false}
            onChangeText={v => this._changeText(v)}
            secureTextEntry={secureTextEntry}
            keyboardType={keyboardType}
            underlineColorAndroid={"transparent"}
            returnKeyType={returnKeyType}
            onSubmitEditing={onSubmitEditing}
            autoCapitalize={autoCapitalize}
            onSelectionChange={this.props.selectionAlg?this.onSelectionChange:null}
            selection={Platform.OS === 'android' ? this.props.selectionAlg?this.state.selectionDefault:this.state.selection : null}
          />
        </View>
        {renderUnderline()}
        {renderErrors(inputActiveColor, leftOffset, ExtendedStyles.errorText.fontSize)}
        {!!this.props.validate && this.state.isFocused && this.renderValidation()}
      </View>
    );
  }
}
const styles = {
  iconStyle: {
    position: "absolute",
    right: 5,
    top: "50%",
    
    zIndex: 50
  }
};
export default FloatingTextInput;
