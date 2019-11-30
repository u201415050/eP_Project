import React, {Component} from 'react';
import {View, ActivityIndicator} from 'react-native';
import { PopUp, TextMontserrat } from 'components';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';

class Loading extends Component {
    render() {

        const loadingContainer = {
            height: hp('20%'),
            width: hp('20%'),     
            justifyContent:'center', 
            alignItems:'center'
        }

        const textStyle = {
            textAlign:'center',
            fontWeight:'500',
            width:'100%',
            marginTop:hp('1%')
        }

        return (
            <PopUp animation="fade" style={loadingContainer}>
                <ActivityIndicator size="large" color='#174285' />
                <TextMontserrat style={textStyle}>Loading...</TextMontserrat>
            </PopUp>
        )
    }
}

export {Loading}