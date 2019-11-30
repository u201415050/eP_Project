
import React, { Component } from 'react';
import {StyleSheet, Modal,Text} from 'react-native';
import colors from '../../../../styles/colors';

class ModalAdd extends Component {
    
    render() {
        
        return(
            <Modal visible={true} transparent={true} animationType="fade"  >
                <Text>Add</Text>
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
    
});

export default ModalAdd;
