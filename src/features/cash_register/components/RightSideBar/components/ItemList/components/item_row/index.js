import React, { Component } from 'react';
import { View, Dimensions } from 'react-native';
import { formatNumberCommasDecimal } from 'api';
import { TextMontserrat } from 'components';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { styles } from './styles';
import { isTablet } from '../../../../../../constants/isLandscape';

const isPortrait = () => {
  const dim = Dimensions.get('window');
  if (dim.height >= dim.width) {
    return true;
  } else {
    return false;
  }
};

class ItemRow extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isPortrait: isPortrait(),
    };
  }

  render() {
    return (
      <View
        style={{
          width: '100%',
          flexDirection: 'row',
          marginTop: hp('0.5%'),
        }}
      >
        <View style={{ width: '15%' }}>
          <TextMontserrat
            style={{ ...styles, textAlign: 'center' }}
            numberOfLines={1}
          >
            {this.props.index}
          </TextMontserrat>
        </View>
        <View style={{ width: '38%' }}>
          <TextMontserrat style={styles}>{this.props.item.name}</TextMontserrat>
        </View>
        <View style={{ width: '15%' }}>
          <TextMontserrat
            style={{ ...styles, textAlign: 'center' }}
            numberOfLines={1}
          >
            {this.props.item.quantity}
          </TextMontserrat>
        </View>
        <View
          style={{
            width: '32%',
            paddingRight: !isTablet ? wp('4%') : wp('1.5%'),
          }}
        >
          <TextMontserrat
            style={{
              ...styles,
              textAlign: 'right',
              color: '#174285',
              fontWeight: '600',
            }}
            numberOfLines={1}
          >
            {'₹ '}
            {formatNumberCommasDecimal(
              parseFloat(
                this.props.item.quantity * this.props.item.unitPrice
              ).toFixed(2)
            )}
          </TextMontserrat>
        </View>
      </View>
    );
  }
}

export default ItemRow;
