import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
  TouchableOpacity,
  AsyncStorage,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  NetInfo,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import colors from '../../styles/colors';
import { isTablet } from '../../constants/isLandscape';
import { CardWithHeader } from '../cards';
import * as UserServices from 'services/user_service';
import realm from '../../../../services/realm_service';
import { epaisaRequest } from '../../../../services/epaisa_service';
import Highlighter from 'react-native-highlight-words';

class ModalFind extends Component {
  state = {
    values: this.props.values,
    valuesResults: [],
    searchStr: '',
    cardheight: 0,
    containerheight: 0,
    auth_key: '',
    loadingCustomers: false,
    user: {},
    isConnected: true,
    customersDB: [],
  };

  async UNSAFE_componentWillMount() {
    const connected = await NetInfo.isConnected.fetch();
    this.setState({isConnected: connected});
  }

  componentDidMount() {
    const user = realm.objectForPrimaryKey('User', 0);
    this.setState({ user });

    const customersDB = Array.from(realm.objects('CustomerAPI'));
    this.setState({ customersDB });
    
    if(realm.isInTransaction){
      realm.cancelTransaction();
    }
  }

  find_dimesions(layout) {
    const { x, y, width, height } = layout;
    alert(height);
  }

  searchCountry = value => {
    console.log('Searching String', value);
    this.setState(
      { loadingCustomers: value.length >= 3 ? true : false, searchStr: value },
      ()=>{
        this.state.isConnected ? 
        this.customersFromApi(value) : 
        this.customersFromDB(value)
      }
    );

    // SEARCH FOR USER'S OWN CUSTOMERS
    // this.setState({searchStr:value});
    // let filterValues = [];
    // if(value !== '') {
    //     filterValues = this.state.values.filter((item) => item.identity.toLowerCase().indexOf(value.toString().toLowerCase()) === -1 ? false : true)
    // }
    // this.setState({valuesResults: filterValues.slice(0,5)})
  };

  customersFromApi = async (value) => {
    if (value.length >= 3) {
      try {            
        const res = await epaisaRequest(
          {
            merchantId: this.state.user.merchantId,
            filter: value,
            otpIsNull: true,
          }, 
          '/customer', 
          'GET'
        );

        if (res.success === 1) {
          const customers = res.response.Customer;
          console.log(customers);
          const result = this.removeDuplicates(customers, 'customerId');
          const resultIdentity = result.map(item => {
            return {
              customerId: item.customerId+'',
              identity:
                item.firstName.toUpperCase() +
                ' ' +
                item.lastName.toUpperCase() +
                '/' +
                item.phoneNumber,
              points: item.rewardPoints != null ? item.rewardPoints : 0,
            };
          });

          this.setState({
            loadingCustomers: false,
            valuesResults: resultIdentity.slice(0, 5),
          });
        } else {
          this.setState({ loadingCustomers: false, valuesResults: [] });
        }
      } catch (error) {
        this.setState({ loadingCustomers: false, valuesResults: [] });
        alert('An error occurred.');
      }
    }
  }

  customersFromDB = (value) => {
    if(value.length >= 3) {
      const result = this.state.customersDB.filter(item => 
                                                    item.firstName.concat(' ',item.lastName).toLowerCase().includes(value[0]=='+'?value.substr(1).toLowerCase():value.toLowerCase()) || 
                                                    item.phoneNumber.includes(value[0]=='+'?value.substr(1):value) ||
                                                    item.email.toLowerCase().includes(value[0]=='+'?value.substr(1).toLowerCase():value.toLowerCase()));

      if (result.length > 0) {
        //const result = this.removeDuplicates(customers, 'customerId');
        const resultIdentity = result.map(item => {
          return {
            customerId: item.customerId+'',
            identity:
              item.firstName.toUpperCase() +
              ' ' +
              item.lastName.toUpperCase() +
              '/' +
              item.phoneNumber,
            points: item.rewardPoints != null ? item.rewardPoints : 0,
          };
        });

        this.setState({
          loadingCustomers: false,
          valuesResults: resultIdentity.slice(0, 5),
        });
      } else {
        this.setState({ loadingCustomers: false, valuesResults: [] });
      }
    }
  }

  removeDuplicates = (myArr, prop) => {
    return myArr.filter((obj, pos, arr) => {
      return arr.map(mapObj => mapObj[prop]).indexOf(obj[prop]) === pos;
    });
  };

  renderResultsBox = () => {
    const isLandscape = isTablet;
    const letterFontSize = !isLandscape ? wp('2.7%') : hp('2%');
    const numberFontSize = !isLandscape ? wp('2.3%') : hp('1.6%');

    let value = this.state.searchStr;
    const { addCustomer, closeModal } = this.props;
    if (this.state.loadingCustomers) {
      return (
        <TouchableOpacity
          onPress={() => {}}
          style={[
            styles.itemBox,
            {
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
            },
          ]}
        >
          <ActivityIndicator size="small" color="#018201" />
        </TouchableOpacity>
      );
    } else if (this.state.valuesResults.length > 0 && this.state.searchStr.length >= 3) {
      return this.state.valuesResults.map((item, i) => {
        let index = item.identity
          .toLowerCase()
          .indexOf(value.toString().toLowerCase());
        let valLen = value.length;
        let name = item.identity.substring(0, item.identity.indexOf('/'));
        let nameLen = name.length;
        let number = item.identity.substring(
          item.identity.indexOf('/') + 1,
          item.identity.length
        );
        let numberLen = number.length;
        const nameMatch = (
          <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1, }}>
            <Highlighter
              style={[
                styles.labelNameCustomer,
                { fontSize: letterFontSize, flex: 1 },
              ]}
              highlightStyle={{backgroundColor: '#5AC8FA'}}
              searchWords={[this.state.searchStr]}
              textToHighlight={name}
              numberOfLines={1}
            />
            {/* <Text
              numberOfLines={1} 
              style={[styles.labelNameCustomer, { fontSize: letterFontSize, flex: 1, }]}
            >
              {name.slice(0, index)}
            </Text> */}
            {/* <Text
              style={[
                { backgroundColor: '#5AC8FA', paddingVertical: hp('0.35%') },
                styles.labelNameCustomer,
                { fontSize: letterFontSize },
              ]}
            >
              {name.slice(index, index + valLen)}
            </Text>
            <Text
              style={[styles.labelNameCustomer, { fontSize: letterFontSize }]}
            >
              {name.slice(index + valLen, nameLen)}
            </Text> */}
          </View>
        );
        // alert(name.slice(0, index)  +  name.slice(index, index + valLen)  +  name.slice(index + valLen, nameLen))
        const numberMatch = (
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text
              style={[styles.labelNumberCustomer, { fontSize: numberFontSize }]}
            >
              {number.slice(0, index - 1 - nameLen)}
            </Text>
            <Text
              style={[
                { backgroundColor: '#5AC8FA', paddingVertical: hp('0.3%') },
                styles.labelNumberCustomer,
                { fontSize: numberFontSize },
              ]}
            >
              {number.slice(index - 1 - nameLen, index + valLen - 1 - nameLen)}
            </Text>
            <Text
              style={[styles.labelNumberCustomer, { fontSize: numberFontSize }]}
            >
              {number.slice(index - 1 - nameLen + valLen, numberLen)}
            </Text>
          </View>
        );
        return (
          <TouchableOpacity
            onPress={() => {
              this.setState({ searchStr: '' });
              const customer = {
                name: name,
                number: number,
                points: item.points,
                customerId: item.customerId,
              };
              if (this.props.fromHoldTap) {
                this.props.holdWithCustomer(customer);
              } else {
                this.props.addCustomer(customer);
              }
              closeModal();

              // addCustomer();
              // this.props.actionFromHold();
            }}
            style={[
              styles.itemBox,
              { flexDirection: 'row', alignItems: 'center' },
              i > 0
                ? {width:'100%', borderTopWidth: 1, borderColor: 'rgba(108,123,138,0.08)' }
                : null,
            ]}
            key={i}
          >
            {index < nameLen ? (
              nameMatch
            ) : (
              <Text
                style={[styles.labelNameCustomer, { fontSize: letterFontSize }]}
              >
                {name}
              </Text>
            )}
            <Text
              style={[styles.labelNameCustomer, { fontSize: letterFontSize }]}
            >
              /
            </Text>
            {index > nameLen ? (
              numberMatch
            ) : (
              <Text
                style={[
                  styles.labelNumberCustomer,
                  { fontSize: numberFontSize },
                ]}
              >
                {number}
              </Text>
            )}
          </TouchableOpacity>
        );
      });
    } else if (
      this.state.valuesResults.length === 0 &&
      this.state.searchStr.length >= 3
    ) {
      return this.state.isConnected ? 
      (
        <TouchableOpacity
          onPress={() => this.props.navNextModal(value)}
          style={[
            styles.itemBox,
            { flexDirection: 'row', alignItems: 'center' },
          ]}
        >
          <Text
            style={[styles.labelNameCustomer, { fontSize: letterFontSize }]}
          >
            + ADD A NEW CUSTOMER
          </Text>
        </TouchableOpacity>
      ) : 
      (
        <View
          style={[
            styles.itemBox,
            { flexDirection: 'row', alignItems: 'center' },
          ]}
        >
          <Text
            style={[styles.labelNameCustomer, { fontSize: letterFontSize }]}
          >
            NOT FOUND
          </Text>
        </View>
      );
    }
  };

  render() {
    const { widthModal, closeModal } = this.props;
    const isLandscape = isTablet;
    if(Platform.OS=="ios"){
      return (
        <View
          onLayout={event => {
            this.setState({ containerheight: event.nativeEvent.layout.height });
          }}
          style={styles.container}
        >
  
        <KeyboardAvoidingView behavior="padding">
          <View
            onLayout={event => {
              this.setState({ cardheight: event.nativeEvent.layout.height });
            }}
            style={{ alignItems: 'center', justifyContent: 'center', flex: 1 }}
          >
          
            <CardWithHeader
              isLandscape={isLandscape}
              sizeHeaderLabel={!isLandscape ? wp('4.5%') : hp('3.5%')}
              onPressCloseButton={closeModal}
              customBodyStyle={{ alignItems: 'center', justifyContent: 'center' }}
              customHeaderStyle={{
                height: !isLandscape ? hp('6.8%') : hp('8.4%'),
              }}
              headerTitle="Customer Information"
              closeButton={true}
              customCardStyle={{
                width: !isLandscape ? wp('86.9%') : wp('45.8%'),
                height: !isLandscape ? hp('20.3%') : hp('25.3%'),
              }}
            >
              <View style={styles.wrapper}>
                <View
                  style={[
                    styles.fieldBox,
                    {
                      height: !isLandscape ? hp('6.25%') : hp('7.8%'),
                      width: !isLandscape ? wp('75.8%') : wp('39.9%'),
                      marginTop: !isLandscape ? hp('2.25%') : hp('3%'),
                    },
                  ]}
                >
                  <Image
                    source={require('../../assets/icons/rectangleLarge.png')}
                    resizeMethod="scale"
                    resizeMode="stretch"
                    style={{
                      height: !isLandscape ? hp('6.25%') : hp('7.8%'),
                      width: !isLandscape ? wp('75.8%') : wp('39.9%'),
                    }}
                  />
                  <TextInput
                    placeholderTextColor="#808080"
                    onChangeText={s => {
                      this.searchCountry(s);
                    }}
                    onKeyPress={({ nativeEvent }) => {
                      if (nativeEvent.key === 'Backspace' && this.state.searchStr < 3) {
                        this.setState({valuesResults: []})
                      }
                    }}
                    placeholder={'Name | No. | Email search'}
                    style={[
                      styles.field,
                      {
                        position: 'absolute',
                        fontSize: !isLandscape ? wp('3.2%') : hp('2.5%'),
                        left: 0,
                        width: !isLandscape ? wp('67%') : wp('35.6%'),
                      },
                    ]}
                  />
                  <Image
                    source={require('../../assets/icons/Shape.png')}
                    style={
                      !isLandscape
                        ? {
                            position: 'absolute',
                            right: wp('2.5%'),
                            height: hp('2.5%'),
                            width: hp('2.5%'),
                          }
                        : {
                            position: 'absolute',
                            right: wp('1%'),
                            height: hp('3%'),
                            width: hp('3%'),
                          }
                    }
                  />
                </View>
              </View>
            </CardWithHeader>
            {this.state.searchStr != '' ? (
              <View
                style={[
                  styles.helpBox,
                  {
                    top:
                      this.state.cardheight / 2 +
                      (!isLandscape ? hp('5.15%') : hp('6.5%')),
                    width: !isLandscape ? wp('75.8%') : wp('39.9%'),
                  },
                ]}
              >
                {this.renderResultsBox()}
              </View>
            ) : null}
            
          </View>
          </KeyboardAvoidingView>
        </View>
      );
    }else{
      return (
        <View
          onLayout={event => {
            this.setState({ containerheight: event.nativeEvent.layout.height });
          }}
          style={styles.container}
        >
  
        
          <View
            onLayout={event => {
              this.setState({ cardheight: event.nativeEvent.layout.height });
            }}
            style={{ alignItems: 'center', justifyContent: 'center', flex: 1 }}
          >
          
            <CardWithHeader
              isLandscape={isLandscape}
              sizeHeaderLabel={!isLandscape ? wp('4.5%') : hp('3.5%')}
              onPressCloseButton={closeModal}
              customBodyStyle={{ alignItems: 'center', justifyContent: 'center' }}
              customHeaderStyle={{
                height: !isLandscape ? hp('6.8%') : hp('8.4%'),
              }}
              headerTitle="Customer Information"
              closeButton={true}
              customCardStyle={{
                width: !isLandscape ? wp('86.9%') : wp('45.8%'),
                height: !isLandscape ? hp('20.3%') : hp('25.3%'),
              }}
            >
              <View style={styles.wrapper}>
                <View
                  style={[
                    styles.fieldBox,
                    {
                      height: !isLandscape ? hp('6.25%') : hp('7.8%'),
                      width: !isLandscape ? wp('75.8%') : wp('39.9%'),
                      marginTop: !isLandscape ? hp('2.25%') : hp('3%'),
                    },
                  ]}
                >
                  <Image
                    source={require('../../assets/icons/rectangleLarge.png')}
                    resizeMethod="scale"
                    resizeMode="stretch"
                    style={{
                      height: !isLandscape ? hp('6.25%') : hp('7.8%'),
                      width: !isLandscape ? wp('75.8%') : wp('39.9%'),
                    }}
                  />
                  <TextInput
                    placeholderTextColor="#808080"
                    onChangeText={s => {
                      this.searchCountry(s);
                    }}
                    onKeyPress={({ nativeEvent }) => {
                      if (nativeEvent.key === 'Backspace' && this.state.searchStr < 3) {
                        this.setState({valuesResults: []})
                      }
                    }}
                    keyboardType={Platform.OS === 'android' ? 'email-address' : 'ascii-capable'}
                    placeholder={'Name | No. | Email search'}
                    style={[
                      styles.field,
                      {
                        position: 'absolute',
                        fontSize: !isLandscape ? wp('3.2%') : hp('2.5%'),
                        left: 0,
                        width: !isLandscape ? wp('67%') : wp('35.6%'),
                      },
                    ]}
                  />
                  <Image
                    source={require('../../assets/icons/Shape.png')}
                    style={
                      !isLandscape
                        ? {
                            position: 'absolute',
                            right: wp('2.5%'),
                            height: hp('2.5%'),
                            width: hp('2.5%'),
                          }
                        : {
                            position: 'absolute',
                            right: wp('1%'),
                            height: hp('3%'),
                            width: hp('3%'),
                          }
                    }
                  />
                </View>
              </View>
            </CardWithHeader>
            {this.state.searchStr != '' ? (
              <View
                style={[
                  styles.helpBox,
                  {
                    top:
                      this.state.cardheight / 2 +
                      (!isLandscape ? hp('5.15%') : hp('6.5%')),
                    width: !isLandscape ? wp('75.8%') : wp('39.9%'),
                  },
                ]}
              >
                {this.renderResultsBox()}
              </View>
            ) : null}
            
          </View>
          
        </View>
      );
    }
    
  }
}

// define your styles
const styles = StyleSheet.create({
  container: {
    width: '100%',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.opacityDin(0.6),
  },
  wrapper: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    //marginTop: hp('2.0%'),
    //marginBottom: hp('4.0%'),
  },
  fieldBox: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  field: {
    fontSize: hp('1.7%'),
    paddingLeft: hp('1.3%'),
    paddingVertical: 0,
    fontFamily: "Montserrat-SemiBold",
    marginTop: hp('0.3%'),
    color: '#52565F',
    fontWeight: 'normal',
  },
  helpBox: {
    position: 'absolute',
    backgroundColor: colors.white,
    elevation: 10,
    borderRadius: 10,
    zIndex: 1,
    //top:hp("5.3%"),
    transform: [{ translate: [0, 0, 4] }],
  },
  labelNameCustomer: {
    fontFamily: 'Montserrat-Bold',
    fontSize: hp('1.38%'),
    letterSpacing: hp('0.2%'),
  },
  labelNumberCustomer: {
    fontFamily: 'Montserrat-Bold',
    fontSize: hp('1.32%'),
    letterSpacing: hp('0.1%'),
  },
  itemBox: {
    paddingHorizontal: hp('3%'),
    paddingVertical: hp('2%'),
  },
});

export default ModalFind;
