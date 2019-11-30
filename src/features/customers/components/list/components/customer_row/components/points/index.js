import React, {Component} from 'react';
import { View, Text, Dimensions } from 'react-native';
import { TextMontserrat } from 'components';
import { portraitStyles } from './styles/portrait';
import { landscapeStyles } from './styles/landscape';

const isPortrait = () => {
  const dim = Dimensions.get('window');
  if (dim.height >= dim.width) {
    return true;
  } else {
    return false;
  }
};

class PersonalPoints extends Component{
  constructor(props){
    super(props);

    this.state={
      isPortrait: isPortrait(),
    }
  }

  render() {
    const styles = this.state.isPortrait ? portraitStyles : landscapeStyles;
    const points = this.props.points;

    return(
      <View style={styles.container}>
        <TextMontserrat style={styles.pointsNumber}>{points}</TextMontserrat>
        <TextMontserrat style={styles.label}>Points</TextMontserrat>
      </View>
    )
  }
}

export default PersonalPoints;