import React from 'react';
import {View, Image, Dimensions, Text} from 'react-native';
import TextMontserrat from '../../texts/textMontserrat';
import LogoSrc from './assets/ep_logo.png';
import EStyleSheet from 'react-native-extended-stylesheet';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import { isTablet } from 'components';

const isPortrait = () => {
    return !isTablet
};

const styles = EStyleSheet.create({
    container: {
        alignItems: 'center',
    },
    logoPortrait: {
        height: hp('5.8%'),
        marginBottom: hp('2.2%')
    },
    lineStylePortrait: {
        borderColor: '#fff',
        backgroundColor:'#FFF',
        width: wp('11%'),
        height:hp('0.3%')
    },
    textPortrait : {
        marginHorizontal: 15,
        color: 'white', 
        fontWeight: '700',
        fontSize: hp('1.8%'), 
        letterSpacing: wp('0.2%'),
    },

    logoLandscape: {
        height: hp('7.3%'),
        marginBottom: hp('2.5%')
    },
    lineStyleLandscape: {
        borderColor: '#fff',
        backgroundColor:'#FFF',
        width: wp('11%'),
        height:hp('0.3%')
    },
    textLandscape : {
        marginHorizontal: wp('2%'),
        color: 'white', 
        fontWeight: '700',
        fontSize: hp('2.4%'), 
        letterSpacing: wp('0.2%'),
    },
})

export default () => {
    state = {
        orientation : isPortrait()
    }

    const {container, logoPortrait, logoLandscape, lineStylePortrait, lineStyleLandscape, textPortrait, textLandscape} = styles;
    return (
        <View style={container}>
            <Image 
                resizeMode="contain"
                style={this.state.orientation ? logoPortrait: logoLandscape} source={LogoSrc}/>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <View style={this.state.orientation ? lineStylePortrait : lineStyleLandscape}/>
                <TextMontserrat style={this.state.orientation ? textPortrait : textLandscape}>LEARN MORE</TextMontserrat>
                <View style={this.state.orientation ? lineStylePortrait : lineStyleLandscape}/>
            </View>
        </View>
    )
}