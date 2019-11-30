import React, {Component} from 'react';
import {Modal, ActivityIndicator, View} from 'react-native';

export default class LoadingModal extends Component {
    render() {
        return (
            <Modal
                onRequestClose={()=>{}}
                animationType="fade"
                transparent={false}
                visible={this.props.visible}
                presentationStyle="overFullScreen"
            >
                <View style={{flex: 1, justifyContent: 'center', alignItems: "center"}}>
                    <ActivityIndicator/>
                </View>
            </Modal>
        )
    }
}