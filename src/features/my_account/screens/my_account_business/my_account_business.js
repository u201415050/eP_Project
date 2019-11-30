import React, { Component } from 'react';
import ReactNative, {
  Platform,
  View,
  Text,
  Image,
  StyleSheet,
  NativeModules,
  Dimensions,
  TouchableOpacity,
  ScrollView,
  Modal,
  AsyncStorage,
  ActivityIndicator,
  NetInfo,
  KeyboardAvoidingView,
  Keyboard,
} from 'react-native';
import SettingButton from '../../components/setting_button/setting_button';
import ImgToBase64 from 'react-native-image-base64';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { isTablet } from 'components';
import colors from '../../styles/colors';
import Orientation from 'react-native-orientation-locker';
import Header from '../../components/header/header';
import realm, { createRow, getTable } from '../../../../services/realm_service';

import { connect } from 'react-redux';
import { getLocalSettingRow } from '../../../../services/settings_service';
import ImagePicker from 'react-native-image-picker';
import { TextMontserrat, FloatingTextInput } from 'components';
import { cashConstants } from '../../../cash_register/constants/actions';
import { ButtonCamera } from '../../../cash_register/components/EditProduct/components/buttons';
import ImageResizer from 'react-native-image-resizer';
import * as UserServices from 'services/user_service';
import { epaisaRequest } from '../../../../services/epaisa_service';
import loading_service from '../../../../services/loading_service';
import alert_service from 'services/alert_service';
//import mixpanel from '../../../../services/mixpanel';

const isPortrait = () => {
  return !isTablet;
};

class MyAccountBusiness extends Component {
  static navigationOptions = ({ navigation }) => ({
    header: <Header isBack={true} label="BUSINESS" navigation={navigation} />,
  });
  constructor(props) {
    super(props);
    //mixpanel.track('Account Business Screen');

    this.ICONS = {
      company: require('../../assets/img/company.png'),
      type: require('../../assets/img/type.png'),
      pan: require('../../assets/img/pan.png'),
      yearly: require('../../assets/img/yearly.png'),
      industry: require('../../assets/img/industry.png'),
      category: require('../../assets/img/category.png'),
    };
    this.Industry = [
      'Beauty and Personal Care',
      'Casual Use',
      'Charities, Education and Membership',
      'Food and Drinks',
      'Health Care and Fitness',
      'Home and Repair',
      'Leisure and Entertainment',
      'Professional Services',
      'Retail',
      'Transportation',
    ];
    this.Category = [
      'Beauty Salon',
      'Hair Salon, Barbershop',
      'Independent Stylist',
      'Massage Therapist',
      'Nail Salon',
      'Spa',
      'Tanning Salon',
      'Tattoo/Piercing',
    ];
    this.Type = [
      'Corporation',
      'Individual',
      'Partnership',
      'Private Limited',
      'Public Limited',
      'Registered Charity',
      'Religious Institution',
      'School',
      'Sole Proprietor',
      'Others',
    ];
    this.Yearly = [
      '<100,000',
      '100,000 to 200,000',
      '200,000 to 300,000',
      '300,000 to 400,000',
      '400,000 to 500,000',
      '500,000 to 600,000',
      '600,000 to 700,000',
      '700,000 to 800,000',
      '800,000 to 900,000',
      '900,000 to 1,000,000',
      '>1,000,000',
    ];
    this.state = {
      CompanyName: props.config != null ? props.config.merchantCompanyName : '', // this.props.config.user.userFirstName,
      Type: props.config != null ? props.config.businessTypeId : 0,
      PANNumber: props.config != null ? props.config.merchantPANCode : '',
      YearlyRevenue:
        props.config != null ? props.config.merchantYearlyRevenue : 0,
      Industry: props.config != null ? props.config.industryName : '',
      Category: props.config != null ? props.config.categoryName : '',
      dropChange: false,
      modalPosition: null,
      imagePath: '',
      imageHeight: '',
      imageWidth: '',
      openCameraModal: false,
      imageBase64: '',
      merchantCompanyImage:
        props.config != null
          ? props.config.merchantCompanyImage == null
            ? ''
            : props.config.merchantCompanyImage.indexOf('png') != -1
            ? props.config.merchantCompanyImage.substr(
                0,
                props.config.merchantCompanyImage.indexOf('png') + 4
              )
            : props.config.merchantCompanyImage
          : '',
      upload: false,
      orientation: isPortrait(),

      // for holding previous image before updating the image holder with the new one
      tempImage:
        props.config != null
          ? props.config.merchantCompanyImage == null
            ? ''
            : props.config.merchantCompanyImage.indexOf('png') != -1
            ? props.config.merchantCompanyImage.substr(
                0,
                props.config.merchantCompanyImage.indexOf('png') + 4
              )
            : props.config.merchantCompanyImage
          : '',

      // loading for Categories and Industries dropdown
      loadingForDropdown: false,
      industries: [],
      categories: [],
      industryIdIndustries: props.config != null ? props.config.industryId : 0,
      industryIdCategories: props.config != null ? props.config.categoryId : 0,
      isConnected: true,
      offset: 0,
      companyNameSelection:
        Platform.OS === 'android' ? { start: 0, end: 0 } : null,
      categorySelection:
        Platform.OS === 'android' ? { start: 0, end: 0 } : null,

      industrySelection:
        Platform.OS === 'android' ? { start: 0, end: 0 } : null,
    };
  }
  selectReset = () => {
    this.setState(
      {
        companyNameSelection:
          Platform.OS == 'android' ? { start: 0, end: 0 } : null,
        industrySelection:
          Platform.OS == 'android' ? { start: 0, end: 0 } : null,
        categorySelection:
          Platform.OS == 'android' ? { start: 0, end: 0 } : null,
      },
      () =>
        this.setState({
          companyNameSelection: null,
          industrySelection: null,
          categorySelection: null,
        })
    );
  };
  async componentDidMount() {
    //alert(this.state.merchantCompanyImage)
    // const user = await AsyncStorage.getItem(`user`);
    const user = realm.objectForPrimaryKey('User', 0);
    //alert(JSON.stringify(this.props.config))
    //epaisaRequest
    setTimeout(this.selectReset, 1);

    let isConnected = await NetInfo.isConnected.fetch();
    let response;
    if (isConnected) {
      response = await epaisaRequest({}, '/masterdata/industries', 'GET');
    } else {
      response = {
        success: 1,
        response: {
          Industry: Array.from(getTable('Industry')),
        },
      };

      //alert(JSON.stringify(response));
    }
    if (response.success == 1) {
      try {
        const industries = response.response.Industry;
        //alert(JSON.stringify(industries));

        this.setState(
          {
            industries: industries,
          },
          () => {
            //if (this.props.config) {
            let industry = this.state.industries.filter(
              item => item.industryId === this.props.config.industryId
            );
            industry = industry[0];
            // industry = industry || {};
            //alert(JSON.stringify(this.props.config.industryId));
            if (industry) {
              //alert(JSON.stringify(industry))
              this.setState({
                industryIdIndustries: industry.industryId,
                Industry: industry.industryName,
                categories: industry.IndustryType,
              });
              this.industryField._changeText(industry.industryName);
              this.setState(
                {
                  categories: industry.IndustryType,
                },
                () => {
                  const category = this.state.categories.find(item => {
                    return item.industryId == this.props.config.categoryId || 0;
                  });
                  //alert(JSON.stringify(category))
                  this.categoryField._changeText(
                    category != null ? category.categoryName : ''
                  );
                  this.setState({
                    Category: category != null ? category.industryName : '',
                    industryIdCategories:
                      category != null ? category.industryId : 0,
                  });
                }
              );

              setTimeout(() => {
                if (this.industryFieldText != null) {
                  this.industryFieldText.setNativeProps({
                    selection: { start: 0, end: 0 },
                  });
                }
              }, 1000);
            }
            //}
            this.setState({
              loadingForDropdown: false,
              industrySelection:
                Platform.OS === 'android' ? { start: 0, end: 0 } : null,
            });
          }
        );

        const categories = industries.map(item => {
          return item.IndustryType;
        });
        //setTimeout(

        //this.industryFieldText.blur();
        console.log('INDUSTRIES', categories);
      } catch (error) {
        alert(error);
      }
    }
  }
  componentDidUpdate() {
    //this.selectReset()
    if (this.state.upload) {
      this.setState({ upload: false });

      this.settingImage();
      //loading_service.showLoading()
    }
  }

  settingImage = () => {
    ImageResizer.createResizedImage(
      this.state.merchantCompanyImage,
      200,
      (200 * this.state.imageHeight) / this.state.imageWidth,
      'PNG',
      0,
      0
    )
      .then(response => {
        if (Platform.OS === 'ios') {
          ImgToBase64.getBase64String(response.uri)
            .then(base64String => {
              loading_service.hideLoading();
              this.onBlur(base64String);
            })
            .catch(() => {
              loading_service.hideLoading();
            });
        } else {
          NativeModules.RNImageToBase64.getBase64String(
            response.uri,
            (err, base64) => {
              try {
                //alert(base64)
                loading_service.hideLoading();
                this.onBlur(base64);
              } catch {
                loading_service.hideLoading();
                console.log(err);
              }
            }
          );
        }
      })
      .catch(err => {
        //console.log(err)
      });
  };

  async UNSAFE_componentWillMount() {
    !isTablet ? Orientation.lockToPortrait() : Orientation.lockToLandscape();
    let isConnected = await NetInfo.isConnected.fetch();
    this.setState({ isConnected });
  }

  componentWillUnmount() {
    let jsonToSend = {
      ...this.props.config,
      merchantCompanyName: this.state.CompanyName,
      businessTypeId: this.state.Type,
      merchantPANCode: this.state.PANNumber.toUpperCase(),
      merchantYearlyRevenue: this.state.YearlyRevenue,
    };

    this.onBlur('');
    this.props.set_personalconfig({
      user: this.props.user,
      merchant: jsonToSend,
    });
  }
  onBlur = async base64 => {
    // alert('called')
    let jsonToSend = {
      ...this.props.config,
      merchantCompanyName: this.state.CompanyName,
      businessTypeId: this.state.Type,
      merchantPANCode: this.state.PANNumber.toUpperCase(),
      merchantYearlyRevenue: this.state.YearlyRevenue,
    };
    if (this.state.dropChange) {
      (jsonToSend.industryName = this.state.Industry),
        (jsonToSend.categoryName = this.state.Category),
        (jsonToSend.industryId = this.state.industryIdIndustries);
      jsonToSend.categoryId = this.state.industryIdCategories;
      this.setState({ dropChange: false });
    }
    //alert(this.state.industryIdIndustries)
    if (base64 != '') {
      //alert(1)
      jsonToSend.merchantCompanyImage = base64;
    } else {
      delete jsonToSend.merchantCompanyImage;
    }

    let isConnected = await NetInfo.isConnected.fetch();
    //alert(JSON.stringify(jsonToSend))
    if (isConnected) {
      const response = await epaisaRequest(jsonToSend, '/user/profile', 'PUT');
      // alert('respuesta: '+JSON.stringify(response))
      //alert(JSON,stringify(this.state.industryIdIndustries))
      this.props.set_personalconfig({
        user: response.response.user,
        merchant: response.response.merchant,
      });

      this.setState(
        {
          tempImage: this.state.merchantCompanyImage,
        },
        () => {
          loading_service.hideLoading();
        }
      );
    } else {
      try {
        // alert("edited")

        createRow(
          'EditBusiness',
          {
            id: 0,
            merchantCompanyName: this.state.CompanyName,
            businessTypeId: this.state.Type,
            merchantPANCode: this.state.PANNumber.toUpperCase(),
            merchantYearlyRevenue: this.state.YearlyRevenue,
            industryName: this.state.Industry,
            categoryName: this.state.Category,
            industryId:
              this.state.industryIdIndustries != null
                ? this.state.industryIdIndustries
                : 0,
            categoryId:
              this.state.industryIdCategories != null
                ? this.state.industryIdCategories
                : 0,
          },
          true
        );

        this.setState(
          {
            tempImage: this.state.merchantCompanyImage,
          },
          () => {
            loading_service.hideLoading();
          }
        );
      } catch (error) {
        //alert(error);
        loading_service.hideLoading();
      }
    }
  };
  openImagePicker() {
    const options = {
      title: 'Select your option',
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    };

    if (getLocalSettingRow('device', 'EnableCamera') == 0) {
      //this.setState({openCameraModal:!this.state.openCameraModal})
      ImagePicker.launchImageLibrary(options, response => {
        if (response.didCancel) {
        } else if (response.error) {
          alert('Something went wrong with this option. Try again later.');
          console.log(response.error);
        } else if (response.customButton) {
          //alert('Custom button tapped : ' + response.customButton);
        } else {
          //alert(response.uri)
          this.setState({
            imagePath: response.uri,
            imageHeight: response.height,
            imageWidth: response.width,
            merchantCompanyImage: response.uri,
            upload: true,
          });
        }
      });
    } else {
      ImagePicker.showImagePicker(options, response => {
        if (response.didCancel) {
        } else if (response.error) {
          alert('Something went wrong with this option. Try again later.');
          console.log(response.error);
        } else if (response.customButton) {
          alert('Custom button tapped : ' + response.customButton);
        } else {
          //alert(response.uri)
          this.setState({
            imagePath: response.uri,
            imageHeight: response.height,
            imageWidth: response.width,
            merchantCompanyImage: response.uri,
            upload: true,
          });
        }
      });
    }
  }
  scrollToItem = ref => {
    ref.measureLayout(
      ReactNative.findNodeHandle(this.scrollRef),
      (x, y, width, height) => {
        console.log('HEIGHT', height);
        setTimeout(
          () =>
            this.scrollRef.scrollTo({
              x: 0,
              y: y - height,
              animated: true,
            }),
          200
        );
      }
    );
  };
  _textChange = (key, value) => {
    this.setState(
      {
        [key]: value,
      },
      () => {
        if (key == 'Type') {
          this.typeField._changeText(this.Type[value]);
          this.onBlur('');
        } else if (key == 'YearlyRevenue') {
          this.yearlyField._changeText(this.Yearly[value]);
          this.onBlur('');
        } else if (key == 'Industry') {
          this.industryField._changeText(value.industryName);
          let currentvalues = this.state.Industry;
          this.setState(
            {
              industryIdIndustries: value.industryId,
              Industry: value.industryName,
              categories: value.IndustryType,
              dropChange: true,
            },
            () => {
              if (currentvalues != this.state.Industry) {
                this.setState(
                  {
                    Category: '',
                    industryIdCategories: value.industryId,
                  },
                  () => {
                    this.onBlur('');
                  }
                );
              }
              this.onBlur('');
            }
          );
        } else if (key == 'Category') {
          this.categoryField._changeText(value.industryName);
          this.setState(
            {
              Category: value.industryName,
              industryIdCategories: value.industryId,
              dropChange: true,
            },
            () => {
              this.onBlur('');
            }
          );
        }
      }
    );
  };
  render() {
    // alert(JSON.stringify(this.state.modalPosition))
    const regexPanNumber = /^[a-zA-Z]{3}[abcfghljpteABCFGHLJPTE]{1}[a-zA-Z]{1}\d{4}[a-zA-Z0-9]{1}$/;

    let array =
      this.state.modalPosition != null
        ? this.state.modalPosition.cate == 'Type'
          ? this.Type
          : // this.state.modalPosition.cate=='Industry'?this.Industry:
          this.state.modalPosition.cate == 'Industry'
          ? this.state.industries
          : this.state.modalPosition.cate == 'Category'
          ? this.state.categories
          : this.state.modalPosition.cate == 'Yearly'
          ? this.Yearly
          : this.Yearly
        : this.Yearly;
    let keyTo =
      this.state.modalPosition != null
        ? this.state.modalPosition.cate == 'Type'
          ? 'Type'
          : this.state.modalPosition.cate == 'Industry'
          ? 'Industry'
          : this.state.modalPosition.cate == 'Category'
          ? 'Category'
          : this.state.modalPosition.cate == 'Yearly'
          ? 'YearlyRevenue'
          : 'Type'
        : 'Type';
    const bgImage = !isTablet
      ? require('../../../../assets/images/bg/loadingBackground.png')
      : require('../../../../assets/images/bg/loadingBackgroundLandscape.png');
    return (
      <View style={styles.container}>
        <Image
          style={{
            position: 'absolute',
            width: '100%',
            flex: 1,
            top: 0,
            left: 0,
            bottom: 0,
            right: 0,
          }}
          resizeMode="stretch"
          source={bgImage}
        />
        <KeyboardAvoidingView
          behavior="position"
          style={{ width: '100%', flex: 1 }}
          contentContainerStyle={{ flex: 1 }}
          keyboardVerticalOffset={this.state.offset}
        >
          <View
            style={{
              width: '100%',
              height: hp(isTablet ? '23%' : '25%'),
              backgroundColor: 'white',
              elevation: 7,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: 0.2,
              shadowRadius: 2,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <TouchableOpacity onPress={this.openImagePicker.bind(this)}>
              <ButtonCamera
                userImage={this.state.merchantCompanyImage}
                resizeMode="cover"
                borderRadius={hp('8%')}
                containerStyle={{
                  width: hp('15%'),
                  height: hp('15%'),
                  borderRadius: hp('8%'),
                  backgroundColor: 'rgba(0,0,0,0.2)',
                }}
                imageSize={'5'}
                onPress={this.openImagePicker.bind(this)}
                imageSource={
                  this.state.imagePath === '' ? null : this.state.imagePath
                }
                imageAtributes={{
                  height: this.state.imageHeight,
                  width: this.state.imageWidth,
                }}
              />
              <Image
                resizeMode="cover"
                source={require('../../assets/img/pencil.png')}
                style={{
                  width: hp('6%'),
                  position: 'absolute',
                  bottom: -hp('1%'),
                  height: hp('6%'),
                }}
              />
            </TouchableOpacity>
            <TextMontserrat
              style={{
                fontSize: hp('2.2%'),
                fontWeight: '700',
                textAlign: 'center',
                marginTop: hp('1%'),
              }}
            >
              {this.state.CompanyName}
            </TextMontserrat>
          </View>
          <ScrollView
            keyboardDismissMode="on-drag"
            ref={x => (this.scrollRef = x)}
            keyboardShouldPersistTaps="always"
            style={{
              flex: 1,
              marginTop: isTablet ? -hp('0.1%') : 0,
              width: '100%',
              //paddingHorizontal: wp(isTablet ? '3%' : '5%'),
            }}
          >
            <View
              style={{
                height: hp(isTablet ? '60%' : '53%'),
                width: '100%',
                justifyContent: 'space-around',
                alignItems: 'center',
              }}
            >
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'flex-end',
                  paddingHorizontal: wp(isTablet ? '3%' : '5%'),
                }}
              >
                <Image
                  source={this.ICONS.company}
                  style={{
                    width: hp('5%'),
                    height: hp('5%'),
                    marginRight: wp(isTablet ? '1%' : '3%'),
                  }}
                />
                <View
                  style={[
                    {},
                    styles.nameInputs,
                    {
                      flex: 1,
                    },
                    !isTablet ? { height: hp('7%') } : { height: hp('9%') },
                  ]}
                >
                  <FloatingTextInput
                    label={'Company Name'}
                    ref={x => (this.companyField = x)}
                    value={this.state.CompanyName}
                    inputRef={x => (this.companyText = x)}
                    onChangeText={val => {
                      this._textChange('CompanyName', val);
                    }}
                    onSubmitEditing={() => {
                      this.setState(
                        {
                          companyNameSelection:
                            Platform.OS === 'android'
                              ? { start: 0, end: 0 }
                              : null,
                        },
                        () => {
                          this.setState({ companyNameSelection: null });
                        }
                      );
                    }}
                    onFocus={() => {
                      this.setState({ companyNameSelection: null });

                      this.setState({
                        offset: isTablet ? -hp('15%') : -hp('2%'),
                      });
                      //if (isTablet) {
                      this.scrollRef.scrollTo({
                        x: 0,
                        y: 0,
                        animated: true,
                      });
                      //}

                      //this.onBlur('')
                    }}
                    onBlur={() =>
                      this.setState(
                        {
                          companyNameSelection:
                            Platform.OS == 'android'
                              ? { start: 0, end: 0 }
                              : null,
                        },
                        () =>
                          this.setState({
                            companyNameSelection: null,
                          })
                      )
                    }
                    selection={this.state.companyNameSelection}
                    onContentSizeChange={() =>
                      this.setState(
                        {
                          companyNameSelection:
                            Platform.OS == 'android'
                              ? { start: 0, end: 0 }
                              : null,
                        },
                        () =>
                          this.setState({
                            companyNameSelection: null,
                          })
                      )
                    }
                    /*onChangeText={val => this._textChange('Username', val)}
                onSubmitEditing={this._checkEmail.bind(this)}
                onBlur={this._checkEmail.bind(this)}
                errors={errors.Username || []}*/
                    autoCapitalize={'none'}
                    touched={true}
                    labelSizeUp={!isTablet ? hp('1.5%') : hp('2%')}
                    labelSizeDown={!isTablet ? hp('2%') : hp('2.3%')}
                    labelPlacingUp={!isTablet ? 0 : hp('2%')}
                    labelPlacingDown={!isTablet ? hp('3%') : hp('5%')}
                    inputContainerStyle={
                      !isTablet ? { height: hp('3%') } : { height: hp('7%') }
                    }
                    inputStyle={
                      !isTablet
                        ? {
                            width: '90%',
                            fontSize: hp('2%'),
                            height: hp('5%'),
                            marginTop: hp('2%'),
                            paddingBottom: 0,
                          }
                        : {
                            fontSize: hp('2.5%'),
                            height: hp('5%'),
                            marginTop: hp('4%'),
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
                    iconSize={!isTablet ? hp('2.7%') : hp('3%')}
                  />
                </View>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'flex-end',
                  paddingHorizontal: wp(isTablet ? '3%' : '5%'),
                }}
              >
                <Image
                  source={this.ICONS.type}
                  style={{
                    width: hp('5%'),
                    height: hp('5%'),
                    marginRight: wp(isTablet ? '1%' : '3%'),
                  }}
                />
                <TouchableOpacity
                  hitSlop={{ top: hp('1%'), bottom: hp('2%') }}
                  ref={ref => (this.typeButton = ref)}
                  onPress={() => {
                    this.typeButton.measureInWindow((x, y, width) => {
                      this.setState({
                        modalPosition: {
                          x: x,
                          y: y,
                          width: width,
                          cate: 'Type',
                        },
                      });
                    });
                  }}
                  style={[
                    {},
                    styles.nameInputs,
                    {
                      flex: 1,
                    },
                    !isTablet ? { height: hp('7%') } : { height: hp('9%') },
                  ]}
                >
                  <FloatingTextInput
                    ref={ref => (this.typeField = ref)}
                    disabled={true}
                    nocancel={true}
                    label={'Type'}
                    value={this.Type[this.state.Type]}
                    /*onChangeText={val => this._textChange('Username', val)}
                onSubmitEditing={this._checkEmail.bind(this)}
                onBlur={this._checkEmail.bind(this)}
                errors={errors.Username || []}*/
                    autoCapitalize={'none'}
                    touched={true}
                    labelSizeUp={!isTablet ? hp('1.5%') : hp('2%')}
                    labelSizeDown={!isTablet ? hp('2%') : hp('2.3%')}
                    labelPlacingUp={!isTablet ? 0 : hp('2%')}
                    labelPlacingDown={!isTablet ? hp('3%') : hp('5%')}
                    inputContainerStyle={
                      !isTablet ? { height: hp('3%') } : { height: hp('7%') }
                    }
                    touched={true}
                    inputStyle={
                      !isTablet
                        ? {
                            fontSize: hp('2%'),
                            height: hp('5%'),
                            marginTop: hp('2%'),
                            paddingBottom: 0,
                          }
                        : {
                            fontSize: hp('2.5%'),
                            height: hp('5%'),
                            marginTop: hp('4%'),
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
                    iconSize={!isTablet ? hp('2.7%') : hp('3%')}
                  />

                  <Image
                    source={require('../../assets/img/arrow.png')}
                    style={{
                      width: hp('1%'),
                      height: hp('1.9%'),
                      position: 'absolute',
                      right: hp('1.6%'),
                      bottom: !isTablet ? hp('1.2%') : hp('1.2%'),
                      transform: [{ rotate: '90deg' }],
                    }}
                  />
                </TouchableOpacity>
              </View>
              <View
                ref={x => (this.PANContainer = x)}
                style={{
                  flexDirection: 'row',
                  alignItems: 'flex-end',
                  paddingHorizontal: wp(isTablet ? '3%' : '5%'),
                }}
              >
                <Image
                  source={this.ICONS.pan}
                  style={{
                    width: hp('5%'),
                    height: hp('5%'),
                    marginRight: wp(isTablet ? '1%' : '3%'),
                  }}
                />
                <View
                  style={[
                    {},
                    styles.nameInputs,
                    {
                      flex: 1,
                    },
                    !isTablet ? { height: hp('7%') } : { height: hp('9%') },
                  ]}
                >
                  <FloatingTextInput
                    inputRef={input => {
                      this.panNumberInput = input;
                    }}
                    disabled={true}
                    maxLength={10}
                    label={'PAN Number'}
                    value={this.state.PANNumber}
                    autoCapitalize={'characters'}
                    onChangeText={val => {
                      // if(regexPanNumber.test(val)){
                      this._textChange('PANNumber', val);
                      // }
                    }}
                    onBlur={() => {
                      if (regexPanNumber.test(this.state.PANNumber)) {
                        this.onBlur('');
                      } else {
                        alert_service.showAlert(
                          'PAN number invalid.\nPlease make sure it follows this format:\nABCDE1234A',
                          () => {
                            this.setState({ PANNumber: '' });
                          }
                        );
                      }
                    }}
                    onFocus={() => {
                      //alert(1);
                      this.scrollToItem(this.PANContainer);
                    }}
                    maxLength={10}
                    /*onChangeText={val => this._textChange('Username', val)}
                onSubmitEditing={this._checkEmail.bind(this)}
                onBlur={this._checkEmail.bind(this)}
                errors={errors.Username || []}*/
                    autoCapitalize={'none'}
                    touched={true}
                    labelSizeUp={!isTablet ? hp('1.5%') : hp('2%')}
                    labelSizeDown={!isTablet ? hp('2%') : hp('2.3%')}
                    labelPlacingUp={!isTablet ? 0 : hp('2%')}
                    labelPlacingDown={!isTablet ? hp('3%') : hp('5%')}
                    inputContainerStyle={
                      !isTablet ? { height: hp('3%') } : { height: hp('7%') }
                    }
                    touched={true}
                    inputStyle={
                      !isTablet
                        ? {
                            fontSize: hp('2%'),
                            height: hp('5%'),
                            marginTop: hp('2%'),
                            paddingBottom: 0,
                          }
                        : {
                            fontSize: hp('2.5%'),
                            height: hp('5%'),
                            marginTop: hp('4%'),
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
                    iconSize={!isTablet ? hp('2.7%') : hp('3%')}
                  />
                </View>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'flex-end',
                  paddingHorizontal: wp(isTablet ? '3%' : '5%'),
                }}
              >
                <Image
                  source={this.ICONS.yearly}
                  style={{
                    width: hp('5%'),
                    height: hp('5%'),
                    marginRight: wp(isTablet ? '1%' : '3%'),
                  }}
                />
                <TouchableOpacity
                  hitSlop={{ top: hp('1%'), bottom: hp('2%') }}
                  ref={ref => (this.buttonYearly = ref)}
                  onPress={() => {
                    let prom = new Promise((resolve, reject) => {
                      Keyboard.dismiss();
                      resolve(true);
                    });
                    prom.then(res => {
                      if (res) {
                        setTimeout(() => {
                          this.buttonYearly.measureInWindow((x, y, width) => {
                            this.setState({
                              modalPosition: {
                                x: x,
                                y: y,
                                width: width,
                                cate: 'Yearly',
                              },
                            });
                          });
                        }, 2000);
                      }
                    });
                  }}
                  style={[
                    {},
                    styles.nameInputs,
                    {
                      flex: 1,
                    },
                    !isTablet ? { height: hp('7%') } : { height: hp('9%') },
                  ]}
                >
                  <FloatingTextInput
                    ref={ref => (this.yearlyField = ref)}
                    disabled={true}
                    nocancel={true}
                    label={'Yearly Revenue'}
                    value={this.Yearly[this.state.YearlyRevenue]}
                    /*onChangeText={val => this._textChange('Username', val)}
                onSubmitEditing={this._checkEmail.bind(this)}
                onBlur={this._checkEmail.bind(this)}
                errors={errors.Username || []}*/
                    autoCapitalize={'none'}
                    touched={true}
                    labelSizeUp={!isTablet ? hp('1.5%') : hp('2%')}
                    labelSizeDown={!isTablet ? hp('2%') : hp('2.3%')}
                    labelPlacingUp={!isTablet ? 0 : hp('2%')}
                    labelPlacingDown={!isTablet ? hp('3%') : hp('5%')}
                    inputContainerStyle={
                      !isTablet ? { height: hp('3%') } : { height: hp('7%') }
                    }
                    touched={true}
                    inputStyle={
                      !isTablet
                        ? {
                            fontSize: hp('2%'),
                            height: hp('5%'),
                            marginTop: hp('2%'),
                            paddingBottom: 0,
                          }
                        : {
                            fontSize: hp('2.5%'),
                            height: hp('5%'),
                            marginTop: hp('4%'),
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
                    iconSize={!isTablet ? hp('2.7%') : hp('3%')}
                  />

                  <Image
                    source={require('../../assets/img/arrow.png')}
                    style={{
                      width: hp('1%'),
                      height: hp('1.9%'),
                      position: 'absolute',
                      right: hp('1.6%'),
                      bottom: !isTablet ? hp('1.2%') : hp('1.2%'),
                      transform: [{ rotate: '90deg' }],
                    }}
                  />
                  <TouchableOpacity
                    onPress={() => {
                      let prom = new Promise((resolve, reject) => {
                        Keyboard.dismiss();
                        resolve(true);
                      });
                      prom.then(res => {
                        if (res) {
                          setTimeout(() => {
                            this.buttonYearly.measureInWindow((x, y, width) => {
                              this.setState({
                                modalPosition: {
                                  x: x,
                                  y: y,
                                  width: width,
                                  cate: 'Yearly',
                                },
                              });
                            });
                          }, 100);
                        }
                      });
                    }}
                    style={{
                      position: 'absolute',
                      width: '100%',
                      height: '100%',
                    }}
                  />
                </TouchableOpacity>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'flex-end',
                  paddingHorizontal: wp(isTablet ? '3%' : '5%'),
                }}
              >
                <Image
                  source={this.ICONS.industry}
                  style={{
                    width: hp('5%'),
                    height: hp('5%'),
                    marginRight: wp(isTablet ? '1%' : '3%'),
                  }}
                />
                <TouchableOpacity
                  hitSlop={{ top: hp('1%'), bottom: hp('2%') }}
                  ref={ref => (this.IndustryButton = ref)}
                  style={[
                    {},
                    styles.nameInputs,
                    {
                      flex: 1,
                    },
                    !isTablet ? { height: hp('7%') } : { height: hp('9%') },
                  ]}
                >
                  <FloatingTextInput
                    ref={ref => (this.industryField = ref)}
                    nocancel={true}
                    label={'Industry'}
                    value={this.state.Industry}
                    inputRef={input => {
                      this.industryFieldText = input;
                    }}
                    disabled={true}
                    /*onChangeText={val => this._textChange('Username', val)}
                onSubmitEditing={this._checkEmail.bind(this)}
                onBlur={this._checkEmail.bind(this)}
                errors={errors.Username || []}*/
                    onFocus={() =>
                      this.setState({
                        industrySelection:
                          Platform.OS == 'android'
                            ? { start: 0, end: 0 }
                            : null,
                      })
                    }
                    onBlur={() =>
                      this.setState({
                        industrySelection:
                          Platform.OS == 'android'
                            ? { start: 0, end: 0 }
                            : null,
                      })
                    }
                    onContentSizeChange={() => {
                      this.setState({
                        industrySelection:
                          Platform.OS == 'android'
                            ? { start: 0, end: 0 }
                            : null,
                      });
                    }}
                    onChangeText={() =>
                      this.setState({
                        industrySelection:
                          Platform.OS == 'android'
                            ? { start: 0, end: 0 }
                            : null,
                      })
                    }
                    selection={this.state.industrySelection}
                    autoCapitalize={'none'}
                    // touched={true}
                    labelSizeUp={!isTablet ? hp('1.5%') : hp('2%')}
                    labelSizeDown={!isTablet ? hp('2%') : hp('2.3%')}
                    labelPlacingUp={!isTablet ? 0 : hp('2%')}
                    labelPlacingDown={!isTablet ? hp('3%') : hp('5%')}
                    inputContainerStyle={
                      !isTablet ? { height: hp('3%') } : { height: hp('7%') }
                    }
                    touched={true}
                    inputStyle={
                      !isTablet
                        ? {
                            width: '90%',
                            fontSize: hp('2%'),
                            height: hp('5%'),
                            marginTop: hp('2%'),
                            paddingBottom: 0,
                          }
                        : {
                            fontSize: hp('2.5%'),
                            height: hp('5%'),
                            marginTop: hp('4%'),
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
                    iconSize={!isTablet ? hp('2.7%') : hp('3%')}
                  />

                  <Image
                    source={require('../../assets/img/arrow.png')}
                    style={{
                      width: hp('1%'),
                      height: hp('1.9%'),
                      position: 'absolute',
                      right: hp('1.6%'),
                      bottom: !isTablet ? hp('1.2%') : hp('1.2%'),
                      transform: [{ rotate: '90deg' }],
                    }}
                  />
                  <TouchableOpacity
                    onPress={() => {
                      let prom = new Promise((resolve, reject) => {
                        Keyboard.dismiss();
                        resolve(true);
                      });
                      prom.then(res => {
                        if (res) {
                          setTimeout(() => {
                            this.IndustryButton.measureInWindow(
                              (x, y, width) => {
                                this.setState({
                                  modalPosition: {
                                    x: x,
                                    y: y,
                                    width: width,
                                    cate: 'Industry',
                                  },
                                });
                              }
                            );
                          }, 100);
                        }
                      });
                    }}
                    style={{
                      position: 'absolute',
                      width: '100%',
                      height: '100%',
                    }}
                  />
                </TouchableOpacity>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'flex-end',
                  paddingHorizontal: wp(isTablet ? '3%' : '5%'),
                }}
              >
                <Image
                  source={this.ICONS.category}
                  style={{
                    width: hp('5%'),
                    height: hp('5%'),
                    marginRight: wp(isTablet ? '1%' : '3%'),
                  }}
                />
                <TouchableOpacity
                  hitSlop={{ top: hp('1%'), bottom: hp('2%') }}
                  ref={ref => (this.CategoryButton = ref)}
                  onPress={() => {
                    let prom = new Promise((resolve, reject) => {
                      Keyboard.dismiss();
                      resolve(true);
                    });
                    prom.then(res => {
                      if (res) {
                        setTimeout(() => {
                          this.CategoryButton.measureInWindow((x, y, width) => {
                            this.setState({
                              modalPosition: {
                                x: x,
                                y: y,
                                width: width,
                                cate: 'Category',
                              },
                            });
                          });
                        }, 200);
                      }
                    });
                  }}
                  style={[
                    {},
                    styles.nameInputs,
                    {
                      flex: 1,
                    },
                    !isTablet ? { height: hp('7%') } : { height: hp('9%') },
                  ]}
                >
                  <FloatingTextInput
                    ref={ref => (this.categoryField = ref)}
                    inputRef={input => {
                      this.categoryFieldText = input;
                    }}
                    disabled={true}
                    nocancel={true}
                    label={'Category'}
                    value={this.state.Category}
                    /*onChangeText={val => this._textChange('Username', val)}
                onSubmitEditing={this._checkEmail.bind(this)}
                onBlur={this._checkEmail.bind(this)}
                errors={errors.Username || []}*/
                    onFocus={() => this.setState({ categorySelection: null })}
                    onBlur={() =>
                      this.setState(
                        {
                          categorySelection:
                            Platform.OS == 'android'
                              ? { start: 0, end: 0 }
                              : null,
                        },
                        () =>
                          this.setState({
                            categorySelection: null,
                          })
                      )
                    }
                    selection={this.state.categorySelection}
                    onContentSizeChange={() =>
                      this.setState({
                        categorySelection:
                          Platform.OS == 'android'
                            ? { start: 0, end: 0 }
                            : null,
                      })
                    }
                    autoCapitalize={'none'}
                    touched={true}
                    labelSizeUp={!isTablet ? hp('1.5%') : hp('2%')}
                    labelSizeDown={!isTablet ? hp('2%') : hp('2.3%')}
                    labelPlacingUp={!isTablet ? 0 : hp('2%')}
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
                            fontSize: hp('2.5%'),
                            height: hp('5%'),
                            marginTop: hp('4%'),
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
                    iconSize={!isTablet ? hp('2.7%') : hp('3%')}
                  />

                  <Image
                    source={require('../../assets/img/arrow.png')}
                    style={{
                      width: hp('1%'),
                      height: hp('1.9%'),
                      position: 'absolute',
                      right: hp('1.6%'),
                      bottom: !isTablet ? hp('1.2%') : hp('1.2%'),
                      transform: [{ rotate: '90deg' }],
                    }}
                  />
                  <TouchableOpacity
                    onPress={() => {
                      let prom = new Promise((resolve, reject) => {
                        Keyboard.dismiss();
                        resolve(true);
                      });
                      prom.then(res => {
                        if (res) {
                          setTimeout(() => {
                            this.CategoryButton.measureInWindow(
                              (x, y, width) => {
                                this.setState({
                                  modalPosition: {
                                    x: x,
                                    y: y,
                                    width: width,
                                    cate: 'Category',
                                  },
                                });
                              }
                            );
                          }, 200);
                        }
                      });
                    }}
                    style={{
                      position: 'absolute',
                      width: '100%',
                      height: '100%',
                    }}
                  />
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>

          {/*this.state.device_settings
          .filter(i => i.active)
          .map((item, i) => {
            return (
              <SettingButton
                type="toggle"
                toggle={item.toggle.bind(this)}
                renderIcon={() => (
                  <Image
                    source={this.ICONS[item.settingParamName]}
                    style={{ width: hp('6.5%'), height: hp('6.5%') }}
                  />
                )}
                checked={item.value}
                key={i}
                title={item.label}
              />
            );
          })*/}
          <Modal
            visible={this.state.modalPosition != null}
            transparent={true}
            animationType="fade"
            onRequestClose={() => {
              this.setState({ modalPosition: null });
            }}
          >
            <TouchableOpacity
              onPress={() => {
                this.setState({ modalPosition: null });
              }}
              style={{
                height: '100%',
                width: '100%',
              }}
            />
            <View
              style={{
                width: '100%',
                alignItems: 'center',
                position: 'absolute',
              }}
            >
              {this.state.loadingForDropdown &&
              (keyTo == 'Industry' || keyTo == 'Category') ? (
                <View
                  style={{
                    height: hp('20%'),
                    backgroundColor: 'white',
                    position: 'absolute',
                    elevation: 2,
                    top:
                      this.state.modalPosition != null
                        ? this.state.modalPosition.y - hp('18%')
                        : 0,
                    left:
                      this.state.modalPosition != null
                        ? this.state.modalPosition.x
                        : 0,
                    width:
                      this.state.modalPosition != null
                        ? this.state.modalPosition.width - wp('2%')
                        : 0,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <ActivityIndicator size="small" color="#018201" />
                </View>
              ) : // IF CATEGORIES IS EMPTY
              array.length == 0 && keyTo == 'Category' ? (
                <View
                  style={{
                    height: hp('15%'),
                    backgroundColor: 'white',
                    position: 'absolute',
                    elevation: 2,
                    top:
                      this.state.modalPosition != null
                        ? this.state.modalPosition.y - hp('13%')
                        : 0,
                    left:
                      this.state.modalPosition != null
                        ? this.state.modalPosition.x
                        : 0,
                    width:
                      this.state.modalPosition != null
                        ? this.state.modalPosition.width - wp('2%')
                        : 0,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <TextMontserrat
                    style={{
                      color: '#52565F',
                      fontWeight: '500',
                      fontSize: this.state.orientation ? wp('3%') : hp('2.5%'),
                    }}
                  >
                    No items available. Please, select an Industry.
                  </TextMontserrat>
                </View>
              ) : (
                // SHOW ITEMS IN DROPDOWN
                <ScrollView
                  showsVerticalScrollIndicator={true}
                  style={{
                    position: 'absolute',
                    height: hp('20%'),
                    backgroundColor: 'white',
                    elevation: 2,
                    top:
                      this.state.modalPosition != null
                        ? this.state.modalPosition.y - hp('18%')
                        : 0,
                    left:
                      this.state.modalPosition != null
                        ? this.state.modalPosition.x
                        : 0,
                    width:
                      this.state.modalPosition != null
                        ? this.state.modalPosition.width - wp('2%')
                        : 0,
                  }}
                >
                  {array.map((item, index) => {
                    return (
                      <TouchableOpacity
                        onPress={() => {
                          if (
                            this.state.modalPosition.cate == 'Yearly' ||
                            this.state.modalPosition.cate == 'Type'
                          ) {
                            //alert(keyTo)
                            this._textChange(keyTo, index);
                          } else {
                            //alert(JSON.stringify(item))
                            this._textChange(keyTo, item);
                          }
                          this.setState({ modalPosition: null });
                        }}
                        style={{
                          paddingVertical: hp('0.5%'),
                          paddingHorizontal: wp('2%'),
                          justifyContent: 'center',
                          borderBottomColor: 'rgba(0,0,0,0.2)',
                          borderBottomWidth: 2,
                        }}
                      >
                        <TextMontserrat
                          style={{ fontSize: hp('1.8%'), fontWeight: '600' }}
                        >
                          {keyTo != 'Industry' && keyTo != 'Category'
                            ? item
                            : keyTo == 'Industry'
                            ? item.industryName
                                .replace('\r', '')
                                .replace('\n', '')
                            : item.industryName
                                .replace('\r', '')
                                .replace('\n', '')}
                        </TextMontserrat>
                      </TouchableOpacity>
                    );
                  })}
                </ScrollView>
              )}
            </View>
          </Modal>
        </KeyboardAvoidingView>
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
const mapStateToProps = state => ({
  config:
    state.cashData.personalConfig != null
      ? state.cashData.personalConfig.merchant
      : null,
  user:
    state.cashData.personalConfig != null
      ? state.cashData.personalConfig.user
      : null,
});
const mapDispatchToProps = dispatch => ({
  set_personalconfig: val => {
    return dispatch({ type: cashConstants.SET_PERSONALCONFIG, payload: val });
  },
});
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MyAccountBusiness);
