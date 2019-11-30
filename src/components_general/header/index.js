import React, {Component} from 'react';
import { View, Text } from 'react-native';
import * as stylesPortrait from './styles/portrait';
import * as stylesLandscape from './styles/landscape';

class Header extends Component {
  constructor(props) {
    super(props)
  }

  renderOptions = (arrayOptions) => {
    return (
      <View 
        style={{
          flexDirection: 'row',
        }}
      >
        {
          arrayOptions.map(item => {
            return (
              <View style={{backgroundColor: 'green'}}><Text>{item}</Text></View>
            )
          })
        }
      </View>
    )
  }
  
  render() {
    const {
      leftOptions,
      rightOptions,
      label,
      orientation,
    } = this.props;

    const styles = orientation == 'portrait' ? stylesPortrait : stylesLandscape;

    return (
      <View style={styles.styles.container}>
        {this.renderOptions(leftOptions)}
        <Text style={styles.styles.labelCentral}>{label}</Text>
        {this.renderOptions(rightOptions)}
      </View>
    )
  }
}

export default Header;