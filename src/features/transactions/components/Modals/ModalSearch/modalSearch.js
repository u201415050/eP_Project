
import React, { Component } from 'react';
import { Dimensions,View, Text, StyleSheet, ImageBackground,TouchableOpacity,Image, Modal} from 'react-native';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import colors from '../../../styles/colors';
import EStyleSheet from 'react-native-extended-stylesheet';
import { isTablet } from '../../../constants/isLandscape';
import { SearchBar } from 'react-native-elements'

export default class ModalSearch extends Component {
   
  onChange = (val) => {
    this.setState({
      searchTerm: val
    }, () => {
      this.props.onSearchChange(val)
    })
  }
      
    render() {
        const {closeModal} = this.props
        const isLandscape= isTablet
        return(
            <TouchableOpacity style={styles.container} onPress={closeModal}>
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
            </TouchableOpacity>
        )
    }
}

// define your styles
const styles = StyleSheet.create({
    container:{
        position: "absolute",
        justifyContent:'center',
        padding: hp('0.6%'),
        top:hp('0%'),
        right:hp('0'),
        backgroundColor:'transparent',
        elevation: 3,
        height:hp('10%'),
        borderRadius: 3,
        borderColor: colors.opacityDin(0.2),
        borderWidth: 0.2,
    },
    rowOption:{
        flexDirection:'row',
        alignItems: 'center',
        paddingHorizontal: 5,
        paddingVertical: 4,

    },
    icon:{
        height:hp('4.6%'),
        width:hp('4.6%'),
    },
    label:{
        color: colors.lightBlack,
        fontWeight: '400',
        paddingHorizontal: 6,
        
        fontSize: hp('2%'),
    }
});

