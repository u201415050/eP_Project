import React, { Component } from 'react';
import {
  Text,
  View,
  Image,
  Dimensions,
  TouchableOpacity,
  Modal,
  StyleSheet,
  ScrollView,
  ART
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import * as d3 from 'd3'

import { connect } from 'react-redux';
import colors from '../../../modal_delivery/styles/colors';
import { isTablet } from '../../../fingerprint/constants/isLandscape';
import {TextMontserrat} from 'components'
import PieChart from 'react-native-pie-chart';
const { Surface, Group, Shape } = ART
class TopProducts extends Component {
  state = {
    showOptions: false,
    modalDiscount: false,
    modalDelivery: false,
  };
  
  render() {
    const periodButton = ()=>{
      return(
        <TouchableOpacity 
        style={{position:'absolute',borderColor: '#174285',alignItems: 'center',justifyContent:'space-between',
        paddingHorizontal:wp('2%'),paddingVertical:wp('1.5%'),borderRadius:wp('2%'), borderWidth: 3, right:wp('4.5%'),top:wp('2%'), flexDirection:'row'}}>
          <TextMontserrat
          style={{paddingRight: wp('3.5%'), color:'#174285', fontSize:wp('3.5%'), fontWeight:'900', opacity:0.9, letterSpacing:wp('0.2%')}}
          >Week</TextMontserrat>
          <Image resizeMode="stretch" style={{tintColor:'#174285', height:wp('2.6%'), width:wp('3.1%')}} source={require('../../assets/img/arrow_show_more.png')}/>
        </TouchableOpacity>
      )
    }
    const chart_wh = wp('50%')
    const series = [27,40, 12,  21]
    const sliceColor = ['#1B4D9B','#ED212F', '#2EBD41','#F8D680']

    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TextMontserrat
          style={{color:'#222222', fontSize:wp('5.8%'),opacity:0.9, fontWeight:'700'}}
          >Top Products</TextMontserrat>
          <TextMontserrat
          style={{color:'#222222', fontSize:wp('3%'),opacity:0.6, fontWeight:'500', letterSpacing:wp('0.3%')}}
          >This week, 14-21 Feb</TextMontserrat>
          {periodButton()}
        </View>
        
          <View style={{transform:[{ rotate:`0deg`}],marginTop:hp('3%')}}>
            <PieChart
              chart_wh={chart_wh}
              series={series}
              sliceColor={sliceColor}
              doughnut={true}
              coverRadius={0.7}
              coverFill={colors.darkWhite}
            />
          </View>
    </View>
    );
  }
}
const styles = StyleSheet.create({
    container: {
      width: '95%',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: colors.darkWhite,
      borderRadius: 10,
      marginTop: hp('2%'),
      elevation:10,
      paddingVertical:hp('4%')
    },
    comExtra:{
      fontSize:wp('3.3%'),
      opacity:0.5,
      color:'#222222',
      fontWeight:'800',
      letterSpacing:wp('0.4%'),
      marginTop:-hp('1%')
    },
    ruppeSign:{
      fontSize:wp('7%'),
      opacity:0.8,
      color:'#222222',
      marginTop:wp('4%')
    },
    valueInteger:{
      fontSize:wp('20%'),
      color:'#222222',
      fontWeight:'200',
      marginLeft: wp('2%'),
    },
    valueDecimal:{
      fontSize:wp('6.6%'),
      color:'#222222',
      opacity:0.7,
      fontWeight:'600',
      marginTop:wp('7%'),
      letterSpacing:wp('0.4%')
    },
    header:{
      width:'100%',
      paddingHorizontal: wp('5%'),
    },
    
    bolTextCompany:{
      fontSize:wp('5%'),
      fontWeight: '800',
      color:'#455A64',
    },
    bolValues:{
      fontSize:wp('3.5%'),
      fontWeight: '500',
      color:'#737A92',
    },
    indicators:{
      width:'100%',
      flexDirection: 'row',
      justifyContent:'space-between',
      marginTop:hp('2%'),
      paddingHorizontal: wp('3%'),
    }
});
const mapStateToProps = state => ({
});

const dispatchActionsToProps = dispatch => ({
  
});
export default connect(
  mapStateToProps,
  dispatchActionsToProps
)(TopProducts);
