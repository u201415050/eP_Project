import React, { Component } from 'react';
import {
  View,
  Text,
  ImageBackground,
  Dimensions,
  AsyncStorage,
} from 'react-native';
import { connect } from 'react-redux';
import CustomerDetailsHeader from './components/customer_details';
import TableOptions from './components/table';
import {
  CASH_REGISTER,
  CUSTOMER_LIST,
  DASHBOARD_TOTAL_SALES,
} from '../../navigation/screen_names';
import colors from '../cash_register/styles/colors';
import { SafeAreaView } from 'components';
const isPortrait = () => {
  const dim = Dimensions.get('window');
  if (dim.height >= dim.width) {
    return true;
  } else {
    return false;
  }
};

class MainMenu extends Component {
  constructor(props) {
    super(props);

    this.state = {
      orientation: isPortrait(),
    };
  }

  optionsBuilder = () => {
    return [
      {
        label: 'Quick Payment',
        logo: require('./assets/icons/payment_e.png'),
        navigateTo: CASH_REGISTER,
        // navigateTo: null,
        enabled: 1,
      },
      {
        label: 'Billing',
        logo: require('./assets/icons/billing_d.png'),
        navigateTo: null,
        enabled: 0,
      },
      {
        label: 'Inventory Management',
        logo: require('./assets/icons/inventory_d.png'),
        navigateTo: null,
        enabled: 0,
      },
      {
        label: 'Loyalty',
        logo: require('./assets/icons/loyalty_d.png'),
        navigateTo: null,
        enabled: 0,
      },
      {
        label: 'Customers',
        logo: require('./assets/icons/customer_e.png'),
        navigateTo: CUSTOMER_LIST,
        // navigateTo: null,
        enabled: 1,
      },
      {
        label: 'VAS',
        logo: require('./assets/icons/vas_d.png'),
        navigateTo: null,
        enabled: 0,
      },
      {
        label: 'Analytics',
        logo: require('./assets/icons/analytics_e.png'),
        navigateTo: DASHBOARD_TOTAL_SALES,
        // navigateTo: null,
        enabled: 1,
      },
    ];
  };

  navigateTo = screen => {
    this.props.navigation.navigate(screen);
  };

  render() {
    const image = this.state.orientation
      ? require('./assets/background/background_portrait.png')
      : require('./assets/background/background_landscape.png');

    const { user, config } = this.props;

    const userName =
      user.userFirstName +
      (user.userLastName != undefined &&
      user.userLastName != null &&
      user.userLastName != ''
        ? ' ' + user.userLastName
        : '');

    const merchant = config;

    const companyName =
      merchant != null && merchant != undefined
        ? merchant.merchantCompanyName != null &&
          merchant.merchantCompanyName != undefined &&
          merchant.merchantCompanyName != ''
          ? merchant.merchantCompanyName
          : ''
        : '';

    const companyPhoto =
      merchant != null && merchant != undefined
        ? merchant.merchantCompanyImage != null &&
          merchant.merchantCompanyImage != ''
          ? merchant.merchantCompanyImage.indexOf('png') != -1
            ? merchant.merchantCompanyImage.substr(
                0,
                merchant.merchantCompanyImage.indexOf('png') + 3
              )
            : merchant.merchantCompanyImage
          : ''
        : '';

    return (
      <SafeAreaView
        fullscreen={true}
        color={colors.darkWhite}
        bottomColor={colors.darkWhite}
      >
        <View style={{ flex: 1 }}>
          <ImageBackground
            source={image}
            style={{ flex: 1, backgroundColor: '#F5F5F5' }}
            resizeMode={'cover'}
          >
            <CustomerDetailsHeader
              userName={userName}
              userCompanyPhoto={companyPhoto}
              userCompany={companyName}
            />
            <TableOptions
              options={this.optionsBuilder()}
              navigate={this.navigateTo.bind(this)}
            />
          </ImageBackground>
        </View>
      </SafeAreaView>
    );
  }
}

const mapStateToProps = state => {
  return {
    user: state.auth.user,
    config:
      state.cashData.personalConfig != null
        ? state.cashData.personalConfig.merchant
        : null,
  };
};

const mapDispatchToProps = dispatch => ({});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MainMenu);
