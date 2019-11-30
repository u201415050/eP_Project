import React, {Component} from 'react';
import { View } from 'react-native';
import { PopUp, TextMontserrat,  } from 'components';
import { ButtonGradient } from '../buttons';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';

class Alert extends Component {
    render() {

        const {style, message, messageStyle, buttonTitle, buttonStyle, buttonTextStyle, onPress} = this.props;

        const alertContainer = {  
            justifyContent: 'center', 
            alignItems: 'center',  
            paddingTop: hp('4%'),
            paddingBottom: hp('4.5%'),
            ...style
        }

        const messageContainer = {
            //height:'50%', 
            width:'100%', 
            justifyContent:'center', 
            alignItems:'center', 
        }

        const buttonContainer = {
            //height:'50%', 
            width:'100%', 
            justifyContent:'flex-end', 
            alignItems:'center', 
            ...buttonStyle
        }

        const textStyle = {
            fontSize: hp('2.4%'),
            textAlign: 'center',
            fontWeight: '700',
            //color:'#47525D',
            color:'#4e5965',
            width: '100%',
            ...messageStyle
        }

        return (
            <PopUp style={alertContainer}>
                <View style={messageContainer}>
                    {
                        message.map((element, i) => {
                        return <TextMontserrat key={i} style={textStyle}>{element}</TextMontserrat>
                        })
                    }
                </View>
                <View style={buttonContainer}>
                    <ButtonGradient title={buttonTitle} buttonTextStyle={buttonTextStyle} onPress={onPress} style={buttonStyle} />
                </View>
            </PopUp>
        )
    }
}

export {Alert}