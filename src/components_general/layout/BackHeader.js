import React, {Component} from 'react';
import IconMaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {TouchableOpacity} from 'react-native';

export default class BackHeader extends Component {
    size = this.props.size || 50;
    render() {
        return (
            <TouchableOpacity 
            style={[{zIndex: 50, flex: 1, height: this.size, width: this.size,}, this.props.style || {}]} 
            onPress={() => this.props.navigation.goBack()}>
                <IconMaterialCommunityIcons style={{color: 'white'}} size={this.size} name="chevron-left"/>
            </TouchableOpacity>
        )
    }
}