import React, { Component, Fragment } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  TextInput,
  Image,
  SectionList,
  TouchableWithoutFeedback,
  ScrollView,
  Platform,
  SafeAreaView,
} from 'react-native';
import Modal from 'react-native-modal';
import { Colors } from 'api';
import Icon from 'react-native-vector-icons/FontAwesome';
import { FloatingTextInput } from './index';
import { CountryItem } from './components';
import sectionListGetItemLayout from 'react-native-section-list-get-item-layout';
import flags from './api/flags';
import { countries } from './api/countries';
import { letterIndexes, sections } from './api/sections';
import { get_user_country } from '../../services/user_service';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import { isTablet } from '../../features/left_sidebar/constants/isLandscape';
import colors from '../../features/settings/styles/colors';

const isPortrait = () => {
  const dim = Dimensions.get('window');
  if (dim.height >= dim.width) {
    return true;
  } else {
    return false;
  }
};

class PhoneInput extends Component {
  state = {
    touched: false,
    isModalVisible: false,
    letterIndexes: {},
    phone: this.props.value || '',
    countries: [],
    sections: [],
    dataToShow: [],
    selectedCountry: {
      flag: 'https://www.countryflags.io/af/flat/64.png',
      callingCodes: [this.props.CallingCode || '93'],
      name: 'Afghanistan',
      alpha2Code: this.props.CountryCode || 'AF',
    },
    orientation: isPortrait(),
  };

  componentDidMount() {
    get_user_country().then(x => {
      this.setState({
        selectedCountry: {
          flag: x.location.country_flag,
          callingCodes: [this.props.CallingCode || x.location.calling_code],
          name: this.props.CountryName || x.country_name,
          alpha2Code: this.props.CountryCode || x.country_code,
        },
      });
    });

    this.setState({
      sections: sections,
      countries: countries,
      dataToShow: sections,
      letterIndexes,
      //phone: this.props.value || ''
    });
    // alert("Second "+this.props.value)
  }

  getItemLayout = sectionListGetItemLayout({
    // The height of the row with rowData at the given sectionIndex and rowIndex
    getItemHeight: () => 36,
    getSeparatorHeight: () => 12,
  });

  getLettersArr = () => {
    const letters = [];
    const { letterIndexes } = this.state;

    for (let key in letterIndexes) {
      letters.push(letterIndexes[key]);
    }
    return letters;
  };

  handleSearch = term => {
    let matchedItemsArray = [];
    if (term === '') {
      this.setState({
        term: '',
        search: false,
        dataToShow: this.state.sections,
      });
    } else {
      this.state.countries.map(item => {
        if (item.name.toLowerCase().includes(term.toLowerCase())) {
          matchedItemsArray.push(item);
        }
      });
      this.setState({
        term,
        search: true,
        dataToShow: [
          {
            title: `Results for "${term}"`,
            data: matchedItemsArray,
          },
        ],
      });
    }
  };
  selectJustCountryCodeByCode = value => {
    //alert(value)
    //alert(JSON.stringify(this.state.countries))
    this.state.countries.map(item => {
      if (item.alpha2Code == value) {
        this.setState({
          selectedCountry: item,
          touched: true,
        });
      }
    });
  };
  selectCountryCodeByCode = value => {
    //alert(value)
    //alert(JSON.stringify(this.state.countries))
    this.state.countries.map(item => {
      if (item.alpha2Code == value) {
        this.setState(
          {
            selectedCountry: item,
            touched: true,
          },
          () => {
            this.onChange({
              alpha2Code: item.alpha2Code,
              callingCode: item.callingCodes[0],
              phone: this.state.phone,
            });
            //this._toggleModal();
          }
        );
      }
    });
  };
  _toggleModal = () => {
    if (!this.props.disabled) {
      this.setState({ isModalVisible: !this.state.isModalVisible });
      this.setState({
        term: '',
        search: false,
        dataToShow: this.state.sections,
      });
    }
  };

  _selectCountryCode = item => {
    this.setState(
      {
        selectedCountry: item,
        touched: true,
      },
      () => {
        this.onChange({
          alpha2Code: item.alpha2Code,
          callingCode: item.callingCodes[0],
          phone: this.state.phone,
        });
        this._toggleModal();
      }
    );
  };

  _changeText = (v, extra) => {
    if (/^\d+$/.test(v) || v === '') {
      this.setState({ phone: v }, () => {
        this.onChange({
          alpha2Code: this.state.selectedCountry.alpha2Code,
          callingCode: this.state.selectedCountry.callingCodes[0],
          phone: v,
        });
      });
      if (extra) {
        //alert(JSON.stringify(extra))
        this.selectCountryCodeByCode(extra);
      }
    }
  };

  onChange = payload => {
    if (this.props.onChange) {
      this.props.onChange(payload);
    }
  };

  render() {
    const { callingCodes, flag, name, alpha2Code } = this.state.selectedCountry;
    const { label } = this.props;
    const { phone } = this.state;
    console.log(phone);
    const text = label || 'Mobile';
    const {
      modalContainer,
      modalHeader,
      countryCodeContainer,
      modalHeaderText,
      modalCloseButton,
    } = styles;
    return (
      <View>
        <View style={{ flexDirection: 'row' }}>
          {this.props.restyleComp ? (
            <FloatingTextInput
              onBlur={this.props.onBlur}
              onTextClear={this.props.onTextClear}
              ref={this.props.inputRef}
              label={text}
              touched={this.props.touched}
              newSeparatorStyle={true}
              phone={true}
              keyboardType="numeric"
              returnKeyType={'done'}
              value={phone}
              onlyNumbers
              onChangeText={this._changeText}
              focus={this.state.touched}
              maxLength={10}
              disabled={this.props.nonEditable}
              //topper={-5}

              labelSizeUp={this.state.orientation ? hp('1.8%') : hp('2.2%')}
              labelSizeDown={this.state.orientation ? hp('1.7%') : hp('2.3%')}
              labelPlacingUp={0}
              labelPlacingDown={this.state.orientation ? hp('4%') : hp('4%')}
              inputContainerStyle={
                this.state.orientation
                  ? { height: hp('8%') }
                  : { height: hp('10%') }
              }
              inputStyle={
                this.state.orientation
                  ? {
                      borderLeftWidth: 0,
                      fontSize: hp('2.1%'),
                      height: hp('5%'),
                      marginTop: hp('3%'),
                      paddingBottom: 0,
                      fontFamily: 'Montserrat-SemiBold',
                    }
                  : {
                      borderLeftWidth: 0,
                      fontSize: hp('2.7%'),
                      height: hp('6.9%'),
                      marginTop: hp('3%'),
                      marginLeft: 0,
                      paddingBottom: 0,
                      fontFamily: 'Montserrat-SemiBold',
                    }
              }
              underlineStyle={
                this.state.orientation
                  ? { height: hp('0.4%') }
                  : { height: hp('0.4%') }
              }
              //iconStyle={{bottom: hp('0.1%'), zIndex: 0,}}
              iconSize={this.state.orientation ? hp('3%') : hp('3.8%')}
              {...this.props}
            >
              <TouchableOpacity
                onPress={this.props.nonEditable ? () => {} : this._toggleModal}
                style={{
                  width: this.state.orientation ? wp('23%') : wp('10.5%'),
                }}
              >
                <View style={[countryCodeContainer, { height: hp('3.2%') }]}>
                  <View
                    style={{
                      // top: 1,
                      marginRight: this.state.orientation
                        ? wp('1%')
                        : wp('0.5%'),
                    }}
                  >
                    <Image
                      source={flags[alpha2Code]}
                      style={{
                        ...(this.props.restyleComp
                          ? this.state.orientation
                            ? { width: wp('7%'), height: hp('3.6%') }
                            : {
                                width: wp(
                                  this.props.personal ? '2.7%' : '3.4%'
                                ),
                                height: hp(
                                  this.props.personal ? '2.43%' : '2.95%'
                                ),
                              }
                          : { width: 30, height: 25 }),
                        bottom: this.props.restyleComp
                          ? this.state.orientation
                            ? this.props.personal
                              ? hp('0.1%')
                              : 0
                            : this.props.personal
                            ? -hp('0.5%')
                            : 0
                          : 2,
                      }}
                    />
                  </View>
                  <View>
                    <Text
                      style={{
                        fontSize: this.props.restyleComp
                          ? this.state.orientation
                            ? hp(this.props.personal ? '1.9%' : '2.1%')
                            : hp(this.props.personal ? '2.5%' : '2.7%')
                          : 17,

                        fontFamily: 'Montserrat-SemiBold',
                        fontWeight: 'normal',
                        color: '#6b6b6b',
                        textAlign: 'center',
                        bottom: this.props.restyleComp
                          ? this.state.orientation
                            ? this.props.personal
                              ? hp('0.1%')
                              : 0
                            : this.props.personal
                            ? -hp('0.5%')
                            : 0
                          : 2,
                      }}
                    >{`+${callingCodes[0]}`}</Text>
                  </View>

                  {/*<View>
                    <Icon name={'angle-down'} size={25} />
                  </View>*/}
                </View>
              </TouchableOpacity>
            </FloatingTextInput>
          ) : (
            <FloatingTextInput
              ref={this.props.inputRef}
              label={text}
              phone={true}
              keyboardType="numeric"
              value={phone}
              touched={this.props.touched}
              onlyNumbers
              onChangeText={this._changeText}
              focus={this.state.touched}
              maxLength={10}
              topper={-5}
              inputStyle={{ fontSize: hp('2%') }}
              {...this.props}
            >
              <TouchableOpacity
                style={{ height: hp('3.5%') }}
                onPress={this._toggleModal}
              >
                <View style={countryCodeContainer}>
                  <View>
                    <Image
                      source={flags[alpha2Code]}
                      style={{ width: (hp('4%') * 30) / 25, height: hp('4%') }}
                    />
                  </View>
                  <View style={{ paddingHorizontal: wp('2%') }}>
                    <Text
                      style={{
                        fontSize: hp('2%'),
                        fontWeight: 'bold',
                        color: '#6b6b6b',
                      }}
                    >{`+${callingCodes[0]}`}</Text>
                  </View>

                  {/*<View>
                    <Icon name={'angle-down'} size={25} />
                  </View>*/}
                </View>
              </TouchableOpacity>
            </FloatingTextInput>
          )}
        </View>

        <Modal
          isVisible={this.state.isModalVisible}
          style={{ margin: 0 }}
          //swipe={150}
          //swipeDirection={'down'}
          //onSwipe={this._toggleModal}
          onRequestClose={() => this._toggleModal()}
        >
          <Fragment>
            <SafeAreaView
              style={{ flex: 0, backgroundColor: Colors.primary }}
            />
            <SafeAreaView
              style={{
                flex: 1,
                backgroundColor:
                  Platform.OS === 'ios' && isTablet
                    ? 'rgba(0,0,0,0.4)'
                    : colors.darkGray,
              }}
            >
              <View style={modalContainer}>
                <View style={modalHeader}>
                  <View
                    style={{
                      flexDirection: 'row',
                      width: '100%',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                  >
                    <View
                      style={{
                        marginVertical: width > 400 ? 25 : 15,
                        width: '100%',
                        alignItems: 'center',
                      }}
                    >
                      <Text
                        style={[
                          modalHeaderText,
                          this.state.orientation
                            ? {
                                fontSize: wp('5.5%'),
                                width: '100%',
                                textAlign: 'center',
                              }
                            : {
                                fontSize: hp('3.7%'),
                                width: '100%',
                                textAlign: 'center',
                              },
                        ]}
                      >
                        Select Country/region code
                      </Text>
                      <TouchableOpacity
                        style={{
                          right: wp(isTablet ? '1%' : '4%'),
                          position: 'absolute',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                        onPress={this._toggleModal}
                      >
                        <Icon
                          name={'close'}
                          size={width > 400 ? 30 : 24}
                          color={'white'}
                        />
                      </TouchableOpacity>
                    </View>
                  </View>

                  <View
                    style={{
                      width: '94%',
                      backgroundColor: 'white',
                      marginBottom: 25,
                      borderRadius: 12,
                      flexDirection: 'row',
                    }}
                  >
                    <View
                      style={{
                        width: 60,
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}
                    >
                      <Icon name={'search'} size={25} color={Colors.primary} />
                    </View>
                    <View
                      style={{
                        flex: 1,
                      }}
                    >
                      <TextInput
                        placeholderTextColor={Colors.primary}
                        placeholder="Search..."
                        style={{
                          fontSize: 20,
                          marginVertical:
                            Platform.OS == 'ios' && isTablet ? hp('1%') : 0,
                          paddingVertical: 10,
                        }}
                        value={this.state.term}
                        onChangeText={term => this.handleSearch(term)}
                      />
                    </View>
                    <TouchableOpacity
                      onPress={() => {
                        this.setState({
                          term: '',
                          search: false,
                          dataToShow: this.state.sections,
                        });
                      }}
                      style={{
                        width: 60,
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}
                    >
                      <Icon name={'close'} size={20} color={Colors.primary} />
                    </TouchableOpacity>
                  </View>
                </View>
                <View
                  style={{
                    marginTop: 20,
                    marginLeft: 20,
                    flex: 1,
                    marginBottom: 48,
                  }}
                >
                  <CountryItem
                    flag={flag}
                    selected={true}
                    alpha2Code={alpha2Code}
                    name={name}
                    callingCode={callingCodes[0]}
                  />
                  <View
                    style={{
                      flexDirection: 'row',
                    }}
                  >
                    <SectionList
                      keyboardShouldPersistTaps="handled"
                      ref={component => (this.myFlatList = component)}
                      sections={this.state.dataToShow}
                      keyExtractor={(item, index) => `${item.name}_${index}`}
                      getItemLayout={this.getItemLayout}
                      renderSectionHeader={({ section: { title } }) => (
                        <Text
                          style={{
                            fontSize: 18,
                            fontWeight: 'bold',
                            color: '#aaaaaa',
                          }}
                        >
                          {title}
                        </Text>
                      )}
                      renderItem={({
                        item,
                        item: { flag, name, callingCodes, alpha2Code },
                      }) => (
                        <CountryItem
                          flag={flag}
                          name={name}
                          alpha2Code={alpha2Code}
                          callingCode={callingCodes[0]}
                          onPress={() => this._selectCountryCode(item)}
                        />
                      )}
                      // getItemLayout={this.getItemLayout}
                    />
                    <ScrollView
                      style={{
                        position: 'absolute',
                        right: 0,
                        paddingHorizontal: 10,
                        width: 35,
                        flex: 1,
                        backgroundColor: 'white',
                      }}
                    >
                      {this.getLettersArr().map(({ letter, index }) => (
                        <TouchableWithoutFeedback
                          key={`letter_${letter}_${index}`}
                          onPress={() => {
                            this.myFlatList.scrollToLocation({
                              itemIndex: 0,
                              sectionIndex: index,
                            });
                          }}
                        >
                          <Text
                            style={{
                              fontSize: 12.5,
                              fontWeight: 'bold',
                              color: Colors.primary,
                            }}
                          >
                            {letter}
                          </Text>
                        </TouchableWithoutFeedback>
                      ))}
                    </ScrollView>
                  </View>
                </View>
              </View>
            </SafeAreaView>
          </Fragment>
        </Modal>
      </View>
    );
  }
}

const width = Dimensions.get('window').width;

const styles = {
  modalContainer: {
    flex: 1,
    backgroundColor: 'white',
  },
  modalHeader: {
    width: '100%',
    backgroundColor: Colors.primary,
    alignItems: 'center',
    position: 'relative',
    elevation: 8,
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowColor: 'grey',
    shadowOpacity: 1,
  },
  modalCloseButton: {
    position: 'absolute',
    right: 0,
    top: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalHeaderText: {
    color: 'white',
    fontSize: width > 400 ? 24 : 18,
    fontWeight: 'bold',
  },
  countryCodeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
};

export default PhoneInput;
