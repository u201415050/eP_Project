import React, { Component } from 'react';
import { View, Text, Dimensions, Image } from 'react-native';
import { TextMontserrat } from 'components';
import { portraitStyles } from './styles/portrait';
import { landscapeStyles } from './styles/landscape';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

const isPortrait = () => {
  const dim = Dimensions.get('window');
  if (dim.height >= dim.width) {
    return true;
  } else {
    return false;
  }
};

class CustomerDetailsHeader extends Component {
  constructor(props) {
    super(props);

    this.state = {
      orientation: isPortrait(),
    };
  }

  render() {
    const styles = this.state.orientation ? portraitStyles : landscapeStyles;
    //alert(this.props.userCompanyPhoto);
    return (
      <View style={styles.container}>
        <View style={styles.logo}>
          <Image
            source={{ uri: this.props.userCompanyPhoto }}
            style={{ height: '100%', width: '100%', borderRadius: hp('3.6%') }}
            resizeMode="cover"
          />
        </View>
        {this.props.userCompany != undefined &&
          this.props.userCompany != null &&
          this.props.userCompany != '' && (
            <View
              style={styles.companyContainer}
            >
              <TextMontserrat style={styles.companyName}>
                {this.props.userCompany}
              </TextMontserrat>
            </View>
          )}
        <View
          style={styles.customerContainer}
        >
          <TextMontserrat style={styles.customerName}>
            {this.props.userName}
          </TextMontserrat>
        </View>
      </View>
    );
  }
}

export default CustomerDetailsHeader;
