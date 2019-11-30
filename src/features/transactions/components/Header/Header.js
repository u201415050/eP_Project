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
  AsyncStorage,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

import EStyleSheet from 'react-native-extended-stylesheet';

import { connect } from 'react-redux';
import { isTablet } from '../../../fingerprint/constants/isLandscape';
import colors from '../../../account_created/styles/colors';
import ModalTransaction from '../Modals/ModalTransaction/modalTransaction';


const isPortrait = () => {
  const dim = Dimensions.get('window');
  if (dim.height >= dim.width) {
    return true;
  } else {
    return false;
  }
};

class Header extends Component {
  state = {
    modalTransaction:false,
    coord:{x:10,y:10}
  };
  toggleRightDrawer = () => {
    this.props.navigation.toggleRightDrawer();
  };
  toggleLeftDrawer = () => {
    console.log('click');

    this.props.navigation.toggleLeftDrawer();
  };
  componentDidMount(){
    setTimeout(()=>{
      this.button.measureInWindow((x,y)=>{
      this.setState({coord:{x:x,y:y}})

      //this.props.toggle(x,y)
    })
    },1000)

  }
  toggleOptions = () => {
    this.setState({
      showOptions: !this.state.showOptions,
    });
  };

  toggleModalDiscount = () => {
    this.setState({
      showOptions: false,
      modalDiscount: !this.state.modalDiscount,
    });
  };

  toggleModalDelivery = () => {
    this.setState({
      showOptions: false,
      modalDelivery: !this.state.modalDelivery,
    });
  };
  render() {
    const isLandscape = isTablet;
    const {userData,employees,coord,active,closeModal, label, total,openSearch,limits,setMin,setMax,addStatusFilter,toggleFilters,handleFilter,addEmployeeFilter,filter,modifyLimits,addPayFilter,offFilters } = this.props;
    const transactions = 0;
    return (
      <View>
        <View style={styles.container}>
          <TouchableOpacity
            style={[styles.iconLeft, { paddingRight: hp('2%') }]}
            onPress={this.toggleLeftDrawer}
          >
            <Image
              source={require('../../assets/img/sidelist.png')}
              style={{ width: hp('4%'), height: hp('3%') }}

            />
          </TouchableOpacity>
          <Text
            style={[
              styles.titleCentral,
              isLandscape
                ? {}
                : {
                    textAlign: 'right',
                    paddingRight: wp('10%'),
                    flex: 1,
                    fontSize: wp('4%'),
                  },
            ]}
          >
            {label}
          </Text>

            <View style={styles.iconRight}>
              <TouchableOpacity

                onPress={()=>{

                  this.setState({modalTransaction:true})//this.props.openFilter()
                  }
                }
                style={[
                  styles.iconItem,
                  {
                    width: hp('2.5%'),
                    height: '100%',
                    marginRight: isTablet?wp('2%'):wp('4.5%'),
                  },
                ]}
              >
                {/* {/ <TransactionsIcon number={6} /> /} */}
                <Image
                  ref={ref=> this.button=ref}
                  source={require('../../assets/img/setti.png')}
                  style={{ width: hp('2.5%'), height: hp('2.5%') }}
                />

              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.iconItem,
                  {
                    //marginRight:wp('4%'),
                    width: hp('3.5%'),
                    height: hp('3.5%'),
                    marginRight: isTablet?0:wp('2.5%'),
                  },
                ]}
                onPress={()=>{
                  openSearch()
                }}
              >
                <Image
                  source={require('../../assets/img/Shape.png')}
                  style={[{tintColor:'white', width: hp('2.5%'), height: hp('2.5%') }]}
                />
              </TouchableOpacity>

            </View>

        </View>
        <ModalTransaction
        userData={userData}
        limits={limits}
        setMin={setMin}
        setMax={setMax}
        addStatusFilter={addStatusFilter}
        toggleFilters={toggleFilters}
        handleFilter={handleFilter}
        addEmployeeFilter={addEmployeeFilter}
        filter={filter}
        modifyLimits={modifyLimits}
        offFilters={this.props.clear}
        addPayFilter={addPayFilter}
        employees={employees}
        coord={this.state.coord} widthModal="50%"
        active={this.state.modalTransaction}
        closeModal={()=>{
          this.setState({modalTransaction:false})
          //this.props.closeFilterModal()
          }}/>
      </View>
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
    paddingLeft: isPortrait() ? wp('3.5%') : wp('2.6%'),
    paddingRight: isPortrait() ? wp('2.5%') : wp('1%'),
    elevation: 10,
    zIndex: 10,
    flexDirection: 'row',

  },
  iconLeft: {
    //position: 'absolute',
    height: '100%',
    //left: 20,
    color: colors.white,
    fontSize: 17,
    fontWeight: '700',
    justifyContent: 'center',
  },
  badge: {
    position: 'absolute',
    left: hp('3.5%') - hp('0.5') - hp('0.1'),
    bottom: hp('2.9%'),
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
    //position: 'absolute',
    height: '100%',
    //right: 0,
    alignItems: 'center',
    //justifyContent: 'space-between',
  },
  iconItem: {
    height: '100%',
    justifyContent: 'center',
    //marginHorizontal: hp('0.3%'),
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
    fontFamily: 'Montserrat-Bold',
  },
  '@media (min-width: 200) and (max-width: 400)': {
    // media queries
    badge: {},
  },
});
const mapStateToProps = state => ({
});

const dispatchActionsToProps = dispatch => ({

});
export default connect(
  mapStateToProps,
  dispatchActionsToProps
)(Header);
