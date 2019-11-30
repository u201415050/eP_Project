import React, {Component} from 'react';
import { View } from 'react-native';
import { PopUp, TextMontserrat, ButtonGradient } from 'components';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';

class Alert extends Component {
    render() {

        const {style, message, buttonTitle, onPress} = this.props;

        const alertContainer = {  
            justifyContent: 'center', 
            alignItems: 'center',    
            ...style
        }

        const messageContainer = {
            height:'50%', 
            width:'100%', 
            justifyContent:'flex-end', 
            alignItems:'center', 
            paddingBottom:hp('0.55%')
        }

        const buttonContainer = {
            height:'50%', 
            width:'100%', 
            justifyContent:'flex-end', 
            alignItems:'center', 
            paddingBottom:hp('1.1%')
        }

        const textStyle = {
            fontSize: hp('2.4%'),
            textAlign: 'center',
            fontWeight: '700',
            //color:'#47525D',
            color:'#4e5965',
            width: '100%',
        }

        const buttonStyle = {
            width:wp('50%'), 
            height:hp('6.25%')
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
                    <ButtonGradient title={buttonTitle} onPress={onPress} style={buttonStyle} />
                </View>
            </PopUp>
        )
    }
}

export {Alert}