import React, {Component} from 'react';
import { View, Text, Dimensions, TouchableOpacity } from 'react-native';
import PersonalPhoto from './components/personal_photo';
import PersonalPoints from './components/points';
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

class CustomerRow extends Component{
  constructor(props){
    super(props);

    this.state={
      isPortrait: isPortrait(),
    }
  }

  render() {
    const styles = this.state.isPortrait ? portraitStyles : landscapeStyles;
    const item = this.props.item;

    return(
      <TouchableOpacity style={styles.container} onPress={()=>{this.props.onSelectedItem(item)}}>
        <PersonalPhoto photo={item.customerImage!=null?item.customerImage:''} style={styles.photoContainer}/>
        <View style={styles.personalInfoContainer}>
          <TextMontserrat style={styles.name}>{item.firstName + ' ' + item.lastName}</TextMontserrat>
          <TextMontserrat style={styles.cardNumber}>{item.phoneNumber}</TextMontserrat>
        </View>
        <PersonalPoints points={/*item.points*/'0'} />
      </TouchableOpacity>
    )
  }
}

export default CustomerRow;