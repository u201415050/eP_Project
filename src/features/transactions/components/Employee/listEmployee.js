import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  ScrollView,
  Image,
  TouchableOpacity,
  Modal,
} from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { TextMontserrat } from 'components';
import { isTablet } from '../../../left_sidebar/constants/isLandscape';
import colors from '../../../saved_transactions/styles/colors';
//import DropdownMenu from 'react-native-dropdown-menu';

export default class ListEmployee extends Component {
  constructor(props) {
    super(props);
    this.state = {
      text: [],
      dropdown: false,
      posy: 0,
      posx: 0,
      data: props.employees.map(item => {
        return { ...item, active: props.filter.includes(item.id) };
      }),
      listCategories: props.filter,
    };
    this.updateData = () => {
      props.addEmployeeFilter(this.state.listCategories);
    };
  }

  toggleBut = index => {
    let element = this.state.data.map((item, i) => {
      if (index != i) {
        return item;
      } else {
        return { ...item, active: !item.active };
      }
    });
    this.setState({ data: element }, () => {
      if (this.state.data[index].active) {
        this.setState({
          listCategories: [
            ...this.state.listCategories,
            this.state.data[index].id,
          ],
        });
      } else {
        let place = this.state.listCategories.indexOf(
          this.state.data[index].id
        );
        let newArray = this.state.listCategories;
        newArray.splice(place, 1);
        this.setState({ listCategories: newArray });
      }
    });
  };
  componentDidMount() {
    this.setState({
      data: this.props.employees.map(item => {
        return { ...item, active: this.props.filter.includes(item.id) };
      }),
      listCategories: this.props.filter,
    });
  }
  componentWillUnmount() {
    // this.props.addEmployeeFilter(this.state.listCategories);
  }
  render() {
    const isLandscape = isTablet;
    return (
      <View
        style={[
          styles.container,
          isLandscape ? { paddingHorizontal: 0 } : null,
        ]}
      >
        <View style={{ width: '100%', marginBottom: hp('2%') }}>
          <View
            style={{
              paddingLeft: wp(1.8),
              width: '100%',
              marginBottom: hp('2%'),
            }}
          >
            <TextMontserrat style={styles.title}>EMPLOYEE</TextMontserrat>
          </View>
        </View>
        <TouchableOpacity
          disabled={this.props.userData.roleId == 2}
          ref={ref => (this.drop = ref)}
          onPress={() => {
            this.drop.measureInWindow((x, y, width, height) => {
              this.setState({ posy: y, posx: x });
              this.setState({ dropdown: true });
            });
          }}
          style={{
            width: isTablet ? wp('45%') : wp('85%'),
            paddingHorizontal: wp('2%'),
            height: hp('5%'),
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: 'white',
            elevation: 3,
            shadowOffset: { width: 2, height: 2 },
            shadowColor: 'grey',
            shadowOpacity: 0.5,
            shadowRadius: 3,
          }}
        >
          <TextMontserrat
            style={{
              fontSize: hp('1.55%'),
              fontWeight: '800',
              color: colors.gray,
            }}
          >
            Select Employee
          </TextMontserrat>
          <Image
            source={require('../../assets/img/arrow_down.png')}
            resizeMode="stretch"
            style={{
              transform: [{ rotate: this.state.dropdown ? '0deg' : '-90deg' }],
              position: 'absolute',
              right: wp('2.2%'),
              opacity: 0.7,
              height: hp('1.3%'),
              width: hp('2.5%'),
              tintColor: 'black',
            }}
          />
        </TouchableOpacity>
        <Modal
          transparent={true}
          visible={this.state.dropdown}
          onRequestClose={() => {
            this.setState({ dropdown: false });
          }}
        >
          <View style={{ flex: 1, width: '100%', alignItems: 'center' }}>
            <TouchableOpacity
              onPress={() => {
                this.setState({ dropdown: false });
              }}
              style={{
                position: 'absolute',
                top: 0,
                width: '100%',
                height: '100%',
              }}
            />
            <ScrollView
              keyboardShouldPersistTaps="always"
              showsVerticalScrollIndicator={false}
              style={[
                {
                  elevation: 3,
                  shadowOffset: {
                    width: 5,
                    height: 4,
                  },
                  borderWidth: 0.5,
                  borderColor: 'rgba(0,0,0,0.2)',
                  shadowRadius: 10,
                  shadowColor: 'black',
                  shadowOpacity: 1,
                  width: isTablet ? wp('45%') : wp('85%'),
                  height:
                    (this.state.data.filter(x => x.roleName == 'Merchant User')
                      .length > 4
                      ? 4
                      : this.state.data.filter(
                          x => x.roleName == 'Merchant User'
                        ).length) * hp('5%'),
                  backgroundColor: 'white',
                  position: 'absolute',
                  zIndex: 5,
                  top:
                    this.state.posy -
                    (this.state.data.filter(x => x.roleName == 'Merchant User')
                      .length > 4
                      ? 4
                      : this.state.data.filter(
                          x => x.roleName == 'Merchant User'
                        ).length) *
                      hp('5%'),
                },
                isTablet ? { left: this.state.posx } : null,
              ]}
            >
              {this.state.data.map((item, i) => {
                if (item.roleName == 'Merchant User') {
                  // alert(JSON.stringify(this.state.data));
                  return (
                    <TouchableOpacity
                      onPress={() => this.toggleBut(i)}
                      key={i}
                      style={{
                        flexDirection: 'row',
                        width: '100%',
                        height: hp('5%'),
                        alignItems: 'center',
                        borderBottomColor: 'rgba(0,0,0,0.2)',
                        borderBottomWidth: 0.2,
                      }}
                    >
                      {
                        <Image
                          source={require('../../assets/img/checkS.png')}
                          style={{
                            marginLeft: wp('3%'),
                            tintColor: item.active ? '#174285' : 'white',
                            borderColor: item.active
                              ? '#174285'
                              : 'rgba(0,0,0,0.6)',
                            borderWidth: 2,
                            borderRadius: hp('0.3%'),
                            width: hp('2.6%'),
                            height: hp('2.6%'),
                          }}
                        />
                      }
                      <TextMontserrat
                        style={{
                          fontSize: hp('1.4%'),
                          marginLeft: wp('3%'),
                          fontWeight: '600',
                        }}
                      >
                        {item.userFullName}
                      </TextMontserrat>
                    </TouchableOpacity>
                  );
                }
              })}
            </ScrollView>
          </View>
        </Modal>
        {/*<View style={{marginTop:hp('6%'),width:'95%',height:50}}>
      
    <DropdownMenu
          style={{flex: 1}}
          // arrowImg={}      
          // checkImage={}   
          // optionTextStyle={{color: '#333333'}}
          // titleStyle={{color: '#333333'}} 
          // maxHeight={300} 
          handler={(selection, row) => this.setState({text: [...this.state.text, data[selection][row]] })}
          data={data}
        >
         <View style={{flex: 1}}>
            <Text>
              {this.state.text} is selected
            </Text>
          </View>
     </DropdownMenu>
      </View>*/}
      </View>
    );
  }
}

const styles = EStyleSheet.create({
  container: {
    width: '100%',
    flexDirection: 'column',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginTop: hp('2%'),
    marginBottom: hp('2'),
    //elevation:0
    //zIndex:1
  },
  title: {
    color: colors.slateGray,
    fontSize: hp('1.8%'),
    fontWeight: '600',
    letterSpacing: 1.2,
  },
});
