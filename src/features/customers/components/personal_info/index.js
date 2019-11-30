import React, { Component } from 'react';
import { View, Text, ScrollView, KeyboardAvoidingView } from 'react-native';
import { styles } from './styles/portrait';
import PersonalCard from './components/card';
import PersonalInfoForm from './components/form';
import { heightPercentageToDP as hp} from 'react-native-responsive-screen';
import { isTablet } from '../../../cash_register/constants/isLandscape';

class PersonalInfo extends Component {
  constructor(props) {
    super(props);

    this.state = {
      customer: this.props.item,
    };
  }

  updateCustomerInfo = info => {
    this.setState({ customer: info });
  };

  render() {
    // const customer = this.props.item;
    const isEditable = this.props.item.otp == null || this.props.item.otp == '';
    const { changeCustomer } = this.props;
    return (
      <KeyboardAvoidingView style={{flex:1}}  behavior="padding"  keyboardVerticalOffset={isTablet?hp('19%'):hp('19%')}>
      <ScrollView
      
        // contentContainerStyle={{width:'100%', height:'100%', backgroundColor: 'red'}}
        scrollEnabled={true}
        keyboardShouldPersistTaps={'handled'}
      >
      
        <View style={[styles.container, { height: '100%' }]}>
          <PersonalCard
            changeCustomer={changeCustomer}
            item={this.state.customer}
          />

          <PersonalInfoForm
            changeCustomer={changeCustomer}
            item={this.state.customer}
            isEditable={isEditable}
            updateCardInfo={this.updateCustomerInfo}
          />
        </View>
      </ScrollView>
      </KeyboardAvoidingView>
    );
  }
}

export default PersonalInfo;
