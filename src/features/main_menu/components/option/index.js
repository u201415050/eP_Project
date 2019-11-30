import React, {Component} from 'react';
import { View, TouchableOpacity, Image, Dimensions, Linking } from 'react-native';
import { TextMontserrat } from 'components';
import { portraitStyles } from './styles/portrait';
import { landscapeStyles } from './styles/landscape';
import realm from '../../../../services/realm_service';
import alert_service from '../../../../services/alert_service';

const isPortrait = () => {
  const dim = Dimensions.get('window');
  if (dim.height >= dim.width) {
    return true;
  } else {
    return false;
  }
};

class Option extends Component {
  constructor(props) {
    super(props)
    
    this.state={
      orientation: isPortrait(),
    }
  }
  
  render() {
    const styles = this.state.orientation ? portraitStyles : landscapeStyles;
    const actionOnPress = this.props.enabled == '1' ? ()=>{this.props.navigate(this.props.item.navigateTo)} : () => {
      let userData = realm.objectForPrimaryKey('User', 0);
            
      alert_service.showAlert(`Hey ${userData.userFirstName}, would you like to know\nmore about ${this.props.label} by ePaisa?\nWe are just a call away!`,()=>{
        
        Linking.openURL(`tel:+919810001234`)
      },'CALL',null, true)
    };
    const position = this.props.position.split('-');
    var auxiliaryContainerStyle = {}//{borderLeftWidth: 0, borderRightWidth: 0};

    if (this.props.lastRow) {
      auxiliaryContainerStyle = {...auxiliaryContainerStyle, borderBottomWidth:0};
    }

    if(this.props.lastItem) {
      auxiliaryContainerStyle = {...auxiliaryContainerStyle, borderRightWidth:0};
    }

    if(this.props.label == ''){
      auxiliaryContainerStyle = {...auxiliaryContainerStyle, borderRightWidth:0};
    }
    

    return (
      <TouchableOpacity 
        activeOpacity={this.props.enabled == '1' ? 0.5 : 1}
        onPress={actionOnPress}
        style={[styles.container, auxiliaryContainerStyle]}
        >
        <Image
          source={this.props.icon}
          style={styles.icon}
          resizeMode={'contain'}
          />
        <TextMontserrat
          style={styles.label}
          >
        {this.props.label}
        </TextMontserrat>
      </TouchableOpacity>
    )
  }
}

export default Option;