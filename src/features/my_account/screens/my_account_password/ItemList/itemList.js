import React, { Component } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity,ScrollView } from 'react-native';

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';


import Orientation from 'react-native-orientation-locker';
import { TextMontserrat,FloatingTextInput,PhoneInput } from 'components';
import colors from '../../../styles/colors';
import { isTablet } from '../../../../cash_register/constants/isLandscape';

class ItemList extends Component {
  

  componentWillMount() {
    !isTablet ? Orientation.lockToPortrait() : Orientation.lockToLandscape();
  }
  render() {
    const type_active={
      ['In - App']: require('../../../assets/img/app.png'),
      ['Email']: require('../../../assets/img/e-mail.png'),
      ['SMS']: require('../../../assets/img/sms.png')
    }
    const type_disable={
      ['In - App']: require('../../../assets/img/app_disable.png'),
      ['Email']: require('../../../assets/img/e-mail_disable.png'),
      ['SMS']: require('../../../assets/img/sms_disable.png')
    }
    const renderItem = (type,active)=>{
      return(
        <View style={{alignItems:'center', marginTop:hp('0.5%')}}>
          <Image source={active?type_active[type]:type_disable[type]} style={{width:hp('6.5%'),height:hp('6.5')}}/>
          <TextMontserrat
          style={{fontSize:hp('1.5%'),marginTop:hp('0.1%'),fontWeight:'600'}}
          >{type}</TextMontserrat>
        </View>
      )
    }
    const list = ['In - App','Email','SMS']
    const listActive = [true,true,false]
    const {title, active}=this.props
    const bgImage = !isTablet
      ? require('../../../../../assets/images/bg/loadingBackground.png')
      : require('../../../../../assets/images/bg/loadingBackgroundLandscape.png');
    return (
      <View style={styles.container}>
        <TextMontserrat style={{color:'#174285',marginTop: hp('0.5%'), fontSize:hp('1.7%'),fontWeight: '700',}}>{title}</TextMontserrat>
        <View style={{width:'100%',paddingHorizontal:wp(isTablet?'10%':'2%'),marginTop:hp('1%'), flexDirection:'row', alignItems:'center', justifyContent:'space-between'}}>
            {
              list.map((item,i)=>
                renderItem(item,listActive[i])
              )
            }
        </View>
        
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    paddingHorizontal: wp(isTablet?'2.2%':'5%'),
    height: '17%',
    width: '100%',
    marginTop:hp('1%'),
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
});
export default ItemList;
