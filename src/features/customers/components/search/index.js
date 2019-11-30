import React, { Component } from 'react';
import { View, TextInput, Dimensions, Image } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import * as stylesPortrait from './styles/portrait';
import * as stylesLandscape from './styles/landscape';
import { BoxShadow } from 'react-native-shadow';

const isPortrait = () => {
  const dim = Dimensions.get('window');
  if (dim.height >= dim.width) {
    return true;
  } else {
    return false;
  }
};

class SearchInput extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isPortrait: isPortrait(),
      items: [],
      value: '',
    };
  }

  _changeText = v => {
    this.setState({ value: v });
    if (this.props.onChangeText) {
      this.props.onChangeText(v);
    }
  };

  render() {
    const styles = this.state.isPortrait ? stylesPortrait : stylesLandscape;
    return (
      <View style={styles.styles.container}>
        <Image
          source={require('./assets/icons/search.png')}
          style={styles.styles.iconSize}
          resizeMode={'contain'}
        />
        <TextInput
          value={this.state.value}
          onChangeText={v => {
            this._changeText(v);
            // if (this.props.filtering) {
            //   this.props.filtering(v);
            // }
          }}
          onSubmitEditing={null}
          placeholder={'Search'}
          placeholderTextColor={'rgba(15,25,91,0.3)'}
          style={styles.styles.input}
          underlineColorAndroid={'transparent'}
          autoCapitalize={'none'}
          autoCorrect={false}
        />
      </View>
    );
  }
}

export default SearchInput;
