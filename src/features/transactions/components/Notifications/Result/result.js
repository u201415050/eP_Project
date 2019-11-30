import React, {Component} from 'react';
import { Text, View, FlatList, Image, TouchableOpacity,ScrollView } from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import { TextMontserrat } from 'components';

import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import { isTablet } from '../../../constants/isLandscape';
import colors from '../../../styles/colors'
import BackgroundImage from './../../RightSideBar/components/BackgroundImage/backgroundImage';
import Swipeout from 'react-native-swipeout';


export default class Result extends Component{
  constructor(props){
   super()
        this.state={
         activeRowKey: null,
         enable:true,
         data:this.props.data,
        };
  }
  setScrollEnabled(enable) {
    this.setState({
      enable
    })
  }
  
  render() {
    const listData = [
     {key: '1. element'},
     {key: '2. element'},
     {key: '3. element'}
    ]
    const swipeBtns = [
    
      {
        component: (
          <Text style={styles.swipeBtns}>Delete</Text>
        ),
        backgroundColor: '#CF4848',
        onPress: console.log('2222')
      },
    ];

    return (
      <View style={styles.container}>

        <FlatList
        
           
          data={Data}
          renderItem={({item}) => 

          <TouchableOpacity style={{flex: 1}}   >

          <View style={styles.card} >
      <Swipeout  
       right={swipeBtns}
       backgroundColor='white'
      
      >

          <View style={styles.badge}>
          </View>
            <View style={styles.inone} >
                <View style={styles.inin} >
                  <Image style={styles.img} source={require('../../../assets/img/Epaisa.png')}/>
                 {/*  <View style={styles.badge}>
                  <TextMontserrat  style={styles.badgeText}>{item.id}</TextMontserrat >
                  </View> */}
                  </View>
                <View style={styles.intwo}>
                  <TextMontserrat style={styles.item}>{item.nom}</TextMontserrat>
                  <View style={styles.des}>
                  <TextMontserrat >{item.des}</TextMontserrat>
                  </View>
                  <TextMontserrat style={styles.date}>{item.key}</TextMontserrat>
                </View>

            </View>
            
            </Swipeout>
        
          </View>

          </TouchableOpacity>

         
        
        }
        />
      </View>
    );
  }
}

const styles = EStyleSheet.create({
  container: {
    width: '100%',
    paddingTop: 0,
  },
  item: {
    color: colors.darkBlue,
    fontSize: 15,
    fontWeight: '600',
    paddingTop:20,
    paddingBottom:10,


  },
  swipeBtns:{
    fontFamily:'Montserrat-SemiBold', 
    fontSize:hp('2.09%'), 
    color:'white', 
    width:"100%", 
    height:'100%', 
    textAlign:'center', 
    textAlignVertical:'center'
},
  date: {
    fontSize: 13,
    height: 30,
    fontWeight:'500',
   
    color: '#FF9B9B9B',
  },
  des: {
    fontSize: 14,
    height: 30,
    fontWeight:'600',
    color: '#888888',
    paddingBottom:12,
    width:hp('40%'),
    height:hp('7%'),

    textAlign:'left',

  },
  price: {
    color: '#52565F',
    fontSize: 18,
    fontWeight:'600',
  },
  badge:{
    position: 'absolute',
    right:hp('0.1%'),
    top:hp('0.1%'),
    width:hp('1.5%'),
    height:hp('1.5%'),
    borderWidth:0,
    backgroundColor:'#42B54D',
    alignItems:'center',
    justifyContent:'center',
    borderRadius: 20,
    paddingHorizontal: hp('0.5'),
  },
  badgeText:{
    color: 'white',
    fontSize:9,
    fontWeight:'600',

  },
  imgBadge:{
    width:hp('2%'),
    height:hp('2%'),

  },
  card: {
    flexDirection: 'row',

    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth:0.2,
    borderRadius: 2,
    borderColor: '#ddd',
    paddingRight:18.48,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.8,
    shadowRadius: 2,  
    elevation: 2,
    marginTop:16,
    backgroundColor:'white',

  },
  inone: {
    marginLeft:30,

    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',

  },
  inin: {
    marginRight:20
   },
  img: {
   width:hp('10%'),
   height:hp('10%'),

  },
  intwo: {

    paddingLeft:0,
  },
  inthree: {
    paddingVertical:23,

  },
 
});
