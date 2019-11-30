import React, {Component} from 'react';
import {View, Image, Text, TouchableWithoutFeedback} from 'react-native';
import {Colors} from 'api';
import Icon from 'react-native-vector-icons/FontAwesome';

export default class CountryItem extends Component {
    renderCheckmark = () => {
        if(this.props.selected) {
            return (
                <View style={{flex: 1, alignItems: 'flex-end', marginRight: 25}}>
                    <Icon name={'check'} size={25} color={Colors.primary} />
                </View>
            )
        }
    }
    render() {
        const {name, callingCode, flag, selected, onPress} = this.props
        return (
            <TouchableWithoutFeedback onPress={onPress}>
                <View style={{
                    flexDirection: 'row',
                    alignItems: 'center'
                }}>
                    <View>
                        <Image source={{uri: flag}} style={{width:30, height:25, marginRight:15, marginVertical:10}}/>
                    </View>
                    <View>
                        <Text style={{
                            fontWeight: 'bold',
                            color: selected ? Colors.primary : '#5d6770',
                            fontSize: 16
                        }}>{name} (+{callingCode})</Text>
                    </View>
                    {this.renderCheckmark()}
                </View>
            </TouchableWithoutFeedback>
        )
    }
}