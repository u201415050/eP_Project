import React, {Component} from 'react';
import { Platform, StyleSheet, Text, View,TextInput, Image, Dimensions, TouchableOpacity, TouchableHighlight } from 'react-native';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import colors from '../../styles/colors'
import EStyleSheet from 'react-native-extended-stylesheet';
import { isTablet } from '../../constants/isLandscape';
import { SearchBar } from 'react-native-elements'
import BackgroundImage from '../../../notifications/components/RightSideBar/components/BackgroundImage/backgroundImage';

export default class SearchHeader extends Component{

  onChange = (val) => {
    this.setState({
      searchTerm: val
    }, () => {
      this.props.onSearchChange(val)
    })
  }

  render() {
    const {closeSearch}=this.props
    const isLandscape= isTablet
    return (
      <View style={styles.container}>
        
     
        { !isLandscape?


          <SearchBar
            inputContainerStyle={{borderWidth:0}}
            containerStyle={{marginTop:hp('1'),backgroundColor: colors.darkBlue, borderWidth: 0, borderColor: colors.darkBlue,elevation:0,width:wp('98')}}
            inputStyle={{backgroundColor:'white',borderRadius:5}}
            clearIcon={{ color: 'gray'}}
            onChangeText={this.onChange}
            placeholder='Search by Invoice No/ Customer Name' />


          :
          <SearchBar
          inputContainerStyle={{borderWidth:0}}
          containerStyle={{marginTop:hp('1'),backgroundColor: colors.darkBlue, borderWidth: 0, borderColor: colors.darkBlue,elevation:0,width:wp('65')}}
          inputStyle={{backgroundColor:'white',borderRadius:5}}
          clearIcon={{ color: 'gray'}}
          onChangeText={this.onChange}
          placeholder='Search by Invoice No/ customer Name' />
          }
        
      </View>
    );
  }
}

const styles = EStyleSheet.create({
  container: {
    position: "absolute",
    width: '100%',
    justifyContent: 'center',
    height:hp('10%'),
    alignItems:'center',
    backgroundColor: colors.darkBlue,
    paddingHorizontal: 22,
    elevation:0
  },

  iconLeft:{
    position: 'absolute',
    height: '100%',
    left:20,
    color: colors.white,
    fontSize: 17,
    fontWeight: '700',
    justifyContent: 'center',

  },
  badge:{
    position: 'absolute',
    right:-hp('0.6%'),
    top:-hp('0.6%'),
    backgroundColor: colors.gray,
    alignItems:'center',
    justifyContent:'center',
    borderRadius: 20,
    paddingHorizontal: hp('0.5'),
  },
  badgeText:{
    color: colors.white,
    fontSize:9,
    fontFamily: 'Montserrat-Bold'
  },
  stack:{
    position: 'absolute',
    left: '27%',
    top: '5%',
    alignItems:'center',
    justifyContent:'center',
    
  },
  stackText:{
    color: colors.white,
    fontSize:13,
    fontFamily:'Montserrat-Bold',

  },
  iconRight:{
    flexDirection: 'row',
    position: 'absolute',
    height:'100%',
    right:hp('2.4%'),
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  iconItem:{
    height:'100%',
    justifyContent:'center',
    marginHorizontal: hp('0.3%'),
    alignItems:'center'
  },
  marginExtra:{
    marginLeft: 12,
  },
  iconContainer:{
    flexDirection: 'row',
    height:'100%',
    justifyContent:'space-between'
  },
  titleCentral:{
    color: colors.white,
    fontSize: hp('2.5%'),
    letterSpacing: 2,
    textAlign:'center',
    fontFamily:'Montserrat-Bold',

  },
  '@media (min-width: 200) and (max-width: 400)': { // media queries
    badge:{
      right:-hp('1.3%'),
      top:-hp('1.3%'),
    },
  }

});
