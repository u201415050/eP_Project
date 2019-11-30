import React, { Component } from 'react';
import {StyleSheet, Modal,Text, ScrollView,View,TouchableOpacity,KeyboardAvoidingView} from 'react-native';
import colors from '../../styles/colors';
import { CardWithHeader } from '../cards';
import { TextMontserrat } from 'components';
import { isTablet } from '../../constants/isLandscape';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import LinearGradient from 'react-native-linear-gradient';
import AddCustomerHoldForm from './components/add_customer_hold_form';

class ModalAddHold extends Component {
  state={
        modalInvalid:false
  }
  /*toggleInvalidModal=()=>{
        this.setState({
            modalInvalid:!this.state.modalInvalid
        })
  }*/
  render() {
      const {isModal,closeModal,widthModal,permiss,list_customers,logout,verifyCustomer,fetched}=this.props
      const isLandscape =isTablet
      const content = ()=>{return (<View 
        style={{
          width:'100%',
          flex: 1,
          alignItems:'center',
          justifyContent:'center',
          backgroundColor: colors.opacityDin(0.5)
          }}
        >
          <KeyboardAvoidingView  keyboardVerticalOffset={-hp('10%')} enabled style={{width: '100%',
            height:hp('100%'), alignItems:'center', justifyContent:'center'}} behavior="padding">
          
        <CardWithHeader 
          isLandscape={isLandscape} 
          sizeHeaderLabel={!isLandscape ? wp('4.5%') : hp('3.5%')} 
          onPressCloseButton={this.props.closeModal} 
          customBodyStyle={{alignItems:'center',justifyContent:'center'}} 
          headerTitle="Add Customer" 
          closeButton={true} 
          customHeaderStyle={{height: !isLandscape ? hp('6.9%') : hp('8.4%')}}
          customCardStyle={{width: !isLandscape ? wp('86.9%') : wp('45.8%'), height: !isLandscape ? hp('37.2%') : hp('46.8%'), }}
          >

          <AddCustomerHoldForm 
          fetched={fetched}
            toggleLogout={this.toggleInvalidModal} 
            list_customers={list_customers} 
            permiss={permiss} 
            numberCustomer={this.props.numberAdd} 
            addCustomer={(cust)=>{
              this.props.addCustomer(cust); 
            }}
            verifyCustomer={verifyCustomer}
            />
                    
        </CardWithHeader>
        </KeyboardAvoidingView>
      </View>)}   
      if(isModal){
      return(
        <View style={styles.container2} visible={this.props.active} transparent={true} animationType="fade" onRequestClose={this.props.closeModal} >
          {
            content()
          }
        </View>
      ) 
    }else{
      return(
      <Modal style={styles.container2} visible={this.props.active} transparent={true} animationType="fade" onRequestClose={this.props.closeModal} >
          {
            content()
          }
        </Modal>
        ) 
    }
  } 
}

// define your styles
const styles = StyleSheet.create({
  container:{
      width:'100%',
      backgroundColor: colors.opacityDin(0.6)
  },
  container2: {
    width: '100%',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.opacityDin(0.6),
  },
  wrapper:{
      width: '100%',
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: hp('2.0%'),
      marginBottom: hp('4.0%'),
  },
  textDiscountAddButtonPortrait:{
      color:'white', 
      fontSize: hp('1.95%'), 
      letterSpacing: 1.33,
      textAlign:'center',
      fontWeight:'600'
    },
});

export default ModalAddHold;