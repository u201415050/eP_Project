import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, Image, Dimensions, Modal,TouchableOpacity} from 'react-native';
import colors from '../../styles/colors'
import EStyleSheet from 'react-native-extended-stylesheet';
import ListOptions from './components/ListOptions/listOptions';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import { isTablet } from '../../constants/isLandscape';
export default class SideBar extends Component{
    
    render() {
        const {active,toggle, sideOption, handleOption}=this.props
        const isLandscape= isTablet
        const paddingLandscape = isLandscape? {paddingHorizontal: wp('3%')}:null
        return (
                <View style={styles.container}>
                    <View style={[styles.barContainer, paddingLandscape]}>
                        <View style={styles.header}>
                            <Image source={require('../../assets/img/coffeelogo.png')} style={{height: hp('7%'),width:hp('7%'), marginBottom: hp('1%')}}/>
                            <Text style={styles.headerTextTop}>Espresso Café</Text>
                            <Text style={styles.headerTextBottom}>Abheer Kaushik</Text>
                        </View>
                        <ListOptions sideOption={sideOption} handleOption={handleOption}/>
                        <View style={styles.iconContainer}>
                            <Image source={require('../../assets/img/BT.png')} resizeMode="contain" style={{height: '100%',width:'6%'}}/>
                            <Image source={require('../../assets/img/Velo.png')} resizeMode="contain" style={{height: '100%',width:'12%'}}/>
                            <Image source={require('../../assets/img/Exit.png')} resizeMode="contain" style={{height: '100%',width:'13%'}}/>
                        </View>    
                    </View>
                </View>
        );
    }
}

const styles = EStyleSheet.create({
  container: {
    flex:1,
    width: '100%',
    backgroundColor: colors.opacityDin(0.5),
    alignItems: 'flex-end'
  },
  barContainer: {
    flex:1,
    width: '100%',
    backgroundColor: colors.lightBlack,
    paddingHorizontal: wp('8%'),
    elevation: 200
  },
  barOptions:{
    flex:1,
  },
  header:{
    width:'100%',
    marginTop: '18%',
    marginBottom: '16%'
  },
  headerTextTop:{
   color: colors.white,
   fontFamily:'Montserrat-Bold',
   fontSize:hp('2.6%'),
  },
  headerTextBottom:{
    color: colors.white,
    fontFamily:'Montserrat-SemiBold',
    fontSize:hp('2.3%'),
   },
  iconItem:{
    height:'100%',
    justifyContent:'center',
    marginHorizontal: 8,
  },
  iconContainer:{
    flexDirection: 'row',
    height:'8%',
    alignItems: 'center',
    justifyContent:'space-between',
    marginTop: 15,
    marginBottom: 2,
  },
  '@media (min-width: 200) and (max-width: 400)': { // media queries
    /*headerTextTop:{
        fontSize:14
    },
    headerTextBottom:{
        fontSize:13
    },*/
    barContainer:{
        paddingHorizontal: 22,
    }
  }
});
