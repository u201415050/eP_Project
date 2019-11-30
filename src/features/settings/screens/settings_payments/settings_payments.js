import React, { Component } from 'react';
import { View, Image, StyleSheet, ScrollView, Text } from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import { isTablet } from '../../constants/isLandscape';
import colors from '../../styles/colors';
import Orientation from 'react-native-orientation-locker';
import Header from '../../components/header/header';
import { TextMontserrat } from 'components';
import PaymentIcon from '../../components/icons/payments/payment_icon/payment_icon';
import * as payment_names from '../../components/icons/payments/payment_names';
import realm, { getTable } from '../../../../services/realm_service';
import {
  updateSetting,
  getLocalSettingRow,
} from '../../../../services/settings_service';
import PaymentSettingsHelper from '../../../../services/payment_settings_helper';
//import mixpanel from '../../../../services/mixpanel';
class SettingsDevice extends Component {
  static navigationOptions = ({ navigation }) => ({
    header: (
      <Header isBack={true} label="PAYMENT OPTIONS" navigation={navigation} />
    ),
  });
  constructor() {
    super();
    //mixpanel.track('Payment Options Setting Screen');

    this.payments_list = [];
    this.payments = [];

    this.init();

    const activeOptionsIndex = {};

    this.state = {
      payments: this.payments,
      activeOptionsIndex,
    };
  }

  componentWillMount() {
    !isTablet ? Orientation.lockToPortrait() : Orientation.lockToLandscape();
  }
  componentDidMount() {
    realm.addListener('change', () => {
      this.init();
      this.forceUpdate();
    });
  }
  componentWillUnmount() {
    realm.removeListener('change', () => {});
  }
  init() {
    const s = getLocalSettingRow('Transaction');
    console.log(s);
    const categories_enabled = s.find(
      x => x.settingParamName === 'PaymentCategoriesEnabled'
    );
    const types_enabled = s.find(
      x => x.settingParamName === 'TransactionTypeEnabled'
    );

    const payment_settings = new PaymentSettingsHelper(
      JSON.parse(categories_enabled.value),
      JSON.parse(types_enabled.value)
    );
    const plist = payment_settings.getSectionsForSettings();

    this.payments_list = plist;
  }
  renderButtonColumns = (buttons, isColumn, isCenter) => {
    let columns = [];
    for (let i = 0; i < Math.ceil(buttons.length / 3); i++) {
      columns.push(i);
    }
    //HEREEEE
    // return <Text>{columns.length}</Text>;
    return columns.map(column => {
      const ipr = isTablet ? 6 : 3; //items per row
      return (
        <View
          key={column}
          style={{
            flexDirection: 'row',
            justifyContent: isCenter == 'cell' ? 'center' : 'space-between',
            width: '100%',
            paddingLeft: isCenter == 'tablet' ? wp('5%') : 0,
          }}
        >
          {this.renderButtons(
            buttons.slice(column * ipr, (column + 1) * ipr),
            isColumn
          )}
        </View>
      );
    });
  };
  renderButtons = (buttons, columns) => {
    const ipr = isTablet ? 6 : 3;
    let itemsLeft = 0;
    if (!columns && buttons.length < ipr) {
      itemsLeft = ipr - buttons.length;
    }
    columns = columns
      ? {
          marginBottom: 0,
        }
      : {};
    for (let i = 0; i < itemsLeft; i++) {
      buttons.push({
        label: 'extra',
      });
    }
    //ANOTHER
    return buttons
      .filter(x => x.label !== 'Cash')
      .map((button, i) => {
        // console.log(button.paymentName);
        if (button.label == 'extra') {
          return (
            <View
              style={{ ...styles.buttonContainer, alignItems: 'center' }}
              key={'button_' + i}
            >
              <View>
                {/*<PaymentIcon
                  iconName={'Cash'}
                  size={15}
                  disabled={
                    false
                  }
                  onPress={()=>{})}
                />*/}
              </View>
              <TextMontserrat style={styles.buttonText} />
            </View>
          );
        } else {
          if (!button.paymentName) {
            return <View key={'button_' + i} />;
          }
          return (
            <View
              style={{ ...styles.buttonContainer, alignItems: 'center' }}
              key={'button_' + i}
            >
              <View>
                <PaymentIcon
                  iconName={button.iconName}
                  size={button.buttonSize}
                  disabled={
                    // !this.state.payments[button.pIndex][button.index].value
                    button.disabled

                    // button.disabled
                  }
                  onPress={button.onPress}
                />
              </View>
              <TextMontserrat style={styles.buttonText}>
                {button.label}
              </TextMontserrat>
            </View>
          );
        }
      });
  };
  getTitle = title => {
    switch (title) {
      case 'Cash Payments':
        return 'Cash';
      case 'Emi Payments':
        return 'EMI';
      case 'Upi Payments':
        return 'UPI Payments';
      case 'UPIQR':
        return 'UPI QR';
      default:
        return title;
    }
  };
  getSectionStatus = i => {
    let enabled = 0;
    if (this.payments_list[i].title === 'Cash Payments') {
      console.log({ STATUS: this.state.payments[i][1] });
      return !this.state.payments[i][1].value;
    }
    this.state.payments[i].map(method => {
      if (method.value) {
        enabled++;
      }
    });
    return enabled === 0;
  };
  render() {
    const bgImage = !isTablet
      ? require('../../../../assets/images/bg/loadingBackground.png')
      : require('../../../../assets/images/bg/loadingBackgroundLandscape.png');

    return (
      <View style={styles.container}>
        <Image
          style={{
            position: 'absolute',
            width: '100%',
            height: hp('100%'),
            top: 0,
            left: 0,
            bottom: 0,
            right: 0,
          }}
          resizeMode={!isTablet ? 'stretch' : 'cover'}
          source={bgImage}
        />
        <ScrollView>
          {this.payments_list.map((section, i) => {
            if (section.done) {
              return;
            }
            if (
              section.iconName === 'CashPayments' ||
              section.iconName === 'EMIPayments'
            ) {
              return (
                <View
                  style={{
                    ...styles.section,
                    flexDirection: 'row',
                  }}
                  key={'section_' + i}
                >
                  {[this.payments_list[1], this.payments_list[2]].map(
                    (item, j) => {
                      this.payments_list[1].done = true;
                      this.payments_list[2].done = true;
                      //if (this.getTitle(item.title) == 'Cash') {
                      return (
                        <View
                          style={{
                            flex: 1,
                            borderRightWidth: j == 0 ? 1 : 0,
                            borderColor: '#979797',
                            marginLeft: j == 1 ? 20 : 0,
                            marginBottom: 15,
                          }}
                          key={'section_' + i + '_' + j}
                        >
                          <View
                            style={[
                              styles.sectionHeader,
                              this.getTitle(item.title) === 'EMI'
                                ? { opacity: 0 }
                                : null,
                            ]}
                          >
                            <View style={styles.sectionHeaderIcon}>
                              <PaymentIcon
                                iconName={item.iconName}
                                size={item.buttonSize}
                                disabled={item.disabled}
                                onPress={item.onPress.bind(null, item.id)}
                                section={true}
                              />
                            </View>
                            <View>
                              <TextMontserrat
                                style={{
                                  fontWeight: '800',
                                  fontSize: hp('2.8%'),
                                  color: 'rgba(0,0,0,0.65)',
                                }}
                              >
                                {this.getTitle(item.title)}
                              </TextMontserrat>
                            </View>
                          </View>
                          <View
                            style={{
                              ...styles.buttonsContainer,
                              width: '100%',
                              alignItems: 'center',
                            }}
                          >
                            {this.getTitle(item.title) === 'EMI' ? (
                              <View
                                style={{
                                  alignItems: 'center',
                                }}
                              >
                                <PaymentIcon
                                  iconName={item.iconName}
                                  size={item.buttonSize}
                                  disabled={item.disabled}
                                  onPress={item.onPress.bind(null, item.id)}
                                  section={true}
                                />
                                <TextMontserrat style={styles.buttonText}>
                                  {this.getTitle(item.title)}
                                </TextMontserrat>
                              </View>
                            ) : (
                              this.renderButtonColumns(
                                item.buttons,
                                true,
                                !isTablet ? 'cell' : 'tablet'
                              )
                            )}
                          </View>
                        </View>
                      );
                    }
                    // }
                  )}
                </View>
              );
            }
            return (
              <View style={styles.section} key={'section_' + i}>
                <View style={styles.sectionHeader}>
                  <View style={styles.sectionHeaderIcon}>
                    <View
                      style={{
                        elevation: section.title == 'Other Payments' ? 6 : 0,
                      }}
                    >
                      <PaymentIcon
                        iconName={section.iconName}
                        size={hp('7.5%')}
                        section={true}
                        // disabled={this.getSectionStatus(i)}
                        disabled={section.disabled}
                        onPress={section.onPress.bind(null, section.id)}
                      />
                    </View>
                  </View>
                  <View>
                    <TextMontserrat
                      style={{
                        fontWeight: '800',
                        fontSize: hp('2.8%'),
                        color: 'rgba(0,0,0,0.65)',
                      }}
                    >
                      {this.getTitle(section.title).replace('Payments','').trim()}
                    </TextMontserrat>
                  </View>
                </View>
                <View style={styles.buttonsContainer}>
                  {/* <Text>{JSON.stringify(section.buttons)}</Text> */}
                  {this.renderButtonColumns(section.buttons)}
                </View>
              </View>
            );
          })}
        </ScrollView>
      </View>
    );
  }
}
const buttonSize = isTablet ? hp('7%') : hp('7.5%');
const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: '100%',
    width: '100%',
    backgroundColor: colors.darkWhite,
  },
  section: {
    padding: 20,
    paddingBottom: 0,
    borderBottomWidth: 1,
    borderColor: '#979797',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingBottom: 10,
  },
  sectionHeaderIcon: {
    marginRight: 15,
  },
  buttonsContainer: {
    paddingHorizontal: 0,
    alignItems: 'center',
    width: '100%',
  },
  buttonContainer: {
    width: 70,
    marginBottom: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    marginTop: 5,
    fontWeight: '700',
    fontSize: hp('1.8%'),
    width: buttonSize * 2,
    textAlign: 'center',
  },
});
export default SettingsDevice;
