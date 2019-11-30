import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import ItemsContainer from './itemsContainerStatus';
import { TextMontserrat } from 'components';
import LinearGradient from 'react-native-linear-gradient';

import colors from '../../../saved_transactions/styles/colors';
import { isTablet } from '../../../settings/constants/isLandscape';

const status = isTablet
  ? [
      [
        {
          label: 'Deposited',
          source: require('./assets/new_icons/deposited.png'),
        },
        { label: 'Settled', source: require('./assets/new_icons/settled.png') },
        {
          label: 'Approved',
          source: require('./assets/new_icons/approved.png'),
        },
        { label: 'Pending', source: require('./assets/new_icons/pending.png') },
      ],
      [
        { label: 'Failed', source: require('./assets/new_icons/failed.png') },
        { label: 'Voided', source: require('./assets/new_icons/voided.png') },
        {
          label: 'Refunded',
          source: require('./assets/new_icons/refunded.png'),
        },
        {
          label: 'Cancelled',
          source: require('./assets/new_icons/cancelled.png'),
        },
      ],
    ]
  : [
      [
        {
          label: 'Deposited',
          source: require('./assets/new_icons/deposited.png'),
        },
        { label: 'Settled', source: require('./assets/new_icons/settled.png') },
        {
          label: 'Approved',
          source: require('./assets/new_icons/approved.png'),
        },
        { label: 'Pending', source: require('./assets/new_icons/pending.png') },
        { label: 'Failed', source: require('./assets/new_icons/failed.png') },
      ],
      [
        { label: 'Voided', source: require('./assets/new_icons/voided.png') },
        {
          label: 'Refunded',
          source: require('./assets/new_icons/refunded.png'),
        },
        {
          label: 'Cancelled',
          source: require('./assets/new_icons/cancelled.png'),
        },
        { noDisplay: true },
        { noDisplay: true },
      ],
    ];
export default class TransactionStatus extends Component {
  constructor(props) {
    super(props);
    this.state = {
      listCategories: this.props.filter,
    };
    this.updateData = () => {
      props.addStatusFilter(this.state.listCategories);
    };
  }
  toggleOption = (i, j) => {
    let index = isTablet ? i * 4 + j : i * 5 + j;
    let newContain = this.state.listCategories;
    newContain[index] = !newContain[index];
    this.setState({ listCategories: newContain });
  };
  render() {
    const isLandscape = isTablet;
    return (
      <View
        style={[
          styles.container,
          isLandscape ? { paddingHorizontal: 0 } : null,
        ]}
      >
        <View style={{ paddingLeft: wp(1.8) }}>
          <TextMontserrat style={styles.title}>
            TRANSACTION STATUS
          </TextMontserrat>
        </View>
        <View
          style={[
            {
              width: '100%',
              alignItems: 'center',
              paddingHorizontal: wp('0.1%'),
            },
            isTablet
              ? { paddingHorizontal: wp('1.5%'), marginTop: hp('2%') }
              : null,
          ]}
        >
          {status.map((item2, j) => {
            return (
              <View
                key={j}
                style={[
                  styles.container2,
                  item2.length < (isTablet ? 4 : 5)
                    ? { justifyContent: 'flex-start' }
                    : null,
                ]}
              >
                {item2.map((item, i) => {
                  return (
                    <TouchableOpacity
                      activeOpacity={0.8}
                      onPress={() => {
                        this.toggleOption(j, i);
                      }}
                      key={i}
                      style={{
                        alignItems: 'center',
                        flex: 1,
                        justifyContent: 'center',
                      }}
                    >
                      {item.noDisplay ? null : (
                        <Image
                          source={item.source}
                          style={{
                            borderColor: '#417505',
                            borderRadius: wp(isTablet ? '2.2%' : '5.5%'),
                            borderWidth: this.state.listCategories[
                              isTablet ? j * 4 + i : j * 5 + i
                            ]
                              ? 3
                              : 0,
                            elevation: 2,
                            width: wp(isTablet ? '4.4%' : '11%'),
                            height: wp(isTablet ? '4.4%' : '11%'),
                          }}
                        />
                      )}
                      {item.noDisplay ? null : (
                        <TextMontserrat
                          style={{
                            fontSize: isTablet ? hp('1.9%') : wp('2.4%'),
                            color: 'rgba(0,0,0,0.6)',
                            textAlign: 'center',
                            fontWeight: '900',
                          }}
                        >
                          {item.label}
                        </TextMontserrat>
                      )}
                    </TouchableOpacity>
                  );
                })}
              </View>
            );
          })}
        </View>
      </View>
    );
  }
}

const styles = EStyleSheet.create({
  container: {
    marginTop: 20,
    width: '100%',
    borderBottomWidth: 0.9,
    borderBottomColor: '#efefef',
    paddingBottom: 10,
  },
  title: {
    color: colors.slateGray,
    fontSize: hp('1.8%'),
    fontWeight: '600',
    letterSpacing: 1.2,
  },
  container2: {
    width: '100%',
    flexDirection: 'row',
    height: isTablet ? hp('13%') : hp('10%'),
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title2: {
    color: colors.white,
    fontSize: 17,
    fontWeight: '700',
    letterSpacing: 2,
  },
});
