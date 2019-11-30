import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, Image, Dimensions, Modal,TouchableOpacity} from 'react-native';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
//import colors from '../../styles/colors'
import EStyleSheet from 'react-native-extended-stylesheet';
import Option from './Option/option';
const listOptions = [
    {label:"Cash Register",icon:require('../../../../../../assets/icons/cash.png'), size:"large"},
    {label:"Customers",icon:"", size:"default"},
    {label:"Notifications",icon:require('../../../../../../assets/icons/notification.png'), size:"large"},
    {label:"Transactions",icon:require('../../../../../../assets/icons/transactions.png'), size:"medium"},
    {label:"Settings",icon:require('../../../../assets/img/Settings.png'), size:"default"},
    {label:"My Account",icon:require('../../../../../../assets/icons/myaccount.png'), size:"medium"},
    {label:"Help",icon:require('../../../../../../assets/icons/help.png'), size:"medium"},
]
export default class ListOptions extends Component{

    render() {
        const {sideOption,handleOption}=this.props
        
        return (
            <View style={styles.container}>
            {
                listOptions.map((item, i)=>{
                    return(<Option key={i} size={item.size} index={i} label={item.label} handleOption={handleOption} active={i==sideOption} icon={item.icon}/>)
                })
            }
                
            </View>
        );
    }
}

const styles = EStyleSheet.create({
    container:{
        flex:1,
        justifyContent:'space-between',
    }
});
