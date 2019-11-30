import React, { Component } from 'react';
import {SafeAreaView, View, Text, TouchableOpacity, Dimensions, Image } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import * as stylesPortrait from './styles/portrait';
import * as stylesLandscape from './styles/landscape';
import { BoxShadow } from 'react-native-shadow';
import { connect } from 'react-redux';
import colors from '../../../settings/styles/colors';
import { heightPercentageToDP as hp, widthPercentageToDP as wp} from 'react-native-responsive-screen';

const isPortrait = () => {
  const dim = Dimensions.get('window');
  if (dim.height >= dim.width) {
    return true;
  } else {
    return false;
  }
};

class Header extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isPortrait: isPortrait(),
    };
  }

  buttonLeftAction = () => {
    if (this.props.back) {
      this.props.navigation.goBack();
      if(this.props.refreshParentView){
        this.props.refreshParentView();
      }
    } else {
      this.props.navigation.toggleLeftDrawer();
    }
  };

  renderOptionsCustomerList = label => {
    const styles = this.state.isPortrait ? stylesPortrait : stylesLandscape;

    const openAddModal = this.props.showAddModal;
    let renderRight = true;
    if (this.props.renderRightButton === false) {
      renderRight = false;
    }

    const icon_left = this.props.back
      ? require('./assets/icons/back.png')
      : require('./assets/icons/side_menu.png');
    return (
      
      <View style={styles.styles.container}>
        <TouchableOpacity
          style={styles.styles.iconLeft}
          onPress={this.buttonLeftAction}
        >
          <Image
            source={icon_left}
            style={[
              styles.styles.iconSize,
              this.props.back ? styles.styles.iconSizeBack : {width: hp('4%'), height: hp('3%')},
              
            ]}
            resizeMode={'contain'}
          />
        </TouchableOpacity>
        <Text style={styles.styles.labelCentral}>{label}</Text>
        {renderRight && !this.props.hideRight ? (
          <TouchableOpacity
            style={styles.styles.iconRight}
            onPress={openAddModal}
          >
            <Image
              source={require('./assets/icons/add_customer.png')}
              style={styles.styles.iconSize}
              resizeMode={'contain'}
            />
          </TouchableOpacity>
        ) : (
          <View style={[styles.styles.iconSize, styles.styles.iconRight]} />
        )}
      </View>
    );
  };

  render() {
    const styles = this.state.isPortrait ? stylesPortrait : stylesLandscape;
    const label = this.props.label;

    return (
        <View style={styles.styles.container}>
          {this.renderOptionsCustomerList(label)}
        </View>
    );
  }
}

const mapStateToProps = state => ({});

const dispatchActionsToProps = dispatch => ({});

export default connect(
  mapStateToProps,
  dispatchActionsToProps
)(Header);
