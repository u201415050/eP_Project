import React, {Component} from 'react';
import { View, TouchableWithoutFeedback, Dimensions } from 'react-native';
import * as portraitStyles from './styles/portrait';
import * as landscapeStyles from './styles/landscape';
import { TextMontserrat } from 'components';
import alert_service from 'services/alert_service';

const isPortrait = () => {
  const dim = Dimensions.get('window');
  if (dim.height >= dim.width) {
    return true;
  } else {
    return false;
  }
};

class TabNavigatorDetails extends Component {
  constructor(props) {
    super(props)
    
    this.state={
      isPortrait: isPortrait(),
      focusPersonal: true,
      focusTransactions: false,
    }
  }

  changeViewPersonal = () => {
    this.setState({
      focusPersonal: true,
      focusTransactions: false,
    });
    this.props.onPressPersonal();
  }

  changeViewTransactions = () => {
    if(this.props.isConnected){
      this.setState({
        focusTransactions: true,
        focusPersonal: false,
      });
      this.props.onPressTransactions();
    } else {
      alert_service.showAlert('This feature requires Internet connection');
    }
  }
  
  render() {
    const styles = this.state.isPortrait ? portraitStyles.styles : landscapeStyles.styles;

    return (
      <View style={styles.container}>
        <TouchableWithoutFeedback onPress={()=>{this.changeViewPersonal()}}>
          <View style={[styles.buttonContainer, this.state.focusPersonal ? {borderBottomColor: '#174285'} : {borderBottomColor: '#fff'}]}>
            <TextMontserrat style={styles.buttonTitle}>PERSONAL</TextMontserrat>
          </View>
        </TouchableWithoutFeedback>
        <TouchableWithoutFeedback onPress={()=>{this.changeViewTransactions()}}>
          <View style={[styles.buttonContainer, this.state.focusTransactions ? {borderBottomColor: '#174285'} : {borderBottomColor: '#fff'}]}>
            <TextMontserrat style={styles.buttonTitle}>TRANSACTIONS</TextMontserrat>
          </View>
        </TouchableWithoutFeedback>
      </View>
    )
  }
}

export default TabNavigatorDetails;