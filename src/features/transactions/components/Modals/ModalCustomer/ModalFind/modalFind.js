
import React, { Component } from 'react';
import {StyleSheet, Modal,Text, View, Image} from 'react-native';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import colors from '../../../../styles/colors';
import { isTablet } from '../../../../constants/isLandscape';
import { CardWithHeader } from '../../../../../../components/cards';

class ModalFind extends Component {
    state ={
        active:false
    }
    render() {
        
        const {widthModal} = this.props
        const isLandscape = isTablet
        return(
            <Modal visible={this.state.active} transparent={true} animationType="fade" onRequestClose={()=>{this.setState({active: false})}}>
                <View style={styles.container}>
                <CardWithHeader isLandscape={isLandscape} sizeHeaderLabel={isLandscape?"3.5%":"3%"} onPressCloseButton={()=>{this.setState({active: false})}} customBodyStyle={{alignItems:'center',justifyContent:'center'}} 
                headerTitle="Customer Information" closeButton={true} customCardStyle={{width: hp(widthModal),}}>
                    <View style={styles.wrapper}>
                        <View style={[styles.fieldBox,{width: (hp(widthModal)-hp('5%'))}]}>
                            <Image source={require('../../../../assets/img/rectangleLarge.png')} style={{width: (hp(widthModal)-hp('5%')), height: hp('6%')}}/>
                        </View>
                    </View>
                </CardWithHeader>
            </View>
            </Modal>
        )
    }
}

// define your styles
const styles = StyleSheet.create({
    container:{
        width:'100%',
        flex: 1,
        alignItems:'center',
        justifyContent:'center',
        backgroundColor: colors.opacityDin(0.6)
    },
    wrapper:{
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: hp('5%')
    },
    fieldBox:{

    }
});

export default ModalFind;
