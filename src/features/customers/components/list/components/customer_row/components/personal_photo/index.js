import React, { Component } from 'react';
import { View, Image } from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
class PersonalPhoto extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const styles = this.props.style;
    const { photo } = this.props;
    return (
      <View style={[styles, { overflow: 'hidden' }]}>
        <Image
          // source={require('./../../../../../../assets/user_placeholder.jpg')}
          // source={require('./../../../../../../assets/user_placeholder_512.png')}
          source={
            photo != ''
              ? {
                  uri:
                    photo.indexOf('png') != -1
                      ? photo.substr(0, photo.indexOf('png') + 4)
                      : photo,
                }
              : require('./../../../../../../assets/user_blue.png')
          }
          style={[styles, { marginHorizontal: 0 }]}
          resizeMode={'cover'}
        />
      </View>
    );
  }
}

export default PersonalPhoto;
