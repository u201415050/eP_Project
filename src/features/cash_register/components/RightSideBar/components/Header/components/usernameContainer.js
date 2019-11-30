import React, { Component } from 'react';
import {
  Dimensions,
  View,
  Text,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
  Image,
  TextInput,
  AsyncStorage,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { TextMontserrat } from 'components';
import { connect } from 'react-redux';
import { cashActions } from '../../../../../actions';
import {
  getLocalSettingRow,
} from 'services/settings_service';

const isPortrait = () => {
  const dim = Dimensions.get('window');
  if (dim.height >= dim.width) {
    return true;
  } else {
    return false;
  }
};

class UsernameContainer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isPortrait: isPortrait(),
      customerName: this.props.customer || 'Customer',
      showRoundOff: '0',
    };
  }

  async componentDidMount() {
    // 1 = show, 0 = hide
    await AsyncStorage.getItem(`@showRoundOffOn`)
          .then(item => { 
            if(item != null)
              this.setState({
                showRoundOff: item
              })
          })
  }

  processName = value => {
    if (value.name) {
      return value.name;
      //return value.firstName+ " "+value.lastName
      //return 'new user added';
    } else {
      name = value.name;
      result = '';
      //name.map(str=>result+=(" "+str.charAt(0).toUpperCase()+ str.slice(1).toLowerCase()))
      return name;
    } //result.slice(1);}
  };

  _handleText = newValue => {
    this.setState({ customerName: newValue });
  };

  render() {
    const { customer, toggleModal,temporaly } = this.props;
    //const NAME_PLACEHOLDER = 'Customer';
//alert(getLocalSettingRow('Transaction', 'RoundOff'))
    return (
      <View style={styles.container}>
        <View style={styles.usernameBox}>
          <View
            style={[
              styles.shadowBox,
              customer ? { height: hp('7%') } : { height: hp('4.8%') },
            ]}
          />

          <TouchableOpacity
            disabled={temporaly} onPress={toggleModal} 
            style={[
              styles.borderBox,
              customer ? { height: hp('7%') } : { height: hp('4.8%') },
            ]}
          >
            <Text
              numberOfLines={1}
              style={[
                styles.defaultText,
                {
                  paddingVertical:customer?hp('0'):hp('0.40%'),
                  paddingRight: wp('2%'),
                  fontSize: customer ? hp('2.2%') : hp('2%'),
                },
              ]}
            >
              {customer ? this.processName(customer) : this.props.customerNumber}
            </Text>
            {customer && (
              <Text
                numberOfLines={1}
                style={[
                  styles.defaultText,
                  {
                    fontFamily: 'Montserrat-SemiBold',
                    fontSize: hp('1.9%'),
                  },
                ]}
              >
                {customer.number}
              </Text>
            )}
          </TouchableOpacity>
          {
            (getLocalSettingRow('Transaction', 'RoundOff') == true ||
              getLocalSettingRow('Transaction', 'RoundOff') == 1) &&
            <View style={{flex: 1, justifyContent: 'center'}}>
              <TextMontserrat style={{color:'#fff', fontWeight:'600', fontSize: this.state.isPortrait ? wp('3.2%') : hp('2%')}}>
                Round-off ON
              </TextMontserrat>
            </View>
          }
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    height: hp('13.6%'),
    width: '50%',
    backgroundColor: '#5D6770',
  },
  usernameBox: {
    height: '100%',
    paddingLeft: hp('1.9%'),
    paddingTop: hp('2.6%'),
  },
  shadowBox: {
    height: hp('7%'),
    width: '96%',
    backgroundColor: '#000000',
    flexDirection: 'column',
    position: 'absolute',
    top: hp('3%'),
    left: hp('1.8%'),
    borderRadius: hp('1.4%'),
    opacity: 0.15,
  },
  borderBox: {
    height: hp('7%'),
    justifyContent:'center',
    backgroundColor: '#5D6770',
    flexDirection: 'column',
    borderWidth: hp('0.14%'),
    borderRadius: hp('1.4%'),
  },
  defaultText: {
    width: '100%',
    paddingLeft: hp('1%'),
    fontFamily: 'Montserrat-Bold',
    color: 'white',
  },
});

const mapStateToProps = state => {
  return {
    cashData: state.cashData.customerName,
  };
};

/*function add_customer_name(value) {
  return { type: cashConstants.ADD_CUSTOMER_NAME, payload: value };
}
function edit_customer_name(value) {
  return { type: cashConstants.EDIT_CUSTOMER_NAME, payload: value };
}
function get_customer_name(value) {
  return { type: cashConstants.GET_CUSTOMER_NAME, payload: value };
}*/

const mapDispatchToProps = dispatch => ({
  add_customer_name: name => {
    dispatch(cashActions.add_customer_name(name));
  },
  edit_customer_name: name => {
    dispatch(cashActions.edit_customer_name(name));
  },
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(UsernameContainer);

//export default UsernameContainer;
