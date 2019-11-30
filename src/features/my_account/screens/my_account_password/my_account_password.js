import React, { Component } from 'react';
import {
  View,
  Image,
  StyleSheet,
  AsyncStorage,
  NetInfo,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { isTablet } from '../../constants/isLandscape';
import colors from '../../styles/colors';
import Orientation from 'react-native-orientation-locker';
import Header from '../../components/header/header';
import * as yup from 'yup';
import { TextMontserrat, FloatingTextInput } from 'components';
import { ButtonGradient } from 'components';
import EpaisaService from '../../../../services/epaisa_service';
import alert_service from '../../../../services/alert_service';
import { handleError } from '../../../../factory/utils/handlerError';
import loading_service from '../../../../services/loading_service';
//import mixpanel from '../../../../services/mixpanel';
const validations = [
  {
    name: '8 Characters',
    validateInput: val => {
      return val.length > 7;
    },
  },
  {
    name: '1 Number',
    validateInput: val => {
      return /\d/.test(val);
    },
  },
  {
    name: '1 Special Character',
    validateInput: val => {
      return /\W+/.test(val);
    },
  },
];
function equalTo(ref, msg) {
  return yup.mixed().test({
    name: 'equalTo',
    exclusive: false,
    message: msg || '${path} must be the same as ${reference}',
    params: {
      reference: ref.path,
    },
    test: function(value) {
      return value === this.resolve(ref);
    },
  });
}
yup.addMethod(yup.string, 'equalTo', equalTo);
class MyAccountPassword extends Component {
  static navigationOptions = ({ navigation }) => ({
    header: <Header isBack={true} label="PASSWORD" navigation={navigation} />,
  });
  constructor() {
    super();
    //mixpanel.mp.track('Change Password Screen');

    this.state = {
      validForm: false,
      form: { currentPassword: '', newPassword: '', reNewPassword: '' },
      changeSelection: true,
      selectionCurrentPassword: null,
    };
    this.requestHandler = new EpaisaService();
    this.requestHandler.on('request', () => {
      loading_service.showLoading();
    });
    this.requestHandler.on('done', () => {
      loading_service.hideLoading();
    });
  }

  UNSAFE_componentWillMount() {
    !isTablet ? Orientation.lockToPortrait() : Orientation.lockToLandscape();
  }
  PASSWORD_SQUEMA = yup.object().shape({
    currentPassword: yup
      .string()
      .min(8)
      .required(),
    newPassword: yup
      .string()
      .test('password-valid', 'New password is not valid', value => {
        let valid = true;
        for (const validation of validations) {
          if (!validation.validateInput(value)) {
            valid = false;
            break;
          }
        }
        return valid;
      })
      .required(),
    reNewPassword: yup
      .string()
      .equalTo(yup.ref('newPassword'), 'Passwords must match')
      .required(),
  });
  async _textChange(key, value) {
    try {
      const form = {
        ...this.state.form,
        [key]: value,
      };
      const validForm = await this.PASSWORD_SQUEMA.isValid(form);
      this.setState({ form, validForm });
    } catch (error) {
      console.log(error);
    }

    return;
  }

  onSelectionChange = event => {
    const selection = event.nativeEvent.selection;
    if (this.state.changeSelection) {
      this.setState(
        {
          selectionCurrentPassword: {
            start: selection.start,
            end: selection.end,
          },
        },
        () => {
          this.setState({
            changeSelection: true,
          });
        }
      );
      alert(selection.start + '-' + selection.end);
    } else {
      this.setState(
        {
          changeSelection: true,
          selectionCurrentPassword: { start: 2, end: 2 },
        },
        () => {
          this.current.forceUpdate();
        }
      );
    }
  };
  async onChangePassword() {
    try {
      const response = await this.requestHandler.passwordChange(
        this.state.form.currentPassword,
        this.state.form.newPassword
      );

      if (response.success === 0) {
        throw new Error(response.message);
      }
      alert_service.showAlert(response.response, async () => {
        await AsyncStorage.removeItem('user');
        return this.props.navigation.navigate('Auth');
      });

      console.log({ response });
    } catch (err) {
      const error = handleError(err.message);
      console.log(error);
      alert_service.showAlert(error.message, error.action);
    }
    return;
  }
  render() {
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
          resizeMode="stretch"
          source={bgImage}
        />

        <TouchableWithoutFeedback
          style={{
            position: 'absolute',
            top: 0,
            height: '100%',
            width: '100%',
          }}
          onPress={() => {
            Keyboard.dismiss();
          }}
        >
          <View
            style={{
              width: '100%',
              marginTop: hp('2%'),
              alignItems: 'center',
              paddingHorizontal: wp(isTablet ? '5%' : '8%'),
              justifyContent: 'space-between',
            }}
          >
            <View>
              <View>
                <View
                  style={[
                    {},
                    styles.nameInputs,
                    !isTablet ? { height: hp('8%') } : { height: hp('11%') },
                  ]}
                >
                  <FloatingTextInput
                    inputRef={x => {
                      this.current = x;
                    }}
                    label={'Current Password'}
                    value={this.state.form.currentPassword}
                    secureTextEntry={true}
                    // selectionAlg={true}
                    //onSelectionChange={this.onSelectionChange}
                    onChangeText={val =>
                      this._textChange('currentPassword', val)
                    }
                    //onTapSecureText={
                    //{first:()=>this.setState({changeSelection:false}),second:()=>alert(1)}}
                    /*onSubmitEditing={this._checkEmail.bind(this)}
                onBlur={this._checkEmail.bind(this)}
                errors={errors.Username || []}*/
                    autoCapitalize={'none'}
                    touched={true}
                    labelSizeUp={!isTablet ? hp('1.5%') : hp('2%')}
                    labelSizeDown={!isTablet ? hp('2%') : hp('2.5%')}
                    labelPlacingUp={!isTablet ? hp('0%') : hp('1%')}
                    labelPlacingDown={!isTablet ? hp('3%') : hp('5%')}
                    inputContainerStyle={
                      !isTablet ? { height: hp('3%') } : { height: hp('7%') }
                    }
                    inputStyle={
                      !isTablet
                        ? {
                            fontSize: hp('2%'),
                            height: hp('5%'),
                            marginTop: hp('2%'),
                            paddingBottom: 0,
                          }
                        : {
                            fontSize: hp('2.7%'),
                            height: hp('6.9%'),
                            marginTop: hp('3%'),
                            paddingBottom: 0,
                          }
                    }
                    underlineStyle={
                      !isTablet
                        ? { height: hp('0.4%') }
                        : { height: hp('0.4%') }
                    }
                    iconStyle={
                      !isTablet
                        ? { bottom: hp('0.1%'), zIndex: 0 }
                        : { bottom: hp('0.1%'), zIndex: 0 }
                    }
                    iconSize={!isTablet ? hp('2.7%') : hp('3.8%')}
                    //selection={this.state.selectionCurrentPassword}
                  />
                </View>
                <TextMontserrat
                  style={{
                    fontSize: hp(isTablet ? '1.6' : '1.4%'),
                    fontWeight: '600',
                  }}
                >
                  Please enter current password
                </TextMontserrat>
              </View>
              <View
                style={[
                  {},
                  styles.nameInputs,
                  !isTablet ? { height: hp('14%') } : { height: hp('18%') },
                ]}
              >
                <FloatingTextInput
                  label={'New Password'}
                  // selectionAlg={true}
                  value={this.state.form.newPassword}
                  secureTextEntry={true}
                  onChangeText={val => this._textChange('newPassword', val)}
                  validate={{
                    title: 'Password must contain',
                    validations: validations,
                  }}
                  alwaysValidation={true}
                  /*onSubmitEditing={this._checkEmail.bind(this)}
                onBlur={this._checkEmail.bind(this)}
                errors={errors.Username || []}*/
                  autoCapitalize={'none'}
                  touched={true}
                  labelSizeUp={!isTablet ? hp('1.5%') : hp('2%')}
                  labelSizeDown={!isTablet ? hp('2%') : hp('2.5%')}
                  labelPlacingUp={!isTablet ? hp('0%') : hp('1%')}
                  labelPlacingDown={!isTablet ? hp('3%') : hp('5%')}
                  inputContainerStyle={
                    !isTablet ? { height: hp('3%') } : { height: hp('7%') }
                  }
                  inputStyle={
                    !isTablet
                      ? {
                          fontSize: hp('2%'),
                          height: hp('5%'),
                          marginTop: hp('2%'),
                          paddingBottom: 0,
                        }
                      : {
                          fontSize: hp('2.7%'),
                          height: hp('6.9%'),
                          marginTop: hp('3%'),
                          paddingBottom: 0,
                        }
                  }
                  underlineStyle={
                    !isTablet ? { height: hp('0.4%') } : { height: hp('0.4%') }
                  }
                  iconStyle={
                    !isTablet
                      ? { bottom: hp('0.1%'), zIndex: 0 }
                      : { bottom: hp('0.1%'), zIndex: 0 }
                  }
                  iconSize={!isTablet ? hp('2.7%') : hp('3.8%')}
                />
              </View>
              <View>
                <View
                  style={[
                    {},
                    styles.nameInputs,
                    !isTablet ? { height: hp('8%') } : { height: hp('12%') },
                  ]}
                >
                  <FloatingTextInput
                    // selectionAlg={true}
                    label={'Re-Type New Password'}
                    value={this.state.form.reNewPassword}
                    secureTextEntry={true}
                    onChangeText={val => this._textChange('reNewPassword', val)}
                    /*onSubmitEditing={this._checkEmail.bind(this)}
                onBlur={this._checkEmail.bind(this)}
                errors={errors.Username || []}*/
                    autoCapitalize={'none'}
                    touched={true}
                    labelSizeUp={!isTablet ? hp('1.5%') : hp('2%')}
                    labelSizeDown={!isTablet ? hp('2%') : hp('2.5%')}
                    labelPlacingUp={!isTablet ? hp('0%') : hp('1%')}
                    labelPlacingDown={!isTablet ? hp('3%') : hp('5%')}
                    inputContainerStyle={
                      !isTablet ? { height: hp('3%') } : { height: hp('7%') }
                    }
                    inputStyle={
                      !isTablet
                        ? {
                            fontSize: hp('2%'),
                            height: hp('5%'),
                            marginTop: hp('2%'),
                            paddingBottom: 0,
                          }
                        : {
                            fontSize: hp('2.7%'),
                            height: hp('6.9%'),
                            marginTop: hp('3%'),
                            paddingBottom: 0,
                          }
                    }
                    underlineStyle={
                      !isTablet
                        ? { height: hp('0.4%') }
                        : { height: hp('0.4%') }
                    }
                    iconStyle={
                      !isTablet
                        ? { bottom: hp('0.1%'), zIndex: 0 }
                        : { bottom: hp('0.1%'), zIndex: 0 }
                    }
                    iconSize={!isTablet ? hp('2.7%') : hp('3.8%')}
                  />
                </View>
                <TextMontserrat
                  style={{
                    fontSize: hp(isTablet ? '1.6' : '1.4%'),
                    fontWeight: '600',
                  }}
                >
                  Please re-type password
                </TextMontserrat>
              </View>
            </View>
            <View
              style={{
                marginTop: hp('5%'),
                width: '100%',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <View style={{ width: '100%' }}>
                <ButtonGradient
                  disabled={!this.state.validForm}
                  title={'SAVE'}
                  onPress={async () => {
                    let isConnected = await NetInfo.isConnected.fetch();
                    if (isConnected) {
                      this.onChangePassword.call(this);
                    } else {
                      alert_service.showAlert('Please connect to Internet');
                    }
                  }}
                />
              </View>
            </View>
          </View>
        </TouchableWithoutFeedback>
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
    backgroundColor: colors.darkWhite,
  },
  nameInputs: {
    flexDirection: 'row',
  },
});
export default MyAccountPassword;
